export const dynamic = "force-dynamic";

import ChurchMap from "@/components/ChurchMap";
import { prisma } from "@/lib/db";

export default async function MapPage() {
  const churches = await prisma.church.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      denomination: true,
      pastorName: true,
      website: true,
      latitude: true,
      longitude: true,
      status: true,
    },
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 py-5 border-b border-stone-100 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-navy">Map View</h1>
        <p className="text-stone-400 text-sm mt-0.5">
          {churches.length} churches · {churches.filter((c) => c.latitude && c.longitude).length} with coordinates
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChurchMap churches={churches} />
      </div>
    </div>
  );
}
