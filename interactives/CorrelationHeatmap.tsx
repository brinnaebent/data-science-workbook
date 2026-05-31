"use client";

import React, { useState } from "react";

type Dataset = {
  name: string;
  description: string;
  variables: string[];
  matrix: number[][];
};

const DATASETS: Dataset[] = [
  {
    name: "Housing",
    description: "Boston-area housing: price, size, and neighborhood features",
    variables: ["Price", "Sq Ft", "Rooms", "Age", "Crime Rate", "Distance"],
    matrix: [
      [ 1.00,  0.88,  0.71, -0.38, -0.61, -0.47],
      [ 0.88,  1.00,  0.91, -0.29, -0.52, -0.35],
      [ 0.71,  0.91,  1.00, -0.11, -0.44, -0.21],
      [-0.38, -0.29, -0.11,  1.00,  0.29,  0.14],
      [-0.61, -0.52, -0.44,  0.29,  1.00,  0.62],
      [-0.47, -0.35, -0.21,  0.14,  0.62,  1.00],
    ],
  },
  {
    name: "Health",
    description: "Patient biometrics: weight, blood pressure, and lab values",
    variables: ["Weight", "BMI", "Systolic", "Diastolic", "Glucose", "Age"],
    matrix: [
      [ 1.00,  0.95,  0.48,  0.43,  0.31,  0.12],
      [ 0.95,  1.00,  0.51,  0.45,  0.34,  0.09],
      [ 0.48,  0.51,  1.00,  0.79,  0.38,  0.57],
      [ 0.43,  0.45,  0.79,  1.00,  0.29,  0.44],
      [ 0.31,  0.34,  0.38,  0.29,  1.00,  0.26],
      [ 0.12,  0.09,  0.57,  0.44,  0.26,  1.00],
    ],
  },
  {
    name: "Academic",
    description: "Student performance: study habits, scores, and outcomes",
    variables: ["GPA", "Study Hrs", "Attendance", "Prev Score", "Sleep", "Stress"],
    matrix: [
      [ 1.00,  0.74,  0.68,  0.82, -0.19, -0.53],
      [ 0.74,  1.00,  0.55,  0.61, -0.07, -0.41],
      [ 0.68,  0.55,  1.00,  0.57, -0.12, -0.38],
      [ 0.82,  0.61,  0.57,  1.00, -0.15, -0.47],
      [-0.19, -0.07, -0.12, -0.15,  1.00, -0.33],
      [-0.53, -0.41, -0.38, -0.47, -0.33,  1.00],
    ],
  },
];

function corrToColor(r: number): string {
  if (r >= 0) {
    const t = r;
    const R = Math.round(238 + (79 - 238) * t);
    const G = Math.round(242 + (70 - 242) * t);
    const B = Math.round(255 + (229 - 255) * t);
    return `rgb(${R},${G},${B})`;
  } else {
    const t = -r;
    const R = Math.round(238 + (239 - 238) * t);
    const G = Math.round(242 + (68 - 242) * t);
    const B = Math.round(255 + (68 - 255) * t);
    return `rgb(${R},${G},${B})`;
  }
}

function corrToTextColor(r: number): string {
  return Math.abs(r) > 0.55 ? "text-white" : "text-slate-700";
}

function strengthLabel(r: number): string {
  const abs = Math.abs(r);
  if (abs >= 0.9) return "Very strong";
  if (abs >= 0.7) return "Strong";
  if (abs >= 0.5) return "Moderate";
  if (abs >= 0.3) return "Weak";
  return "Negligible";
}

function directionLabel(r: number): string {
  if (r > 0.05) return "positive";
  if (r < -0.05) return "negative";
  return "none";
}

type Cell = { row: number; col: number };

export default function CorrelationHeatmap() {
  const [datasetIdx, setDatasetIdx] = useState(0);
  const [hovered, setHovered] = useState<Cell | null>(null);

  const ds = DATASETS[datasetIdx];
  const n = ds.variables.length;

  const hoveredR = hovered ? ds.matrix[hovered.row][hovered.col] : null;
  const isHoveredDiag = hovered ? hovered.row === hovered.col : false;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Correlation Heatmap
        </span>
        <div className="flex gap-1">
          {DATASETS.map((d, i) => (
            <button
              key={d.name}
              onClick={() => { setDatasetIdx(i); setHovered(null); }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                i === datasetIdx
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs text-slate-500 mb-4">{ds.description}. Hover any cell to inspect the relationship.</p>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div
            className="inline-grid gap-0.5"
            style={{ gridTemplateColumns: `64px repeat(${n}, 1fr)` }}
          >
            {/* Top-left corner */}
            <div />
            {/* Column headers */}
            {ds.variables.map((v) => (
              <div
                key={v}
                className="text-center text-[10px] font-semibold text-slate-500 pb-1 px-1 truncate"
              >
                {v}
              </div>
            ))}

            {/* Rows */}
            {ds.variables.map((rowVar, row) => (
              <React.Fragment key={row}>
                {/* Row label */}
                <div
                  key={`label-${row}`}
                  className="flex items-center justify-end pr-2 text-[10px] font-semibold text-slate-500 truncate"
                >
                  {rowVar}
                </div>
                {/* Cells */}
                {ds.variables.map((_, col) => {
                  const r = ds.matrix[row][col];
                  const isActive = hovered?.row === row && hovered?.col === col;
                  const isDiag = row === col;
                  return (
                    <div
                      key={`${row}-${col}`}
                      onMouseEnter={() => setHovered({ row, col })}
                      onMouseLeave={() => setHovered(null)}
                      className={`relative flex items-center justify-center rounded cursor-default transition-all select-none ${corrToTextColor(r)} ${
                        isActive ? "ring-2 ring-indigo-400 ring-offset-1 z-10" : ""
                      }`}
                      style={{
                        width: 52,
                        height: 44,
                        backgroundColor: corrToColor(r),
                        opacity: isDiag ? 0.85 : 1,
                      }}
                    >
                      <span className="text-xs font-mono font-semibold leading-none">
                        {r.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Hover panel */}
        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 min-h-[56px] flex items-center">
          {hovered && hoveredR !== null ? (
            isHoveredDiag ? (
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{ds.variables[hovered.row]}</span> vs itself — always 1.00 by definition.
              </p>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="font-semibold text-slate-700">{ds.variables[hovered.row]}</span>
                {" and "}
                <span className="font-semibold text-slate-700">{ds.variables[hovered.col]}</span>
                {": r = "}
                <span className="font-mono font-semibold text-slate-800">{hoveredR.toFixed(2)}</span>
                {" — "}
                <span className={hoveredR >= 0 ? "text-indigo-600 font-medium" : "text-rose-500 font-medium"}>
                  {strengthLabel(hoveredR)} {directionLabel(hoveredR)} correlation.
                </span>
                {Math.abs(hoveredR) >= 0.7 && hovered.row !== hovered.col && (
                  <span className="text-amber-600"> High — potential redundancy for modeling.</span>
                )}
              </p>
            )
          ) : (
            <p className="text-xs text-slate-400 italic">Hover a cell to see the relationship details.</p>
          )}
        </div>

        {/* Color scale legend */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-mono">−1</span>
          <div
            className="flex-1 h-2.5 rounded-full"
            style={{
              background: "linear-gradient(to right, rgb(239,68,68), rgb(238,242,255), rgb(79,70,229))",
            }}
          />
          <span className="text-[10px] text-slate-400 font-mono">+1</span>
          <div className="ml-2 flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "rgb(239,68,68)" }} />
              negative
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "rgb(238,242,255)" }} />
              none
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "rgb(79,70,229)" }} />
              positive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
