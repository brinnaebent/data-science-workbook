"use client";

import { useState, useCallback } from "react";

const TOTAL = 100;

const PRESETS = [
  { label: "60 / 20 / 20", train: 60, val: 20, test: 20 },
  { label: "70 / 15 / 15", train: 70, val: 15, test: 15 },
  { label: "80 / 10 / 10", train: 80, val: 10, test: 10 },
];

type Phase = "idle" | "training" | "tuning" | "locked" | "evaluating" | "done";

const PHASE_SEQUENCE: Phase[] = ["idle", "training", "tuning", "locked", "evaluating", "done"];

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Set your split",
  training: "Training",
  tuning: "Tuning on validation",
  locked: "Test set locked",
  evaluating: "Final evaluation",
  done: "Done",
};

const PHASE_DESC: Record<Phase, string> = {
  idle: "Drag the handles or pick a preset to set your train / validation / test proportions. Then step through the workflow.",
  training: "The model trains on the train set only. It never sees validation or test data during this phase.",
  tuning: "You try multiple architectures, hyperparameters, and feature sets — always evaluating on the validation set. The test set stays untouched.",
  locked: "Tuning is complete. The test set is sealed. You commit to one final model before opening it.",
  evaluating: "The test set is opened exactly once. This single number is what you report. Repeating this step would contaminate the test set.",
  done: "Reported performance is trustworthy because the test set was used only once, after all decisions were already made.",
};

const SET_COLORS = {
  train: {
    active: "bg-blue-500 text-white",
    dim: "bg-blue-100 text-blue-400 border-blue-200",
    pill: "bg-blue-100 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
    label: "text-blue-700",
  },
  val: {
    active: "bg-violet-500 text-white",
    dim: "bg-violet-100 text-violet-400 border-violet-200",
    pill: "bg-violet-100 text-violet-800 border-violet-200",
    dot: "bg-violet-500",
    label: "text-violet-700",
  },
  test: {
    active: "bg-emerald-500 text-white",
    dim: "bg-emerald-50 text-emerald-300 border-emerald-100",
    locked: "bg-emerald-100 text-emerald-600 border-emerald-300 ring-2 ring-inset ring-emerald-400",
    pill: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
    label: "text-emerald-700",
  },
};

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

type SetKey = "train" | "val" | "test";

function Bar({ train, val, test, phase }: { train: number; val: number; test: number; phase: Phase }) {
  const trainActive = ["training", "tuning", "evaluating", "done"].includes(phase);
  const valActive = ["tuning", "evaluating", "done"].includes(phase);
  const testActive = ["evaluating", "done"].includes(phase);
  const testLocked = phase === "locked";

  return (
    <div className="relative w-full h-10 rounded-lg overflow-hidden flex border border-slate-200" style={{ userSelect: "none" }}>
      <div
        className={`flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
          trainActive ? SET_COLORS.train.active : SET_COLORS.train.dim
        }`}
        style={{ width: `${train}%` }}
      >
        {train >= 8 && `${train}%`}
      </div>
      <div
        className={`flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
          valActive ? SET_COLORS.val.active : SET_COLORS.val.dim
        }`}
        style={{ width: `${val}%` }}
      >
        {val >= 8 && `${val}%`}
      </div>
      <div
        className={`flex items-center justify-center text-xs font-semibold transition-all duration-500 relative ${
          testActive
            ? SET_COLORS.test.active
            : testLocked
            ? SET_COLORS.test.locked
            : SET_COLORS.test.dim
        }`}
        style={{ width: `${test}%` }}
      >
        {test >= 8 && !testLocked && `${test}%`}
        {testLocked && (
          <span className="flex items-center gap-1 text-emerald-700 text-[10px] font-bold">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="6" width="10" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
              <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {test >= 12 && "sealed"}
          </span>
        )}
      </div>
    </div>
  );
}

const STEPS: { key: SetKey; label: string; action: string }[] = [
  { key: "train", label: "Train set", action: "fit model weights" },
  { key: "val", label: "Validation set", action: "select hyperparameters & architecture" },
  { key: "test", label: "Test set", action: "report final performance (once)" },
];

