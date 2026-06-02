"use client";

import { useState, useCallback } from "react";

function rng(seed: number) {
  let s = (seed + 1) * 1664525 + 1013904223;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type SplitMode = "random" | "stratified";

// Fixed: 95 majority / 5 minority, 20% test
const DATASET_SIZE = 100;
const MAJORITY_COUNT = 95;
const MINORITY_COUNT = 5;
const TEST_FRAC = 0.2;

const LABELS = [
  ...Array(MAJORITY_COUNT).fill(0),
  ...Array(MINORITY_COUNT).fill(1),
];

function doRandomSplit(seed: number) {
  const r = rng(seed);
  const indices = shuffle(Array.from({ length: DATASET_SIZE }, (_, i) => i), r);
  const cutoff = Math.round(DATASET_SIZE * (1 - TEST_FRAC));
  return { train: new Set(indices.slice(0, cutoff)), test: new Set(indices.slice(cutoff)) };
}

function doStratifiedSplit(seed: number) {
  const r = rng(seed);
  const majIndices = shuffle(Array.from({ length: MAJORITY_COUNT }, (_, i) => i), r);
  const minIndices = shuffle(Array.from({ length: MINORITY_COUNT }, (_, i) => i + MAJORITY_COUNT), r);
  const majCut = Math.round(MAJORITY_COUNT * (1 - TEST_FRAC));
  const minCut = Math.round(MINORITY_COUNT * (1 - TEST_FRAC));
  return {
    train: new Set([...majIndices.slice(0, majCut), ...minIndices.slice(0, minCut)]),
    test: new Set([...majIndices.slice(majCut), ...minIndices.slice(minCut)]),
  };
}

function countClass(indices: Set<number>, cls: number) {
  let n = 0;
  for (const i of indices) if (LABELS[i] === cls) n++;
  return n;
}

export default function StratifiedSplitExplorer() {
  const [mode, setMode] = useState<SplitMode>("random");
  const [seed, setSeed] = useState(1);

  const split = mode === "random" ? doRandomSplit(seed) : doStratifiedSplit(seed);

  const trainMaj = countClass(split.train, 0);
  const trainMin = countClass(split.train, 1);
  const testMaj = countClass(split.test, 0);
  const testMin = countClass(split.test, 1);

  const testMinPct = Math.round((testMin / split.test.size) * 100);
  const trainMinPct = Math.round((trainMin / split.train.size) * 100);

  const resample = useCallback(() => setSeed((s) => s + 1), []);

  // Insight
  let bannerBg = "bg-amber-50 border-amber-200 text-amber-900";
  let bannerIcon = "⚠";
  let bannerMsg = "";
  if (mode === "stratified") {
    bannerBg = "bg-emerald-50 border-emerald-200 text-emerald-900";
    bannerIcon = "✓";
    bannerMsg = `Both sets preserve the 5% minority rate. Test metrics reflect real-world class balance.`;
  } else if (testMin === 0) {
    bannerBg = "bg-red-50 border-red-200 text-red-900";
    bannerIcon = "✗";
    bannerMsg = `Test set has zero minority examples — minority-class performance is unmeasurable.`;
  } else {
    bannerMsg = `Test set minority rate is ${testMinPct}% (true rate: 5%). Try reshuffling to see how much this varies.`;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Stratified Split Explorer
        </span>
        <span className="text-xs text-slate-400">
          100 samples · <span className="text-slate-500 font-medium">95 majority</span> · <span className="text-violet-600 font-medium">5 minority</span> · 20% test
        </span>
      </div>

      {/* Toggle + resample */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Split strategy</span>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-semibold">
          {(["random", "stratified"] as SplitMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 transition-all ${
                mode === m
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {m === "random" ? "Random" : "Stratified"}
            </button>
          ))}
        </div>
        <button
          onClick={resample}
          className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition-all"
        >
          Reshuffle
        </button>
      </div>

      {/* Dataset grid */}
      <div className="px-5 pb-3">
        <div className="flex flex-wrap gap-1">
          {LABELS.map((lbl, i) => {
            const inTrain = split.train.has(i);
            const isMaj = lbl === 0;
            return (
              <div
                key={i}
                title={`${isMaj ? "Majority" : "Minority"} · ${inTrain ? "Train" : "Test"}`}
                className={`relative w-4 h-4 rounded-sm border transition-all duration-200 ${
                  isMaj
                    ? "bg-indigo-200 border-indigo-300"
                    : "bg-amber-400 border-amber-500"
                }`}
              >
                {!inTrain && (
                  <svg viewBox="0 0 16 16" className="absolute inset-0 w-full h-full" fill="none">
                    <line x1="3" y1="3" x2="13" y2="13" stroke={isMaj ? "#4338ca" : "#92400e"} strokeWidth="2" strokeLinecap="round" />
                    <line x1="13" y1="3" x2="3" y2="13" stroke={isMaj ? "#4338ca" : "#92400e"} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-indigo-200 border border-indigo-300" />
            Majority · Train
          </span>
          <span className="flex items-center gap-1.5">
            <LegendX color="indigo" />
            Majority · Test
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-amber-400 border border-amber-500" />
            Minority · Train
          </span>
          <span className="flex items-center gap-1.5">
            <LegendX color="amber" />
            Minority · Test
          </span>
        </div>
      </div>

      {/* Split cards */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <SplitCard title="Train" total={split.train.size} majority={trainMaj} minority={trainMin} minPct={trainMinPct} />
          <SplitCard title="Test" total={split.test.size} majority={testMaj} minority={testMin} minPct={testMinPct} />
        </div>
      </div>

      {/* Banner */}
      <div className={`mx-5 mb-4 rounded-lg border px-4 py-3 text-xs leading-relaxed ${bannerBg}`}>
        <span className="font-bold mr-1.5">{bannerIcon}</span>
        {bannerMsg}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        Stratification preserves the imbalance — it does not fix it. Both train and test stay 95/5.
      </div>
    </div>
  );
}

function LegendX({ color }: { color: "indigo" | "amber" }) {
  const bg = color === "indigo" ? "bg-indigo-200 border-indigo-300" : "bg-amber-400 border-amber-500";
  const stroke = color === "indigo" ? "#4338ca" : "#92400e";
  return (
    <span className={`relative inline-block w-3 h-3 rounded-sm border ${bg}`}>
      <svg viewBox="0 0 16 16" className="absolute inset-0 w-full h-full" fill="none">
        <line x1="3" y1="3" x2="13" y2="13" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <line x1="13" y1="3" x2="3" y2="13" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function SplitCard({
  title,
  total,
  majority,
  minority,
  minPct,
}: {
  title: string;
  total: number;
  majority: number;
  minority: number;
  minPct: number;
}) {
  const diff = minPct - 5;
  const diffLabel = diff === 0 ? "exact" : `${diff > 0 ? "+" : ""}${diff}pp`;
  const diffColor = diff === 0 ? "text-emerald-600" : Math.abs(diff) <= 2 ? "text-amber-600" : "text-red-600";

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{title}</span>
        <span className="text-xs text-slate-400 font-mono">{total} samples</span>
      </div>

      {/* Stacked bar */}
      <div className="h-3 rounded-full overflow-hidden flex bg-slate-200">
        <div
          className="bg-indigo-300 h-full transition-all duration-300"
          style={{ width: `${(majority / total) * 100}%` }}
        />
        <div
          className="bg-amber-400 h-full transition-all duration-300"
          style={{ width: `${(minority / total) * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-500">
        <span><span className="font-semibold text-indigo-700 font-mono">{majority}</span> majority</span>
        <span><span className="font-semibold text-amber-600 font-mono">{minority}</span> minority</span>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
        <span className="text-slate-500">Minority rate: <span className="font-mono font-semibold text-amber-600">{minPct}%</span></span>
        <span className={`font-mono font-semibold ${diffColor}`}>{diffLabel}</span>
      </div>
    </div>
  );
}
