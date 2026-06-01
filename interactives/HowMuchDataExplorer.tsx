"use client";

import { useState } from "react";

// Normal distribution inverse CDF approximation (Beasley-Springer-Moro)
function normInvCDF(p: number): number {
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  } else if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
}

// Two-sample t-test sample size per group using Cohen's d directly:
// n = 2 * ((z_alpha/2 + z_beta) / d)^2
function calcSampleSize(d: number, power: number, alpha: number): number {
  const zAlpha = normInvCDF(1 - alpha / 2);
  const zBeta = normInvCDF(power);
  return Math.ceil(2 * Math.pow((zAlpha + zBeta) / d, 2));
}

const EFFECT_PRESETS = [
  { label: "Small", value: 0.2 },
  { label: "Medium", value: 0.5 },
  { label: "Large", value: 0.8 },
];

const POWER_PRESETS = [
  { label: "70%", value: 0.7 },
  { label: "80%", value: 0.8 },
  { label: "90%", value: 0.9 },
  { label: "95%", value: 0.95 },
];

const ALPHA_PRESETS = [
  { label: "0.10", value: 0.1 },
  { label: "0.05", value: 0.05 },
  { label: "0.01", value: 0.01 },
];

function sizeLabel(n: number): { text: string; color: string } {
  if (n <= 30) return { text: "Very small study", color: "text-emerald-700" };
  if (n <= 100) return { text: "Small study", color: "text-teal-700" };
  if (n <= 500) return { text: "Medium study", color: "text-amber-700" };
  if (n <= 2000) return { text: "Large study", color: "text-orange-700" };
  return { text: "Very large study", color: "text-rose-700" };
}

function formatN(n: number): string {
  if (n > 999999) return ">1M";
  if (n > 99999) return `${Math.round(n / 1000)}k`;
  if (n > 9999) return n.toLocaleString();
  return String(n);
}

export default function HowMuchDataExplorer() {
  const [effectSize, setEffectSize] = useState(0.5);
  const [power, setPower] = useState(0.8);
  const [alpha, setAlpha] = useState(0.05);

  const nPerGroup = calcSampleSize(effectSize, power, alpha);
  const nTotal = nPerGroup * 2;
  const label = sizeLabel(nPerGroup);

  // Curve: n vs effect size (holding power and alpha fixed)
  const CURVE_POINTS = 40;
  const curveData = Array.from({ length: CURVE_POINTS }, (_, i) => {
    const es = 0.1 + (i / (CURVE_POINTS - 1)) * 1.4;
    return { es, n: Math.min(calcSampleSize(es, power, alpha), 5000) };
  });
  const maxCurveN = Math.max(...curveData.map((d) => d.n));
  const CHART_H = 120;
  const CHART_W = 100;

  const curEffectClamped = Math.max(0.1, Math.min(1.5, effectSize));
  const curX = ((curEffectClamped - 0.1) / 1.4) * CHART_W;
  const curN = Math.min(nPerGroup, 5000);
  const curY = CHART_H - (curN / maxCurveN) * CHART_H;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Sample Size Explorer
        </span>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Result callout */}
        <div className="rounded-lg border border-violet-100 bg-violet-50 px-4 py-3 flex flex-wrap items-center gap-x-8 gap-y-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-400 mb-0.5">
              Per group
            </p>
            <p className="text-2xl font-bold text-violet-700 font-mono leading-none">
              {formatN(nPerGroup)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-400 mb-0.5">
              Total (2 groups)
            </p>
            <p className="text-2xl font-bold text-violet-700 font-mono leading-none">
              {formatN(nTotal)}
            </p>
          </div>
          <div className="ml-auto">
            <p className={`text-xs font-semibold ${label.color}`}>{label.text}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">two-sample design</p>
          </div>
        </div>

        {/* Effect size */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Effect size (Cohen's d)
            </p>
            <span className="text-sm font-bold text-amber-700 font-mono">{effectSize.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.5}
            step={0.05}
            value={effectSize}
            onChange={(e) => setEffectSize(parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {EFFECT_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setEffectSize(p.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  Math.abs(effectSize - p.value) < 0.01
                    ? "bg-amber-50 border-amber-300 text-amber-800"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {p.label} (d = {p.value})
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            The standardized difference: how large is the effect relative to the natural variation in the outcome. Small effects demand far larger samples.
          </p>
        </div>

        {/* Power */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Statistical power (1 − β)
            </p>
            <span className="text-sm font-bold text-indigo-700 font-mono">{Math.round(power * 100)}%</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {POWER_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPower(p.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  power === p.value
                    ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            Probability of detecting a real effect when it exists. 80% is the conventional standard — chosen to balance study cost against the risk of missing real findings.
          </p>
        </div>

        {/* Alpha */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Significance threshold (α)
            </p>
            <span className="text-sm font-bold text-teal-700 font-mono">α = {alpha}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {ALPHA_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setAlpha(p.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  alpha === p.value
                    ? "bg-teal-50 border-teal-300 text-teal-800"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                α = {p.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            How much false-positive risk you accept. Stricter thresholds require larger samples. α = 0.05 is the default in most fields.
          </p>
        </div>

        {/* n vs. effect size curve */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-3">
            Required n vs. effect size (current power &amp; α)
          </p>
          <div className="relative" style={{ height: CHART_H + 28 }}>
            <svg
              className="absolute inset-0 w-full"
              style={{ height: CHART_H + 20 }}
              viewBox={`0 0 ${CHART_W} ${CHART_H + 4}`}
              preserveAspectRatio="none"
            >
              <polyline
                points={curveData
                  .map((pt, i) => {
                    const x = (i / (CURVE_POINTS - 1)) * CHART_W;
                    const y = CHART_H - (pt.n / maxCurveN) * CHART_H;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="1.2"
              />
              <circle cx={curX} cy={curY} r="2" fill="#7c3aed" />
              <line
                x1={curX} y1={curY} x2={curX} y2={CHART_H}
                stroke="#7c3aed" strokeWidth="0.6" strokeDasharray="2,1.5"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-slate-400">
              <span>d = 0.1</span>
              <span>Effect size →</span>
              <span>d = 1.5</span>
            </div>
            <div className="absolute left-0 top-0 text-[9px] text-slate-400">n = {formatN(maxCurveN)}</div>
            <div className="absolute left-0 bottom-7 text-[9px] text-slate-400">0</div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            The curve is hyperbolic — halving the effect size roughly quadruples the required sample size.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Effect (d)", value: effectSize.toFixed(2), color: "text-amber-700" },
          { label: "Power", value: `${Math.round(power * 100)}%`, color: "text-indigo-700" },
          { label: "α", value: String(alpha), color: "text-teal-700" },
        ].map((item) => (
          <div key={item.label}>
            <p className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
