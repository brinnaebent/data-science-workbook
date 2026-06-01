"use client";

import { useState, useMemo } from "react";

// ── Math ───────────────────────────────────────────────────────────────────────

const SQRT2PI = Math.sqrt(2 * Math.PI);

function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / SQRT2PI;
}

function erfc(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const result = poly * Math.exp(-x * x);
  return x >= 0 ? result : 2 - result;
}

// One-tailed: P(Z > z)
function normalUpperTail(z: number): number {
  return Math.min(1, Math.max(0, erfc(z / Math.SQRT2) / 2));
}

// ── Chart ──────────────────────────────────────────────────────────────────────

const CHART_H = 160;
const CHART_W = 400;
const N_POINTS = 500;
const X_LO = -4;
const X_HI = 4;

interface Pt { x: number; y: number }

function buildCurve(): Pt[] {
  const step = (X_HI - X_LO) / N_POINTS;
  const pts: Pt[] = [];
  for (let i = 0; i <= N_POINTS; i++) {
    const x = X_LO + i * step;
    pts.push({ x, y: normalPDF(x) });
  }
  return pts;
}

function Chart({ stat, tail }: { stat: number; tail: "one" | "two" }) {
  const pts = useMemo(buildCurve, []);
  const maxY = normalPDF(0);

  function sx(x: number) { return ((x - X_LO) / (X_HI - X_LO)) * CHART_W; }
  function sy(y: number) { return CHART_H - (y / maxY) * CHART_H * 0.88; }

  function curvePath(pts: Pt[]) {
    return "M " + pts.map((p) => `${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" L ");
  }

  function fillPath(xLo: number, xHi: number) {
    const seg = pts.filter((p) => p.x >= xLo && p.x <= xHi);
    if (seg.length < 2) return "";
    const line = seg.map((p) => `${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" L ");
    return `M ${line} L ${sx(seg[seg.length - 1].x).toFixed(1)} ${CHART_H} L ${sx(seg[0].x).toFixed(1)} ${CHART_H} Z`;
  }

  const rightFill = fillPath(stat, X_HI);
  const leftFill = tail === "two" ? fillPath(X_LO, -stat) : "";
  const statSx = sx(stat);

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: CHART_H }}
    >
      {/* Shaded p-value region */}
      {rightFill && <path d={rightFill} fill="#6366f1" fillOpacity={0.25} />}
      {leftFill && <path d={leftFill} fill="#6366f1" fillOpacity={0.25} />}

      {/* Curve */}
      <path d={curvePath(pts)} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />

      {/* Test statistic line */}
      <line x1={statSx} y1={0} x2={statSx} y2={CHART_H} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
      {tail === "two" && (
        <line x1={sx(-stat)} y1={0} x2={sx(-stat)} y2={CHART_H} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
      )}

      {/* x-axis */}
      <line x1={0} y1={CHART_H} x2={CHART_W} y2={CHART_H} stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  );
}

// ── Slider ─────────────────────────────────────────────────────────────────────

