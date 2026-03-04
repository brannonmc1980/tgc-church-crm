export const dynamic = "force-dynamic";

import ChurchForm from "@/components/ChurchForm";
import { prisma } from "@/lib/db";
import Link from "next/link";

async function createChurch(data: FormData) {
  "use server";
  try {
    const church = await prisma.church.create({
      data: {
        name: data.get("name") as string,
        denomination: (data.get("denomination") as string) || null,
        address: (data.get("address") as string) || null,
        city: (data.get("city") as string) || null,
        state: (data.get("state") as string) || null,
        zip: (data.get("zip") as string) || null,
        website: (data.get("website") as string) || null,
        phone: (data.get("phone") as string) || null,
        pastorName: (data.get("pastorName") as string) || null,
        pastorEmail: (data.get("pastorEmail") as string) || null,
        pastorCell: (data.get("pastorCell") as string) || null,
        associatePastorName: (data.get("associatePastorName") as string) || null,
        associatePastorEmail: (data.get("associatePastorEmail") as string) || null,
        associatePastorCell: (data.get("associatePastorCell") as string) || null,
        facebook: (data.get("facebook") as string) || null,
        instagram: (data.get("instagram") as string) || null,
        twitter: (data.get("twitter") as string) || null,
        youtube: (data.get("youtube") as string) || null,
        notes: (data.get("notes") as string) || null,
      },
    });
    return { id: church.id };
  } catch (e) {
    return { error: "Failed to create church. Please try again." };
  }
}

export default function NewChurchPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-stone-400">
        <Link href="/churches" className="hover:text-navy transition-colors">Churches</Link>
        <span>/</span>
        <span className="text-navy">New Church</span>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-navy">Add Church</h1>
        <p className="text-stone-400 text-sm mt-1">Add a new church to your connection directory</p>
      </div>
      <div className="card p-6">
        <ChurchForm onSubmit={createChurch} />
      </div>
    </div>
  );
}
