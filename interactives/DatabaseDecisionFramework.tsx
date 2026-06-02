"use client";

import { useState } from "react";

const DB_TYPES = [
  {
    id: "relational",
    label: "Relational",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="9" x2="9" y2="21" />
      </svg>
    ),
    rule: "Structured + transactional",
    examples: "Postgres, MySQL, SQLite",
    color: {
      bg: "bg-emerald-50",
      bgActive: "bg-emerald-100",
      border: "border-emerald-200",
      borderActive: "border-emerald-400",
      icon: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
      ring: "ring-emerald-400",
      dot: "bg-emerald-400",
    },
  },
  {
    id: "graph",
    label: "Graph",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="7" y1="7.5" x2="11" y2="16.5" />
        <line x1="17" y1="7.5" x2="13" y2="16.5" />
      </svg>
    ),
    rule: "Highly connected data",
    examples: "Neo4j, Neptune, OrientDB",
    color: {
      bg: "bg-violet-50",
      bgActive: "bg-violet-100",
      border: "border-violet-200",
      borderActive: "border-violet-400",
      icon: "text-violet-600",
      badge: "bg-violet-100 text-violet-700",
      ring: "ring-violet-400",
      dot: "bg-violet-400",
    },
  },
  {
    id: "keyvalue",
    label: "Key-Value / Column-Family",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="4" rx="1" />
        <rect x="2" y="11" width="20" height="4" rx="1" />
        <rect x="2" y="17" width="20" height="4" rx="1" />
      </svg>
    ),
    rule: "Massive scale, simple access",
    examples: "Redis, DynamoDB, Cassandra",
    color: {
      bg: "bg-amber-50",
      bgActive: "bg-amber-100",
      border: "border-amber-200",
      borderActive: "border-amber-400",
      icon: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
      ring: "ring-amber-400",
      dot: "bg-amber-400",
    },
  },
  {
    id: "document",
    label: "Document Store",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
    rule: "Schema-flexible documents",
    examples: "MongoDB, Firestore, DocumentDB",
    color: {
      bg: "bg-sky-50",
      bgActive: "bg-sky-100",
      border: "border-sky-200",
      borderActive: "border-sky-400",
      icon: "text-sky-600",
      badge: "bg-sky-100 text-sky-700",
      ring: "ring-sky-400",
      dot: "bg-sky-400",
    },
  },
];

interface Scenario {
  id: string;
  description: string;
  signal: string;
  answer: string;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "s1",
    description: "An e-commerce platform needs to track orders, payments, and inventory. Each transaction must either fully succeed or fully roll back.",
    signal: "Transactions, structured rows, strict consistency",
    answer: "relational",
    explanation: "ACID transactions are the giveaway — that's the relational model's defining strength. Orders and inventory are naturally tabular with consistent schemas.",
  },
  {
    id: "s2",
    description: "A fraud detection team needs to answer: 'Is this account within three hops of a known fraudulent account?' The network has millions of nodes.",
    signal: "Relationship traversal, hops, network",
    answer: "graph",
    explanation: "Multi-hop traversal is a native graph operation. In SQL it's a recursive self-join — expensive to write and catastrophically slow at scale.",
  },
  {
    id: "s3",
    description: "A ride-share app stores driver location, real-time availability, and session tokens for 10 million concurrent users. Every read is a simple key lookup.",
    signal: "High throughput, simple lookups, session state",
    answer: "keyvalue",
    explanation: "Key-value stores like Redis are built for sub-millisecond reads on simple patterns. You know the exact key every time — no complex queries needed.",
  },
  {
    id: "s4",
    description: "A CMS stores articles, each with a different set of custom fields — some have videos, some have image galleries, some have author bios, all with evolving schemas.",
    signal: "Variable fields per record, schema evolves, JSON-like",
    answer: "document",
    explanation: "Each article can have its own shape — exactly what document stores handle. Adding a new field means updating some documents, not running a migration on every row.",
  },
  {
    id: "s5",
    description: "An IoT platform ingests 50,000 temperature sensor readings per second from devices worldwide. Queries are always 'get all readings for sensor X in time range Y.'",
    signal: "Massive write volume, simple time-range access pattern",
    answer: "keyvalue",
    explanation: "Cassandra (column-family) is purpose-built for this: massive write throughput with simple, predictable access patterns. The query never changes — only the time range.",
  },
  {
    id: "s6",
    description: "A social network stores friendship connections between 500 million users. The core feature is 'people you may know' — friends of friends within two hops.",
    signal: "Friend-of-friend, relationship first-class, traversal",
    answer: "graph",
    explanation: "Friendships are edges, users are nodes. 'Friends of friends' is a two-hop traversal — trivial in a graph DB, a multi-join nightmare in SQL.",
  },
];

