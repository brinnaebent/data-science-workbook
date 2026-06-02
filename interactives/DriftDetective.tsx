"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface DataPoint {
  t: number; // week index
  accuracy: number;
  feature_age_mean: number;
  feature_income_mean: number;
  feature_visits_mean: number;
  psi_age: number;
  psi_income: number;
  psi_visits: number;
}

// Baseline (training) distributions
const BASE = {
  age_mean: 35,
  income_mean: 65000,
  visits_mean: 8,
  accuracy: 0.87,
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function randNorm(mean: number, std: number): number {
  // Box-Muller approximation
  const u = Math.random(), v = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u + 0.0001)) * Math.cos(2 * Math.PI * v);
}

function psi(baselineMean: number, currentMean: number, std: number): number {
  const shift = Math.abs(currentMean - baselineMean) / std;
  // Simplified PSI proxy: larger shift → larger PSI
  return Math.min(0.5, shift * shift * 0.05 + Math.random() * 0.01);
}

function generateStream(driftLevel: number, weeks: number): DataPoint[] {
  const points: DataPoint[] = [];

  // driftLevel 0–100: affects which feature drifts and how much
  // We make "age" the drifting feature
  const ageDrift = driftLevel / 100; // 0–1
  const incomeDrift = 0; // no drift
  const visitsDrift = 0; // no drift

  for (let t = 0; t < weeks; t++) {
    const progress = t / (weeks - 1);
    const age_mean = BASE.age_mean + ageDrift * progress * 20 + randNorm(0, 1);
    const income_mean = BASE.income_mean + incomeDrift * progress * 10000 + randNorm(0, 500);
    const visits_mean = BASE.visits_mean + visitsDrift * progress * 4 + randNorm(0, 0.3);

    const psi_age = psi(BASE.age_mean, age_mean, 8);
    const psi_income = psi(BASE.income_mean, income_mean, 15000);
    const psi_visits = psi(BASE.visits_mean, visits_mean, 3);

    // Accuracy degrades based on age drift PSI
    const acc_drop = Math.min(0.25, ageDrift * progress * 0.3);
    const accuracy = clamp(BASE.accuracy - acc_drop + randNorm(0, 0.005), 0.4, 0.95);

    points.push({ t, accuracy, feature_age_mean: age_mean, feature_income_mean: income_mean, feature_visits_mean: visits_mean, psi_age, psi_income, psi_visits });
  }
  return points;
}

const WEEKS = 16;

function psiColor(psi: number): string {
  if (psi >= 0.2) return "text-rose-600 font-bold";
  if (psi >= 0.1) return "text-amber-600 font-semibold";
  return "text-emerald-600";
}

function psiLabel(psi: number): string {
  if (psi >= 0.2) return "SIGNIFICANT — consider retrain";
  if (psi >= 0.1) return "Moderate — monitor closely";
  return "Stable";
}

function MiniChart({ data, accessor, baseline, color, label }: {
  data: DataPoint[]; accessor: (d: DataPoint) => number; baseline: number; color: string; label: string;
}) {
  const values = data.map(accessor);
  const min = Math.min(...values, baseline) * 0.9;
  const max = Math.max(...values, baseline) * 1.1;
  const W = 200, H = 50;

  function y(v: number) {
    return H - ((v - min) / (max - min)) * H;
  }

  const points = data.map((d, i) => `${(i / (WEEKS - 1)) * W},${y(accessor(d))}`).join(" ");
  const baselineY = y(baseline);

  return (
    <div>
      <div className="text-xs font-medium text-slate-600 mb-1">{label}</div>
      <svg width={W} height={H} className="rounded overflow-hidden border border-slate-200 bg-slate-50 w-full">
        <line x1="0" y1={baselineY} x2={W} y2={baselineY} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      </svg>
    </div>
  );
}

