"use client";

import { useState, useMemo } from "react";

// --- Seeded RNG ---
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
  cls: 0 | 1;
  synthetic?: boolean;
  removed?: boolean;
}

function dist(a: Point, b: Point) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function kNearest(point: Point, candidates: Point[], k: number): number[] {
  return candidates
    .map((p, i) => ({ i, d: dist(point, p) }))
    .filter(({ d }) => d > 0)
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map(({ i }) => i);
}

// --- Dataset generation ---
// Minority cluster sits bottom-left. Majority cluster sits top-right.
// Four "straggler" majority points are placed very close to minority points —
// these are the ones Tomek Links removes.
function generateBase(seed: number): Point[] {
  const r = rng(seed);
  const points: Point[] = [];

  // Main majority cluster (top-right)
  for (let i = 0; i < 38; i++) {
    points.push({ x: 0.5 + r() * 0.42, y: 0.38 + r() * 0.48, cls: 0 });
  }

  // Minority cluster (bottom-left) — generate first so we know positions
  const minorityAnchors: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < 8; i++) {
    const p = { x: 0.07 + r() * 0.25, y: 0.07 + r() * 0.25, cls: 1 as const };
    minorityAnchors.push(p);
    points.push(p);
  }

  // Straggler majority points placed just outside each of 4 minority anchors.
  // Offset is small enough that the minority anchor is their nearest neighbor,
  // and they are the minority anchor's nearest majority neighbor — forming a Tomek link.
  const stragglerOffset = 0.055;
  const stragglerSeeds = [0, 2, 4, 6]; // use every other minority anchor
  for (const si of stragglerSeeds) {
    const anchor = minorityAnchors[si];
    if (!anchor) continue;
    // Place majority straggler just to the top-right of this minority point
    points.push({
      x: Math.min(anchor.x + stragglerOffset + r() * 0.01, 0.95),
      y: Math.min(anchor.y + stragglerOffset + r() * 0.01, 0.95),
      cls: 0,
    });
  }

  return points;
}

// SMOTE oversampling
function applySmote(points: Point[], count: number, seed: number): Point[] {
  const r = rng(seed + 77);
  const minority = points.filter((p) => p.cls === 1);
  const synthetics: Point[] = [];
  for (let i = 0; i < count; i++) {
    const fromIdx = Math.floor(r() * minority.length);
    const from = minority[fromIdx];
    const neighbors = kNearest(from, minority, 3);
    if (neighbors.length === 0) continue;
    const ni = neighbors[Math.floor(r() * neighbors.length)];
    const neighbor = minority[ni];
    const t = r();
    synthetics.push({
      x: from.x + t * (neighbor.x - from.x),
      y: from.y + t * (neighbor.y - from.y),
      cls: 1,
      synthetic: true,
    });
  }
  return [...points, ...synthetics];
}

// Random undersampling: keep a random subset of majority
function applyUndersampling(points: Point[], targetMajority: number, seed: number): Point[] {
  const r = rng(seed + 44);
  const minority = points.filter((p) => p.cls === 1);
  const majority = points.filter((p) => p.cls === 0);
  // Shuffle majority and keep targetMajority
  const shuffled = [...majority].sort(() => r() - 0.5);
  const kept = shuffled.slice(0, targetMajority).map((p) => ({ ...p }));
  const removed = shuffled.slice(targetMajority).map((p) => ({ ...p, removed: true }));
  return [...kept, ...removed, ...minority];
}

