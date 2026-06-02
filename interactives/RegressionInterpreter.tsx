"use client";

import { useState, useMemo } from "react";

// ── Presets ────────────────────────────────────────────────────────────────────

interface Preset {
  id: string;
  label: string;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  slope: number;        // $k per unit
  intercept: number;   // $k
  xRange: [number, number];
  points: { x: number; y: number }[];
  interceptNote: string;
}

const PRESETS: Preset[] = [
  {
    id: "bedrooms",
    label: "Bedrooms → Price",
    xLabel: "Bedrooms",
    yLabel: "House price",
    xUnit: "bd",
    yUnit: "$k",
    slope: 65,
    intercept: 100,
    xRange: [0, 7],
    points: [
      { x: 1, y: 100 }, { x: 2, y: 195 }, { x: 2, y: 240 },
      { x: 3, y: 275 }, { x: 3, y: 310 }, { x: 4, y: 370 },
      { x: 5, y: 420 }, { x: 5, y: 490 }, { x: 6, y: 510 },
    ],
    interceptNote: "Predicted price at 0 bedrooms (a studio or anchor point — not always interpretable).",
  },
  {
    id: "distance",
    label: "Distance → Price",
    xLabel: "Miles from city center",
    yLabel: "House price",
    xUnit: "mi",
    yUnit: "$k",
    slope: -8,
    intercept: 420,
    xRange: [0, 30],
    points: [
      { x: 2,  y: 400 }, { x: 3,  y: 395 }, { x: 5,  y: 370 },
      { x: 8,  y: 340 }, { x: 10, y: 330 }, { x: 12, y: 310 },
      { x: 15, y: 285 }, { x: 18, y: 260 }, { x: 22, y: 240 },
      { x: 25, y: 210 },
    ],
    interceptNote: "Predicted price at the city center (distance = 0) — within data range and meaningful.",
  },
  {
    id: "sqft",
    label: "Sq ft → Price",
    xLabel: "Square footage",
    yLabel: "House price",
    xUnit: "sqft",
    yUnit: "$k",
    slope: 0.18,
    intercept: 50,
    xRange: [500, 3500],
    points: [
      { x: 600,  y: 155 }, { x: 800,  y: 190 }, { x: 1000, y: 220 },
      { x: 1200, y: 265 }, { x: 1500, y: 310 }, { x: 1800, y: 370 },
      { x: 2000, y: 400 }, { x: 2400, y: 460 }, { x: 2800, y: 530 },
      { x: 3200, y: 580 },
    ],
    interceptNote: "Predicted price at 0 sq ft — mathematical anchor, not meaningful (0 sq ft is not a house).",
  },
];

// ── Chart ──────────────────────────────────────────────────────────────────────

const CW = 460;
const CH = 230;
const P = { t: 16, r: 16, b: 36, l: 48 };

