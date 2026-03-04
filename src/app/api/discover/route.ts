import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";

const client = new Anthropic();

// POST /api/discover — use AI to research and batch-add churches from web sources
// Body: { query: string, denomination?: string, state?: string, presbytery?: string, autoImport?: boolean }
export async function POST(request: NextRequest) {
  try {
    const { query, denomination, state, presbytery, autoImport = false } = await request.json();

    const systemPrompt = `You are a research assistant helping build a church directory for The Gospel Coalition (TGC).
TGC focuses on Reformed/evangelical churches with these priorities:
- Reformed soteriology (Calvinist, sovereign grace)
- Biblical inerrancy
- Complementarian in leadership
- Culturally engaged, not withdrawn
- Denominations: PCA, SBC (conservative/Reformed), ARP, Acts 29, 9Marks, Evangelical Free

When researching churches, find:
- Church name (exact)
- Full address (street, city, state, zip)
- Website URL
- Phone number
- Lead pastor name and email if available
- Denomination
- Any associate/staff pastor info

Return results as a JSON array of church objects with these fields:
name, denomination, address, city, state, zip, website, phone, pastorName, pastorEmail, associatePastorName, notes

Be thorough — search directories, presbytery websites, church websites. The PCA directory is at presbyteryportal.pcanet.org. ARP is at arpc.org. SBC is at churches.sbc.net.`;

    const userMessage = query || `Find all ${denomination ?? ""} churches ${presbytery ? `in the ${presbytery} presbytery` : ""} ${state ? `in ${state}` : ""}. Search official denomination directories and return structured data.`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    if (!textBlock) return NextResponse.json({ error: "No response" }, { status: 500 });

    // Try to extract JSON from the response
    let churches: Record<string, string>[] = [];
    const jsonMatch = textBlock.text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ??
      textBlock.text.match(/\[\s*\{[\s\S]*?\}\s*\]/);

    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] ?? jsonMatch[0];
        churches = JSON.parse(jsonStr);
      } catch {
        // Could not parse JSON
      }
    }

    // Auto-import if requested
    let imported = 0;
    if (autoImport && churches.length > 0) {
      const validStatuses = ["COUNCIL", "ENGAGED", "AWARE", "POTENTIAL", "LOW_POTENTIAL", "OPPOSED"];
      for (const row of churches) {
        try {
          const rawStatus = (row.status ?? "").toUpperCase().replace(/\s+/g, "_");
          const status = validStatuses.includes(rawStatus) ? rawStatus as "COUNCIL" | "ENGAGED" | "AWARE" | "POTENTIAL" | "LOW_POTENTIAL" | "OPPOSED" : null;
          await prisma.church.create({
            data: {
              name: row.name,
              denomination: row.denomination || null,
              address: row.address || null,
              city: row.city || null,
              state: row.state || null,
              zip: row.zip || null,
              website: row.website || null,
              phone: row.phone || null,
              pastorName: row.pastorName || null,
              pastorEmail: row.pastorEmail || null,
              associatePastorName: row.associatePastorName || null,
              notes: row.notes || null,
              status,
            },
          });
          imported++;
        } catch {
          // Skip duplicates or invalid records
        }
      }
    }

    return NextResponse.json({
      summary: textBlock.text,
      churches,
      imported: autoImport ? imported : undefined,
    });
  } catch (error) {
    console.error("Discover error:", error);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
