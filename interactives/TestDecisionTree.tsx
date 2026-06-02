"use client";

import { useState } from "react";

// ── Decision tree structure ────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  hint?: string;
  yes: string; // next node id or result id
  no: string;
}

interface Result {
  id: string;
  test: string;
  description: string;
  python: string;
  color: "indigo" | "sky" | "emerald" | "amber" | "violet";
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Are you comparing groups (or testing a relationship)?",
    hint: "Group comparison = t-tests, ANOVA, Mann-Whitney. Relationship = correlation, regression.",
    yes: "q2",
    no: "result-regression",
  },
  {
    id: "q2",
    text: "Do you have only one group (comparing to a known benchmark)?",
    hint: "One group: 'Is our mean response time ≤ 200 ms?' Multiple groups: A vs. B, or A vs. B vs. C.",
    yes: "result-one-sample",
    no: "q3",
  },
  {
    id: "q3",
    text: "How many groups are you comparing?",
    hint: "Two groups → t-test family. Three or more → ANOVA family.",
    yes: "q4",   // two groups
    no: "q7",    // 3+ groups
  },
  {
    id: "q4",
    text: "Are the two groups paired (same subjects measured twice, or matched pairs)?",
    hint: "Paired: before/after on same subjects, matched A vs. B on same test folds. Independent: two separate cohorts.",
    yes: "q5",
    no: "q6",
  },
  {
    id: "q5",
    text: "Are the paired differences approximately normally distributed?",
    hint: "Check with a histogram of differences or Shapiro-Wilk. Roughly bell-shaped = yes.",
    yes: "result-paired-t",
    no: "result-wilcoxon",
  },
  {
    id: "q6",
    text: "Are both groups approximately normally distributed?",
    hint: "Use Q-Q plots or Shapiro-Wilk. If either group fails, prefer a nonparametric test.",
    yes: "result-independent-t",
    no: "result-mann-whitney",
  },
  {
    id: "q7",
    text: "Are all groups approximately normally distributed with equal variances?",
    hint: "Check normality per group (Shapiro-Wilk) and equality of variance (Levene's test).",
    yes: "result-anova",
    no: "result-kruskal",
  },
];

const RESULTS: Result[] = [
  {
    id: "result-one-sample",
    test: "One-Sample t-Test",
    description: "Compare a sample mean to a known benchmark value. Assumes the sample is approximately normally distributed.",
    python: "scipy.stats.ttest_1samp(sample, popmean=benchmark)",
    color: "indigo",
  },
  {
    id: "result-paired-t",
    test: "Paired Samples t-Test",
    description: "Tests whether the mean of paired differences is zero. Removes between-subject variability, increasing power.",
    python: "scipy.stats.ttest_rel(before, after)",
    color: "indigo",
  },
  {
    id: "result-independent-t",
    test: "Independent Samples t-Test (Welch's)",
    description: "Compares means of two independent groups. Welch's version doesn't assume equal variance — prefer it by default.",
    python: "scipy.stats.ttest_ind(a, b, equal_var=False)",
    color: "sky",
  },
  {
    id: "result-wilcoxon",
    test: "Wilcoxon Signed-Rank Test",
    description: "Nonparametric alternative to the paired t-test. Tests whether the median of paired differences is zero.",
    python: "scipy.stats.wilcoxon(before, after)",
    color: "amber",
  },
  {
    id: "result-mann-whitney",
    test: "Mann-Whitney U Test",
    description: "Nonparametric alternative to the independent t-test. Tests whether one group's values tend to rank higher.",
    python: "scipy.stats.mannwhitneyu(a, b, alternative='two-sided')",
    color: "amber",
  },
  {
    id: "result-anova",
    test: "One-Way ANOVA",
    description: "Tests whether any of 3+ group means differ significantly. Follow up significant results with post-hoc tests (Tukey HSD).",
    python: "scipy.stats.f_oneway(g1, g2, g3)",
    color: "emerald",
  },
  {
    id: "result-kruskal",
    test: "Kruskal-Wallis Test",
    description: "Nonparametric alternative to one-way ANOVA. Tests whether the rank distributions of 3+ groups are equal.",
    python: "scipy.stats.kruskal(g1, g2, g3)",
    color: "amber",
  },
  {
    id: "result-regression",
    test: "Correlation / Regression",
    description: "Use Pearson correlation for linear relationships between two continuous variables, or linear regression when predicting one from another.",
    python: "scipy.stats.pearsonr(x, y)  # or sklearn LinearRegression",
    color: "violet",
  },
];

