"use client";

import { useState, useMemo } from "react";

// ── Datasets ───────────────────────────────────────────────────────────────────

interface Dataset {
  id: string;
  label: string;
  description: string;
  before: number[];
  after: number[];
  unit: string;
}

const DATASETS: Dataset[] = [
  {
    id: "sleep",
    label: "Sleep after treatment",
    description: "Hours of sleep before and after a sleep-aid intervention for 8 patients.",
    before: [6.1, 5.5, 7.2, 6.8, 5.0, 6.5, 7.0, 5.8],
    after:  [7.4, 6.8, 7.5, 7.9, 6.1, 6.4, 8.2, 7.0],
    unit: "hrs",
  },
  {
    id: "pain",
    label: "Pain scores after drug",
    description: "Pain (0–10) before and after a new analgesic for 7 patients.",
    before: [7, 6, 8, 5, 9, 6, 7],
    after:  [4, 5, 5, 4, 6, 7, 3],
    unit: "/10",
  },
  {
    id: "nodiff",
    label: "No real change",
    description: "Scores before and after a placebo — differences are small and mixed.",
    before: [50, 52, 48, 55, 51, 49, 53, 50],
    after:  [51, 50, 49, 54, 52, 48, 54, 51],
    unit: "pts",
  },
];

// ── Math ───────────────────────────────────────────────────────────────────────

interface Row {
  before: number;
  after: number;
  diff: number;
  absDiff: number;
  rank: number | null; // null = tied at 0 (excluded)
  signedRank: number | null;
  excluded: boolean;
}

function buildRows(before: number[], after: number[]): Row[] {
  const diffs = before.map((b, i) => ({ before: b, after: after[i], diff: after[i] - b }));
  const nonZero = diffs.filter(d => d.diff !== 0);
  const abs = nonZero.map(d => Math.abs(d.diff));

  // Assign ranks with average ties
  const sorted = abs.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = new Array(abs.length).fill(0);
  for (let i = 0; i < sorted.length; ) {
    let j = i;
    while (j < sorted.length && sorted[j].v === sorted[i].v) j++;
    const r = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[sorted[k].i] = r;
    i = j;
  }

  let nzIdx = 0;
  return diffs.map(d => {
    if (d.diff === 0) {
      return { ...d, absDiff: 0, rank: null, signedRank: null, excluded: true };
    }
    const rank = ranks[nzIdx];
    const signedRank = d.diff > 0 ? rank : -rank;
    nzIdx++;
    return { ...d, absDiff: Math.abs(d.diff), rank, signedRank, excluded: false };
  });
}

function computeStats(rows: Row[]) {
  const included = rows.filter(r => !r.excluded);
  const Wplus  = included.filter(r => r.signedRank! > 0).reduce((s, r) => s + r.signedRank!, 0);
  const Wminus = Math.abs(included.filter(r => r.signedRank! < 0).reduce((s, r) => s + r.signedRank!, 0));
  const W = Math.min(Wplus, Wminus);
  const n = included.length;
  const mu = (n * (n + 1)) / 4;
  const sigma = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24);
  const z = sigma > 0 ? (W - mu) / sigma : 0;
  const cdf = normalCDF(z);
  const p = sigma > 0 ? 2 * Math.min(cdf, 1 - cdf) : 1;
  return { Wplus, Wminus, W, n, mu, sigma, z, p };
}

function normalCDF(z: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const val = 1 - poly * Math.exp(-z * z);
  return z >= 0 ? 1 - val : val;
}

// ── Step config ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 0, label: "Pairs", title: "Step 1 — Compute differences", short: "Differences" },
  { id: 1, label: "Abs",   title: "Step 2 — Rank absolute differences", short: "Rank |diffs|" },
  { id: 2, label: "Sign",  title: "Step 3 — Reattach the sign", short: "Signed ranks" },
  { id: 3, label: "W",     title: "Step 4 — Compute W and p-value", short: "W & p-value" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

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

function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-slate-400 font-mono text-xs">0</span>;
  const pos = diff > 0;
  return (
    <span className={`font-mono text-xs font-bold ${pos ? "text-emerald-600" : "text-rose-500"}`}>
      {pos ? "+" : ""}{diff.toFixed(1)}
    </span>
  );
}

