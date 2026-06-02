"use client";

import { useState } from "react";

type DataRelationship = "comparison" | "distribution" | "composition" | "trend" | "relationship";
type AudienceLevel = "general" | "mixed" | "technical";

interface ChartRecommendation {
  name: string;
  description: string;
  bestFor: string;
  avoid: string;
  color: string;
  icon: React.ReactNode;
}

const CHART_ICON_PROPS = { width: 28, height: 28, viewBox: "0 0 28 28", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const ICONS: Record<string, React.ReactNode> = {
  bar: (
    <svg {...CHART_ICON_PROPS}>
      <rect x="4" y="16" width="5" height="8" rx="1" fill="currentColor" opacity="0.3" stroke="none" />
      <rect x="11.5" y="10" width="5" height="14" rx="1" fill="currentColor" opacity="0.3" stroke="none" />
      <rect x="19" y="6" width="5" height="18" rx="1" fill="currentColor" opacity="0.3" stroke="none" />
      <line x1="2" y1="24" x2="26" y2="24" strokeWidth="1.5" />
    </svg>
  ),
  line: (
    <svg {...CHART_ICON_PROPS}>
      <polyline points="3,22 9,14 15,17 21,8 25,11" strokeWidth="2" />
      <circle cx="3" cy="22" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="21" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="25" cy="11" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  scatter: (
    <svg {...CHART_ICON_PROPS}>
      <circle cx="7" cy="20" r="2" fill="currentColor" opacity="0.6" stroke="none" />
      <circle cx="12" cy="15" r="2" fill="currentColor" opacity="0.6" stroke="none" />
      <circle cx="10" cy="22" r="2" fill="currentColor" opacity="0.6" stroke="none" />
      <circle cx="18" cy="10" r="2" fill="currentColor" opacity="0.6" stroke="none" />
      <circle cx="22" cy="7" r="2" fill="currentColor" opacity="0.6" stroke="none" />
      <circle cx="16" cy="18" r="2" fill="currentColor" opacity="0.6" stroke="none" />
      <circle cx="20" cy="14" r="2" fill="currentColor" opacity="0.6" stroke="none" />
      <line x1="2" y1="25" x2="26" y2="25" strokeWidth="1.5" />
      <line x1="2" y1="25" x2="2" y2="3" strokeWidth="1.5" />
    </svg>
  ),
  donut: (
    <svg {...CHART_ICON_PROPS}>
      <path d="M14 4 A10 10 0 0 1 22.6 19 L19.3 17.1 A6.5 6.5 0 0 0 14 7.5 Z" fill="currentColor" opacity="0.55" stroke="none" />
      <path d="M22.6 19 A10 10 0 0 1 5 20.5 L8.3 18.3 A6.5 6.5 0 0 0 19.3 17.1 Z" fill="currentColor" opacity="0.3" stroke="none" />
      <path d="M5 20.5 A10 10 0 0 1 14 4 L14 7.5 A6.5 6.5 0 0 0 8.3 18.3 Z" fill="currentColor" opacity="0.15" stroke="none" />
      <circle cx="14" cy="14" r="10" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="6.5" fill="white" strokeWidth="1.5" />
    </svg>
  ),
  histogram: (
    <svg {...CHART_ICON_PROPS}>
      <rect x="3" y="18" width="4" height="6" rx="0.5" fill="currentColor" opacity="0.25" />
      <rect x="7.5" y="12" width="4" height="12" rx="0.5" fill="currentColor" opacity="0.4" />
      <rect x="12" y="7" width="4" height="17" rx="0.5" fill="currentColor" opacity="0.6" />
      <rect x="16.5" y="11" width="4" height="13" rx="0.5" fill="currentColor" opacity="0.4" />
      <rect x="21" y="17" width="4" height="7" rx="0.5" fill="currentColor" opacity="0.25" />
      <line x1="2" y1="24" x2="26" y2="24" strokeWidth="1.5" />
    </svg>
  ),
  boxplot: (
    <svg {...CHART_ICON_PROPS}>
      <rect x="9" y="9" width="10" height="12" rx="1" strokeWidth="1.5" />
      <line x1="9" y1="15" x2="19" y2="15" strokeWidth="1.5" />
      <line x1="14" y1="9" x2="14" y2="5" strokeWidth="1.5" />
      <line x1="14" y1="21" x2="14" y2="25" strokeWidth="1.5" />
      <line x1="11" y1="5" x2="17" y2="5" strokeWidth="1.5" />
      <line x1="11" y1="25" x2="17" y2="25" strokeWidth="1.5" />
    </svg>
  ),
  stacked: (
    <svg {...CHART_ICON_PROPS}>
      <rect x="4" y="18" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.6" stroke="none" />
      <rect x="4" y="13" width="6" height="5" rx="0.5" fill="currentColor" opacity="0.35" stroke="none" />
      <rect x="12" y="14" width="6" height="10" rx="0.5" fill="currentColor" opacity="0.6" stroke="none" />
      <rect x="12" y="8" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.35" stroke="none" />
      <rect x="20" y="10" width="6" height="14" rx="0.5" fill="currentColor" opacity="0.6" stroke="none" />
      <rect x="20" y="5" width="6" height="5" rx="0.5" fill="currentColor" opacity="0.35" stroke="none" />
      <line x1="2" y1="24" x2="27" y2="24" strokeWidth="1.5" />
    </svg>
  ),
  heatmap: (
    <svg {...CHART_ICON_PROPS}>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const opacity = 0.1 + ((row * 4 + col) / 15) * 0.8;
          return <rect key={`${row}-${col}`} x={4 + col * 5.5} y={4 + row * 5.5} width="5" height="5" rx="0.5" fill="currentColor" opacity={opacity} stroke="none" />;
        })
      )}
    </svg>
  ),
};