const COLOR_MAP = {
  indigo: { border: "border-indigo-300", bg: "bg-indigo-50", text: "text-indigo-800", badge: "bg-indigo-100 text-indigo-700" },
  sky:    { border: "border-sky-300",    bg: "bg-sky-50",    text: "text-sky-800",    badge: "bg-sky-100 text-sky-700" },
  emerald:{ border: "border-emerald-300",bg: "bg-emerald-50",text: "text-emerald-800",badge: "bg-emerald-100 text-emerald-700" },
  amber:  { border: "border-amber-300",  bg: "bg-amber-50",  text: "text-amber-800",  badge: "bg-amber-100 text-amber-700" },
  violet: { border: "border-violet-300", bg: "bg-violet-50", text: "text-violet-800", badge: "bg-violet-100 text-violet-700" },
};

const Q3_LABEL = "Two groups";
const Q3_LABEL_NO = "Three or more groups";

function getQuestionById(id: string) { return QUESTIONS.find(q => q.id === id); }
function getResultById(id: string) { return RESULTS.find(r => r.id === id); }
function isResult(id: string) { return id.startsWith("result-"); }

// ── Main ──────────────────────────────────────────────────────────────────────

export default function TestDecisionTree() {
  const [path, setPath] = useState<{ nodeId: string; answer: boolean }[]>([]);
  const [currentId, setCurrentId] = useState("q1");

  function answer(yes: boolean) {
    const q = getQuestionById(currentId)!;
    const next = yes ? q.yes : q.no;
    setPath(prev => [...prev, { nodeId: currentId, answer: yes }]);
    setCurrentId(next);
  }

  function reset() {
    setPath([]);
    setCurrentId("q1");
  }

  function goBack() {
    if (path.length === 0) return;
    const prev = path[path.length - 1];
    setCurrentId(prev.nodeId);
    setPath(p => p.slice(0, -1));
  }

  const currentQuestion = getQuestionById(currentId);
  const currentResult = isResult(currentId) ? getResultById(currentId) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Statistical Test Decision Tree
        </span>
        {path.length > 0 && (
          <button onClick={reset}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-700 px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            Start over
          </button>
        )}
      </div>

      {/* Path breadcrumb */}
      {path.length > 0 && (
        <div className="px-5 pt-3 pb-1">
          <div className="flex flex-wrap gap-1.5 items-center">
            {path.map((step, i) => {
              const q = getQuestionById(step.nodeId)!;
              const qNum = QUESTIONS.findIndex(q2 => q2.id === step.nodeId) + 1;
              return (
                <span key={i} className="flex items-center gap-1 text-[10px]">
                  <span className="text-slate-400">Q{qNum}:</span>
                  <span className={`px-1.5 py-0.5 rounded-full font-semibold ${
                    step.answer ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                  }`}>
                    {step.nodeId === "q3"
                      ? (step.answer ? Q3_LABEL : Q3_LABEL_NO)
                      : (step.answer ? "Yes" : "No")}
                  </span>
                  {i < path.length - 1 && <span className="text-slate-300">›</span>}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Current question */}
      {currentQuestion && (
        <div className="px-5 py-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Question {QUESTIONS.findIndex(q => q.id === currentId) + 1}
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-snug mb-2">
              {currentQuestion.text}
            </p>
            {currentQuestion.hint && (
              <p className="text-xs text-slate-500 leading-relaxed mb-4 bg-slate-50 rounded px-3 py-2 border border-slate-100">
                {currentQuestion.hint}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => answer(true)}
                className="flex-1 py-2.5 rounded-lg border border-emerald-300 bg-emerald-50 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors">
                {currentId === "q3" ? Q3_LABEL : "Yes"}
              </button>
              <button onClick={() => answer(false)}
                className="flex-1 py-2.5 rounded-lg border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors">
                {currentId === "q3" ? Q3_LABEL_NO : "No"}
              </button>
            </div>
            {path.length > 0 && (
              <button onClick={goBack} className="mt-3 text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
                ← Back
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {currentResult && (() => {
        const colors = COLOR_MAP[currentResult.color];
        return (
          <div className="px-5 pb-5">
            <div className={`rounded-lg border ${colors.border} ${colors.bg} p-4`}>
              <div className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${colors.text} opacity-70`}>
                Recommended test
              </div>
              <div className={`text-base font-bold mb-2 ${colors.text}`}>{currentResult.test}</div>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {currentResult.description}
              </p>
              <div className="rounded border border-slate-200 bg-white px-3 py-2">
                <div className="text-[10px] text-slate-400 mb-1">Python</div>
                <code className="text-xs font-mono text-slate-700">{currentResult.python}</code>
              </div>
              <button onClick={reset}
                className="mt-3 text-[11px] font-medium text-slate-500 hover:text-slate-700 transition-colors">
                ← Start over
              </button>
            </div>
          </div>
        );
      })()}

      {/* Footer — overview */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="text-[10px] text-slate-400 text-center">
          Answer the questions above to find the right test for your data.
        </div>
      </div>
    </div>
  );
}
