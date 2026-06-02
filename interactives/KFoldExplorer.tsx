"use client";

import { useState } from "react";

const K_OPTIONS = [3, 5, 10] as const;
type KValue = (typeof K_OPTIONS)[number];

const FOLD_COLORS = [
  { train: "bg-indigo-100 border-indigo-200", test: "bg-indigo-400 border-indigo-500" },
  { train: "bg-violet-100 border-violet-200", test: "bg-violet-400 border-violet-500" },
  { train: "bg-emerald-100 border-emerald-200", test: "bg-emerald-400 border-emerald-500" },
  { train: "bg-amber-100 border-amber-200", test: "bg-amber-400 border-amber-500" },
  { train: "bg-rose-100 border-rose-200", test: "bg-rose-400 border-rose-500" },
  { train: "bg-cyan-100 border-cyan-200", test: "bg-cyan-400 border-cyan-500" },
  { train: "bg-orange-100 border-orange-200", test: "bg-orange-400 border-orange-500" },
  { train: "bg-pink-100 border-pink-200", test: "bg-pink-400 border-pink-500" },
  { train: "bg-teal-100 border-teal-200", test: "bg-teal-400 border-teal-500" },
  { train: "bg-lime-100 border-lime-200", test: "bg-lime-400 border-lime-500" },
];

export default function KFoldExplorer() {
  const [k, setK] = useState<KValue>(5);
  const [iter, setIter] = useState(0);

  function changeK(v: KValue) {
    setK(v);
    setIter(0);
  }

  const testFoldColor = FOLD_COLORS[iter % FOLD_COLORS.length];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          K-Fold Cross-Validation
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1">k =</span>
          {K_OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => changeK(v)}
              className={`px-2.5 py-0.5 rounded text-xs font-semibold border transition-colors ${
                k === v
                  ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Grid: rows = iterations, columns = folds */}
        <div>
          <div className="flex gap-2 items-end mb-2">
            <div className="w-20 shrink-0" />
            {Array.from({ length: k }, (_, f) => (
              <div key={f} className="flex-1 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Fold {f + 1}
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            {Array.from({ length: k }, (_, i) => {
              const isActive = i === iter;
              return (
                <button
                  key={i}
                  onClick={() => setIter(i)}
                  className={`w-full flex gap-2 items-center rounded-lg py-1.5 transition-all ${
                    isActive ? "bg-slate-50" : "hover:bg-slate-50/60"
                  }`}
                >
                  <div className={`w-20 shrink-0 text-right pr-2 text-xs font-medium transition-colors ${
                    isActive ? "text-slate-700" : "text-slate-400"
                  }`}>
                    Iter {i + 1}
                  </div>

                  {Array.from({ length: k }, (_, f) => {
                    const isTest = f === i;
                    const c = FOLD_COLORS[f % FOLD_COLORS.length];
                    return (
                      <div
                        key={f}
                        className={`flex-1 h-8 rounded border text-[10px] font-bold flex items-center justify-center transition-all ${
                          isTest
                            ? `${c.test} text-white`
                            : `${c.train} text-slate-400 ${isActive ? "opacity-70" : ""}`
                        }`}
                      >
                        {isTest ? "TEST" : "train"}
                      </div>
                    );
                  })}
                </button>
              );
            })}
          </div>
        </div>

        {/* Insight callout */}
        <div className={`rounded-lg border px-4 py-3 ${testFoldColor.train} flex items-start gap-3`}>
          <div className={`mt-0.5 w-2.5 h-2.5 rounded-sm shrink-0 ${testFoldColor.test}`} />
          <p className="text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-700">Iteration {iter + 1}:</span>{" "}
            Fold {iter + 1} is held out for testing. The model trains on the other {k - 1} fold{k - 1 !== 1 ? "s" : ""}.
            After all {k} iterations,{" "}
            <span className="font-semibold text-slate-700">every sample has been in the test set exactly once.</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-4">
          <div>
            <span className="text-base font-bold text-slate-700">{k}</span>
            <span className="text-xs text-slate-400 ml-1">iterations</span>
          </div>
          <div>
            <span className="text-base font-bold text-slate-700">{Math.round((1 / k) * 100)}%</span>
            <span className="text-xs text-slate-400 ml-1">test per iter</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIter((i) => Math.max(0, i - 1))}
            disabled={iter === 0}
            className="px-3 py-1 rounded border text-xs font-medium border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs text-slate-400 px-2">{iter + 1} / {k}</span>
          <button
            onClick={() => setIter((i) => Math.min(k - 1, i + 1))}
            disabled={iter === k - 1}
            className="px-3 py-1 rounded border text-xs font-medium border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
