"use client";

import { useState, useMemo } from "react";

// ── Math ───────────────────────────────────────────────────────────────────────

function betacf(a: number, b: number, x: number): number {
  const MAXIT = 200;
  const EPS = 3e-7;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

function lgamma(x: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += c[j] / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

function ibeta(a: number, b: number, x: number): number {
  if (x < 0 || x > 1) return NaN;
  if (x === 0) return 0;
  if (x === 1) return 1;
  const lbeta = lgamma(a) + lgamma(b) - lgamma(a + b);
  const bt = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta);
  if (x < (a + 1) / (a + b + 2)) return bt * betacf(a, b, x) / a;
  return 1 - bt * betacf(b, a, 1 - x) / b;
}

function tpvalue(t: number, df: number): number {
  const x = df / (df + t * t);
  return ibeta(df / 2, 0.5, x);
}

function tpdf(t: number, df: number): number {
  const lbeta = lgamma(0.5) + lgamma(df / 2) - lgamma((df + 1) / 2);
  return Math.exp(-((df + 1) / 2) * Math.log(1 + t * t / df) - lbeta) / Math.sqrt(df);
}

// Welch-Satterthwaite degrees of freedom
function welchDf(s1: number, n1: number, s2: number, n2: number): number {
  const v1 = (s1 * s1) / n1;
  const v2 = (s2 * s2) / n2;
  return Math.pow(v1 + v2, 2) / (Math.pow(v1, 2) / (n1 - 1) + Math.pow(v2, 2) / (n2 - 1));
}

// ── Presets ────────────────────────────────────────────────────────────────────

interface Preset {
  id: string;
  label: string;
  groupA: string;
  groupB: string;
  mean1: number; sd1: number; n1: number;
  mean2: number; sd2: number; n2: number;
  meanRange: [number, number];
  sdRange: [number, number];
}

const PRESETS: Preset[] = [
  {
    id: "purchase",
    label: "Purchase amounts",
    groupA: "New customers", groupB: "Returning customers",
    mean1: 65, sd1: 5, n1: 100,
    mean2: 67, sd2: 15, n2: 100,
    meanRange: [40, 120], sdRange: [1, 30],
  },
  {
    id: "latency",
    label: "API response (ms)",
    groupA: "Control", groupB: "Treatment",
    mean1: 120, sd1: 18, n1: 60,
    mean2: 108, sd2: 22, n2: 60,
    meanRange: [60, 300], sdRange: [1, 80],
  },
  {
    id: "accuracy",
    label: "Model accuracy (%)",
    groupA: "Model A", groupB: "Model B",
    mean1: 84.5, sd1: 3.2, n1: 40,
    mean2: 87.1, sd2: 3.0, n2: 40,
    meanRange: [50, 100], sdRange: [0.5, 15],
  },
];

// ── Chart ──────────────────────────────────────────────────────────────────────

const CW = 460, CH = 150;
const PAD = { t: 10, r: 12, b: 28, l: 12 };
const T_RANGE = 5, N_PTS = 400;

function TDistributionChart({ tStat, df }: { tStat: number; df: number }) {
  const pts = useMemo(() => Array.from({ length: N_PTS + 1 }, (_, i) => {
    const tv = -T_RANGE + (i / N_PTS) * 2 * T_RANGE;
    return { tv, y: tpdf(tv, df) };
  }), [df]);

  const maxY = pts.reduce((m, p) => Math.max(m, p.y), 0);
  const pw = CW - PAD.l - PAD.r;
  const ph = CH - PAD.t - PAD.b;
  const sx = (tv: number) => PAD.l + ((tv + T_RANGE) / (2 * T_RANGE)) * pw;
  const sy = (y: number) => PAD.t + ph - (y / (maxY * 1.15)) * ph;
  const baseY = sy(0);

  const curvePath = "M " + pts.map(p => `${sx(p.tv).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" L ");
  const absT = Math.abs(tStat);
  const clampT = Math.min(absT, T_RANGE - 0.05);

  const mkTail = (lo: number, hi: number) => {
    const tail = pts.filter(p => p.tv >= lo && p.tv <= hi);
    if (tail.length < 2) return "";
    return `M ${sx(lo).toFixed(1)},${baseY.toFixed(1)} ` +
      tail.map(p => `L ${sx(p.tv).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ") +
      ` L ${sx(hi).toFixed(1)},${baseY.toFixed(1)} Z`;
  };

  const ticks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const tX = sx(Math.max(-T_RANGE + 0.05, Math.min(T_RANGE - 0.05, tStat)));
  const negX = sx(Math.max(-T_RANGE + 0.05, Math.min(T_RANGE - 0.05, -tStat)));

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      <path d={mkTail(-T_RANGE, -clampT)} fill="#6366f1" fillOpacity={0.18} />
      <path d={mkTail(clampT, T_RANGE)} fill="#6366f1" fillOpacity={0.18} />
      <path d={curvePath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
      <line x1={PAD.l} y1={baseY} x2={PAD.l + pw} y2={baseY} stroke="#e2e8f0" strokeWidth="1" />
      <line x1={tX} y1={PAD.t} x2={tX} y2={baseY} stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx={tX} cy={PAD.t + 4} r={4} fill="#f59e0b" />
      <text x={tX + 5} y={PAD.t + 18} fontSize="7.5" fill="#f59e0b" fontWeight="600">t</text>
      <line x1={negX} y1={PAD.t} x2={negX} y2={baseY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
      <circle cx={negX} cy={PAD.t + 4} r={3} fill="#f59e0b" fillOpacity={0.5} />
      <text x={negX + 4} y={PAD.t + 18} fontSize="7.5" fill="#f59e0b" fillOpacity={0.6}>−t</text>
      {ticks.map(tick => (
        <g key={tick}>
          <line x1={sx(tick)} y1={baseY} x2={sx(tick)} y2={baseY + 4} stroke="#cbd5e1" strokeWidth="1" />
          <text x={sx(tick)} y={baseY + 14} textAnchor="middle" fontSize="8" fill="#94a3b8">{tick}</text>
        </g>
      ))}
      <text x={PAD.l + pw / 2} y={CH - 2} textAnchor="middle" fontSize="8" fill="#94a3b8">
        t (df = {df.toFixed(1)})
      </text>
    </svg>
  );
}

// ── Dot-strip chart ───────────────────────────────────────────────────────────

function GroupDotChart({
  mean1, sd1, mean2, sd2, label1, label2,
}: {
  mean1: number; sd1: number; mean2: number; sd2: number;
  label1: string; label2: string;
}) {
  const allVals = [mean1 - 2.5 * sd1, mean1 + 2.5 * sd1, mean2 - 2.5 * sd2, mean2 + 2.5 * sd2];
  const lo = Math.min(...allVals), hi = Math.max(...allVals);
  const pad = (hi - lo) * 0.08 || 1;
  const domLo = lo - pad, domHi = hi + pad;

  const W = 460, H = 96, marginX = 12, marginY = 22, innerW = W - marginX * 2;
  const sx = (v: number) => marginX + ((v - domLo) / (domHi - domLo)) * innerW;
  const y1 = marginY + 14, y2 = marginY + 48;

  const ci1lo = mean1 - 1.96 * sd1, ci1hi = mean1 + 1.96 * sd1;
  const ci2lo = mean2 - 1.96 * sd2, ci2hi = mean2 + 1.96 * sd2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
      {/* Group A */}
      <text x={sx(mean1)} y={y1 - 10} textAnchor="middle" fontSize="8.5" fill="#6366f1" fontWeight="600">
        {label1}
      </text>
      <line x1={sx(ci1lo)} y1={y1} x2={sx(ci1hi)} y2={y1} stroke="#6366f1" strokeWidth="1.5" strokeOpacity={0.35} />
      <line x1={sx(ci1lo)} y1={y1 - 4} x2={sx(ci1lo)} y2={y1 + 4} stroke="#6366f1" strokeWidth="1.5" strokeOpacity={0.5} />
      <line x1={sx(ci1hi)} y1={y1 - 4} x2={sx(ci1hi)} y2={y1 + 4} stroke="#6366f1" strokeWidth="1.5" strokeOpacity={0.5} />
      <circle cx={sx(mean1)} cy={y1} r={6} fill="#6366f1" fillOpacity={0.9} />

      {/* Group B */}
      <text x={sx(mean2)} y={y2 - 10} textAnchor="middle" fontSize="8.5" fill="#10b981" fontWeight="600">
        {label2}
      </text>
      <line x1={sx(ci2lo)} y1={y2} x2={sx(ci2hi)} y2={y2} stroke="#10b981" strokeWidth="1.5" strokeOpacity={0.35} />
      <line x1={sx(ci2lo)} y1={y2 - 4} x2={sx(ci2lo)} y2={y2 + 4} stroke="#10b981" strokeWidth="1.5" strokeOpacity={0.5} />
      <line x1={sx(ci2hi)} y1={y2 - 4} x2={sx(ci2hi)} y2={y2 + 4} stroke="#10b981" strokeWidth="1.5" strokeOpacity={0.5} />
      <circle cx={sx(mean2)} cy={y2} r={6} fill="#10b981" fillOpacity={0.9} />

      {/* Difference arrow */}
      <line
        x1={sx(mean1)} y1={y1 + 8} x2={sx(mean2)} y2={y2 - 8}
        stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
        </marker>
      </defs>

      {/* Axis */}
      <line x1={marginX} y1={H - 8} x2={W - marginX} y2={H - 8} stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  );
}

// ── Slider row ─────────────────────────────────────────────────────────────────

function SliderRow({ label, value, min, max, step, onChange, display, color = "#6366f1" }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; display?: string; color?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-28 shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full accent-indigo-500" />
      <span className="text-xs font-mono text-slate-700 w-14 text-right">{display ?? value}</span>
    </div>
  );
}

// ── Step badge ─────────────────────────────────────────────────────────────────

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
        {n}
      </span>
      <div className="font-mono text-xs text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function IndependentSamplesTTest() {
  const def = PRESETS[0];
  const [presetId, setPresetId] = useState(def.id);
  const [label1, setLabel1] = useState(def.groupA);
  const [label2, setLabel2] = useState(def.groupB);
  const [mean1, setMean1] = useState(def.mean1);
  const [sd1, setSd1] = useState(def.sd1);
  const [n1, setN1] = useState(def.n1);
  const [mean2, setMean2] = useState(def.mean2);
  const [sd2, setSd2] = useState(def.sd2);
  const [n2, setN2] = useState(def.n2);
  const [meanRange, setMeanRange] = useState<[number, number]>(def.meanRange);
  const [sdRange, setSdRange] = useState<[number, number]>(def.sdRange);

  function loadPreset(p: Preset) {
    setPresetId(p.id);
    setLabel1(p.groupA); setLabel2(p.groupB);
    setMean1(p.mean1); setSd1(p.sd1); setN1(p.n1);
    setMean2(p.mean2); setSd2(p.sd2); setN2(p.n2);
    setMeanRange(p.meanRange); setSdRange(p.sdRange);
  }

  const stats = useMemo(() => {
    const se = Math.sqrt((sd1 * sd1) / n1 + (sd2 * sd2) / n2);
    const tStat = (mean1 - mean2) / se;
    const df = welchDf(sd1, n1, sd2, n2);
    const pValue = tpvalue(tStat, df);
    const varRatio = Math.max(sd1, sd2) / Math.min(sd1, sd2);
    return { se, tStat, df, pValue, varRatio, significant: pValue < 0.05 };
  }, [mean1, sd1, n1, mean2, sd2, n2]);

  const { se, tStat, df, pValue, varRatio, significant } = stats;
  const diffMeans = mean1 - mean2;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">

      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Independent Samples t-Test (Welch's)
        </span>
      </div>

      {/* Scenario selector */}
      <div className="px-5 pt-4 pb-3">
        <div className="text-xs font-semibold text-slate-600 mb-2">Choose a scenario</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => loadPreset(p)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                presetId === p.id
                  ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Group comparison chart */}
      <div className="px-5 pb-2">
        <div className="text-xs font-semibold text-slate-600 mb-1">Group means &amp; spread (±1.96 SD)</div>
        <GroupDotChart
          mean1={mean1} sd1={sd1} mean2={mean2} sd2={sd2}
          label1={label1} label2={label2}
        />
        <p className="text-[10px] text-slate-400 mt-0.5">
          Dots = means. Horizontal bars = ±1.96 SD range. Dashed line = mean difference.
        </p>
      </div>

      {/* Variance ratio callout */}
      {varRatio > 2 && (
        <div className="mx-5 mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Unequal variances detected</span> — SD ratio ≈ {varRatio.toFixed(1)}×.
            Welch's t-test (used here) adjusts for this automatically via Welch-Satterthwaite df.
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="px-5 pb-4 grid sm:grid-cols-2 gap-4">
        {/* Group A */}
        <div className="rounded-lg border border-indigo-100 p-3 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600">{label1}</span>
          </div>
          <SliderRow label="Mean (x̄₁)" value={mean1} min={meanRange[0]} max={meanRange[1]} step={0.5}
            onChange={v => { setMean1(v); setPresetId("custom"); }}
            display={mean1.toFixed(1)} />
          <SliderRow label="SD (s₁)" value={sd1} min={sdRange[0]} max={sdRange[1]} step={0.5}
            onChange={v => { setSd1(v); setPresetId("custom"); }}
            display={sd1.toFixed(1)} />
          <SliderRow label="Size (n₁)" value={n1} min={5} max={300} step={1}
            onChange={v => { setN1(v); setPresetId("custom"); }} />
        </div>

        {/* Group B */}
        <div className="rounded-lg border border-emerald-100 p-3 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">{label2}</span>
          </div>
          <SliderRow label="Mean (x̄₂)" value={mean2} min={meanRange[0]} max={meanRange[1]} step={0.5}
            onChange={v => { setMean2(v); setPresetId("custom"); }}
            display={mean2.toFixed(1)} />
          <SliderRow label="SD (s₂)" value={sd2} min={sdRange[0]} max={sdRange[1]} step={0.5}
            onChange={v => { setSd2(v); setPresetId("custom"); }}
            display={sd2.toFixed(1)} />
          <SliderRow label="Size (n₂)" value={n2} min={5} max={300} step={1}
            onChange={v => { setN2(v); setPresetId("custom"); }} />
        </div>
      </div>

      {/* t-distribution */}
      <div className="px-5 pb-2">
        <div className="text-xs font-semibold text-slate-600 mb-1">
          Welch's t-distribution (df = {df.toFixed(1)})
        </div>
        <TDistributionChart tStat={tStat} df={df} />
        <p className="text-[10px] text-slate-400 mt-1">
          Shaded tails = p-value region. Orange marker = observed t-statistic.
        </p>
      </div>

      {/* Results grid */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Results</span>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">Mean diff (x̄₁ − x̄₂)</div>
            <div className="text-sm font-bold font-mono text-slate-700">
              {diffMeans >= 0 ? "+" : ""}{diffMeans.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">Standard error</div>
            <div className="text-sm font-bold font-mono text-slate-700">{se.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">t-statistic</div>
            <div className={`text-sm font-bold font-mono ${Math.abs(tStat) > 2 ? "text-amber-600" : "text-slate-700"}`}>
              {tStat.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">p-value (two-tailed)</div>
            <div className={`text-sm font-bold font-mono ${significant ? "text-violet-600" : "text-emerald-600"}`}>
              {pValue < 0.001 ? "< 0.001" : pValue.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className={`mx-5 mb-4 rounded-lg border px-4 py-3 ${
        significant ? "bg-violet-50 border-violet-200" : "bg-emerald-50 border-emerald-200"
      }`}>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
          Interpretation (α = 0.05)
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {significant
            ? `p = ${pValue < 0.001 ? "< 0.001" : pValue.toFixed(4)} < 0.05 — reject H₀. The means differ significantly (${label1}: ${mean1}, ${label2}: ${mean2}; difference = ${diffMeans >= 0 ? "+" : ""}${diffMeans.toFixed(2)}).`
            : `p = ${pValue.toFixed(4)} ≥ 0.05 — fail to reject H₀. No significant difference between ${label1} (mean = ${mean1}) and ${label2} (mean = ${mean2}) was detected.`}
        </p>
      </div>

      {/* Step-by-step */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            How it's computed
          </span>
        </div>
        <div className="px-4 py-3 space-y-3">
          <Step n={1}>
            SE = √(s₁²/n₁ + s₂²/n₂) = √({sd1}²/{n1} + {sd2}²/{n2}) = {se.toFixed(4)}
          </Step>
          <Step n={2}>
            t = (x̄₁ − x̄₂) / SE = ({mean1} − {mean2}) / {se.toFixed(4)} = {tStat.toFixed(3)}
          </Step>
          <Step n={3}>
            Welch df = (s₁²/n₁ + s₂²/n₂)² / [(s₁²/n₁)²/(n₁−1) + (s₂²/n₂)²/(n₂−1)] = {df.toFixed(1)}
          </Step>
          <Step n={4}>
            <span className={significant ? "text-violet-600 font-semibold" : "text-emerald-600 font-semibold"}>
              p = {pValue < 0.001 ? "< 0.001" : pValue.toFixed(4)} → {significant ? "significant" : "not significant"} at α = 0.05
            </span>
          </Step>
        </div>
      </div>

      {/* Footer legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500" />
          Group A mean
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Group B mean
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          t-statistic
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-indigo-200 opacity-60" />
          p-value region
        </span>
      </div>
    </div>
  );
}
