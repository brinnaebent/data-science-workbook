"use client";

import { useState, useCallback } from "react";

// Population: 80 people in a 10x8 grid, two subgroups (A=60%, B=40%)
const COLS = 10;
const ROWS = 8;
const POP_SIZE = COLS * ROWS;

// Fixed demographic assignment: first 48 are group A, last 32 are group B
const GROUPS = Array.from({ length: POP_SIZE }, (_, i) => (i < 48 ? "A" : "B"));

// Seeded deterministic rng
function rng(seed: number) {
  let s = (seed + 1) * 1664525 + 1013904223;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

type Method = "simple" | "stratified" | "cluster" | "systematic";

interface SamplingResult {
  selected: Set<number>;
  clusterIds?: number[]; // which clusters are selected (for cluster mode)
}

function sampleSimple(seed: number, n = 20): SamplingResult {
  const r = rng(seed);
  const pool = Array.from({ length: POP_SIZE }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return { selected: new Set(pool.slice(0, n)) };
}

function sampleStratified(seed: number): SamplingResult {
  const r = rng(seed);
  // 20 total: 12 from A (60%), 8 from B (40%)
  const groupA = Array.from({ length: POP_SIZE }, (_, i) => i).filter((i) => GROUPS[i] === "A");
  const groupB = Array.from({ length: POP_SIZE }, (_, i) => i).filter((i) => GROUPS[i] === "B");
  function pick(pool: number[], n: number) {
    const p = [...pool];
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    return p.slice(0, n);
  }
  return { selected: new Set([...pick(groupA, 12), ...pick(groupB, 8)]) };
}

// 4 clusters of 2 columns each; select 2 clusters
function sampleCluster(seed: number): SamplingResult {
  const r = rng(seed);
  const numClusters = 5;
  const clusterCols = 2;
  // clusters: 0=[col0,col1], 1=[col2,col3], ...
  const allClusters = Array.from({ length: numClusters }, (_, c) => c);
  for (let i = allClusters.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [allClusters[i], allClusters[j]] = [allClusters[j], allClusters[i]];
  }
  const chosenClusters = allClusters.slice(0, 2);
  const selected = new Set<number>();
  for (const c of chosenClusters) {
    const startCol = c * clusterCols;
    for (let row = 0; row < ROWS; row++) {
      for (let col = startCol; col < startCol + clusterCols; col++) {
        selected.add(row * COLS + col);
      }
    }
  }
  return { selected, clusterIds: chosenClusters };
}

// Every 4th element starting from a random offset
function sampleSystematic(seed: number): SamplingResult {
  const r = rng(seed);
  const k = 4;
  const start = Math.floor(r() * k);
  const selected = new Set<number>();
  for (let i = start; i < POP_SIZE; i += k) {
    selected.add(i);
  }
  return { selected };
}

const METHODS: { id: Method; label: string; description: string; note: string }[] = [
  {
    id: "simple",
    label: "Simple Random",
    description: "Every person has an equal chance. 20 people drawn at random.",
    note: "Clean but may under-represent small subgroups by chance.",
  },
  {
    id: "stratified",
    label: "Stratified",
    description: "Sample proportionally from each subgroup: 12 from Group A, 8 from Group B.",
    note: "Guarantees subgroup representation matches the population ratio.",
  },
  {
    id: "cluster",
    label: "Cluster",
    description: "Divide into 5 column-clusters, randomly select 2 entire clusters.",
    note: "Efficient when clusters are geographic or organizational. Less precise than SRS.",
  },
  {
    id: "systematic",
    label: "Systematic",
    description: "Pick a random start, then select every 4th person.",
    note: "Easy to execute. Fails if ordering correlates with what you're measuring.",
  },
];

// Cluster column ranges for highlight overlay
function clusterColRange(clusterId: number) {
  return [clusterId * 2, clusterId * 2 + 1];
}

export default function SamplingMethodsExplorer() {
  const [method, setMethod] = useState<Method>("simple");
  const [seed, setSeed] = useState(1);
  const [result, setResult] = useState<SamplingResult>(() => sampleSimple(1));

  const run = useCallback((m: Method, s: number) => {
    if (m === "simple") setResult(sampleSimple(s));
    else if (m === "stratified") setResult(sampleStratified(s));
    else if (m === "cluster") setResult(sampleCluster(s));
    else setResult(sampleSystematic(s));
  }, []);

  const handleMethod = (m: Method) => {
    setMethod(m);
    run(m, seed);
  };

  const resample = () => {
    const next = seed + 1;
    setSeed(next);
    run(method, next);
  };

  // Stats
  const selectedArr = [...result.selected];
  const selectedA = selectedArr.filter((i) => GROUPS[i] === "A").length;
  const selectedB = selectedArr.filter((i) => GROUPS[i] === "B").length;
  const pctA = selectedArr.length ? Math.round((selectedA / selectedArr.length) * 100) : 0;
  const pctB = selectedArr.length ? Math.round((selectedB / selectedArr.length) * 100) : 0;
  const currentMethod = METHODS.find((m) => m.id === method)!;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Sampling Methods Explorer
        </span>
      </div>

      {/* Method tabs */}
      <div className="px-5 pt-4 pb-0">
        <div className="flex flex-wrap gap-2">
          {METHODS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleMethod(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                method === id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pt-3 pb-2">
        <p className="text-sm text-slate-700 leading-relaxed">{currentMethod.description}</p>
      </div>

      {/* Population grid */}
      <div className="px-5 pb-3">
        <div className="relative inline-block">
          {/* Cluster column highlights */}
          {method === "cluster" && result.clusterIds && (
            <div className="absolute inset-0 pointer-events-none">
              {result.clusterIds.map((cid) => {
                const [startCol] = clusterColRange(cid);
                return (
                  <div
                    key={cid}
                    className="absolute top-0 bottom-0 rounded bg-violet-100 opacity-40"
                    style={{
                      left: `${(startCol / COLS) * 100}%`,
                      width: `${(2 / COLS) * 100}%`,
                    }}
                  />
                );
              })}
            </div>
          )}

          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {Array.from({ length: POP_SIZE }, (_, i) => {
              const isSelected = result.selected.has(i);
              const group = GROUPS[i];
              return (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    isSelected
                      ? group === "A"
                        ? "bg-indigo-500 border-indigo-600 scale-110"
                        : "bg-emerald-500 border-emerald-600 scale-110"
                      : group === "A"
                      ? "bg-indigo-100 border-indigo-200 opacity-50"
                      : "bg-emerald-100 border-emerald-200 opacity-50"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-5 mb-4 rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-slate-700">{selectedArr.length}</div>
            <div className="text-xs text-slate-400">selected</div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-600">{pctA}%</div>
            <div className="text-xs text-slate-400">Group A in sample</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-600">{pctB}%</div>
            <div className="text-xs text-slate-400">Group B in sample</div>
          </div>
        </div>

        {/* Representation bars */}
        <div className="mt-3 space-y-2">
          <RepBar label="Group A" samplePct={pctA} truePct={60} color="indigo" />
          <RepBar label="Group B" samplePct={pctB} truePct={40} color="emerald" />
        </div>
      </div>

      {/* Note + resample */}
      <div className="px-5 pb-4 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500 leading-relaxed flex-1">{currentMethod.note}</p>
        <button
          onClick={resample}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition-all"
        >
          Resample
        </button>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 border-2 border-indigo-600" />
          Group A selected (60% of pop.)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-600" />
          Group B selected (40% of pop.)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-slate-200 border-2 border-slate-300" />
          Not selected
        </span>
      </div>
    </div>
  );
}

function RepBar({
  label,
  samplePct,
  truePct,
  color,
}: {
  label: string;
  samplePct: number;
  truePct: number;
  color: "indigo" | "emerald";
}) {
  const diff = samplePct - truePct;
  const colorMap = {
    indigo: { bar: "bg-indigo-400", text: "text-indigo-600" },
    emerald: { bar: "bg-emerald-400", text: "text-emerald-600" },
  };
  const c = colorMap[color];
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 text-slate-500 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden relative">
        {/* True population line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
          style={{ left: `${truePct}%` }}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${c.bar}`}
          style={{ width: `${samplePct}%` }}
        />
      </div>
      <span className={`w-10 text-right font-mono ${c.text}`}>{samplePct}%</span>
      <span className={`w-12 text-right text-slate-400`}>
        {diff === 0 ? "exact" : `${diff > 0 ? "+" : ""}${diff}pp`}
      </span>
    </div>
  );
}
