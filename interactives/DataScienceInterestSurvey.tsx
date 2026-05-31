"use client";

import { useState } from "react";

// ---- Question types ----

interface LikertQuestion {
  id: string;
  type: "likert";
  question: string;
  labels: string[];
}

interface RankQuestion {
  id: string;
  type: "rank";
  question: string;
  items: string[];
}

interface SliderQuestion {
  id: string;
  type: "slider";
  question: string;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  unit?: string;
}

interface MultiSelectQuestion {
  id: string;
  type: "multiselect";
  question: string;
  options: string[];
}

type Question = LikertQuestion | RankQuestion | SliderQuestion | MultiSelectQuestion;

// ---- Survey questions ----

const QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "likert",
    question: "I enjoy finding patterns in data.",
    labels: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
  },
  {
    id: "q2",
    type: "likert",
    question: "Learning statistics and math feels rewarding to me.",
    labels: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
  },
  {
    id: "q3",
    type: "slider",
    question: "How many hours per week do you currently spend working with data (spreadsheets, code, charts, etc.)?",
    min: 0,
    max: 40,
    minLabel: "0 hrs",
    maxLabel: "40+ hrs",
    unit: "hrs/wk",
  },
  {
    id: "q4",
    type: "multiselect",
    question: "Which of these data science applications interest you most? (Select all that apply)",
    options: [
      "Machine learning & AI",
      "Data visualization",
      "Public health & medicine",
      "Business analytics",
      "Social science research",
      "Sports analytics",
      "Climate & environment",
      "Natural language processing",
    ],
  },
  {
    id: "q5",
    type: "likert",
    question: "I feel confident writing code to analyze data.",
    labels: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
  },
  {
    id: "q6",
    type: "rank",
    question: "Rank these data science skills from most to least important to learn first (use arrows to reorder).",
    items: ["Programming (Python/R)", "Statistics", "Data visualization", "Domain expertise"],
  },
  {
    id: "q7",
    type: "likert",
    question: "I would consider a career in data science.",
    labels: ["Definitely not", "Probably not", "Unsure", "Probably yes", "Definitely yes"],
  },
];

// ---- Interest score helper ----

function computeScore(answers: Record<string, unknown>): number | null {
  const likertIds = ["q1", "q2", "q5", "q7"];
  const values = likertIds.map((id) => answers[id] as number | undefined);
  if (values.some((v) => v === undefined)) return null;
  const sum = values.reduce<number>((acc, v) => acc + (v as number), 0);
  return Math.round((sum / (likertIds.length * 4)) * 100);
}

// ---- Sub-components ----