function ScatterPlot({ preset, slope, intercept, xProbe }: {
  preset: Preset; slope: number; intercept: number; xProbe: number;
}) {
  const { points, xRange, xLabel, yUnit, yLabel } = preset;
  const [xlo, xhi] = xRange;
  const yProbe = slope * xProbe + intercept;

  const allY = [
    ...points.map(p => p.y),
    yProbe,
    slope * xlo + intercept,
    slope * xhi + intercept,
  ];
  const ylo = Math.min(...allY) - 20;
  const yhi = Math.max(...allY) + 30;

  const pw = CW - P.l - P.r;
  const ph = CH - P.t - P.b;
  const sx = (x: number) => P.l + ((x - xlo) / (xhi - xlo)) * pw;
  const sy = (y: number) => P.t + ph - ((y - ylo) / (yhi - ylo)) * ph;

  const lineY1 = slope * xlo + intercept;
  const lineY2 = slope * xhi + intercept;

  const xSpan = xhi - xlo;
  const xStep = xSpan <= 7 ? 1 : xSpan <= 30 ? 5 : 500;
  const xTicks: number[] = [];
  for (let v = Math.ceil(xlo / xStep) * xStep; v <= xhi; v += xStep) xTicks.push(v);

  const yRange = yhi - ylo;
  const yStep = yRange > 400 ? 100 : yRange > 200 ? 50 : yRange > 100 ? 25 : 10;
  const yTicks: number[] = [];
  for (let v = Math.ceil(ylo / yStep) * yStep; v <= yhi; v += yStep) yTicks.push(v);

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      {/* Grid */}
      {xTicks.map(v => (
        <line key={v} x1={sx(v)} y1={P.t} x2={sx(v)} y2={P.t + ph} stroke="#f1f5f9" />
      ))}
      {yTicks.map(v => (
        <line key={v} x1={P.l} y1={sy(v)} x2={P.l + pw} y2={sy(v)} stroke="#f1f5f9" />
      ))}

      {/* Axes */}
      <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph} stroke="#e2e8f0" />
      <line x1={P.l} y1={P.t}      x2={P.l}       y2={P.t + ph} stroke="#e2e8f0" />

      {/* Tick labels */}
      {xTicks.map(v => (
        <text key={v} x={sx(v)} y={P.t + ph + 14} textAnchor="middle" fontSize="8" fill="#94a3b8">
          {v}
        </text>
      ))}
      {yTicks.map(v => (
        <text key={v} x={P.l - 5} y={sy(v) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">
          {v}
        </text>
      ))}

      {/* Probe drop-lines */}
      <line x1={sx(xProbe)} y1={sy(yProbe)} x2={sx(xProbe)} y2={P.t + ph}
        stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
      <line x1={P.l} y1={sy(yProbe)} x2={sx(xProbe)} y2={sy(yProbe)}
        stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />

      {/* Regression line */}
      <line x1={sx(xlo)} y1={sy(lineY1)} x2={sx(xhi)} y2={sy(lineY2)}
        stroke="#6366f1" strokeWidth="2" />

      {/* Data points */}
      {points.map((pt, i) => (
        <circle key={i} cx={sx(pt.x)} cy={sy(pt.y)} r={5} fill="#f97316" fillOpacity={0.8} />
      ))}

      {/* Probe point */}
      <circle cx={sx(xProbe)} cy={sy(yProbe)} r={6} fill="#f59e0b" />
      <text x={sx(xProbe) + 9} y={sy(yProbe) - 6} fontSize="9" fill="#b45309" fontWeight="600">
        ŷ = {yProbe.toFixed(0)}{yUnit}
      </text>

      {/* Axis labels */}
      <text x={P.l + pw / 2} y={CH - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">
        {xLabel}
      </text>
      <text x={10} y={P.t + ph / 2} textAnchor="middle" fontSize="9" fill="#94a3b8"
        transform={`rotate(-90, 10, ${P.t + ph / 2})`}>
        {yLabel} ({yUnit})
      </text>
    </svg>
  );
}

// ── Slider ─────────────────────────────────────────────────────────────────────

