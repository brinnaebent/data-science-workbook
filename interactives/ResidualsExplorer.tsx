"use client";

import { useState, useMemo, useRef, useCallback } from "react";

// ── Data ───────────────────────────────────────────────────────────────────────

interface Preset {
  id: string;
  label: string;
  description: string;
  xLabel: string;
  xUnit: string;
  yLabel: string;
  yUnit: string;
  xRange: [number, number];
  yRange: [number, number];
  points: { x: number; y: number }[];
}

// Prices in $k, bedroom counts 1–6, cat counts 0–25
const PRESETS: Preset[] = [
  {
    id: "cats",
    label: "Cats in neighborhood",
    description: "No real relationship. The OLS line is nearly flat — cats don't predict prices.",
    xLabel: "Cats in neighborhood",
    xUnit: "",
    yLabel: "House price",
    yUnit: "$k",
    xRange: [0, 25],
    yRange: [0, 500],
    points: [
      { x: 3,  y: 340 },
      { x: 4,  y: 185 },
      { x: 8,  y: 420 },
      { x: 10, y: 275 },
      { x: 12, y: 310 },
      { x: 14, y: 80  },
      { x: 16, y: 360 },
      { x: 21, y: 455 },
      { x: 22, y: 290 },
    ],
  },
  {
    id: "bedrooms",
    label: "Number of bedrooms",
    description: "Strong positive relationship. OLS finds a tight fit — bedrooms do predict prices.",
    xLabel: "Bedrooms",
    xUnit: "",
    yLabel: "House price",
    yUnit: "$k",
    xRange: [0, 7],
    yRange: [0, 600],
    points: [
      { x: 1, y: 100 },
      { x: 2, y: 195 },
      { x: 2, y: 240 },
      { x: 3, y: 275 },
      { x: 3, y: 310 },
      { x: 4, y: 370 },
      { x: 5, y: 420 },
      { x: 5, y: 490 },
      { x: 6, y: 510 },
      { x: 6, y: 535 },
    ],
  },
];

// ── OLS ────────────────────────────────────────────────────────────────────────

function ols(pts: { x: number; y: number }[]) {
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  const ssxy = pts.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
  const ssxx = pts.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  const slope = ssxy / ssxx;
  const intercept = my - slope * mx;
  return { slope, intercept };
}

function sse(pts: { x: number; y: number }[], slope: number, intercept: number) {
  return pts.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
}

// ── Chart ──────────────────────────────────────────────────────────────────────

const CW = 460;
const CH = 240;
const P = { t: 16, r: 16, b: 36, l: 44 };

interface ChartProps {
  preset: Preset;
  slope: number;
  intercept: number;
  olsSlope: number;
  olsIntercept: number;
  dragging: boolean;
  onMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
  onMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
  onMouseUp: () => void;
}

