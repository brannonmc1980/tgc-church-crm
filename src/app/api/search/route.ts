import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getDistance } from "geolib";
import zipcodes from "zipcodes";

const client = new Anthropic();

type ChurchResult = {
  id?: string;
  name: string;
  denomination?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  website?: string | null;
  phone?: string | null;
  pastorName?: string | null;
  pastorEmail?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: string | null;
  _source?: "database" | "web";
  _distance?: number;
};

async function queryDatabase(params: {
  denomination?: string;
  state?: string;
  city?: string;
  zip?: string;
  radiusMiles?: number;
  status?: string;
  nameContains?: string;
  pastorContains?: string;
}): Promise<ChurchResult[]> {
  const where: Record<string, unknown> = {};

  if (params.denomination) where.denomination = { contains: params.denomination, mode: "insensitive" };
  if (params.state) where.state = { equals: params.state, mode: "insensitive" };
  if (params.city) where.city = { contains: params.city, mode: "insensitive" };
  if (params.zip && !params.radiusMiles) where.zip = params.zip;
  if (params.status) where.status = params.status.toUpperCase();
  if (params.nameContains) where.name = { contains: params.nameContains, mode: "insensitive" };
  if (params.pastorContains) {
    where.OR = [
      { pastorName: { contains: params.pastorContains, mode: "insensitive" } },
      { associatePastorName: { contains: params.pastorContains, mode: "insensitive" } },
    ];
  }

  const churches = await prisma.church.findMany({ where });

  // Apply distance filter if zip + radius provided
  if (params.zip && params.radiusMiles) {
    const origin = zipcodes.lookup(params.zip);
    if (origin) {
      const originCoords = { latitude: origin.latitude, longitude: origin.longitude };
      return churches
        .filter((c) => {
          if (!c.zip) return false;
          const dest = zipcodes.lookup(c.zip);
          if (!dest) return false;
          const dist = getDistance(originCoords, { latitude: dest.latitude, longitude: dest.longitude });
          return dist / 1609.344 <= params.radiusMiles!;
        })
        .map((c) => {
          const dest = zipcodes.lookup(c.zip!);
          const dist = dest
            ? getDistance(originCoords, { latitude: dest.latitude, longitude: dest.longitude }) / 1609.344
            : undefined;
          return { ...c, _source: "database" as const, _distance: dist ? Math.round(dist * 10) / 10 : undefined };
        })
        .sort((a, b) => (a._distance ?? 999) - (b._distance ?? 999));
    }
  }

  return churches.map((c) => ({ ...c, _source: "database" as const }));
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

    const tools: Anthropic.Tool[] = [
      {
        name: "query_church_database",
        description: "Search the internal church CRM database with structured filters",
        input_schema: {
          type: "object" as const,
          properties: {
            denomination: { type: "string", description: "Filter by denomination (e.g. 'PCA', 'SBC')" },
            state: { type: "string", description: "Two-letter US state code (e.g. 'SC', 'GA')" },
            city: { type: "string" },
            zip: { type: "string", description: "ZIP code for center of radius search" },
            radiusMiles: { type: "number", description: "Search radius in miles from zip" },
            status: { type: "string", description: "Engagement status: COUNCIL, ENGAGED, AWARE, POTENTIAL, LOW_POTENTIAL, OPPOSED" },
            nameContains: { type: "string", description: "Filter by church name containing this string" },
            pastorContains: { type: "string", description: "Filter by pastor name containing this string" },
          },
        },
      },
      {
        name: "web_search_churches",
        description: "Search the web to find new church information not yet in the database. Returns structured church data that can be reviewed and imported.",
        input_schema: {
          type: "object" as const,
          properties: {
            searchQuery: { type: "string", description: "The search query to use (e.g. 'PCA churches Calvary Presbytery South Carolina directory')" },
            denomination: { type: "string" },
            state: { type: "string" },
            region: { type: "string", description: "Specific region, presbytery, or area name" },
          },
          required: ["searchQuery"],
        },
      },
    ];

    const messages: Anthropic.MessageParam[] = [
      {
        role: "user",
        content: query,
      },
    ];

    const systemPrompt = `You are an AI assistant for TGC (The Gospel Coalition) Church CRM system.
You help users search for churches in the database using natural language, and also discover new churches from the web.

When a user asks to find churches:
1. If they want to search existing records, use query_church_database with appropriate filters
2. If they want to discover new churches not yet in the database, use web_search_churches
3. You can use both tools if needed

For zip code + distance queries (e.g. "within 50 miles of 29615"), extract the zip code and radius in miles.
For denomination queries, use the common abbreviation (PCA, SBC, PCUSA, etc.)
State codes are two-letter (SC for South Carolina, GA for Georgia, etc.)

Engagement status options: COUNCIL, ENGAGED, AWARE, POTENTIAL, LOW_POTENTIAL, OPPOSED

Always be helpful and interpret the user's intent.
When results are returned, write a single brief sentence summarizing what was found (e.g. "Found 12 PCA churches in South Carolina."). Do not list or describe individual churches in your summary — they will be displayed separately in the UI.
Respond in plain text only — no markdown, bullet points, bold, or special characters.`;

    let response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages,
    });

    const toolResults: { tool: string; input: unknown; result: ChurchResult[] | string }[] = [];
    let allChurches: ChurchResult[] = [];
    let summary = "";

    // Agentic loop - handle tool calls
    while (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
      const toolResultContent: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        let result: string;

        if (toolUse.name === "query_church_database") {
          const params = toolUse.input as Parameters<typeof queryDatabase>[0];
          const churches = await queryDatabase(params);
          allChurches = [...allChurches, ...churches];
          result = JSON.stringify(churches.map((c) => ({
            id: c.id,
            name: c.name,
            denomination: c.denomination,
            city: c.city,
            state: c.state,
            zip: c.zip,
            pastorName: c.pastorName,
            status: c.status,
            _distance: c._distance,
          })));
          toolResults.push({ tool: "query_church_database", input: params, result: churches });
        } else if (toolUse.name === "web_search_churches") {
          // Web search returns a note - actual web search requires an external API
          result = JSON.stringify({
            note: "Web search is available when ANTHROPIC_API_KEY is configured with web search access. For now, please use the Import feature to add churches from external sources, or manually add them via Add Church.",
            suggestion: "You can search church directories like the PCA Church Directory (pcaac.org) or SBC's churches.sbc.net and use the Import CSV feature to bulk import.",
          });
          toolResults.push({ tool: "web_search_churches", input: toolUse.input, result: result });
        } else {
          result = JSON.stringify({ error: "Unknown tool" });
        }

        toolResultContent.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: result,
        });
      }

      messages.push({ role: "assistant", content: response.content });
      messages.push({ role: "user", content: toolResultContent });

      response = await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 2048,
        system: systemPrompt,
        tools,
        messages,
      });
    }

    // Get final text response
    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    summary = textBlock?.text ?? "Search complete.";

    return NextResponse.json({
      summary,
      churches: allChurches,
      toolResults,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed. Make sure ANTHROPIC_API_KEY is set." }, { status: 500 });
  }
}
