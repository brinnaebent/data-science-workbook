"use client";

import { useState, useMemo } from "react";

// ── signal config ──────────────────────────────────────────────────────────────

interface Component {
  id: string;
  label: string;
  freq: number;   // Hz
  amp: number;
  color: string;
  colorHex: string;
}

const COMPONENTS: Component[] = [
  { id: "a", label: "1 Hz",  freq: 1,   amp: 0.7,  color: "text-sky-400",    colorHex: "#38bdf8" },
  { id: "b", label: "3 Hz",  freq: 3,   amp: 0.45, color: "text-violet-400", colorHex: "#a78bfa" },
  { id: "c", label: "7 Hz",  freq: 7,   amp: 0.28, color: "text-rose-400",   colorHex: "#fb7185" },
  { id: "d", label: "12 Hz", freq: 12,  amp: 0.18, color: "text-amber-400",  colorHex: "#fbbf24" },
];

const DURATION = 2;      // seconds shown
const FS = 400;          // render resolution
const N_TOTAL = FS * DURATION;

function buildTimeSeries(active: Set<string>): number[] {
  return Array.from({ length: N_TOTAL }, (_, i) => {
    const t = (i / N_TOTAL) * DURATION;
    return COMPONENTS.reduce(
      (sum, c) => sum + (active.has(c.id) ? c.amp * Math.sin(2 * Math.PI * c.freq * t) : 0),
      0
    );
  });
}

function buildSingleSeries(comp: Component): number[] {
  return Array.from({ length: N_TOTAL }, (_, i) => {
    const t = (i / N_TOTAL) * DURATION;
    return comp.amp * Math.sin(2 * Math.PI * comp.freq * t);
  });
}

// ── SVG layout ─────────────────────────────────────────────────────────────────

