"use client";

import { useState, useMemo } from "react";

// ── Datasets ───────────────────────────────────────────────────────────────────

interface Dataset {
  id: string;
  label: string;
  description: string;
  rowLabel: string;
  colLabel: string;
  rowCategories: string[];
  colCategories: string[];
  observed: number[][];
}

const DATASETS: Dataset[] = [
  {
    id: "device",
    label: "Device vs. conversion",
    description: "Did device type affect whether users converted? Strong association expected.",
    rowLabel: "Device",
    colLabel: "Converted",
    rowCategories: ["Mobile", "Desktop", "Tablet"],
    colCategories: ["Yes", "No"],
    observed: [
      [45, 155],
      [98, 102],
      [22, 78],
    ],
  },
  {
    id: "gender",
    label: "Gender vs. product preference",
    description: "Is product preference associated with gender? Moderate association.",
    rowLabel: "Gender",
    colLabel: "Preferred product",
    rowCategories: ["Female", "Male", "Non-binary"],
    colCategories: ["Product A", "Product B", "Product C"],
    observed: [
      [30, 15, 5],
      [12, 28, 10],
      [8, 7, 15],
    ],
  },
  {
    id: "nodiff",
    label: "No real association",
    description: "Two categories drawn independently — chi-square should not reject H₀.",
    rowLabel: "Region",
    colLabel: "Opted in",
    rowCategories: ["North", "South", "East", "West"],
    colCategories: ["Yes", "No"],
    observed: [
      [25, 75],
      [24, 76],
      [26, 74],
      [25, 75],
    ],
  },
];

// ── Math ───────────────────────────────────────────────────────────────────────

interface Stats {
  expected: number[][];
  contributions: number[][];
  chiSq: number;
  df: number;
  p: number;
  rowTotals: number[];
  colTotals: number[];
  grandTotal: number;
}

function computeStats(observed: number[][]): Stats {
  const nR = observed.length;
  const nC = observed[0].length;

  const rowTotals = observed.map(row => row.reduce((s, v) => s + v, 0));
  const colTotals = observed[0].map((_, j) => observed.reduce((s, row) => s + row[j], 0));
  const grandTotal = rowTotals.reduce((s, v) => s + v, 0);

  const expected = observed.map((row, i) =>
    row.map((_, j) => (rowTotals[i] * colTotals[j]) / grandTotal)
  );

  const contributions = observed.map((row, i) =>
    row.map((o, j) => {
      const e = expected[i][j];
      return Math.pow(o - e, 2) / e;
    })
  );

  const chiSq = contributions.flat().reduce((s, v) => s + v, 0);
  const df = (nR - 1) * (nC - 1);
  const p = 1 - chi2CDF(chiSq, df);

  return { expected, contributions, chiSq, df, p, rowTotals, colTotals, grandTotal };
}

// Regularized incomplete gamma function via series expansion
function gammainc(a: number, x: number): number {
  if (x < 0) return 0;
  if (x === 0) return 0;
  let sum = 1 / a;
  let term = 1 / a;
  for (let n = 1; n < 200; n++) {
    term *= x / (a + n);
    sum += term;
    if (Math.abs(term) < 1e-10) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
}

function lgamma(z: number): number {
  const c = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.001208650973866179, -0.000005395239384953,
  ];
  let x = z;
  let y = z;
  const tmp = x + 5.5;
  const ser = c.reduce((s, cv, i) => s + cv / (y + i + 1), 1.000000000190015);
  return Math.log(2.5066282746310005 * ser / x) + (x + 0.5) * Math.log(tmp) - tmp;
}

function chi2CDF(x: number, df: number): number {
  if (x <= 0) return 0;
  return gammainc(df / 2, x / 2);
}

