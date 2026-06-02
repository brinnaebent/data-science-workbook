"use client";

const LAYERS = [
  {
    label: "Performance Tracking",
    sublabel: "Ground truth metrics",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
    },
    tag: "Gold standard",
    examples: "Accuracy · Precision · Recall · RMSE",
    description: "Compute model metrics on live data as ground truth labels arrive. Alert when metrics fall below a defined threshold. Direct measurement of what you actually care about.",
    note: "Labels often arrive with delay — track lag as a first-class metric.",
  },
  {
    label: "Input Distribution",
    sublabel: "Feature drift detection",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16c1-2 3-5 5-5s4 3 6 1" />
      </svg>
    ),
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
    tag: "Leading indicator",
    examples: "PSI · KS Test · Mean/Std shift",
    description: "Track statistical properties of input features over time. If the mean of a key feature drifts significantly, that's an early warning of performance degradation — detectable before labels arrive.",
    note: "Useful precisely because it requires no ground truth labels.",
  },
  {
    label: "Resource Monitoring",
    sublabel: "Infra health",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
    color: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      icon: "text-sky-500",
      badge: "bg-sky-100 text-sky-700",
    },
    tag: "Standard ops",
    examples: "CPU · Memory · Latency · Error rate",
    description: "Standard software operations monitoring — but essential. A spike in latency or error rate is often the first signal that something is wrong, before any ML-specific metric fires.",
    note: "Shared with your backend team; don't reinvent the wheel here.",
  },
  {
    label: "Centralized Logging",
    sublabel: "Prediction audit trail",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    color: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      icon: "text-violet-500",
      badge: "bg-violet-100 text-violet-700",
    },
    tag: "Queryable history",
    examples: "Inputs · Output · Timestamp · Model version",
    description: "Every prediction logged with its inputs, output, timestamp, and model version. This is what you query when something breaks at 2 a.m. — the audit trail that lets you replay and diagnose failures.",
    note: "Log model version with every prediction to isolate regressions after deploys.",
  },
  {
    label: "Alerting",
    sublabel: "Outage + quality",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    color: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "text-rose-500",
      badge: "bg-rose-100 text-rose-700",
    },
    tag: "Two alarm types",
    examples: "PagerDuty · Prometheus · CloudWatch",
    description: "Alerts for outages (model unreachable) and for quality degradation (model reachable but performing poorly). The second type is the one most teams forget to build — and the one that silently costs you.",
    note: "Quality alerts require thresholds. Set them before you go live, not after.",
  },
];

export default function MonitoringStackGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Monitoring Stack
        </span>
      </div>

      <div className="grid grid-cols-[2fr_3fr_2fr] gap-0 border-b border-slate-100 bg-slate-50 px-5 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Layer</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">What it tracks</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Watch out for</span>
      </div>

      <div className="divide-y divide-slate-100">
        {LAYERS.map(({ label, sublabel, icon, color, tag, examples, description, note }) => (
          <div
            key={label}
            className="grid grid-cols-[2fr_3fr_2fr] gap-0 px-5 py-3 items-center hover:bg-slate-50/60 transition-colors"
          >
            <div className="flex items-center gap-2.5 pr-4">
              <div className={`shrink-0 p-1.5 rounded-lg ${color.bg} border ${color.border} ${color.icon}`}>{icon}</div>
              <div>
                <div className="text-xs font-bold text-slate-800 leading-tight">{label}</div>
                <div className="text-[10px] text-slate-400">{sublabel}</div>
              </div>
            </div>

            <div className="pr-4">
              <div className="text-xs text-slate-600 leading-relaxed">{description}</div>
              <div className="text-[10px] text-slate-400 mt-1 font-medium">{examples}</div>
            </div>

            <div className="flex flex-col gap-1">
              <span className={`self-start text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${color.badge}`}>{tag}</span>
              <div className="text-xs text-slate-500 leading-relaxed italic">{note}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">A complete monitoring stack layers all five. Resource monitoring fires first (infrastructure break), input distribution monitoring fires second (data break), performance tracking fires third (model break) — but only once labels arrive. Logging and alerting make the rest actionable.</p>
      </div>
    </div>
  );
}
