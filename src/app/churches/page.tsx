import { prisma } from "@/lib/db";
import Link from "next/link";
import { Church } from "@prisma/client";

const PAGE_SIZE = 50;

const STATUS_COLORS: Record<string, string> = {
  COUNCIL: "bg-purple-100 text-purple-700",
  ENGAGED: "bg-sage/10 text-sage-dark",
  AWARE: "bg-blue-100 text-blue-700",
  POTENTIAL: "bg-amber-100 text-amber-700",
  LOW_POTENTIAL: "bg-stone-100 text-stone-500",
  OPPOSED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  COUNCIL: "Council",
  ENGAGED: "Engaged",
  AWARE: "Aware",
  POTENTIAL: "Potential",
  LOW_POTENTIAL: "Low Potential",
  OPPOSED: "Opposed",
};

interface SearchParams {
  q?: string;
  state?: string;
  denomination?: string;
  status?: string;
  page?: string;
}

async function getChurches(params: SearchParams) {
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const skip = (page - 1) * PAGE_SIZE;

  const where: Record<string, unknown> = {};
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { city: { contains: params.q, mode: "insensitive" } },
      { pastorName: { contains: params.q, mode: "insensitive" } },
      { denomination: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.state) where.state = params.state;
  if (params.denomination) where.denomination = { contains: params.denomination, mode: "insensitive" };
  if (params.status) where.status = params.status;

  const [churches, total] = await Promise.all([
    prisma.church.findMany({ where, orderBy: { name: "asc" }, skip, take: PAGE_SIZE }),
    prisma.church.count({ where }),
  ]);

  return { churches, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

async function getFilterOptions() {
  const [states, denominations] = await Promise.all([
    prisma.church.findMany({ select: { state: true }, distinct: ["state"], where: { state: { not: null } }, orderBy: { state: "asc" } }),
    prisma.church.findMany({ select: { denomination: true }, distinct: ["denomination"], where: { denomination: { not: null } }, orderBy: { denomination: "asc" } }),
  ]);
  return { states: states.map((s) => s.state!), denominations: denominations.map((d) => d.denomination!) };
}

function buildUrl(params: SearchParams, overrides: Partial<SearchParams>) {
  const merged = { ...params, ...overrides };
  const qs = new URLSearchParams();
  if (merged.q) qs.set("q", merged.q);
  if (merged.state) qs.set("state", merged.state);
  if (merged.denomination) qs.set("denomination", merged.denomination);
  if (merged.status) qs.set("status", merged.status);
  if (merged.page && merged.page !== "1") qs.set("page", merged.page);
  const str = qs.toString();
  return `/churches${str ? `?${str}` : ""}`;
}

export default async function ChurchesPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ churches, total, page, totalPages }, filters] = await Promise.all([
    getChurches(searchParams),
    getFilterOptions(),
  ]);

  const hasFilters = !!(searchParams.q || searchParams.state || searchParams.denomination || searchParams.status);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Churches</h1>
          <p className="text-stone-400 text-sm mt-0.5">
            {total.toLocaleString()} church{total !== 1 ? "es" : ""}
            {hasFilters && " matching filters"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/map" className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map
          </Link>
          <Link href="/churches/new" className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Church
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <form method="get" className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-52">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input name="q" defaultValue={searchParams.q} placeholder="Search by name, pastor, city..." className="input pl-9" />
        </div>
        <select name="state" defaultValue={searchParams.state} className="input w-36">
          <option value="">All States</option>
          {filters.states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="denomination" defaultValue={searchParams.denomination} className="input w-48">
          <option value="">All Denominations</option>
          {filters.denominations.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select name="status" defaultValue={searchParams.status} className="input w-44">
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button type="submit" className="btn-primary">Search</button>
        {hasFilters && <Link href="/churches" className="btn-secondary">Clear</Link>}
      </form>

      {/* Church list */}
      {churches.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-10 h-10 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-stone-500 font-medium">No churches found</p>
          <p className="text-stone-400 text-sm mt-1">
            {hasFilters ? "Try adjusting your filters" : "Add your first church to get started"}
          </p>
          {!hasFilters && <Link href="/churches/new" className="btn-primary mt-4 inline-block">Add Church</Link>}
        </div>
      ) : (
        <>
          <div className="card divide-y divide-stone-50 overflow-hidden">
            {churches.map((church) => (
              <ChurchRow key={church.id} church={church} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5">
              <p className="text-xs text-stone-400">
                Showing {((page - 1) * PAGE_SIZE + 1).toLocaleString()}–{Math.min(page * PAGE_SIZE, total).toLocaleString()} of {total.toLocaleString()}
              </p>
              <div className="flex gap-1">
                {page > 1 && (
                  <Link href={buildUrl(searchParams, { page: String(page - 1) })} className="btn-secondary px-3 py-1.5 text-xs">
                    ← Prev
                  </Link>
                )}
                <span className="px-3 py-1.5 text-xs text-stone-500 font-medium">
                  {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link href={buildUrl(searchParams, { page: String(page + 1) })} className="btn-secondary px-3 py-1.5 text-xs">
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ChurchRow({ church }: { church: Church }) {
  return (
    <Link
      href={`/churches/${church.id}`}
      className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition-colors group"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-sage/10 transition-colors">
          <svg className="w-4 h-4 text-stone-400 group-hover:text-sage transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-medium text-navy text-sm">{church.name}</p>
          <p className="text-stone-400 text-xs mt-0.5 truncate">
            {[church.city, church.state].filter(Boolean).join(", ")}
            {church.pastorName && ` · ${church.pastorName}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        {church.status && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[church.status] ?? "bg-stone-100 text-stone-500"}`}>
            {STATUS_LABELS[church.status] ?? church.status}
          </span>
        )}
        {church.denomination && (
          <span className="text-xs text-stone-400 hidden lg:block">{church.denomination}</span>
        )}
        <svg className="w-4 h-4 text-stone-300 group-hover:text-sage transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