function Slider({ label, value, min, max, step, format, onChange }: {
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
        className="w-full h-1.5 rounded-full appearance-none bg-slate-200 cursor-pointer accent-indigo-500"
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

// ── Significance label ─────────────────────────────────────────────────────────

function significanceLabel(p: number, alpha: number): { text: string; color: string } {
  if (p < 0.001) return { text: "Very strong evidence against H₀ (p < 0.001)", color: "text-emerald-700" };
  if (p < alpha) return { text: `Statistically significant at α = ${alpha} — reject H₀`, color: "text-emerald-700" };
  if (p < 0.1)  return { text: `Not significant at α = ${alpha} — fail to reject H₀`, color: "text-amber-700" };
  return { text: `No evidence against H₀ — fail to reject`, color: "text-slate-500" };
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function PValueVisualizer() {
  const [stat, setStat] = useState(1.96);
  const [tail, setTail] = useState<"one" | "two">("two");
  const [alpha, setAlpha] = useState(0.05);

  const oneTail = useMemo(() => normalUpperTail(stat), [stat]);
  const pValue = tail === "two" ? Math.min(1, oneTail * 2) : oneTail;
  const reject = pValue < alpha;
  const sig = significanceLabel(pValue, alpha);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          P-Value Visualizer
        </span>
      </div>

      <div className="px-5 pt-4 pb-2">
        <p className="text-xs text-slate-500 leading-relaxed">
          The shaded area is the p-value, the probability of observing a test statistic at least this extreme under the null hypothesis (standard normal). Drag the slider to see how the p-value changes.
        </p>
      </div>

      {/* Controls */}
      <div className="px-5 py-3 space-y-4">
        <Slider
          label="Test statistic (z)"
          value={stat} min={0} max={4} step={0.01}
          format={(v) => v.toFixed(2)}
          onChange={setStat}
        />

        <div className="flex items-center gap-4">
          {/* Tail selector */}
          <div className="flex-1">
            <span className="block text-xs font-semibold text-slate-600 mb-1.5">Tail</span>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
              {(["one", "two"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTail(t)}
                  className={`flex-1 py-1.5 transition-colors ${
                    tail === t
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t === "one" ? "One-tailed" : "Two-tailed"}
                </button>
              ))}
            </div>
          </div>

          {/* Alpha selector */}
          <div className="flex-1">
            <span className="block text-xs font-semibold text-slate-600 mb-1.5">Significance level (α)</span>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
              {([0.10, 0.05, 0.01] as const).map((a) => (
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
      </div>

      {/* Chart */}
      <div className="px-5 pb-1">
        <Chart stat={stat} tail={tail} />
        <div className="h-px bg-slate-200 w-full" />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>−4</span>
          <span className="font-medium" style={{ color: "#f59e0b" }}>
            {tail === "two" ? `±${stat.toFixed(2)}` : `z = ${stat.toFixed(2)}`}
          </span>
          <span>+4</span>
        </div>
      </div>

      {/* p-value readout */}
      <div className="mx-5 my-3 rounded-lg border border-slate-100 bg-slate-50 divide-y divide-slate-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-700">p-value</span>
            <span className="ml-2 text-[10px] text-slate-400">
              {tail === "two" ? "P(|Z| ≥ " : "P(Z ≥ "}
              {stat.toFixed(2)})
            </span>
          </div>
          <span
            className={`text-lg font-bold tabular-nums ${
              reject ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            {pValue < 0.0001 ? "< 0.0001" : pValue.toFixed(4)}
          </span>
        </div>
        <div className={`px-4 py-2 text-[11px] font-medium ${sig.color}`}>
          {sig.text}
        </div>
      </div>

      {/* Callout: effect vs significance */}
      {reject && stat < 2.5 && (
        <div className="mx-5 mb-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 text-[11px] text-amber-800 leading-relaxed">
          <strong>Reminder:</strong> statistical significance does not imply practical importance. Always consider effect size alongside the p-value.
        </div>
      )}

      {/* Stats strip */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-sm font-bold text-indigo-700">{stat.toFixed(2)}</div>
            <div className="text-[10px] text-slate-400">Test statistic (z)</div>
          </div>
          <div>
            <div className={`text-sm font-bold ${reject ? "text-emerald-700" : "text-slate-600"}`}>
              {pValue < 0.0001 ? "< 0.0001" : pValue.toFixed(4)}
            </div>
            <div className="text-[10px] text-slate-400">p-value</div>
          </div>
          <div>
            <div className={`text-sm font-bold ${reject ? "text-emerald-700" : "text-rose-600"}`}>
              {reject ? "Reject H₀" : "Fail to reject H₀"}
            </div>
            <div className="text-[10px] text-slate-400">Decision at α = {alpha}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-slate-100 flex items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded" style={{ background: "rgba(99,102,241,0.25)", border: "1px solid #6366f1" }} />
          p-value (shaded area)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5" style={{ borderTop: "2px dashed #f59e0b", width: 12 }} />
          Test statistic
        </span>
      </div>
    </div>
  );
}
