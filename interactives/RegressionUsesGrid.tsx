"use client";

const USES = [
  {
    label: "Prediction",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
      accent: "bg-indigo-500",
    },
    tag: "Machine Learning",
    summary: "Feed in predictor values, get an estimated output.",
    detail: "You don't need to interpret the coefficients — you just want accurate ŷ. The goal is minimizing prediction error on new data, not understanding what drives the outcome.",
    focus: "Accurate ŷ on new data",
  },
  {
    label: "Estimation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    color: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      icon: "text-violet-500",
      badge: "bg-violet-100 text-violet-700",
      accent: "bg-violet-500",
    },
    tag: "Causal Inference",
    summary: "Quantify the effect of one specific predictor.",
    detail: "\"How much does a pool add to price, after controlling for location and size?\" You care about the value and uncertainty of a specific coefficient β, not overall predictive accuracy.",
    focus: "Coefficient value & uncertainty",
  },
  {
    label: "Hypothesis Testing",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    color: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
      accent: "bg-emerald-500",
    },
    tag: "Inferential Statistics",
    summary: "Test whether a coefficient is significantly non-zero.",
    detail: "Is the pool coefficient significantly different from zero? Could the relationship be explained by chance? OLS gives you a t-statistic and p-value for each coefficient.",
    focus: "t-statistic & p-value",
  },
];

export default function RegressionUsesGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Three Uses of Regression
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {USES.map(({ label, icon, color, tag, summary, detail, focus }) => (
          <div
            key={label}
            className={`rounded-xl border ${color.border} ${color.bg} p-4 flex flex-col gap-3`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className={`${color.icon} mt-0.5`}>{icon}</div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${color.badge}`}>
                {tag}
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-800 mb-1">{label}</div>
              <div className="text-xs text-slate-600 leading-relaxed">{summary}</div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed">
              {detail}
            </div>

            <div className="mt-auto pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Look at</span>
              <div className="text-xs font-medium text-slate-700 mt-0.5">{focus}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">The same model serves all three purposes. The question you're asking determines what you look at in the output.</p>
      </div>
    </div>
  );
}