// Tomek Links: for each pair of cross-class points that are mutual nearest neighbors,
// mark the majority-class member as removed.
function applyTomekLinks(points: Point[]): Point[] {
  const active = points.filter((p) => !p.removed);

  // For each point, find the index (into active) of its nearest neighbor
  function nearestNeighborIdx(i: number): number {
    let best = -1;
    let bestDist = Infinity;
    for (let j = 0; j < active.length; j++) {
      if (j === i) continue;
      const d = dist(active[i], active[j]);
      if (d < bestDist) { bestDist = d; best = j; }
    }
    return best;
  }

  const tomekIndices = new Set<number>();
  for (let i = 0; i < active.length; i++) {
    const ni = nearestNeighborIdx(i);
    if (ni === -1) continue;
    // Tomek link: mutual nearest neighbors of different classes
    if (active[i].cls !== active[ni].cls && nearestNeighborIdx(ni) === i) {
      // Remove the majority-class member of the pair
      if (active[i].cls === 0) tomekIndices.add(i);
      if (active[ni].cls === 0) tomekIndices.add(ni);
    }
  }

  // Map back: active[i] corresponds to points filtered by !removed
  let activeIdx = 0;
  return points.map((p) => {
    if (p.removed) return p;
    const shouldRemove = tomekIndices.has(activeIdx++);
    return shouldRemove ? { ...p, removed: true } : p;
  });
}

// --- SVG helpers ---
const PAD = 20;
const SZ = 200;

function toSvg(v: number) {
  return PAD + v * (SZ - PAD * 2);
}

// --- Panel config ---
const MAJORITY_COLOR = { fill: "#a5b4fc", stroke: "#818cf8" };
const MINORITY_COLOR = { fill: "#8b5cf6", stroke: "#6d28d9" };
const SYNTHETIC_COLOR = { fill: "#fb923c", stroke: "#ea580c" };
const REMOVED_COLOR = { fill: "#e2e8f0", stroke: "#cbd5e1" };

interface PanelData {
  id: string;
  label: string;
  description: string;
  points: Point[];
}

