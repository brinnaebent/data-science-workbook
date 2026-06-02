"use client";

import { useState, useMemo } from "react";

// ── Math ───────────────────────────────────────────────────────────────────────

function mean(d: number[]) { return d.reduce((s, x) => s + x, 0) / d.length; }
function variance(d: number[]) {
  const m = mean(d);
  return d.reduce((s, x) => s + (x - m) ** 2, 0) / (d.length - 1);
}
function sd(d: number[]) { return Math.sqrt(variance(d)); }

function lgamma(x: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += c[j] / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}
function betacf(a: number, b: number, x: number): number {
  const MAXIT = 200, EPS = 3e-7, qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d; let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}
function ibeta(a: number, b: number, x: number): number {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const lbeta = lgamma(a) + lgamma(b) - lgamma(a + b);
  const bt = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta);
  return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
}
function tpvalue(t: number, df: number) { return ibeta(df / 2, 0.5, df / (df + t * t)); }

// ── Paired vs independent t-test ───────────────────────────────────────────────

function computePaired(before: number[], after: number[]) {
  const diffs = before.map((b, i) => after[i] - b);
  const md = mean(diffs);
  const sdd = sd(diffs);
  const n = diffs.length;
  const se = sdd / Math.sqrt(n);
  const t = md / se;
  const p = tpvalue(t, n - 1);
  return { t, se, df: n - 1, p, md };
}

function computeIndependent(a: number[], b: number[]) {
  const ma = mean(a), mb = mean(b);
  const va = variance(a), vb = variance(b);
  const na = a.length, nb = b.length;
  const se = Math.sqrt(va / na + vb / nb);
  const t = (ma - mb) / se;
  // Welch df
  const df = (va / na + vb / nb) ** 2 / ((va / na) ** 2 / (na - 1) + (vb / nb) ** 2 / (nb - 1));
  const p = tpvalue(t, df);
  return { t, se, df, p };
}

// ── Presets ────────────────────────────────────────────────────────────────────

interface Preset {
  id: string;
  label: string;
  description: string;
  before: number[];
  after: number[];
}

const PRESETS: Preset[] = [
  {
    id: "training",
    label: "Training scores",
    description: "10 employees assessed before and after a workshop. Individual baseline scores vary widely.",
    before: [62, 71, 55, 80, 68, 73, 59, 77, 64, 70],
    after:  [68, 77, 61, 86, 74, 79, 65, 83, 70, 76],
  },
  {
    id: "model",
    label: "Model comparison",
    description: "Baseline vs. optimized model evaluated on the same 8 test folds.",
    before: [0.81, 0.74, 0.88, 0.79, 0.83, 0.76, 0.85, 0.80],
    after:  [0.84, 0.77, 0.91, 0.82, 0.86, 0.79, 0.88, 0.83],
  },
  {
    id: "lowvar",
    label: "Low individual variation",
    description: "Subjects are very similar to each other — pairing adds little advantage.",
    before: [50, 51, 49, 50, 52, 50, 51, 49, 50, 51],
    after:  [54, 55, 53, 54, 56, 54, 55, 53, 54, 55],
  },
];

// ── Dot-and-line chart ─────────────────────────────────────────────────────────

const CW = 380;
const CH = 150;
const P = { t: 10, r: 20, b: 20, l: 20 };

function PairChart({ before, after }: { before: number[]; after: number[] }) {
  const all = [...before, ...after];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const range = hi - lo || 1;
  const pw = CW - P.l - P.r;
  const ph = CH - P.t - P.b;
  const n = before.length;
  const rowH = ph / n;

  const sx = (v: number) => P.l + ((v - lo) / range) * pw;

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      {before.map((b, i) => {
        const a = after[i];
        const y = P.t + (i + 0.5) * rowH;
        const improved = a > b;
        const lineColor = improved ? "#6366f1" : "#f59e0b";
        return (
          <g key={i}>
            <line x1={sx(b)} y1={y} x2={sx(a)} y2={y} stroke={lineColor} strokeWidth="1.5" strokeOpacity={0.6} />
            <circle cx={sx(b)} cy={y} r={4} fill="#94a3b8" fillOpacity={0.8} />
            <circle cx={sx(a)} cy={y} r={4} fill={lineColor} fillOpacity={0.9} />
          </g>
        );
      })}
      <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph} stroke="#e2e8f0" strokeWidth="1" />
      <text x={P.l} y={CH - 2} fontSize="8" fill="#94a3b8">{lo.toFixed(2)}</text>
      <text x={P.l + pw} y={CH - 2} fontSize="8" fill="#94a3b8" textAnchor="end">{hi.toFixed(2)}</text>
    </svg>
  );
}