function ScatterChart({
  preset, slope, intercept, olsSlope, olsIntercept,
  dragging, onMouseDown, onMouseMove, onMouseUp,
}: ChartProps) {
  const { points, xRange, yRange, xLabel, yUnit, yLabel } = preset;
  const [xlo, xhi] = xRange;
  const [ylo, yhi] = yRange;

  const pw = CW - P.l - P.r;
  const ph = CH - P.t - P.b;
  const sx = (x: number) => P.l + ((x - xlo) / (xhi - xlo)) * pw;
  const sy = (y: number) => P.t + ph - ((y - ylo) / (yhi - ylo)) * ph;

  const mkLine = (s: number, b: number, color: string, dashed = false) => {
    const clampedY1 = Math.max(ylo, Math.min(yhi, s * xlo + b));
    const clampedY2 = Math.max(ylo, Math.min(yhi, s * xhi + b));
    const x1adj = clampedY1 !== s * xlo + b && s !== 0 ? (clampedY1 - b) / s : xlo;
    const x2adj = clampedY2 !== s * xhi + b && s !== 0 ? (clampedY2 - b) / s : xhi;
    return (
      <line
        x1={sx(x1adj)} y1={sy(clampedY1)}
        x2={sx(x2adj)} y2={sy(clampedY2)}
        stroke={color} strokeWidth={dashed ? 1.5 : 2}
        strokeDasharray={dashed ? "6,4" : undefined}
      />
    );
  };

  const xTickCount = xhi <= 8 ? xhi : 5;
  const xTicks = Array.from({ length: xTickCount + 1 }, (_, i) => xlo + (i / xTickCount) * (xhi - xlo));
  const yStep = yhi <= 100 ? 20 : yhi <= 300 ? 50 : 100;
  const yTicks = Array.from(
    { length: Math.floor(yhi / yStep) + 1 },
    (_, i) => i * yStep
  ).filter(v => v >= ylo && v <= yhi);

  return (
    <svg
      viewBox={`0 0 ${CW} ${CH}`}
      style={{ width: "100%", height: CH, cursor: dragging ? "grabbing" : "grab" }}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
    >
      {/* Grid */}
      {xTicks.map(v => (
        <line key={v} x1={sx(v)} y1={P.t} x2={sx(v)} y2={P.t + ph} stroke="#f1f5f9" />
      ))}
      {yTicks.map(v => (
        <line key={v} x1={P.l} y1={sy(v)} x2={P.l + pw} y2={sy(v)} stroke="#f1f5f9" />
      ))}

      {/* Axes */}
      <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph} stroke="#e2e8f0" />
      <line x1={P.l} y1={P.t} x2={P.l} y2={P.t + ph} stroke="#e2e8f0" />

      {/* Tick labels */}
      {xTicks.map(v => (
        <text key={v} x={sx(v)} y={P.t + ph + 14} textAnchor="middle" fontSize="8" fill="#94a3b8">
          {v.toFixed(0)}
        </text>
      ))}
      {yTicks.map(v => (
        <text key={v} x={P.l - 5} y={sy(v) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">
          {v}
        </text>
      ))}

      {/* Residual bars (user line) */}
      {points.map((pt, i) => {
        const yHat = slope * pt.x + intercept;
        const yHatClamped = Math.max(ylo, Math.min(yhi, yHat));
        return (
          <line key={i}
            x1={sx(pt.x)} y1={sy(pt.y)}
            x2={sx(pt.x)} y2={sy(yHatClamped)}
            stroke="#f59e0b" strokeWidth="1.5" strokeOpacity={0.75}
          />
        );
      })}

      {/* OLS line (dashed gray) */}
      {mkLine(olsSlope, olsIntercept, "#94a3b8", true)}

      {/* User line */}
      {mkLine(slope, intercept, "#6366f1")}

      {/* Data points */}
      {points.map((pt, i) => (
        <circle key={i} cx={sx(pt.x)} cy={sy(pt.y)} r={5} fill="#f97316" fillOpacity={0.85} />
      ))}

      {/* Axis labels */}
      <text x={P.l + pw / 2} y={CH - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">
        {xLabel}
      </text>
      <text x={9} y={P.t + ph / 2} textAnchor="middle" fontSize="9" fill="#94a3b8"
        transform={`rotate(-90, 9, ${P.t + ph / 2})`}>
        {yLabel} ({yUnit})
      </text>
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ResidualsExplorer() {
  const [presetId, setPresetId] = useState("cats");
  const preset = PRESETS.find(p => p.id === presetId)!;
  const { points } = preset;

  const { slope: olsSlope, intercept: olsIntercept } = useMemo(() => ols(points), [points]);

  const [slope, setSlope] = useState(olsSlope);
  const [intercept, setIntercept] = useState(olsIntercept);

  // Reset line to OLS when preset changes
  const lastPresetId = useRef(presetId);
  if (lastPresetId.current !== presetId) {
    lastPresetId.current = presetId;
    setSlope(olsSlope);
    setIntercept(olsIntercept);
  }

  const userSSE = useMemo(() => sse(points, slope, intercept), [points, slope, intercept]);
  const olsSSE  = useMemo(() => sse(points, olsSlope, olsIntercept), [points, olsSlope, olsIntercept]);

  // Drag interaction: horizontal drag rotates slope, vertical shifts intercept
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    dragging.current = true;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    const dy = e.clientY - lastY.current;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    // Scale sensitivity to data range
    const [xlo, xhi] = preset.xRange;
    const [, yhi] = preset.yRange;
    const slopeSens = (yhi / (xhi - xlo)) * 0.003;
    const interceptSens = yhi * 0.003;
    setSlope(s => s + dx * slopeSens);
    setIntercept(i => i - dy * interceptSens);
  }, [preset]);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
    setIsDragging(false);
  }, []);

  const excess    = userSSE - olsSSE;
  const excessPct = olsSSE > 0 ? (excess / olsSSE) * 100 : 0;

  const fmtPrice = (v: number) =>
    v >= 1_000_000
      ? `${(v / 1_000_000).toFixed(2)}T`
      : v >= 1_000
      ? `${(v / 1_000).toFixed(1)}B`
      : v.toFixed(0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Residuals Explorer
        </span>
      </div>

      {/* Preset tabs */}
      <div className="px-5 pt-4 pb-3">
        <div className="text-xs font-semibold text-slate-600 mb-2">Predictor</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => setPresetId(p.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                presetId === p.id
                  ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">{preset.description}</p>
      </div>

      {/* Chart */}
      <div className="px-5 pb-2">
        <ScatterChart
          preset={preset} slope={slope} intercept={intercept}
          olsSlope={olsSlope} olsIntercept={olsIntercept}
          dragging={isDragging} onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Drag anywhere to rotate and shift the line. Amber bars = residuals. Dashed gray = OLS solution.
        </p>
      </div>

      {/* SSE meters */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Sum of Squared Errors (SSE)
          </span>
        </div>
        <div className="px-4 py-3 space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-indigo-700 font-semibold">Your line</span>
              <span className="text-xs font-mono font-bold text-indigo-700">{fmtPrice(userSSE)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-400 transition-all"
                style={{ width: `${Math.min(100, (userSSE / (Math.max(olsSSE, 1) * 3)) * 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-500 font-semibold">OLS minimum</span>
              <span className="text-xs font-mono font-bold text-slate-500">{fmtPrice(olsSSE)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-slate-300"
                style={{ width: `${Math.min(100, (olsSSE / (Math.max(olsSSE, 1) * 3)) * 100)}%` }} />
            </div>
          </div>
          {excess > 0.01 ? (
            <div className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-1.5">
              Your line has {excessPct.toFixed(1)}% more error than the OLS solution.
            </div>
          ) : (
            <div className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5">
              You're at (or very near) the OLS minimum — no line can do better.
            </div>
          )}
        </div>
      </div>

      {/* Equation */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
          Current line equation
        </div>
        <div className="font-mono text-sm text-slate-800">
          price = {slope.toFixed(1)} × {preset.xLabel.split(" ")[0].toLowerCase()}{" "}
          {intercept >= 0 ? "+" : "−"} {Math.abs(intercept).toFixed(1)}k
        </div>
        <div className="font-mono text-xs text-slate-400 mt-0.5">
          OLS: price = {olsSlope.toFixed(1)} × {preset.xLabel.split(" ")[0].toLowerCase()}{" "}
          {olsIntercept >= 0 ? "+" : "−"} {Math.abs(olsIntercept).toFixed(1)}k
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400" /> Houses
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 bg-indigo-400" /> Your line
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 border-t border-dashed border-slate-400" /> OLS line
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-0.5 h-3 bg-amber-400 opacity-75" /> Residuals
        </span>
      </div>
    </div>
  );
}
