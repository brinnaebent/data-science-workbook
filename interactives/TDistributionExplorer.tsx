"use client";

import { useState, useMemo } from "react";

// ── Math helpers ───────────────────────────────────────────────────────────────

const SQRT2PI = Math.sqrt(2 * Math.PI);

function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / SQRT2PI;
}

// log-gamma via Lanczos approximation
function logGamma(z: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function tPDF(x: number, df: number): number {
  const logCoeff = logGamma((df + 1) / 2) - 0.5 * Math.log(df * Math.PI) - logGamma(df / 2);
  return Math.exp(logCoeff) * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
}

// Numerical integration of tPDF from -∞ to x for tail probability
function tCDF(x: number, df: number): number {
  const N = 400;
  const lo = Math.max(-10, x - 20);
  // integrate from lo to x
  const step = (x - lo) / N;
  if (step <= 0) return 0;
  let sum = 0;
  for (let i = 0; i < N; i++) {
    const a = lo + i * step;
    const b = lo + (i + 1) * step;
    sum += (tPDF(a, df) + tPDF(b, df)) / 2;
  }
  return Math.min(1, Math.max(0, sum * step + (lo <= -10 ? 0.5 * erfc(10 / Math.SQRT2) : 0)));
}

// Simple erfc for the normal tail
function erfc(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const result = poly * Math.exp(-x * x);
  return x >= 0 ? result : 2 - result;
}

function normalTailProb(t: number): number {
  // P(|X| > t) for standard normal
  return erfc(t / Math.SQRT2);
}

function tTailProb(t: number, df: number): number {
  // P(|X| > t) via numerical integration of both tails
  const N = 600;
  const hi = Math.max(t, 0.001);
  const step = hi / N;
  let area = 0;
  for (let i = 0; i < N; i++) {
    const a = i * step;
    const b = (i + 1) * step;
    area += (tPDF(a, df) + tPDF(b, df)) / 2 * step;
  }
  // P(X > hi) = 0.5 - area_from_0_to_hi (by symmetry)
  return Math.min(1, Math.max(0, 2 * (0.5 - area)));
}

// ── Chart ──────────────────────────────────────────────────────────────────────

const CHART_H = 170;
const CHART_W = 400;
const N_POINTS = 400;
const X_DOMAIN: [number, number] = [-5, 5];

interface CurvePoint { x: number; y: number }

function buildCurve(fn: (x: number) => number): CurvePoint[] {
  const [lo, hi] = X_DOMAIN;
  const step = (hi - lo) / N_POINTS;
  const pts: CurvePoint[] = [];
  for (let i = 0; i <= N_POINTS; i++) {
    const x = lo + i * step;
    pts.push({ x, y: Math.max(0, fn(x)) });
  }
  return pts;
}

function OverlayChart({
  tPoints,
  normalPoints,
  threshold,
}: {
  tPoints: CurvePoint[];
  normalPoints: CurvePoint[];
  threshold: number;
}) {
  const [xMin, xMax] = X_DOMAIN;
  const maxY = Math.max(...normalPoints.map((p) => p.y), 0.001);

  function toSvgX(x: number): number {
    return ((x - xMin) / (xMax - xMin)) * CHART_W;
  }
  function toSvgY(y: number): number {
    return CHART_H - (y / maxY) * CHART_H * 0.88;
  }

  function buildPath(pts: CurvePoint[]): string {
    return "M " + pts.map((p) => `${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`).join(" L ");
  }

  function buildFillPath(pts: CurvePoint[], xLo: number, xHi: number): string {
    const filtered = pts.filter((p) => p.x >= xLo && p.x <= xHi);
    if (filtered.length < 2) return "";
    const line = "M " + filtered.map((p) => `${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`).join(" L ");
    const lastSx = toSvgX(filtered[filtered.length - 1].x).toFixed(1);
    const firstSx = toSvgX(filtered[0].x).toFixed(1);
    return `${line} L ${lastSx} ${CHART_H} L ${firstSx} ${CHART_H} Z`;
  }

  const tLinePath = buildPath(tPoints);
  const normalLinePath = buildPath(normalPoints);
  const threshSvgX = toSvgX(threshold);
  const negThreshSvgX = toSvgX(-threshold);

  // Tail fill paths (beyond ±threshold)
  const tLeftFill = buildFillPath(tPoints, xMin, -threshold);
  const tRightFill = buildFillPath(tPoints, threshold, xMax);

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: CHART_H }}
    >
      {/* t-distribution tail shading */}
      {tLeftFill && <path d={tLeftFill} fill="#7c3aed" fillOpacity={0.18} />}
      {tRightFill && <path d={tRightFill} fill="#7c3aed" fillOpacity={0.18} />}

      {/* Normal curve */}
      <path d={normalLinePath} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,3" strokeLinejoin="round" />

      {/* t-distribution curve */}
      <path d={tLinePath} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round" />

      {/* Threshold lines */}
      <line x1={threshSvgX} y1={0} x2={threshSvgX} y2={CHART_H} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1={negThreshSvgX} y1={0} x2={negThreshSvgX} y2={CHART_H} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
    </svg>
  );
}

