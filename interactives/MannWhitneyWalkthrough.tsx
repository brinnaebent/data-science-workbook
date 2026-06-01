"use client";

import { useState, useMemo } from "react";

// ── Datasets ───────────────────────────────────────────────────────────────────

interface Dataset {
  id: string;
  label: string;
  description: string;
  groupA: number[];
  groupB: number[];
  labelA: string;
  labelB: string;
  unit: string;
}

const DATASETS: Dataset[] = [
  {
    id: "reaction",
    label: "Reaction times",
    description: "Control vs. treatment group. Strongly skewed — clear separation between groups.",
    groupA: [220, 235, 198, 242, 215, 228, 205, 249, 210, 231],
    groupB: [195, 201, 188, 212, 193, 204, 186, 208, 197, 200],
    labelA: "Control",
    labelB: "Treatment",
    unit: "ms",
  },
  {
    id: "ratings",
    label: "Satisfaction ratings",
    description: "Ordinal 1–5 ratings before and after a product update. Ranks are more appropriate than means.",
    groupA: [3, 4, 3, 5, 2, 4, 3, 4, 3, 5],
    groupB: [4, 5, 4, 5, 3, 5, 4, 5, 4, 5],
    labelA: "Before update",
    labelB: "After update",
    unit: "/5",
  },
  {
    id: "nodiff",
    label: "No real difference",
    description: "Two groups drawn from the same distribution — test should not reject H₀.",
    groupA: [45, 52, 48, 55, 50, 47, 53, 49, 51, 46],
    groupB: [47, 50, 52, 44, 53, 48, 51, 46, 55, 49],
    labelA: "Group A",
    labelB: "Group B",
    unit: "pts",
  },
];

// ── Math ───────────────────────────────────────────────────────────────────────

interface CombinedRow {
  value: number;
  group: "A" | "B";
  origIndex: number;
  rank: number;
}

function buildCombined(groupA: number[], groupB: number[]): CombinedRow[] {
  const combined: CombinedRow[] = [
    ...groupA.map((v, i) => ({ value: v, group: "A" as const, origIndex: i, rank: 0 })),
    ...groupB.map((v, i) => ({ value: v, group: "B" as const, origIndex: i, rank: 0 })),
  ].sort((a, b) => a.value - b.value);

  const n = combined.length;
  for (let i = 0; i < n; ) {
    let j = i;
    while (j < n && combined[j].value === combined[i].value) j++;
    const r = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) combined[k].rank = r;
    i = j;
  }
  return combined;
}

function computeStats(combined: CombinedRow[], na: number, nb: number) {
  const Ra = combined.filter(r => r.group === "A").reduce((s, r) => s + r.rank, 0);
  const Rb = combined.filter(r => r.group === "B").reduce((s, r) => s + r.rank, 0);
  const Ua = Ra - (na * (na + 1)) / 2;
  const Ub = nb * na - Ua;
  const U = Math.min(Ua, Ub);
  const mu = (na * nb) / 2;
  const sigma = Math.sqrt((na * nb * (na + nb + 1)) / 12);
  const z = (U - mu) / sigma;
  const cdf = normalCDF(z);
  const p = 2 * Math.min(cdf, 1 - cdf);
  return { Ra, Rb, Ua, Ub, U, mu, sigma, z, p };
}

function normalCDF(z: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const val = 1 - poly * Math.exp(-z * z);
  return z >= 0 ? 1 - val : val;
}

// ── Steps ──────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 0, short: "Combine & rank" },
  { id: 1, short: "Sum ranks" },
  { id: 2, short: "U & p-value" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="font-mono text-xs font-bold text-indigo-600">
      {rank % 1 === 0 ? rank : rank.toFixed(1)}
    </span>
  );
}

