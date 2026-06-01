"use client";

import { useState, useMemo } from "react";

// ── Math ───────────────────────────────────────────────────────────────────────

function mean(d: number[]) { return d.reduce((s, x) => s + x, 0) / d.length; }

function anova(groups: number[][]) {
  const k = groups.length;
  const N = groups.reduce((s, g) => s + g.length, 0);
  const grandMean = mean(groups.flat());

  let SSB = 0; // between
  let SSW = 0; // within

  for (const g of groups) {
    const gm = mean(g);
    SSB += g.length * (gm - grandMean) ** 2;
    SSW += g.reduce((s, x) => s + (x - gm) ** 2, 0);
  }

  const dfB = k - 1;
  const dfW = N - k;
  const MSB = SSB / dfB;
  const MSW = SSW / dfW;
  const F = MSW > 0 ? MSB / MSW : 0;

  // p-value via F-distribution (regularized incomplete beta)
  const p = fPValue(F, dfB, dfW);

  return { SSB, SSW, SST: SSB + SSW, MSB, MSW, F, dfB, dfW, p, grandMean };
}

function lgamma(x: number): number {
  const c = [76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];
  let y = x, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += c[j] / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}
function betacf(a: number, b: number, x: number): number {
  const MAXIT = 200, EPS = 3e-7, qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let h = d;
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
function fPValue(F: number, df1: number, df2: number): number {
  if (F <= 0) return 1;
  const x = df2 / (df2 + df1 * F);
  return ibeta(df2 / 2, df1 / 2, x);
}

// ── Group data generator ───────────────────────────────────────────────────────

function makeGroup(mu: number, spread: number, n = 12): number[] {
  // Deterministic spread — evenly spaced around mu
  return Array.from({ length: n }, (_, i) => mu + spread * ((i / (n - 1)) * 2 - 1));
}

// ── Chart: dot plot per group ──────────────────────────────────────────────────

const CW = 460;
const CH = 160;
const P = { t: 12, r: 16, b: 28, l: 40 };

const GROUP_COLORS = ["#6366f1", "#0ea5e9", "#10b981"];
const GROUP_LABELS = ["Group A", "Group B", "Group C"];

function DotPlot({ groups, grandMean }: { groups: number[][]; grandMean: number }) {
  const all = groups.flat();
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const range = hi - lo || 1;
  const pw = CW - P.l - P.r;
  const ph = CH - P.t - P.b;
  const rowH = ph / groups.length;

  const sx = (v: number) => P.l + ((v - lo) / range) * pw;

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      {/* Grand mean line */}
      <line x1={sx(grandMean)} y1={P.t} x2={sx(grandMean)} y2={P.t + ph}
        stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />

      {groups.map((g, gi) => {
        const gm = mean(g);
        const color = GROUP_COLORS[gi];
        const midY = P.t + (gi + 0.5) * rowH;

        return (
          <g key={gi}>
            {/* Group mean line */}
            <line x1={sx(gm)} y1={midY - rowH * 0.35} x2={sx(gm)} y2={midY + rowH * 0.35}
              stroke={color} strokeWidth="2" />

            {/* Grand mean bracket */}
            <line x1={sx(grandMean)} y1={midY} x2={sx(gm)} y2={midY}
              stroke={color} strokeOpacity={0.4} strokeWidth="1.5" strokeDasharray="3,2" />

            {/* Data dots */}
            {g.map((v, i) => (
              <circle key={i} cx={sx(v)} cy={midY} r={4} fill={color} fillOpacity={0.6} />
            ))}

            {/* Group label */}
            <text x={P.l - 6} y={midY + 4} textAnchor="end" fontSize="9" fill={color} fontWeight="600">
              {GROUP_LABELS[gi]}
            </text>
          </g>
        );
      })}

      {/* Baseline */}
      <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph} stroke="#e2e8f0" />
      <text x={sx(grandMean)} y={P.t + ph + 12} textAnchor="middle" fontSize="8" fill="#94a3b8">
        grand mean
      </text>
    </svg>
  );
}

// ── Variance bar ───────────────────────────────────────────────────────────────

