"use client";

import { useState, useMemo } from "react";

// Generate a ground-truth signal: sum of two sinusoids
function groundTruth(t: number): number {
  return 0.5 * Math.sin(2 * Math.PI * 1.3 * t) + 0.35 * Math.sin(2 * Math.PI * 3.7 * t);
}

const GT_POINTS = 500;
const DURATION = 2; // seconds

function buildGTCurve(): { x: number; y: number }[] {
  return Array.from({ length: GT_POINTS }, (_, i) => {
    const t = (i / (GT_POINTS - 1)) * DURATION;
    return { x: t, y: groundTruth(t) };
  });
}

// Sample the signal at a given rate, then optionally upsample back to target rate via linear interpolation
function buildSamples(rate: number): { t: number; y: number }[] {
  const count = Math.round(rate * DURATION) + 1;
  return Array.from({ length: count }, (_, i) => {
    const t = (i / (count - 1)) * DURATION;
    return { t, y: groundTruth(t) };
  });
}

function upsample(
  samples: { t: number; y: number }[],
  targetRate: number
): { t: number; y: number }[] {
  const count = Math.round(targetRate * DURATION) + 1;
  return Array.from({ length: count }, (_, i) => {
    const t = (i / (count - 1)) * DURATION;
    // linear interpolation between surrounding samples
    const lo = samples.findLastIndex((s) => s.t <= t);
    const hi = lo + 1;
    if (lo < 0) return { t, y: samples[0].y };
    if (hi >= samples.length) return { t, y: samples[samples.length - 1].y };
    const frac = (t - samples[lo].t) / (samples[hi].t - samples[lo].t);
    return { t, y: samples[lo].y + frac * (samples[hi].y - samples[lo].y) };
  });
}

