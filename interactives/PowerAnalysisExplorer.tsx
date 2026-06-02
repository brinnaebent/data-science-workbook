"use client";

import { useState, useMemo } from "react";

// ── Math ───────────────────────────────────────────────────────────────────────

const SQRT2PI = Math.sqrt(2 * Math.PI);

function normalPDF(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (SQRT2PI * sigma);
}

function erfc(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const poly =
    t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const result = poly * Math.exp(-x * x);
  return x >= 0 ? result : 2 - result;
}

// P(Z > z) for standard normal
function normalUpperTail(z: number): number {
  return Math.min(1, Math.max(0, erfc(z / Math.SQRT2) / 2));
}


// Critical z for one-tailed alpha via bisection
function zForAlpha(alpha: number): number {
  let lo = 0, hi = 5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    normalUpperTail(mid) > alpha ? (lo = mid) : (hi = mid);
  }
  return (lo + hi) / 2;
}

// Compute power given effect size d, sample size n, alpha (one-tailed)
function computePower(d: number, n: number, alpha: number): number {
  const se = 1 / Math.sqrt(n);
  const zCrit = zForAlpha(alpha);
  // Power = P(reject | H1 true) = P(Z > zCrit - d/se)
  return normalUpperTail(zCrit - d / se);
}

// ── Chart ──────────────────────────────────────────────────────────────────────

const CHART_H = 180;
const CHART_W = 480;
const N_POINTS = 600;

interface Pt { x: number; y: number }

function buildCurve(mu: number, sigma: number, xLo: number, xHi: number): Pt[] {
  const step = (xHi - xLo) / N_POINTS;
  const pts: Pt[] = [];
  for (let i = 0; i <= N_POINTS; i++) {
    const x = xLo + i * step;
    pts.push({ x, y: normalPDF(x, mu, sigma) });
  }
  return pts;
}

function PowerChart({
  effectSize,
  n,
  alpha,
}: {
  effectSize: number;
  n: number;
  alpha: number;
}) {
  const se = 1 / Math.sqrt(n);
  const mu0 = 0;
  const mu1 = effectSize;

  // X axis range: covers both distributions
  const span = Math.max(4 * se, mu1 + 3 * se);
  const xLo = mu0 - 3.5 * se;
  const xHi = mu0 + span + 2 * se;

  const pts0 = useMemo(() => buildCurve(mu0, se, xLo, xHi), [mu0, se, xLo, xHi]);
  const pts1 = useMemo(() => buildCurve(mu1, se, xLo, xHi), [mu1, se, xLo, xHi]);

  const maxY = normalPDF(mu0, mu0, se);
  const critX = mu0 + zForAlpha(alpha) * se;

  function sx(x: number) {
    return ((x - xLo) / (xHi - xLo)) * CHART_W;
  }
  function sy(y: number) {
    return CHART_H - (y / maxY) * CHART_H * 0.88;
  }

  function curvePath(pts: Pt[]) {
    return "M " + pts.map((p) => `${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" L ");
  }

  // Alpha region: right tail of H0 from critX
  function fillPath(pts: Pt[], fromX: number, toX: number) {
    const seg = pts.filter((p) => p.x >= fromX && p.x <= toX);
    if (seg.length < 2) return "";
    const line = seg.map((p) => `${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" L ");
    return `M ${line} L ${sx(seg[seg.length - 1].x).toFixed(1)} ${CHART_H} L ${sx(seg[0].x).toFixed(1)} ${CHART_H} Z`;
  }

  const alphaFill = fillPath(pts0, critX, xHi);
  const powerFill = fillPath(pts1, critX, xHi);
  const betaFill = fillPath(pts1, xLo, critX);

  const critSx = sx(critX);

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: CHART_H }}
    >
      {/* Power fill (green) — right of crit under H1 */}
      {powerFill && <path d={powerFill} fill="#10b981" fillOpacity={0.30} />}
      {/* Beta fill (rose) — left of crit under H1 */}
      {betaFill && <path d={betaFill} fill="#f43f5e" fillOpacity={0.18} />}
      {/* Alpha fill (amber) — right of crit under H0 */}
      {alphaFill && <path d={alphaFill} fill="#f59e0b" fillOpacity={0.35} />}

      {/* H0 curve — indigo */}
      <path d={curvePath(pts0)} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />
      {/* H1 curve — emerald */}
      <path d={curvePath(pts1)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Critical value line */}
      <line
        x1={critSx} y1={0} x2={critSx} y2={CHART_H}
        stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"
      />

      {/* x-axis */}
      <line x1={0} y1={CHART_H} x2={CHART_W} y2={CHART_H} stroke="#e2e8f0" strokeWidth="1" />

      {/* H0 / H1 labels */}
      <text
        x={sx(mu0)}
        y={sy(normalPDF(mu0, mu0, se)) - 6}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#6366f1"
      >
        H₀
      </text>
      {mu1 > 0.01 && (
        <text
          x={sx(mu1)}
          y={sy(normalPDF(mu1, mu1, se)) - 6}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#10b981"
        >
          H₁
        </text>
      )}
    </svg>
  );
}

