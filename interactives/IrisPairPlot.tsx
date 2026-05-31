"use client";

import { useState } from "react";

// Iris dataset — 150 samples × 4 features + species
// setosa: 0, versicolor: 1, virginica: 2
const RAW: [number, number, number, number, number][] = [
  [5.1,3.5,1.4,0.2,0],[4.9,3.0,1.4,0.2,0],[4.7,3.2,1.3,0.2,0],[4.6,3.1,1.5,0.2,0],
  [5.0,3.6,1.4,0.2,0],[5.4,3.9,1.7,0.4,0],[4.6,3.4,1.4,0.3,0],[5.0,3.4,1.5,0.2,0],
  [4.4,2.9,1.4,0.2,0],[4.9,3.1,1.5,0.1,0],[5.4,3.7,1.5,0.2,0],[4.8,3.4,1.6,0.2,0],
  [4.8,3.0,1.4,0.1,0],[4.3,3.0,1.1,0.1,0],[5.8,4.0,1.2,0.2,0],[5.7,4.4,1.5,0.4,0],
  [5.4,3.9,1.3,0.4,0],[5.1,3.5,1.4,0.3,0],[5.7,3.8,1.7,0.3,0],[5.1,3.8,1.5,0.3,0],
  [5.4,3.4,1.7,0.2,0],[5.1,3.7,1.5,0.4,0],[4.6,3.6,1.0,0.2,0],[5.1,3.3,1.7,0.5,0],
  [4.8,3.4,1.9,0.2,0],[5.0,3.0,1.6,0.2,0],[5.0,3.4,1.6,0.4,0],[5.2,3.5,1.5,0.2,0],
  [5.2,3.4,1.4,0.2,0],[4.7,3.2,1.6,0.2,0],[4.8,3.1,1.6,0.2,0],[5.4,3.4,1.5,0.4,0],
  [5.2,4.1,1.5,0.1,0],[5.5,4.2,1.4,0.2,0],[4.9,3.1,1.5,0.2,0],[5.0,3.2,1.2,0.2,0],
  [5.5,3.5,1.3,0.2,0],[4.9,3.6,1.4,0.1,0],[4.4,3.0,1.3,0.2,0],[5.1,3.4,1.5,0.2,0],
  [5.0,3.5,1.3,0.3,0],[4.5,2.3,1.3,0.3,0],[4.4,3.2,1.3,0.2,0],[5.0,3.5,1.6,0.6,0],
  [5.1,3.8,1.9,0.4,0],[4.8,3.0,1.4,0.3,0],[5.1,3.8,1.6,0.2,0],[4.6,3.2,1.4,0.2,0],
  [5.3,3.7,1.5,0.2,0],[5.0,3.3,1.4,0.2,0],
  [7.0,3.2,4.7,1.4,1],[6.4,3.2,4.5,1.5,1],[6.9,3.1,4.9,1.5,1],[5.5,2.3,4.0,1.3,1],
  [6.5,2.8,4.6,1.5,1],[5.7,2.8,4.5,1.3,1],[6.3,3.3,4.7,1.6,1],[4.9,2.4,3.3,1.0,1],
  [6.6,2.9,4.6,1.3,1],[5.2,2.7,3.9,1.4,1],[5.0,2.0,3.5,1.0,1],[5.9,3.0,4.2,1.5,1],
  [6.0,2.2,4.0,1.0,1],[6.1,2.9,4.7,1.4,1],[5.6,2.9,3.6,1.3,1],[6.7,3.1,4.4,1.4,1],
  [5.6,3.0,4.5,1.5,1],[5.8,2.7,4.1,1.0,1],[6.2,2.2,4.5,1.5,1],[5.6,2.5,3.9,1.1,1],
  [5.9,3.2,4.8,1.8,1],[6.1,2.8,4.0,1.3,1],[6.3,2.5,4.9,1.5,1],[6.1,2.8,4.7,1.2,1],
  [6.4,2.9,4.3,1.3,1],[6.6,3.0,4.4,1.4,1],[6.8,2.8,4.8,1.4,1],[6.7,3.0,5.0,1.7,1],
  [6.0,2.9,4.5,1.5,1],[5.7,2.6,3.5,1.0,1],[5.5,2.4,3.8,1.1,1],[5.5,2.4,3.7,1.0,1],
  [5.8,2.7,3.9,1.2,1],[6.0,2.7,5.1,1.6,1],[5.4,3.0,4.5,1.5,1],[6.0,3.4,4.5,1.6,1],
  [6.7,3.1,4.7,1.5,1],[6.3,2.3,4.4,1.3,1],[5.6,3.0,4.1,1.3,1],[5.5,2.5,4.0,1.3,1],
  [5.5,2.6,4.4,1.2,1],[6.1,3.0,4.6,1.4,1],[5.8,2.6,4.0,1.2,1],[5.0,2.3,3.3,1.0,1],
  [5.6,2.7,4.2,1.3,1],[5.7,3.0,4.2,1.2,1],[5.7,2.9,4.2,1.3,1],[6.2,2.9,4.3,1.3,1],
  [5.1,2.5,3.0,1.1,1],[5.7,2.8,4.1,1.3,1],
  [6.3,3.3,6.0,2.5,2],[5.8,2.7,5.1,1.9,2],[7.1,3.0,5.9,2.1,2],[6.3,2.9,5.6,1.8,2],
  [6.5,3.0,5.8,2.2,2],[7.6,3.0,6.6,2.1,2],[4.9,2.5,4.5,1.7,2],[7.3,2.9,6.3,1.8,2],
  [6.7,2.5,5.8,1.8,2],[7.2,3.6,6.1,2.5,2],[6.5,3.2,5.1,2.0,2],[6.4,2.7,5.3,1.9,2],
  [6.8,3.0,5.5,2.1,2],[5.7,2.5,5.0,2.0,2],[5.8,2.8,5.1,2.4,2],[6.4,3.2,5.3,2.3,2],
  [6.5,3.0,5.5,1.8,2],[7.7,3.8,6.7,2.2,2],[7.7,2.6,6.9,2.3,2],[6.0,2.2,5.0,1.5,2],
  [6.9,3.2,5.7,2.3,2],[5.6,2.8,4.9,2.0,2],[7.7,2.8,6.7,2.0,2],[6.3,2.7,4.9,1.8,2],
  [6.7,3.3,5.7,2.1,2],[7.2,3.2,6.0,1.8,2],[6.2,2.8,4.8,1.8,2],[6.1,3.0,4.9,1.8,2],
  [6.4,2.8,5.6,2.1,2],[7.2,3.0,5.8,1.6,2],[7.4,2.8,6.1,1.9,2],[7.9,3.8,6.4,2.0,2],
  [6.4,2.8,5.6,2.2,2],[6.3,2.8,5.1,1.5,2],[6.1,2.6,5.6,1.4,2],[7.7,3.0,6.1,2.3,2],
  [6.3,3.4,5.6,2.4,2],[6.4,3.1,5.5,1.8,2],[6.0,3.0,4.8,1.8,2],[6.9,3.1,5.4,2.1,2],
  [6.7,3.1,5.6,2.4,2],[6.9,3.1,5.1,2.3,2],[5.8,2.7,5.1,1.9,2],[6.8,3.2,5.9,2.3,2],
  [6.7,3.3,5.7,2.5,2],[6.7,3.0,5.2,2.3,2],[6.3,2.5,5.0,1.9,2],[6.5,3.0,5.2,2.0,2],
  [6.2,3.4,5.4,2.3,2],[5.9,3.0,5.1,1.8,2],
];