type Recommendation = {
  chartType: string;
  why: string;
  bestFor: string;
  avoid: string;
  colorClass: string;
  borderClass: string;
  textClass: string;
  iconKey: string;
};

function getRecommendation(
  relationship: DataRelationship,
  audience: AudienceLevel,
  hasTime: boolean,
  categoryCount: number
): Recommendation[] {
  if (relationship === "trend") {
    return [
      { chartType: "Line Chart", why: "The default for time series. Encodes change over time naturally — readers parse slope as rate of change.", bestFor: "Continuous data measured at intervals. Works for any number of series up to ~5 before it gets crowded.", avoid: "Unordered categorical data or when the number of data points is very small (use a bar chart instead).", colorClass: "bg-blue-50", borderClass: "border-blue-200", textClass: "text-blue-700", iconKey: "line" },
      ...(audience !== "general" ? [{ chartType: "Stacked Area", why: "Shows both total and part-to-whole over time. Harder to read individual series but great for cumulative effect.", bestFor: "When showing how components of a total change over time.", avoid: "When individual series comparison matters — layer distortion makes this difficult.", colorClass: "bg-indigo-50", borderClass: "border-indigo-200", textClass: "text-indigo-700", iconKey: "stacked" }] : []),
    ];
  }

  if (relationship === "comparison") {
    if (categoryCount <= 2) {
      return [
        { chartType: "Bar Chart", why: "The clearest way to compare magnitudes across categories. Position on a common scale is the most accurate visual encoding.", bestFor: "Comparing quantities across a small to moderate number of categories. Use horizontal bars when labels are long.", avoid: "Time series or when categories have a natural order that implies trend.", colorClass: "bg-emerald-50", borderClass: "border-emerald-200", textClass: "text-emerald-700", iconKey: "bar" },
      ];
    }
    return [
      { chartType: "Bar Chart", why: "The clearest way to compare magnitudes across categories. Horizontal orientation handles longer labels.", bestFor: "Ranked lists, survey results, category counts.", avoid: "More than ~15 categories starts to clutter. Consider grouping small values.", colorClass: "bg-emerald-50", borderClass: "border-emerald-200", textClass: "text-emerald-700", iconKey: "bar" },
      ...(audience !== "general" ? [{ chartType: "Heat Map", why: "When you have two categorical dimensions, a heat map communicates matrix structure more efficiently than grouped bars.", bestFor: "Correlation matrices, two-way category comparisons, or survey data with many questions.", avoid: "When you need precise value comparisons — color is less accurate than position.", colorClass: "bg-amber-50", borderClass: "border-amber-200", textClass: "text-amber-700", iconKey: "heatmap" }] : []),
    ];
  }

  if (relationship === "distribution") {
    if (audience === "general") {
      return [
        { chartType: "Histogram", why: "Shows the shape of a distribution. Intuitive for general audiences — it looks like a bar chart, which most people already understand.", bestFor: "Understanding the spread, center, and skew of a single continuous variable.", avoid: "Comparing distributions across more than 2–3 groups in the same plot (use box plots instead).", colorClass: "bg-violet-50", borderClass: "border-violet-200", textClass: "text-violet-700", iconKey: "histogram" },
      ];
    }
    return [
      { chartType: "Histogram", why: "Best starting point for any distribution. Shows shape clearly — bimodality, skew, outliers.", bestFor: "Single variable, exploratory analysis, general audiences.", avoid: "Side-by-side comparison of many groups.", colorClass: "bg-violet-50", borderClass: "border-violet-200", textClass: "text-violet-700", iconKey: "histogram" },
      { chartType: "Box Plot", why: "Condenses a distribution into five statistics. Excellent for comparing spread across many groups simultaneously.", bestFor: "Comparing distributions across categories. Requires the audience to understand quartiles.", avoid: "Hiding bimodality — a box plot looks the same whether the data is bimodal or unimodal.", colorClass: "bg-pink-50", borderClass: "border-pink-200", textClass: "text-pink-700", iconKey: "boxplot" },
    ];
  }

  if (relationship === "composition") {
    if (audience === "general") {
      return [
        { chartType: "Donut Chart", why: "Part-to-whole at a glance — the hollow center lets you place a key number or label inside, focusing the reader on the dominant share.", bestFor: "\"X accounts for Y% of total\" stories with 2–4 slices. Simple enough for any audience.", avoid: "More than 4–5 slices, or when comparing across multiple time points.", colorClass: "bg-orange-50", borderClass: "border-orange-200", textClass: "text-orange-700", iconKey: "donut" },
        { chartType: "Stacked Bar", why: "More flexible than pie — can show composition across multiple groups or time periods.", bestFor: "Showing how parts add up to a whole across categories.", avoid: "When the middle slices are hard to compare (they float without a common baseline).", colorClass: "bg-amber-50", borderClass: "border-amber-200", textClass: "text-amber-700", iconKey: "stacked" },
      ];
    }
    return [
      { chartType: "Stacked Bar", why: "Flexible part-to-whole comparison. Normalized to 100% it removes the absolute scale, emphasizing proportions.", bestFor: "Composition across multiple groups or over time. Use 100% stacked to compare proportions.", avoid: "When precise comparison of middle segments is needed — they lack a common baseline.", colorClass: "bg-amber-50", borderClass: "border-amber-200", textClass: "text-amber-700", iconKey: "stacked" },
    ];
  }

  if (relationship === "relationship") {
    if (audience === "general") {
      return [
        { chartType: "Scatter Plot", why: "Directly encodes two variables as position — the most intuitive way to show correlation or clustering.", bestFor: "\"Does X correlate with Y?\" questions. Works for any audience if axes are labeled clearly.", avoid: "Overplotting with very large datasets (use density or hexbin instead).", colorClass: "bg-cyan-50", borderClass: "border-cyan-200", textClass: "text-cyan-700", iconKey: "scatter" },
      ];
    }
    return [
      { chartType: "Scatter Plot", why: "Position on two axes is the most precise visual encoding for bivariate relationships.", bestFor: "Correlation, clustering, and outlier detection between two continuous variables.", avoid: "Overplotting with thousands of points — add alpha transparency or switch to a density plot.", colorClass: "bg-cyan-50", borderClass: "border-cyan-200", textClass: "text-cyan-700", iconKey: "scatter" },
      { chartType: "Heat Map", why: "When you have two categorical or binned variables, a heat map shows the frequency or value at each intersection.", bestFor: "Correlation matrices, confusion matrices, or count data across two categorical dimensions.", avoid: "When individual cell values are the message — readers estimate color less precisely than position.", colorClass: "bg-amber-50", borderClass: "border-amber-200", textClass: "text-amber-700", iconKey: "heatmap" },
    ];
  }

  return [];
}

