"use client";

import { useState, useMemo } from "react";

// Rational approximation of the normal inverse CDF (Beasley–Springer–Moro)
function normalInvCDF(p: number): number {
  const a = [0, -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
  const b = [0, -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [0, -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0, 7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pLow = 0.02425, pHigh = 1 - pLow;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6]) / ((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1);
  } else if (p <= pHigh) {
    const q = p - 0.5, r = q * q;
    return (((((a[1]*r+a[2])*r+a[3])*r+a[4])*r+a[5])*r+a[6])*q / (((((b[1]*r+b[2])*r+b[3])*r+b[4])*r+b[5])*r+1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6]) / ((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1);
  }
}

function generateSkewedData(): number[] {
  const n = 60;
  const mu = 3.8, sigma = 0.65;
  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    const p = (i + 0.5) / n;
    data.push(Math.exp(mu + sigma * normalInvCDF(p)));
  }
  // Add a couple of planted extreme values that the methods disagree on
  data.push(320, 480, 8);
  return data.sort((a, b) => a - b);
}

function computeIQR(sorted: number[]) {
  const n = sorted.length;
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  return { q1, q3, iqr };
}

function computeZStats(data: number[]) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const std = Math.sqrt(data.reduce((a, b) => a + (b - mean) ** 2, 0) / data.length);
  return { mean, std };
}

type Method = "iqr" | "zscore" | "both";

const METHOD_LABELS: Record<Method, string> = {
  iqr: "IQR",
  zscore: "Z-Score",
  both: "Both",
};

const IQR_K_OPTIONS = [1.5, 2.0, 3.0];
const Z_K_OPTIONS = [2.0, 2.5, 3.0];

function fmt(n: number): string {
  return n >= 1000
    ? n.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : n >= 10
    ? n.toFixed(1)
    : n.toFixed(2);
}