function GroupDot({ group }: { group: "A" | "B" }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${group === "A" ? "bg-indigo-400" : "bg-sky-400"}`} />
  );
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
  combined,
  labelA,
  labelB,
  unit,
}: {
  combined: CombinedRow[];
  labelA: string;
  labelB: string;
  unit: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-600 mb-3">
        Pool all observations from both groups into one list and sort them from smallest to largest.
        Assign <strong>ranks 1, 2, 3…</strong> to each value. When two values tie, average their
        ranks.
      </p>

      {/* Rank strip visualization */}
      <div className="mb-4">
        <div className="text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
          Combined ranking (low → high)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {combined.map((row, i) => (
            <div
              key={i}
              className={`flex flex-col items-center rounded-md px-2 py-1.5 border text-[10px] ${
                row.group === "A"
                  ? "border-indigo-200 bg-indigo-50"
                  : "border-sky-200 bg-sky-50"
              }`}
            >
              <span className={`font-semibold ${row.group === "A" ? "text-indigo-700" : "text-sky-700"}`}>
                {row.value}{unit}
              </span>
              <span className="text-slate-400 mt-0.5">rank</span>
              <span className={`font-bold font-mono ${row.group === "A" ? "text-indigo-600" : "text-sky-600"}`}>
                {row.rank % 1 === 0 ? row.rank : row.rank.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-1.5 px-2 text-slate-400 font-semibold">Position</th>
              <th className="text-left py-1.5 px-2 text-slate-400 font-semibold">Group</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">Value ({unit})</th>
              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">Rank</th>
            </tr>
          </thead>
          <tbody>
            {combined.map((row, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-1.5 px-2 text-slate-400">{i + 1}</td>
                <td className="py-1.5 px-2">
                  <GroupDot group={row.group} />
                  <span className={row.group === "A" ? "text-indigo-700" : "text-sky-700"}>
                    {row.group === "A" ? labelA : labelB}
                  </span>
                </td>
                <td className="py-1.5 px-2 text-right font-mono text-slate-700">{row.value}</td>
                <td className="py-1.5 px-2 text-right">
                  <RankBadge rank={row.rank} />
                  {row.rank % 1 !== 0 && (
                    <span className="ml-1 text-[9px] text-slate-400">(avg tie)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Step1({
  combined,
  Ra,
  Rb,
  na,
  nb,
  labelA,
  labelB,
  unit,
}: {
  combined: CombinedRow[];
  Ra: number;
  Rb: number;
  na: number;
  nb: number;
  labelA: string;
  labelB: string;
  unit: string;
}) {
  const maxR = Math.max(Ra, Rb, 1);

  return (
    <div>
      <p className="text-xs text-slate-600 mb-3">
        Add up the ranks belonging to each group separately. A group whose values tend to be larger
        will accumulate higher ranks and a larger rank sum.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {(
          [
            { group: "A" as const, label: labelA, R: Ra, color: "indigo" },
            { group: "B" as const, label: labelB, R: Rb, color: "sky" },
          ] as const
        ).map(({ group, label, R, color }) => {
          const rows = combined.filter(r => r.group === group);
          return (
            <div
              key={group}
              className={`rounded-lg border px-3 py-3 ${
                color === "indigo" ? "border-indigo-200 bg-indigo-50" : "border-sky-200 bg-sky-50"
              }`}
            >
              <div className={`text-[11px] font-bold mb-2 ${color === "indigo" ? "text-indigo-700" : "text-sky-700"}`}>
                Group {group}: {label}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {rows.map((r, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                      color === "indigo"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {r.value}{unit} → {r.rank % 1 === 0 ? r.rank : r.rank.toFixed(1)}
                  </span>
                ))}
              </div>
              <div className={`text-xs font-bold border-t pt-2 mt-1 ${color === "indigo" ? "border-indigo-200 text-indigo-800" : "border-sky-200 text-sky-800"}`}>
                R{group} = {rows.map(r => r.rank % 1 === 0 ? r.rank : r.rank.toFixed(1)).join(" + ")} = {R % 1 === 0 ? R : R.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar comparison */}
      <div className="space-y-2">
        {[
          { label: `R_A (${labelA})`, value: Ra, color: "bg-indigo-400" },
          { label: `R_B (${labelB})`, value: Rb, color: "bg-sky-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="text-[10px] text-slate-500 w-36 shrink-0">{label}</div>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / maxR) * 100}%` }} />
            </div>
            <span className="text-xs font-bold font-mono text-slate-700 w-10 text-right">
              {value % 1 === 0 ? value : value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-2">
        Check: R_A + R_B = {Ra + Rb} = n(n+1)/2 = {((na + nb) * (na + nb + 1)) / 2}
      </p>
    </div>
  );
}

