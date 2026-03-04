"use client";

import { useState } from "react";
import Link from "next/link";

type ChurchResult = {
  id?: string;
  name: string;
  denomination?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  pastorName?: string | null;
  pastorEmail?: string | null;
  status?: string | null;
  _source?: "database" | "web";
  _distance?: number;
};

const EXAMPLE_QUERIES = [
  "Show me all PCA churches in South Carolina",
  "Find SBC churches within 50 miles of 29615",
  "Which churches have a Council status?",
  "Show me all engaged churches in Georgia",
  "Find churches in Greenville, SC",
];

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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ summary: string; churches: ChurchResult[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(q: string = query) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-navy">AI Search</h1>
        <p className="text-stone-400 text-sm mt-1">
          Search your church directory using natural language
        </p>
      </div>

      {/* Search bar */}
      <div className="card p-6 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ask anything... e.g. 'Show me all SBC churches within 100 miles of 29615'"
              className="input pl-12 py-3 text-base"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="btn-primary px-6 py-3 disabled:opacity-50"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "Search"}
          </button>
        </div>

        {/* Example queries */}
        <div className="mt-4">
          <p className="text-xs text-stone-400 mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => { setQuery(q); handleSearch(q); }}
                className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-1.5 rounded-full transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="card p-4 border-red-200 bg-red-50 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-1">Make sure ANTHROPIC_API_KEY is set in your environment variables.</p>
        </div>
      )}

      {loading && (
        <div className="card p-8 text-center">
          <div className="inline-flex items-center gap-3 text-stone-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Searching...</span>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          {/* AI Summary */}
          <div className="card p-5 border-sage/20 bg-sage/5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-sage rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-sm text-navy leading-relaxed whitespace-pre-wrap">{results.summary}</p>
            </div>
          </div>

          {/* Church results */}
          {results.churches.length > 0 && (
            <div>
              <p className="section-header mb-3">{results.churches.length} church{results.churches.length !== 1 ? "es" : ""} found</p>
              <div className="space-y-2">
                {results.churches.map((church, i) => (
                  <div key={church.id ?? i} className="card px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-navy text-sm">{church.name}</p>
                        {church.status && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[church.status] ?? "bg-stone-100 text-stone-500"}`}>
                            {STATUS_LABELS[church.status] ?? church.status}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-400 text-xs">
                        {[church.city, church.state].filter(Boolean).join(", ")}
                        {church.denomination && ` · ${church.denomination}`}
                        {church._distance && ` · ${church._distance} mi away`}
                        {church.pastorName && ` · ${church.pastorName}`}
                      </p>
                    </div>
                    {church.id && (
                      <Link href={`/churches/${church.id}`} className="text-xs text-sage hover:text-sage-dark font-medium flex-shrink-0 ml-4">
                        View →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