// ── Steps ──────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 0, short: "Observed table" },
  { id: 1, short: "Expected counts" },
  { id: 2, short: "χ² contributions" },
  { id: 3, short: "χ² & p-value" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function heatColor(contrib: number, maxContrib: number): string {
  const ratio = maxContrib > 0 ? Math.min(contrib / maxContrib, 1) : 0;
  if (ratio < 0.25) return "bg-slate-50";
  if (ratio < 0.5) return "bg-amber-50";
  if (ratio < 0.75) return "bg-amber-100";
  return "bg-amber-200";
}

function StepNav({ step, setStep }: { step: number; setStep: (s: number) => void }) {
  return (
    <div className="flex items-center gap-0 border border-slate-200 rounded-lg overflow-hidden divide-x divide-slate-200">
      {STEPS.map(s => (
        <button
          key={s.id}
          onClick={() => setStep(s.id)}
          className={`flex-1 px-3 py-2 text-[11px] font-semibold transition-colors ${
            step === s.id
              ? "bg-indigo-600 text-white"
              : "bg-white text-slate-500 hover:bg-slate-50"
          }`}
        >
          {s.short}
        </button>
      ))}
    </div>
  );
}

// ── Step panels ────────────────────────────────────────────────────────────────

function Step0({
  observed,
  rowCategories,
  colCategories,
  rowLabel,
  colLabel,
  stats,
}: {
  observed: number[][];
  rowCategories: string[];
  colCategories: string[];
  rowLabel: string;
  colLabel: string;
  stats: Stats;
}) {
  return (
    <div>
      <p className="text-xs text-slate-600 mb-3">
        Start with a <strong>contingency table</strong> — count how many observations fall into each
        combination of categories. Row totals and column totals let you compute what you'd{" "}
        <em>expect</em> if the variables were truly independent.
      </p>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr>
              <th className="py-1.5 px-2 text-left text-slate-400 font-semibold border-b border-slate-200">
                {rowLabel} ↓ / {colLabel} →
              </th>
              {colCategories.map(c => (
                <th key={c} className="py-1.5 px-2 text-center text-slate-600 font-semibold border-b border-slate-200">
                  {c}
                </th>
              ))}
              <th className="py-1.5 px-2 text-center text-slate-400 font-semibold border-b border-slate-200 border-l border-slate-200">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {observed.map((row, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-1.5 px-2 text-slate-600 font-semibold">{rowCategories[i]}</td>
                {row.map((val, j) => (
                  <td key={j} className="py-1.5 px-2 text-center font-mono text-slate-700">
                    {val}
                  </td>
                ))}
                <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-500 border-l border-slate-200">
                  {stats.rowTotals[i]}
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-1.5 px-2 text-slate-400 font-semibold border-t border-slate-200">Total</td>
              {stats.colTotals.map((t, j) => (
                <td key={j} className="py-1.5 px-2 text-center font-mono font-bold text-slate-500 border-t border-slate-200">
                  {t}
                </td>
              ))}
              <td className="py-1.5 px-2 text-center font-mono font-bold text-indigo-600 border-t border-slate-200 border-l border-slate-200">
                {stats.grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Step1({
  observed,
  rowCategories,
  colCategories,
  rowLabel,
  colLabel,
  stats,
}: {
  observed: number[][];
  rowCategories: string[];
  colCategories: string[];
  rowLabel: string;
  colLabel: string;
  stats: Stats;
}) {
  const anyLow = stats.expected.flat().some(e => e < 5);

  return (
    <div>
      <p className="text-xs text-slate-600 mb-1">
        Under independence, the expected count for each cell is:
      </p>
      <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 font-mono text-xs text-slate-700 mb-3">
        E = (row total × column total) / grand total
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr>
              <th className="py-1.5 px-2 text-left text-slate-400 font-semibold border-b border-slate-200">
                {rowLabel} / {colLabel}
              </th>
              {colCategories.map(c => (
                <th key={c} className="py-1.5 px-2 text-center text-slate-600 font-semibold border-b border-slate-200">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {observed.map((row, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-1.5 px-2 text-slate-600 font-semibold">{rowCategories[i]}</td>
                {row.map((_, j) => {
                  const e = stats.expected[i][j];
                  const low = e < 5;
                  return (
                    <td key={j} className={`py-1.5 px-2 text-center ${low ? "bg-rose-50" : ""}`}>
                      <span className={`font-mono ${low ? "text-rose-600 font-bold" : "text-slate-700"}`}>
                        {e.toFixed(1)}
                      </span>
                      {low && (
                        <span className="ml-1 text-[9px] text-rose-400 font-semibold">&lt;5</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {anyLow && (
        <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          <strong>Warning:</strong> Some expected counts are below 5 — consider Fisher's exact test.
        </div>
      )}
      {!anyLow && (
        <p className="mt-2 text-[10px] text-slate-400">
          All expected counts ≥ 5 — the chi-square approximation is valid.
        </p>
      )}
    </div>
  );
}

function Step2({
  observed,
  rowCategories,
  colCategories,
  rowLabel,
  colLabel,
  stats,
}: {
  observed: number[][];
  rowCategories: string[];
  colCategories: string[];
  rowLabel: string;
  colLabel: string;
  stats: Stats;
}) {
  const maxContrib = Math.max(...stats.contributions.flat());

  return (
    <div>
      <p className="text-xs text-slate-600 mb-1">
        For each cell compute the squared deviation from expectation, scaled by expected count:
      </p>
      <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 font-mono text-xs text-slate-700 mb-3">
        (O − E)² / E
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Cells are shaded by contribution — darker means that cell drives more of the total χ² statistic.
      </p>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr>
              <th className="py-1.5 px-2 text-left text-slate-400 font-semibold border-b border-slate-200">
                {rowLabel} / {colLabel}
              </th>
              {colCategories.map(c => (
                <th key={c} className="py-1.5 px-2 text-center text-slate-600 font-semibold border-b border-slate-200">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {observed.map((row, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-1.5 px-2 text-slate-600 font-semibold">{rowCategories[i]}</td>
                {row.map((o, j) => {
                  const e = stats.expected[i][j];
                  const contrib = stats.contributions[i][j];
                  return (
                    <td key={j} className={`py-1.5 px-2 text-center ${heatColor(contrib, maxContrib)}`}>
                      <div className="font-mono font-bold text-slate-700">{contrib.toFixed(2)}</div>
                      <div className="text-[9px] text-slate-400">O={o} E={e.toFixed(1)}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded-md bg-indigo-50 border border-indigo-100 px-3 py-2 text-xs font-mono text-indigo-700">
        χ² = {stats.contributions.flat().map(c => c.toFixed(2)).join(" + ")} ={" "}
        <span className="font-bold">{stats.chiSq.toFixed(3)}</span>
      </div>
    </div>
  );
}

function Step3({ stats }: { stats: Stats }) {
  const sig = stats.p < 0.05;

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-600">
        Sum all the cell contributions to get χ². Compare to a chi-square distribution with{" "}
        <strong>df = (rows − 1)(cols − 1)</strong> to get the p-value.
      </p>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs space-y-1.5 font-mono text-slate-700">
        <div>
          χ² = Σ (O − E)² / E = <span className="text-indigo-600 font-bold">{stats.chiSq.toFixed(3)}</span>
        </div>
        <div>
          df = ({Math.sqrt((stats.rowTotals.length + 0) * 1).toFixed(0).replace(/.*/, String(stats.rowTotals.length))} − 1) × ({stats.colTotals.length} − 1) ={" "}
          <span className="font-bold">{stats.df}</span>
        </div>
        <div>
          p-value ={" "}
          <span className={`font-bold ${sig ? "text-rose-600" : "text-emerald-600"}`}>
            {stats.p < 0.001 ? "< 0.001" : stats.p.toFixed(4)}
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Results
          </span>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] text-slate-400">χ² statistic</div>
            <div className="text-sm font-bold font-mono text-indigo-600">{stats.chiSq.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Degrees of freedom</div>
            <div className="text-sm font-bold font-mono text-slate-600">{stats.df}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">p-value</div>
            <div className={`text-sm font-bold font-mono ${sig ? "text-rose-600" : "text-emerald-600"}`}>
              {stats.p < 0.001 ? "< 0.001" : stats.p.toFixed(4)}
            </div>
          </div>
        </div>
        <div className={`px-4 py-3 border-t border-slate-100 text-xs font-semibold ${sig ? "text-rose-600 bg-rose-50" : "text-emerald-700 bg-emerald-50"}`}>
          {sig
            ? `Reject H₀ (p < 0.05) — the two variables are significantly associated.`
            : `Fail to reject H₀ (p ≥ 0.05) — no significant association detected between the variables.`}
        </div>
      </div>

      <p className="text-[10px] text-slate-400">
        Under H₀ (independence), χ² follows a chi-square distribution with df = {stats.df}.
        Large χ² means observed counts deviate substantially from what independence would predict.
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ChiSquareIndependenceWalkthrough() {
  const [datasetId, setDatasetId] = useState("device");
  const [step, setStep] = useState(0);

  const dataset = DATASETS.find(d => d.id === datasetId)!;

  const stats = useMemo(() => computeStats(dataset.observed), [dataset]);

  const sharedProps = {
    observed: dataset.observed,
    rowCategories: dataset.rowCategories,
    colCategories: dataset.colCategories,
    rowLabel: dataset.rowLabel,
    colLabel: dataset.colLabel,
    stats,
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Chi-Square Test of Independence — Step-by-Step
        </span>
      </div>

      {/* Dataset picker */}
      <div className="px-5 pt-4 pb-3">
        <div className="text-xs font-semibold text-slate-600 mb-2">Dataset</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DATASETS.map(d => (
            <button
              key={d.id}
              onClick={() => { setDatasetId(d.id); setStep(0); }}
              className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                datasetId === d.id
                  ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="font-semibold">{d.label}</div>
              <div className="text-slate-500 mt-0.5">{d.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step nav */}
      <div className="px-5 pb-4">
        <StepNav step={step} setStep={setStep} />
      </div>

      {/* Step title */}
      <div className="px-5 pb-3">
        <div className="text-sm font-bold text-slate-800">
          {step === 0 && "Step 1 — Build the observed contingency table"}
          {step === 1 && "Step 2 — Compute expected counts under independence"}
          {step === 2 && "Step 3 — Calculate each cell's contribution to χ²"}
          {step === 3 && "Step 4 — Sum contributions and find the p-value"}
        </div>
      </div>

      {/* Step content */}
      <div className="px-5 pb-5">
        {step === 0 && <Step0 {...sharedProps} />}
        {step === 1 && <Step1 {...sharedProps} />}
        {step === 2 && <Step2 {...sharedProps} />}
        {step === 3 && <Step3 stats={stats} />}
      </div>

      {/* Prev / Next */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <span className="text-[10px] text-slate-400 self-center">
          Step {step + 1} of {STEPS.length}
        </span>
        <button
          onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
