"use client";

import { useState } from "react";

type StepId =
  | "partition"
  | "eda"
  | "scaler_fit"
  | "feature_eng"
  | "model_train"
  | "eval";

interface Step {
  id: StepId;
  label: string;
  code: string;
  leaks: boolean;
  leakType: string | null;
  fix: string | null;
  explanation: string;
}

const STEPS: Step[] = [
  {
    id: "partition",
    label: "1. Split the dataset",
    code: `# Only two splits — no validation set\nX_train, X_test, y_train, y_test =\n  train_test_split(X, y, test_size=0.2,\n                   random_state=42)`,
    leaks: true,
    leakType: "Hyperparameter tuning leak",
    fix: `# Three-way split: train / val / test\nX_tmp, X_test, y_tmp, y_test =\n  train_test_split(X, y, test_size=0.2,\n                   random_state=42)\nX_train, X_val, y_train, y_val =\n  train_test_split(X_tmp, y_tmp, test_size=0.25,\n                   random_state=42)\n# Result: 60 % train / 20 % val / 20 % test`,
    explanation:
      "With only two splits you have nowhere to tune hyperparameters except the test set — which makes it a de facto validation set and breaks the one-evaluation guarantee. The fix: carve out a separate validation split from training data so the test set stays untouched until the very last step.",
  },
  {
    id: "eda",
    label: "2. Exploratory data analysis",
    code: `# Compute summary stats on full dataset\nprint(df.describe())\ncorr = df.corr()\nsns.heatmap(corr)`,
    leaks: true,
    leakType: "EDA leak",
    fix: `# Compute summary stats on training data only\nprint(df_train.describe())\ncorr = df_train.corr()\nsns.heatmap(corr)`,
    explanation:
      "Running EDA on the full dataset — including test rows — can subtly influence feature-engineering and modeling decisions. You should lock away the test set before looking at the data.",
  },
  {
    id: "scaler_fit",
    label: "3. Normalize features",
    code: `scaler = StandardScaler()\n# Fit on ALL data, then transform\nX_scaled = scaler.fit_transform(X)\nX_train_s = X_scaled[train_idx]\nX_test_s  = X_scaled[test_idx]`,
    leaks: true,
    leakType: "Preprocessing leak",
    fix: `scaler = StandardScaler()\n# Fit ONLY on training data\nX_train_s = scaler.fit_transform(X_train)\nX_test_s  = scaler.transform(X_test)`,
    explanation:
      "StandardScaler.fit() computes the mean and standard deviation of every column. Fitting on the full dataset incorporates test-set statistics — the model has implicitly \"seen\" the test distribution.",
  },
  {
    id: "feature_eng",
    label: "4. Engineer a customer feature",
    code: `# Average order value per customer\n# computed across ALL rows\ndf['avg_order'] = df.groupby('customer_id')\\\n  ['order_value'].transform('mean')`,
    leaks: true,
    leakType: "Feature engineering leak",
    fix: `# Compute mean only from training rows\ntrain_avg = (\n  df_train.groupby('customer_id')['order_value']\n  .mean().rename('avg_order')\n)\ndf_train = df_train.join(train_avg, on='customer_id')\ndf_test  = df_test.join(train_avg, on='customer_id')`,
    explanation:
      "Including test-set transactions in the per-customer aggregate leaks future information. The fix: compute the statistic from training rows only, then join it onto both splits.",
  },
  {
    id: "model_train",
    label: "5. Train & tune the model",
    code: `best_score = 0\nfor C in [0.01, 0.1, 1, 10]:\n  model = LogisticRegression(C=C)\n  model.fit(X_train_s, y_train)\n  score = model.score(X_test_s, y_test)\n  if score > best_score:\n    best_score, best_C = score, C`,
    leaks: true,
    leakType: "Hyperparameter tuning leak",
    fix: `# Use cross-validation on training data only\nfor C in [0.01, 0.1, 1, 10]:\n  model = LogisticRegression(C=C)\n  score = cross_val_score(\n    model, X_train_s, y_train, cv=5\n  ).mean()\n  if score > best_score:\n    best_score, best_C = score, C`,
    explanation:
      "Evaluating each hyperparameter candidate on the test set turns it into a validation set. After many comparisons the test score is optimistic — you've tuned to its noise. Use cross-validation on training data; touch the test set once.",
  },
  {
    id: "eval",
    label: "6. Final evaluation",
    code: `final_model = LogisticRegression(C=best_C)\nfinal_model.fit(X_train_s, y_train)\nprint(final_model.score(X_test_s, y_test))`,
    leaks: false,
    leakType: null,
    fix: null,
    explanation:
      "Clean — as long as earlier steps were fixed. The test set is evaluated exactly once, after all decisions are made.",
  },
];

