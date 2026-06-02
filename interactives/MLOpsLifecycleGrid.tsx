"use client";

const PHASES = [
  {
    number: "01",
    label: "ML Design",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    color: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      icon: "text-violet-500",
      badge: "bg-violet-100 text-violet-700",
      number: "text-violet-300",
    },
    tag: "Phase 1",
    summary: "Requirements, use case prioritization, data acquisition, problem framing.",
    detail: "This is where the question gets defined. A well-scoped problem statement with clear success criteria is the single biggest predictor of whether a model ever ships.",
    signal: "What are we building and why?",
  },
  {
    number: "02",
    label: "Model Development",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      icon: "text-sky-500",
      badge: "bg-sky-100 text-sky-700",
      number: "text-sky-300",
    },
    tag: "Phase 2",
    summary: "Data prep, feature engineering, training, experimentation, evaluation.",
    detail: "The part most modelers spend their time on. Features are engineered, experiments are tracked, and models are evaluated until one is good enough to ship.",
    signal: "Does the model actually work?",
  },
  {
    number: "03",
    label: "Operations",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
      number: "text-amber-300",
    },
    tag: "Phase 3",
    summary: "Deployment, CI/CD, monitoring, triggered retraining.",
    detail: "The model runs forever; the training run happened once. This phase is where most production engineering time goes — and where models quietly break without anyone noticing.",
    signal: "Is it still working in prod?",
  },
];

export default function MLOpsLifecycleGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          The MLOps Lifecycle
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PHASES.map(({ number, label, icon, color, tag, summary, detail, signal }) => (
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
              <div className={`text-3xl font-black leading-none mb-1 ${color.number}`}>{number}</div>
              <div className="text-sm font-bold text-slate-800 mb-1">{label}</div>
              <div className="text-xs text-slate-600 leading-relaxed">{summary}</div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed">
              {detail}
            </div>

            <div className="mt-auto pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Key question</span>
              <div className="text-xs font-medium text-slate-700 mt-0.5">{signal}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">In industry, Phase 3 consumes more engineering time than Phases 1 and 2 combined — because a production system runs forever, and the model was trained once.</p>
      </div>
    </div>
  );
}
