"use client";

import { useState } from "react";

type Storage = "lake" | "warehouse";

const ROWS = [
  {
    dimension: "Schema",
    lake: { label: "On read", detail: "Applied when queried — ingest anything now, decide structure later" },
    warehouse: { label: "On write", detail: "Enforced at ingestion — bad data is rejected before it lands" },
  },
  {
    dimension: "Data types",
    lake: { label: "Raw, all types", detail: "Structured, semi-structured, unstructured — JSON, images, logs, CSVs side-by-side" },
    warehouse: { label: "Cleaned, structured", detail: "Normalized, deduplicated, typed — ready for SQL and BI tools" },
  },
  {
    dimension: "Cost",
    lake: { label: "Cheap storage", detail: "Object storage (S3, GCS) runs pennies per GB — great for archiving everything" },
    warehouse: { label: "More expensive", detail: "Compute and storage are optimized for queries, which costs more per byte" },
  },
  {
    dimension: "Best for",
    lake: { label: "ML, exploration, archive", detail: "Training datasets, ad-hoc exploration, raw event logs you might need someday" },
    warehouse: { label: "BI, dashboards, reporting", detail: "Consistent metrics, scheduled queries, executive dashboards — anything that needs a single truth" },
  },
  {
    dimension: "Risk",
    lake: { label: "Becomes a swamp", detail: "Without governance: unlabeled blobs, no lineage, unusable after 2 years" },
    warehouse: { label: "Expensive completeness", detail: "Pressure to store everything leads to ballooning costs — you need discipline about what to ingest" },
  },
];

const EXAMPLES: Record<Storage, { name: string; logo: string }[]> = {
  lake: [
    { name: "AWS S3", logo: "S3" },
    { name: "Azure Data Lake", logo: "ADLS" },
    { name: "GCS", logo: "GCS" },
  ],
  warehouse: [
    { name: "Snowflake", logo: "SF" },
    { name: "BigQuery", logo: "BQ" },
    { name: "Redshift", logo: "RS" },
  ],
};

const LAKE_COLORS = "bg-cyan-50 text-cyan-800 border-cyan-200";
const WAREHOUSE_COLORS = "bg-violet-50 text-violet-800 border-violet-200";
const LAKE_BADGE = "bg-cyan-100 text-cyan-700 border-cyan-200";
const WAREHOUSE_BADGE = "bg-violet-100 text-violet-700 border-violet-200";

export default function LakehouseComparison() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Data Lake vs. Data Warehouse
        </span>
        <span className="text-xs text-slate-400">Click a row to expand</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-slate-100">
        <div className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide" />
        <div className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-center border-l border-slate-100 text-cyan-700`}>
          Data Lake
        </div>
        <div className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-center border-l border-slate-100 text-violet-700`}>
          Data Warehouse
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {ROWS.map((row) => {
          const isOpen = active === row.dimension;
          return (
            <button
              key={row.dimension}
              onClick={() => setActive(isOpen ? null : row.dimension)}
              className="w-full text-left grid grid-cols-[1fr_1fr_1fr] hover:bg-slate-50 transition-colors"
            >
              {/* Dimension */}
              <div className="px-4 py-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">{row.dimension}</span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  className={`text-slate-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {/* Lake cell */}
              <div className="px-4 py-3 border-l border-slate-100">
                <span className={`inline-block px-2 py-0.5 rounded border text-xs font-mono ${LAKE_BADGE}`}>
                  {row.lake.label}
                </span>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed text-left">{row.lake.detail}</p>
                )}
              </div>

              {/* Warehouse cell */}
              <div className="px-4 py-3 border-l border-slate-100">
                <span className={`inline-block px-2 py-0.5 rounded border text-xs font-mono ${WAREHOUSE_BADGE}`}>
                  {row.warehouse.label}
                </span>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed text-left">{row.warehouse.detail}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Examples footer */}
      <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
        {(["lake", "warehouse"] as Storage[]).map((type) => (
          <div key={type}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${type === "lake" ? "text-cyan-700" : "text-violet-700"}`}>
              {type === "lake" ? "Common lakes" : "Common warehouses"}
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES[type].map(({ name, logo }) => (
                <span
                  key={name}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium ${
                    type === "lake" ? LAKE_COLORS : WAREHOUSE_COLORS
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70">{logo}</span>
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
