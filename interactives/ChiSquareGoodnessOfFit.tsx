"use client";

import { useState, useMemo } from "react";

// ── Datasets ───────────────────────────────────────────────────────────────────

interface Dataset {
  id: string;
  label: string;
  description: string;
  categories: string[];
  observed: number[];
  expected: number[] | null; // null = uniform
  expectedLabel: string;
  unit: string;
}

const DATASETS: Dataset[] = [
  {
    id: "arrivals",
    label: "Customer arrivals by day",
    description: "Are customer arrivals uniform across weekdays? Strong deviation from uniform.",
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    observed: [42, 38, 65, 55, 100],
    expected: null,
    expectedLabel: "Uniform (60/day)",
    unit: "customers",
  },
  {
    id: "dice",
    label: "Dice rolls",
    description: "Are these 120 dice rolls consistent with a fair die?",
    categories: ["1", "2", "3", "4", "5", "6"],
    observed: [18, 22, 25, 17, 19, 19],
    expected: null,
    expectedLabel: "Fair die (20 each)",
    unit: "rolls",
  },
  {
    id: "demographic",
    label: "User demographic vs. national",
    description: "Does your user age distribution match the national internet-user distribution?",
    categories: ["18–24", "25–34", "35–44", "45–54", "55+"],
    observed: [95, 180, 105, 60, 60],
    expected: [0.18, 0.28, 0.22, 0.17, 0.15],
    expectedLabel: "National distribution",
    unit: "users",
  },
];

// ── Math ───────────────────────────────────────────────────────────────────────

interface Stats {
  expectedCounts: number[];
  contributions: number[];
  chiSq: number;
  df: number;
  p: number;
  total: number;
}

