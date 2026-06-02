"use client";

import { useState, useMemo } from "react";

const NUM_BARS = 40;
const BAR_HEIGHT = 120;

// Evaluate the Gram-Charlier A-series PDF at point z given skew and excess kurtosis.
// This is a deterministic analytical approximation — no random sampling.
function gramCharlierPDF(z: number, skew: number, kurt: number): number {
  const phi = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  const h3 = z * z * z - 3 * z;
  const h4 = z * z * z * z - 6 * z * z + 3;
  return phi * (1 + (skew / 6) * h3 + (kurt / 24) * h4);
}

function generateDistribution(skew: number, kurt: number): number[] {
  const POINTS = 400;
  const spread = 3.5 + Math.abs(skew) * 0.5;
  const step = (2 * spread) / POINTS;

  // Sample the PDF densely then bin into bars
  const bars = new Array(NUM_BARS).fill(0);
  for (let p = 0; p < POINTS; p++) {
    const z = -spread + (p + 0.5) * step;
    const density = Math.max(0, gramCharlierPDF(z, skew, kurt));
    const normalized = (z + spread) / (2 * spread);
    const bin = Math.floor(normalized * NUM_BARS);
    if (bin >= 0 && bin < NUM_BARS) bars[bin] += density;
  }

  return bars;
}

