"use client";

import { useState } from "react";

interface Question {
  id: string;
  text: string;
  options: { value: string; label: string; detail?: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "latency",
    text: "What are the latency requirements?",
    options: [
      { value: "realtime", label: "Real-time (<100ms)", detail: "User is waiting for an instant prediction" },
      { value: "fast", label: "Fast (<2s)", detail: "API response, near-real-time" },
      { value: "batch", label: "Batch (minutes to hours)", detail: "Nightly scoring, bulk inference" },
    ],
  },
  {
    id: "connectivity",
    text: "Does the model need internet connectivity?",
    options: [
      { value: "yes", label: "Yes — cloud infrastructure is fine" },
      { value: "no", label: "No — must work offline or on-device" },
    ],
  },
  {
    id: "privacy",
    text: "Can data leave the device or local environment?",
    options: [
      { value: "yes", label: "Yes — data can go to external servers" },
      { value: "no", label: "No — strict privacy / data residency requirements" },
    ],
  },
  {
    id: "traffic",
    text: "What is the expected traffic pattern?",
    options: [
      { value: "heavy", label: "High & steady — consistent load 24/7" },
      { value: "bursty", label: "Bursty — spiky or occasional usage" },
      { value: "low", label: "Low — a few calls per day" },
    ],
  },
  {
    id: "team",
    text: "What is your team's ML ops maturity?",
    options: [
      { value: "high", label: "High — dedicated ML engineers, existing infra" },
      { value: "medium", label: "Medium — some DevOps experience" },
      { value: "low", label: "Low — data scientists, minimal ops experience" },
    ],
  },
];

interface Recommendation {
  strategy: string;
  examples: string;
  why: string;
  tradeoffs: string;
  color: string;
  icon: string;
}

function recommend(answers: Record<string, string>): Recommendation | null {
  const { latency, connectivity, privacy, traffic, team } = answers;
  if (!latency || !connectivity || !privacy || !traffic || !team) return null;

  // Edge deployment
  if (connectivity === "no" || privacy === "no") {
    return {
      strategy: "Edge Deployment",
      examples: "TensorFlow Lite, ONNX Runtime, Core ML, MediaPipe",
      why: "Your constraints — offline capability or data residency — rule out cloud inference. Edge deployment packages the model to run directly on the device.",
      tradeoffs: "Model size is constrained by device memory. Complex models must be quantized or pruned. No centralized monitoring.",
      color: "bg-rose-50 border-rose-200 text-rose-800",
      icon: "⬡",
    };
  }

  if (latency === "batch") {
    if (team === "high") {
      return {
        strategy: "Managed ML Platform (Batch)",
        examples: "AWS SageMaker Batch Transform, Vertex AI Batch Prediction, Azure ML",
        why: "Batch inference with high ops maturity points to a managed ML platform — handles job scheduling, distributed compute, and monitoring out of the box.",
        tradeoffs: "Higher cost than serverless; vendor lock-in; overkill for very simple pipelines.",
        color: "bg-violet-50 border-violet-200 text-violet-800",
        icon: "◈",
      };
    }
    return {
      strategy: "Serverless / Functions",
      examples: "AWS Lambda, Google Cloud Functions, Azure Functions",
      why: "Batch workloads with low traffic and a small team are a great fit for serverless — zero infrastructure management, pay only when jobs run.",
      tradeoffs: "Cold start penalty if invocations are infrequent. Large models or heavy dependencies can hit memory/timeout limits.",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
      icon: "λ",
    };
  }

  if (latency === "realtime" && traffic === "heavy") {
    return {
      strategy: "Container (Kubernetes / Cloud Run)",
      examples: "AWS ECS/EKS, GKE, Azure AKS, Cloud Run",
      why: "High-traffic real-time inference needs always-warm containers with auto-scaling. Kubernetes handles load distribution and fault tolerance.",
      tradeoffs: "Requires DevOps investment. Cost is higher than serverless for low traffic. Orchestration complexity.",
      color: "bg-cyan-50 border-cyan-200 text-cyan-800",
      icon: "⬡",
    };
  }

  if (latency === "realtime" && traffic === "bursty") {
    if (team === "low") {
      return {
        strategy: "Model-as-a-Service",
        examples: "Hugging Face Inference Endpoints, Replicate, Modal",
        why: "Bursty real-time traffic with a small team is best served by a managed endpoint — you call an API, they handle the infrastructure.",
        tradeoffs: "Data leaves your infrastructure. Vendor dependency. Latency adds a network hop.",
        color: "bg-emerald-50 border-emerald-200 text-emerald-800",
        icon: "↗",
      };
    }
    return {
      strategy: "Serverless (keep warm)",
      examples: "AWS Lambda with Provisioned Concurrency, Google Cloud Run",
      why: "Bursty traffic can be served serverlessly if you configure provisioned concurrency to avoid cold starts on the critical path.",
      tradeoffs: "Provisioned concurrency costs money even when idle. Memory limits constrain model size.",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
      icon: "λ",
    };
  }

  if (team === "low" || traffic === "low") {
    return {
      strategy: "Model-as-a-Service",
      examples: "Hugging Face Inference Endpoints, Replicate, OpenAI API",
      why: "Low traffic and a small team point to a fully managed option — no servers to maintain, simple HTTP API, pay per call.",
      tradeoffs: "Data leaves your infrastructure. Ongoing API costs. Limited control over model behavior.",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: "↗",
    };
  }

  return {
    strategy: "Managed ML Platform",
    examples: "AWS SageMaker, Google Vertex AI, Azure ML",
    why: "Your combination of requirements points to a full managed ML platform — integrated endpoints, monitoring, versioning, and scaling with lower ops overhead than raw Kubernetes.",
    tradeoffs: "Vendor lock-in. Pricing can be opaque. Overkill for simple models.",
    color: "bg-violet-50 border-violet-200 text-violet-800",
    icon: "◈",
  };
}

export default function DeploymentDecisionTree() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const answered = Object.values(answers).filter(Boolean).length;
  const rec = recommend(answers);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deployment Decision Tree</span>
        <span className="text-xs text-slate-400">{answered} / {QUESTIONS.length} answered</span>
      </div>

      <div className="p-5 space-y-6">
        {QUESTIONS.map((q, qi) => (
          <div key={q.id}>
            <p className="text-sm font-medium text-slate-700 mb-3">
              <span className="inline-block w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold text-center leading-5 mr-2">{qi + 1}</span>
              {q.text}
            </p>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                  className={`w-full text-left rounded-lg border px-4 py-2.5 transition-all ${
                    answers[q.id] === opt.value
                      ? "bg-indigo-50 border-indigo-300 text-indigo-800 ring-1 ring-indigo-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="text-sm font-medium">{opt.label}</div>
                  {opt.detail && <div className="text-xs text-slate-400 mt-0.5">{opt.detail}</div>}
                </button>
              ))}
            </div>
          </div>
        ))}

        {rec && (
          <div className={`rounded-xl border-2 p-5 ${rec.color}`}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl leading-none">{rec.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-bold">{rec.strategy}</div>
                <div className="text-xs font-mono opacity-75 mt-0.5">{rec.examples}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-2">{rec.why}</p>
            <p className="text-xs opacity-75 leading-relaxed"><strong>Trade-offs:</strong> {rec.tradeoffs}</p>
          </div>
        )}

        {answered > 0 && (
          <button
            onClick={() => setAnswers({})}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        The right deployment option depends on your constraints, not just your model.
      </div>
    </div>
  );
}