const LEAK_COLORS: Record<string, { badge: string; bg: string; border: string; ring: string }> = {
  "EDA leak":                   { badge: "bg-amber-100 text-amber-700 border-amber-200",   bg: "bg-amber-50",  border: "border-amber-200",  ring: "ring-amber-200" },
  "Preprocessing leak":         { badge: "bg-rose-100 text-rose-700 border-rose-200",      bg: "bg-rose-50",   border: "border-rose-200",   ring: "ring-rose-200"  },
  "Feature engineering leak":   { badge: "bg-orange-100 text-orange-700 border-orange-200",bg: "bg-orange-50", border: "border-orange-200", ring: "ring-orange-200"},
  "Hyperparameter tuning leak":  { badge: "bg-violet-100 text-violet-700 border-violet-200",bg: "bg-violet-50",border: "border-violet-200", ring: "ring-violet-200"},
};

const CLEAN_STYLE = { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bg: "bg-emerald-50", border: "border-emerald-200", ring: "ring-emerald-200" };

type Reveal = "hidden" | "problem" | "fix";

export default function LeakageDetector() {
  const [reveals, setReveals] = useState<Record<StepId, Reveal>>(
    Object.fromEntries(STEPS.map((s) => [s.id, "hidden"])) as Record<StepId, Reveal>
  );

  const toggle = (id: StepId) => {
    setReveals((prev) => {
      const cur = prev[id];
      if (cur === "hidden") return { ...prev, [id]: "problem" };
      if (cur === "problem") return { ...prev, [id]: "fix" };
      return { ...prev, [id]: "hidden" };
    });
  };

  const leakCount = STEPS.filter((s) => s.leaks).length;
  const foundCount = STEPS.filter((s) => s.leaks && reveals[s.id] !== "hidden").length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Leakage Detector
        </span>
        <span className="text-xs font-mono text-slate-400">
          {foundCount} / {leakCount} leaks found
        </span>
      </div>

      {/* Instruction */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-sm text-slate-600">
          Walk through the ML pipeline below. Click each step to reveal whether it introduces data leakage — and how to fix it.
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-4">
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${(foundCount / leakCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-slate-100">
        {STEPS.map((step) => {
          const reveal = reveals[step.id];
          const style = step.leaks
            ? (LEAK_COLORS[step.leakType!] ?? CLEAN_STYLE)
            : CLEAN_STYLE;
          const isOpen = reveal !== "hidden";

          return (
            <div key={step.id} className="p-5">
              {/* Step header — always clickable */}
              <button
                onClick={() => toggle(step.id)}
                className="w-full text-left group"
              >
                <div className="flex items-center gap-3">
                  {/* Status icon */}
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold transition-colors ${
                      reveal === "hidden"
                        ? "bg-slate-100 border-slate-200 text-slate-400"
                        : reveal === "problem"
                        ? step.leaks
                          ? "bg-red-100 border-red-200 text-red-600"
                          : "bg-emerald-100 border-emerald-200 text-emerald-600"
                        : "bg-emerald-100 border-emerald-200 text-emerald-600"
                    }`}
                  >
                    {reveal === "hidden" ? "?" : step.leaks && reveal === "problem" ? "!" : "✓"}
                  </span>

                  <span className="flex-1 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                    {step.label}
                  </span>

                  {/* Leak badge (once revealed) */}
                  {isOpen && (
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${
                      step.leaks ? style.badge : CLEAN_STYLE.badge
                    }`}>
                      {step.leaks ? step.leakType : "Clean"}
                    </span>
                  )}

                  {/* Chevron */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`flex-shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="mt-4 space-y-3">
                  {/* Code block — problem code */}
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1 block">
                      {step.leaks && reveal === "fix" ? "Original (leaky)" : "Code"}
                    </span>
                    <pre
                      className={`text-xs font-mono rounded-lg p-3 border leading-relaxed overflow-x-auto ${
                        step.leaks && reveal === "problem"
                          ? `${style.bg} ${style.border} text-slate-700`
                          : step.leaks && reveal === "fix"
                          ? "bg-red-50 border-red-200 text-slate-500 line-through decoration-red-300"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {step.code}
                    </pre>
                  </div>

                  {/* Fixed code */}
                  {reveal === "fix" && step.fix && (
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-500 mb-1 block">
                        Fixed
                      </span>
                      <pre className="text-xs font-mono rounded-lg p-3 border bg-emerald-50 border-emerald-200 text-slate-700 leading-relaxed overflow-x-auto">
                        {step.fix}
                      </pre>
                    </div>
                  )}

                  {/* Explanation */}
                  <p className={`text-sm leading-relaxed rounded-lg px-3 py-2.5 border ${
                    step.leaks
                      ? `${style.bg} ${style.border} text-slate-700`
                      : `${CLEAN_STYLE.bg} ${CLEAN_STYLE.border} text-slate-700`
                  }`}>
                    {step.explanation}
                  </p>

                  {/* Click-to-reveal next hint */}
                  {step.leaks && reveal === "problem" && (
                    <button
                      onClick={() => toggle(step.id)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Show the fix →
                    </button>
                  )}
                  {step.leaks && reveal === "fix" && (
                    <button
                      onClick={() => toggle(step.id)}
                      className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Collapse
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-emerald-100 border border-emerald-200" />
          Clean step
        </span>
        {Object.entries(LEAK_COLORS).map(([label, s]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`inline-block w-3 h-3 rounded border ${s.bg} ${s.border}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
