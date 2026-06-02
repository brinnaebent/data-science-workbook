"use client";

import { useState, useMemo } from "react";

// ── Math ───────────────────────────────────────────────────────────────────────

// Regularized incomplete beta function via continued fraction (Lentz)
function betacf(a: number, b: number, x: number): number {
  const MAXIT = 200;
  const EPS = 3e-7;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
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

function lgamma(x: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += c[j] / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

// Two-tailed p-value from t-distribution with df degrees of freedom
function tpvalue(t: number, df: number): number {
  const x = df / (df + t * t);
  return ibeta(df / 2, 0.5, x);
}

// t-distribution PDF
function tpdf(t: number, df: number): number {
  const lbeta = lgamma(0.5) + lgamma(df / 2) - lgamma((df + 1) / 2);
  return Math.exp(-((df + 1) / 2) * Math.log(1 + t * t / df) - lbeta) / Math.sqrt(df);
}

// ── Presets ────────────────────────────────────────────────────────────────────

interface Preset {
  id: string;
  label: string;
  mean: number;
  sd: number;
  n: number;
  benchmark: number;
  meanRange: [number, number];
  sdRange: [number, number];
}

const PRESETS: Preset[] = [
  { id: "ratings", label: "App ratings", mean: 4.7, sd: 0.3, n: 100, benchmark: 4.5,
    meanRange: [1, 5], sdRange: [0.1, 2] },
  { id: "latency", label: "API latency (ms)", mean: 118, sd: 22, n: 50, benchmark: 120,
    meanRange: [50, 300], sdRange: [1, 80] },
  { id: "accuracy", label: "Model accuracy (%)", mean: 87.2, sd: 4.1, n: 30, benchmark: 85,
    meanRange: [50, 100], sdRange: [0.5, 20] },
];

// ── T-distribution chart ───────────────────────────────────────────────────────

const CW = 460;
const CH = 140;
const PAD = { t: 10, r: 12, b: 26, l: 12 };
const T_RANGE = 4.5;
const N_PTS = 400;

interface TChartProps { tStat: number; df: number }

function TDistributionChart({ tStat, df }: TChartProps) {
  const pts = useMemo(() => {
    return Array.from({ length: N_PTS + 1 }, (_, i) => {
      const tv = -T_RANGE + (i / N_PTS) * 2 * T_RANGE;
      return { tv, y: tpdf(tv, df) };
    });
  }, [df]);

  const maxY = pts.reduce((m, p) => Math.max(m, p.y), 0);
  const pw = CW - PAD.l - PAD.r;
  const ph = CH - PAD.t - PAD.b;

  const sx = (tv: number) => PAD.l + ((tv + T_RANGE) / (2 * T_RANGE)) * pw;
  const sy = (y: number) => PAD.t + ph - (y / (maxY * 1.15)) * ph;
  const baseY = sy(0);

  const curvePath = "M " + pts.map(p => `${sx(p.tv).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" L ");
  const absTStat = Math.abs(tStat);
  const clampedT = Math.min(absTStat, T_RANGE - 0.05);

  // Shade tails beyond |tStat|
  const rightTailPts = pts.filter(p => p.tv >= clampedT);
  const leftTailPts = pts.filter(p => p.tv <= -clampedT);
  const mkTailPath = (tailPts: typeof pts, lo: number, hi: number) => {
    if (tailPts.length < 2) return "";
    return `M ${sx(lo).toFixed(1)},${baseY.toFixed(1)} ` +
      tailPts.map(p => `L ${sx(p.tv).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ") +
      ` L ${sx(hi).toFixed(1)},${baseY.toFixed(1)} Z`;
  };
  const rightPath = mkTailPath(rightTailPts, clampedT, T_RANGE);
  const leftPath = mkTailPath(leftTailPts, -T_RANGE, -clampedT);

  const ticks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const tStatX = sx(Math.max(-T_RANGE + 0.05, Math.min(T_RANGE - 0.05, tStat)));
  const negStatX = sx(Math.max(-T_RANGE + 0.05, Math.min(T_RANGE - 0.05, -tStat)));

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      {leftPath && <path d={leftPath} fill="#6366f1" fillOpacity={0.2} />}
      {rightPath && <path d={rightPath} fill="#6366f1" fillOpacity={0.2} />}
      <path d={curvePath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
      <line x1={PAD.l} y1={baseY} x2={PAD.l + pw} y2={baseY} stroke="#e2e8f0" strokeWidth="1" />
      {/* t-statistic line */}
      <line x1={tStatX} y1={PAD.t} x2={tStatX} y2={baseY} stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx={tStatX} cy={PAD.t + 4} r={4} fill="#f59e0b" />
      <text x={tStatX + 4} y={PAD.t + 18} fontSize="7.5" fill="#f59e0b" fontWeight="600">t</text>
      {/* mirror line at −|t| for two-tailed shading */}
      <line x1={negStatX} y1={PAD.t} x2={negStatX} y2={baseY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
      <circle cx={negStatX} cy={PAD.t + 4} r={3} fill="#f59e0b" fillOpacity={0.5} />
      <text x={negStatX + 4} y={PAD.t + 18} fontSize="7.5" fill="#f59e0b" fillOpacity={0.6}>−t</text>
      {ticks.map(tick => (
        <g key={tick}>
          <line x1={sx(tick)} y1={baseY} x2={sx(tick)} y2={baseY + 4} stroke="#cbd5e1" strokeWidth="1" />
          <text x={sx(tick)} y={baseY + 13} textAnchor="middle" fontSize="8" fill="#94a3b8">{tick}</text>
        </g>
      ))}
      <text x={PAD.l + pw / 2} y={CH - 2} textAnchor="middle" fontSize="8" fill="#94a3b8">
        t (df = {df})
      </text>
    </svg>
  );
}

// ── Slider row ─────────────────────────────────────────────────────────────────

function SliderRow({ label, value, min, max, step, onChange, display }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; display?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full accent-indigo-500"
      />
      <span className="text-xs font-mono text-slate-700 w-12 text-right">{display ?? value}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function OneSampleTTest() {
  const defaultPreset = PRESETS[0];
  const [presetId, setPresetId] = useState(defaultPreset.id);
  const [mean, setMean] = useState(defaultPreset.mean);
  const [sd, setSd] = useState(defaultPreset.sd);
  const [n, setN] = useState(defaultPreset.n);
  const [benchmark, setBenchmark] = useState(defaultPreset.benchmark);
  const [meanRange, setMeanRange] = useState<[number, number]>(defaultPreset.meanRange);
  const [sdRange, setSdRange] = useState<[number, number]>(defaultPreset.sdRange);

  function loadPreset(p: Preset) {
    setPresetId(p.id);
    setMean(p.mean); setSd(p.sd); setN(p.n); setBenchmark(p.benchmark);
    setMeanRange(p.meanRange); setSdRange(p.sdRange);
  }

  const { tStat, df, se, pValue, significant } = useMemo(() => {
    const se = sd / Math.sqrt(n);
    const tStat = (mean - benchmark) / se;
    const df = n - 1;
    const pValue = tpvalue(tStat, df);
    return { tStat, df, se, pValue, significant: pValue < 0.05 };
  }, [mean, sd, n, benchmark]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          One-Sample t-Test
        </span>
      </div>

      {/* Presets */}
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

      {/* Controls */}
      <div className="px-5 pb-3">
        <div className="rounded-lg border border-slate-100 p-3 space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
            Adjust inputs
          </div>
          <SliderRow label="Sample mean (x̄)" value={mean} min={meanRange[0]} max={meanRange[1]} step={0.1}
            onChange={v => { setMean(v); setPresetId("custom"); }} display={mean.toFixed(1)} />
          <SliderRow label="Std dev (s)" value={sd} min={sdRange[0]} max={sdRange[1]} step={0.1}
            onChange={v => { setSd(v); setPresetId("custom"); }} display={sd.toFixed(1)} />
          <SliderRow label="Sample size (n)" value={n} min={5} max={500} step={1}
            onChange={v => { setN(v); setPresetId("custom"); }} />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-24 shrink-0">Benchmark (μ₀)</span>
            <span className="text-xs font-mono text-slate-700">{benchmark}</span>
          </div>
        </div>
      </div>

      {/* t-distribution chart */}
      <div className="px-5 pb-2">
        <div className="text-xs font-semibold text-slate-600 mb-1">t-Distribution (df = {df})</div>
        <TDistributionChart tStat={tStat} df={df} />
        <p className="text-[10px] text-slate-400 mt-1">
          Shaded tails = p-value region. Orange marker = t-statistic.
        </p>
      </div>

      {/* Results */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Results</span>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            <div className="text-[10px] text-slate-400 mb-0.5">Degrees of freedom</div>
            <div className="text-sm font-bold font-mono text-slate-700">{df}</div>
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
            ? `p = ${pValue < 0.001 ? "< 0.001" : pValue.toFixed(4)} < 0.05 — reject H₀. The sample mean (${mean}) differs significantly from the benchmark (${benchmark}).`
            : `p = ${pValue.toFixed(4)} ≥ 0.05 — fail to reject H₀. No significant difference from the benchmark (${benchmark}) was detected.`}
        </p>
      </div>

      {/* Step-by-step */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Step-by-step</span>
        </div>
        <div className="px-4 py-3 font-mono text-xs space-y-2">
          <div className="text-slate-500">1. SE = s / √n = {sd} / √{n} = {se.toFixed(4)}</div>
          <div className="text-slate-600">2. t = (x̄ − μ₀) / SE = ({mean} − {benchmark}) / {se.toFixed(4)} = {tStat.toFixed(3)}</div>
          <div className="text-slate-600">3. df = n − 1 = {n} − 1 = {df}</div>
          <div className={`font-semibold ${significant ? "text-violet-600" : "text-emerald-600"}`}>
            4. p = {pValue < 0.001 ? "< 0.001" : pValue.toFixed(4)} ({significant ? "significant" : "not significant"} at α = 0.05)
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-indigo-200 opacity-60" />
          p-value region (shaded tails)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          t = observed t-statistic
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 border-t border-dashed border-amber-400 opacity-60" style={{ height: 0 }} />
          −t = mirror (two-tailed)
        </span>
      </div>
    </div>
  );
}