export default function OutlierDetector() {
  const [iqrK, setIqrK] = useState(1.5);
  const [zK, setZK] = useState(3.0);
  const [highlight, setHighlight] = useState<Method>("both");

  const data = useMemo(() => generateSkewedData(), []);
  const sorted = useMemo(() => [...data].sort((a, b) => a - b), [data]);

  const { q1, q3, iqr } = useMemo(() => computeIQR(sorted), [sorted]);
  const { mean, std } = useMemo(() => computeZStats(data), [data]);

  const iqrLo = q1 - iqrK * iqr;
  const iqrHi = q3 + iqrK * iqr;
  const zLo = mean - zK * std;
  const zHi = mean + zK * std;

  const flaggedIQR = useMemo(
    () => new Set(data.filter((v) => v < iqrLo || v > iqrHi)),
    [data, iqrLo, iqrHi]
  );
  const flaggedZ = useMemo(
    () => new Set(data.filter((v) => v < zLo || v > zHi)),
    [data, zLo, zHi]
  );

  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min || 1;

  function toX(v: number): number {
    return ((v - min) / range) * 100;
  }

  function dotColor(v: number): { fill: string; ring: string; label: string } {
    const inIQR = flaggedIQR.has(v);
    const inZ = flaggedZ.has(v);

    if (highlight === "iqr") {
      if (inIQR) return { fill: "#f97316", ring: "#ea580c", label: "IQR" };
      return { fill: "#cbd5e1", ring: "#94a3b8", label: "" };
    }
    if (highlight === "zscore") {
      if (inZ) return { fill: "#8b5cf6", ring: "#7c3aed", label: "Z" };
      return { fill: "#cbd5e1", ring: "#94a3b8", label: "" };
    }
    // both
    if (inIQR && inZ) return { fill: "#ec4899", ring: "#db2777", label: "Both" };
    if (inIQR) return { fill: "#f97316", ring: "#ea580c", label: "IQR" };
    if (inZ) return { fill: "#8b5cf6", ring: "#7c3aed", label: "Z" };
    return { fill: "#cbd5e1", ring: "#94a3b8", label: "" };
  }

  const onlyIQR = [...flaggedIQR].filter((v) => !flaggedZ.has(v));
  const onlyZ = [...flaggedZ].filter((v) => !flaggedIQR.has(v));
  const bothFlags = [...flaggedIQR].filter((v) => flaggedZ.has(v));

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Outlier Detector
        </span>
      </div>

      {/* Controls */}
      <div className="p-5 pb-0 grid grid-cols-2 gap-4">
        {/* IQR control */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
              IQR  ·  k = {iqrK}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Q1 − k·IQR &nbsp;/&nbsp; Q3 + k·IQR
            </span>
          </div>
          <div className="flex gap-1.5">
            {IQR_K_OPTIONS.map((k) => (
              <button
                key={k}
                onClick={() => setIqrK(k)}
                className={`flex-1 rounded-lg border py-1.5 text-sm font-mono font-medium transition-all ${
                  iqrK === k
                    ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            lo: {fmt(iqrLo)} &nbsp;·&nbsp; hi: {fmt(iqrHi)}
          </div>
        </div>

        {/* Z-score control */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
              Z-Score  ·  k = {zK}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              μ ± k·σ
            </span>
          </div>
          <div className="flex gap-1.5">
            {Z_K_OPTIONS.map((k) => (
              <button
                key={k}
                onClick={() => setZK(k)}
                className={`flex-1 rounded-lg border py-1.5 text-sm font-mono font-medium transition-all ${
                  zK === k
                    ? "bg-violet-500 border-violet-500 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            lo: {fmt(zLo)} &nbsp;·&nbsp; hi: {fmt(zHi)}
          </div>
        </div>
      </div>

      {/* Dot strip plot */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">
            n = {data.length} values (right-skewed income data, $k)
          </span>
          {/* Highlight toggle */}
          <div className="flex gap-1">
            {(["both", "iqr", "zscore"] as Method[]).map((m) => (
              <button
                key={m}
                onClick={() => setHighlight(m)}
                className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                  highlight === m
                    ? "bg-slate-800 border-slate-800 text-white"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {METHOD_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        {/* The strip */}
        <div className="relative h-16 bg-slate-50 rounded-lg border border-slate-100 overflow-visible">
          {/* IQR band */}
          <div
            className="absolute top-0 bottom-0 bg-orange-50 border-x border-orange-200 opacity-60"
            style={{
              left: `${Math.max(toX(iqrLo), 0)}%`,
              width: `${Math.min(toX(iqrHi), 100) - Math.max(toX(iqrLo), 0)}%`,
            }}
          />
          {/* Z-score band */}
          <div
            className="absolute top-0 bottom-0 bg-violet-50 border-x border-violet-200 opacity-50"
            style={{
              left: `${Math.max(toX(zLo), 0)}%`,
              width: `${Math.min(toX(zHi), 100) - Math.max(toX(zLo), 0)}%`,
            }}
          />

          {/* Dots */}
          {data.map((v, i) => {
            const { fill, ring } = dotColor(v);
            const x = toX(v);
            return (
              <div
                key={i}
                title={`${fmt(v)}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 w-3 h-3 rounded-full transition-all duration-200 cursor-default"
                style={{
                  left: `${x}%`,
                  backgroundColor: fill,
                  boxShadow: `0 0 0 1.5px ${ring}`,
                }}
              />
            );
          })}

          {/* Threshold markers */}
          {[
            { x: toX(iqrHi), color: "#f97316", label: `IQR hi` },
            { x: toX(zHi), color: "#8b5cf6", label: `Z hi` },
          ].map(({ x, color, label }) =>
            x >= 0 && x <= 100 ? (
              <div
                key={label}
                className="absolute top-0 bottom-0 w-px"
                style={{ left: `${x}%`, backgroundColor: color, opacity: 0.7 }}
              >
                <span
                  className="absolute -top-5 -translate-x-1/2 text-[9px] font-mono whitespace-nowrap"
                  style={{ color }}
                >
                  {label}
                </span>
              </div>
            ) : null
          )}
        </div>

        {/* Axis */}
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>{fmt(min)}</span>
          <span>{fmt(max)}</span>
        </div>
      </div>

      {/* Insight callout */}
      <div className="px-5 pb-4">
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-600 leading-relaxed">
          {highlight === "both" && (
            <>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 mr-1.5">IQR only</span>
              {onlyIQR.length} point{onlyIQR.length !== 1 ? "s" : ""}
              <span className="mx-2 text-slate-300">·</span>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700 border border-violet-200 mr-1.5">Z only</span>
              {onlyZ.length} point{onlyZ.length !== 1 ? "s" : ""}
              <span className="mx-2 text-slate-300">·</span>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-700 border border-pink-200 mr-1.5">Both</span>
              {bothFlags.length} point{bothFlags.length !== 1 ? "s" : ""}
              {onlyIQR.length > 0 && (
                <p className="mt-2 text-slate-500">
                  IQR flags more on the right tail — it uses the median-based spread rather than the
                  mean and std, which are pulled upward by the extreme values, making z-score thresholds looser than you might expect.
                </p>
              )}
            </>
          )}
          {highlight === "iqr" && (
            <>
              <span className="font-semibold text-orange-600">IQR method</span>
              {" "}flags {flaggedIQR.size} point{flaggedIQR.size !== 1 ? "s" : ""} with k = {iqrK}.
              Thresholds: Q1 − {iqrK}·IQR = {fmt(iqrLo)}, Q3 + {iqrK}·IQR = {fmt(iqrHi)}.{" "}
              No normality assumption — it uses the quartiles, which are robust to skew.
            </>
          )}
          {highlight === "zscore" && (
            <>
              <span className="font-semibold text-violet-600">Z-score method</span>
              {" "}flags {flaggedZ.size} point{flaggedZ.size !== 1 ? "s" : ""} with k = {zK}.
              Thresholds: μ ± {zK}σ = [{fmt(zLo)}, {fmt(zHi)}].{" "}
              On right-skewed data the mean ({fmt(mean)}) and σ ({fmt(std)}) are pulled right by the tail,
              widening the upper threshold and potentially missing real outliers.
            </>
          )}
        </div>
      </div>

      {/* Stats footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { label: "Flagged (IQR)", value: flaggedIQR.size, color: "text-orange-500" },
            { label: "Flagged (Z)", value: flaggedZ.size, color: "text-violet-500" },
            { label: "Only IQR", value: onlyIQR.length, color: "text-orange-400" },
            { label: "Only Z", value: onlyZ.length, color: "text-violet-400" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className={`text-sm font-bold ${color}`}>{value}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
