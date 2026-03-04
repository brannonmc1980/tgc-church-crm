"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

const STATUS_LABELS: Record<string, string> = {
  COUNCIL: "Council",
  ENGAGED: "Engaged",
  AWARE: "Aware",
  POTENTIAL: "Potential",
  LOW_POTENTIAL: "Low Potential",
  OPPOSED: "Opposed",
};

interface ChurchFiltersProps {
  states: string[];
  denominations: string[];
}

export default function ChurchFilters({ states, denominations }: ChurchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset to page 1 on filter change
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    updateParams("q", value);
  }, 300);

  const hasFilters =
    searchParams.get("q") ||
    searchParams.get("state") ||
    searchParams.get("denomination") ||
    searchParams.get("status");

  return (
    <div className={`flex flex-wrap gap-3 mb-6 ${isPending ? "opacity-60" : ""}`}>
      <div className="relative flex-1 min-w-52">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, pastor, city..."
          className="input pl-9"
        />
      </div>
      <select
        value={searchParams.get("state") ?? ""}
        onChange={(e) => updateParams("state", e.target.value)}
        className="input w-36"
      >
        <option value="">All States</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("denomination") ?? ""}
        onChange={(e) => updateParams("denomination", e.target.value)}
        className="input w-48"
      >
        <option value="">All Denominations</option>
        {denominations.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => updateParams("status", e.target.value)}
        className="input w-44"
      >
        <option value="">All Statuses</option>
        {Object.entries(STATUS_LABELS).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {hasFilters && (
        <button
          onClick={() => {
            startTransition(() => router.push(pathname));
          }}
          className="btn-secondary"
        >
          Clear
        </button>
      )}
    </div>
  );
}
