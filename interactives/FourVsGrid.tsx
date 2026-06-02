"use client";

const VS = [
  {
    label: "Volume",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
    },
    tag: "How Much?",
    summary: "The total size of data to store and query.",
    detail: "A few gigabytes fits on a laptop. A few petabytes requires a distributed system. The gap between those two scenarios is most of what drives database architecture decisions.",
    signal: "GB vs. TB vs. PB",
  },
  {
    label: "Velocity",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 13 9 20 9" />
        <path d="M21 12.5A9 9 0 1 1 11.5 3" />
        <line x1="12" y1="12" x2="16" y2="8" />
      </svg>
    ),
    color: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "text-rose-500",
      badge: "bg-rose-100 text-rose-700",
    },
    tag: "How Fast?",
    summary: "The rate at which data arrives.",
    detail: "A monthly data export is trivially handled with batch processes. A real-time event stream from a million devices is an entirely different engineering problem.",
    signal: "Batch vs. streaming",
  },
  {
    label: "Variety",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <circle cx="17.5" cy="17.5" r="3.5" />
      </svg>
    ),
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
    tag: "How Many Types?",
    summary: "The number of distinct data shapes in the system.",
    detail: "A single schema of structured records is the easy case. A system ingesting clickstreams, images, user text, and transaction records simultaneously requires a more thoughtful architecture.",
    signal: "Structured vs. mixed",
  },
  {
    label: "Veracity",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    color: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
    },
    tag: "How Trustworthy?",
    summary: "The reliability and accuracy of the data.",
    detail: "Data from controlled sensors is high-veracity. Data scraped from the open web is not. Low veracity upstream means more validation and cleaning work, which affects pipeline design all the way to the model.",
    signal: "Controlled vs. scraped",
  },
];

export default function FourVsGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          The Four V's of Data
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VS.map(({ label, icon, color, tag, summary, detail, signal }) => (
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
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Key distinction</span>
              <div className="text-xs font-medium text-slate-700 mt-0.5">{signal}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">Answer all four for any storage problem and the right tool usually surfaces. Skip them and you'll spend months migrating away from a database that was never right for the job.</p>
      </div>
    </div>
  );
}
