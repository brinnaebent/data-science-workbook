"use client";

import { useState } from "react";

const STAGES = [
  {
    id: "plan",
    label: "Plan",
    phase: "ci",
    color: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      active: "bg-slate-100 border-slate-400",
      icon: "text-slate-500",
      badge: "bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    what: "Define requirements, success criteria, and scope before writing a line of code.",
    validates: "Nothing runs yet — this is the spec that all later gates measure against.",
    examples: ["What metric defines success?", "What data do we have?", "What's the latency budget?"],
  },
  {
    id: "code",
    label: "Code",
    phase: "ci",
    color: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      active: "bg-violet-100 border-violet-400",
      icon: "text-violet-500",
      badge: "bg-violet-100 text-violet-700",
      dot: "bg-violet-400",
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    what: "Write preprocessing logic, feature transformations, and training scripts.",
    validates: "Code quality — unit tests run on every push. Linting, type checks.",
    examples: ["Does the feature scaler handle nulls?", "Does the tokenizer handle Unicode?", "Do all imports resolve?"],
  },
  {
    id: "build",
    label: "Build",
    phase: "ci",
    color: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      active: "bg-sky-100 border-sky-400",
      icon: "text-sky-500",
      badge: "bg-sky-100 text-sky-700",
      dot: "bg-sky-400",
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    what: "Package code into a reproducible container with all dependencies locked.",
    validates: "Environment integrity — the container that trains must match the one that serves.",
    examples: ["Are all pip packages pinned?", "Does the Docker image build cleanly?", "Are CUDA versions compatible?"],
  },
  {
    id: "test",
    label: "Test",
    phase: "ci",
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      active: "bg-indigo-100 border-indigo-400",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
      dot: "bg-indigo-400",
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    what: "Three parallel validation tracks run: code, data, and model.",
    validates: "All three layers — this is where ML CI/CD differs from software CI/CD.",
    examples: [
      "Code: unit tests, integration tests",
      "Data: schema checks, distribution drift, completeness",
      "Model: holdout evaluation vs. current production baseline",
    ],
  },
  {
    id: "release",
    label: "Release",
    phase: "cd",
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      active: "bg-amber-100 border-amber-400",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
      dot: "bg-amber-400",
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 8 12 12 14 14" />
      </svg>
    ),
    what: "The validated artifact (model + container) is tagged and published to the registry.",
    validates: "Version lineage — model v17, data v9, code v42, config v3 are all linked here.",
    examples: ["Push to model registry (MLflow, W&B)", "Tag Docker image with git SHA", "Record experiment metadata"],
  },
  {
    id: "deploy",
    label: "Deploy",
    phase: "cd",
    color: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      active: "bg-orange-100 border-orange-400",
      icon: "text-orange-500",
      badge: "bg-orange-100 text-orange-700",
      dot: "bg-orange-400",
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    what: "The new version is promoted — initially as a canary, then to full traffic.",
    validates: "Deployment health — traffic gradually shifts; rollback triggers if error rate spikes.",
    examples: ["Canary: 5% → 25% → 100% traffic", "Blue/green: instant cut-over with a fallback", "Auto-rollback if p99 latency > threshold"],
  },
  {
    id: "operate",
    label: "Operate",
    phase: "cd",
    color: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      active: "bg-emerald-100 border-emerald-400",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-400",
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    what: "The system runs in production. SLAs are enforced, on-call rotation is active.",
    validates: "Reliability — uptime, latency, throughput. The model is now a live service.",
    examples: ["99.9% uptime SLA", "p95 latency < 200ms", "Auto-scaling under load"],
  },
  {
    id: "monitor",
    label: "Monitor",
    phase: "cd",
    color: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      active: "bg-rose-100 border-rose-400",
      icon: "text-rose-500",
      badge: "bg-rose-100 text-rose-700",
      dot: "bg-rose-400",
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    what: "Continuous observation of model behavior, data drift, and business metrics.",
    validates: "Ongoing quality — detects distribution shift before it silently degrades predictions.",
    examples: ["Feature distribution drift (PSI, KS test)", "Prediction confidence decay", "Business metric regression → triggers retraining"],
  },
];

const PHASE_META = {
  ci: { label: "Continuous Integration", color: "bg-indigo-100 text-indigo-700" },
  cd: { label: "Continuous Deployment", color: "bg-amber-100 text-amber-700" },
};

export default function MLCICDPipeline() {
  const [active, setActive] = useState<string | null>(null);

  const activeStage = STAGES.find((s) => s.id === active) ?? null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          ML CI/CD Pipeline
        </span>
      </div>

      {/* Pipeline flow */}
      <div className="p-5 pb-3">
        {/* Phase labels */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="col-span-4 flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
              ← Continuous Integration
            </span>
          </div>
          <div className="col-span-4 flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">
              Continuous Deployment →
            </span>
          </div>
        </div>

        {/* Stage chips */}
        <div className="grid grid-cols-8 gap-1">
          {STAGES.map((stage, i) => {
            const isActive = active === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActive(isActive ? null : stage.id)}
                className={`relative flex flex-col items-center gap-1 rounded-lg border px-1 py-2.5 text-center transition-all cursor-pointer
                  ${isActive ? stage.color.active : `${stage.color.bg} ${stage.color.border} hover:brightness-95`}`}
              >
                <span className={stage.color.icon}>{stage.icon}</span>
                <span className="text-[10px] font-semibold text-slate-700 leading-tight">{stage.label}</span>
                {i < STAGES.length - 1 && (
                  <span className="absolute -right-[5px] top-1/2 -translate-y-1/2 text-slate-300 text-[10px] z-10 pointer-events-none">›</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div className="px-5 pb-5">
        {activeStage ? (
          <div className={`rounded-xl border ${activeStage.color.border} ${activeStage.color.bg} p-4 transition-all`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={activeStage.color.icon}>{activeStage.icon}</span>
              <span className="text-sm font-bold text-slate-800">{activeStage.label}</span>
              <span className={`ml-auto text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${PHASE_META[activeStage.phase].color}`}>
                {PHASE_META[activeStage.phase].label}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-3">{activeStage.what}</p>

            <div className="mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">What gets validated</span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{activeStage.validates}</p>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Examples</span>
              <ul className="mt-1 space-y-0.5">
                {activeStage.examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
                    <span className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${activeStage.color.dot}`} />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-400">Select a stage to see what it validates.</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          ML CI/CD adds two validation layers that software CI/CD lacks: data validation and model evaluation against a holdout baseline. Both must pass before any version reaches production.
        </p>
      </div>
    </div>
  );
}
