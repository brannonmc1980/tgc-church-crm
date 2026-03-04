"use server";

import ChurchForm from "@/components/ChurchForm";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function updateChurch(id: string, data: FormData) {
  "use server";
  try {
    await prisma.church.update({
      where: { id },
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
        status: (data.get("status") as string) as "COUNCIL" | "ENGAGED" | "AWARE" | "POTENTIAL" | "LOW_POTENTIAL" | "OPPOSED" | null || null,
      },
    });
    revalidatePath(`/churches/${id}`);
    return { id };
  } catch {
    return { error: "Failed to update church. Please try again." };
  }
}

async function deleteChurch(id: string) {
  "use server";
  await prisma.church.delete({ where: { id } });
  revalidatePath("/churches");
  redirect("/churches");
}

export default async function EditChurchPage({ params }: { params: { id: string } }) {
  const church = await prisma.church.findUnique({ where: { id: params.id } });
  if (!church) notFound();

  const boundUpdate = updateChurch.bind(null, params.id);
  const boundDelete = deleteChurch.bind(null, params.id);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-stone-400">
        <Link href="/churches" className="hover:text-navy">Churches</Link>
        <span>/</span>
        <Link href={`/churches/${church.id}`} className="hover:text-navy truncate max-w-48">{church.name}</Link>
        <span>/</span>
        <span className="text-navy">Edit</span>
      </div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Edit Church</h1>
          <p className="text-stone-400 text-sm mt-1">{church.name}</p>
        </div>
        <form action={boundDelete}>
          <button type="submit"
            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            onClick={(e) => { if (!confirm("Delete this church? This cannot be undone.")) e.preventDefault(); }}>
            Delete
          </button>
        </form>
      </div>
      <div className="card p-6">
        <ChurchForm church={church} onSubmit={boundUpdate} />
      </div>
    </div>
  );
}
