"use client";

import { useState } from "react";

// Weekly response times (ms) for two support teams
const TEAM_A = [120, 135, 118, 142, 127, 130, 115, 250, 128, 133, 121, 140, 126, 119, 138, 129, 122, 145, 131, 117];
const TEAM_B = [180, 195, 175, 210, 185, 192, 170, 188, 198, 178, 182, 205, 176, 193, 183, 171, 199, 187, 177, 201];

function pct(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function mean(arr: number[]) {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

const SERIES = [
  { key: "A", label: "Team A", data: TEAM_A, fill: "#818cf8", fillLight: "#e0e7ff" },
  { key: "B", label: "Team B", data: TEAM_B, fill: "#fb7185", fillLight: "#ffe4e6" },
] as const;

function BoxPlotView() {
  const [hovered, setHovered] = useState<"A" | "B" | null>(null);

  const stats = SERIES.map(({ key, label, data, fill }) => {
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = pct(data, 25);
    const q2 = pct(data, 50);
    const q3 = pct(data, 75);
    const iqr = q3 - q1;
    const loFence = q1 - 1.5 * iqr;
    const hiFence = q3 + 1.5 * iqr;
    const whiskerLo = sorted.find((v) => v >= loFence) ?? sorted[0];
    const whiskerHi = [...sorted].reverse().find((v) => v <= hiFence) ?? sorted[sorted.length - 1];
    const outliers = data.filter((v) => v < loFence || v > hiFence);
    return { key, label, q1, q2, q3, iqr, whiskerLo, whiskerHi, outliers, fill };
  });

  const MIN = 100, MAX = 270, RANGE = MAX - MIN;
  const toX = (v: number) => `${((v - MIN) / RANGE) * 100}%`;

  return (
    <div className="space-y-5">
      <div className="space-y-6 pt-2">
        {stats.map((s) => {
          const isHov = hovered === s.key;
          return (
            <div
              key={s.key}
              className={`space-y-1.5 cursor-default transition-opacity ${hovered && !isHov ? "opacity-40" : ""}`}
              onMouseEnter={() => setHovered(s.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="text-[11px] font-semibold text-slate-600">{s.label}</div>
              <div className="relative h-9">
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-0.5"
                  style={{ left: toX(s.whiskerLo), right: `${100 - parseFloat(toX(s.whiskerHi))}%`, backgroundColor: s.fill, opacity: 0.5 }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-5 rounded"
                  style={{ left: toX(s.q1), width: `${((s.q3 - s.q1) / RANGE) * 100}%`, backgroundColor: s.fill, opacity: isHov ? 0.9 : 0.65 }}
                />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white z-10" style={{ left: toX(s.q2) }} />
                {[s.whiskerLo, s.whiskerHi].map((v, i) => (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4" style={{ left: toX(v), backgroundColor: s.fill }} />
                ))}
                {s.outliers.map((v, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 bg-white"
                    style={{ left: `calc(${toX(v)} - 4px)`, borderColor: s.fill }}
                  />
                ))}
              </div>
              {isHov && (
                <div className="flex gap-3 text-[10px] text-slate-500 font-mono flex-wrap">
                  <span>Min {s.whiskerLo.toFixed(0)}</span>
                  <span>Q1 {s.q1.toFixed(0)}</span>
                  <span className="font-bold text-slate-700">Med {s.q2.toFixed(0)}</span>
                  <span>Q3 {s.q3.toFixed(0)}</span>
                  <span>Max {s.whiskerHi.toFixed(0)}</span>
                  <span>IQR {s.iqr.toFixed(0)}</span>
                  {s.outliers.length > 0 && <span className="text-rose-500">{s.outliers.length} outlier{s.outliers.length > 1 ? "s" : ""}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1">
        <span>{MIN}ms</span>
        <span>Response time</span>
        <span>{MAX}ms</span>
      </div>
    </div>
  );
}

function BarChartView() {
  const data = SERIES.map(({ key, label, data, fill, fillLight }) => ({
    key, label, fill, fillLight,
    avg: Math.round(mean(data)),
  }));
  const maxVal = Math.max(...data.map((d) => d.avg));

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-8 h-48 pt-2">
        {data.map((d) => (
          <div key={d.key} className="flex-1 flex flex-col items-center gap-3">
            <span className="text-3xl font-bold" style={{ color: d.fill }}>{d.avg}ms</span>
            <div
              className="w-full rounded-t-md transition-all"
              style={{ height: `${(d.avg / maxVal) * 90}%`, backgroundColor: d.fill, opacity: 0.8 }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-8">
        {data.map((d) => (
          <div key={d.key} className="flex-1 text-center text-base font-semibold text-slate-600">{d.label}</div>
        ))}
      </div>
      <div className="text-center text-sm text-slate-400">Avg. response time (ms)</div>
    </div>
  );
}

export default function AudienceChartComparison() {
  const [audience, setAudience] = useState<"executive" | "technical">("executive");

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Same data, different audience
        </span>
        <div className="flex gap-1">
          {([
            { id: "executive", label: "Executive view" },
            { id: "technical", label: "Technical view" },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setAudience(opt.id)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors border ${
                audience === opt.id
                  ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                  : "text-slate-500 border-transparent hover:bg-slate-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold text-slate-700">Dataset:</span> Weekly average response times for two customer support teams (ms). The same numbers — presented two ways.
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          {audience === "executive" ? <BarChartView /> : <BoxPlotView />}
        </div>

        <div className={`rounded-lg px-4 py-3 text-xs text-slate-700 leading-relaxed border ${
          audience === "executive"
            ? "bg-amber-50 border-amber-100"
            : "bg-indigo-50 border-indigo-100"
        }`}>
          {audience === "executive" ? (
            <>
              <span className="font-semibold text-amber-700">Executive view — bar chart: </span>
              Team A averages ~{Math.round(mean(TEAM_A))}ms, Team B averages ~{Math.round(mean(TEAM_B))}ms. One number per team, one clear takeaway: Team A is faster. No statistical training required.
            </>
          ) : (
            <>
              <span className="font-semibold text-indigo-700">Technical view — box plot: </span>
              Team A has a tighter IQR but one outlier — an anomalous slow week. Team B is consistently slower with no outliers. The box plot surfaces spread and outliers that the bar chart hides. Hover each series to inspect quartiles.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
