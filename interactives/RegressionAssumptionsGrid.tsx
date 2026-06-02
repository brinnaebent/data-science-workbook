"use client";

import { useState } from "react";

type Assumption = {
  id: string;
  label: string;
  tagline: string;
  color: string;
  borderColor: string;
  bgColor: string;
  headerBg: string;
  iconColor: string;
  description: string;
  violation: string;
  check: string;
};

const ASSUMPTIONS: Assumption[] = [
  {
    id: "linearity",
    label: "Linearity",
    tagline: "Relationship is a straight line",
    color: "text-indigo-800",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-50",
    headerBg: "bg-indigo-100",
    iconColor: "text-indigo-500",
    description:
      "The relationship between each predictor and the outcome is approximately linear. A straight line through the data should capture the trend without any systematic curve.",
    violation:
      "House price curves sharply above a certain square footage threshold — the straight line consistently underpredicts large homes. You'd see a curved arc in the residual-vs-fitted plot.",
    check: "Plot residuals vs. fitted values. A random scatter around zero is good; a U-shape or arc means linearity is violated.",
  },
  {
    id: "independence",
    label: "Independence",
    tagline: "Observations don't influence each other",
    color: "text-violet-800",
    borderColor: "border-violet-200",
    bgColor: "bg-violet-50",
    headerBg: "bg-violet-100",
    iconColor: "text-violet-500",
    description:
      "Each observation is independent of every other. Knowing the value of one residual tells you nothing about another. This is violated by clustered sampling, repeated measures, and time series data.",
    violation:
      "You sampled 10 houses from the same street. Those share unmeasured neighborhood effects — quiet cul-de-sac, proximity to a school — so their residuals are correlated, not independent.",
    check: "Think about your data collection process. For time series, plot residuals in order and look for runs. Durbin-Watson test quantifies serial autocorrelation.",
  },
  {
    id: "homoscedasticity",
    label: "Homoscedasticity",
    tagline: "Residuals have constant variance",
    color: "text-emerald-800",
    borderColor: "border-emerald-200",
    bgColor: "bg-emerald-50",
    headerBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
    description:
      "The spread of residuals is roughly the same across all fitted values. A model that's equally uncertain whether predicting a $200k or a $900k house satisfies this assumption.",
    violation:
      "Cheap houses cluster tightly around the prediction line, but expensive houses vary wildly — $200k too high, $150k too low. Errors \"fan out\" as price increases. This is heteroscedasticity.",
    check: "Plot residuals vs. fitted values. A cone or fan shape (widening or narrowing spread) signals heteroscedasticity. Scale-location plots show this more clearly.",
  },
  {
    id: "normality",
    label: "Normality of Residuals",
    tagline: "Errors follow a bell curve",
    color: "text-amber-800",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-50",
    headerBg: "bg-amber-100",
    iconColor: "text-amber-500",
    description:
      "The residuals are approximately normally distributed around zero. This matters most for hypothesis tests on coefficients and for confidence intervals — not for the outcome variable itself.",
    violation:
      "Luxury homes introduce extreme outliers — a few residuals are $500k off while most are under $50k. The residual distribution is heavy-tailed, not bell-shaped. p-values become unreliable.",
    check: "Inspect a histogram of residuals (should look bell-shaped) or a Q-Q plot (points should fall near the diagonal). Shapiro-Wilk test is sensitive but useful for small samples.",
  },
];

type Tab = "what" | "violation" | "check";

const TABS: { id: Tab; label: string }[] = [
  { id: "what", label: "What it means" },
  { id: "violation", label: "What a violation looks like" },
  { id: "check", label: "How to check it" },
];

export default function RegressionAssumptionsGrid() {
  const [activeTab, setActiveTab] = useState<Tab>("what");

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          The Four OLS Assumptions
        </span>
      </div>

      {/* Tab strip */}
      <div className="flex border-b border-slate-100 bg-white">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "text-slate-800 border-b-2 border-slate-700 bg-white"
                : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
        {ASSUMPTIONS.map((a) => {
          const content =
            activeTab === "what"
              ? a.description
              : activeTab === "violation"
              ? a.violation
              : a.check;

          return (
            <div
              key={a.id}
              className={`p-5 ${a.bgColor}`}
            >
              <div
                className={`inline-block px-2 py-0.5 rounded border text-xs font-semibold mb-1.5 ${a.color} ${a.borderColor} ${a.bgColor}`}
              >
                {a.label}
              </div>
              <p className="text-xs text-slate-500 leading-snug mb-3">{a.tagline}</p>
              <p className={`text-sm leading-relaxed ${a.color}`}>{content}</p>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-400 leading-relaxed">
          These assumptions are checked <em>after</em> fitting a model, using residual plots. Violations bias coefficient estimates, corrupt standard errors, and make hypothesis tests unreliable.
        </p>
      </div>
    </div>
  );
}