function Step2({
  Ua,
  Ub,
  U,
  mu,
  sigma,
  z,
  p,
  na,
  nb,
  Ra,
  Rb,
  labelA,
  labelB,
}: {
  Ua: number;
  Ub: number;
  U: number;
  mu: number;
  sigma: number;
  z: number;
  p: number;
  na: number;
  nb: number;
  Ra: number;
  Rb: number;
  labelA: string;
  labelB: string;
}) {
  const sig = p < 0.05;
  const maxU = Math.max(Ua, Ub, 1);

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-600">
        Convert rank sums to <strong>U statistics</strong> using the formula below. U counts how
        many times a Group A value beats a Group B value across all pairwise comparisons.{" "}
        <strong>W = min(U_A, U_B)</strong> — small values mean one group consistently dominates.
      </p>

      {/* Formula box */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs space-y-1.5 font-mono text-slate-700">
        <div>U_A = R_A − n_A(n_A+1)/2 = {Ra % 1 === 0 ? Ra : Ra.toFixed(1)} − {na}×{na + 1}/2 = <span className="text-indigo-600 font-bold">{Ua}</span></div>
        <div>U_B = n_A × n_B − U_A = {na}×{nb} − {Ua} = <span className="text-sky-600 font-bold">{Ub}</span></div>
        <div className="border-t border-slate-200 pt-1.5 mt-1.5">
          U = min(U_A, U_B) = min({Ua}, {Ub}) = <span className="text-indigo-700 font-bold">{U}</span>
        </div>
      </div>

      {/* U bar comparison */}
      <div className="space-y-2">
        {[
          { label: `U_A (${labelA})`, value: Ua, color: "bg-indigo-400" },
          { label: `U_B (${labelB})`, value: Ub, color: "bg-sky-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="text-[10px] text-slate-500 w-36 shrink-0">{label}</div>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / maxU) * 100}%` }} />
            </div>
            <span className="text-xs font-bold font-mono text-slate-700 w-8 text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <div className="rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Results (n_A = {na}, n_B = {nb})
          </span>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] text-slate-400">U (test stat)</div>
            <div className="text-sm font-bold font-mono text-indigo-600">{U}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Expected U (H₀)</div>
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
            ? `Reject H₀ (p < 0.05) — one group's values tend to be systematically larger than the other's.`
            : `Fail to reject H₀ (p ≥ 0.05) — the rank distributions are too similar to conclude a difference.`}
        </div>
      </div>

      <p className="text-[10px] text-slate-400">
        Under H₀, U has mean n_A×n_B/2 = {mu.toFixed(1)} and SD = {sigma.toFixed(2)}.
        Normal approximation is valid for n ≥ ~10 per group.
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function MannWhitneyWalkthrough() {
  const [datasetId, setDatasetId] = useState("reaction");
  const [step, setStep] = useState(0);

  const dataset = DATASETS.find(d => d.id === datasetId)!;
  const { groupA, groupB, labelA, labelB, unit } = dataset;

  const combined = useMemo(() => buildCombined(groupA, groupB), [groupA, groupB]);
  const stats = useMemo(
    () => computeStats(combined, groupA.length, groupB.length),
    [combined, groupA.length, groupB.length]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Mann-Whitney U — Step-by-Step
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
          {step === 0 && "Step 1 — Combine all observations and rank them"}
          {step === 1 && "Step 2 — Sum the ranks for each group"}
          {step === 2 && "Step 3 — Compute U statistics and p-value"}
        </div>
      </div>

      {/* Step content */}
      <div className="px-5 pb-5">
        {step === 0 && (
          <Step0 combined={combined} labelA={labelA} labelB={labelB} unit={unit} />
        )}
        {step === 1 && (
          <Step1
            combined={combined}
            Ra={stats.Ra}
            Rb={stats.Rb}
            na={groupA.length}
            nb={groupB.length}
            labelA={labelA}
            labelB={labelB}
            unit={unit}
          />
        )}
        {step === 2 && (
          <Step2
            Ua={stats.Ua}
            Ub={stats.Ub}
            U={stats.U}
            mu={stats.mu}
            sigma={stats.sigma}
            z={stats.z}
            p={stats.p}
            na={groupA.length}
            nb={groupB.length}
            Ra={stats.Ra}
            Rb={stats.Rb}
            labelA={labelA}
            labelB={labelB}
          />
        )}
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
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 self-center">
            Step {step + 1} of {STEPS.length}
          </span>
          <div className="flex gap-1">
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" /> Group A
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 ml-2">
              <span className="inline-block w-2 h-2 rounded-full bg-sky-400" /> Group B
            </span>
          </div>
        </div>
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
