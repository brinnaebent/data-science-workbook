"use client";

import { useState } from "react";

type Step = "idle" | "partition" | "execute" | "collect";

const PARTITIONS = [
  { id: 0, label: "Partition A", rows: "1M rows", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: 1, label: "Partition B", rows: "1M rows", color: "bg-violet-100 text-violet-800 border-violet-200" },
  { id: 2, label: "Partition C", rows: "1M rows", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
];

const EXECUTORS = [
  { id: 0, label: "Executor 1", colorActive: "bg-blue-50 border-blue-300", colorIdle: "bg-slate-50 border-slate-200", badge: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: 1, label: "Executor 2", colorActive: "bg-violet-50 border-violet-300", colorIdle: "bg-slate-50 border-slate-200", badge: "bg-violet-100 text-violet-700 border-violet-200" },
  { id: 2, label: "Executor 3", colorActive: "bg-emerald-50 border-emerald-300", colorIdle: "bg-slate-50 border-slate-200", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

const STEPS: { id: Step; label: string; description: string }[] = [
  { id: "idle", label: "Cluster idle", description: "The driver node holds the SparkContext and waits for a job. Executors are running but not yet assigned work." },
  { id: "partition", label: "Data partitioned", description: "The driver splits the dataset into partitions — independent chunks that can be processed in parallel across executors." },
  { id: "execute", label: "Tasks executing", description: "Each executor processes its assigned partition in memory. Intermediate results never touch disk unless memory is exhausted." },
  { id: "collect", label: "Results collected", description: "The driver gathers results from all executors and assembles the final output. Only the aggregated result travels over the network." },
];

export default function SparkArchitecture() {
  const [step, setStep] = useState<Step>("idle");

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const current = STEPS[stepIndex];

  const showPartitions = stepIndex >= 1;
  const showExecuting = stepIndex >= 2;
  const showCollect = stepIndex >= 3;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Spark Cluster Architecture
        </span>
        <span className="text-xs text-slate-400 font-mono">
          Step {stepIndex + 1} of {STEPS.length}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Step controls */}
        <div className="flex gap-2 flex-wrap">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                s.id === step
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {i + 1}. {s.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-600 leading-relaxed min-h-[52px]">
          {current.description}
        </div>

        {/* Diagram */}
        <div className="space-y-4">
          {/* Driver */}
          <div className="flex justify-center">
            <div className="rounded-xl border-2 border-indigo-300 bg-indigo-50 px-6 py-3 text-center shadow-sm min-w-[200px]">
              <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-0.5">Driver Node</div>
              <div className="text-sm font-bold text-indigo-900">SparkContext</div>
              <div className="mt-1.5 flex justify-center gap-1.5 flex-wrap">
                {showPartitions && PARTITIONS.map((p) => (
                  <span key={p.id} className={`text-[10px] font-mono px-2 py-0.5 rounded border ${p.color} transition-all`}>
                    {p.label}
                  </span>
                ))}
                {showCollect && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-indigo-100 text-indigo-700 border-indigo-300 animate-pulse">
                    ← collecting
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Arrows down */}
          {showPartitions && (
            <div className="flex justify-center gap-12">
              {EXECUTORS.map((ex) => (
                <div key={ex.id} className="flex flex-col items-center">
                  <svg width="2" height="28" viewBox="0 0 2 28" className="overflow-visible">
                    <line x1="1" y1="0" x2="1" y2="28" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 3" />
                    <polygon points="1,28 -3,20 5,20" fill="#818cf8" />
                  </svg>
                </div>
              ))}
            </div>
          )}

          {/* Executors */}
          <div className="grid grid-cols-3 gap-3">
            {EXECUTORS.map((ex, i) => (
              <div
                key={ex.id}
                className={`rounded-xl border-2 px-3 py-3 text-center transition-all ${
                  showExecuting ? ex.colorActive : ex.colorIdle
                }`}
              >
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{ex.label}</div>

                {showPartitions && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border inline-block mb-2 ${PARTITIONS[i].color}`}>
                    {PARTITIONS[i].label}
                  </span>
                )}

                <div className={`rounded-lg border px-2 py-1.5 text-[10px] leading-snug transition-all ${
                  showExecuting
                    ? `${ex.badge} font-medium`
                    : "bg-white border-slate-200 text-slate-400"
                }`}>
                  {showExecuting ? (
                    <>
                      <div className="font-semibold mb-0.5">in-memory</div>
                      <div>{PARTITIONS[i].rows}</div>
                    </>
                  ) : (
                    <div>idle</div>
                  )}
                </div>

                {showCollect && (
                  <div className="mt-2 text-[10px] text-indigo-500 font-semibold animate-pulse">
                    ↑ sending result
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hadoop vs Spark callout */}
        {showExecuting && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">vs. Hadoop MapReduce:</span> MapReduce would write these intermediate results to disk before the next step. Spark keeps them in memory — on iterative workloads this can be <span className="font-semibold">100× faster</span>.
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-5 text-xs text-slate-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded border-2 border-indigo-300 bg-indigo-50" />
          Driver (orchestrates)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded border-2 border-slate-300 bg-slate-50" />
          Executor (processes in memory)
        </span>
        <span className="flex items-center gap-1.5 ml-auto font-mono text-indigo-400">- - -</span>
        <span className="text-xs text-slate-400">task dispatch</span>
      </div>
    </div>
  );
}