function Panel({ data }: { data: PanelData }) {
  const active = data.points.filter((p) => !p.removed);
  const majority = active.filter((p) => p.cls === 0);
  const minority = active.filter((p) => p.cls === 1 && !p.synthetic);
  const synthetics = active.filter((p) => p.cls === 1 && p.synthetic);
  const removed = data.points.filter((p) => p.removed);

  const majorityCount = majority.length;
  const minorityTotal = minority.length + synthetics.length;
  const ratio = majorityCount > 0 && minorityTotal > 0
    ? `${Math.round(majorityCount / minorityTotal)}:1`
    : "—";

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      {/* Panel header */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
        <div className="text-xs font-semibold text-slate-700">{data.label}</div>
        <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{data.description}</div>
      </div>

      {/* SVG */}
      <div className="p-2">
        <svg
          viewBox={`0 0 ${SZ} ${SZ}`}
          className="w-full rounded border border-slate-100 bg-slate-50"
          style={{ aspectRatio: "1" }}
        >
          {/* Grid */}
          {[0.25, 0.5, 0.75].map((v) => (
            <g key={v}>
              <line x1={toSvg(v)} y1={PAD} x2={toSvg(v)} y2={SZ - PAD} stroke="#e2e8f0" strokeWidth="0.5" />
              <line x1={PAD} y1={toSvg(v)} x2={SZ - PAD} y2={toSvg(v)} stroke="#e2e8f0" strokeWidth="0.5" />
            </g>
          ))}

          {/* Removed (ghost) majority points */}
          {removed.map((p, i) => (
            <circle
              key={`rem-${i}`}
              cx={toSvg(p.x)} cy={toSvg(1 - p.y)}
              r={3}
              fill={REMOVED_COLOR.fill}
              stroke={REMOVED_COLOR.stroke}
              strokeWidth="0.5"
              strokeDasharray="2 1"
            />
          ))}

          {/* Majority */}
          {majority.map((p, i) => (
            <circle
              key={`maj-${i}`}
              cx={toSvg(p.x)} cy={toSvg(1 - p.y)}
              r={3.5}
              fill={MAJORITY_COLOR.fill}
              stroke={MAJORITY_COLOR.stroke}
              strokeWidth="0.8"
              opacity="0.8"
            />
          ))}

          {/* Synthetic minority */}
          {synthetics.map((p, i) => (
            <circle
              key={`synth-${i}`}
              cx={toSvg(p.x)} cy={toSvg(1 - p.y)}
              r={3.5}
              fill={SYNTHETIC_COLOR.fill}
              stroke={SYNTHETIC_COLOR.stroke}
              strokeWidth="0.8"
              opacity="0.85"
            />
          ))}

          {/* Real minority */}
          {minority.map((p, i) => (
            <circle
              key={`min-${i}`}
              cx={toSvg(p.x)} cy={toSvg(1 - p.y)}
              r={3.5}
              fill={MINORITY_COLOR.fill}
              stroke={MINORITY_COLOR.stroke}
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Stats row */}
      <div className="px-3 pb-2 grid grid-cols-3 gap-1 text-center">
        <div>
          <div className="text-xs font-bold text-indigo-400">{majorityCount}</div>
          <div className="text-[9px] text-slate-400">majority</div>
        </div>
        <div>
          <div className="text-xs font-bold text-violet-500">{minority.length}</div>
          <div className="text-[9px] text-slate-400">minority</div>
        </div>
        {synthetics.length > 0 ? (
          <div>
            <div className="text-xs font-bold text-orange-400">+{synthetics.length}</div>
            <div className="text-[9px] text-slate-400">synthetic</div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-bold text-slate-400">{ratio}</div>
            <div className="text-[9px] text-slate-400">ratio</div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main component ---
export default function ClassBalancingComparison() {
  const [seed, setSeed] = useState(1);

  const panels = useMemo<PanelData[]>(() => {
    const base = generateBase(seed);

    // 1. No resampling
    const nonePoints = base.map((p) => ({ ...p }));

    // 2. SMOTE (add ~26 synthetic minority to go from 8→34, near 42 majority)
    const smotePoints = applySmote(base, 26, seed);

    // 3. Random undersampling (keep 10 of 42 majority → ~10:8 ratio)
    const undersampledPoints = applyUndersampling(base, 10, seed);

    // 4. Tomek Links only (remove boundary stragglers from original imbalanced data)
    const tomekPoints = applyTomekLinks(base.map((p) => ({ ...p })));

    return [
      {
        id: "none",
        label: "No Resampling",
        description: "42 majority vs 8 minority",
        points: nonePoints,
      },
      {
        id: "smote",
        label: "SMOTE",
        description: "Synthetic minority added",
        points: smotePoints,
      },
      {
        id: "undersample",
        label: "Random Undersampling",
        description: "Majority discarded",
        points: undersampledPoints,
      },
      {
        id: "tomek",
        label: "Tomek Links",
        description: "Boundary stragglers removed",
        points: tomekPoints,
      },
    ];
  }, [seed]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Resampling Strategy Comparison
        </span>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition-all"
        >
          New dataset
        </button>
      </div>

      {/* Description */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-sm text-slate-600 leading-relaxed">
          The same imbalanced dataset, four resampling strategies. Compare how each technique changes the composition and distribution of training points.
        </p>
      </div>

      {/* 2x2 grid */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        {panels.map((panel) => (
          <Panel key={panel.id} data={panel} />
        ))}
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill={MAJORITY_COLOR.fill} stroke={MAJORITY_COLOR.stroke} strokeWidth="1" />
          </svg>
          Majority class
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill={MINORITY_COLOR.fill} stroke={MINORITY_COLOR.stroke} strokeWidth="1.5" />
          </svg>
          Minority class
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill={SYNTHETIC_COLOR.fill} stroke={SYNTHETIC_COLOR.stroke} strokeWidth="1" />
          </svg>
          Synthetic (SMOTE)
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill={REMOVED_COLOR.fill} stroke={REMOVED_COLOR.stroke} strokeWidth="1" strokeDasharray="2 1" />
          </svg>
          Removed (ghost)
        </span>
      </div>
    </div>
  );
}
