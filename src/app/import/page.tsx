"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import Link from "next/link";

type ParsedRow = Record<string, string>;

const REQUIRED_COLS = ["name"];
const OPTIONAL_COLS = [
  "denomination", "address", "city", "state", "zip", "website", "phone",
  "status", "pastor_name", "pastor_email", "pastor_cell",
  "associate_pastor_name", "associate_pastor_email", "associate_pastor_cell",
  "facebook", "instagram", "twitter", "youtube", "notes",
];
const ALL_COLS = [...REQUIRED_COLS, ...OPTIONAL_COLS];

export default function ImportPage() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (parsed) => {
        setHeaders(parsed.meta.fields ?? []);
        setRows(parsed.data);
        setResult(null);
        setError(null);
      },
    });
  }

  async function handleImport() {
    if (rows.length === 0) return;
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ churches: rows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      setResult(data);
      setRows([]);
      setHeaders([]);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  function downloadTemplate() {
    const csv = ALL_COLS.join(",") + "\n" +
      `"Grace Community Church","PCA","123 Main St","Greenville","SC","29601","https://example.com","(864) 555-0100","ENGAGED","Rev. John Smith","pastor@church.com","(864) 555-0101","","","","","","","","Some notes here"`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "church-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-navy">Import Churches</h1>
        <p className="text-stone-400 text-sm mt-1">
          Bulk import churches from a CSV file
        </p>
      </div>

      {result && (
        <div className="card p-4 border-sage/30 bg-sage/5 mb-6 flex items-center justify-between">
          <p className="text-sm text-sage-dark font-medium">
            Successfully imported {result.imported} churches!
          </p>
          <Link href="/churches" className="btn-primary text-xs">View Churches</Link>
        </div>
      )}

      {/* Upload area */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy text-sm">Upload CSV File</h2>
          <button onClick={downloadTemplate} className="btn-ghost text-xs flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Template
          </button>
        </div>

        <label className="block w-full border-2 border-dashed border-stone-200 hover:border-sage/50 rounded-xl p-8 text-center cursor-pointer transition-colors">
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
          <svg className="w-8 h-8 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm font-medium text-navy">Click to upload CSV</p>
          <p className="text-xs text-stone-400 mt-1">or drag and drop</p>
        </label>
      </div>

      {/* CSV Template reference */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-navy text-sm mb-3">Expected Columns</h2>
        <div className="grid grid-cols-3 gap-2">
          {ALL_COLS.map((col) => (
            <div key={col} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${REQUIRED_COLS.includes(col) ? "bg-sage" : "bg-stone-300"}`} />
              <code className="text-xs text-stone-600 font-mono">{col}</code>
              {REQUIRED_COLS.includes(col) && <span className="text-xs text-sage font-medium">required</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-3">
          Status values: <code className="font-mono">COUNCIL</code>, <code className="font-mono">ENGAGED</code>, <code className="font-mono">AWARE</code>, <code className="font-mono">POTENTIAL</code>, <code className="font-mono">LOW_POTENTIAL</code>, <code className="font-mono">OPPOSED</code>
        </p>
      </div>

      {/* Preview */}
      {rows.length > 0 && (
        <div className="card mb-6">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-navy text-sm">Preview</h2>
              <p className="text-xs text-stone-400 mt-0.5">{rows.length} rows ready to import</p>
            </div>
            <button
              onClick={handleImport}
              disabled={importing}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {importing ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
              {importing ? "Importing..." : `Import ${rows.length} Churches`}
            </button>
          </div>
          {error && (
            <div className="px-5 py-3 bg-red-50 border-b border-red-100">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  {headers.map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {rows.slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-stone-50">
                    {headers.map((h) => (
                      <td key={h} className="px-4 py-2.5 text-navy whitespace-nowrap max-w-48 truncate">
                        {row[h] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 10 && (
              <p className="px-5 py-3 text-xs text-stone-400 border-t border-stone-100">
                ... and {rows.length - 10} more rows
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
