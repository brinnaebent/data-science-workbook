"use client";

import { useState } from "react";

// Static right-skewed dataset (simulating income-like data, values in $k)
const DATA = [
  18, 22, 24, 25, 26, 27, 28, 28, 29, 30,
  31, 32, 32, 33, 34, 35, 35, 36, 37, 38,
  38, 39, 40, 41, 42, 43, 45, 47, 48, 50,
  52, 55, 58, 62, 68, 75, 85, 95, 120, 180,
];

const MIN = Math.min(...DATA);
const MAX = Math.max(...DATA);
const N = DATA.length;

// Compute statistics
const mean = DATA.reduce((a, b) => a + b, 0) / N;
const sorted = [...DATA].sort((a, b) => a - b);
const median = (sorted[N / 2 - 1] + sorted[N / 2]) / 2;
// Mode: most frequent value (or smallest if tie)
const freq: Record<number, number> = {};
for (const v of DATA) freq[v] = (freq[v] ?? 0) + 1;
const mode = parseInt(
  Object.entries(freq).sort((a, b) => b[1] - a[1] || parseInt(a[0]) - parseInt(b[0]))[0][0]
);
const variance = DATA.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (N - 1);
const stddev = Math.sqrt(variance);
const q1 = sorted[Math.floor(N * 0.25)];
const q3 = sorted[Math.floor(N * 0.75)];

// Bins for histogram
const NUM_BINS = 16;
const BIN_WIDTH = (MAX - MIN) / NUM_BINS;
const bins: { start: number; end: number; count: number }[] = Array.from(
  { length: NUM_BINS },
  (_, i) => ({ start: MIN + i * BIN_WIDTH, end: MIN + (i + 1) * BIN_WIDTH, count: 0 })
);
for (const v of DATA) {
  const idx = Math.min(Math.floor((v - MIN) / BIN_WIDTH), NUM_BINS - 1);
  bins[idx].count++;
}
const maxCount = Math.max(...bins.map((b) => b.count));

function xPos(value: number): number {
  return ((value - MIN) / (MAX - MIN)) * 100;
}

type StatKey = "mean" | "median" | "mode" | "stddev" | "iqr" | "range";

