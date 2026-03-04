export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";

async function getStats() {
  const [total, byState, byDenomination] = await Promise.all([
    prisma.church.count(),
    prisma.church.groupBy({ by: ["state"], _count: true, orderBy: { _count: { state: "desc" } }, take: 5 }),
    prisma.church.groupBy({ by: ["denomination"], _count: true, orderBy: { _count: { denomination: "desc" } }, take: 5, where: { denomination: { not: null } } }),
  ]);
  return { total, byState, byDenomination };
}

async function getRecentChurches() {
  return prisma.church.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
}

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([getStats(), getRecentChurches()]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-navy">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Overview of your church connection directory</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="section-header">Total Churches</p>
          <p className="text-4xl font-bold text-navy">{stats.total}</p>
          <p className="text-stone-400 text-xs mt-1">in your directory</p>
        </div>
        <div className="card p-5">
          <p className="section-header">Top States</p>
          <div className="space-y-1.5 mt-1">
            {stats.byState.length === 0 && <p className="text-stone-400 text-sm">No data yet</p>}
            {stats.byState.map((s) => (
              <div key={s.state} className="flex items-center justify-between">
                <span className="text-sm text-navy">{s.state ?? "Unknown"}</span>
                <span className="text-xs font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded-full">
                  {s._count}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <p className="section-header">Top Denominations</p>
          <div className="space-y-1.5 mt-1">
            {stats.byDenomination.length === 0 && <p className="text-stone-400 text-sm">No data yet</p>}
            {stats.byDenomination.map((d) => (
              <div key={d.denomination} className="flex items-center justify-between">
                <span className="text-sm text-navy truncate pr-2">{d.denomination}</span>
                <span className="text-xs font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  {d._count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/churches/new" className="card p-5 hover:border-sage/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sage/10 rounded-lg flex items-center justify-center group-hover:bg-sage/20 transition-colors">
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-navy text-sm">Add Church</p>
              <p className="text-stone-400 text-xs">Manually enter church details</p>
            </div>
          </div>
        </Link>
        <Link href="/import" className="card p-5 hover:border-sage/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sage/10 rounded-lg flex items-center justify-center group-hover:bg-sage/20 transition-colors">
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-navy text-sm">Import CSV</p>
              <p className="text-stone-400 text-xs">Bulk import from spreadsheet</p>
            </div>
          </div>
        </Link>
        <Link href="/search" className="card p-5 hover:border-sage/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sage/10 rounded-lg flex items-center justify-center group-hover:bg-sage/20 transition-colors">
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-navy text-sm">AI Search</p>
              <p className="text-stone-400 text-xs">Natural language search & discover</p>
            </div>
          </div>
        </Link>
        <Link href="/map" className="card p-5 hover:border-sage/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sage/10 rounded-lg flex items-center justify-center group-hover:bg-sage/20 transition-colors">
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-navy text-sm">Map View</p>
              <p className="text-stone-400 text-xs">Visualize churches on a map</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent churches */}
      <div className="card">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-navy text-sm">Recently Added</h2>
          <Link href="/churches" className="text-xs text-sage hover:text-sage-dark font-medium">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-stone-400 text-sm">No churches yet.</p>
            <Link href="/churches/new" className="btn-primary mt-3 inline-block">
              Add your first church
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recent.map((church) => (
              <Link
                key={church.id}
                href={`/churches/${church.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-navy text-sm">{church.name}</p>
                  <p className="text-stone-400 text-xs mt-0.5">
                    {[church.city, church.state].filter(Boolean).join(", ")}
                    {church.denomination && ` · ${church.denomination}`}
                  </p>
                </div>
                <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
