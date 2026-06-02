"use client";

import { useState, useMemo } from "react";

const W = 560;
const H = 180;
const PAD = { top: 28, right: 20, bottom: 44, left: 52 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;

const X_MIN = -10;
const X_MAX = 50;
const X_TICKS = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

type WeekConfig = {
  label: string;
  mu: number;
  sigma: number;
  yMax: number;
  fill: string;
  stroke: string;
};

const WEEKS: WeekConfig[] = [
  { label: "Week 1",  mu: 2,  sigma: 4,   yMax: 100, fill: "#c7c5e8", stroke: "#7c77bf" },
  { label: "Week 5",  mu: 6,  sigma: 7,   yMax: 80,  fill: "#b8ddc8", stroke: "#5aa67a" },
  { label: "Week 12", mu: 14, sigma: 11,  yMax: 60,  fill: "#f5e0a8", stroke: "#c9961e" },
];

function gaussian(x: number, mu: number, sigma: number): number {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function toSvgX(x: number) {
  return PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * CHART_W;
}

function toSvgY(y: number, yMax: number) {
  return PAD.top + (1 - y / yMax) * CHART_H;
}

function buildAreaPath(mu: number, sigma: number, yMax: number): string {
  const steps = 300;
  const dx = (X_MAX - X_MIN) / steps;
  const rawPeak = gaussian(mu, mu, sigma);
  const scale = yMax / rawPeak;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = X_MIN + i * dx;
    const y = gaussian(x, mu, sigma) * scale;
    const sx = toSvgX(x).toFixed(2);
    const sy = toSvgY(y, yMax).toFixed(2);
    pts.push(`${i === 0 ? "M" : "L"}${sx},${sy}`);
  }
  const baseY = toSvgY(0, yMax).toFixed(2);
  pts.push(`L${toSvgX(X_MAX).toFixed(2)},${baseY}`);
  pts.push(`L${toSvgX(X_MIN).toFixed(2)},${baseY}`);
  pts.push("Z");
  return pts.join(" ");
}

function Chart({ cfg, active }: { cfg: WeekConfig; active: boolean }) {
  const { label, mu, sigma, yMax, fill, stroke } = cfg;
  const areaPath = useMemo(() => buildAreaPath(mu, sigma, yMax), [mu, sigma, yMax]);
  const yTicks = useMemo(() => {
    const step = yMax <= 60 ? 15 : yMax <= 80 ? 20 : 25;
    const ticks: number[] = [];
    for (let v = 0; v <= yMax; v += step) ticks.push(v);
    return ticks;
  }, [yMax]);

  const meanSvgX = toSvgX(mu);
  const peakSvgY = toSvgY(yMax, yMax);

  return (
    <div
      className="rounded-lg border transition-all duration-200"
      style={{
        borderColor: active ? stroke : "#e2e8f0",
        background: active ? "#fafafa" : "white",
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 280 }}
        aria-label={`Arrival distribution for ${label}`}
      >
        {/* Week label */}
        <text
          x={PAD.left}
          y={PAD.top - 10}
          fontSize={12}
          fontWeight={600}
          fill="#374151"
        >
          {label}
        </text>

        {/* Y grid lines */}
        {yTicks.map((v) => {
          const sy = toSvgY(v, yMax);
          return (
            <g key={v}>
              <line
                x1={PAD.left} y1={sy}
                x2={PAD.left + CHART_W} y2={sy}
                stroke="#e5e7eb" strokeWidth={1}
              />
              <text
                x={PAD.left - 6} y={sy}
                textAnchor="end" dominantBaseline="middle"
                fontSize={9} fill="#9ca3af"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* X grid lines */}
        {X_TICKS.map((v) => {
          const sx = toSvgX(v);
          return (
            <g key={v}>
              <line
                x1={sx} y1={PAD.top}
                x2={sx} y2={PAD.top + CHART_H}
                stroke={v === 0 ? "#9ca3af" : "#e5e7eb"}
                strokeWidth={v === 0 ? 1.5 : 1}
                strokeDasharray={v === 0 ? "3 3" : undefined}
              />
              {v % 10 === 0 || v === 0 || v === -5 || v === 5 ? (
                <text
                  x={sx} y={PAD.top + CHART_H + 13}
                  textAnchor="middle" fontSize={9} fill="#9ca3af"
                >
                  {v}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Mean marker */}
        {active && (
          <line
            x1={meanSvgX} y1={peakSvgY}
            x2={meanSvgX} y2={PAD.top + CHART_H}
            stroke={stroke} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.8}
          />
        )}

        {/* Filled area */}
        <path d={areaPath} fill={fill} fillOpacity={0.65} />

        {/* Curve outline */}
        <path
          d={areaPath.split("L" + toSvgX(X_MAX).toFixed(2))[0]}
          fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round"
        />

        {/* Axis labels */}
        <text
          x={10} y={PAD.top + CHART_H / 2}
          textAnchor="middle" fontSize={10} fill="#6b7280"
          transform={`rotate(-90, 10, ${PAD.top + CHART_H / 2})`}
        >
          Density
        </text>
        <text
          x={PAD.left + CHART_W / 2} y={H - 4}
          textAnchor="middle" fontSize={10} fill="#6b7280"
        >
          Minutes Relative to Class Start Time
        </text>

        {/* Mean tooltip bubble */}
        {active && (
          <g>
            <rect
              x={meanSvgX + 4} y={peakSvgY + 4}
              width={72} height={16} rx={3}
              fill={stroke} opacity={0.9}
            />
            <text
              x={meanSvgX + 40} y={peakSvgY + 15}
              textAnchor="middle" fontSize={9} fill="white" fontWeight={600}
            >
              mean = {mu} min
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export default function DataDriftVisualizer() {
  const [activeWeek, setActiveWeek] = useState<number | null>(null);

  const insight = useMemo(() => {
    if (activeWeek === null) return null;
    const cfg = WEEKS[activeWeek];
    const descriptions = [
      "Week 1: Students arrive close to on-time. The distribution is tight and centered near 0 — arrivals cluster within a few minutes of the start bell.",
      "Week 5: The distribution has shifted right and widened. The mean arrival time is now ~6 minutes late and the spread has grown — early signs of behavioral drift.",
      "Week 12: Pronounced drift. The distribution is now centered at ~14 minutes late with heavy spread and a bimodal shape — a clear departure from the original pattern.",
    ];
    return descriptions[activeWeek];
  }, [activeWeek]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
        <span className="text-slate-400 text-sm">⟳</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Interactive · Data Drift Over Time
        </span>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-sm text-slate-600">
          What time do students arrive relative to the class start time (0)?
          Hover a chart to highlight it.
        </p>

        <div className="space-y-3">
          {WEEKS.map((cfg, i) => (
            <div
              key={cfg.label}
              onMouseEnter={() => setActiveWeek(i)}
              onMouseLeave={() => setActiveWeek(null)}
              className="cursor-default"
            >
              <Chart cfg={cfg} active={activeWeek === i} />
            </div>
          ))}
        </div>

        {/* Insight box */}
        <div
          className="rounded-lg border p-4 min-h-[56px] transition-all duration-200"
          style={{
            borderColor: activeWeek !== null ? WEEKS[activeWeek].stroke : "#e2e8f0",
            background: activeWeek !== null ? "#f9fafb" : "#f8fafc",
          }}
        >
          {insight ? (
            <p className="text-sm text-slate-700">{insight}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">
              Hover a chart to see observations about drift.
            </p>
          )}
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            The drift analogy
          </p>
          <p className="text-sm text-amber-900">
            Just as the student arrival distribution shifts over a semester, a deployed model's
            input distribution shifts as user behavior, language, or world events evolve. The
            model was trained on Week 1 data — by Week 12, it's operating out-of-distribution.
          </p>
        </div>
      </div>
    </div>
  );
}
