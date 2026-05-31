"use client";

import { useState } from "react";

type Label = "positive" | "negative" | "neutral";
type Status = "pending" | "accepted" | "corrected";

interface Item {
  text: string;
  aiLabel: Label;
  aiConfidence: number;
}

const ITEMS: Item[] = [
  {
    text: "The product exceeded all my expectations — I use it every day.",
    aiLabel: "positive",
    aiConfidence: 0.97,
  },
  {
    text: "It arrived on time. Nothing special, but it works.",
    aiLabel: "neutral",
    aiConfidence: 0.81,
  },
  {
    text: "Terrible quality. Broke after a week and customer service was no help.",
    aiLabel: "negative",
    aiConfidence: 0.93,
  },
  {
    text: "I love the design but the battery life is disappointing.",
    aiLabel: "neutral",
    aiConfidence: 0.61,
  },
  {
    text: "Exactly what I needed. Fast shipping too.",
    aiLabel: "positive",
    aiConfidence: 0.88,
  },
];

const LABEL_STYLES: Record<Label, string> = {
  positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
  negative: "bg-red-50 text-red-600 border-red-200",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
};

const LABEL_BUTTON_ACTIVE: Record<Label, string> = {
  positive: "bg-emerald-100 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200",
  negative: "bg-red-100 text-red-600 border-red-300 ring-2 ring-red-200",
  neutral: "bg-slate-200 text-slate-700 border-slate-300 ring-2 ring-slate-300",
};

const LABEL_BUTTON_IDLE = "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50";

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = value >= 0.85 ? "bg-emerald-400" : value >= 0.70 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-500 tabular-nums">{pct}%</span>
    </div>
  );
}

export default function LabelingWorkflow() {
  const [current, setCurrent] = useState(0);
  const [decisions, setDecisions] = useState<{ label: Label; status: Status }[]>([]);
  const [selected, setSelected] = useState<Label | null>(null);
  const [done, setDone] = useState(false);

  const item = ITEMS[current];
  const isLast = current === ITEMS.length - 1;

  function submit() {
    if (!selected) return;
    const status: Status = selected === item.aiLabel ? "accepted" : "corrected";
    const next = [...decisions, { label: selected, status }];
    setDecisions(next);
    if (isLast) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function reset() {
    setCurrent(0);
    setDecisions([]);
    setSelected(null);
    setDone(false);
  }

  const accepted = decisions.filter((d) => d.status === "accepted").length;
  const corrected = decisions.filter((d) => d.status === "corrected").length;

  if (done) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Labeling Workflow — Session Complete
          </span>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-slate-100 bg-slate-50 py-4">
              <div className="text-2xl font-bold text-slate-700">{ITEMS.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Reviewed</div>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 py-4">
              <div className="text-2xl font-bold text-emerald-600">{accepted}</div>
              <div className="text-xs text-emerald-500 mt-0.5">Accepted</div>
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 py-4">
              <div className="text-2xl font-bold text-amber-600">{corrected}</div>
              <div className="text-xs text-amber-500 mt-0.5">Corrected</div>
            </div>
          </div>

          <div className="space-y-2">
            {ITEMS.map((it, i) => {
              const d = decisions[i];
              return (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-100 px-4 py-3 bg-slate-50">
                  <span className={`mt-0.5 inline-block px-2 py-0.5 rounded border text-xs font-semibold ${LABEL_STYLES[d.label]}`}>
                    {d.label}
                  </span>
                  <span className="flex-1 text-sm text-slate-600 leading-snug">{it.text}</span>
                  {d.status === "corrected" && (
                    <span className="text-xs text-amber-500 font-medium whitespace-nowrap">corrected</span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={reset}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Labeling Workflow
        </span>
        <span className="text-xs text-slate-400 font-mono">
          {current + 1} / {ITEMS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-indigo-300 transition-all duration-300"
          style={{ width: `${(current / ITEMS.length) * 100}%` }}
        />
      </div>

      <div className="p-5 space-y-5">
        {/* Review history strip */}
        {decisions.length > 0 && (
          <div className="flex gap-1.5">
            {decisions.map((d, i) => (
              <span
                key={i}
                className={`inline-block px-2 py-0.5 rounded border text-xs font-mono ${LABEL_STYLES[d.label]}`}
                title={d.status}
              >
                {d.label[0].toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Review item */}
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-4">
          <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
        </div>

        {/* AI proposal */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">AI proposal</span>
            <span className={`inline-block px-2.5 py-0.5 rounded border text-xs font-semibold ${LABEL_STYLES[item.aiLabel]}`}>
              {item.aiLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 w-20">Confidence</span>
            <ConfidenceBar value={item.aiConfidence} />
          </div>
          {item.aiConfidence < 0.70 && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded px-3 py-1.5">
              Low confidence — review carefully.
            </p>
          )}
        </div>

        {/* Human decision */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Your label</span>
          <div className="flex gap-2">
            {(["positive", "neutral", "negative"] as Label[]).map((label) => (
              <button
                key={label}
                onClick={() => setSelected(label)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all capitalize ${
                  selected === label ? LABEL_BUTTON_ACTIVE[label] : LABEL_BUTTON_IDLE
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {selected && selected !== item.aiLabel && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded px-3 py-1.5">
              Overriding AI — this will be marked as a correction.
            </p>
          )}
        </div>

        <button
          onClick={submit}
          disabled={!selected}
          className="w-full rounded-lg bg-indigo-600 text-white text-sm font-semibold py-2.5 disabled:opacity-40 hover:bg-indigo-700 transition-colors"
        >
          {isLast ? "Finish session" : "Submit & next →"}
        </button>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-emerald-50 border border-emerald-200" />
          Positive
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-slate-100 border border-slate-200" />
          Neutral
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-red-50 border border-red-200" />
          Negative
        </span>
      </div>
    </div>
  );
}
