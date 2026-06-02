"use client";

import { useState, useCallback } from "react";

const POPULATION_SIZE = 200;
const POPULATION_MEAN = 72; // true mean (e.g. avg score)
const POPULATION_SD = 12;

// Seeded pseudo-random normal via Box-Muller
function seedRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const u = ((s >>> 0) / 0xffffffff);
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const v = ((s >>> 0) / 0xffffffff);
    return Math.sqrt(-2 * Math.log(u + 1e-9)) * Math.cos(2 * Math.PI * v);
  };
}

function generatePopulation(): number[] {
  const rng = seedRng(42);
  return Array.from({ length: POPULATION_SIZE }, () =>
    Math.round(Math.max(20, Math.min(120, POPULATION_MEAN + rng() * POPULATION_SD)))
  );
}

const POPULATION = generatePopulation();
const POP_MEAN = POPULATION.reduce((a, b) => a + b, 0) / POPULATION.length;

function drawSample(size: number, trialSeed: number): number[] {
  const rng = seedRng(trialSeed * 9999 + size * 31);
  const indices = new Set<number>();
  while (indices.size < size) {
    indices.add(Math.floor(Math.abs(rng()) * POPULATION_SIZE) % POPULATION_SIZE);
  }
  return [...indices].map((i) => POPULATION[i]);
}

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

const SAMPLE_SIZES = [5, 10, 20, 50];

