"use client";

import { useState, useMemo } from "react";

// ── Math helpers ───────────────────────────────────────────────────────────────

function mean(d: number[]) {
  return d.reduce((s, x) => s + x, 0) / d.length;
}

function mse(groups: number[][]): number {
  const N = groups.reduce((s, g) => s + g.length, 0);
  const k = groups.length;
  const ssw = groups.reduce((s, g) => {
    const gm = mean(g);
    return s + g.reduce((a, x) => a + (x - gm) ** 2, 0);
  }, 0);
  return ssw / (N - k);
}

// Studentized range distribution quantile (q critical value) via approximation
// Uses Lund & Lund (1983) approximation for q at alpha=0.05
function qCritical(k: number, dfW: number): number {
  // Table-based interpolation for common k (2-6) and dfW values
  // q_(0.05, k, dfW) from Tukey HSD table
  const table: Record<number, number[]> = {
    // dfW rows: 5,6,7,8,9,10,12,15,20,24,30,40,60,120,Inf
    // cols: k=2..6
    5:   [3.64, 4.60, 5.22, 5.67, 6.03],
    6:   [3.46, 4.34, 4.90, 5.30, 5.63],
    7:   [3.34, 4.16, 4.68, 5.06, 5.36],
    8:   [3.26, 4.04, 4.53, 4.89, 5.17],
    9:   [3.20, 3.95, 4.41, 4.76, 5.02],
    10:  [3.15, 3.88, 4.33, 4.65, 4.91],
    12:  [3.08, 3.77, 4.20, 4.51, 4.75],
    15:  [3.01, 3.67, 4.08, 4.37, 4.59],
    20:  [2.95, 3.58, 3.96, 4.23, 4.45],
    24:  [2.92, 3.53, 3.90, 4.17, 4.37],
    30:  [2.89, 3.49, 3.85, 4.10, 4.30],
    40:  [2.86, 3.44, 3.79, 4.04, 4.23],
    60:  [2.83, 3.40, 3.74, 3.98, 4.16],
    120: [2.80, 3.36, 3.68, 3.92, 4.10],
    999: [2.77, 3.31, 3.63, 3.86, 4.03],
  };
  const keys = [5, 6, 7, 8, 9, 10, 12, 15, 20, 24, 30, 40, 60, 120, 999];
  const col = Math.min(Math.max(k - 2, 0), 4);

  // find nearest dfW keys
  let lo = keys[0], hi = keys[keys.length - 1];
  for (const key of keys) {
    if (key <= dfW) lo = key;
    if (key >= dfW && hi === keys[keys.length - 1]) hi = key;
  }
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] >= dfW) { hi = keys[i]; break; }
  }

  if (lo === hi) return table[lo][col];
  const t = (dfW - lo) / (hi - lo);
  return table[lo][col] + t * (table[hi][col] - table[lo][col]);
}

interface PairResult {
  i: number;
  j: number;
  diff: number;
  hsd: number;
  significant: boolean;
}

function tukeyHSD(groups: number[][]): { pairs: PairResult[]; hsd: number; q: number; mseVal: number } {
  const k = groups.length;
  const N = groups.reduce((s, g) => s + g.length, 0);
  const dfW = N - k;
  const n = groups[0].length; // assume equal n
  const mseVal = mse(groups);
  const q = qCritical(k, dfW);
  const hsd = q * Math.sqrt(mseVal / n);

  const pairs: PairResult[] = [];
  for (let i = 0; i < k; i++) {
    for (let j = i + 1; j < k; j++) {
      const diff = Math.abs(mean(groups[i]) - mean(groups[j]));
      pairs.push({ i, j, diff, hsd, significant: diff > hsd });
    }
  }
  return { pairs, hsd, q, mseVal };
}

function makeGroup(mu: number, spread: number, n = 10): number[] {
  return Array.from({ length: n }, (_, i) =>
    mu + spread * ((i / (n - 1)) * 2 - 1)
  );
}

// ── Constants ──────────────────────────────────────────────────────────────────

const GROUP_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899"];
const DEFAULT_LABELS = ["Group A", "Group B", "Group C"];

// ── Dot plot ───────────────────────────────────────────────────────────────────

const CW = 480;
const CH = 170;
const P = { t: 12, r: 16, b: 28, l: 44 };

function DotPlot({ groups, labels }: { groups: number[][]; labels: string[] }) {
  const all = groups.flat();
  const lo = Math.min(...all) - 1;
  const hi = Math.max(...all) + 1;
  const range = hi - lo || 1;
  const pw = CW - P.l - P.r;
  const ph = CH - P.t - P.b;
  const rowH = ph / groups.length;
  const sx = (v: number) => P.l + ((v - lo) / range) * pw;

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      {groups.map((g, gi) => {
        const gm = mean(g);
        const color = GROUP_COLORS[gi];
        const midY = P.t + (gi + 0.5) * rowH;
        return (
          <g key={gi}>
            <line x1={P.l} x2={P.l + pw} y1={midY} y2={midY}
              stroke="#f1f5f9" strokeWidth="1" />
            {g.map((v, i) => (
              <circle key={i} cx={sx(v)} cy={midY} r={4}
                fill={color} fillOpacity={0.55} />
            ))}
            <line x1={sx(gm)} y1={midY - rowH * 0.4} x2={sx(gm)} y2={midY + rowH * 0.4}
              stroke={color} strokeWidth="2.5" />
            <text x={P.l - 6} y={midY + 4} textAnchor="end" fontSize="9"
              fill={color} fontWeight="600">
              {labels[gi]}
            </text>
          </g>
        );
      })}
      <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph}
        stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  );
}

// ── Pair diff chart ────────────────────────────────────────────────────────────

