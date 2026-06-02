"use client";

import { useState, useMemo } from "react";

// ── signal generation ──────────────────────────────────────────────────────────

const N = 365;          // one year of daily points
const FS = N;

type View = "decomposed" | "combined";

interface Params {
  trendSlope: number;    // units/year
  seasonalAmp: number;   // 0–1
  noiseLevel: number;    // 0–1
}

function buildSeries(params: Params) {
  const { trendSlope, seasonalAmp, noiseLevel } = params;

  // deterministic pseudo-noise using a seeded LCG so the chart is stable
  let seed = 42;
  function rand() {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  }

  const trend: number[] = [];
  const seasonal: number[] = [];
  const residual: number[] = [];
  const raw: number[] = [];

  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);                             // 0..1
    const tr = trendSlope * t;                          // linear trend
    const se = seasonalAmp * Math.sin(2 * Math.PI * t * 1 - Math.PI / 2);  // yearly cycle
    const re = noiseLevel * (rand() * 2 - 1) * 0.5;   // noise

    trend.push(tr);
    seasonal.push(se);
    residual.push(re);
    raw.push(tr + se + re);
  }

  return { trend, seasonal, residual, raw };
}

// ── SVG helpers ────────────────────────────────────────────────────────────────

const W = 520;
const ROW_H = 80;
const PAD_X = 12;
const PAD_Y = 10;

function clampRange(vals: number[]): [number, number] {
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  const pad = Math.max((mx - mn) * 0.15, 0.05);
  return [mn - pad, mx + pad];
}

