"use client";

import { useState } from "react";

type Classification = "MCAR" | "MAR" | "MNAR" | null;

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

interface Answer {
  [questionId: string]: string;
}

const QUESTIONS: Question[] = [
  {
    id: "correlation",
    text: "Does the missingness correlate with other observed columns?",
    options: [
      { label: "No — it seems random across all groups", value: "no" },
      { label: "Yes — it varies by values in another column", value: "yes_other" },
      { label: "Unclear / not sure", value: "unclear" },
    ],
  },
  {
    id: "self",
    text: "Could the missing value itself drive whether it's recorded?",
    options: [
      { label: "No — the value wouldn't influence reporting", value: "no" },
      { label: "Yes — extreme or sensitive values probably go unreported", value: "yes" },
      { label: "Unlikely but possible", value: "maybe" },
    ],
  },
  {
    id: "rate",
    text: "What fraction of values in this column are missing?",
    options: [
      { label: "Under 5%", value: "low" },
      { label: "5–30%", value: "medium" },
      { label: "Over 30%", value: "high" },
    ],
  },
  {
    id: "mechanism",
    text: "What's the most plausible cause of missingness?",
    options: [
      { label: "Random sensor failure / data entry glitch", value: "random" },
      { label: "A subgroup systematically skips this field", value: "subgroup" },
      { label: "People avoid reporting uncomfortable answers", value: "sensitive" },
      { label: "Unknown", value: "unknown" },
    ],
  },
];

function classify(answers: Answer): Classification {
  if (Object.keys(answers).length < QUESTIONS.length) return null;

  const { correlation, self, mechanism } = answers;

  // MNAR: value drives its own missingness
  if (self === "yes" || mechanism === "sensitive") return "MNAR";

  // MAR: correlates with other observed variables
  if (correlation === "yes_other" || mechanism === "subgroup") return "MAR";

  // MCAR: genuinely random
  if (
    (correlation === "no" || correlation === "unclear") &&
    self === "no" &&
    (mechanism === "random" || mechanism === "unknown")
  )
    return "MCAR";

  // Fallback lean
  if (self === "maybe") return "MNAR";
  return "MAR";
}

const RESULT_CONFIG: Record<
  NonNullable<Classification>,
  {
    label: string;
    tagColor: string;
    borderColor: string;
    bgColor: string;
    description: string;
    strategy: string[];
    warning: string | null;
  }
> = {
  MCAR: {
    label: "Missing Completely At Random",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    borderColor: "border-emerald-200",
    bgColor: "bg-emerald-50",
    description:
      "Missingness appears independent of all other variables — essentially a random coin flip. This is the easiest case to handle.",
    strategy: [
      "If < 5%: drop affected rows or fill with mean / median / mode.",
      "For time series: use forward-fill or back-fill.",
      "Verify: missingness should not correlate with any other column.",
    ],
    warning: null,
  },
  MAR: {
    label: "Missing At Random",
    tagColor: "bg-violet-100 text-violet-800 border-violet-200",
    borderColor: "border-violet-200",
    bgColor: "bg-violet-50",
    description:
      "Missingness is associated with values in other observed columns. Simple fills will introduce bias unless they condition on those related variables.",
    strategy: [
      "Use model-based imputation (e.g., regression, k-NN, MICE) conditioned on the correlated columns.",
      "If > 60% of values are missing, consider dropping the feature entirely.",
      "Test for MAR by checking whether missingness rate differs across subgroups of related columns.",
    ],
    warning: "Mean / median imputation will give unreliable results here.",
  },
  MNAR: {
    label: "Missing Not At Random",
    tagColor: "bg-rose-100 text-rose-800 border-rose-200",
    borderColor: "border-rose-200",
    bgColor: "bg-rose-50",
    description:
      "Missingness depends on the unobserved value itself (e.g., very high incomes go unreported). No imputation method can reliably recover the true distribution.",
    strategy: [
      "Primary fix: revisit the data collection mechanism to reduce systematic non-response.",
      "If imputation is unavoidable, use sensitivity analysis and document the limitation.",
      "Add a binary indicator column (is_missing) so downstream models can learn the missingness pattern.",
    ],
    warning:
      "Imputation cannot reliably fix MNAR. The missing values are systematically different from the observed ones.",
  },
};

export default function MissingnessClassifier() {
  const [answers, setAnswers] = useState<Answer>({});

  function handleSelect(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function reset() {
    setAnswers({});
  }

  const result = classify(answers);
  const config = result ? RESULT_CONFIG[result] : null;
  const answered = Object.keys(answers).length;
  const total = QUESTIONS.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Missingness Classifier
        </span>
        {answered > 0 && (
          <button
            onClick={reset}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Questions */}
      <div className="divide-y divide-slate-100">
        {QUESTIONS.map((q, qi) => {
          const selected = answers[q.id];
          const isAnswered = selected !== undefined;
          return (
            <div key={q.id} className="p-5">
              <p className="text-sm font-medium text-slate-700 mb-3">
                <span className="inline-block mr-2 w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold text-center leading-5">
                  {qi + 1}
                </span>
                {q.text}
              </p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const active = selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(q.id, opt.value)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                        active
                          ? "bg-indigo-50 border-indigo-300 text-indigo-800 font-medium"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="px-5 py-2 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-400 transition-all duration-300"
              style={{ width: `${(answered / total) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {answered}/{total}
          </span>
        </div>
      </div>

      {/* Result */}
      {config && result && (
        <div className={`border-t-2 ${config.borderColor}`}>
          <div className={`px-5 py-4 ${config.bgColor}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-1 rounded border text-sm font-bold font-mono ${config.tagColor}`}>
                {result}
              </span>
              <span className="text-sm font-semibold text-slate-700">{config.label}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{config.description}</p>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Recommended Strategy
              </p>
              {config.strategy.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  {s}
                </div>
              ))}
            </div>

            {config.warning && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-amber-500 mt-0.5 shrink-0"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-xs text-amber-800 leading-relaxed">{config.warning}</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-emerald-100 border border-emerald-200" />
              MCAR — drop or simple fill
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-violet-100 border border-violet-200" />
              MAR — model imputation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-rose-100 border border-rose-200" />
              MNAR — fix collection
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
