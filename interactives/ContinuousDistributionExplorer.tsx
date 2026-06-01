"use client";

import { useState, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type DistId = "normal" | "uniform" | "exponential";

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
  pdf: (x: number, params: number[]) => number;
  mean: (params: number[]) => number;
  variance: (params: number[]) => number;
  modeLabel: (params: number[]) => string;
}

// ── Math helpers ───────────────────────────────────────────────────────────────

const SQRT2PI = Math.sqrt(2 * Math.PI);

function normalPDF(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * SQRT2PI);
}

// ── Distribution configs ───────────────────────────────────────────────────────

const DISTRIBUTIONS: DistConfig[] = [
  {
    id: "normal",
    label: "Normal",
    accentHex: "#6366f1",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description:
      "Symmetric, bell-shaped. Shifting μ moves the curve left or right; increasing σ flattens and widens it. The Central Limit Theorem guarantees that averages of large samples approach this shape.",
    formulaLabel: "f(x) = (1 / σ√2π) · e^(−(x−μ)² / 2σ²)",
    params: [
      { key: "mu", label: "Mean (μ)", min: -4, max: 4, step: 0.5, default: 0, format: (v) => v.toFixed(1) },
      { key: "sigma", label: "Std Dev (σ)", min: 0.2, max: 3, step: 0.1, default: 1, format: (v) => v.toFixed(1) },
    ],
    domain: () => [-8, 8],
    pdf: (x, [mu, sigma]) => normalPDF(x, mu, sigma),
    mean: ([mu]) => mu,
    variance: ([, sigma]) => sigma * sigma,
    modeLabel: ([mu]) => mu.toFixed(1),
  },
  {
    id: "uniform",
    label: "Uniform",
    accentHex: "#059669",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description:
      "Every value in [a, b] is equally likely. The PDF is a flat rectangle — height 1/(b−a). Widening the interval lowers the height so the total area stays 1.",
    formulaLabel: "f(x) = 1/(b−a)  for x ∈ [a, b], else 0",
    params: [
      { key: "a", label: "Min (a)", min: -6, max: 3, step: 0.5, default: -2, format: (v) => v.toFixed(1) },
      { key: "b", label: "Max (b)", min: -3, max: 8, step: 0.5, default: 4, format: (v) => v.toFixed(1) },
    ],
    domain: () => [-8, 8],
    pdf: (x, [a, b]) => {
      if (b <= a + 0.1) return 0;
      return x >= a && x <= b ? 1 / (b - a) : 0;
    },
    mean: ([a, b]) => (a + b) / 2,
    variance: ([a, b]) => ((b - a) ** 2) / 12,
    modeLabel: ([a, b]) => `any in [${a.toFixed(1)}, ${b.toFixed(1)}]`,
  },
  {
    id: "exponential",
    label: "Exponential",
    accentHex: "#e11d48",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    description:
      "Models time between Poisson events. Higher λ means faster decay — most mass sits near zero. Memoryless: the distribution of remaining wait time doesn't depend on how long you've already waited.",
    formulaLabel: "f(x) = λe^(−λx)  for x ≥ 0",
    params: [
      { key: "lambda", label: "Rate (λ)", min: 0.1, max: 4, step: 0.1, default: 1, format: (v) => v.toFixed(1) },
    ],
    domain: () => [0, 10],
    pdf: (x, [lambda]) => (x < 0 ? 0 : lambda * Math.exp(-lambda * x)),
    mean: ([lambda]) => 1 / lambda,
    variance: ([lambda]) => 1 / (lambda * lambda),
    modeLabel: () => "0",
  },
];

// ── Chart ──────────────────────────────────────────────────────────────────────

const CHART_H = 160;
const CHART_W = 400;
const N_POINTS = 300;

interface CurvePoint {
  x: number;
  y: number;
}

function PDFChart({
  points,
  domain,
  accentHex,
  meanVal,
}: {
  points: CurvePoint[];
  domain: [number, number];
  accentHex: string;
  meanVal: number;
}) {
  if (points.length === 0) return null;

  const [xMin, xMax] = domain;
  const maxY = Math.max(...points.map((p) => p.y), 0.001);

  function toSvgX(x: number): number {
    return ((x - xMin) / (xMax - xMin)) * CHART_W;
  }
  function toSvgY(y: number): number {
    return CHART_H - (y / maxY) * CHART_H * 0.9;
  }

  const meanSvgX = toSvgX(meanVal);
  const svgPoints = points.map((p) => `${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`);
  const linePath = "M " + svgPoints.join(" L ");
  const firstSx = toSvgX(points[0].x).toFixed(1);
  const lastSx = toSvgX(points[points.length - 1].x).toFixed(1);
  const fillPath = `${linePath} L ${lastSx} ${CHART_H} L ${firstSx} ${CHART_H} Z`;

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: CHART_H }}
    >
      <line
        x1={meanSvgX} y1={0} x2={meanSvgX} y2={CHART_H}
        stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"
      />
      <path d={fillPath} fill={accentHex} fillOpacity={0.12} />
      <path d={linePath} fill="none" stroke={accentHex} strokeWidth="2" strokeLinejoin="round" />
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
  normal: [0, 1],
  uniform: [-2, 4],
  exponential: [1],
};

export default function ContinuousDistributionExplorer() {
  const [distId, setDistId] = useState<DistId>("normal");
  const [paramValues, setParamValues] = useState<Record<DistId, number[]>>(DEFAULT_PARAMS);

  const dist = DISTRIBUTIONS.find((d) => d.id === distId)!;
  const params = paramValues[distId];
  const domain = dist.domain(params);

  const points = useMemo(() => {
    const [xMin, xMax] = domain;
    const step = (xMax - xMin) / N_POINTS;
    const pts: CurvePoint[] = [];
    for (let i = 0; i <= N_POINTS; i++) {
      const x = xMin + i * step;
      pts.push({ x, y: Math.max(0, dist.pdf(x, params)) });
    }
    return pts;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distId, params[0], params[1]]);

  const meanVal = dist.mean(params);
  const varVal = dist.variance(params);
  const stdVal = Math.sqrt(varVal);

  function updateParam(index: number, value: number) {
    setParamValues((prev) => {
      const next = prev[distId].map((v, i) => (i === index ? value : v));
      if (distId === "uniform") {
        if (index === 0 && next[0] >= next[1] - 0.5) next[1] = next[0] + 0.5;
        if (index === 1 && next[1] <= next[0] + 0.5) next[0] = next[1] - 0.5;
      }
      return { ...prev, [distId]: next };
    });
  }

  const [xMin, xMax] = domain;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Continuous Distribution Explorer
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

      {/* Chart */}
      <div className="px-5 pb-2">
        <div className="mb-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            PDF — relative likelihood (area = 1)
          </span>
        </div>
        <PDFChart
          points={points}
          domain={domain}
          accentHex={dist.accentHex}
          meanVal={meanVal}
        />
        <div className="h-px bg-slate-200 w-full" />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>{xMin.toFixed(1)}</span>
          <span style={{ color: "#f59e0b" }} className="font-medium">
            mean = {meanVal.toFixed(2)}
          </span>
          <span>{xMax.toFixed(1)}</span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-5 py-3 mt-1 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-4 gap-3 text-center">
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
          <div>
            <div className="text-sm font-bold text-slate-600 truncate">{dist.modeLabel(params)}</div>
            <div className="text-[10px] text-slate-400">Mode</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-slate-100 flex items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: dist.accentHex }} />
          PDF
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block" style={{ borderTop: "1.5px dashed #f59e0b", width: 12 }} />
          Mean
        </span>
      </div>
    </div>
  );
}