function toPath(vals: number[], yMin: number, yMax: number, h: number): string {
  const pw = W - PAD_X * 2;
  const ph = h - PAD_Y * 2;
  return vals
    .map((v, i) => {
      const x = PAD_X + (i / (vals.length - 1)) * pw;
      const y = PAD_Y + ph - ((v - yMin) / (yMax - yMin)) * ph;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function zeroY(yMin: number, yMax: number, h: number): number {
  const ph = h - PAD_Y * 2;
  return PAD_Y + ph - ((0 - yMin) / (yMax - yMin)) * ph;
}

interface MiniChartProps {
  label: string;
  values: number[];
  color: string;
  fillColor: string;
  height?: number;
}

function MiniChart({ label, values, color, fillColor, height = ROW_H }: MiniChartProps) {
  const [yMin, yMax] = clampRange(values);
  const path = toPath(values, yMin, yMax, height);
  const zy = zeroY(yMin, yMax, height);
  const pw = W - PAD_X * 2;

  // area fill path
  const areaPath =
    path +
    ` L${(PAD_X + pw).toFixed(1)},${zy.toFixed(1)} L${PAD_X},${zy.toFixed(1)} Z`;

  return (
    <div>
      <div className="flex items-center justify-between mb-1 px-1">
        <span className={`text-xs font-semibold ${color}`}>{label}</span>
        <span className="text-[10px] text-slate-400 font-mono">
          {yMin.toFixed(2)} → {yMax.toFixed(2)}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        {/* zero line */}
        {zy > PAD_Y && zy < height - PAD_Y && (
          <line
            x1={PAD_X}
            y1={zy}
            x2={W - PAD_X}
            y2={zy}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        )}
        {/* area */}
        <path d={areaPath} fill={fillColor} opacity="0.35" />
        {/* line */}
        <path d={path} fill="none" stroke={color.replace("text-", "").replace("-600", "")} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// ── controls ───────────────────────────────────────────────────────────────────

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  accent: string;
}

function Slider({ label, value, min, max, step, onChange, accent }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className={`text-xs font-mono font-semibold ${accent}`}>
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 accent-indigo-500"
      />
    </div>
  );
}

// ── the component ──────────────────────────────────────────────────────────────

const LAYER_META = [
  {
    key: "trend" as const,
    label: "Trend",
    stroke: "#6366f1",
    fill: "#c7d2fe",
    textColor: "text-indigo-600",
    desc: "Long-run direction of the series",
  },
  {
    key: "seasonal" as const,
    label: "Seasonal",
    stroke: "#0ea5e9",
    fill: "#bae6fd",
    textColor: "text-sky-600",
    desc: "Repeating calendar-driven cycles",
  },
  {
    key: "residual" as const,
    label: "Residual",
    stroke: "#f97316",
    fill: "#fed7aa",
    textColor: "text-orange-500",
    desc: "What's left after removing trend and seasonal",
  },
];

export default function TimeSeriesDecomposition() {
  const [view, setView] = useState<View>("combined");
  const [params, setParams] = useState<Params>({
    trendSlope: 0.8,
    seasonalAmp: 0.5,
    noiseLevel: 0.4,
  });

  const { trend, seasonal, residual, raw } = useMemo(
    () => buildSeries(params),
    [params]
  );

  function set(key: keyof Params) {
    return (v: number) => setParams((p) => ({ ...p, [key]: v }));
  }

  const rawRange = clampRange(raw);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Time Series Decomposition
        </span>
        <div className="flex gap-1">
          {(["combined", "decomposed"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                view === v
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {v === "combined" ? "Combined" : "Decomposed"}
            </button>
          ))}
        </div>
      </div>

      {/* controls */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 grid grid-cols-3 gap-5">
        <Slider
          label="Trend strength"
          value={params.trendSlope}
          min={-1}
          max={1}
          step={0.05}
          onChange={set("trendSlope")}
          accent="text-indigo-600"
        />
        <Slider
          label="Seasonal amplitude"
          value={params.seasonalAmp}
          min={0}
          max={1}
          step={0.05}
          onChange={set("seasonalAmp")}
          accent="text-sky-600"
        />
        <Slider
          label="Noise level"
          value={params.noiseLevel}
          min={0}
          max={1}
          step={0.05}
          onChange={set("noiseLevel")}
          accent="text-orange-500"
        />
      </div>

      {/* charts */}
      <div className="p-5 space-y-4">
        {view === "combined" ? (
          <div>
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs font-semibold text-slate-600">Raw signal</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {rawRange[0].toFixed(2)} → {rawRange[1].toFixed(2)}
              </span>
            </div>
            <svg
              viewBox={`0 0 ${W} ${ROW_H * 1.8}`}
              className="w-full"
              style={{ height: ROW_H * 1.8 }}
              preserveAspectRatio="none"
            >
              {/* zero line */}
              <line
                x1={PAD_X}
                y1={zeroY(rawRange[0], rawRange[1], ROW_H * 1.8)}
                x2={W - PAD_X}
                y2={zeroY(rawRange[0], rawRange[1], ROW_H * 1.8)}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              {/* raw */}
              <path
                d={toPath(raw, rawRange[0], rawRange[1], ROW_H * 1.8)}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.2"
                opacity="0.7"
              />
              {/* trend overlay */}
              <path
                d={toPath(
                  trend.map((t) => t + seasonal.reduce((a, s) => a, 0) + 0),
                  rawRange[0],
                  rawRange[1],
                  ROW_H * 1.8
                )}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity="0.85"
              />
            </svg>
            {/* legend */}
            <div className="flex gap-5 mt-2 px-1">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block w-8 h-px bg-slate-400 opacity-70" />
                Raw
              </span>
              <span className="flex items-center gap-1.5 text-xs text-indigo-600">
                <span className="inline-block w-8 border-t-2 border-dashed border-indigo-500" />
                Trend
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* raw at top */}
            <div>
              <div className="flex items-center justify-between mb-1 px-1">
                <span className="text-xs font-semibold text-slate-500">Raw signal</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {rawRange[0].toFixed(2)} → {rawRange[1].toFixed(2)}
                </span>
              </div>
              <svg
                viewBox={`0 0 ${W} ${ROW_H}`}
                className="w-full"
                style={{ height: ROW_H }}
                preserveAspectRatio="none"
              >
                <line
                  x1={PAD_X}
                  y1={zeroY(rawRange[0], rawRange[1], ROW_H)}
                  x2={W - PAD_X}
                  y2={zeroY(rawRange[0], rawRange[1], ROW_H)}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <path
                  d={toPath(raw, rawRange[0], rawRange[1], ROW_H)}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* equals sign */}
            <div className="flex items-center gap-3 px-1">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs font-mono text-slate-400">= trend + seasonal + residual</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* three layers */}
            {LAYER_META.map(({ key, label, stroke, fill, textColor, desc }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
                    <span className="text-xs text-slate-400">{desc}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {Math.min(...(key === "trend" ? trend : key === "seasonal" ? seasonal : residual)).toFixed(2)} → {Math.max(...(key === "trend" ? trend : key === "seasonal" ? seasonal : residual)).toFixed(2)}
                  </span>
                </div>
                <svg
                  viewBox={`0 0 ${W} ${ROW_H}`}
                  className="w-full"
                  style={{ height: ROW_H }}
                  preserveAspectRatio="none"
                >
                  {(() => {
                    const vals = key === "trend" ? trend : key === "seasonal" ? seasonal : residual;
                    const [mn, mx] = clampRange(vals);
                    const zy = zeroY(mn, mx, ROW_H);
                    const pw = W - PAD_X * 2;
                    const linePath = toPath(vals, mn, mx, ROW_H);
                    const areaPath =
                      linePath +
                      ` L${(PAD_X + pw).toFixed(1)},${zy.toFixed(1)} L${PAD_X},${zy.toFixed(1)} Z`;
                    return (
                      <>
                        <line x1={PAD_X} y1={zy} x2={W - PAD_X} y2={zy} stroke="#e2e8f0" strokeWidth="1" />
                        <path d={areaPath} fill={fill} opacity="0.35" />
                        <path d={linePath} fill="none" stroke={stroke} strokeWidth="1.5" />
                      </>
                    );
                  })()}
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-1">
        {LAYER_META.map(({ textColor, label, desc }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`font-semibold ${textColor}`}>{label}</span>
            — {desc.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
