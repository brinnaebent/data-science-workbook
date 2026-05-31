"use client";

import { useState } from "react";

type Method = "correlation" | "rfe" | "univariate";

// ─── shared data ────────────────────────────────────────────────────────────

const FEATURES = ["age", "income", "hours_worked", "education", "num_accounts", "credit_score", "debt_ratio", "gender", "hair_color"];

// Pairwise |r| matrix (upper triangle only, symmetric)
const PAIR_CORR: Record<string, Record<string, number>> = {
  age:           { income: 0.41, hours_worked: 0.38, education: 0.29, num_accounts: 0.22, credit_score: 0.31, debt_ratio: 0.18, gender: 0.05, hair_color: 0.02 },
  income:        { hours_worked: 0.87, education: 0.53, num_accounts: 0.44, credit_score: 0.51, debt_ratio: 0.39, gender: 0.08, hair_color: 0.01 },
  hours_worked:  { education: 0.21, num_accounts: 0.19, credit_score: 0.27, debt_ratio: 0.33, gender: 0.06, hair_color: 0.02 },
  education:     { num_accounts: 0.17, credit_score: 0.24, debt_ratio: 0.11, gender: 0.04, hair_color: 0.01 },
  num_accounts:  { credit_score: 0.36, debt_ratio: 0.28, gender: 0.07, hair_color: 0.03 },
  credit_score:  { debt_ratio: 0.42, gender: 0.09, hair_color: 0.01 },
  debt_ratio:    { gender: 0.06, hair_color: 0.02 },
  gender:        { hair_color: 0.04 },
  hair_color:    {},
};

function getPairCorr(a: string, b: string): number {
  return PAIR_CORR[a]?.[b] ?? PAIR_CORR[b]?.[a] ?? 0;
}

// Target correlation for each feature (|r| with target variable)
const TARGET_CORR: Record<string, number> = {
  age: 0.71, income: 0.65, hours_worked: 0.63, education: 0.54,
  num_accounts: 0.44, credit_score: 0.38, debt_ratio: 0.21, gender: 0.11, hair_color: 0.03,
};

// Univariate MI scores
const UNIV_SCORE: Record<string, number> = {
  age: 0.68, income: 0.61, hours_worked: 0.59, education: 0.52,
  num_accounts: 0.41, credit_score: 0.35, debt_ratio: 0.19, gender: 0.09, hair_color: 0.02,
};

// RFE rounds: each round lists which feature is dropped and remaining importances
const RFE_ROUNDS: { dropped: string; importances: Record<string, number> }[] = [
  { dropped: "hair_color", importances: { age: 0.21, income: 0.19, hours_worked: 0.17, education: 0.13, num_accounts: 0.11, credit_score: 0.09, debt_ratio: 0.06, gender: 0.03, hair_color: 0.01 } },
  { dropped: "gender",     importances: { age: 0.22, income: 0.20, hours_worked: 0.18, education: 0.14, num_accounts: 0.12, credit_score: 0.09, debt_ratio: 0.07, gender: 0.03 } },
  { dropped: "debt_ratio", importances: { age: 0.23, income: 0.21, hours_worked: 0.19, education: 0.15, num_accounts: 0.12, credit_score: 0.10, debt_ratio: 0.08 } },
  { dropped: "credit_score", importances: { age: 0.25, income: 0.23, hours_worked: 0.20, education: 0.16, num_accounts: 0.13, credit_score: 0.08 } },
];
// After 4 rounds, remaining 5 are kept: age, income, hours_worked, education, num_accounts
const RFE_FINAL_KEPT = new Set(["age", "income", "hours_worked", "education", "num_accounts"]);

const CORR_THRESHOLD = 0.8;
const TOP_K = 5;

// ─── Correlation tab ─────────────────────────────────────────────────────────

type CellState = "idle" | "scanning" | "flagged" | "removed" | "kept";