export default function DriftDetective() {
  const [driftLevel, setDriftLevel] = useState(0);
  const [retrained, setRetrained] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const data = generateStream(driftLevel, WEEKS);

  // "watch" mode: auto-advance weeks
  const startAnimation = useCallback(() => {
    setCurrentWeek(0);
    setRetrained(false);
    setAnimating(true);
  }, []);

  useEffect(() => {
    if (!animating) return;
    if (currentWeek >= WEEKS - 1) {
      setAnimating(false);
      return;
    }
    const t = setTimeout(() => setCurrentWeek((w) => w + 1), 250);
    intervalRef.current = t;
    return () => clearTimeout(t);
  }, [animating, currentWeek]);

  const visibleData = animating ? data.slice(0, currentWeek + 1) : data;
  const latestPoint = visibleData[visibleData.length - 1];

  const alerted = latestPoint && (latestPoint.psi_age >= 0.2 || latestPoint.psi_income >= 0.2 || latestPoint.psi_visits >= 0.2);

  function handleRetrain() {
    setRetrained(true);
    setDriftLevel(0);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Drift Detective</span>
        <span className="text-xs text-slate-400">Week {Math.min(currentWeek + 1, WEEKS)} of {WEEKS}</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Drift slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600">Drift intensity</span>
            <span className={`text-xs font-semibold ${driftLevel === 0 ? "text-emerald-600" : driftLevel < 50 ? "text-amber-600" : "text-rose-600"}`}>
              {driftLevel === 0 ? "None" : driftLevel < 50 ? "Moderate" : "Significant"}
            </span>
          </div>
          <input
            type="range" min={0} max={100} step={5} value={driftLevel}
            onChange={(e) => { setDriftLevel(Number(e.target.value)); setRetrained(false); }}
            className="w-full accent-rose-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Slide right to shift the age distribution of incoming users. Watch model accuracy degrade and PSI rise.
          </p>
        </div>

        {/* Watch button */}
        <button
          onClick={startAnimation}
          disabled={animating}
          className="text-xs px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {animating ? "Streaming production data…" : "▶ Watch production stream"}
        </button>

        {/* Alert banner */}
        {alerted && !retrained && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-3">
            <span className="text-rose-500 text-lg leading-none">⚠</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-rose-700">Drift detected — PSI ≥ 0.2</div>
              <div className="text-xs text-rose-600 mt-0.5">The age feature distribution has shifted significantly from training. Model performance is degrading.</div>
            </div>
            <button
              onClick={handleRetrain}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors whitespace-nowrap"
            >
              Trigger Retrain
            </button>
          </div>
        )}

        {retrained && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="text-sm font-semibold text-emerald-700">Retrain triggered ✓</span>
            <p className="text-xs text-emerald-600 mt-0.5">Model retrained on current distribution. Accuracy restored to baseline. Drift reset.</p>
          </div>
        )}

        {/* Metrics grid */}
        {latestPoint && (
          <div className="grid grid-cols-2 gap-4">
            {/* Accuracy chart */}
            <div>
              <MiniChart
                data={visibleData}
                accessor={(d) => d.accuracy}
                baseline={BASE.accuracy}
                color={latestPoint.accuracy < 0.75 ? "#ef4444" : "#6366f1"}
                label={`Model Accuracy: ${latestPoint.accuracy.toFixed(3)}`}
              />
            </div>
            {/* Age mean chart */}
            <div>
              <MiniChart
                data={visibleData}
                accessor={(d) => d.feature_age_mean}
                baseline={BASE.age_mean}
                color={latestPoint.psi_age >= 0.2 ? "#ef4444" : latestPoint.psi_age >= 0.1 ? "#f59e0b" : "#10b981"}
                label={`Avg Age: ${latestPoint.feature_age_mean.toFixed(1)} (baseline: ${BASE.age_mean})`}
              />
            </div>
          </div>
        )}

        {/* PSI table */}
        {latestPoint && (
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-2 text-left font-semibold text-slate-500">Feature</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-500">PSI</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "age", psi: latestPoint.psi_age },
                  { name: "income", psi: latestPoint.psi_income },
                  { name: "visits", psi: latestPoint.psi_visits },
                ].map((f) => (
                  <tr key={f.name} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-slate-700">{f.name}</td>
                    <td className={`px-3 py-2 text-right font-mono ${psiColor(f.psi)}`}>{f.psi.toFixed(3)}</td>
                    <td className={`px-3 py-2 ${psiColor(f.psi)}`}>{psiLabel(f.psi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        PSI &lt; 0.1: stable &nbsp;|&nbsp; 0.1–0.2: monitor &nbsp;|&nbsp; ≥ 0.2: retrain. Dashed line in charts = training baseline.
      </div>
    </div>
  );
}
