"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import Link from "next/link";
import type { ChurchPin } from "./MapInner";

const MapComponent = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-stone-100">
      <p className="text-stone-400 text-sm">Loading map...</p>
    </div>
  ),
});

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

const PIN_COLORS: Record<string, string> = {
  COUNCIL: "bg-purple-400",
  ENGAGED: "bg-sage",
  AWARE: "bg-blue-400",
  POTENTIAL: "bg-amber-400",
  LOW_POTENTIAL: "bg-stone-400",
  OPPOSED: "bg-red-400",
};

export default function ChurchMap({ churches }: { churches: ChurchPin[] }) {
  const [selected, setSelected] = useState<ChurchPin | null>(null);
  const [selection, setSelection] = useState<ChurchPin[]>([]);
  const [mode, setMode] = useState<"list" | "selection">("list");
  const [clearDrawTrigger, setClearDrawTrigger] = useState(0);

  const withCoords = churches.filter((c) => c.latitude && c.longitude);
  const noCoords = churches.filter((c) => !c.latitude || !c.longitude);

  const handleSelection = useCallback((sel: ChurchPin[]) => {
    setSelection(sel);
    if (sel.length > 0) {
      setMode("selection");
      setSelected(null);
    } else {
      setMode("list");
    }
  }, []);

  function exportSelectionCSV() {
    const headers = ["name", "denomination", "city", "state", "pastorName", "status"];
    const rows = selection.map((c) =>
      headers.map((h) => `"${String((c as Record<string, unknown>)[h] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `church-selection-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full">
      {/* Map */}
      <div className="flex-1 relative">
        <MapComponent
          churches={withCoords}
          onSelect={(c) => { setSelected(c); setMode("list"); }}
          selected={selected}
          onSelection={handleSelection}
          clearDrawTrigger={clearDrawTrigger}
        />

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-lg px-3 py-2.5 text-xs shadow-sm z-[1000]">
          <p className="font-semibold text-stone-500 uppercase tracking-wide mb-2 text-[10px]">Status</p>
          <div className="space-y-1.5">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${PIN_COLORS[key] ?? "bg-sage"}`} />
                <span className="text-stone-600">{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-sage opacity-60" />
              <span className="text-stone-400">No Status</span>
            </div>
          </div>
        </div>

        {/* Draw hint */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-500 z-[1000]">
          <span className="font-medium text-stone-600">Tip:</span> Use the draw tools (top right) to select a region and get a report.
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-72 border-l border-stone-100 flex flex-col bg-white overflow-hidden flex-shrink-0">
        {mode === "selection" && selection.length > 0 ? (
          /* Selection report panel */
          <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-navy">{selection.length} Selected</p>
                <p className="text-xs text-stone-400">From drawn area</p>
              </div>
              <div className="flex gap-3">
                <button onClick={exportSelectionCSV} className="text-xs text-sage hover:text-sage-dark font-medium">
                  Export CSV
                </button>
                <button onClick={() => { setMode("list"); setSelection([]); setClearDrawTrigger((n) => n + 1); }} className="text-xs text-stone-400 hover:text-navy">
                  Clear
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-stone-50">
              {selection.map((church) => (
                <Link key={church.id} href={`/churches/${church.id}`}
                  className="flex items-start justify-between px-4 py-3 hover:bg-stone-50 transition-colors">
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-medium text-navy truncate">{church.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {[church.city, church.state].filter(Boolean).join(", ")}
                    </p>
                    {church.status && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block ${STATUS_COLORS[church.status] ?? "bg-stone-100 text-stone-500"}`}>
                        {STATUS_LABELS[church.status] ?? church.status}
                      </span>
                    )}
                  </div>
                  <svg className="w-3 h-3 text-stone-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ) : selected ? (
          /* Single church detail */
          <div className="p-4">
            <button onClick={() => setSelected(null)} className="text-xs text-stone-400 hover:text-navy mb-3 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All churches
            </button>
            <h2 className="font-semibold text-navy text-sm mb-1">{selected.name}</h2>
            {selected.status && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[selected.status] ?? "bg-stone-100 text-stone-500"}`}>
                {STATUS_LABELS[selected.status] ?? selected.status}
              </span>
            )}
            <div className="mt-3 space-y-2 text-xs">
              {selected.denomination && (
                <p><span className="font-medium text-stone-400 block">Denomination</span>
                  <span className="text-stone-600">{selected.denomination}</span>
                </p>
              )}
              {(selected.city || selected.state) && (
                <p><span className="font-medium text-stone-400 block">Location</span>
                  <span className="text-stone-600">{[selected.address, selected.city, selected.state, selected.zip].filter(Boolean).join(", ")}</span>
                </p>
              )}
              {selected.pastorName && (
                <p><span className="font-medium text-stone-400 block">Lead Pastor</span>
                  <span className="text-stone-600">{selected.pastorName}</span>
                </p>
              )}
              {selected.website && (
                <p><span className="font-medium text-stone-400 block">Website</span>
                  <a href={selected.website} target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">{selected.website}</a>
                </p>
              )}
            </div>
            <Link href={`/churches/${selected.id}`} className="btn-primary mt-4 block text-center text-xs">
              View Full Profile
            </Link>
          </div>
        ) : (
          /* Default list view */
          <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">{withCoords.length} on map</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {withCoords.map((church) => (
                <button key={church.id} onClick={() => setSelected(church)}
                  className="w-full text-left px-4 py-3 border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <p className="text-sm font-medium text-navy truncate">{church.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {[church.city, church.state].filter(Boolean).join(", ")}
                    {church.denomination && ` · ${church.denomination}`}
                  </p>
                </button>
              ))}
              {noCoords.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 border-t">
                    <p className="text-xs text-stone-400 font-medium">{noCoords.length} without coordinates</p>
                  </div>
                  {noCoords.map((church) => (
                    <Link key={church.id} href={`/churches/${church.id}/edit`}
                      className="flex items-center justify-between px-4 py-2.5 border-b border-stone-50 hover:bg-stone-50 transition-colors opacity-50">
                      <div>
                        <p className="text-xs font-medium text-navy truncate">{church.name}</p>
                        <p className="text-xs text-stone-400">Add address to show on map</p>
                      </div>
                      <svg className="w-3 h-3 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
