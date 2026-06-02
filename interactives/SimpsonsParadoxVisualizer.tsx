"use client";

import { useState } from "react";

// Real 1973 UC Berkeley admissions data (Bickel et al.)
// men: { applied, admitted }, women: { applied, admitted }
const DEPARTMENTS = [
  { dept: "A", men: { applied: 825, admitted: 512 }, women: { applied: 108, admitted: 89 } },
  { dept: "B", men: { applied: 560, admitted: 353 }, women: { applied: 25,  admitted: 17  } },
  { dept: "C", men: { applied: 325, admitted: 120 }, women: { applied: 593, admitted: 202 } },
  { dept: "D", men: { applied: 417, admitted: 138 }, women: { applied: 375, admitted: 131 } },
  { dept: "E", men: { applied: 191, admitted: 53  }, women: { applied: 393, admitted: 94  } },
  { dept: "F", men: { applied: 272, admitted: 16  }, women: { applied: 341, admitted: 24  } },
];

const MEN_COLOR   = "#2563eb";
const WOMEN_COLOR = "#db2777";

const totalMenApplied    = DEPARTMENTS.reduce((s, d) => s + d.men.applied, 0);
const totalMenAdmitted   = DEPARTMENTS.reduce((s, d) => s + d.men.admitted, 0);
const totalWomenApplied  = DEPARTMENTS.reduce((s, d) => s + d.women.applied, 0);
const totalWomenAdmitted = DEPARTMENTS.reduce((s, d) => s + d.women.admitted, 0);

const AGGREGATE = {
  men:   Math.round((totalMenAdmitted   / totalMenApplied)   * 100),
  women: Math.round((totalWomenAdmitted / totalWomenApplied) * 100),
};

// ── Bar chart ──────────────────────────────────────────────────────────────────

const CW = 500;
const CH = 200;
const P  = { t: 16, r: 16, b: 36, l: 36 };

function pct(admitted: number, applied: number) {
  return Math.round((admitted / applied) * 100);
}

