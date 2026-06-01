"use client";

import { useState, useRef } from "react";

const TICKS = [-3, -2, -1, 0, 1, 2, 3]; // in σ units
const DRAG_MIN = -3;
const DRAG_MAX = 3;

const PAD_X = 40; // px on each side
const TRACK_H = 48; // px, vertical center of the track within the SVG
const SVG_W = 480;
const SVG_H = 96;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function zToPx(z: number, width: number) {
  const trackW = width - PAD_X * 2;
  return PAD_X + ((z - DRAG_MIN) / (DRAG_MAX - DRAG_MIN)) * trackW;
}

function pxToZ(px: number, width: number) {
  const trackW = width - PAD_X * 2;
  return clamp(((px - PAD_X) / trackW) * (DRAG_MAX - DRAG_MIN) + DRAG_MIN, DRAG_MIN, DRAG_MAX);
}

export default function ZScoreExplorer() {
  const [z, setZ] = useState(1.3);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const calcZ = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const px = clientX - rect.left;
    const scaleX = SVG_W / rect.width;
    return pxToZ(px * scaleX, SVG_W);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    const v = calcZ(e.clientX);
    if (v !== null) setZ(v);
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const v = calcZ(e.clientX);
    if (v !== null) setZ(v);
  };

  const onMouseUp = () => { dragging.current = false; };

  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    const v = calcZ(e.touches[0].clientX);
    if (v !== null) setZ(v);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const v = calcZ(e.touches[0].clientX);
    if (v !== null) setZ(v);
    e.preventDefault();
  };

  const onTouchEnd = () => { dragging.current = false; };

  const cx = zToPx(z, SVG_W);
  const muX = zToPx(0, SVG_W);
  const zRounded = Math.round(z * 10) / 10;
  const isNeg = z < -0.05;
  const isZero = Math.abs(z) < 0.05;
  const dotColor = isZero ? "#94a3b8" : isNeg ? "#f59e0b" : "#6366f1";

  // How many whole SD steps to highlight
  const steps = Math.abs(zRounded);
  const stepCount = Math.floor(Math.abs(z));

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm select-none">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Z-Score Explorer
        </span>
      </div>

      {/* Z readout */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 mb-0.5">z-score</div>
          <div className={`text-4xl font-bold font-mono tabular-nums ${isZero ? "text-slate-400" : isNeg ? "text-amber-500" : "text-indigo-500"}`}>
            {isZero ? "0" : (z > 0 ? "+" : "")}{z.toFixed(2)}
          </div>
        </div>
        <div className="text-right max-w-[200px]">
          <div className="text-sm text-slate-600 leading-snug">
            {isZero
              ? "Exactly at the mean."
              : <>
                  <span className={`font-semibold ${isNeg ? "text-amber-600" : "text-indigo-600"}`}>
                    {steps.toFixed(1)} standard deviation{steps !== 1 ? "s" : ""}
                  </span>{" "}
                  {isNeg ? "below" : "above"} the mean.
                </>
            }
          </div>
        </div>
      </div>

      {/* Number line */}
      <div className="px-5 pb-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: "100%", height: SVG_H, cursor: "ew-resize", touchAction: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Shaded region from μ to x */}
          {!isZero && (
            <rect
              x={Math.min(muX, cx)}
              y={TRACK_H - 6}
              width={Math.abs(cx - muX)}
              height={12}
              fill={dotColor}
              fillOpacity={0.18}
              rx={2}
            />
          )}

          {/* Track */}
          <line x1={PAD_X} y1={TRACK_H} x2={SVG_W - PAD_X} y2={TRACK_H} stroke="#e2e8f0" strokeWidth="2" />

          {/* SD step segments — highlight each whole step */}
          {!isZero && Array.from({ length: stepCount }, (_, i) => {
            const fromZ = isNeg ? -i - 1 : i;
            const toZ = isNeg ? -i : i + 1;
            return (
              <line
                key={i}
                x1={zToPx(fromZ, SVG_W)}
                y1={TRACK_H}
                x2={zToPx(toZ, SVG_W)}
                y2={TRACK_H}
                stroke={dotColor}
                strokeWidth="3"
                strokeOpacity={0.5}
              />
            );
          })}

          {/* Tick marks */}
          {TICKS.map((s) => {
            const px = zToPx(s, SVG_W);
            const isMu = s === 0;
            return (
              <g key={s}>
                <line x1={px} y1={TRACK_H - 8} x2={px} y2={TRACK_H + 8} stroke={isMu ? "#94a3b8" : "#cbd5e1"} strokeWidth={isMu ? 2 : 1} />
                <text x={px} y={TRACK_H + 22} textAnchor="middle" fontSize="11" fill={isMu ? "#64748b" : "#94a3b8"} fontWeight={isMu ? "700" : "400"}>
                  {isMu ? "μ" : `${s > 0 ? "+" : ""}${s}σ`}
                </text>
              </g>
            );
          })}

          {/* Draggable dot */}
          <circle cx={cx} cy={TRACK_H} r={10} fill={dotColor} style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.2))" }} />
          <text x={cx} y={TRACK_H - 16} textAnchor="middle" fontSize="10" fill={dotColor} fontWeight="700">x</text>
        </svg>
        <p className="text-[10px] text-slate-400 text-center -mt-1">Drag x along the number line</p>
      </div>

      {/* Step counter */}
      {!isZero && stepCount > 0 && (
        <div className="px-5 pb-4">
          <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Whole steps:</span>
            {Array.from({ length: stepCount }, (_, i) => (
              <span
                key={i}
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isNeg ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}
              >
                {isNeg ? "−" : "+"}1σ
              </span>
            ))}
            {Math.abs(z) % 1 > 0.05 && (
              <span className="text-xs text-slate-400">
                + {((Math.abs(z) % 1)).toFixed(2)} of a step
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