// ── Result card ────────────────────────────────────────────────────────────────

function ResultCard({ label, t, df, p, se, highlight }: {
  label: string; t: number; df: number; p: number; se: number; highlight: boolean;
}) {
  const sig = p < 0.05;
  return (
    <div className={`rounded-lg border overflow-hidden ${highlight ? "border-indigo-300" : "border-slate-200"}`}>
      <div className={`px-3 py-2 border-b flex items-center justify-between ${highlight ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-100"}`}>
        <span className={`text-xs font-semibold ${highlight ? "text-indigo-700" : "text-slate-600"}`}>{label}</span>
        {highlight && <span className="text-[10px] text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded-full">more power</span>}
      </div>
      <div className="px-3 py-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div>
          <div className="text-[10px] text-slate-400">SE</div>
          <div className="text-xs font-mono font-semibold text-slate-700">{se.toFixed(4)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">t-statistic</div>
          <div className="text-xs font-mono font-semibold text-slate-700">{t.toFixed(3)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">df</div>
          <div className="text-xs font-mono font-semibold text-slate-700">{df.toFixed(1)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">p-value</div>
          <div className={`text-xs font-mono font-semibold ${sig ? "text-rose-600" : "text-slate-700"}`}>
            {p < 0.001 ? "< 0.001" : p.toFixed(4)}
          </div>
        </div>
      </div>
      <div className={`px-3 py-2 border-t border-slate-100 text-[10px] font-semibold ${sig ? "text-rose-600" : "text-slate-500"}`}>
        {sig ? "✓ Significant (p < 0.05)" : "✗ Not significant (p ≥ 0.05)"}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PairedVsIndependentExplorer() {
  const [presetId, setPresetId] = useState("training");

  const preset = PRESETS.find(p => p.id === presetId)!;
  const { before, after } = preset;

  const paired = useMemo(() => computePaired(before, after), [before, after]);
  const indep = useMemo(() => computeIndependent(before, after), [before, after]);

  // Which test is more powerful (lower p)?
  const pairedWins = paired.p <= indep.p;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Paired vs. Independent Explorer
        </span>
      </div>

      {/* Presets */}
      <div className="px-5 pt-4 pb-3">
        <div className="text-xs font-semibold text-slate-600 mb-2">Choose a scenario</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => setPresetId(p.id)}
              className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                presetId === p.id
                  ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}>
              <div className="font-semibold">{p.label}</div>
              <div className="text-slate-500 mt-0.5 leading-snug">{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 pb-2">
        <div className="text-xs font-semibold text-slate-600 mb-1">Paired observations</div>
        <PairChart before={before} after={after} />
        <p className="text-[10px] text-slate-400 mt-1">
          Each row is one subject. Gray dot = before, colored dot = after. Lines connect paired values.
        </p>
      </div>

      {/* Results side-by-side */}
      <div className="px-5 pb-4">
        <div className="text-xs font-semibold text-slate-600 mb-2">Test results on the same data</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ResultCard label="Paired t-test" t={paired.t} df={paired.df} p={paired.p} se={paired.se} highlight={pairedWins} />
          <ResultCard label="Independent t-test (Welch's)" t={indep.t} df={indep.df} p={indep.p} se={indep.se} highlight={!pairedWins} />
        </div>
      </div>

      {/* Explanation */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Why the difference?</div>
        <p className="text-xs text-slate-700 leading-relaxed">
          The paired test computes differences within each pair, eliminating between-subject variability from the error term.
          When subjects vary a lot from each other (high individual variation), this deflates the SE and amplifies the t-statistic.
          When subjects are nearly identical, pairing provides little advantage.
        </p>
      </div>

      {/* Footer stats */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs font-bold text-indigo-600">{mean(before).toFixed(2)}</div>
            <div className="text-[10px] text-slate-400">Mean before</div>
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-600">{mean(after).toFixed(2)}</div>
            <div className="text-[10px] text-slate-400">Mean after</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-600">{paired.md.toFixed(3)}</div>
            <div className="text-[10px] text-slate-400">Mean diff (d̄)</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-slate-100 flex items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> Before
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" /> After (improved)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> After (declined)
        </span>
      </div>
    </div>
  );
}
