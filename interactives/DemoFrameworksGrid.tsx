"use client";

const FRAMEWORKS = [
  {
    label: "Streamlit",
    sublabel: "Python",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "text-rose-500",
      badge: "bg-rose-100 text-rose-700",
    },
    tag: "Fastest to demo",
    deployOn: "Streamlit Community Cloud · HF Spaces",
    description: "Fastest path from model to interactive demo — write Python, get a web app. No frontend knowledge needed.",
    bestFor: "Tight timelines, Python-only workflows, internal stakeholder demos",
  },
  {
    label: "Gradio",
    sublabel: "Python",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    color: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-500",
      badge: "bg-orange-100 text-orange-700",
    },
    tag: "ML-native UI",
    deployOn: "Hugging Face Spaces (free)",
    description: "ML-specific demos with built-in components for image, audio, and text. Excellent for model showcases on Hugging Face.",
    bestFor: "Vision, NLP, and audio models; anything you want to share on Hugging Face",
  },
  {
    label: "Flask",
    sublabel: "Python",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
    color: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      icon: "text-slate-500",
      badge: "bg-slate-100 text-slate-700",
    },
    tag: "Full control",
    deployOn: "Any Python host · Docker · cloud VM",
    description: "Custom backends with full control over routing, auth, and API design — when Streamlit's layout isn't enough.",
    bestFor: "Custom APIs, complex backend logic, or pairing with a separate frontend",
  },
  {
    label: "Next.js",
    sublabel: "JavaScript / React",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
    },
    tag: "Production-grade",
    deployOn: "Vercel (free for personal) · Railway",
    description: "Polished, production-grade web applications. What you'd build if this were a real product — used by Notion, eBay, The Washington Post.",
    bestFor: "Portfolio sites, products someone will rely on, anything that needs real UI polish",
  },
  {
    label: "PWA",
    sublabel: "JS / HTML / CSS",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    color: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
    },
    tag: "Mobile-first",
    deployOn: "Any web host",
    description: "Mobile-first experiences that install like native apps without an app store. Works offline, installs to the home screen.",
    bestFor: "Latency-sensitive or offline-capable tools; mobile-first user experiences",
  },
];

export default function DemoFrameworksGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Demo Frameworks
        </span>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[2fr_3fr_2fr_2fr] gap-0 border-b border-slate-100 bg-slate-50 px-5 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Framework</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">What it is</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Best for</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Deploy on</span>
      </div>

      <div className="divide-y divide-slate-100">
        {FRAMEWORKS.map(({ label, sublabel, icon, color, tag, deployOn, description, bestFor }) => (
          <div
            key={label}
            className="grid grid-cols-[2fr_3fr_2fr_2fr] gap-0 px-5 py-3 items-center hover:bg-slate-50/60 transition-colors"
          >
            {/* Framework name */}
            <div className="flex items-center gap-2.5 pr-4">
              <div className={`shrink-0 p-1.5 rounded-lg ${color.bg} border ${color.border} ${color.icon}`}>{icon}</div>
              <div>
                <div className="text-xs font-bold text-slate-800 leading-tight">{label}</div>
                <div className="text-[10px] text-slate-400">{sublabel}</div>
              </div>
            </div>

            {/* What it is */}
            <div className="pr-4">
              <div className="text-xs text-slate-600 leading-relaxed">{description}</div>
            </div>

            {/* Best for */}
            <div className="pr-4 flex flex-col gap-1">
              <span className={`self-start text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${color.badge}`}>{tag}</span>
              <div className="text-xs text-slate-600 leading-relaxed">{bestFor}</div>
            </div>

            {/* Deploy on */}
            <div className="text-[11px] text-slate-500 leading-relaxed">{deployOn}</div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">Tight timeline and Python-only? Streamlit or Gradio. Want polish or a real product? Next.js. Most portfolios use at least two of these simultaneously — a Streamlit demo on Hugging Face Spaces linked from a Next.js personal site.</p>
      </div>
    </div>
  );
}
