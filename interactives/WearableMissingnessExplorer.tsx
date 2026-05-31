"use client";

import { useState } from "react";

// 28 days of step data. null = device not worn.
const BASE_DATA: (number | null)[] = [
  8200, 7400, 9100, 6800, 7900, 8500, 7200,  // week 1 — normal
  null, null, null, null, 2100, 6900, 7800,   // week 2 — 4-day gap (illness)
  8100, 7600, 9400, 8800, 7300, 8000, 7700,   // week 3 — normal
  7500, 8300, null, null, null, 6200, 7100,   // week 4 — 3-day gap (travel/stress)
];

const WEEK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4"];

const AVG_STEPS = Math.round(
  BASE_DATA.filter((d): d is number => d !== null).reduce((a, b) => a + b, 0) /
    BASE_DATA.filter((d) => d !== null).length
);

function imputedValue(i: number, strategy: "mean" | "flag"): number {
  if (strategy === "mean") return AVG_STEPS;
  // for "flag" strategy we still show a value (mean) but the flag column also appears
  return AVG_STEPS;
}

type Strategy = "raw" | "mean" | "flag";

const STRATEGY_CONFIG: Record<
  Strategy,
  { label: string; description: string; color: string; accentBg: string }
> = {
  raw: {
    label: "Raw data",
    description: "Missing days shown as gaps. No imputation.",
    color: "text-slate-600",
    accentBg: "bg-slate-100 border-slate-200",
  },
  mean: {
    label: "Mean imputation",
    description: `Missing days filled with the user's average (${AVG_STEPS.toLocaleString()} steps). The model sees a flat line — the gap disappears.`,
    color: "text-violet-700",
    accentBg: "bg-violet-50 border-violet-200",
  },
  flag: {
    label: "Binary missing flag",
    description:
      "Missing days still imputed with the mean, but an extra column (device_not_worn) marks the gap. The model can now learn from the gap itself.",
    color: "text-indigo-700",
    accentBg: "bg-indigo-50 border-indigo-200",
  },
};

const MAX_STEPS = 10000;

function Bar({
  value,
  isNull,
  strategy,
  dayIndex,
}: {
  value: number | null;
  isNull: boolean;
  strategy: Strategy;
  dayIndex: number;
}) {
  const gapStart = [7, 22]; // day indices where gaps start (0-based)
  const inGap = BASE_DATA[dayIndex] === null;

  let displayValue: number;
  let barColor: string;
  let opacity = 1;

  if (strategy === "raw") {
    if (isNull) return (
      <div className="flex flex-col items-center gap-0.5 flex-1">
        <div
          className="w-full rounded-t-sm bg-slate-100 border border-dashed border-slate-300"
          style={{ height: 80 }}
        />
        <span className="text-[9px] text-slate-400">—</span>
      </div>
    );
    displayValue = value as number;
    barColor = "bg-indigo-300";
  } else if (strategy === "mean") {
    displayValue = isNull ? AVG_STEPS : (value as number);
    barColor = isNull ? "bg-violet-200" : "bg-indigo-300";
    opacity = isNull ? 0.7 : 1;
  } else {
    // flag
    displayValue = isNull ? AVG_STEPS : (value as number);
    barColor = isNull ? "bg-rose-200" : "bg-indigo-300";
    opacity = isNull ? 0.7 : 1;
  }

  const heightPct = (displayValue / MAX_STEPS) * 80;

  return (
    <div className="flex flex-col items-center gap-0.5 flex-1">
      <div className="flex items-end w-full" style={{ height: 80 }}>
        <div
          className={`w-full rounded-t-sm transition-all duration-200 ${barColor}`}
          style={{ height: heightPct, opacity }}
        />
      </div>
      <span className="text-[9px] text-slate-400 tabular-nums">
        {strategy === "raw" && isNull ? "" : Math.round(displayValue / 1000) + "k"}
      </span>
    </div>
  );
}

