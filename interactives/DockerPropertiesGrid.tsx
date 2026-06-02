"use client";

const PROPERTIES = [
  {
    label: "Isolation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
    },
    tag: "Sandboxed",
    summary: "Each container runs in its own sandbox.",
    detail: "Your model's dependencies don't collide with the web server's dependencies. No more \"it installed fine but now nothing else works.\"",
    signal: "Dependencies stay contained",
  },
  {
    label: "Consistency",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M12 12h.01" />
        <path d="M7 12h.01" />
        <path d="M17 12h.01" />
      </svg>
    ),
    color: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "text-rose-500",
      badge: "bg-rose-100 text-rose-700",
    },
    tag: "Reproducible",
    summary: "What runs on your laptop runs identically in production.",
    detail: "The phrase \"it works on my machine\" disappears. The container image is the same artifact on every machine that runs it.",
    signal: "Dev equals prod",
  },
  {
    label: "Portability",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12H19" />
        <path d="M12 5l7 7-7 7" />
      </svg>
    ),
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
    tag: "Run Anywhere",
    summary: "Any system with Docker installed can run any container.",
    detail: "Regardless of what's installed on the host, the container brings its own environment. Cloud, on-prem, or a colleague's laptop — it all just works.",
    signal: "Host-agnostic execution",
  },
  {
    label: "Versionability",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M4.22 4.22l2.12 2.12" />
        <path d="M17.66 17.66l2.12 2.12" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="M4.22 19.78l2.12-2.12" />
        <path d="M17.66 6.34l2.12-2.12" />
      </svg>
    ),
    color: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
    },
    tag: "Immutable",
    summary: "Container images are versioned and immutable.",
    detail: "Rollbacks are as simple as switching which image version is running. Bad deploy at 3am? Point to the previous tag and you're done.",
    signal: "Rollback in one command",
  },
];

export default function DockerPropertiesGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          What Docker Actually Does
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROPERTIES.map(({ label, icon, color, tag, summary, detail, signal }) => (
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
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Key benefit</span>
              <div className="text-xs font-medium text-slate-700 mt-0.5">{signal}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">Almost every deployment option in the ML ecosystem is either a wrapper around Docker, or a service that accepts Docker images. Learn the container model once and the rest follows.</p>
      </div>
    </div>
  );
}