function computeStats(skew: number): { mean: number; median: number } {
  // Mean is to the right of median for right-skew, left for left-skew
  // Represent as positions in [0,1] within the display
  const center = 0.5;
  const offset = skew * 0.06;
  return {
    mean: center + offset,
    median: center,
  };
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  leftLabel,
  rightLabel,
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  leftLabel: string;
  rightLabel: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className={`text-xs font-mono font-bold ${color}`}>
          {value > 0 ? "+" : ""}{value.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-slate-200 cursor-pointer accent-indigo-500"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

function DistributionPanel({
  title,
  bars,
  skew,
  showMeanMedian,
  accentColor,
  barColor,
}: {
  title: string;
  bars: number[];
  skew: number;
  showMeanMedian: boolean;
  accentColor: string;
  barColor: string;
}) {
  const max = Math.max(...bars, 1);
  const { mean, median } = computeStats(skew);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</span>
      </div>

      <div className="relative" style={{ height: BAR_HEIGHT + 20 }}>
        {/* Mean/median lines */}
        {showMeanMedian && (
          <>
            {/* Median line */}
            <div
              className="absolute bottom-5 top-0 w-px"
              style={{ left: `${median * 100}%`, backgroundColor: "#6366f1" }}
            >
              <div className="absolute -top-4 -translate-x-1/2 text-[10px] font-bold text-indigo-500 whitespace-nowrap">
                median
              </div>
            </div>
            {/* Mean line */}
            {Math.abs(skew) > 0.05 && (
              <div
                className="absolute bottom-5 top-0 w-px"
                style={{ left: `${mean * 100}%`, backgroundColor: "#f59e0b" }}
              >
                <div className="absolute -top-4 -translate-x-1/2 text-[10px] font-bold text-amber-500 whitespace-nowrap">
                  mean
                </div>
              </div>
            )}
          </>
        )}

        {/* Bars */}
        <div className="absolute bottom-5 left-0 right-0 flex items-end gap-px" style={{ height: BAR_HEIGHT }}>
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${barColor} transition-all duration-150`}
              style={{ height: `${(h / max) * 100}%`, opacity: 0.85 }}
            />
          ))}
        </div>

        {/* Baseline */}
        <div className="absolute bottom-5 left-0 right-0 h-px bg-slate-200" />

        {/* Axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

export default function DistributionExplorer() {
  const [skew, setSkew] = useState(0);
  const [kurt, setKurt] = useState(0);

  const skewBars = useMemo(() => generateDistribution(skew, 0), [skew]);
  const kurtBars = useMemo(() => generateDistribution(0, kurt), [kurt]);

  const skewLabel =
    skew < -0.3 ? "Left-skewed (negative)" :
    skew > 0.3 ? "Right-skewed (positive)" :
    "Symmetric";

  const kurtLabel =
    kurt < -0.5 ? "Platykurtic (light tails)" :
    kurt > 0.5 ? "Leptokurtic (heavy tails)" :
    "Mesokurtic (normal)";

  const { mean, median } = computeStats(skew);
  const meanIsHigher = mean > median + 0.005;
  const meanIsLower = mean < median - 0.005;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Distribution Explorer
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {/* Skewness panel */}
        <div className="p-5 space-y-4">
          <Slider
            label="Skewness"
            value={skew}
            min={-3}
            max={3}
            step={0.1}
            onChange={setSkew}
            leftLabel="Left-skewed"
            rightLabel="Right-skewed"
            color={skew < 0 ? "text-violet-500" : skew > 0 ? "text-rose-500" : "text-slate-400"}
          />

          <DistributionPanel
            title={skewLabel}
            bars={skewBars}
            skew={skew}
            showMeanMedian={true}
            accentColor="indigo"
            barColor={skew < -0.3 ? "bg-violet-300" : skew > 0.3 ? "bg-rose-300" : "bg-indigo-300"}
          />

          {/* Mean vs median callout */}
          <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-600 leading-relaxed">
            {meanIsHigher && (
              <>
                The tail pulls values rightward. The{" "}
                <span className="font-semibold text-amber-600">mean</span> is{" "}
                <span className="font-semibold">higher</span> than the{" "}
                <span className="font-semibold text-indigo-600">median</span> because extreme high values inflate the average.
              </>
            )}
            {meanIsLower && (
              <>
                The tail pulls values leftward. The{" "}
                <span className="font-semibold text-amber-600">mean</span> is{" "}
                <span className="font-semibold">lower</span> than the{" "}
                <span className="font-semibold text-indigo-600">median</span> because extreme low values drag the average down.
              </>
            )}
            {!meanIsHigher && !meanIsLower && (
              <>
                Symmetric distribution — the{" "}
                <span className="font-semibold text-indigo-600">mean</span> and{" "}
                <span className="font-semibold text-indigo-600">median</span> coincide.
              </>
            )}
          </div>

          {/* Legend */}
          {Math.abs(skew) > 0.05 && (
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-0.5 bg-indigo-500" />
                Median
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-0.5 bg-amber-400" />
                Mean
              </span>
            </div>
          )}
        </div>

        {/* Kurtosis panel */}
        <div className="p-5 space-y-4">
          <Slider
            label="Kurtosis"
            value={kurt}
            min={-3}
            max={3}
            step={0.1}
            onChange={setKurt}
            leftLabel="Flat / light tails"
            rightLabel="Peaked / heavy tails"
            color={kurt < 0 ? "text-emerald-500" : kurt > 0 ? "text-orange-500" : "text-slate-400"}
          />

          <DistributionPanel
            title={kurtLabel}
            bars={kurtBars}
            skew={0}
            showMeanMedian={false}
            accentColor="emerald"
            barColor={kurt < -0.3 ? "bg-emerald-300" : kurt > 0.3 ? "bg-orange-300" : "bg-indigo-300"}
          />

          <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-600 leading-relaxed">
            {kurt > 0.5 && (
              <>
                <span className="font-semibold text-orange-600">Leptokurtic</span> — a sharp peak with heavy tails. Extreme values are more common than a normal distribution would predict. Think financial returns or earthquake magnitudes.
              </>
            )}
            {kurt < -0.5 && (
              <>
                <span className="font-semibold text-emerald-600">Platykurtic</span> — a flat peak with light tails. Values are more spread out; extremes are rarer. Think test scores on a very easy exam.
              </>
            )}
            {kurt >= -0.5 && kurt <= 0.5 && (
              <>
                <span className="font-semibold text-slate-700">Mesokurtic</span> — kurtosis close to zero, similar to a normal distribution. Tails and peak are neither unusually heavy nor light.
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
        <div>
          <div className={`text-base font-bold ${skew < -0.1 ? "text-violet-600" : skew > 0.1 ? "text-rose-600" : "text-slate-600"}`}>
            {skew.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400">Skewness</div>
        </div>
        <div>
          <div className={`text-base font-bold ${kurt < -0.1 ? "text-emerald-600" : kurt > 0.1 ? "text-orange-600" : "text-slate-600"}`}>
            {kurt.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400">Kurtosis</div>
        </div>
      </div>
    </div>
  );
}