// ── Slider ─────────────────────────────────────────────────────────────────────

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-xs font-mono font-bold text-slate-700">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-slate-200 cursor-pointer accent-indigo-500"
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

// ── Power label ────────────────────────────────────────────────────────────────

function powerLabel(power: number): { text: string; color: string } {
  if (power >= 0.95) return { text: "Excellent — very unlikely to miss a real effect", color: "text-emerald-700" };
  if (power >= 0.80) return { text: "Adequate — meets the conventional 80% threshold", color: "text-emerald-600" };
  if (power >= 0.60) return { text: "Marginal — risk of missing real effects is high", color: "text-amber-700" };
  return { text: "Underpowered — likely to miss real effects", color: "text-rose-600" };
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function PowerAnalysisExplorer() {
  const [effectSize, setEffectSize] = useState(0.5);
  const [n, setN] = useState(40);
  const [alpha, setAlpha] = useState(0.05);

  const power = useMemo(() => computePower(effectSize, n, alpha), [effectSize, n, alpha]);
  const beta = 1 - power;
  const lbl = powerLabel(power);

  const powerPct = (power * 100).toFixed(1);
  const betaPct = (beta * 100).toFixed(1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Power Analysis Explorer
        </span>
      </div>

      {/* Description */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-xs text-slate-500 leading-relaxed">
          The indigo curve is the null distribution (H₀); the green curve is the alternative (H₁). The
          dashed line is the critical value. Adjust the sliders to see how power changes.
        </p>
      </div>

      {/* Chart */}
      <div className="px-5 pb-1">
        <PowerChart effectSize={effectSize} n={n} alpha={alpha} />
        <div className="h-px bg-slate-200 w-full" />
      </div>

      {/* Legend */}
      <div className="px-5 pt-2 pb-1 flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded" style={{ background: "rgba(99,102,241,0.9)", border: "1px solid #6366f1" }} />
          H₀ (null)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded" style={{ background: "rgba(16,185,129,0.9)", border: "1px solid #10b981" }} />
          H₁ (alternative)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded" style={{ background: "rgba(16,185,129,0.30)", border: "1px solid #10b981" }} />
          Power (1 − β)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded" style={{ background: "rgba(244,63,94,0.18)", border: "1px solid #f43f5e" }} />
          β (Type II error)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded" style={{ background: "rgba(245,158,11,0.35)", border: "1px solid #f59e0b" }} />
          α (Type I error)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0" style={{ borderTop: "1.5px dashed #f59e0b", display: "inline-block" }} />
          Critical value
        </span>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 space-y-4 border-t border-slate-100">
        <Slider
          label="Effect size (Cohen's d)"
          value={effectSize}
          min={0.1}
          max={1.0}
          step={0.01}
          format={(v) => v.toFixed(2)}
          onChange={setEffectSize}
        />
        <Slider
          label="Sample size (n)"
          value={n}
          min={5}
          max={300}
          step={1}
          format={(v) => String(v)}
          onChange={setN}
        />
        <div>
          <span className="block text-xs font-semibold text-slate-600 mb-1.5">
            Significance level (α)
          </span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
            {([0.1, 0.05, 0.01] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAlpha(a)}
                className={`flex-1 py-1.5 transition-colors ${
                  alpha === a
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Readout */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 bg-slate-50 divide-y divide-slate-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-700">Power (1 − β)</span>
          </div>
          <span
            className={`text-lg font-bold tabular-nums ${
              power >= 0.8 ? "text-emerald-700" : power >= 0.6 ? "text-amber-600" : "text-rose-600"
            }`}
          >
            {powerPct}%
          </span>
        </div>
        <div className={`px-4 py-2 text-[11px] font-medium ${lbl.color}`}>{lbl.text}</div>
      </div>

      {/* Stats strip */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-sm font-bold text-indigo-700">{effectSize.toFixed(2)}</div>
            <div className="text-[10px] text-slate-400">Effect size (d)</div>
          </div>
          <div>
            <div className="text-sm font-bold text-indigo-700">{n}</div>
            <div className="text-[10px] text-slate-400">Sample size</div>
          </div>
          <div>
            <div
              className={`text-sm font-bold ${
                power >= 0.8 ? "text-emerald-700" : power >= 0.6 ? "text-amber-600" : "text-rose-600"
              }`}
            >
              {powerPct}%
            </div>
            <div className="text-[10px] text-slate-400">Power</div>
          </div>
          <div>
            <div className="text-sm font-bold text-rose-500">{betaPct}%</div>
            <div className="text-[10px] text-slate-400">β (miss rate)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