// ── Slider ─────────────────────────────────────────────────────────────────────

function Slider({
  label, value, min, max, step, format, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-xs font-mono font-bold text-slate-700">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-slate-200 cursor-pointer accent-violet-500"
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

// ── Convergence label ──────────────────────────────────────────────────────────

function convergenceLabel(df: number): string {
  if (df <= 3) return "Very heavy tails — t behaves very differently from normal";
  if (df <= 8) return "Heavy tails — noticeably wider than normal";
  if (df <= 15) return "Moderately heavy tails — close to normal but still wider";
  if (df <= 30) return "Nearly normal — tails are close to converging";
  return "Effectively normal — t ≈ standard normal at this sample size";
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function TDistributionExplorer() {
  const [df, setDf] = useState(5);
  const [threshold, setThreshold] = useState(2.0);

  const tPoints = useMemo(() => buildCurve((x) => tPDF(x, df)), [df]);
  const normalPoints = useMemo(() => buildCurve(normalPDF), []);

  const tTail = useMemo(() => tTailProb(threshold, df), [threshold, df]);
  const normalTail = useMemo(() => normalTailProb(threshold), [threshold]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          t-Distribution Explorer
        </span>
      </div>

      {/* Description */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-xs text-slate-500 leading-relaxed">
          The t-distribution (violet) overlaid with the standard normal (dashed gray). As degrees of freedom increase — reflecting a larger sample — the heavier tails shrink and the curves converge.
        </p>
      </div>

      {/* Sliders */}
      <div className="px-5 py-3 space-y-4">
        <Slider
          label="Degrees of freedom (df = n − 1)"
          value={df} min={1} max={60} step={1}
          format={(v) => `${Math.round(v)}`}
          onChange={(v) => setDf(Math.round(v))}
        />
        <Slider
          label="Threshold — test statistic |t*|"
          value={threshold} min={0.5} max={4} step={0.1}
          format={(v) => v.toFixed(1)}
          onChange={setThreshold}
        />
      </div>

      {/* Chart */}
      <div className="px-5 pb-1">
        <OverlayChart tPoints={tPoints} normalPoints={normalPoints} threshold={threshold} />
        <div className="h-px bg-slate-200 w-full" />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>−5</span>
          <span style={{ color: "#f59e0b" }} className="font-medium">±{threshold.toFixed(1)}</span>
          <span>+5</span>
        </div>
      </div>

      {/* Tail probability comparison */}
      <div className="mx-5 my-3 rounded-lg border border-slate-100 bg-slate-50 divide-y divide-slate-100">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-violet-700">t-distribution</span>
            <span className="ml-2 text-[10px] text-slate-400">df = {df}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-violet-700">{(tTail * 100).toFixed(2)}%</span>
            <span className="block text-[10px] text-slate-400">P(|X| &gt; {threshold.toFixed(1)})</span>
          </div>
        </div>
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Standard normal</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-slate-500">{(normalTail * 100).toFixed(2)}%</span>
            <span className="block text-[10px] text-slate-400">P(|Z| &gt; {threshold.toFixed(1)})</span>
          </div>
        </div>
        {tTail > normalTail && (
          <div className="px-4 py-2 text-[10px] text-rose-600 font-medium">
            t assigns {((tTail - normalTail) * 100).toFixed(2)} pp more probability to the tails — using normal here would overstate significance.
          </div>
        )}
      </div>

      {/* Convergence status */}
      <div className="px-5 pb-4">
        <p className="text-[10px] text-slate-400 italic">{convergenceLabel(df)}</p>
      </div>

      {/* Stats strip */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-sm font-bold text-violet-700">{df}</div>
            <div className="text-[10px] text-slate-400">Degrees of freedom</div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-600">
              {df > 2 ? (df / (df - 2)).toFixed(3) : "∞"}
            </div>
            <div className="text-[10px] text-slate-400">Variance (df / df−2)</div>
          </div>
          <div>
            <div className="text-sm font-bold text-amber-600">
              {df >= 30 ? "≈ 0" : ((tTail - normalTail) * 100).toFixed(2) + " pp"}
            </div>
            <div className="text-[10px] text-slate-400">Tail excess vs. normal</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-slate-100 flex items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-violet-500" />
          t-distribution (df = {df})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5" style={{ borderTop: "1.5px dashed #94a3b8", width: 12 }} />
          Standard normal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5" style={{ borderTop: "1.5px dashed #f59e0b", width: 12 }} />
          Threshold ±{threshold.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