function WeekGrid({ strategy }: { strategy: Strategy }) {
  return (
    <div className="space-y-3">
      {WEEK_LABELS.map((weekLabel, wi) => {
        const slice = BASE_DATA.slice(wi * 7, wi * 7 + 7);
        const hasGap = slice.some((d) => d === null);
        const gapLength = slice.filter((d) => d === null).length;
        return (
          <div key={wi}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-500 w-12 shrink-0">{weekLabel}</span>
              {hasGap && strategy !== "raw" && (
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                    strategy === "flag"
                      ? "bg-rose-50 text-rose-600 border-rose-200"
                      : "bg-violet-50 text-violet-600 border-violet-200"
                  }`}
                >
                  {strategy === "flag"
                    ? `device_not_worn: ${gapLength} days`
                    : `${gapLength} days imputed`}
                </span>
              )}
              {hasGap && strategy === "raw" && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {gapLength}-day gap
                </span>
              )}
            </div>
            <div className="flex gap-px">
              {slice.map((val, di) => (
                <Bar
                  key={di}
                  value={val}
                  isNull={val === null}
                  strategy={strategy}
                  dayIndex={wi * 7 + di}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function WearableMissingnessExplorer() {
  const [strategy, setStrategy] = useState<Strategy>("raw");
  const config = STRATEGY_CONFIG[strategy];

  const totalMissing = BASE_DATA.filter((d) => d === null).length;
  const gap1Length = BASE_DATA.slice(7, 14).filter((d) => d === null).length;
  const gap2Length = BASE_DATA.slice(21, 28).filter((d) => d === null).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Wearable Missingness Explorer
        </span>
        <span className="text-xs text-slate-400 font-mono">{totalMissing} missing days</span>
      </div>

      {/* Strategy picker */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          How should we handle the gaps?
        </p>
        <div className="flex gap-2 flex-wrap">
          {(["raw", "mean", "flag"] as Strategy[]).map((s) => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                strategy === s
                  ? s === "raw"
                    ? "bg-slate-100 border-slate-300 text-slate-800 font-medium"
                    : s === "mean"
                    ? "bg-violet-50 border-violet-300 text-violet-800 font-medium"
                    : "bg-indigo-50 border-indigo-300 text-indigo-800 font-medium"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {STRATEGY_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Description callout */}
      <div className={`mx-5 mb-4 mt-2 rounded-lg border px-4 py-2.5 text-xs leading-relaxed ${config.accentBg} ${config.color}`}>
        {config.description}
      </div>

      {/* Chart */}
      <div className="px-5 pb-4">
        <WeekGrid strategy={strategy} />
      </div>

      {/* Insight panel — only shown for flag */}
      {strategy === "flag" && (
        <div className="mx-5 mb-4 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-indigo-800 leading-relaxed space-y-1">
          <p className="font-semibold text-indigo-900">What the model now sees</p>
          <p>
            The step-count column is imputed with the mean — the model still gets a numeric
            value. But the new <span className="font-mono font-semibold">device_not_worn</span> column
            flags those days as <span className="font-mono font-semibold">1</span>, giving
            the model a direct handle on the gap pattern. A {gap1Length}-day and a{" "}
            {gap2Length}-day absence are preserved as signal — not erased.
          </p>
        </div>
      )}

      {/* Insight panel — mean imputation warning */}
      {strategy === "mean" && (
        <div className="mx-5 mb-4 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800 leading-relaxed space-y-1">
          <div className="flex items-start gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500 mt-0.5 shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p>
              Both gaps are now invisible to the model — the bars look like ordinary "average
              days." If those gaps were caused by illness or hospitalization, that predictive
              signal is gone.
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-5 flex-wrap text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-indigo-300 border border-indigo-200" />
          Recorded
        </span>
        {strategy === "mean" && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-violet-200 border border-violet-200" />
            Imputed (mean)
          </span>
        )}
        {strategy === "flag" && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-rose-200 border border-rose-200" />
            Imputed + flagged
          </span>
        )}
        {strategy === "raw" && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-slate-100 border border-dashed border-slate-300" />
            Missing
          </span>
        )}
        <span className="ml-auto font-mono">avg: {AVG_STEPS.toLocaleString()} steps/day</span>
      </div>
    </div>
  );
}