function PairBar({ pair, hsd, labels }: { pair: PairResult; hsd: number; labels: string[] }) {
  const maxBar = Math.max(pair.diff, hsd) * 1.15 || 1;
  const diffPct = (pair.diff / maxBar) * 100;
  const hsdPct = (hsd / maxBar) * 100;
  const sig = pair.significant;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">
          <span style={{ color: GROUP_COLORS[pair.i] }}>{labels[pair.i]}</span>
          <span className="text-slate-400 mx-1">vs</span>
          <span style={{ color: GROUP_COLORS[pair.j] }}>{labels[pair.j]}</span>
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          sig ? "bg-purple-100 text-purple-600" : "bg-emerald-100 text-emerald-600"
        }`}>
          {sig ? "Significant" : "Not significant"}
        </span>
      </div>

      <div className="relative h-5 bg-slate-100 rounded-full overflow-hidden">
        {/* HSD threshold marker */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
          style={{ left: `${hsdPct}%` }} />
        {/* Diff bar */}
        <div className={`absolute top-0 left-0 h-full rounded-full transition-all ${
          sig ? "bg-purple-400" : "bg-emerald-400"
        }`} style={{ width: `${diffPct}%` }} />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <span>|Δ mean| = <span className="font-mono font-semibold text-slate-700">{pair.diff.toFixed(2)}</span></span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-slate-400 rounded-sm" />
          HSD = <span className="font-mono font-semibold text-slate-700 ml-1">{hsd.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
}

// ── Slider row ─────────────────────────────────────────────────────────────────

function SliderRow({ label, value, min, max, step, onChange, color }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] w-14 shrink-0" style={{ color }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full accent-indigo-500" />
      <span className="text-[11px] font-mono text-slate-600 w-7 text-right">{value}</span>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

const INIT_MEANS = [40, 50, 60];
const INIT_SPREADS = [5, 5, 5];
const SCENARIO_LABELS = ["Collab. Filtering", "Content-Based", "Matrix Fact."];

export default function TukeyHSDExplorer() {
  const [means, setMeans] = useState(INIT_MEANS);
  const [spreads, setSpreads] = useState(INIT_SPREADS);
  const [useScenario, setUseScenario] = useState(false);

  const labels = useScenario ? SCENARIO_LABELS : DEFAULT_LABELS;
  const groups = useMemo(
    () => means.map((mu, i) => makeGroup(mu, spreads[i])),
    [means, spreads]
  );
  const { pairs, hsd, q, mseVal } = useMemo(() => tukeyHSD(groups), [groups]);

  const sigCount = pairs.filter(p => p.significant).length;
  const k = groups.length;
  const N = groups.reduce((s, g) => s + g.length, 0);
  const dfW = N - k;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tukey's HSD Explorer
        </span>
        <button
          onClick={() => setUseScenario(s => !s)}
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
            useScenario
              ? "bg-indigo-50 border-indigo-200 text-indigo-600"
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
          }`}
        >
          {useScenario ? "Scenario: Recommenders" : "Use example labels"}
        </button>
      </div>

      {/* Dot plot */}
      <div className="px-5 pt-4 pb-1">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
          Group distributions
        </div>
        <DotPlot groups={groups} labels={labels} />
        <p className="text-[10px] text-slate-400 mt-0.5">
          Vertical bar = group mean. Each dot is one observation.
        </p>
      </div>

      {/* Controls */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-lg border border-slate-100 p-3 space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: GROUP_COLORS[i] }}>
                {labels[i]}
              </div>
              <SliderRow label="Mean" value={means[i]} min={20} max={80} step={1}
                onChange={v => setMeans(prev => prev.map((m, j) => j === i ? v : m))}
                color={GROUP_COLORS[i]} />
              <SliderRow label="Spread" value={spreads[i]} min={1} max={20} step={1}
                onChange={v => setSpreads(prev => prev.map((s, j) => j === i ? v : s))}
                color={GROUP_COLORS[i]} />
            </div>
          ))}
        </div>
      </div>

      {/* HSD formula strip */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
          HSD Formula
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 font-mono">
          <span>
            HSD = q<sub>α,k,df<sub>W</sub></sub> × √(MSE / n)
          </span>
          <span className="text-slate-400">|</span>
          <span>q = <strong className="text-slate-800">{q.toFixed(3)}</strong></span>
          <span>MSE = <strong className="text-slate-800">{mseVal.toFixed(2)}</strong></span>
          <span>n = <strong className="text-slate-800">{groups[0].length}</strong></span>
          <span>df<sub>W</sub> = <strong className="text-slate-800">{dfW}</strong></span>
          <span className="ml-auto font-semibold text-indigo-700">
            HSD = {hsd.toFixed(2)}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">
          Any pairwise |Δ mean| &gt; {hsd.toFixed(2)} is significant at α = 0.05.
        </p>
      </div>

      {/* Pair comparisons */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Pairwise Comparisons
          </span>
          <span className={`text-[10px] font-semibold ${sigCount > 0 ? "text-purple-600" : "text-emerald-600"}`}>
            {sigCount} / {pairs.length} significant
          </span>
        </div>
        <div className="px-4 py-3 space-y-4 divide-y divide-slate-50">
          {pairs.map((pair, i) => (
            <div key={i} className={i > 0 ? "pt-4" : ""}>
              <PairBar pair={pair} hsd={hsd} labels={labels} />
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-[10px] text-slate-500">
        {[0, 1, 2].map(i => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GROUP_COLORS[i] }} />
            {labels[i]}
          </span>
        ))}
        <span className="flex items-center gap-1.5 ml-auto">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-400" />
          Significant
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 ml-2" />
          Not significant
        </span>
      </div>
    </div>
  );
}