const STATS: {
  key: StatKey;
  label: string;
  shortDesc: string;
  color: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
}[] = [
  {
    key: "mean",
    label: "Mean",
    shortDesc: `${mean.toFixed(1)}k — arithmetic average`,
    color: "#f59e0b",
    borderColor: "border-amber-300",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  {
    key: "median",
    label: "Median",
    shortDesc: `${median.toFixed(1)}k — middle value`,
    color: "#6366f1",
    borderColor: "border-indigo-300",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
  },
  {
    key: "mode",
    label: "Mode",
    shortDesc: `${mode}k — most frequent`,
    color: "#10b981",
    borderColor: "border-emerald-300",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  {
    key: "stddev",
    label: "Std Dev (±1σ)",
    shortDesc: `σ = ${stddev.toFixed(1)}k`,
    color: "#ec4899",
    borderColor: "border-pink-300",
    textColor: "text-pink-700",
    bgColor: "bg-pink-50",
  },
  {
    key: "iqr",
    label: "IQR",
    shortDesc: `Q1=${q1}k → Q3=${q3}k`,
    color: "#8b5cf6",
    borderColor: "border-violet-300",
    textColor: "text-violet-700",
    bgColor: "bg-violet-50",
  },
  {
    key: "range",
    label: "Range",
    shortDesc: `${MIN}k → ${MAX}k`,
    color: "#64748b",
    borderColor: "border-slate-300",
    textColor: "text-slate-600",
    bgColor: "bg-slate-50",
  },
];

const DESCRIPTIONS: Record<StatKey, string> = {
  mean: `The mean ($${mean.toFixed(0)}k) is pulled rightward by the handful of high earners. It's higher than the median — a tell-tale sign of right skew. In skewed distributions, mean overstates what's "typical."`,
  median: `The median ($${median.toFixed(0)}k) is the true middle: half the values are below, half above. It ignores the extreme earners entirely, making it more representative of a typical salary in this dataset.`,
  mode: `The mode ($${mode}k) is the single most frequently occurring value. For continuous data like salaries it's less meaningful — here it happens to be the most common entry in our discrete dataset.`,
  stddev: `The standard deviation (σ = $${stddev.toFixed(0)}k) is the average distance from the mean. The shaded band shows ±1σ. Because the distribution is skewed, the band extends far into sparsely-populated high-salary territory.`,
  iqr: `The IQR (Q1=$${q1}k to Q3=$${q3}k) captures the middle 50% of data. Unlike range and standard deviation, it's unaffected by the extreme outliers — which is why box plots use it to define "normal" spread.`,
  range: `The range ($${MIN}k–$${MAX}k) is simply max minus min. At $${MAX - MIN}k, it's dominated entirely by that one $${MAX}k earner. A single outlier can make range useless as a spread measure.`,
};

export default function DescriptiveStatsExplorer() {
  const [active, setActive] = useState<StatKey>("mean");

  const stat = STATS.find((s) => s.key === active)!;
  const CHART_H = 140;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Descriptive Statistics Explorer
        </span>
      </div>

      {/* Stat toggle buttons */}
      <div className="px-5 pt-4 pb-2 flex flex-wrap gap-2">
        {STATS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              active === s.key
                ? `${s.bgColor} ${s.borderColor} ${s.textColor}`
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="px-5 pt-2 pb-1">
        <div className="relative" style={{ height: CHART_H + 28 }}>
          {/* Overlays */}
          <svg
            className="absolute inset-0 w-full pointer-events-none"
            style={{ height: CHART_H + 20 }}
            viewBox={`0 0 100 ${CHART_H + 20}`}
            preserveAspectRatio="none"
          >
            {active === "stddev" && (
              <rect
                x={Math.max(0, xPos(mean - stddev))}
                y={0}
                width={Math.min(100, xPos(mean + stddev)) - Math.max(0, xPos(mean - stddev))}
                height={CHART_H}
                fill="#ec4899"
                fillOpacity={0.12}
              />
            )}
            {active === "iqr" && (
              <rect
                x={xPos(q1)}
                y={0}
                width={xPos(q3) - xPos(q1)}
                height={CHART_H}
                fill="#8b5cf6"
                fillOpacity={0.12}
              />
            )}
            {active === "range" && (
              <rect
                x={xPos(MIN)}
                y={0}
                width={xPos(MAX) - xPos(MIN)}
                height={CHART_H}
                fill="#64748b"
                fillOpacity={0.08}
              />
            )}
          </svg>

          {/* Histogram bars */}
          <div
            className="absolute bottom-7 left-0 right-0 flex items-end gap-px"
            style={{ height: CHART_H }}
          >
            {bins.map((bin, i) => {
              const heightPct = (bin.count / maxCount) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-slate-200 transition-colors"
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>

          {/* Baseline */}
          <div className="absolute left-0 right-0 h-px bg-slate-200" style={{ bottom: 28 }} />

          {/* Axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400 px-0">
            <span>${MIN}k</span>
            <span>Annual income</span>
            <span>${MAX}k</span>
          </div>

          {/* Vertical marker lines */}
          {(active === "mean" || active === "stddev") && (
            <div
              className="absolute bottom-7 w-0.5 transition-all"
              style={{
                left: `${xPos(mean)}%`,
                top: 0,
                backgroundColor: stat.color,
              }}
            >
              <div
                className="absolute -top-5 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap"
                style={{ color: stat.color }}
              >
                mean
              </div>
            </div>
          )}
          {(active === "median") && (
            <div
              className="absolute bottom-7 w-0.5 transition-all"
              style={{
                left: `${xPos(median)}%`,
                top: 0,
                backgroundColor: stat.color,
              }}
            >
              <div
                className="absolute -top-5 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap"
                style={{ color: stat.color }}
              >
                median
              </div>
            </div>
          )}
          {active === "mode" && (
            <div
              className="absolute bottom-7 w-0.5 transition-all"
              style={{
                left: `${xPos(mode)}%`,
                top: 0,
                backgroundColor: stat.color,
              }}
            >
              <div
                className="absolute -top-5 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap"
                style={{ color: stat.color }}
              >
                mode
              </div>
            </div>
          )}
          {active === "stddev" && (
            <>
              <div
                className="absolute bottom-7 w-px"
                style={{
                  left: `${xPos(mean - stddev)}%`,
                  top: 0,
                  backgroundColor: stat.color,
                  opacity: 0.5,
                }}
              >
                <div
                  className="absolute -top-5 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap"
                  style={{ color: stat.color }}
                >
                  −1σ
                </div>
              </div>
              <div
                className="absolute bottom-7 w-px"
                style={{
                  left: `${Math.min(xPos(mean + stddev), 100)}%`,
                  top: 0,
                  backgroundColor: stat.color,
                  opacity: 0.5,
                }}
              >
                <div
                  className="absolute -top-5 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap"
                  style={{ color: stat.color }}
                >
                  +1σ
                </div>
              </div>
            </>
          )}
          {active === "iqr" && (
            <>
              <div
                className="absolute bottom-7 w-px"
                style={{ left: `${xPos(q1)}%`, top: 0, backgroundColor: stat.color, opacity: 0.7 }}
              >
                <div
                  className="absolute -top-5 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap"
                  style={{ color: stat.color }}
                >
                  Q1
                </div>
              </div>
              <div
                className="absolute bottom-7 w-px"
                style={{ left: `${xPos(q3)}%`, top: 0, backgroundColor: stat.color, opacity: 0.7 }}
              >
                <div
                  className="absolute -top-5 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap"
                  style={{ color: stat.color }}
                >
                  Q3
                </div>
              </div>
            </>
          )}
          {active === "range" && (
            <>
              <div
                className="absolute bottom-7 w-px"
                style={{ left: `${xPos(MIN)}%`, top: 0, backgroundColor: stat.color, opacity: 0.6 }}
              >
                <div
                  className="absolute -top-5 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap"
                  style={{ color: stat.color }}
                >
                  min
                </div>
              </div>
              <div
                className="absolute bottom-7 w-px"
                style={{ left: `${xPos(MAX)}%`, top: 0, backgroundColor: stat.color, opacity: 0.6 }}
              >
                <div
                  className="absolute -top-5 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap"
                  style={{ color: stat.color }}
                >
                  max
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pb-4">
        <div className={`rounded-lg border px-4 py-3 text-xs text-slate-600 leading-relaxed ${stat.bgColor} ${stat.borderColor}`}>
          <span className={`font-semibold ${stat.textColor}`}>{stat.label}:</span>{" "}
          {DESCRIPTIONS[active]}
        </div>
      </div>

      {/* Footer stats strip */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-3 text-center sm:grid-cols-6">
        {STATS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`transition-opacity ${active === s.key ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
          >
            <div className={`text-sm font-bold ${s.textColor}`}>
              {s.key === "mean" && `$${mean.toFixed(0)}k`}
              {s.key === "median" && `$${median.toFixed(0)}k`}
              {s.key === "mode" && `$${mode}k`}
              {s.key === "stddev" && `$${stddev.toFixed(0)}k`}
              {s.key === "iqr" && `$${q3 - q1}k`}
              {s.key === "range" && `$${MAX - MIN}k`}
            </div>
            <div className="text-[10px] text-slate-400">{s.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