const RELATIONSHIPS: { id: DataRelationship; label: string; hint: string }[] = [
  { id: "comparison", label: "Compare categories", hint: "Which group is biggest? How do groups rank?" },
  { id: "trend", label: "Show change over time", hint: "How did X change across months, years, or events?" },
  { id: "distribution", label: "Show a distribution", hint: "What does this variable look like? Is it skewed?" },
  { id: "composition", label: "Show part-to-whole", hint: "What share does each segment account for?" },
  { id: "relationship", label: "Explore a relationship", hint: "Do X and Y correlate? Are there clusters?" },
];

const AUDIENCES: { id: AudienceLevel; label: string }[] = [
  { id: "general", label: "General / non-technical" },
  { id: "mixed", label: "Mixed audience" },
  { id: "technical", label: "Technical / data literate" },
];

export default function ChartTypePicker() {
  const [relationship, setRelationship] = useState<DataRelationship | null>(null);
  const [audience, setAudience] = useState<AudienceLevel | null>(null);
  const [hasTime, setHasTime] = useState(false);
  const [categoryCount, setCategoryCount] = useState<number>(4);

  const recommendations =
    relationship && audience
      ? getRecommendation(relationship, audience, hasTime, categoryCount)
      : [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Chart Type Picker
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* Step 1: What are you showing? */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            1 — What is your data story?
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {RELATIONSHIPS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRelationship(r.id)}
                className={`text-left px-3.5 py-2.5 rounded-lg border text-sm transition-all ${
                  relationship === r.id
                    ? "bg-indigo-50 border-indigo-300 text-indigo-900"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="font-medium">{r.label}</div>
                <div className={`text-xs mt-0.5 ${relationship === r.id ? "text-indigo-500" : "text-slate-400"}`}>
                  {r.hint}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Audience */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            2 — Who is your audience?
          </div>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a.id}
                onClick={() => setAudience(a.id)}
                className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  audience === a.id
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Category count (shown for comparison/composition/relationship) */}
        {relationship && ["comparison", "composition", "relationship"].includes(relationship) && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              3 — How many categories or variables?
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={2}
                max={12}
                value={categoryCount}
                onChange={(e) => setCategoryCount(Number(e.target.value))}
                className="w-40 accent-indigo-500"
              />
              <span className="text-sm font-mono text-slate-700 w-8">{categoryCount}</span>
              <span className="text-xs text-slate-400">
                {categoryCount <= 3 ? "few" : categoryCount <= 6 ? "moderate" : "many"}
              </span>
            </div>
          </div>
        )}

        {/* Divider */}
        {recommendations.length > 0 && (
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">recommended</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div
                key={rec.chartType}
                className={`rounded-lg border ${rec.borderClass} ${rec.colorClass} p-4`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex-shrink-0 ${rec.textClass}`}>{ICONS[rec.iconKey]}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold text-sm ${rec.textClass}`}>{rec.chartType}</span>
                      {i === 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-white border border-current rounded-full px-1.5 py-0.5 opacity-70">
                          Best fit
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{rec.why}</p>
                    <div className="space-y-1">
                      <div className="flex gap-1.5 text-xs">
                        <span className="font-medium text-slate-500 flex-shrink-0">Best for:</span>
                        <span className="text-slate-600">{rec.bestFor}</span>
                      </div>
                      <div className="flex gap-1.5 text-xs">
                        <span className="font-medium text-slate-500 flex-shrink-0">Avoid when:</span>
                        <span className="text-slate-600">{rec.avoid}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {relationship && audience && recommendations.length === 0 && (
          <div className="text-center py-4 text-sm text-slate-400">
            No strong recommendation — try adjusting your inputs.
          </div>
        )}

        {!relationship && !audience && (
          <div className="text-center py-2 text-xs text-slate-400">
            Select a story type and audience to get a recommendation.
          </div>
        )}
      </div>
    </div>
  );
}