function RankBadge({ rank, signed }: { rank: number | null; signed?: boolean }) {
  if (rank === null) return <span className="text-slate-300 text-xs">—</span>;
  const neg = signed && rank < 0;
  const val = signed ? rank : rank;
  return (
    <span className={`font-mono text-xs font-bold ${
      signed ? (neg ? "text-rose-500" : "text-emerald-600") : "text-indigo-600"
    }`}>
      {signed && rank > 0 ? "+" : ""}{val % 1 === 0 ? val : val.toFixed(1)}
    </span>
  );
}

function ExcludedPill() {
  return (
    <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400 font-semibold">
      excluded (diff = 0)
    </span>
  );
}

// ── Step panels ────────────────────────────────────────────────────────────────

function Step0({ rows, unit }: { rows: Row[]; unit: string }) {
  return (
    <div>
      <p className="text-xs text-slate-600 mb-3">
        For each pair, compute <strong>After − Before</strong>. Positive differences mean the score
        went up; negative means it went down. Pairs where the difference is exactly 0 are excluded
        from the test.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-1.5 px-2 text-slate-400 font-semibold">Pair</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">Before ({unit})</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">After ({unit})</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">Difference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-slate-100 ${r.excluded ? "opacity-40" : ""}`}>
                <td className="py-1.5 px-2 text-slate-500">{i + 1}</td>
                <td className="py-1.5 px-2 text-right font-mono text-slate-700">{r.before.toFixed(1)}</td>
                <td className="py-1.5 px-2 text-right font-mono text-slate-700">{r.after.toFixed(1)}</td>
                <td className="py-1.5 px-2 text-right">
                  <DiffBadge diff={r.diff} />
                  {r.excluded && <ExcludedPill />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Step1({ rows }: { rows: Row[] }) {
  return (
    <div>
      <p className="text-xs text-slate-600 mb-3">
        Take the <strong>absolute value</strong> of each difference (ignore the sign), then rank
        them from smallest (rank 1) to largest. When two values tie, average their ranks.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-1.5 px-2 text-slate-400 font-semibold">Pair</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">Difference</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">|Difference|</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">Rank</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-slate-100 ${r.excluded ? "opacity-40" : ""}`}>
                <td className="py-1.5 px-2 text-slate-500">{i + 1}</td>
                <td className="py-1.5 px-2 text-right"><DiffBadge diff={r.diff} /></td>
                <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                  {r.excluded ? "—" : r.absDiff.toFixed(1)}
                </td>
                <td className="py-1.5 px-2 text-right">
                  {r.excluded ? <ExcludedPill /> : <RankBadge rank={r.rank} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-400 mt-2">
        Ranks run from 1 to {rows.filter(r => !r.excluded).length}. Tied absolute differences share the average of their ranks.
      </p>
    </div>
  );
}