function SliderRow({ label, value, min, max, step, onChange, valueDisplay }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; valueDisplay?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-28 shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full accent-indigo-500" />
      <span className="text-xs font-mono text-slate-700 w-16 text-right">
        {valueDisplay ?? value.toFixed(step < 1 ? 2 : 0)}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function RegressionInterpreter() {
  const [presetId, setPresetId] = useState("bedrooms");
  const preset = PRESETS.find(p => p.id === presetId)!;

  const [slope, setSlope]         = useState(preset.slope);
  const [intercept, setIntercept] = useState(preset.intercept);
  const [xProbe, setXProbe]       = useState(
    () => (preset.xRange[0] + preset.xRange[1]) / 2
  );

  const handlePreset = (p: Preset) => {
    setSlope(p.slope);
    setIntercept(p.intercept);
    setXProbe((p.xRange[0] + p.xRange[1]) / 2);
    setPresetId(p.id);
  };

  const yProbe  = slope * xProbe + intercept;
  const yAtZero = intercept;

  const slopeRange = useMemo(() => {
    const s = Math.abs(preset.slope);
    return { min: preset.slope - s * 3 - 5, max: preset.slope + s * 3 + 5 };
  }, [preset]);

  const interceptRange = useMemo(() => ({
    min: preset.intercept - 200,
    max: preset.intercept + 200,
  }), [preset]);

  const probeStep = (preset.xRange[1] - preset.xRange[0]) / 50;

  const slopeDisplay = `${slope >= 0 ? "+" : ""}${slope.toFixed(1)} ${preset.yUnit}/${preset.xUnit}`;
  const interceptDisplay = `${intercept.toFixed(0)} ${preset.yUnit}`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Regression Interpreter
        </span>
      </div>

      {/* Preset tabs */}
      <div className="px-5 pt-4 pb-3">
        <div className="text-xs font-semibold text-slate-600 mb-2">Predictor</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => handlePreset(p)}
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

      {/* Chart */}
      <div className="px-5 pb-2">
        <ScatterPlot preset={preset} slope={slope} intercept={intercept} xProbe={xProbe} />
        <p className="text-[10px] text-slate-400 mt-1">
          Orange dot = probe point. Dashed lines show the predicted value.
        </p>
      </div>

      {/* Sliders */}
      <div className="px-5 pb-4">
        <div className="rounded-lg border border-slate-100 p-3 space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Probe
          </div>
          <SliderRow label={`Probe (${preset.xUnit || preset.xLabel.split(" ")[0]})`}
            value={xProbe} min={preset.xRange[0]} max={preset.xRange[1]} step={probeStep}
            onChange={v => setXProbe(v)}
            valueDisplay={`${xProbe.toFixed(xProbe < 10 ? 1 : 0)} ${preset.xUnit}`} />
        </div>
      </div>

      {/* Interpretation cards */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Interpretation</span>
        </div>
        <div className="px-4 py-3 space-y-3">
          <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2.5">
            <div className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wide mb-1">
              Slope — β₁ = {slopeDisplay}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              For each additional {preset.xUnit ? `1 ${preset.xUnit}` : "unit"} of <strong>{preset.xLabel.toLowerCase()}</strong>,
              predicted <strong>{preset.yLabel.toLowerCase()}</strong>{" "}
              {slope >= 0 ? "increases" : "decreases"} by{" "}
              <span className="font-semibold text-indigo-700">{Math.abs(slope).toFixed(1)} {preset.yUnit}</span>.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Intercept — β₀ = {interceptDisplay}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              When {preset.xLabel.toLowerCase()} = 0, predicted {preset.yLabel.toLowerCase()} ={" "}
              <span className="font-semibold">{yAtZero.toFixed(0)} {preset.yUnit}</span>.{" "}
              <span className="text-slate-400">{preset.interceptNote}</span>
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2.5">
            <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-1">
              Prediction at {preset.xLabel} = {xProbe.toFixed(xProbe < 10 ? 1 : 0)} {preset.xUnit}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-mono">
              ŷ = {slope.toFixed(1)} × {xProbe.toFixed(xProbe < 10 ? 1 : 0)}{" "}
              {intercept >= 0 ? "+" : "−"} {Math.abs(intercept).toFixed(0)}{" "}
              = <span className="font-bold text-amber-700">{yProbe.toFixed(0)} {preset.yUnit}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Equation */}
      <div className="mx-5 mb-4 rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Equation</div>
        <div className="font-mono text-sm text-slate-800">
          {preset.yLabel} = {slope.toFixed(1)} × {preset.xLabel}{" "}
          {intercept >= 0 ? "+" : "−"} {Math.abs(intercept).toFixed(0)}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400" /> Houses
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 bg-indigo-400" /> Regression line
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" /> Probe point
        </span>
      </div>
    </div>
  );
}