type State = "idle" | "correct" | "wrong";

export default function DatabaseDecisionFramework() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<State>("idle");
  const [score, setScore] = useState({ correct: 0, seen: 0 });

  const scenario = SCENARIOS[scenarioIdx];

  function handleSelect(id: string) {
    if (state !== "idle") return;
    setSelected(id);
    const isCorrect = id === scenario.answer;
    setState(isCorrect ? "correct" : "wrong");
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      seen: s.seen + 1,
    }));
  }

  function handleNext() {
    setSelected(null);
    setState("idle");
    setScenarioIdx((i) => (i + 1) % SCENARIOS.length);
  }

  const correctType = DB_TYPES.find((t) => t.id === scenario.answer)!;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Database Decision Framework
        </span>
        <span className="text-xs text-slate-400 font-mono">
          {score.seen > 0 ? `${score.correct}/${score.seen} correct` : `${SCENARIOS.length} scenarios`}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Scenario */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wide shrink-0">
              Scenario {scenarioIdx + 1}
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">{scenario.description}</p>
          </div>
        </div>

        {/* DB type buttons */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Which storage pattern fits best?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DB_TYPES.map((db) => {
              const isSelected = selected === db.id;
              const isCorrectAnswer = db.id === scenario.answer;
              const revealed = state !== "idle";

              let borderClass = `${db.color.bg} ${db.color.border}`;
              if (revealed && isCorrectAnswer) borderClass = `${db.color.bgActive} ${db.color.borderActive} ring-2 ${db.color.ring}`;
              else if (revealed && isSelected && !isCorrectAnswer) borderClass = "bg-red-50 border-red-300 ring-2 ring-red-300";
              else if (!revealed && isSelected) borderClass = `${db.color.bgActive} ${db.color.borderActive}`;

              return (
                <button
                  key={db.id}
                  onClick={() => handleSelect(db.id)}
                  disabled={state !== "idle"}
                  className={`rounded-xl border text-left p-3.5 flex items-start gap-3 transition-all duration-150 cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-400 ${borderClass}`}
                >
                  <span className={`mt-0.5 shrink-0 ${db.color.icon}`}>{db.icon}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800">{db.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{db.rule}</div>
                    {revealed && isCorrectAnswer && (
                      <div className="text-[10px] font-mono text-slate-500 mt-1">{db.examples}</div>
                    )}
                  </div>
                  {revealed && isCorrectAnswer && (
                    <svg className={`ml-auto shrink-0 mt-0.5 ${db.color.icon}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {revealed && isSelected && !isCorrectAnswer && (
                    <svg className="ml-auto shrink-0 mt-0.5 text-red-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {state !== "idle" && (
          <div className={`rounded-lg border p-4 ${state === "correct" ? `${correctType.color.bg} ${correctType.color.border}` : "bg-red-50 border-red-200"}`}>
            <div className="flex items-start gap-2 mb-1.5">
              <span className={`text-xs font-bold uppercase tracking-wide ${state === "correct" ? correctType.color.icon : "text-red-600"}`}>
                {state === "correct" ? "Correct" : "Not quite"}
              </span>
              {state === "wrong" && (
                <span className="text-xs text-slate-500">
                  — the right answer is <span className="font-semibold text-slate-700">{correctType.label}</span>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{scenario.explanation}</p>
            <div className="mt-2 text-xs text-slate-500">
              <span className="font-semibold">Signal: </span>{scenario.signal}
            </div>
          </div>
        )}

        {/* Next button */}
        {state !== "idle" && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              {scenarioIdx === SCENARIOS.length - 1 ? "Start over" : "Next scenario →"}
            </button>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
        {DB_TYPES.map((db) => (
          <span key={db.id} className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${db.color.dot}`} />
            {db.label.split(" /")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