function VarianceBar({ ssb, ssw }: { ssb: number; ssw: number }) {
  const total = ssb + ssw || 1;
  const bPct = (ssb / total) * 100;
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
        Variance decomposition (SST = SSB + SSW)
      </div>
      <div className="h-4 rounded-full overflow-hidden flex">
        <div className="h-full transition-all bg-indigo-400" style={{ width: `${bPct}%` }} />
        <div className="h-full flex-1 bg-sky-200" />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>
          <span className="inline-block w-2 h-2 rounded-sm bg-indigo-400 mr-1" />
          SSB {bPct.toFixed(0)}%
        </span>
        <span>
          <span className="inline-block w-2 h-2 rounded-sm bg-sky-200 mr-1" />
          SSW {(100 - bPct).toFixed(0)}%
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
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-xs w-14 shrink-0" style={{ color }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 min-w-0 h-1.5 rounded-full accent-indigo-500" />
      <span className="text-xs font-mono text-slate-600 w-10 shrink-0 text-right">{value}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const INIT_MEANS = [40, 50, 60];
const INIT_SPREADS = [5, 5, 5];

export default function ANOVAVariancePartitioner() {
  const [means, setMeans] = useState(INIT_MEANS);
  const [spreads, setSpreads] = useState(INIT_SPREADS);

  const groups = useMemo(() => means.map((mu, i) => makeGroup(mu, spreads[i])), [means, spreads]);
  const { SSB, SSW, SST, MSB, MSW, F, dfB, dfW, p, grandMean } = useMemo(() => anova(groups), [groups]);
  const sig = p < 0.05;

  function setMean(i: number, v: number) {
    setMeans(prev => prev.map((m, j) => j === i ? v : m));
  }
  function setSpread(i: number, v: number) {
    setSpreads(prev => prev.map((s, j) => j === i ? v : s));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          ANOVA Variance Partitioner
        </span>
      </div>

      {/* Dot plot */}
      <div className="px-5 pt-4 pb-2">
        <div className="text-xs font-semibold text-slate-600 mb-1">Group distributions</div>
        <DotPlot groups={groups} grandMean={grandMean} />
        <p className="text-[10px] text-slate-400 mt-1">
          Vertical colored bars = group means. Dashed line = grand mean. Brackets show between-group distance.
        </p>
      </div>

      {/* Controls */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-lg border border-slate-100 p-3 space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: GROUP_COLORS[i] }}>
                {GROUP_LABELS[i]}
              </div>
              <SliderRow label="Mean" value={means[i]} min={20} max={80} step={1}
                onChange={v => setMean(i, v)} color={GROUP_COLORS[i]} />
              <SliderRow label="Spread" value={spreads[i]} min={1} max={20} step={1}
                onChange={v => setSpread(i, v)} color={GROUP_COLORS[i]} />
            </div>
          ))}
        </div>
      </div>

      {/* Variance bar */}
      <div className="px-5 pb-4">
        <VarianceBar ssb={SSB} ssw={SSW} />
      </div>

      {/* ANOVA table */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">ANOVA Table</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase">Source</th>
              <th className="text-right px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase">SS</th>
              <th className="text-right px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase">df</th>
              <th className="text-right px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase">MS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-50">
              <td className="px-4 py-2 font-medium text-indigo-700">Between groups (SSB)</td>
              <td className="px-4 py-2 text-right font-mono text-slate-700">{SSB.toFixed(1)}</td>
              <td className="px-4 py-2 text-right font-mono text-slate-700">{dfB}</td>
              <td className="px-4 py-2 text-right font-mono text-slate-700">{MSB.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-slate-50">
              <td className="px-4 py-2 font-medium text-sky-700">Within groups (SSW)</td>
              <td className="px-4 py-2 text-right font-mono text-slate-700">{SSW.toFixed(1)}</td>
              <td className="px-4 py-2 text-right font-mono text-slate-700">{dfW}</td>
              <td className="px-4 py-2 text-right font-mono text-slate-700">{MSW.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold text-slate-600">Total (SST)</td>
              <td className="px-4 py-2 text-right font-mono font-semibold text-slate-700">{SST.toFixed(1)}</td>
              <td className="px-4 py-2 text-right font-mono text-slate-700">{dfB + dfW}</td>
              <td className="px-4 py-2 text-right text-slate-400">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* F-stat + p-value */}
      <div className={`mx-5 mb-4 rounded-lg border px-4 py-3 ${sig ? "bg-violet-50 border-violet-200" : "bg-emerald-50 border-emerald-200"}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-0.5">F-statistic</div>
            <div className="text-2xl font-bold font-mono text-slate-800">{F.toFixed(3)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">MSB / MSW = {MSB.toFixed(2)} / {MSW.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-0.5">p-value</div>
            <div className={`text-2xl font-bold font-mono ${sig ? "text-violet-600" : "text-emerald-600"}`}>
              {p < 0.001 ? "< 0.001" : p.toFixed(4)}
            </div>
            <div className={`text-[10px] font-semibold mt-0.5 ${sig ? "text-violet-600" : "text-emerald-600"}`}>
              {sig ? "Reject H₀ — means differ" : "Fail to reject H₀"}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-[10px] text-slate-500">
        {GROUP_COLORS.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
            {GROUP_LABELS[i]}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0" style={{ borderTop: "1.5px dashed #94a3b8", display: "inline-block" }} />
          Grand mean
        </span>
      </div>
    </div>
  );
}
