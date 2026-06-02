"use client";

import { useState } from "react";

interface ChecklistItem {
  id: number;
  label: string;
  detail: string;
}

const ITEMS: ChecklistItem[] = [
  {
    id: 1,
    label: "Is the metric appropriate?",
    detail: "For imbalanced classification, accuracy lies. For regression with outliers, MSE may overweight them. Match the metric to the problem.",
  },
  {
    id: 2,
    label: "Goodness-of-fit, with complexity in mind.",
    detail: "R² alone isn't enough. Report AIC or BIC when comparing models of different complexity.",
  },
  {
    id: 3,
    label: "Residual analysis.",
    detail: "Look at residual plots. Check normality. Check homoscedasticity. Fix problems you find before trusting coefficients.",
  },
  {
    id: 4,
    label: "Confidence intervals.",
    detail: "Don't just report point estimates. Quantify uncertainty.",
  },
  {
    id: 5,
    label: "Subgroup analysis.",
    detail: "Look for Simpson's Paradox. Check whether your model's performance is consistent across important subgroups — fairness considerations live here too.",
  },
  {
    id: 6,
    label: "Cross-validation.",
    detail: "Single-split evaluation is noisy. K-fold cross-validation gives you a distribution of performance estimates.",
  },
  {
    id: 7,
    label: "Statistical significance on model comparisons.",
    detail: "When you claim Model A beats Model B, can you back it up? Use a paired test on cross-validation fold performance, with Bonferroni correction if testing many models.",
  },
  {
    id: 8,
    label: "Practical significance.",
    detail: "Even if a difference is statistically significant, is it large enough to matter operationally? A 0.001 RMSE improvement after a month of engineering is statistically real and practically irrelevant.",
  },
];

export default function EvaluationChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setChecked(new Set());
  }

  const done = checked.size;
  const total = ITEMS.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Model Evaluation Checklist
        </span>
        {done > 0 && (
          <button
            onClick={reset}
            className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-slate-500">
            {done === total ? "All checks complete" : `${done} of ${total} complete`}
          </span>
          <span className={`text-[11px] font-semibold tabular-nums ${done === total ? "text-emerald-600" : "text-slate-400"}`}>
            {pct}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out bg-emerald-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <ul className="px-5 pb-5 space-y-2">
        {ITEMS.map(item => {
          const isChecked = checked.has(item.id);
          return (
            <li key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-lg border transition-colors ${
                  isChecked
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100"
                }`}
              >
                {/* Checkbox */}
                <span className={`mt-0.5 shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  isChecked ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"
                }`}>
                  {isChecked && (
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {/* Text */}
                <div className="min-w-0">
                  <div className={`text-xs font-semibold leading-snug ${isChecked ? "text-emerald-700 line-through decoration-emerald-400" : "text-slate-700"}`}>
                    {item.label}
                  </div>
                  <div className={`text-[11px] mt-0.5 leading-snug ${isChecked ? "text-emerald-600/70" : "text-slate-500"}`}>
                    {item.detail}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Completion banner */}
      {done === total && (
        <div className="mx-5 mb-5 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium text-center">
          Your model evaluation is thorough. Ship with confidence.
        </div>
      )}
    </div>
  );
}
