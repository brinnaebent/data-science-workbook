"use client";

const STEPS = [
  {
    label: "Extract",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
      connector: "bg-indigo-300",
    },
    tag: "Step 1",
    summary: "Pull data from its sources — no cleaning, just movement.",
    detail: "The source could be a Postgres database, a SaaS API (Salesforce, Stripe, HubSpot), a flat file dropped into S3, or a real-time event stream from Kafka. Extract doesn't transform anything; it just moves data from where it lives to where the pipeline can reach it.",
    signal: "Postgres · APIs · S3 · Kafka",
  },
  {
    label: "Transform",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
      </svg>
    ),
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
      connector: "bg-amber-300",
    },
    tag: "Step 2",
    summary: "Clean, validate, deduplicate, join, reshape. Business logic lives here.",
    detail: 'Convert the messy reality of your sources into a consistent, queryable format. "Orders in euros need to be converted to USD." "Null zip codes get the state\'s default." "Duplicate user records from before the 2022 migration need to be merged." This is where the real engineering work happens.',
    signal: "Clean · Validate · Join · Reshape",
  },
  {
    label: "Load",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
      </svg>
    ),
    color: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
      connector: "bg-emerald-300",
    },
    tag: "Step 3",
    summary: "Write the result into the target — usually a warehouse or feature store.",
    detail: "The load step is often incremental: you append new records rather than rewriting everything. The target could be a data warehouse like Snowflake or BigQuery, a feature store for ML, or a downstream database serving a product.",
    signal: "Snowflake · BigQuery · Feature stores",
  },
];

export default function ETLStepsGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Extract → Transform → Load
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STEPS.map(({ label, icon, color, tag, summary, detail, signal }, i) => (
          <div key={label} className="relative flex flex-col gap-4">
            <div className={`rounded-xl border ${color.border} ${color.bg} p-4 flex flex-col gap-3 h-full`}>
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

              <div className="text-xs text-slate-500 leading-relaxed">
                {detail}
              </div>

              <div className="mt-auto pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Examples</span>
                <div className="text-xs font-medium text-slate-700 mt-0.5">{signal}</div>
              </div>
            </div>

            {i < STEPS.length - 1 && (
              <div className="hidden sm:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10 items-center justify-center w-5 h-5 rounded-full bg-white border border-slate-200 shadow-sm">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">Every data pipeline — from a nightly dashboard refresh to 10 billion sensor events per day — is a version of ETL. The core operations stay the same; the tools change when the scale changes.</p>
      </div>
    </div>
  );
}