const W = 480;
const H = 120;
const PAD = { top: 12, bottom: 14, left: 10, right: 10 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;
const Y_MAX = 1.05;

function tx(i: number) {
  return PAD.left + (i / (N_TOTAL - 1)) * PW;
}
function ty(v: number) {
  return PAD.top + PH / 2 - (v / Y_MAX) * (PH / 2);
}

function toPath(ys: number[]): string {
  return (
    "M " +
    ys
      .map((y, i) => `${tx(i).toFixed(1)},${ty(y).toFixed(1)}`)
      .join(" L ")
  );
}

// ── frequency domain bar chart ─────────────────────────────────────────────────

const FW = 480;
const FH = 100;
const FPAD = { top: 10, bottom: 20, left: 10, right: 10 };
const FPW = FW - FPAD.left - FPAD.right;
const FPH = FH - FPAD.top - FPAD.bottom;

// place bars evenly spaced across the width
const SLOT_W = FPW / COMPONENTS.length;

// ── component ──────────────────────────────────────────────────────────────────

export default function FrequencyDomainExplorer() {
  const [active, setActive] = useState<Set<string>>(new Set(COMPONENTS.map((c) => c.id)));
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function toggle(id: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const compositePath = useMemo(() => toPath(buildTimeSeries(active)), [active]);

  const individualPaths = useMemo(
    () =>
      Object.fromEntries(
        COMPONENTS.map((c) => [c.id, toPath(buildSingleSeries(c))])
      ),
    []
  );

  const maxAmp = Math.max(...COMPONENTS.map((c) => c.amp));

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
      {/* header */}
      <div className="px-5 py-3 border-b border-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Time Domain vs. Frequency Domain
        </span>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <p className="text-sm text-slate-400 leading-relaxed">
          The same signal, two ways of looking at it. Toggle frequency components on and off to see
          how they combine in the time domain — and how the frequency domain strips that complexity
          back to a clean list of <em>what frequencies are present and how strong they are</em>.
        </p>

        {/* ── frequency component toggles ── */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Signal components — click to toggle
          </p>
          <div className="flex flex-wrap gap-2">
            {COMPONENTS.map((c) => {
              const on = active.has(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition-all cursor-pointer
                    ${on
                      ? "bg-slate-800 border-slate-600 text-slate-200"
                      : "bg-slate-900 border-slate-700 text-slate-600 line-through"
                    }`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ background: on ? c.colorHex : "#475569" }}
                  />
                  {c.label}
                  <span className="text-[10px] text-slate-500 no-underline">
                    {(c.amp * 100).toFixed(0)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── time domain ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Time Domain
            </p>
            <p className="text-[11px] text-slate-500">amplitude over time</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950 overflow-hidden">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: "block" }}>
              {/* zero line */}
              <line
                x1={PAD.left} y1={ty(0)}
                x2={W - PAD.right} y2={ty(0)}
                stroke="#1e293b" strokeWidth="1"
              />
              {/* time axis ticks */}
              {[0, 0.5, 1, 1.5, 2].map((t) => {
                const xi = Math.round((t / DURATION) * (N_TOTAL - 1));
                return (
                  <text
                    key={t}
                    x={tx(xi)}
                    y={H - 2}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#475569"
                  >
                    {t}s
                  </text>
                );
              })}

              {/* individual components (faint, only hovered) */}
              {COMPONENTS.map((c) =>
                active.has(c.id) && hoveredId === c.id ? (
                  <path
                    key={c.id}
                    d={individualPaths[c.id]}
                    fill="none"
                    stroke={c.colorHex}
                    strokeWidth="1"
                    opacity="0.45"
                    strokeDasharray="3 2"
                  />
                ) : null
              )}

              {/* composite */}
              <path d={compositePath} fill="none" stroke="#34d399" strokeWidth="2" />
            </svg>
          </div>
          <p className="text-[11px] text-slate-500">
            The <span className="text-emerald-400 font-semibold">green composite</span> is what you
            would actually record with a sensor — all frequencies mixed together, inseparable by eye.
            Hover a toggle to see that component as a faint dashed line.
          </p>
        </div>

        {/* ── frequency domain ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">
              Frequency Domain
            </p>
            <p className="text-[11px] text-slate-500">amplitude at each frequency</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950 overflow-hidden">
            <svg viewBox={`0 0 ${FW} ${FH}`} className="w-full" style={{ display: "block" }}>
              {/* baseline */}
              <line
                x1={FPAD.left} y1={FPAD.top + FPH}
                x2={FW - FPAD.right} y2={FPAD.top + FPH}
                stroke="#1e293b" strokeWidth="1"
              />

              {COMPONENTS.map((c, i) => {
                const on = active.has(c.id);
                const slotCenter = FPAD.left + (i + 0.5) * SLOT_W;
                const barW = Math.min(SLOT_W * 0.45, 28);
                const barH = on ? (c.amp / maxAmp) * FPH : 0;
                const barX = slotCenter - barW / 2;
                const barY = FPAD.top + FPH - barH;
                const isHov = hoveredId === c.id;

                return (
                  <g key={c.id}>
                    {/* bar */}
                    <rect
                      x={barX}
                      y={barY}
                      width={barW}
                      height={barH}
                      rx="2"
                      fill={on ? c.colorHex : "#1e293b"}
                      opacity={on ? (isHov ? 1 : 0.75) : 0.3}
                      style={{ transition: "height 0.25s ease, y 0.25s ease, opacity 0.15s" }}
                    />
                    {/* amplitude label inside bar (only when tall enough) */}
                    {on && barH > 16 && (
                      <text
                        x={slotCenter}
                        y={barY + 11}
                        textAnchor="middle"
                        fontSize="8"
                        fill={c.colorHex}
                        opacity="0.85"
                      >
                        {(c.amp * 100).toFixed(0)}%
                      </text>
                    )}
                    {/* freq label below baseline */}
                    <text
                      x={slotCenter}
                      y={FH - 3}
                      textAnchor="middle"
                      fontSize="9"
                      fill={on ? "#94a3b8" : "#334155"}
                    >
                      {c.freq} Hz
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-[11px] text-slate-500">
            The frequency domain reveals exactly which frequencies are present and at what strength —
            something impossible to read from the time-domain waveform. This is what a{" "}
            <strong className="text-slate-400">Fourier transform</strong> gives you: a decomposition
            of any signal into its constituent frequencies.
          </p>
        </div>

        {/* ── key insight callout ── */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 px-4 py-3 flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Why this matters for sensor data
          </p>
          <ul className="text-xs text-slate-400 leading-relaxed space-y-1 list-none">
            <li>
              <span className="text-slate-300 font-semibold">Time domain</span> — tells you{" "}
              <em>when</em> something happened: a spike, a trend, a burst of activity.
            </li>
            <li>
              <span className="text-slate-300 font-semibold">Frequency domain</span> — tells you{" "}
              <em>what rhythms</em> drive the signal: breathing rate, vibration modes, electrical noise at 50/60 Hz.
            </li>
            <li>
              <span className="text-slate-300 font-semibold">Feature engineering</span> often requires both:
              time-domain statistics (mean, variance, peaks) for event detection; frequency-domain
              features (spectral power bands) for rhythm-based classification.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