export default function ThreeSplitExplorer() {
  const [split, setSplit] = useState({ train: 70, val: 15, test: 15 });
  const [phaseIdx, setPhaseIdx] = useState(0);

  const phase = PHASE_SEQUENCE[phaseIdx];

  const setPreset = (p: { train: number; val: number; test: number }) => {
    setSplit(p);
    setPhaseIdx(0);
  };

  const handleTrainDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const bar = e.currentTarget.parentElement!;
      const rect = bar.getBoundingClientRect();
      const onMove = (ev: PointerEvent) => {
        const raw = Math.round(((ev.clientX - rect.left) / rect.width) * TOTAL);
        const newTrain = clamp(raw, 10, TOTAL - split.val - 5);
        const newTest = TOTAL - newTrain - split.val;
        if (newTest >= 5) setSplit({ train: newTrain, val: split.val, test: newTest });
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [split.val]
  );

  const handleValDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const bar = e.currentTarget.parentElement!;
      const rect = bar.getBoundingClientRect();
      const onMove = (ev: PointerEvent) => {
        const rawBoundary = Math.round(((ev.clientX - rect.left) / rect.width) * TOTAL);
        const newVal = clamp(rawBoundary - split.train, 5, TOTAL - split.train - 5);
        const newTest = TOTAL - split.train - newVal;
        if (newTest >= 5) setSplit({ train: split.train, val: newVal, test: newTest });
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [split.train]
  );

  const advance = () => setPhaseIdx((i) => Math.min(i + 1, PHASE_SEQUENCE.length - 1));
  const reset = () => setPhaseIdx(0);

  const trainActive = ["training", "tuning", "evaluating", "done"].includes(phase);
  const valActive = ["tuning", "evaluating", "done"].includes(phase);
  const testActive = ["evaluating", "done"].includes(phase);
  const testLocked = phase === "locked";

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Three-Split Workflow
        </span>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* Presets */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-500">Common split ratios:</p>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPreset(p)}
                className={`px-3 py-1 rounded-md text-xs font-mono border transition-colors cursor-pointer
                  ${split.train === p.train && split.val === p.val
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bar + drag handles */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Bar train={split.train} val={split.val} test={split.test} phase={phase} />

            {/* Train/Val boundary */}
            <div
              className="absolute top-0 h-full w-4 -translate-x-1/2 flex items-center justify-center cursor-col-resize z-10 group"
              style={{ left: `${split.train}%` }}
              onPointerDown={handleTrainDrag}
            >
              <div className="w-0.5 h-8 bg-slate-300 group-hover:bg-slate-500 rounded transition-colors" />
            </div>

            {/* Val/Test boundary */}
            <div
              className="absolute top-0 h-full w-4 -translate-x-1/2 flex items-center justify-center cursor-col-resize z-10 group"
              style={{ left: `${split.train + split.val}%` }}
              onPointerDown={handleValDrag}
            >
              <div className="w-0.5 h-8 bg-slate-300 group-hover:bg-slate-500 rounded transition-colors" />
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-[11px] text-slate-500 mt-1">
            {(["train", "val", "test"] as SetKey[]).map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm inline-block ${SET_COLORS[k].dot}`} />
                {k === "train" ? "Train" : k === "val" ? "Validation" : "Test"}
              </span>
            ))}
          </div>
        </div>

        {/* Workflow stepper */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {PHASE_LABELS[phase]}
            </span>
            <div className="flex gap-1">
              {PHASE_SEQUENCE.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-4 rounded-full transition-colors ${
                    i <= phaseIdx ? "bg-indigo-400" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            <p className="text-sm text-slate-500 leading-relaxed min-h-[3.5rem]">
              {PHASE_DESC[phase]}
            </p>

            {/* Set status pills */}
            <div className="flex gap-2 flex-wrap">
              {(["train", "val", "test"] as SetKey[]).map((k) => {
                const active = k === "train" ? trainActive : k === "val" ? valActive : testActive;
                const locked = k === "test" && testLocked;
                const c = SET_COLORS[k];
                return (
                  <span
                    key={k}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                      locked
                        ? c.pill + " ring-1 ring-emerald-300"
                        : active
                        ? c.pill
                        : "text-slate-400 border-slate-200 bg-slate-50"
                    }`}
                  >
                    {locked ? "🔒 " : active ? "▶ " : "○ "}
                    {k === "train" ? `Train (${split.train}%)` : k === "val" ? `Validation (${split.val}%)` : `Test (${split.test}%)`}
                    {locked && " — sealed"}
                  </span>
                );
              })}
            </div>

            {/* Action button */}
            <div className="flex gap-2 mt-1">
              {phase !== "done" ? (
                <button
                  onClick={advance}
                  className="px-4 py-1.5 rounded-md text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
                >
                  {phase === "idle" ? "Start workflow →" : "Next step →"}
                </button>
              ) : (
                <button
                  onClick={reset}
                  className="px-4 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  ↺ Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary table */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">
            Which operations touch which set?
          </p>
          <div className="rounded-lg border border-slate-200 overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <div className="px-3 py-2 border-r border-slate-200">Set</div>
              <div className="px-3 py-2 border-r border-slate-200">Size</div>
              <div className="px-3 py-2">Used for</div>
            </div>
            {STEPS.map(({ key, label, action }) => {
              const c = SET_COLORS[key as SetKey];
              return (
                <div key={key} className="grid grid-cols-3 border-t border-slate-100 text-slate-600">
                  <div className={`px-3 py-2 border-r border-slate-100 font-semibold ${c.label}`}>
                    {label}
                  </div>
                  <div className="px-3 py-2 border-r border-slate-100 font-mono">{split[key as SetKey]}%</div>
                  <div className="px-3 py-2">{action}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
