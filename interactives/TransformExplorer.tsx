"use client";

import { useState, useMemo } from "react";

// Deterministic right-skewed dataset (income-like, log-normal approximation)
// Generated via inverse transform of a log-normal CDF at evenly spaced quantiles
function generateRawData(): number[] {
  const n = 80;
  const data: number[] = [];
  const mu = 10.5; // log-scale mean (~$36k)
  const sigma = 0.9;
  for (let i = 0; i < n; i++) {
    // Halton-like quasi-random in (0,1) then inverse normal CDF approximation
    const p = (i + 0.5) / n;
    const z = normalInvCDF(p);
    data.push(Math.exp(mu + sigma * z));
  }
  return data;
}

// Rational approximation of the normal inverse CDF (Beasley–Springer–Moro)
function normalInvCDF(p: number): number {
  const a = [0, -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
  const b = [0, -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [0, -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0, 7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
           ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
  } else if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q /
           (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
             ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
  }
}

type Transform = "raw" | "minmax" | "zscore" | "log";

function applyTransform(data: number[], t: Transform): number[] {
  if (t === "raw") return data;

  if (t === "minmax") {
    const min = Math.min(...data);
    const max = Math.max(...data);
    return data.map((x) => (x - min) / (max - min));
  }

  if (t === "zscore") {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const std = Math.sqrt(data.reduce((a, b) => a + (b - mean) ** 2, 0) / data.length);
    return data.map((x) => (x - mean) / std);
  }

  if (t === "log") {
    return data.map((x) => Math.log(x + 1));
  }

  return data;
}

function computeStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];
  const std = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const min = sorted[0];
  const max = sorted[n - 1];
  const skew = values.reduce((a, b) => a + ((b - mean) / std) ** 3, 0) / n;
  return { mean, median, std, min, max, skew };
}

function toHistogram(values: number[], numBins = 32): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const bins = new Array(numBins).fill(0);
  for (const v of values) {
    const bin = Math.min(Math.floor(((v - min) / range) * numBins), numBins - 1);
    bins[bin]++;
  }
  return bins;
}

const TRANSFORMS: { id: Transform; label: string; formula: string; description: string }[] = [
  {
    id: "raw",
    label: "Raw",
    formula: "x",
    description: "Original values. Right-skewed income data — a few large values stretch the tail.",
  },
  {
    id: "minmax",
    label: "Min-Max",
    formula: "(x − min) / (max − min)",
    description: "Rescales to [0, 1]. The shape stays the same — but notice how outliers compress everything else into a narrow band near zero.",
  },
  {
    id: "zscore",
    label: "Z-Score",
    formula: "(x − μ) / σ",
    description: "Centers at zero, scales by standard deviation. Still skewed — z-score changes position and spread, not shape.",
  },
  {
    id: "log",
    label: "Log",
    formula: "log(x + 1)",
    description: "Compresses large values, expands small ones. The skew collapses and the distribution becomes roughly symmetric — ideal before linear regression.",
  },
];

const BAR_COLORS: Record<Transform, string> = {
  raw: "bg-rose-300",
  minmax: "bg-violet-300",
  zscore: "bg-indigo-300",
  log: "bg-emerald-300",
};

const ACCENT_COLORS: Record<Transform, { skew: string; label: string }> = {
  raw: { skew: "text-rose-500", label: "text-rose-600" },
  minmax: { skew: "text-violet-500", label: "text-violet-600" },
  zscore: { skew: "text-indigo-500", label: "text-indigo-600" },
  log: { skew: "text-emerald-500", label: "text-emerald-600" },
};

function fmt(n: number): string {
  if (Math.abs(n) >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (Math.abs(n) >= 1) return n.toFixed(2);
  return n.toFixed(4);
}

const BAR_HEIGHT = 110;

export default function TransformExplorer() {
  const [active, setActive] = useState<Transform>("raw");

  const rawData = useMemo(() => generateRawData(), []);

  const transformed = useMemo(() => applyTransform(rawData, active), [rawData, active]);
  const stats = useMemo(() => computeStats(transformed), [transformed]);
  const bins = useMemo(() => toHistogram(transformed), [transformed]);
  const maxBin = Math.max(...bins, 1);

  const info = TRANSFORMS.find((t) => t.id === active)!;
  const colors = ACCENT_COLORS[active];

  const skewLabel =
    stats.skew > 0.5 ? "Right-skewed" :
    stats.skew < -0.5 ? "Left-skewed" :
    "Roughly symmetric";

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Transform Explorer
        </span>
      </div>

      {/* Transform selector */}
      <div className="p-5 pb-0">
        <div className="text-xs font-medium text-slate-600 mb-2">Transformation</div>
        <div className="grid grid-cols-4 gap-2">
          {TRANSFORMS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-lg border px-3 py-2 text-left transition-all ${
                active === t.id
                  ? "border-slate-300 bg-slate-900 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className={`text-sm font-semibold mb-0.5 ${active === t.id ? "text-white" : "text-slate-700"}`}>
                {t.label}
              </div>
              <div className={`text-[10px] font-mono ${active === t.id ? "text-slate-300" : "text-slate-400"}`}>
                {t.formula}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Histogram */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wide ${colors.label}`}>
            {skewLabel}
          </span>
          <span className="text-xs text-slate-400 font-mono">n = {rawData.length}</span>
        </div>

        <div className="relative" style={{ height: BAR_HEIGHT + 16 }}>
          <div className="absolute bottom-4 left-0 right-0 flex items-end gap-0.5" style={{ height: BAR_HEIGHT }}>
            {bins.map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm ${BAR_COLORS[active]} transition-all duration-300`}
                style={{ height: `${(h / maxBin) * 100}%`, opacity: 0.85 }}
              />
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 h-px bg-slate-200" />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400">
            <span>{fmt(stats.min)}</span>
            <span>{fmt(stats.max)}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pb-4">
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-600 leading-relaxed">
          {info.description}
        </div>
      </div>

      {/* Stats footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-5 gap-3 text-center">
          {[
            { label: "Mean", value: fmt(stats.mean) },
            { label: "Median", value: fmt(stats.median) },
            { label: "Std Dev", value: fmt(stats.std) },
            { label: "Min", value: fmt(stats.min) },
            { label: "Skewness", value: stats.skew.toFixed(2) },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className={`text-sm font-bold ${label === "Skewness" ? colors.skew : "text-slate-700"}`}>
                {value}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
