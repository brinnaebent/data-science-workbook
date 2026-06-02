"use client";

import { useState, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type DistId = "bernoulli" | "binomial" | "poisson";

interface ParamDef {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  format: (v: number) => string;
}

interface DistConfig {
  id: DistId;
  label: string;
  accentHex: string;
  tagColor: string;
  description: string;
  formulaLabel: string;
  params: ParamDef[];
  domain: (params: number[]) => [number, number];
  pmf: (k: number, params: number[]) => number;
  mean: (params: number[]) => number;
  variance: (params: number[]) => number;
}

// ── Math helpers ───────────────────────────────────────────────────────────────

function logFactorial(n: number): number {
  let v = 0;
  for (let i = 2; i <= n; i++) v += Math.log(i);
  return v;
}

function binomialPMF(k: number, n: number, p: number): number {
  if (k < 0 || k > n || !Number.isInteger(k)) return 0;
  if (p <= 0) return k === 0 ? 1 : 0;
  if (p >= 1) return k === n ? 1 : 0;
  const logP = logFactorial(n) - logFactorial(k) - logFactorial(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
  return Math.exp(logP);
}

function poissonPMF(k: number, lambda: number): number {
  if (k < 0 || !Number.isInteger(k)) return 0;
  const logP = -lambda + k * Math.log(Math.max(lambda, 1e-10)) - logFactorial(k);
  return Math.exp(logP);
}

// ── Distribution configs ───────────────────────────────────────────────────────

const DISTRIBUTIONS: DistConfig[] = [
  {
    id: "bernoulli",
    label: "Bernoulli",
    accentHex: "#6366f1",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "A single binary trial: success (1) with probability p, failure (0) with probability 1−p. The simplest discrete distribution — a coin flip.",
    formulaLabel: "P(X=k) = p^k (1−p)^(1−k), k ∈ {0, 1}",
    params: [
      { key: "p", label: "Success probability (p)", min: 0.01, max: 0.99, step: 0.01, default: 0.5, format: (v) => v.toFixed(2) },
    ],
    domain: () => [-1, 2],
    pmf: (k, [p]) => {
      if (k === 0) return 1 - p;
      if (k === 1) return p;
      return 0;
    },
    mean: ([p]) => p,
    variance: ([p]) => p * (1 - p),
  },
  {
    id: "binomial",
    label: "Binomial",
    accentHex: "#0891b2",
    tagColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    description: "Count of successes in n independent Bernoulli trials. As n increases or p approaches 0.5, the distribution becomes more symmetric and bell-shaped.",
    formulaLabel: "P(X=k) = C(n,k) p^k (1−p)^(n−k)",
    params: [
      { key: "n", label: "Trials (n)", min: 1, max: 40, step: 1, default: 10, format: (v) => `${Math.round(v)}` },
      { key: "p", label: "Success probability (p)", min: 0.01, max: 0.99, step: 0.01, default: 0.4, format: (v) => v.toFixed(2) },
    ],
    domain: ([n]) => [-1, Math.round(n) + 1],
    pmf: (k, [n, p]) => binomialPMF(k, Math.round(n), p),
    mean: ([n, p]) => Math.round(n) * p,
    variance: ([n, p]) => Math.round(n) * p * (1 - p),
  },
  {
    id: "poisson",
    label: "Poisson",
    accentHex: "#7c3aed",
    tagColor: "bg-violet-50 text-violet-700 border-violet-200",
    description: "Count of independent events in a fixed interval given average rate λ. Right-skewed at small λ; approaches symmetric as λ grows. Uniquely, mean = variance = λ.",
    formulaLabel: "P(X=k) = e^(−λ) λ^k / k!",
    params: [
      { key: "lambda", label: "Rate (λ)", min: 0.5, max: 20, step: 0.5, default: 4, format: (v) => v.toFixed(1) },
    ],
    domain: ([lambda]) => [-1, Math.ceil(lambda + 4 * Math.sqrt(lambda)) + 1],
    pmf: (k, [lambda]) => poissonPMF(k, lambda),
    mean: ([lambda]) => lambda,
    variance: ([lambda]) => lambda,
  },
];

// ── Chart ──────────────────────────────────────────────────────────────────────

const CHART_H = 160;
const CHART_W = 400;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;

interface BarPoint {
  k: number;
  p: number;
}

function PMFChart({
  points,
  domain,
  accentHex,
  meanVal,
  hoveredK,
  onHover,
}: {
  points: BarPoint[];
  domain: [number, number];
  accentHex: string;
  meanVal: number;
  hoveredK: number | null;
  onHover: (k: number | null) => void;
}) {
  const [xMin, xMax] = domain;
  const maxP = Math.max(...points.map((p) => p.p), 0.01);

  const innerW = CHART_W - PAD_LEFT - PAD_RIGHT;

  function toSvgX(x: number): number {
    return PAD_LEFT + ((x - xMin) / (xMax - xMin)) * innerW;
  }
  function toSvgY(v: number): number {
    return CHART_H - (v / maxP) * CHART_H * 0.9;
  }

  const meanSvgX = toSvgX(meanVal);
  const nBars = points.length;
  const barW = Math.max(2, Math.min(28, (innerW / Math.max(nBars, 1)) * 0.65));

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: CHART_H }}
    >
      {/* Mean line */}
      <line
        x1={meanSvgX} y1={0} x2={meanSvgX} y2={CHART_H}
        stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"
      />

      {/* Bars */}
      {points.map((pt) => {
        const sx = toSvgX(pt.k);
        const sy = toSvgY(pt.p);
        const h = CHART_H - sy;
        const isHovered = hoveredK === pt.k;
        return (
          <g key={pt.k}>
            <rect
              x={sx - barW / 2} y={sy}
              width={barW} height={h}
              fill={accentHex}
              fillOpacity={isHovered ? 1 : 0.75}
              rx={1.5}
            />
            {/* invisible hit target */}
            <rect
              x={sx - Math.max(barW, 16) / 2} y={0}
              width={Math.max(barW, 16)} height={CHART_H}
              fill="transparent"
              onMouseEnter={() => onHover(pt.k)}
              onMouseLeave={() => onHover(null)}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ── Slider ─────────────────────────────────────────────────────────────────────

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

// ── Main ───────────────────────────────────────────────────────────────────────

const DEFAULT_PARAMS: Record<DistId, number[]> = {
  bernoulli: [0.5],
  binomial: [10, 0.4],
  poisson: [4],
};

export default function DiscreteDistributionExplorer() {
  const [distId, setDistId] = useState<DistId>("binomial");
  const [paramValues, setParamValues] = useState<Record<DistId, number[]>>(DEFAULT_PARAMS);
  const [hoveredK, setHoveredK] = useState<number | null>(null);

  const dist = DISTRIBUTIONS.find((d) => d.id === distId)!;
  const params = paramValues[distId];

  const { points, domain } = useMemo(() => {
    const dom = dist.domain(params);
    const [lo, hi] = [Math.max(0, Math.ceil(dom[0])), Math.floor(dom[1])];
    const pts: BarPoint[] = [];
    for (let k = lo; k <= hi; k++) {
      const p = dist.pmf(k, params);
      if (p > 1e-8) pts.push({ k, p });
    }
    return { points: pts, domain: dom };
  }, [distId, params[0], params[1]]);

  const meanVal = dist.mean(params);
  const varVal = dist.variance(params);
  const stdVal = Math.sqrt(varVal);

  function updateParam(index: number, value: number) {
    setParamValues((prev) => ({ ...prev, [distId]: prev[distId].map((v, i) => (i === index ? value : v)) }));
  }

  const hoveredPoint = hoveredK !== null ? points.find((p) => p.k === hoveredK) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Discrete Distribution Explorer
        </span>
      </div>

      {/* Distribution tabs */}
      <div className="px-5 pt-4 flex flex-wrap gap-2">
        {DISTRIBUTIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => { setDistId(d.id); setHoveredK(null); }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              distId === d.id
                ? d.tagColor
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Description + formula */}
      <div className="px-5 pt-3 pb-2 space-y-1">
        <p className="text-xs text-slate-500 leading-relaxed">{dist.description}</p>
        <p className="text-[10px] font-mono text-slate-400">{dist.formulaLabel}</p>
      </div>

      {/* Sliders */}
      <div className="px-5 py-3 space-y-3">
        {dist.params.map((def, i) => (
          <Slider key={def.key} def={def} value={params[i]} onChange={(v) => updateParam(i, v)} />
        ))}
      </div>

      {/* Chart area */}
      <div className="px-5 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">PMF — P(X = k)</span>
          {hoveredPoint ? (
            <span className="text-[10px] font-mono text-slate-600">
              P(X = {hoveredPoint.k}) = <span className="font-bold" style={{ color: dist.accentHex }}>{hoveredPoint.p.toFixed(4)}</span>
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">hover a bar</span>
          )}
        </div>
        <PMFChart
          points={points}
          domain={domain}
          accentHex={dist.accentHex}
          meanVal={meanVal}
          hoveredK={hoveredK}
          onHover={setHoveredK}
        />
        <div className="h-px bg-slate-200 w-full" />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>k = {Math.max(0, Math.ceil(domain[0]))}</span>
          <span style={{ color: "#f59e0b" }} className="font-medium">
            mean = {meanVal.toFixed(2)}
          </span>
          <span>k = {Math.floor(domain[1])}</span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-5 py-3 mt-1 bg-slate-50 border-t border-slate-100">
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
        {distId === "poisson" && (
          <p className="mt-2 text-center text-[10px] text-slate-400 italic">
            Poisson property: mean = variance = λ
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-slate-100 flex items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: dist.accentHex, opacity: 0.75 }} />
          Probability mass
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5" style={{ borderTop: "1.5px dashed #f59e0b", width: 12 }} />
          Mean
        </span>
      </div>
    </div>
  );
}