function computeStats(dataset: Dataset): Stats {
  const total = dataset.observed.reduce((s, v) => s + v, 0);
  const n = dataset.observed.length;

  const expectedCounts =
    dataset.expected === null
      ? dataset.observed.map(() => total / n)
      : dataset.expected.map(p => p * total);

  const contributions = dataset.observed.map((o, i) => {
    const e = expectedCounts[i];
    return Math.pow(o - e, 2) / e;
  });

  const chiSq = contributions.reduce((s, v) => s + v, 0);
  const df = n - 1;
  const p = 1 - chi2CDF(chiSq, df);

  return { expectedCounts, contributions, chiSq, df, p, total };
}

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
  { id: 0, short: "Observed vs. expected" },
  { id: 1, short: "χ² contributions" },
  { id: 2, short: "χ² & p-value" },
];

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
  dataset,
  stats,
}: {
  dataset: Dataset;
  stats: Stats;
}) {
  const maxVal = Math.max(...dataset.observed, ...stats.expectedCounts);

  return (
    <div>
      <p className="text-xs text-slate-600 mb-3">
        Compare the <strong className="text-indigo-600">observed</strong> frequencies to the{" "}
        <strong className="text-slate-500">expected</strong> frequencies under your hypothesis.
        If the distribution matches, bars should be roughly equal in height.
      </p>

      {/* Bar chart */}
      <div className="mb-4">
        <div className="flex items-end gap-2 h-32">
          {dataset.categories.map((cat, i) => {
            const obs = dataset.observed[i];
            const exp = stats.expectedCounts[i];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full flex items-end gap-0.5 justify-center" style={{ height: 96 }}>
                  <div
                    className="flex-1 bg-indigo-400 rounded-t transition-all"
                    style={{ height: `${(obs / maxVal) * 96}px` }}
                    title={`Observed: ${obs}`}
                  />
                  <div
                    className="flex-1 bg-slate-300 rounded-t transition-all"
                    style={{ height: `${(exp / maxVal) * 96}px` }}
                    title={`Expected: ${exp.toFixed(1)}`}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">{cat}</div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-2">
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <span className="inline-block w-3 h-2 rounded bg-indigo-400" /> Observed
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <span className="inline-block w-3 h-2 rounded bg-slate-300" /> Expected ({dataset.expectedLabel})
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-1.5 px-2 text-left text-slate-400 font-semibold">Category</th>
              <th className="py-1.5 px-2 text-right text-slate-400 font-semibold">Observed (O)</th>
              <th className="py-1.5 px-2 text-right text-slate-400 font-semibold">Expected (E)</th>
              <th className="py-1.5 px-2 text-right text-slate-400 font-semibold">O − E</th>
            </tr>
          </thead>
          <tbody>
            {dataset.categories.map((cat, i) => {
              const o = dataset.observed[i];
              const e = stats.expectedCounts[i];
              const diff = o - e;
              return (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-1.5 px-2 text-slate-700 font-semibold">{cat}</td>
                  <td className="py-1.5 px-2 text-right font-mono text-indigo-600 font-bold">{o}</td>
                  <td className="py-1.5 px-2 text-right font-mono text-slate-500">{e.toFixed(1)}</td>
                  <td className={`py-1.5 px-2 text-right font-mono font-semibold ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-rose-500" : "text-slate-400"}`}>
                    {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-400 mt-2">Total observations: {stats.total}</p>
    </div>
  );
}

function Step1({ dataset, stats }: { dataset: Dataset; stats: Stats }) {
  const maxContrib = Math.max(...stats.contributions);

  return (
    <div>
      <p className="text-xs text-slate-600 mb-1">
        For each category, compute how far the observed count is from expected, scaled by expected:
      </p>
      <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 font-mono text-xs text-slate-700 mb-3">
        (O − E)² / E
      </div>

      <div className="space-y-2 mb-4">
        {dataset.categories.map((cat, i) => {
          const contrib = stats.contributions[i];
          const barW = maxContrib > 0 ? (contrib / maxContrib) * 100 : 0;
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="text-[11px] text-slate-600 font-semibold w-12 shrink-0">{cat}</div>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${barW}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 w-12 text-right">
                {contrib.toFixed(3)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-1.5 px-2 text-left text-slate-400 font-semibold">Category</th>
              <th className="py-1.5 px-2 text-right text-slate-400 font-semibold">O</th>
              <th className="py-1.5 px-2 text-right text-slate-400 font-semibold">E</th>
              <th className="py-1.5 px-2 text-right text-slate-400 font-semibold">(O−E)²/E</th>
            </tr>
          </thead>
          <tbody>
            {dataset.categories.map((cat, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-1.5 px-2 text-slate-600 font-semibold">{cat}</td>
                <td className="py-1.5 px-2 text-right font-mono text-slate-700">{dataset.observed[i]}</td>
                <td className="py-1.5 px-2 text-right font-mono text-slate-500">{stats.expectedCounts[i].toFixed(1)}</td>
                <td className="py-1.5 px-2 text-right font-mono font-bold text-amber-600">
                  {stats.contributions[i].toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded-md bg-indigo-50 border border-indigo-100 px-3 py-2 text-xs font-mono text-indigo-700">
        χ² = {stats.contributions.map(c => c.toFixed(3)).join(" + ")} ={" "}
        <span className="font-bold">{stats.chiSq.toFixed(3)}</span>
      </div>
    </div>
  );
}

function Step2({ stats, dataset }: { stats: Stats; dataset: Dataset }) {
  const sig = stats.p < 0.05;

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-600">
        Sum the contributions to get χ². Compare to a chi-square distribution with{" "}
        <strong>df = k − 1</strong> (number of categories minus one) to get the p-value.
      </p>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs space-y-1.5 font-mono text-slate-700">
        <div>
          χ² = Σ (O − E)² / E = <span className="text-indigo-600 font-bold">{stats.chiSq.toFixed(3)}</span>
        </div>
        <div>
          df = k − 1 = {dataset.categories.length} − 1 ={" "}
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
            Results (k = {dataset.categories.length} categories)
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
            ? `Reject H₀ (p < 0.05) — the observed distribution is significantly different from expected.`
            : `Fail to reject H₀ (p ≥ 0.05) — the observed distribution is consistent with the expected distribution.`}
        </div>
      </div>

      <p className="text-[10px] text-slate-400">
        Under H₀, χ² follows a chi-square distribution with df = {stats.df}. A large χ² means the
        observed counts deviate substantially from the expected distribution.
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ChiSquareGoodnessOfFit() {
  const [datasetId, setDatasetId] = useState("arrivals");
  const [step, setStep] = useState(0);

  const dataset = DATASETS.find(d => d.id === datasetId)!;
  const stats = useMemo(() => computeStats(dataset), [dataset]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Chi-Square Goodness-of-Fit — Step-by-Step
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
          {step === 0 && "Step 1 — Compare observed counts to expected counts"}
          {step === 1 && "Step 2 — Compute each category's contribution to χ²"}
          {step === 2 && "Step 3 — Sum contributions and find the p-value"}
        </div>
      </div>

      {/* Step content */}
      <div className="px-5 pb-5">
        {step === 0 && <Step0 dataset={dataset} stats={stats} />}
        {step === 1 && <Step1 dataset={dataset} stats={stats} />}
        {step === 2 && <Step2 stats={stats} dataset={dataset} />}
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
