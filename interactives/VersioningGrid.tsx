"use client";

const ITEMS = [
  {
    label: "Code",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
    },
    tag: "Always",
    summary: "Standard software engineering practice — every model is trained by code, and that code must be reproducible.",
    detail: "If you can't reproduce the training script exactly as it ran six months ago, you can't explain why the model behaved the way it did. Version control is the baseline.",
    signal: "Git",
  },
  {
    label: "Data",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
      </svg>
    ),
    color: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "text-rose-500",
      badge: "bg-rose-100 text-rose-700",
    },
    tag: "Critical",
    summary: "A model trained on different data produces different predictions. Without data versioning, you can't recreate model v17 six months later.",
    detail: "Data changes constantly — rows are added, corrected, deleted. If you overwrote last month's training set, that model version is gone forever, even if the code and weights survived.",
    signal: "DVC, lakeFS, Delta Lake",
  },
  {
    label: "Model",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M8.46 8.46a5 5 0 0 0 0 7.07" />
      </svg>
    ),
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
    tag: "Required",
    summary: "Rollbacks, A/B testing, audit trail, regulatory compliance all depend on being able to retrieve any previous model artifact.",
    detail: "When production degrades, you need to roll back in minutes, not hours. A model registry stores every trained artifact with its metadata, making rollback a one-line operation.",
    signal: "MLflow Model Registry, W&B",
  },
  {
    label: "Config",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    color: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
    },
    tag: "Often Missed",
    summary: "Hyperparameters, feature flags, environment settings — a different learning rate is a different model, even if the code and data are identical.",
    detail: "Config is easy to overlook because it doesn't live in a file you think of as 'the model.' But two runs with identical code and data and different configs will produce different outputs. Track it the same way you'd track code.",
    signal: "Git, environment configs",
  },
];

export default function VersioningGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Version Everything
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ITEMS.map(({ label, icon, color, tag, summary, detail, signal }) => (
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
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Tools</span>
              <div className="text-xs font-medium text-slate-700 mt-0.5">{signal}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">The lineage between all four is what makes a system auditable: Model v17 was trained on Data v9, using Code v42, with Config v3. Without that lineage, you cannot answer "why did the model get worse after we retrained it?"</p>
      </div>
    </div>
  );
}
