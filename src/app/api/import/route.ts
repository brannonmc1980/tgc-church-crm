import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { churches } = body as { churches: Record<string, string>[] };

    if (!Array.isArray(churches) || churches.length === 0) {
      return NextResponse.json({ error: "No churches provided" }, { status: 400 });
    }

    const validStatuses = ["COUNCIL", "ENGAGED", "AWARE", "POTENTIAL", "LOW_POTENTIAL", "OPPOSED"];

    const created = await prisma.$transaction(
      churches.map((row) => {
        const rawStatus = (row.status ?? "").toUpperCase().replace(/\s+/g, "_");
        const status = validStatuses.includes(rawStatus) ? rawStatus as "COUNCIL" | "ENGAGED" | "AWARE" | "POTENTIAL" | "LOW_POTENTIAL" | "OPPOSED" : null;
        return prisma.church.create({
          data: {
            name: row.name,
            denomination: row.denomination || null,
            address: row.address || null,
            city: row.city || null,
            state: row.state || null,
            zip: row.zip || null,
            website: row.website || null,
            phone: row.phone || null,
            pastorName: row.pastor_name || row.pastorName || null,
            pastorEmail: row.pastor_email || row.pastorEmail || null,
            pastorCell: row.pastor_cell || row.pastorCell || null,
            associatePastorName: row.associate_pastor_name || row.associatePastorName || null,
            associatePastorEmail: row.associate_pastor_email || row.associatePastorEmail || null,
            associatePastorCell: row.associate_pastor_cell || row.associatePastorCell || null,
            facebook: row.facebook || null,
            instagram: row.instagram || null,
            twitter: row.twitter || null,
            youtube: row.youtube || null,
            notes: row.notes || null,
            status,
          },
        });
      })
    );

    return NextResponse.json({ imported: created.length, ids: created.map((c) => c.id) });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
