"use client";

import { useState } from "react";

const STEPS = [
  {
    label: "Profile",
    dimension: "Profiling",
    icon: "📊",
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
      dot: "bg-indigo-400",
      ring: "ring-indigo-300",
      bar: "bg-indigo-400",
    },
    action: "Run df.info() and df.describe() on the crop dataset.",
    finding: "Rainfall column has extreme values (0 mm and 3,200 mm in the same region). Soil pH has 23% missing values.",
    response: "Flag rainfall as needing outlier investigation. Prioritize soil pH missingness for the next step.",
  },
  {
    label: "Missingness",
    dimension: "Completeness",
    icon: "🕳️",
    color: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      badge: "bg-violet-100 text-violet-700 border-violet-200",
      dot: "bg-violet-400",
      ring: "ring-violet-300",
      bar: "bg-violet-400",
    },
    action: "Map missing soil pH values against farm geography.",
    finding: "Missing values cluster in two northern provinces — not random. This is MAR (Missing At Random conditioned on region).",
    response: "Impute soil pH conditioned on region median, or exclude those records from models where pH is a key feature.",
  },
  {
    label: "Accuracy",
    dimension: "Accuracy",
    icon: "🔍",
    color: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-400",
      ring: "ring-emerald-300",
      bar: "bg-emerald-400",
    },
    action: "Sample 200 farm records and cross-check crop variety codes against the agricultural extension service.",
    finding: "8% of crop variety codes are wrong — likely data-entry errors at field collection time.",
    response: "Raise a data engineering ticket. Correct codes from the extension service reference table.",
  },
  {
    label: "Consistency",
    dimension: "Consistency",
    icon: "🔀",
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      dot: "bg-amber-400",
      ring: "ring-amber-300",
      bar: "bg-amber-400",
    },
    action: "Inspect the farm location column across all records.",
    finding: "Locations stored inconsistently: some as GPS coordinates, some as postal addresses, some as informal place names.",
    response: "Write a cleaning rule: geocode all non-GPS entries to a standardized lat/lon format.",
  },
  {
    label: "Integrity",
    dimension: "Integrity",
    icon: "🔒",
    color: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      badge: "bg-rose-100 text-rose-700 border-rose-200",
      dot: "bg-rose-400",
      ring: "ring-rose-300",
      bar: "bg-rose-400",
    },
    action: "Assert: farm IDs are unique; crop variety codes exist in the reference table.",
    finding: "14 duplicate farm IDs found. 3 crop variety codes reference deprecated entries.",
    response: "Deduplicate farm records (keep latest). Map deprecated codes to their current equivalents.",
  },
  {
    label: "Lineage",
    dimension: "Lineage & Provenance",
    icon: "🗂️",
    color: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
      dot: "bg-cyan-400",
      ring: "ring-cyan-300",
      bar: "bg-cyan-400",
    },
    action: "Document where each column came from and what transformations were applied.",
    finding: "Three sources: agricultural extension service, weather stations, farmer self-reports. Imputation and geocoding not yet logged.",
    response: "Add a data dictionary entry for each column. Log imputation and geocoding steps in the pipeline metadata.",
  },
  {
    label: "Automate",
    dimension: "Automated Testing",
    icon: "⚙️",
    color: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      badge: "bg-orange-100 text-orange-700 border-orange-200",
      dot: "bg-orange-400",
      ring: "ring-orange-300",
      bar: "bg-orange-400",
    },
    action: "Encode quality rules (uniqueness, value ranges, missingness thresholds) as Great Expectations tests in the CI/CD pipeline.",
    finding: "Pipeline now catches duplicate IDs and out-of-range rainfall values on every data refresh.",
    response: "Quality regressions surface automatically — no manual re-audit needed after each model update.",
  },
  {
    label: "Monitor",
    dimension: "Continuous Monitoring",
    icon: "📡",
    color: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      badge: "bg-pink-100 text-pink-700 border-pink-200",
      dot: "bg-pink-400",
      ring: "ring-pink-300",
      bar: "bg-pink-400",
    },
    action: "Set up dashboards tracking missingness rates, schema drift, and validation pass rates over time.",
    finding: "One month later: soil pH missingness rises from 23% to 41% in the northern region after a field team change.",
    response: "Alert fires. Investigate the new data collection process before the next model training run.",
  },
];

export default function DQAWalkthrough() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set([0]));

  const step = STEPS[active];
  const c = step.color;
  const progress = ((revealed.size) / STEPS.length) * 100;

  function goTo(i: number) {
    setActive(i);
    setRevealed((prev) => new Set([...prev, i]));
  }

  function next() {
    if (active < STEPS.length - 1) goTo(active + 1);
  }

  function prev() {
    if (active > 0) goTo(active - 1);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          DQA Walkthrough — Crop Yield Prediction
        </span>
        <span className="text-xs text-slate-400 font-mono">
          {revealed.size}/{STEPS.length} steps
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-indigo-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step pills */}
      <div className="px-5 pt-4 pb-2 flex flex-wrap gap-2">
        {STEPS.map((s, i) => {
          const isActive = i === active;
          const isDone = revealed.has(i) && i !== active;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                isActive
                  ? `${s.color.bg} ${s.color.border} ${s.color.badge} ring-2 ${s.color.ring}`
                  : isDone
                  ? "bg-slate-100 border-slate-200 text-slate-500"
                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
              }`}
            >
              <span>{i + 1}</span>
              <span>{s.label}</span>
              {isDone && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-slate-400">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Active step card */}
      <div className="p-5">
        <div className={`rounded-lg border ${c.border} ${c.bg} overflow-hidden`}>
          {/* Step title */}
          <div className={`px-4 py-3 border-b ${c.border} flex items-center gap-2`}>
            <span className="text-lg leading-none">{step.icon}</span>
            <div>
              <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${c.badge}`}>
                {step.dimension}
              </span>
            </div>
            <span className="ml-auto text-xs text-slate-400 font-mono">Step {active + 1} of {STEPS.length}</span>
          </div>

          <div className="p-4 space-y-3">
            {/* Action */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`inline-block w-2 h-2 rounded-full ${c.dot}`} />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Action</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed pl-3.5">{step.action}</p>
            </div>

            {/* Finding */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Finding</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-3.5 italic">{step.finding}</p>
            </div>

            {/* Response */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Response</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-3.5">{step.response}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 pb-5 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={active === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Previous
        </button>

        {/* Mini progress dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === active
                  ? `${s.color.dot} scale-125`
                  : revealed.has(i)
                  ? "bg-slate-300"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {active < STEPS.length - 1 ? (
          <button
            onClick={next}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${c.badge} ${c.border} hover:opacity-80`}
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600">
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Complete
          </span>
        )}
      </div>
    </div>
  );
}
