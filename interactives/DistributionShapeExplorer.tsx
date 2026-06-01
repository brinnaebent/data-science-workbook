"use client";

import { useState, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type DistId = "normal" | "poisson" | "exponential" | "uniform";
type ViewMode = "pdf" | "cdf";

interface DistConfig {
  id: DistId;
  label: string;
  description: string;
  accentHex: string;
  discrete: boolean;
  params: ParamDef[];
  // Fixed axis domain — never changes with params, so the curve visibly moves
  domain: [number, number];
  pdf: (x: number, params: number[]) => number;
  mean: (params: number[]) => number;
  variance: (params: number[]) => number;
  modeLabel: (params: number[]) => string;
}

interface ParamDef {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  format: (v: number) => string;
}

// ── Math helpers ───────────────────────────────────────────────────────────────

function normalPDF(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

function poissonPMF(k: number, lambda: number): number {
  if (k < 0 || !Number.isInteger(k)) return 0;
  let logP = -lambda + k * Math.log(Math.max(lambda, 1e-10));
  for (let i = 1; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

function exponentialPDF(x: number, lambda: number): number {
  if (x < 0) return 0;
  return lambda * Math.exp(-lambda * x);
}

function uniformPDF(x: number, a: number, b: number): number {
  if (b <= a) return 0;
  return x >= a && x <= b ? 1 / (b - a) : 0;
}

// ── Distribution configs ───────────────────────────────────────────────────────

const DISTRIBUTIONS: DistConfig[] = [
  {
    id: "normal",
    label: "Normal",
    description: "Bell-shaped, symmetric. Described by mean μ and std dev σ. Shifting μ moves the curve; increasing σ flattens and widens it.",
    accentHex: "#6366f1",
    discrete: false,
    params: [
      { key: "mu", label: "Mean (μ)", min: -3, max: 3, step: 0.5, default: 0, format: (v) => v.toFixed(1) },
      { key: "sigma", label: "Std Dev (σ)", min: 0.3, max: 3, step: 0.1, default: 1, format: (v) => v.toFixed(1) },
    ],
    // Fixed domain covers the full slider range with room on each side
    domain: [-6, 6],
    pdf: (x, [mu, sigma]) => normalPDF(x, mu, sigma),
    mean: ([mu]) => mu,
    variance: ([, sigma]) => sigma * sigma,
    modeLabel: ([mu]) => mu.toFixed(1),
  },
  {
    id: "poisson",
    label: "Poisson",
    description: "Counts of events in a fixed interval. Right-skewed for small λ, approaches symmetric as λ grows. Mean = Variance = λ.",
    accentHex: "#7c3aed",
    discrete: true,
    params: [
      { key: "lambda", label: "Rate (λ)", min: 0.5, max: 15, step: 0.5, default: 3, format: (v) => v.toFixed(1) },
    ],
    domain: [0, 30],
    pdf: (x, [lambda]) => poissonPMF(Math.round(x), lambda),
    mean: ([lambda]) => lambda,
    variance: ([lambda]) => lambda,
    modeLabel: ([lambda]) => `${Math.floor(lambda)}`,
  },
  {
    id: "exponential",
    label: "Exponential",
    description: "Time between events in a Poisson process. Higher λ = faster decay, tighter mass near zero. Mean = 1/λ.",
    accentHex: "#e11d48",
    discrete: false,
    params: [
      { key: "lambda", label: "Rate (λ)", min: 0.2, max: 3, step: 0.1, default: 1, format: (v) => v.toFixed(1) },
    ],
    domain: [0, 15],
    pdf: (x, [lambda]) => exponentialPDF(x, lambda),
    mean: ([lambda]) => 1 / lambda,
    variance: ([lambda]) => 1 / (lambda * lambda),
    modeLabel: () => "0",
  },
  {
    id: "uniform",
    label: "Uniform",
    description: "Every value in [a, b] equally likely. PDF height = 1/(b−a). Wider interval → lower, flatter curve.",
    accentHex: "#059669",
    discrete: false,
    params: [
      { key: "a", label: "Min (a)", min: -5, max: 4, step: 0.5, default: 0, format: (v) => v.toFixed(1) },
      { key: "b", label: "Max (b)", min: -4, max: 10, step: 0.5, default: 4, format: (v) => v.toFixed(1) },
    ],
    domain: [-6, 11],
    pdf: (x, [a, b]) => uniformPDF(x, a, b),
    mean: ([a, b]) => (a + b) / 2,
    variance: ([a, b]) => ((b - a) ** 2) / 12,
    modeLabel: ([a, b]) => `any in [${a.toFixed(1)}, ${b.toFixed(1)}]`,
  },
];

// ── Sample points over the fixed domain ───────────────────────────────────────

const N_POINTS = 200;

function samplePoints(dist: DistConfig, params: number[]): { x: number; pdf: number; cdf: number }[] {
  const [xMin, xMax] = dist.domain;
  const points: { x: number; pdf: number; cdf: number }[] = [];

  if (dist.discrete) {
    const lo = Math.max(0, Math.floor(xMin));
    const hi = Math.ceil(xMax);
    let cum = 0;
    for (let k = lo; k <= hi; k++) {
      const p = dist.pdf(k, params);
      cum = Math.min(1, cum + p);
      points.push({ x: k, pdf: p, cdf: cum });
    }
  } else {
    const step = (xMax - xMin) / N_POINTS;
    let cum = 0;
    for (let i = 0; i <= N_POINTS; i++) {
      const x = xMin + i * step;
      const p = Math.max(0, dist.pdf(x, params));
      cum = Math.min(1, cum + p * step);
      points.push({ x, pdf: p, cdf: cum });
    }
  }
  return points;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Slider({
  def,
  value,
  onChange,
}: {
  def: ParamDef;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-600">{def.label}</span>
        <span className="text-xs font-mono font-bold text-slate-700">{def.format(value)}</span>
      </div>
      <input
        type="range"
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-slate-200 cursor-pointer accent-indigo-500"
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
        <span>{def.format(def.min)}</span>
        <span>{def.format(def.max)}</span>
      </div>
    </div>
  );
}

const CHART_H = 150;
const CHART_W = 400;

function CurveChart({
  points,
  mode,
  accentHex,
  discrete,
  meanX,
  domain,
}: {
  points: { x: number; pdf: number; cdf: number }[];
  mode: ViewMode;
  accentHex: string;
  discrete: boolean;
  meanX: number;
  domain: [number, number];
}) {
  if (points.length === 0) return null;

  const [xMin, xMax] = domain;

  const vals = points.map((p) => (mode === "pdf" ? p.pdf : p.cdf));
  const maxVal = Math.max(...vals, 0.001);

  function toSvgX(x: number): number {
    return ((x - xMin) / (xMax - xMin)) * CHART_W;
  }
  function toSvgY(v: number): number {
    return CHART_H - (v / maxVal) * CHART_H;
  }

  const meanSvgX = toSvgX(meanX);

  if (discrete) {
    if (mode === "pdf") {
      const visiblePoints = points.filter((p) => p.pdf > 1e-6);
      const barW = Math.max(1.5, (CHART_W / (xMax - xMin)) * 0.6);
      return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" className="w-full" style={{ height: CHART_H }}>
          <line x1={meanSvgX} y1={0} x2={meanSvgX} y2={CHART_H} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
          {visiblePoints.map((p) => {
            const sx = toSvgX(p.x);
            const sy = toSvgY(p.pdf);
            return (
              <rect key={p.x} x={sx - barW / 2} y={sy} width={barW} height={CHART_H - sy}
                fill={accentHex} fillOpacity={0.8} rx={0.5} />
            );
          })}
        </svg>
      );
    } else {
      // Step function CDF
      let path = "";
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const sx = toSvgX(p.x);
        const sy = toSvgY(p.cdf);
        const prevCdf = i === 0 ? 0 : points[i - 1].cdf;
        const prevSy = toSvgY(prevCdf);
        if (i === 0) {
          path += `M ${sx} ${prevSy} L ${sx} ${sy}`;
        } else {
          path += ` L ${sx} ${prevSy} L ${sx} ${sy}`;
        }
      }
      // extend to end of domain
      const lastSx = toSvgX(xMax);
      const lastSy = toSvgY(points[points.length - 1].cdf);
      path += ` L ${lastSx} ${lastSy}`;

      return (
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" className="w-full" style={{ height: CHART_H }}>
          <line x1={meanSvgX} y1={0} x2={meanSvgX} y2={CHART_H} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
          <path d={path} fill="none" stroke={accentHex} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    }
  }

  // Continuous
  const linePoints = points.map((p) => {
    const sx = toSvgX(p.x);
    const sy = toSvgY(mode === "pdf" ? p.pdf : p.cdf);
    return `${sx.toFixed(1)},${sy.toFixed(1)}`;
  });

  const linePath = "M " + linePoints.join(" L ");
  const firstSx = toSvgX(points[0].x).toFixed(1);
  const lastSx = toSvgX(points[points.length - 1].x).toFixed(1);
  const fillPath = linePath + ` L ${lastSx} ${CHART_H} L ${firstSx} ${CHART_H} Z`;

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" className="w-full" style={{ height: CHART_H }}>
      <line x1={meanSvgX} y1={0} x2={meanSvgX} y2={CHART_H} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
      {mode === "pdf" ? (
        <>
          <path d={fillPath} fill={accentHex} fillOpacity={0.15} />
          <path d={linePath} fill="none" stroke={accentHex} strokeWidth="2" strokeLinejoin="round" />
        </>
      ) : (
        <path d={linePath} fill="none" stroke={accentHex} strokeWidth="2" strokeLinejoin="round" />
      )}
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DistributionShapeExplorer() {
  const [distId, setDistId] = useState<DistId>("normal");
  const [view, setView] = useState<ViewMode>("pdf");
  const [paramValues, setParamValues] = useState<Record<DistId, number[]>>({
    normal: [0, 1],
    poisson: [3],
    exponential: [1],
    uniform: [0, 4],
  });

  const dist = DISTRIBUTIONS.find((d) => d.id === distId)!;
  const params = paramValues[distId];

  const points = useMemo(
    () => samplePoints(dist, params),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [distId, params[0] ?? 0, params[1] ?? 0]
  );

  const meanVal = dist.mean(params);
  const varVal = dist.variance(params);
  const stdVal = Math.sqrt(varVal);

  function updateParam(index: number, value: number) {
    setParamValues((prev) => {
      const next = [...prev[distId]];
      next[index] = value;
      if (distId === "uniform") {
        if (index === 0 && next[0] >= next[1] - 0.5) next[1] = next[0] + 0.5;
        if (index === 1 && next[1] <= next[0] + 0.5) next[0] = next[1] - 0.5;
      }
      return { ...prev, [distId]: next };
    });
  }

  const [xMin, xMax] = dist.domain;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Distribution Shape Explorer
        </span>
      </div>

      {/* Distribution tabs */}
      <div className="px-5 pt-4 flex flex-wrap gap-2">
        {DISTRIBUTIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDistId(d.id)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              distId === d.id
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="px-5 pt-3 pb-1">
        <p className="text-xs text-slate-500 leading-relaxed">{dist.description}</p>
      </div>

      {/* Parameters */}
      <div className="px-5 py-3 space-y-3">
        {dist.params.map((def, i) => (
          <Slider key={def.key} def={def} value={params[i]} onChange={(v) => updateParam(i, v)} />
        ))}
      </div>

      {/* PDF / CDF toggle */}
      <div className="px-5 pb-3 flex gap-2 items-center">
        {(["pdf", "cdf"] as ViewMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setView(m)}
            className={`px-3 py-1 rounded-md border text-xs font-semibold transition-all ${
              view === m
                ? "bg-slate-700 border-slate-700 text-white"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {dist.discrete && m === "pdf" ? "PMF" : m.toUpperCase()}
          </button>
        ))}
        <span className="ml-1 text-[10px] text-slate-400">
          {view === "pdf"
            ? dist.discrete ? "probability mass at each integer" : "relative likelihood (area = 1)"
            : "probability that X ≤ x"}
        </span>
      </div>

      {/* Chart */}
      <div className="px-5 pb-1">
        <CurveChart
          points={points}
          mode={view}
          accentHex={dist.accentHex}
          discrete={dist.discrete}
          meanX={meanVal}
          domain={dist.domain}
        />
        <div className="h-px bg-slate-200 w-full" />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>{xMin}</span>
          <span style={{ color: "#f59e0b" }} className="font-medium">mean = {meanVal.toFixed(2)}</span>
          <span>{xMax}</span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-5 py-3 mt-2 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-sm font-bold text-amber-600">{meanVal.toFixed(3)}</div>
            <div className="text-[10px] text-slate-400">Mean (μ)</div>
          </div>
          <div>
            <div className="text-sm font-bold text-indigo-600">{varVal.toFixed(3)}</div>
            <div className="text-[10px] text-slate-400">Variance (σ²)</div>
          </div>
          <div>
            <div className="text-sm font-bold text-violet-600">{stdVal.toFixed(3)}</div>
            <div className="text-[10px] text-slate-400">Std Dev (σ)</div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <span className="text-[10px] text-slate-400">Mode: </span>
          <span className="text-[10px] font-semibold text-slate-600">{dist.modeLabel(params)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-slate-100 flex items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: dist.accentHex }} />
          {dist.discrete && view === "pdf" ? "PMF" : view.toUpperCase()}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5" style={{ borderTop: "1px dashed #f59e0b", width: 12 }} />
          Mean
        </span>
      </div>
    </div>
  );
}
