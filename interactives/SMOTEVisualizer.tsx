"use client";

import { useState, useMemo } from "react";

// Seeded RNG
function rng(seed: number) {
  let s = (seed + 1) * 1664525 + 1013904223;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

interface Point {
  x: number;
  y: number;
  cls: 0 | 1; // 0=majority, 1=minority
}

interface SyntheticPoint {
  x: number;
  y: number;
  fromIdx: number;
  neighborIdx: number;
  t: number; // interpolation factor
}

function dist(a: Point, b: Point) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function kNearestMinority(point: Point, minority: Point[], k: number): number[] {
  return minority
    .map((p, i) => ({ i, d: dist(point, p) }))
    .filter(({ d }) => d > 0)
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map(({ i }) => i);
}

function generateDataset(seed: number): Point[] {
  const r = rng(seed);
  const points: Point[] = [];

  // Majority class: ~40 points in a loose cluster (top-right area)
  for (let i = 0; i < 40; i++) {
    points.push({
      x: 0.45 + r() * 0.45,
      y: 0.35 + r() * 0.5,
      cls: 0,
    });
  }

  // Minority class: ~8 points in a tighter cluster (bottom-left)
  for (let i = 0; i < 8; i++) {
    points.push({
      x: 0.08 + r() * 0.3,
      y: 0.08 + r() * 0.3,
      cls: 1,
    });
  }

  return points;
}

function generateSyntheticPoints(minority: Point[], k: number, count: number, seed: number): SyntheticPoint[] {
  const r = rng(seed + 999);
  const synthetics: SyntheticPoint[] = [];
  for (let i = 0; i < count; i++) {
    const fromIdx = Math.floor(r() * minority.length);
    const from = minority[fromIdx];
    const neighbors = kNearestMinority(from, minority, k);
    if (neighbors.length === 0) continue;
    const neighborIdx = neighbors[Math.floor(r() * neighbors.length)];
    const neighbor = minority[neighborIdx];
    const t = r();
    synthetics.push({
      x: from.x + t * (neighbor.x - from.x),
      y: from.y + t * (neighbor.y - from.y),
      fromIdx,
      neighborIdx,
      t,
    });
  }
  return synthetics;
}

// SVG coordinate helpers
const PAD = 28;
function toSvg(val: number, svgSize: number) {
  return PAD + val * (svgSize - PAD * 2);
}

const SVG_SIZE = 280;
const K = 3;
const SYNTH_COUNT = 12;

type View = "before" | "step" | "after";

export default function SMOTEVisualizer() {
  const [seed, setSeed] = useState(1);
  const [view, setView] = useState<View>("before");
  const [selectedMinority, setSelectedMinority] = useState<number | null>(null);

  const points = useMemo(() => generateDataset(seed), [seed]);
  const majority = useMemo(() => points.filter((p) => p.cls === 0), [points]);
  const minority = useMemo(() => points.filter((p) => p.cls === 1), [points]);
  const synthetics = useMemo(
    () => generateSyntheticPoints(minority, K, SYNTH_COUNT, seed),
    [minority, seed]
  );

  // Active minority point for step view
  const activeIdx = selectedMinority ?? 0;
  const activePoint = minority[activeIdx];
  const neighborIndices = activePoint ? kNearestMinority(activePoint, minority, K) : [];
  // One synthetic per neighbor, at a fixed t=0.5 for clarity
  const activeSynthetics = useMemo(() => {
    if (!activePoint) return [];
    return neighborIndices.map((ni) => {
      const neighbor = minority[ni];
      return {
        x: activePoint.x + 0.5 * (neighbor.x - activePoint.x),
        y: activePoint.y + 0.5 * (neighbor.y - activePoint.y),
        fromIdx: activeIdx,
        neighborIdx: ni,
        t: 0.5,
      };
    });
  }, [activeIdx, activePoint, neighborIndices, minority]);

  const reseed = () => {
    setSeed((s) => s + 1);
    setSelectedMinority(null);
  };

  const tabs: { id: View; label: string }[] = [
    { id: "before", label: "Before SMOTE" },
    { id: "step", label: "How SMOTE works" },
    { id: "after", label: "After SMOTE" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          SMOTE Visualizer
        </span>
        <span className="text-xs text-slate-400">
          <span className="text-slate-500 font-medium">40 majority</span>
          {" · "}
          <span className="text-violet-600 font-medium">8 minority</span>
          {" · "}
          k={K}
        </span>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4 pb-0 flex gap-2">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              view === id
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="px-5 pt-3 pb-2">
        {view === "before" && (
          <p className="text-sm text-slate-600 leading-relaxed">
            The minority class (violet) is heavily outnumbered. A classifier trained here will bias toward the majority class (indigo).
          </p>
        )}
        {view === "step" && (
          <p className="text-sm text-slate-600 leading-relaxed">
            Click a minority point to select it. SMOTE finds its {K} nearest neighbors and interpolates new synthetic points along the connecting lines.
          </p>
        )}
        {view === "after" && (
          <p className="text-sm text-slate-600 leading-relaxed">
            {SYNTH_COUNT} synthetic minority points (orange) are added, filling in the feature space between real minority examples.
          </p>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="px-5 pb-4 flex flex-col items-center">
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          className="rounded-lg border border-slate-100 bg-slate-50 w-full max-w-xs"
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((v) => (
            <g key={v}>
              <line
                x1={toSvg(v, SVG_SIZE)} y1={PAD}
                x2={toSvg(v, SVG_SIZE)} y2={SVG_SIZE - PAD}
                stroke="#e2e8f0" strokeWidth="1"
              />
              <line
                x1={PAD} y1={toSvg(v, SVG_SIZE)}
                x2={SVG_SIZE - PAD} y2={toSvg(v, SVG_SIZE)}
                stroke="#e2e8f0" strokeWidth="1"
              />
            </g>
          ))}

          {/* Step view: interpolation lines from active point to its synthetics */}
          {view === "step" && activePoint && activeSynthetics.map((s, i) => {
            const neighbor = minority[s.neighborIdx];
            return (
              <line
                key={`line-${i}`}
                x1={toSvg(activePoint.x, SVG_SIZE)}
                y1={toSvg(1 - activePoint.y, SVG_SIZE)}
                x2={toSvg(neighbor.x, SVG_SIZE)}
                y2={toSvg(1 - neighbor.y, SVG_SIZE)}
                stroke="#f97316"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.7"
              />
            );
          })}

          {/* Step view: neighbor connection lines */}
          {view === "step" && activePoint && neighborIndices.map((ni) => {
            const neighbor = minority[ni];
            return (
              <line
                key={`neighbor-line-${ni}`}
                x1={toSvg(activePoint.x, SVG_SIZE)}
                y1={toSvg(1 - activePoint.y, SVG_SIZE)}
                x2={toSvg(neighbor.x, SVG_SIZE)}
                y2={toSvg(1 - neighbor.y, SVG_SIZE)}
                stroke="#8b5cf6"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.5"
              />
            );
          })}

          {/* Majority points */}
          {majority.map((p, i) => (
            <circle
              key={`maj-${i}`}
              cx={toSvg(p.x, SVG_SIZE)}
              cy={toSvg(1 - p.y, SVG_SIZE)}
              r={5}
              fill="#a5b4fc"
              stroke="#818cf8"
              strokeWidth="1"
              opacity="0.75"
            />
          ))}

          {/* After view: synthetic points */}
          {view === "after" && synthetics.map((s, i) => (
            <circle
              key={`synth-${i}`}
              cx={toSvg(s.x, SVG_SIZE)}
              cy={toSvg(1 - s.y, SVG_SIZE)}
              r={5}
              fill="#fb923c"
              stroke="#ea580c"
              strokeWidth="1"
              opacity="0.85"
            />
          ))}

          {/* Step view: synthetics from active point only */}
          {view === "step" && activeSynthetics.map((s, i) => (
            <circle
              key={`step-synth-${i}`}
              cx={toSvg(s.x, SVG_SIZE)}
              cy={toSvg(1 - s.y, SVG_SIZE)}
              r={5}
              fill="#fb923c"
              stroke="#ea580c"
              strokeWidth="1.5"
            />
          ))}

          {/* Minority points */}
          {minority.map((p, i) => {
            const isActive = view === "step" && i === activeIdx;
            const isNeighbor = view === "step" && neighborIndices.includes(i) && i !== activeIdx;
            return (
              <circle
                key={`min-${i}`}
                cx={toSvg(p.x, SVG_SIZE)}
                cy={toSvg(1 - p.y, SVG_SIZE)}
                r={isActive ? 7 : 5}
                fill={isActive ? "#7c3aed" : isNeighbor ? "#a78bfa" : "#8b5cf6"}
                stroke={isActive ? "#5b21b6" : isNeighbor ? "#7c3aed" : "#6d28d9"}
                strokeWidth={isActive ? 2 : 1.5}
                className={view === "step" ? "cursor-pointer" : ""}
                onClick={() => {
                  if (view === "step") setSelectedMinority(i);
                }}
              />
            );
          })}

          {/* Active point ring */}
          {view === "step" && activePoint && (
            <circle
              cx={toSvg(activePoint.x, SVG_SIZE)}
              cy={toSvg(1 - activePoint.y, SVG_SIZE)}
              r={11}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="1.5"
              opacity="0.4"
              strokeDasharray="3 2"
            />
          )}
        </svg>
      </div>

      {/* Step view: k-neighbors explanation card */}
      {view === "step" && activePoint && (
        <div className="mx-5 mb-4 rounded-lg border border-violet-100 bg-violet-50 px-4 py-3 text-xs text-violet-900 space-y-1">
          <div className="font-semibold text-violet-800">
            Selected minority point #{activeIdx + 1}
          </div>
          <div>
            {neighborIndices.length} nearest neighbors found · {activeSynthetics.length} synthetic points interpolated
          </div>
          <div className="text-violet-600">
            Each orange point sits at the midpoint of the line between the selected point and one neighbor. In practice, the position is random along that line.
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="mx-5 mb-4 rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-indigo-500">40</div>
            <div className="text-xs text-slate-400">majority</div>
          </div>
          <div>
            <div className="text-lg font-bold text-violet-600">8</div>
            <div className="text-xs text-slate-400">minority</div>
          </div>
          {view === "after" ? (
            <div>
              <div className="text-lg font-bold text-orange-500">+{SYNTH_COUNT}</div>
              <div className="text-xs text-slate-400">synthetic</div>
            </div>
          ) : (
            <div>
              <div className="text-lg font-bold text-slate-400">5:1</div>
              <div className="text-xs text-slate-400">imbalance ratio</div>
            </div>
          )}
        </div>

        {/* Class balance bar */}
        <div className="mt-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Class balance</span>
            <span className="ml-auto font-mono">
              {view === "after"
                ? `${Math.round((8 + SYNTH_COUNT) / (40 + 8 + SYNTH_COUNT) * 100)}% minority`
                : "17% minority"}
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex bg-slate-200">
            <div
              className="bg-indigo-300 h-full transition-all duration-500"
              style={{ width: `${(40 / (40 + 8 + (view === "after" ? SYNTH_COUNT : 0))) * 100}%` }}
            />
            {view === "after" && (
              <div
                className="bg-orange-300 h-full transition-all duration-500"
                style={{ width: `${(SYNTH_COUNT / (40 + 8 + SYNTH_COUNT)) * 100}%` }}
              />
            )}
            <div
              className="bg-violet-400 h-full transition-all duration-500"
              style={{ width: `${(8 / (40 + 8 + (view === "after" ? SYNTH_COUNT : 0))) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Resample button */}
      <div className="px-5 pb-4 flex justify-end">
        <button
          onClick={reseed}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition-all"
        >
          New dataset
        </button>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill="#a5b4fc" stroke="#818cf8" strokeWidth="1" />
          </svg>
          Majority class
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1.5" />
          </svg>
          Minority class
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill="#fb923c" stroke="#ea580c" strokeWidth="1" />
          </svg>
          Synthetic (SMOTE)
        </span>
      </div>
    </div>
  );
}
