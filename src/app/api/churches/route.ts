import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const state = searchParams.get("state");
  const denomination = searchParams.get("denomination");
  const status = searchParams.get("status");
  const withCoords = searchParams.get("withCoords") === "true";

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { pastorName: { contains: q, mode: "insensitive" } },
      { denomination: { contains: q, mode: "insensitive" } },
    ];
  }
  if (state) where.state = state;
  if (denomination) where.denomination = { contains: denomination, mode: "insensitive" };
  if (status) where.status = status;
  if (withCoords) {
    where.latitude = { not: null };
    where.longitude = { not: null };
  }

  const churches = await prisma.church.findMany({ where, orderBy: { name: "asc" } });
  return NextResponse.json(churches);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const church = await prisma.church.create({ data: body });
    return NextResponse.json(church, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create church" }, { status: 400 });
  }
}