function BarChart({ showGroups }: { showGroups: boolean }) {
  const pw = CW - P.l - P.r;
  const ph = CH - P.t - P.b;

  const sy = (v: number) => P.t + ph - (v / 100) * ph;

  const yTicks = [0, 25, 50, 75, 100];

  if (!showGroups) {
    // Two bars: overall men vs women
    const barW = 60;
    const gap  = 40;
    const totalW = 2 * barW + gap;
    const startX = P.l + (pw - totalW) / 2;

    const menX   = startX;
    const womenX = startX + barW + gap;

    return (
      <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
        {/* Y gridlines */}
        {yTicks.map(v => (
          <g key={v}>
            <line x1={P.l} y1={sy(v)} x2={P.l + pw} y2={sy(v)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={P.l - 4} y={sy(v) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{v}%</text>
          </g>
        ))}

        {/* Men bar */}
        <rect x={menX} y={sy(AGGREGATE.men)} width={barW} height={ph - (ph - (sy(100) - sy(AGGREGATE.men + 100 - 100)))}
          fill={MEN_COLOR} fillOpacity={0.85} rx="2" />
        <rect x={menX} y={sy(AGGREGATE.men)} width={barW}
          height={P.t + ph - sy(AGGREGATE.men)}
          fill={MEN_COLOR} fillOpacity={0.85} rx="2" />
        <text x={menX + barW / 2} y={sy(AGGREGATE.men) - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill={MEN_COLOR}>
          {AGGREGATE.men}%
        </text>
        <text x={menX + barW / 2} y={CH - P.b + 12} textAnchor="middle" fontSize="9" fill="#64748b">Men</text>

        {/* Women bar */}
        <rect x={womenX} y={sy(AGGREGATE.women)} width={barW}
          height={P.t + ph - sy(AGGREGATE.women)}
          fill={WOMEN_COLOR} fillOpacity={0.85} rx="2" />
        <text x={womenX + barW / 2} y={sy(AGGREGATE.women) - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill={WOMEN_COLOR}>
          {AGGREGATE.women}%
        </text>
        <text x={womenX + barW / 2} y={CH - P.b + 12} textAnchor="middle" fontSize="9" fill="#64748b">Women</text>

        {/* Axis */}
        <line x1={P.l} y1={P.t} x2={P.l} y2={P.t + ph} stroke="#e2e8f0" />
        <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph} stroke="#e2e8f0" />
        <text x={P.l + pw / 2} y={CH - 2} textAnchor="middle" fontSize="8" fill="#94a3b8">
          Overall admission rate
        </text>
      </svg>
    );
  }

  // Per-department grouped bars
  const n      = DEPARTMENTS.length;
  const groupW = pw / n;
  const barW   = Math.min(14, groupW * 0.35);
  const barGap = 3;

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      {/* Y gridlines */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={P.l} y1={sy(v)} x2={P.l + pw} y2={sy(v)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={P.l - 4} y={sy(v) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{v}%</text>
        </g>
      ))}

      {/* Bars per department */}
      {DEPARTMENTS.map((d, i) => {
        const menRate   = pct(d.men.admitted, d.men.applied);
        const womenRate = pct(d.women.admitted, d.women.applied);
        const cx = P.l + (i + 0.5) * groupW;
        const menX   = cx - barGap / 2 - barW;
        const womenX = cx + barGap / 2;

        return (
          <g key={d.dept}>
            {/* Men */}
            <rect x={menX} y={sy(menRate)} width={barW}
              height={P.t + ph - sy(menRate)}
              fill={MEN_COLOR} fillOpacity={0.85} rx="2" />
            <text x={menX + barW / 2} y={sy(menRate) - 3} textAnchor="middle" fontSize="7" fill={MEN_COLOR}>
              {menRate}%
            </text>

            {/* Women */}
            <rect x={womenX} y={sy(womenRate)} width={barW}
              height={P.t + ph - sy(womenRate)}
              fill={WOMEN_COLOR} fillOpacity={0.85} rx="2" />
            <text x={womenX + barW / 2} y={sy(womenRate) - 3} textAnchor="middle" fontSize="7" fill={WOMEN_COLOR}>
              {womenRate}%
            </text>

            <text x={cx} y={CH - P.b + 12} textAnchor="middle" fontSize="9" fill="#64748b">
              Dept {d.dept}
            </text>
          </g>
        );
      })}

      {/* Axis */}
      <line x1={P.l} y1={P.t} x2={P.l} y2={P.t + ph} stroke="#e2e8f0" />
      <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph} stroke="#e2e8f0" />
      <text x={P.l + pw / 2} y={CH - 2} textAnchor="middle" fontSize="8" fill="#94a3b8">
        Admission rate by department
      </text>
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function SimpsonsParadoxVisualizer() {
  const [showGroups, setShowGroups] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Simpson's Paradox — UC Berkeley Admissions (1973)
        </span>
        <button onClick={() => setShowGroups(v => !v)}
          className={`text-[11px] font-medium px-2 py-0.5 rounded border transition-colors ${
            showGroups
              ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}>
          {showGroups ? "Hide departments" : "Break down by department"}
        </button>
      </div>

      {/* Chart */}
      <div className="px-5 pt-4 pb-2">
        <BarChart showGroups={showGroups} />
      </div>

      {/* Explanation */}
      <div className={`mx-5 mb-4 rounded-lg border px-4 py-3 transition-colors ${
        showGroups ? "bg-indigo-50 border-indigo-200" : "bg-amber-50 border-amber-200"
      }`}>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
          {showGroups ? "Per-department analysis" : "Aggregate analysis"}
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {showGroups
            ? "Within most departments, women were admitted at equal or higher rates than men. The aggregate gap appeared because women applied in larger numbers to the most competitive departments (C, D, E, F), which had low acceptance rates for everyone."
            : `Overall, men were admitted at ${AGGREGATE.men}% vs. ${AGGREGATE.women}% for women — suggesting bias. But the aggregate hides a confounding variable. Click "Break down by department" to see why.`}
        </p>
      </div>

      {/* Department table — shown after reveal */}
      {showGroups && (
        <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden text-xs">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 grid grid-cols-5 gap-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Dept</span>
            <span className="text-right">Men applied</span>
            <span className="text-right" style={{ color: MEN_COLOR }}>Men admitted</span>
            <span className="text-right">Women applied</span>
            <span className="text-right" style={{ color: WOMEN_COLOR }}>Women admitted</span>
          </div>
          {DEPARTMENTS.map(d => {
            const menRate   = pct(d.men.admitted, d.men.applied);
            const womenRate = pct(d.women.admitted, d.women.applied);
            return (
              <div key={d.dept} className="px-4 py-1.5 grid grid-cols-5 gap-2 border-b border-slate-50 text-slate-600">
                <span className="font-medium">Dept {d.dept}</span>
                <span className="text-right text-slate-400">{d.men.applied}</span>
                <span className="text-right font-medium" style={{ color: MEN_COLOR }}>{menRate}%</span>
                <span className="text-right text-slate-400">{d.women.applied}</span>
                <span className="text-right font-medium" style={{ color: womenRate >= menRate ? WOMEN_COLOR : "#94a3b8" }}>
                  {womenRate}%{womenRate >= menRate ? " ↑" : ""}
                </span>
              </div>
            );
          })}
          <div className="px-4 py-1.5 grid grid-cols-5 gap-2 bg-slate-50 text-slate-700 font-medium border-t border-slate-200">
            <span>Overall</span>
            <span className="text-right text-slate-400">{totalMenApplied}</span>
            <span className="text-right" style={{ color: MEN_COLOR }}>{AGGREGATE.men}%</span>
            <span className="text-right text-slate-400">{totalWomenApplied}</span>
            <span className="text-right" style={{ color: WOMEN_COLOR }}>{AGGREGATE.women}%</span>
          </div>
        </div>
      )}

      {/* Why it happens */}
      <div className="mx-5 mb-4 rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Why it happens</div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Simpson's Paradox arises when a confounding variable is correlated with both the grouping and the outcome.
          Here, women self-selected into harder departments — so the aggregate rate reflects department difficulty, not bias.
          Always ask: <em>is there a lurking variable that determines who ends up in which group?</em>
        </p>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: MEN_COLOR }} />
          Men
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: WOMEN_COLOR }} />
          Women
        </span>
      </div>
    </div>
  );
}
