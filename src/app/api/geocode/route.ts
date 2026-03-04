import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Uses OpenStreetMap Nominatim (free, no API key required)
// Rate limit: 1 req/sec per Nominatim usage policy
async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=us`;
  const res = await fetch(url, {
    headers: { "User-Agent": "TGC-Church-CRM/1.0 (contact@thegospelcoalition.org)" },
  });
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  return null;
}

// POST /api/geocode — geocode a single church by ID
export async function POST(request: NextRequest) {
  const { id, address } = await request.json();

  try {
    const coords = await geocodeAddress(address);
    if (!coords) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (id) {
      await prisma.church.update({
        where: { id },
        data: { latitude: coords.lat, longitude: coords.lon },
      });
    }

    return NextResponse.json({ latitude: coords.lat, longitude: coords.lon });
  } catch (error) {
    console.error("Geocode error:", error);
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}

// GET /api/geocode?batch=true — geocode all churches missing coordinates
export async function GET(request: NextRequest) {
  const batch = new URL(request.url).searchParams.get("batch") === "true";
  if (!batch) return NextResponse.json({ error: "Use ?batch=true" }, { status: 400 });

  const churches = await prisma.church.findMany({
    where: { latitude: null, NOT: { address: null } },
    select: { id: true, address: true, city: true, state: true, zip: true },
    take: 50, // Process up to 50 at a time to respect Nominatim rate limits
  });

  const results: { id: string; success: boolean }[] = [];

  for (const church of churches) {
    const fullAddress = [church.address, church.city, church.state, church.zip].filter(Boolean).join(", ");
    try {
      const coords = await geocodeAddress(fullAddress);
      if (coords) {
        await prisma.church.update({
          where: { id: church.id },
          data: { latitude: coords.lat, longitude: coords.lon },
        });
        results.push({ id: church.id, success: true });
      } else {
        results.push({ id: church.id, success: false });
      }
      // Respect Nominatim 1 req/sec rate limit
      await new Promise((r) => setTimeout(r, 1100));
    } catch {
      results.push({ id: church.id, success: false });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