function LikertRow({ q, value, onChange }: { q: LikertQuestion; value: number | undefined; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-700 leading-relaxed">{q.question}</p>
      <div className="flex gap-1 flex-wrap">
        {q.labels.map((label, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`flex-1 min-w-[60px] py-2 px-1 rounded-md border text-xs text-center transition-colors cursor-pointer leading-tight
              ${value === i
                ? "bg-indigo-50 border-indigo-400 text-indigo-700 font-semibold"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SliderRow({ q, value, onChange }: { q: SliderQuestion; value: number | undefined; onChange: (v: number) => void }) {
  const current = value ?? q.min;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-700 leading-relaxed">{q.question}</p>
      <div className="flex flex-col gap-1.5">
        <input
          type="range"
          min={q.min}
          max={q.max}
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-indigo-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>{q.minLabel}</span>
          <span className="text-indigo-600 font-semibold tabular-nums">
            {current} {q.unit}
          </span>
          <span>{q.maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

function MultiSelectRow({ q, value, onChange }: { q: MultiSelectQuestion; value: string[] | undefined; onChange: (v: string[]) => void }) {
  const selected = value ?? [];
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-700 leading-relaxed">{q.question}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`py-2 px-3 rounded-md border text-xs text-left transition-colors cursor-pointer
              ${selected.includes(opt)
                ? "bg-indigo-50 border-indigo-400 text-indigo-700 font-semibold"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function RankRow({ q, value, onChange }: { q: RankQuestion; value: string[] | undefined; onChange: (v: string[]) => void }) {
  const order = value ?? [...q.items];
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-700 leading-relaxed">{q.question}</p>
      <div className="flex flex-col gap-1.5">
        {order.map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2"
          >
            <span className="text-[11px] font-semibold text-slate-400 w-4 shrink-0 tabular-nums">{i + 1}</span>
            <span className="text-xs text-slate-700 flex-1">{item}</span>
            <div className="flex gap-1">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-slate-400 hover:text-slate-700 disabled:opacity-25 cursor-pointer disabled:cursor-default text-xs px-1"
                aria-label="Move up"
              >▲</button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === order.length - 1}
                className="text-slate-400 hover:text-slate-700 disabled:opacity-25 cursor-pointer disabled:cursor-default text-xs px-1"
                aria-label="Move down"
              >▼</button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-400">Use the arrows to reorder.</p>
    </div>
  );
}

// ---- Score result panel ----

function ScorePanel({ score, answers }: { score: number; answers: Record<string, unknown> }) {
  const interests = (answers["q4"] as string[] | undefined) ?? [];
  const tier =
    score >= 75 ? { label: "High", color: "text-emerald-600", bar: "bg-emerald-500" } :
    score >= 45 ? { label: "Moderate", color: "text-amber-600", bar: "bg-amber-500" } :
                  { label: "Early-stage", color: "text-sky-600", bar: "bg-sky-500" };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your interest score</p>
        <div className="flex items-end gap-3">
          <span className={`text-4xl font-bold tabular-nums ${tier.color}`}>{score}</span>
          <span className="text-slate-400 text-sm mb-1">/ 100</span>
          <span className={`text-sm font-semibold mb-1 ${tier.color}`}>{tier.label}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${tier.bar}`} style={{ width: `${score}%` }} />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">A note on this result</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          This score summarizes four self-reported Likert items about enjoyment, confidence, and career intent — the same type of scale used in real research instruments. It is not a prediction; it is a snapshot of how you described yourself right now.
        </p>
        {interests.length > 0 && (
          <p className="text-sm text-slate-600 leading-relaxed">
            Your stated interests — <span className="text-slate-800 font-medium">{interests.join(", ")}</span> — are the kind of signal a researcher might cross-tabulate with the Likert scores to find clusters of learner types.
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What this illustrates</p>
        <ul className="text-sm text-slate-600 leading-relaxed list-disc list-inside space-y-1">
          <li>Likert scales compress continuous attitudes into ordered categories.</li>
          <li>Sliders capture a different shape of data — continuous, bounded.</li>
          <li>Ranking forces preference orderings that ratings cannot reveal.</li>
          <li>Multi-select answers produce set-valued data — each row has a different number of values.</li>
        </ul>
      </div>
    </div>
  );
}

// ---- Main component ----

export default function DataScienceInterestSurvey() {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (id: string, val: unknown) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const score = computeScore(answers);
  const canSubmit = score !== null;

  const renderQuestion = (q: Question, i: number) => {
    const num = <span className="text-xs font-semibold text-slate-400 shrink-0 w-5">{i + 1}.</span>;
    return (
      <div key={q.id} className="flex gap-3">
        {num}
        <div className="flex-1">
          {q.type === "likert" && (
            <LikertRow q={q} value={answers[q.id] as number | undefined} onChange={(v) => setAnswer(q.id, v)} />
          )}
          {q.type === "slider" && (
            <SliderRow q={q} value={answers[q.id] as number | undefined} onChange={(v) => setAnswer(q.id, v)} />
          )}
          {q.type === "multiselect" && (
            <MultiSelectRow q={q} value={answers[q.id] as string[] | undefined} onChange={(v) => setAnswer(q.id, v)} />
          )}
          {q.type === "rank" && (
            <RankRow q={q} value={answers[q.id] as string[] | undefined} onChange={(v) => setAnswer(q.id, v)} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Survey: Data Science Interest
        </span>
        {!submitted && (
          <span className="text-[11px] text-slate-400">
            {Object.keys(answers).length} / {QUESTIONS.length} answered
          </span>
        )}
      </div>

      <div className="p-5">
        {!submitted ? (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              This survey uses four question formats common in real research instruments: <strong className="text-slate-800">Likert scales</strong>, a <strong className="text-slate-800">slider</strong>, a <strong className="text-slate-800">ranking task</strong>, and <strong className="text-slate-800">multi-select checkboxes</strong>. Answer honestly — the result reflects your responses, not a right answer.
            </p>

            {QUESTIONS.map((q, i) => renderQuestion(q, i))}

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <button
                disabled={!canSubmit}
                onClick={() => setSubmitted(true)}
                className={`px-4 py-2 rounded-md text-sm font-semibold border transition-colors cursor-pointer
                  ${canSubmit
                    ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                Submit
              </button>
              {!canSubmit && (
                <span className="text-[11px] text-slate-400">
                  Answer all four Likert questions to submit.
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <ScorePanel score={score!} answers={answers} />
            <button
              onClick={() => { setSubmitted(false); }}
              className="self-start px-3 py-1.5 rounded-md text-xs border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Retake survey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
