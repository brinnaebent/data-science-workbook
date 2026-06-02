"use client";

const OPTIONS = [
  {
    label: "Container",
    sublabel: "Docker + Kubernetes",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
    },
    tag: "Full control",
    examples: "AWS ECS · GKE · AKS",
    description: "Run containers on a managed cluster. You define resources, auto-scaling rules, and health checks. The cluster handles the rest.",
    bestFor: "High-traffic, production-grade APIs that need auto-scaling and fine-grained control",
  },
  {
    label: "Serverless",
    sublabel: "Functions",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
    tag: "Pay per call",
    examples: "AWS Lambda · Azure Functions · GCF",
    description: "Your model runs only when invoked — no idle cost. Scales automatically. Cold starts can add latency after periods of inactivity.",
    bestFor: "Low-traffic or bursty models where you don't want to pay for idle compute",
  },
  {
    label: "Managed ML",
    sublabel: "Platform",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    color: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      icon: "text-sky-500",
      badge: "bg-sky-100 text-sky-700",
    },
    tag: "Full MLOps stack",
    examples: "SageMaker · Vertex AI · Azure ML",
    description: "The platform handles deployment, endpoints, A/B testing, and monitoring. You bring the model; it handles the infrastructure.",
    bestFor: "Teams that want the full MLOps stack without building it themselves",
  },
  {
    label: "Model-as-a-Service",
    sublabel: "Hosted API",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    color: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      icon: "text-violet-500",
      badge: "bg-violet-100 text-violet-700",
    },
    tag: "Zero ops",
    examples: "HF Inference Endpoints · Replicate · OpenAI",
    description: "You call an HTTP endpoint. No infrastructure, no containers. You don't run the model at all — someone else does.",
    bestFor: "Prototyping, or when you don't want to run the model at all",
  },
  {
    label: "Edge",
    sublabel: "On-Device",
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
    tag: "No internet needed",
    examples: "TFLite · ONNX · Core ML",
    description: "The model is compiled and bundled with the app. Inference runs on the device — phone, sensor, vehicle. No network round-trip.",
    bestFor: "Latency-critical or privacy-sensitive applications with no reliable internet",
  },
];

export default function DeploymentOptionsGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Deployment Options
        </span>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[2fr_3fr_3fr] gap-0 border-b border-slate-100 bg-slate-50 px-5 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Option</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">What it is</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Best for</span>
      </div>

      <div className="divide-y divide-slate-100">
        {OPTIONS.map(({ label, sublabel, icon, color, tag, examples, description, bestFor }) => (
          <div
            key={label}
            className="grid grid-cols-[2fr_3fr_3fr] gap-0 px-5 py-3 items-center hover:bg-slate-50/60 transition-colors"
          >
            {/* Option name */}
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
              <div className="text-[10px] text-slate-400 mt-1 font-medium">{examples}</div>
            </div>

            {/* Best for */}
            <div className="flex flex-col gap-1">
              <span className={`self-start text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${color.badge}`}>{tag}</span>
              <div className="text-xs text-slate-600 leading-relaxed">{bestFor}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">The right choice depends on your traffic pattern, latency budget, team infrastructure expertise, and data privacy requirements. Most orgs end up using two or three of these simultaneously for different models.</p>
      </div>
    </div>
  );
}