function Step2({ rows }: { rows: Row[] }) {
  return (
    <div>
      <p className="text-xs text-slate-600 mb-3">
        Put the sign back. A pair where <em>After &gt; Before</em> gets a{" "}
        <span className="text-emerald-600 font-semibold">positive rank</span>; a pair where{" "}
        <em>After &lt; Before</em> gets a{" "}
        <span className="text-rose-500 font-semibold">negative rank</span>.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-1.5 px-2 text-slate-400 font-semibold">Pair</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">Difference</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">Rank</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">Signed Rank</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-slate-100 ${r.excluded ? "opacity-40" : ""}`}>
                <td className="py-1.5 px-2 text-slate-500">{i + 1}</td>
                <td className="py-1.5 px-2 text-right"><DiffBadge diff={r.diff} /></td>
                <td className="py-1.5 px-2 text-right"><RankBadge rank={r.rank} /></td>
                <td className="py-1.5 px-2 text-right">
                  {r.excluded ? <ExcludedPill /> : <RankBadge rank={r.signedRank} signed />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Step3({ rows, stats }: { rows: Row[]; stats: ReturnType<typeof computeStats> }) {
  const { Wplus, Wminus, W, n, mu, sigma, z, p } = stats;
  const sig = p < 0.05;

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-600">
        Sum the <span className="text-emerald-600 font-semibold">positive signed ranks</span>{" "}
        (W<sup>+</sup>) and the absolute sum of the{" "}
        <span className="text-rose-500 font-semibold">negative signed ranks</span> (W<sup>−</sup>).
        The test statistic <strong>W = min(W<sup>+</sup>, W<sup>−</sup>)</strong> — a small W means
        the signs are very unbalanced, which is evidence against H₀.
      </p>

      {/* Rank sum bars */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "W⁺ (sum positive ranks)", value: Wplus, color: "bg-emerald-500" },
          { label: "W⁻ (sum |negative ranks|)", value: Wminus, color: "bg-rose-400" },
        ].map(({ label, value, color }) => {
          const max = Math.max(Wplus, Wminus, 1);
          return (
            <div key={label}>
              <div className="text-[10px] text-slate-500 mb-1">{label}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${(value / max) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold font-mono text-slate-700 w-8 text-right">
                  {value % 1 === 0 ? value : value.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats grid */}
      <div className="rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Results (n = {n} non-zero pairs)
          </span>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] text-slate-400">W (test stat)</div>
            <div className="text-sm font-bold font-mono text-indigo-600">
              {W % 1 === 0 ? W : W.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Expected W (H₀)</div>
            <div className="text-sm font-bold font-mono text-slate-600">{mu.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">z-score</div>
            <div className="text-sm font-bold font-mono text-slate-600">{z.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">p-value (two-tailed)</div>
            <div className={`text-sm font-bold font-mono ${sig ? "text-rose-600" : "text-emerald-600"}`}>
              {p < 0.001 ? "< 0.001" : p.toFixed(4)}
            </div>
          </div>
        </div>
        <div className={`px-4 py-3 border-t border-slate-100 text-xs font-semibold ${sig ? "text-rose-600 bg-rose-50" : "text-emerald-700 bg-emerald-50"}`}>
          {sig
            ? `Reject H₀ (p < 0.05) — the signed ranks are sufficiently unbalanced to conclude a systematic shift.`
            : `Fail to reject H₀ (p ≥ 0.05) — the positive and negative ranks are too balanced to conclude a systematic shift.`}
        </div>
      </div>

      <p className="text-[10px] text-slate-400">
        The normal approximation is used here (valid for n ≥ ~10). For small n, use an exact table.
        Under H₀, W has mean n(n+1)/4 = {mu.toFixed(1)} and SD = {sigma.toFixed(2)}.
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function WilcoxonWalkthrough() {
  const [datasetId, setDatasetId] = useState("sleep");
  const [step, setStep] = useState(0);

  const dataset = DATASETS.find(d => d.id === datasetId)!;
  const rows = useMemo(() => buildRows(dataset.before, dataset.after), [dataset]);
  const stats = useMemo(() => computeStats(rows), [rows]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Wilcoxon Signed-Rank — Step-by-Step
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
        <div className="text-sm font-bold text-slate-800">{STEPS[step].title}</div>
      </div>

      {/* Step content */}
      <div className="px-5 pb-5">
        {step === 0 && <Step0 rows={rows} unit={dataset.unit} />}
        {step === 1 && <Step1 rows={rows} />}
        {step === 2 && <Step2 rows={rows} />}
        {step === 3 && <Step3 rows={rows} stats={stats} />}
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