// SVG helpers
const W = 400;
const H = 140;
const PAD = { top: 12, bottom: 16, left: 8, right: 8 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const Y_RANGE = 1.1;

function toSvgX(t: number) {
  return PAD.left + (t / DURATION) * PLOT_W;
}
function toSvgY(y: number) {
  return PAD.top + PLOT_H / 2 - (y / Y_RANGE) * (PLOT_H / 2);
}

function polyline(pts: { x?: number; t?: number; y: number }[]): string {
  return pts
    .map((p) => `${toSvgX("t" in p ? (p.t as number) : (p.x as number))},${toSvgY(p.y)}`)
    .join(" ");
}

const GT_CURVE = buildGTCurve();
const GT_PATH = "M " + GT_CURVE.map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(" L ");

// ---- rate configs ----
const DOWNSAMPLE_RATES = [
  { label: "20 Hz", value: 20 },
  { label: "10 Hz", value: 10 },
  { label: "5 Hz", value: 5 },
  { label: "3 Hz", value: 3 },
];

const UPSAMPLE_RATES = [
  { label: "10 → 20 Hz", source: 10, target: 20 },
  { label: "5 → 20 Hz", source: 5, target: 20 },
  { label: "3 → 20 Hz", source: 3, target: 20 },
  { label: "2 → 20 Hz", source: 2, target: 20 },
];

// ---- plot component ----
interface PlotProps {
  title: string;
  subtitle: string;
  accent: string; // tailwind text color class
  accentHex: string;
  warnText?: string;
  children: React.ReactNode;
}

function Plot({ title, subtitle, accent, accentHex, warnText, children }: PlotProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${accent}`}>{title}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        {warnText && (
          <span className="text-[10px] font-semibold text-amber-700 border border-amber-300 bg-amber-50 rounded px-1.5 py-0.5 shrink-0">
            {warnText}
          </span>
        )}
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: "block" }}>
          {/* zero line */}
          <line
            x1={PAD.left} y1={toSvgY(0)}
            x2={W - PAD.right} y2={toSvgY(0)}
            stroke="#cbd5e1" strokeWidth="1"
          />
          {/* ground truth */}
          <path d={GT_PATH} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
          {children}
        </svg>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" /></svg>
          true signal
        </span>
        <span className="flex items-center gap-1">
          <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke={accentHex} strokeWidth="2" /></svg>
          reconstructed
        </span>
      </div>
    </div>
  );
}

export default function SamplingExplorer() {
  const [dsIdx, setDsIdx] = useState(1);
  const [usIdx, setUsIdx] = useState(0);

  const dsRate = DOWNSAMPLE_RATES[dsIdx].value;
  const usConfig = UPSAMPLE_RATES[usIdx];

  const dsSamples = useMemo(() => buildSamples(dsRate), [dsRate]);
  const usSamples = useMemo(() => buildSamples(usConfig.source), [usConfig.source]);
  const usUpsampled = useMemo(
    () => upsample(usSamples, usConfig.target),
    [usSamples, usConfig.target]
  );

  const dsPath =
    "M " + dsSamples.map((p) => `${toSvgX(p.t)},${toSvgY(p.y)}`).join(" L ");
  const usPath =
    "M " + usUpsampled.map((p) => `${toSvgX(p.t)},${toSvgY(p.y)}`).join(" L ");

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Downsampling vs. Upsampling
        </span>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <p className="text-sm text-slate-600 leading-relaxed">
          Both plots show the same ground-truth signal (dashed). Downsampling only <em>removes</em>{" "}
          real measurements. Upsampling <em>invents</em> values that were never recorded — and the
          method used encodes assumptions that may not be true.
        </p>

        {/* ---- Downsampling panel ---- */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 shrink-0">Sample rate:</span>
            {DOWNSAMPLE_RATES.map((r, i) => (
              <button
                key={r.value}
                onClick={() => setDsIdx(i)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-colors cursor-pointer
                  ${dsIdx === i
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Plot
            title="Downsampling"
            subtitle={`100 Hz signal → ${dsRate} Hz (every ${Math.round(100 / dsRate)}th sample kept)`}
            accent="text-emerald-600"
            accentHex="#059669"
          >
            {/* sample dots */}
            {dsSamples.map((p, i) => (
              <circle
                key={i}
                cx={toSvgX(p.t)}
                cy={toSvgY(p.y)}
                r="2.5"
                fill="#059669"
                opacity="0.8"
              />
            ))}
            {/* reconstructed line */}
            <path d={dsPath} fill="none" stroke="#059669" strokeWidth="1.5" opacity="0.7" />
          </Plot>
          <p className="text-xs text-slate-500">
            Lower rates lose high-frequency detail but introduce{" "}
            <strong className="text-slate-600">no new information</strong>. Every dot is a real measurement.
          </p>
        </div>

        <div className="border-t border-slate-100" />

        {/* ---- Upsampling panel ---- */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 shrink-0">Upsample config:</span>
            {UPSAMPLE_RATES.map((r, i) => (
              <button
                key={i}
                onClick={() => setUsIdx(i)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-colors cursor-pointer
                  ${usIdx === i
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Plot
            title="Upsampling (linear interpolation)"
            subtitle={`${usConfig.source} Hz → ${usConfig.target} Hz — fabricated points shown in orange`}
            accent="text-amber-600"
            accentHex="#f97316"
            warnText="fabricates data"
          >
            {/* reconstructed upsampled line */}
            <path d={usPath} fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.85" />
            {/* original sample dots (real) */}
            {usSamples.map((p, i) => (
              <circle
                key={i}
                cx={toSvgX(p.t)}
                cy={toSvgY(p.y)}
                r="3"
                fill="#f97316"
                opacity="1"
              />
            ))}
            {/* fabricated interpolated dots */}
            {usUpsampled
              .filter((p) => !usSamples.some((s) => Math.abs(s.t - p.t) < 1e-9))
              .map((p, i) => (
                <circle
                  key={i}
                  cx={toSvgX(p.t)}
                  cy={toSvgY(p.y)}
                  r="1.8"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}
          </Plot>
          <p className="text-xs text-slate-500">
            The reconstructed curve (orange) diverges from the true signal (dashed) because linear
            interpolation assumes values change <strong className="text-slate-600">linearly</strong>{" "}
            between measurements — an assumption the real world rarely satisfies.
          </p>
        </div>
      </div>
    </div>
  );
}