function CorrelationView() {
  // Steps: 0 = idle matrix, 1..n = scanning each pair, final = result
  const pairs: [string, string][] = [];
  for (let i = 0; i < FEATURES.length; i++)
    for (let j = i + 1; j < FEATURES.length; j++)
      pairs.push([FEATURES[i], FEATURES[j]]);

  const highPairs = pairs.filter(([a, b]) => getPairCorr(a, b) >= CORR_THRESHOLD);
  // Decide which to remove: for each high pair, remove the one with lower target corr
  const removed = new Set<string>();
  for (const [a, b] of highPairs) {
    const toRemove = TARGET_CORR[a] < TARGET_CORR[b] ? a : b;
    removed.add(toRemove);
  }

  const totalSteps = 1 + highPairs.length; // 1 = show matrix, then one step per flagged pair, then final
  const [step, setStep] = useState(0);

  const showMatrix = step >= 1;
  const flaggedPairs = highPairs.slice(0, Math.max(0, step - 1));
  const showResult = step > highPairs.length;

  function cellColor(a: string, b: string): string {
    if (a === b) return "bg-slate-100 text-slate-300";
    const r = getPairCorr(a, b);
    const isFlagged = flaggedPairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
    if (isFlagged) return "bg-red-100 text-red-700 font-bold ring-1 ring-red-300";
    if (r >= 0.7) return "bg-violet-100 text-violet-700";
    if (r >= 0.4) return "bg-violet-50 text-violet-500";
    return "bg-white text-slate-400";
  }

  const stepLabels = [
    "Show correlation matrix",
    ...highPairs.map(([a, b]) => `Flag ${a} ↔ ${b} (r = ${getPairCorr(a, b).toFixed(2)})`),
    "Apply threshold → drop redundant features",
  ];

  return (
    <div className="space-y-4">
      {/* Step navigator */}
      <div className="flex items-center gap-3 flex-wrap">
        {stepLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            className={`px-2.5 py-1 rounded text-xs border transition-all ${
              step === i + 1
                ? "bg-violet-100 border-violet-300 text-violet-700 font-semibold"
                : step > i + 1
                ? "bg-violet-50 border-violet-200 text-violet-400"
                : "bg-white border-slate-200 text-slate-400"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {!showMatrix && (
        <p className="text-xs text-slate-400 italic">Press step 1 to begin.</p>
      )}

      {/* Matrix */}
      {showMatrix && (
        <div className="overflow-x-auto">
          <table className="text-[11px] border-collapse">
            <thead>
              <tr>
                <th className="w-24" />
                {FEATURES.map((f) => (
                  <th key={f} className={`px-1 py-1 font-mono font-semibold text-center w-20 ${showResult && removed.has(f) ? "line-through text-slate-300" : "text-slate-500"}`}>
                    {f.replace("_", "_​")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((row) => (
                <tr key={row}>
                  <td className={`pr-2 font-mono font-semibold text-right text-[11px] ${showResult && removed.has(row) ? "line-through text-slate-300" : "text-slate-600"}`}>
                    {row}
                  </td>
                  {FEATURES.map((col) => {
                    const r = row === col ? null : getPairCorr(row, col);
                    return (
                      <td key={col} className={`text-center px-1 py-0.5 rounded text-[11px] ${cellColor(row, col)}`}>
                        {r !== null ? r.toFixed(2) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Flagged pairs */}
      {flaggedPairs.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pairs above threshold (r ≥ {CORR_THRESHOLD})</p>
          {flaggedPairs.map(([a, b]) => {
            const toRemove = TARGET_CORR[a] < TARGET_CORR[b] ? a : b;
            const toKeep = toRemove === a ? b : a;
            return (
              <div key={`${a}-${b}`} className="flex items-center gap-2 text-xs">
                <span className="font-mono text-violet-700 font-semibold">{a}</span>
                <span className="text-red-400 font-bold">↔</span>
                <span className="font-mono text-violet-700 font-semibold">{b}</span>
                <span className="text-slate-400">r = {getPairCorr(a, b).toFixed(2)}</span>
                {showResult && (
                  <span className="text-slate-500">
                    → keep <span className="font-mono font-semibold text-violet-600">{toKeep}</span>
                    <span className="text-slate-400"> (target r = {TARGET_CORR[toKeep].toFixed(2)})</span>
                    , drop <span className="font-mono line-through text-red-400">{toRemove}</span>
                    <span className="text-slate-400"> (target r = {TARGET_CORR[toRemove].toFixed(2)})</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div className="rounded-lg bg-violet-50 border border-violet-200 px-4 py-3">
          <p className="text-xs font-semibold text-violet-700 mb-2">Kept features ({FEATURES.length - removed.size})</p>
          <div className="flex flex-wrap gap-2">
            {FEATURES.filter((f) => !removed.has(f)).map((f) => (
              <span key={f} className="px-2 py-0.5 rounded bg-violet-100 border border-violet-200 text-violet-700 text-xs font-mono font-semibold">{f}</span>
            ))}
            {[...removed].map((f) => (
              <span key={f} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-400 text-xs font-mono line-through">{f}</span>
            ))}
          </div>
          <p className="text-xs text-violet-600 mt-2 leading-relaxed">No minimum-feature cutoff — correlation selection removes redundancy, not weak features. hair_color and gender survive because nothing is correlated with them above the threshold.</p>
        </div>
      )}
    </div>
  );
}

// ─── RFE tab ─────────────────────────────────────────────────────────────────

function RFEView() {
  const [round, setRound] = useState(0); // 0 = before any rounds

  const currentRound = RFE_ROUNDS[round - 1];
  const importances = round === 0
    ? RFE_ROUNDS[0].importances  // show initial importances
    : currentRound.importances;

  const droppedSoFar = new Set(RFE_ROUNDS.slice(0, round).map((r) => r.dropped));
  const remaining = FEATURES.filter((f) => !droppedSoFar.has(f));
  const isDone = round >= RFE_ROUNDS.length;

  const maxImp = Math.max(...Object.values(importances));

  return (
    <div className="space-y-4">
      {/* Round controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Round</span>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((r) => (
            <button
              key={r}
              onClick={() => setRound(r)}
              className={`w-8 h-8 rounded text-xs font-semibold border transition-all ${
                round === r
                  ? "bg-sky-100 border-sky-300 text-sky-700"
                  : r < round
                  ? "bg-sky-50 border-sky-200 text-sky-400"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              {r === 0 ? "0" : r}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          {round === 0 && "Initial — all features, first model trained"}
          {round > 0 && round < RFE_ROUNDS.length && `After round ${round}: dropped ${RFE_ROUNDS[round - 1].dropped}`}
          {isDone && "Done — 5 features remain"}
        </span>
      </div>

      {/* Feature importance bars */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {round === 0 ? "Feature importances (initial model)" : `Feature importances after round ${round}`}
        </p>
        {FEATURES.map((f) => {
          const dropped = droppedSoFar.has(f);
          const isJustDropped = round > 0 && RFE_ROUNDS[round - 1].dropped === f;
          const imp = importances[f] ?? 0;
          const width = `${(imp / maxImp) * 100}%`;

          return (
            <div key={f} className={`flex items-center gap-3 rounded-lg px-3 py-2 border transition-all ${
              isJustDropped
                ? "bg-red-50 border-red-200"
                : dropped
                ? "bg-slate-50 border-slate-100 opacity-40"
                : "bg-sky-50 border-sky-100"
            }`}>
              <span className={`w-28 shrink-0 text-xs font-mono font-semibold ${
                isJustDropped ? "text-red-500 line-through" : dropped ? "text-slate-300" : "text-sky-700"
              }`}>{f}</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isJustDropped ? "bg-red-300" : dropped ? "bg-slate-200" : "bg-sky-400"
                  }`}
                  style={{ width: dropped && !isJustDropped ? "0%" : width }}
                />
              </div>
              <span className={`w-12 text-right text-xs font-mono shrink-0 ${
                isJustDropped ? "text-red-400" : dropped ? "text-slate-300" : "text-sky-600"
              }`}>
                {dropped && !isJustDropped ? "—" : imp.toFixed(2)}
              </span>
              {isJustDropped && (
                <span className="text-xs text-red-500 font-semibold shrink-0">← dropped</span>
              )}
              {!dropped && !isJustDropped && isDone && (
                <span className="text-xs text-sky-500 font-semibold shrink-0">kept</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation of this round */}
      {round > 0 && (
        <div className="rounded-lg bg-sky-50 border border-sky-200 px-4 py-2.5 text-xs text-sky-700 leading-relaxed">
          <span className="font-semibold">Round {round}:</span> Model retrained on {remaining.length + 1} features.
          The weakest by importance is <span className="font-mono font-semibold">{RFE_ROUNDS[round - 1].dropped}</span> (importance {importances[RFE_ROUNDS[round - 1].dropped]?.toFixed(2)}) — eliminated.
          {round === 3 && (
            <span> Note how <span className="font-mono font-semibold">debt_ratio</span> survives longer than univariate scoring would predict — the model sees its interaction with income.</span>
          )}
        </div>
      )}

      {isDone && (
        <div className="rounded-lg bg-sky-50 border border-sky-200 px-4 py-3">
          <p className="text-xs font-semibold text-sky-700 mb-2">Final 5 features kept</p>
          <div className="flex flex-wrap gap-2">
            {[...RFE_FINAL_KEPT].map((f) => (
              <span key={f} className="px-2 py-0.5 rounded bg-sky-100 border border-sky-200 text-sky-700 text-xs font-mono font-semibold">{f}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Univariate tab ───────────────────────────────────────────────────────────

function UnivariateView() {
  const [revealed, setRevealed] = useState(0); // how many features scored so far
  const [cutoffApplied, setCutoffApplied] = useState(false);

  const sorted = [...FEATURES].sort((a, b) => UNIV_SCORE[b] - UNIV_SCORE[a]);
  const maxScore = Math.max(...Object.values(UNIV_SCORE));

  function handleScore() {
    if (revealed < FEATURES.length) setRevealed((r) => r + 1);
    else setCutoffApplied(true);
  }

  const buttonLabel =
    revealed === 0 ? "Score first feature →"
    : revealed < FEATURES.length ? `Score next feature → (${revealed}/${FEATURES.length})`
    : !cutoffApplied ? "Apply top-5 cutoff →"
    : "Done";

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500 leading-relaxed">
        Each feature is scored <span className="font-semibold">independently</span> against the target using mutual information. Features never see each other.
      </p>

      {/* Score button */}
      <button
        onClick={handleScore}
        disabled={cutoffApplied}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {buttonLabel}
      </button>

      {/* Feature list appearing one at a time */}
      <div className="space-y-1.5">
        {sorted.map((f, i) => {
          if (i >= revealed) return null;
          const score = UNIV_SCORE[f];
          const kept = cutoffApplied ? i < TOP_K : null;

          return (
            <div
              key={f}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 border transition-all ${
                kept === true
                  ? "bg-emerald-50 border-emerald-200"
                  : kept === false
                  ? "bg-slate-50 border-slate-100 opacity-50"
                  : "bg-emerald-50 border-emerald-100"
              }`}
            >
              <span className={`w-5 shrink-0 text-xs text-center font-mono text-slate-400`}>#{i + 1}</span>
              <span className={`w-28 shrink-0 text-xs font-mono font-semibold ${kept === false ? "text-slate-400" : "text-emerald-700"}`}>{f}</span>

              {/* Score bar */}
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${kept === false ? "bg-slate-300" : "bg-emerald-400"}`}
                  style={{ width: `${(score / maxScore) * 100}%` }}
                />
              </div>
              <span className={`w-10 text-right text-xs font-mono shrink-0 ${kept === false ? "text-slate-400" : "text-emerald-600"}`}>{score.toFixed(2)}</span>

              {cutoffApplied && (
                <span className={`text-xs font-semibold shrink-0 w-10 text-right ${kept ? "text-emerald-500" : "text-slate-400"}`}>
                  {kept ? "kept" : "drop"}
                </span>
              )}

              {/* Highlight debt_ratio's blind spot */}
              {f === "debt_ratio" && cutoffApplied && !kept && (
                <span className="text-[10px] text-amber-600 font-medium shrink-0 ml-1">↑ interacts w/ income</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Cutoff explanation */}
      {cutoffApplied && (
        <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-2.5 text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">Blind spot:</span> debt_ratio scored 0.19 alone and was dropped.
          But it interacts with income — when both are present, they jointly predict the target better than either alone.
          Univariate scoring never sees this. RFE would have caught it.
        </div>
      )}
    </div>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────

const METHOD_ORDER: Method[] = ["correlation", "rfe", "univariate"];
const METHOD_META: Record<Method, { label: string; color: string; bg: string; border: string; tagline: string }> = {
  correlation: { label: "Correlation filter",   color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200", tagline: "Scan pairwise correlations, remove redundant duplicates" },
  rfe:         { label: "RFE",                  color: "text-sky-700",    bg: "bg-sky-50",    border: "border-sky-200",    tagline: "Train → rank → remove weakest → repeat" },
  univariate:  { label: "Univariate scoring",   color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200",tagline: "Score each feature alone against the target" },
};

export default function FeatureSelectionComparison() {
  const [active, setActive] = useState<Method>("correlation");
  const meta = METHOD_META[active];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Feature Selection Methods</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 pt-4 pb-3 border-b border-slate-100">
        {METHOD_ORDER.map((m) => {
          const mm = METHOD_META[m];
          const isActive = active === m;
          return (
            <button
              key={m}
              onClick={() => setActive(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isActive
                  ? `${mm.bg} ${mm.border} ${mm.color}`
                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
              }`}
            >
              {mm.label}
            </button>
          );
        })}
      </div>

      {/* Tagline */}
      <div className={`mx-5 mt-4 mb-3 rounded-lg ${meta.bg} ${meta.border} border px-4 py-2`}>
        <p className={`text-xs font-medium ${meta.color}`}>{meta.tagline}</p>
      </div>

      {/* Method panel */}
      <div className="px-5 pb-5">
        {active === "correlation" && <CorrelationView key="corr" />}
        {active === "rfe"         && <RFEView key="rfe" />}
        {active === "univariate"  && <UnivariateView key="uni" />}
      </div>
    </div>
  );
}
