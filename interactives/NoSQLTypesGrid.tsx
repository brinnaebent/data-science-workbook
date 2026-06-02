"use client";

import { useState } from "react";

const TYPES = [
  {
    label: "Document",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
    color: {
      bg: "bg-indigo-50",
      bgActive: "bg-indigo-100",
      border: "border-indigo-200",
      borderActive: "border-indigo-400",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
    },
    tag: "Flexible schema",
    stores: "JSON-like objects, each self-describing",
    reachFor: "Content management, user profiles, event logs — anything where each record can have a different shape.",
    detail: "Documents are self-describing: each record carries its own fields, and no two documents need the same shape. This makes document stores natural for content management systems, user profiles that gain new fields over time, and event logs where events differ by type. The trade-off is that rich cross-document queries (joins) are expensive or unsupported.",
    examples: ["MongoDB", "Couchbase", "DocumentDB"],
  },
  {
    label: "Key-Value",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="12" r="3" />
        <line x1="11" y1="12" x2="20" y2="12" />
        <path d="M17 9l3 3-3 3" />
      </svg>
    ),
    color: {
      bg: "bg-violet-50",
      bgActive: "bg-violet-100",
      border: "border-violet-200",
      borderActive: "border-violet-400",
      icon: "text-violet-500",
      badge: "bg-violet-100 text-violet-700",
    },
    tag: "Fastest lookup",
    stores: "Key → value pairs",
    reachFor: "Caching, session state, real-time lookups — when you know exactly what you're looking for.",
    detail: "The simplest storage primitive: a dictionary at scale. If you know the key, the lookup is O(1). This makes key-value stores the go-to choice for caching expensive computations, storing session tokens, and serving real-time features like leaderboards. They don't support queries over values — you look up by key or you don't look up at all.",
    examples: ["Redis", "DynamoDB", "Memcached"],
  },
  {
    label: "Column-Family",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="5" height="18" rx="1" />
        <rect x="10" y="3" width="5" height="18" rx="1" />
        <rect x="17" y="3" width="4" height="18" rx="1" />
      </svg>
    ),
    color: {
      bg: "bg-emerald-50",
      bgActive: "bg-emerald-100",
      border: "border-emerald-200",
      borderActive: "border-emerald-400",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
    },
    tag: "Massive scale",
    stores: "Rows grouped into column families",
    reachFor: "IoT telemetry, time-series at scale, very large web apps with simple access patterns.",
    detail: "Column-family stores organize data by column group rather than by row, which makes reading a small number of columns across billions of rows extremely fast. This is the architecture behind Google's Bigtable and influenced Cassandra and HBase. The sweet spot is write-heavy, append-mostly workloads where you query the same columns repeatedly — sensor readings, click streams, audit logs at massive scale.",
    examples: ["Cassandra", "HBase", "Bigtable"],
  },
  {
    label: "Graph",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <line x1="9" y1="11" x2="15" y2="7" />
        <line x1="9" y1="13" x2="15" y2="17" />
      </svg>
    ),
    color: {
      bg: "bg-amber-50",
      bgActive: "bg-amber-100",
      border: "border-amber-200",
      borderActive: "border-amber-400",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
    tag: "Relationship-first",
    stores: "Nodes and edges",
    reachFor: "Social networks, fraud detection, recommendations — any domain where relationships are first-class.",
    detail: "Graph databases store entities (nodes) and the relationships between them (edges) as first-class citizens. Multi-hop traversals that would require recursive joins in SQL are native operations here. Fraud detection is a canonical example: \"Is this account within three hops of a known fraudulent account?\" is a millisecond query in Neo4j and a nightmare in Postgres.",
    examples: ["Neo4j", "Neptune", "OrientDB"],
  },
];

export default function NoSQLTypesGrid() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Four NoSQL Types
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TYPES.map(({ label, icon, color, tag, stores, reachFor, detail, examples }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => setActive(isActive ? null : label)}
              className={`rounded-xl border text-left transition-all duration-150 p-4 flex flex-col gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 ${
                isActive
                  ? `${color.bgActive} ${color.borderActive} shadow-sm`
                  : `${color.bg} ${color.border} hover:shadow-sm`
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`${color.icon} mt-0.5`}>{icon}</div>
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${color.badge}`}>
                  {tag}
                </span>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-800 mb-1">{label}</div>
                <div className="text-xs text-slate-500 leading-relaxed italic mb-2">{stores}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{reachFor}</div>
              </div>

              {isActive && (
                <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-200/60 pt-3">
                  {detail}
                </div>
              )}

              <div className="mt-auto pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Examples</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {examples.map((ex) => (
                    <span key={ex} className="text-[10px] bg-white/70 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">Click a card to learn more. Each type trades away different relational guarantees in exchange for scale, flexibility, or query speed.</p>
      </div>
    </div>
  );
}
