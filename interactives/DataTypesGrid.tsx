"use client";

import { useState } from "react";

const TYPES = [
  {
    label: "Structured",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="9" x2="9" y2="21" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      bgActive: "bg-indigo-100",
      border: "border-indigo-200",
      borderActive: "border-indigo-400",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
      accent: "bg-indigo-500",
    },
    tag: "Easy to query",
    summary: "Rows and columns with a defined schema.",
    detail: "Spreadsheets, CSVs, relational database tables. Every row has the same fields. Schema is enforced upfront, which makes querying, aggregating, and joining straightforward. What most people picture when they hear \"data.\"",
    examples: ["CSV files", "SQL tables", "Excel spreadsheets"],
    storageHint: "Relational DB (Postgres, MySQL)",
  },
  {
    label: "Semi-structured",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    color: {
      bg: "bg-violet-50",
      bgActive: "bg-violet-100",
      border: "border-violet-200",
      borderActive: "border-violet-400",
      icon: "text-violet-500",
      badge: "bg-violet-100 text-violet-700",
      accent: "bg-violet-500",
    },
    tag: "Flexible schema",
    summary: "Has shape, but not a rigid schema.",
    detail: "JSON, XML, log files with predictable keys. Records can have different fields and nested structures. Flexible enough to accommodate variation, structured enough to parse programmatically without treating everything as raw text.",
    examples: ["JSON / XML", "Log files", "API responses"],
    storageHint: "Document DB (MongoDB, Firestore)",
  },
  {
    label: "Unstructured",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    color: {
      bg: "bg-emerald-50",
      bgActive: "bg-emerald-100",
      border: "border-emerald-200",
      borderActive: "border-emerald-400",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
      accent: "bg-emerald-500",
    },
    tag: "No schema",
    summary: "Text, audio, video, images, social posts.",
    detail: "No predefined schema, no obvious column headers. Now the majority of data generated in the world. Increasingly the richest signal for ML models — but requires embedding, indexing, or specialized pipelines before it can be queried meaningfully.",
    examples: ["Images / video", "Raw text", "Audio recordings"],
    storageHint: "Object store + Vector DB",
  },
];

export default function DataTypesGrid() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Three Structural Forms of Data
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TYPES.map(({ label, icon, color, tag, summary, detail, examples, storageHint }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => setActive(isActive ? null : label)}
              className={`rounded-xl border text-left transition-all duration-150 p-4 flex flex-col gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 ${
                isActive
                  ? `${color.bgActive} ${color.borderActive} shadow-sm`
                  : `${color.bg} ${color.border} hover:shadow-sm`
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`${color.icon} mt-0.5`}>{icon}</div>
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${color.badge}`}>
                  {tag}
                </span>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-800 mb-1">{label}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{summary}</div>
              </div>

              {isActive && (
                <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-200/60 pt-3">
                  {detail}
                </div>
              )}

              <div className="mt-auto pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Examples</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {examples.map((ex) => (
                    <span key={ex} className="text-[10px] bg-white/70 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600">
                      {ex}
                    </span>
                  ))}
                </div>
                {isActive && (
                  <div className="mt-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Typical store</span>
                    <div className="text-xs font-medium text-slate-700 mt-0.5">{storageHint}</div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">Click a card to learn more. The type determines what kind of database can hold it — and what kind of pipeline you'll need to make it useful.</p>
      </div>
    </div>
  );
}