export default function PopulationSampleExplorer() {
  const [sampleSize, setSampleSize] = useState(10);
  const [trials, setTrials] = useState<number[]>([]); // sample means from repeated draws
  const [trialCount, setTrialCount] = useState(0);

  const drawOneSample = useCallback(() => {
    const seed = trialCount + 1;
    const s = drawSample(sampleSize, seed);
    const m = parseFloat(mean(s).toFixed(2));
    setTrials((prev) => [...prev, m]);
    setTrialCount((c) => c + 1);
  }, [sampleSize, trialCount]);

  const drawMany = useCallback(() => {
    const newMeans: number[] = [];
    for (let i = 0; i < 20; i++) {
      const seed = trialCount + i + 1;
      const s = drawSample(sampleSize, seed);
      newMeans.push(parseFloat(mean(s).toFixed(2)));
    }
    setTrials((prev) => [...prev, ...newMeans]);
    setTrialCount((c) => c + 20);
  }, [sampleSize, trialCount]);

  const reset = useCallback(() => {
    setTrials([]);
    setTrialCount(0);
  }, []);

  const changeSampleSize = (sz: number) => {
    setSampleSize(sz);
    setTrials([]);
    setTrialCount(0);
  };

  const trialMean = trials.length > 0 ? mean(trials) : null;
  const trialMin = trials.length > 0 ? Math.min(...trials) : null;
  const trialMax = trials.length > 0 ? Math.max(...trials) : null;

  // Histogram bins for sample means
  const BIN_MIN = 55;
  const BIN_MAX = 90;
  const BIN_WIDTH = 2.5;
  const BIN_COUNT = Math.ceil((BIN_MAX - BIN_MIN) / BIN_WIDTH);
  const bins: number[] = Array(BIN_COUNT).fill(0);
  for (const m of trials) {
    const idx = Math.floor((m - BIN_MIN) / BIN_WIDTH);
    if (idx >= 0 && idx < BIN_COUNT) bins[idx]++;
  }
  const maxBin = Math.max(...bins, 1);

  // True mean position as % in histogram
  const trueMeanPct = ((POP_MEAN - BIN_MIN) / (BIN_MAX - BIN_MIN)) * 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Population &amp; Sample Explorer
        </span>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Population summary */}
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 flex flex-wrap gap-x-8 gap-y-2 items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-400 mb-0.5">Population</p>
            <p className="text-xs text-indigo-700">{POPULATION_SIZE} individuals · exam scores</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-400 mb-0.5">True mean (μ)</p>
            <p className="text-base font-bold text-indigo-700 font-mono">{POP_MEAN.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-400 mb-0.5">In practice</p>
            <p className="text-xs text-indigo-600">μ is unknown — we only see samples</p>
          </div>
        </div>

        {/* Sample size selector */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Sample size (n)</p>
          <div className="flex gap-2 flex-wrap">
            {SAMPLE_SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => changeSampleSize(sz)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  sampleSize === sz
                    ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                n = {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Draw controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={drawOneSample}
            className="px-3 py-1.5 rounded-md text-xs font-semibold border bg-white border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Draw 1 sample
          </button>
          <button
            onClick={drawMany}
            className="px-3 py-1.5 rounded-md text-xs font-semibold border bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Draw 20 samples
          </button>
          {trials.length > 0 && (
            <button
              onClick={reset}
              className="px-3 py-1.5 rounded-md text-xs font-medium border bg-white border-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
          <span className="text-xs text-slate-400 font-mono ml-auto">
            {trials.length} draw{trials.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Histogram of sample means */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-3">
            Distribution of sample means (x̄)
          </p>

          {trials.length === 0 ? (
            <div className="h-28 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
              Draw some samples to see the distribution
            </div>
          ) : (
            <div className="relative">
              {/* Bars */}
              <div className="flex items-end gap-px" style={{ height: 112 }}>
                {bins.map((count, i) => {
                  const barHeight = Math.max(count > 0 ? 3 : 0, Math.round((count / maxBin) * 112));
                  const binCenter = BIN_MIN + (i + 0.5) * BIN_WIDTH;
                  const isNearMean = Math.abs(binCenter - POP_MEAN) < BIN_WIDTH;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all ${
                        isNearMean ? "bg-indigo-400" : "bg-indigo-200"
                      }`}
                      style={{ height: barHeight }}
                      title={`${(BIN_MIN + i * BIN_WIDTH).toFixed(1)}–${(BIN_MIN + (i + 1) * BIN_WIDTH).toFixed(1)}: ${count}`}
                    />
                  );
                })}
              </div>

              {/* True mean marker */}
              <div
                className="absolute top-0 bottom-0 w-px bg-indigo-500"
                style={{ left: `${trueMeanPct}%` }}
              >
                <span className="absolute -top-5 left-1 text-[10px] font-semibold text-indigo-600 whitespace-nowrap">
                  μ = {POP_MEAN.toFixed(1)}
                </span>
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between mt-1 text-[9px] text-slate-400 font-mono">
                <span>{BIN_MIN}</span>
                <span>{Math.round((BIN_MIN + BIN_MAX) / 2)}</span>
                <span>{BIN_MAX}</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        {trials.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                Mean of x̄s
              </p>
              <p className="text-base font-bold text-slate-700 font-mono">
                {trialMean!.toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400">converges on μ</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                Range
              </p>
              <p className="text-sm font-bold text-slate-700 font-mono">
                {trialMin!.toFixed(1)} – {trialMax!.toFixed(1)}
              </p>
              <p className="text-[10px] text-slate-400">spread of x̄s</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2.5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-400 mb-0.5">
                True μ
              </p>
              <p className="text-base font-bold text-indigo-700 font-mono">
                {POP_MEAN.toFixed(1)}
              </p>
              <p className="text-[10px] text-indigo-400">population mean</p>
            </div>
          </div>
        )}

        {/* Insight callout — appears after enough draws */}
        {trials.length >= 10 && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 flex gap-2 items-start">
            <span className="text-emerald-500 text-sm mt-0.5 shrink-0">✓</span>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Notice that no single sample mean equals μ exactly — but the distribution
              of sample means clusters around it. This is the <strong>sampling distribution</strong>{" "}
              of the mean. With a larger n, it gets tighter; with more draws, it gets smoother.
              That clustering is why x̄ is an unbiased estimator of μ.
            </p>
          </div>
        )}
      </div>

      {/* Footer legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-indigo-100 border border-indigo-200" />
          Sample mean (x̄)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-0.5 h-3 bg-indigo-500" />
          True population mean (μ)
        </span>
        <span className="ml-auto text-slate-400">
          Increase n to reduce spread
        </span>
      </div>
    </div>
  );
}