const FEATURES = ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"];
const FEATURE_SHORT = ["SL", "SW", "PL", "PW"];
const UNITS = ["cm", "cm", "cm", "cm"];

const SPECIES = ["Setosa", "Versicolor", "Virginica"];
const SPECIES_COLOR = [
  { fill: "#6366f1", stroke: "#4338ca", light: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { fill: "#10b981", stroke: "#047857", light: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { fill: "#f59e0b", stroke: "#b45309", light: "bg-amber-100 text-amber-700 border-amber-200" },
];

type Point = { sl: number; sw: number; pl: number; pw: number; species: number };

const DATA: Point[] = RAW.map(([sl, sw, pl, pw, species]) => ({ sl, sw, pl, pw, species }));

const KEYS: (keyof Point)[] = ["sl", "sw", "pl", "pw"];

function minMax(vals: number[]): [number, number] {
  return [Math.min(...vals), Math.max(...vals)];
}

function scale(v: number, min: number, max: number, lo: number, hi: number) {
  return lo + ((v - min) / (max - min)) * (hi - lo);
}

const CELL = 130;
const PAD = 18;
const DOT = 3.5;

function ScatterCell({ xi, yi, hovered, highlight, onHover }: {
  xi: number; yi: number;
  hovered: number | null;
  highlight: number | null;
  onHover: (idx: number | null) => void;
}) {
  const xKey = KEYS[xi];
  const yKey = KEYS[yi];
  const xVals = DATA.map((d) => d[xKey] as number);
  const yVals = DATA.map((d) => d[yKey] as number);
  const [xMin, xMax] = minMax(xVals);
  const [yMin, yMax] = minMax(yVals);

  const plotW = CELL - PAD * 2;
  const plotH = CELL - PAD * 2;

  return (
    <svg width={CELL} height={CELL} className="block">
      {/* axis ticks */}
      <line x1={PAD} y1={CELL - PAD} x2={CELL - PAD} y2={CELL - PAD} stroke="#e2e8f0" strokeWidth={1} />
      <line x1={PAD} y1={PAD} x2={PAD} y2={CELL - PAD} stroke="#e2e8f0" strokeWidth={1} />
      {DATA.map((d, i) => {
        const cx = PAD + scale(d[xKey] as number, xMin, xMax, 0, plotW);
        const cy = CELL - PAD - scale(d[yKey] as number, yMin, yMax, 0, plotH);
        const col = SPECIES_COLOR[d.species];
        const isHovered = hovered === i;
        const filteredOut = highlight !== null && d.species !== highlight;
        return (
          <circle
            key={i}
            cx={cx} cy={cy}
            r={isHovered ? DOT + 2 : DOT}
            fill={col.fill}
            stroke={isHovered ? col.stroke : "white"}
            strokeWidth={isHovered ? 1.5 : 0.8}
            opacity={filteredOut ? 0.08 : hovered !== null && !isHovered ? 0.25 : 0.82}
            style={{ cursor: filteredOut ? "default" : "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={() => !filteredOut && onHover(i)}
            onMouseLeave={() => onHover(null)}
          />
        );
      })}
    </svg>
  );
}

function HistCell({ fi, highlight }: { fi: number; highlight: number | null }) {
  const key = KEYS[fi];
  const vals = DATA.map((d) => d[key] as number);
  const [vMin, vMax] = minMax(vals);
  const bins = 10;
  const binW = (vMax - vMin) / bins;

  // per-species histogram
  const counts = SPECIES.map((_, si) => {
    const arr = new Array(bins).fill(0);
    DATA.filter((d) => d.species === si).forEach((d) => {
      const b = Math.min(Math.floor(((d[key] as number) - vMin) / binW), bins - 1);
      arr[b]++;
    });
    return arr;
  });

  const maxCount = Math.max(...counts.flatMap((c) => c));
  const plotW = CELL - PAD * 2;
  const plotH = CELL - PAD * 2;
  const bw = plotW / bins;

  return (
    <svg width={CELL} height={CELL} className="block">
      <line x1={PAD} y1={CELL - PAD} x2={CELL - PAD} y2={CELL - PAD} stroke="#e2e8f0" strokeWidth={1} />
      {counts.map((arr, si) =>
        arr.map((count, bi) => {
          if (count === 0) return null;
          const h = scale(count, 0, maxCount, 0, plotH * 0.85);
          const x = PAD + bi * bw;
          const y = CELL - PAD - h;
          return (
            <rect
              key={`${si}-${bi}`}
              x={x + 1} y={y} width={bw - 2} height={h}
              fill={SPECIES_COLOR[si].fill}
              opacity={highlight !== null && si !== highlight ? 0.08 : 0.65}
            />
          );
        })
      )}
      {/* feature label */}
      <text x={CELL / 2} y={CELL - 4} textAnchor="middle" fontSize={9} fill="#94a3b8">
        {FEATURE_SHORT[fi]}
      </text>
    </svg>
  );
}

export default function IrisPairPlot() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<number | null>(null);

  const activeHover = hovered;
  const hoveredPoint = activeHover !== null ? DATA[activeHover] : null;

  function handleHover(idx: number | null) {
    setHovered(idx);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Iris Dataset — Pair Plot
        </span>
        <span className="text-xs text-slate-400">150 samples · 3 species · 4 features</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Species filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1">Filter:</span>
          {SPECIES.map((name, si) => (
            <button
              key={si}
              onClick={() => setHighlight(highlight === si ? null : si)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                highlight === null || highlight === si
                  ? SPECIES_COLOR[si].light
                  : "bg-slate-50 text-slate-400 border-slate-200"
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: SPECIES_COLOR[si].fill }}
              />
              {name}
            </button>
          ))}
          {highlight !== null && (
            <button
              onClick={() => { setHighlight(null); setHovered(null); }}
              className="text-xs text-slate-400 hover:text-slate-600 ml-1 underline"
            >
              clear
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div style={{ display: "grid", gridTemplateColumns: `28px repeat(4, ${CELL}px)`, gridTemplateRows: `repeat(4, ${CELL}px) 28px` }}>
            {/* column headers (bottom row) */}
            {FEATURES.map((f, fi) => (
              <div
                key={`col-${fi}`}
                style={{ gridColumn: fi + 2, gridRow: 5 }}
                className="flex items-center justify-center"
              >
                <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">{FEATURE_SHORT[fi]}</span>
              </div>
            ))}

            {/* row headers (left column) */}
            {FEATURES.map((f, fi) => (
              <div
                key={`row-${fi}`}
                style={{ gridColumn: 1, gridRow: fi + 1 }}
                className="flex items-center justify-center"
              >
                <span
                  className="text-[10px] text-slate-400 font-medium"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {FEATURE_SHORT[fi]}
                </span>
              </div>
            ))}

            {/* cells */}
            {FEATURES.map((_, yi) =>
              FEATURES.map((_, xi) => (
                <div
                  key={`${xi}-${yi}`}
                  style={{ gridColumn: xi + 2, gridRow: yi + 1 }}
                  className={`border border-slate-100 ${xi === yi ? "bg-slate-50" : "bg-white"}`}
                >
                  {xi === yi ? (
                    <HistCell fi={xi} highlight={highlight} />
                  ) : (
                    <ScatterCell
                      xi={xi} yi={yi}
                      hovered={hovered}
                      highlight={highlight}
                      onHover={handleHover}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Axis legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {FEATURES.map((f, fi) => (
            <span key={fi}>
              <span className="font-semibold text-slate-600">{FEATURE_SHORT[fi]}</span> = {f} ({UNITS[fi]})
            </span>
          ))}
        </div>

        {/* Hover tooltip */}
        <div className="min-h-[48px]">
          {hoveredPoint ? (
            <div className={`rounded-lg border px-4 py-2.5 text-xs flex flex-wrap items-center gap-x-4 gap-y-1 ${SPECIES_COLOR[hoveredPoint.species].light}`}>
              <span className="font-semibold">{SPECIES[hoveredPoint.species]}</span>
              {FEATURES.map((f, fi) => (
                <span key={fi} className="font-mono">
                  {FEATURE_SHORT[fi]}: {(hoveredPoint[KEYS[fi]] as number).toFixed(1)}
                </span>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-400 italic">
              Hover a dot to see measurements — diagonal shows per-species histograms
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-5 text-xs text-slate-500">
        {SPECIES.map((name, si) => (
          <span key={si} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: SPECIES_COLOR[si].fill }} />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
