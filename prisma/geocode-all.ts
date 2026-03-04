import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=us`;
  const res = await fetch(url, {
    headers: { "User-Agent": "TGC-Church-CRM/1.0 (contact@thegospelcoalition.org)" },
  });
  const data: Array<{ lat: string; lon: string }> = await res.json();
  if (data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  return null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const churches = await prisma.church.findMany({
    where: { latitude: null },
    select: { id: true, name: true, address: true, city: true, state: true, zip: true },
  });

  console.log(`\n📍 Geocoding ${churches.length} churches...\n`);

  let success = 0;
  let failed: string[] = [];

  for (const church of churches) {
    const full = [church.address, church.city, church.state, church.zip].filter(Boolean).join(", ");
    if (!full.trim()) {
      console.log(`  ⚠️  No address: ${church.name}`);
      failed.push(church.name);
      continue;
    }

    process.stdout.write(`  ${church.name} (${full}) ... `);
    const coords = await geocode(full);

    if (coords) {
      await prisma.church.update({
        where: { id: church.id },
        data: { latitude: coords.lat, longitude: coords.lon },
      });
      console.log(`✓ ${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`);
      success++;
    } else {
      // Try just city + state as fallback
      const fallback = [church.city, church.state].filter(Boolean).join(", ");
      if (fallback) {
        const coords2 = await geocode(fallback);
        if (coords2) {
          await prisma.church.update({
            where: { id: church.id },
            data: { latitude: coords2.lat, longitude: coords2.lon },
          });
          console.log(`✓ (city fallback) ${coords2.lat.toFixed(4)}, ${coords2.lon.toFixed(4)}`);
          success++;
        } else {
          console.log(`✗ not found`);
          failed.push(church.name);
        }
      } else {
        console.log(`✗ not found`);
        failed.push(church.name);
      }
    }

    await sleep(1100); // Nominatim rate limit: 1 req/sec
  }

  console.log(`\n✅ Done: ${success} geocoded, ${failed.length} failed`);
  if (failed.length > 0) console.log(`  Failed: ${failed.join(", ")}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
