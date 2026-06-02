"use client";

import { useState } from "react";

type Answer = string | null;

interface Question {
  id: string;
  text: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "structure",
    text: "What is the structure of your data?",
    options: [
      { value: "structured", label: "Structured — rows and columns, consistent schema (orders, users, events)" },
      { value: "semi", label: "Semi-structured — JSON, XML, nested documents (logs, API responses)" },
      { value: "unstructured", label: "Unstructured — text, images, audio, video" },
      { value: "vectors", label: "High-dimensional vectors / embeddings from ML models" },
    ],
  },
  {
    id: "volume",
    text: "What is the data volume and velocity?",
    options: [
      { value: "small-slow", label: "Small / slow — fits on one server, updated infrequently" },
      { value: "medium", label: "Medium — gigabytes to terabytes, moderate write frequency" },
      { value: "large-fast", label: "Large / fast — terabytes+, high-throughput writes or streaming" },
    ],
  },
  {
    id: "access",
    text: "What is the primary access pattern?",
    options: [
      { value: "transactional", label: "Transactional — read/write individual records, strict consistency" },
      { value: "analytical", label: "Analytical — aggregate queries, dashboards, BI reporting" },
      { value: "similarity", label: "Similarity search — find items closest to a query vector" },
      { value: "flexible", label: "Flexible / exploratory — varied queries, schema evolves often" },
    ],
  },
  {
    id: "scale",
    text: "Do you need to scale across multiple machines?",
    options: [
      { value: "no", label: "No — single server is fine for foreseeable future" },
      { value: "maybe", label: "Maybe — needs to grow but no hard distributed requirement" },
      { value: "yes", label: "Yes — horizontal scale is a hard requirement" },
    ],
  },
];

interface Recommendation {
  type: string;
  examples: string;
  why: string;
  color: string;
  icon: string;
}

function recommend(answers: Record<string, Answer>): Recommendation | null {
  const { structure, access, scale } = answers;
  if (!structure || !access || !scale) return null;

  if (structure === "vectors") {
    return {
      type: "Vector Database",
      examples: "Pinecone, Weaviate, Chroma, pgvector",
      why: "Your data is embeddings and your queries are similarity lookups — vector databases are purpose-built for approximate nearest-neighbor search at scale.",
      color: "bg-violet-50 border-violet-200 text-violet-800",
      icon: "◈",
    };
  }

  if (access === "similarity") {
    return {
      type: "Vector Database",
      examples: "Pinecone, Weaviate, Chroma, pgvector",
      why: "Similarity search requires vector indexing (HNSW, IVFFlat). Traditional databases are not designed for this access pattern.",
      color: "bg-violet-50 border-violet-200 text-violet-800",
      icon: "◈",
    };
  }

  if (access === "analytical" && (scale === "yes" || scale === "maybe")) {
    return {
      type: "Data Warehouse",
      examples: "Snowflake, BigQuery, Amazon Redshift",
      why: "Analytical queries over large datasets are what warehouses are optimized for. Columnar storage makes aggregations fast; managed compute scales on demand.",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
      icon: "⬡",
    };
  }

  if (structure === "unstructured" || (structure === "semi" && access === "flexible")) {
    if (scale === "yes") {
      return {
        type: "Data Lake",
        examples: "AWS S3, Azure Data Lake, Google Cloud Storage",
        why: "Your raw, heterogeneous data needs cheap scalable storage with no upfront schema. Apply schema at read time with tools like Spark or Athena.",
        color: "bg-cyan-50 border-cyan-200 text-cyan-800",
        icon: "≋",
      };
    }
    return {
      type: "Document Store (NoSQL)",
      examples: "MongoDB, Firestore, DynamoDB",
      why: "Semi-structured or schema-flexible data with varied documents fits a document store better than a rigid relational schema.",
      color: "bg-amber-50 border-amber-200 text-amber-800",
      icon: "◻",
    };
  }

  if (access === "transactional" && structure === "structured") {
    if (scale === "yes") {
      return {
        type: "Distributed NoSQL",
        examples: "Cassandra, DynamoDB, CockroachDB",
        why: "High-throughput transactional workloads that must scale horizontally need a distributed store with partition tolerance.",
        color: "bg-rose-50 border-rose-200 text-rose-800",
        icon: "⬡",
      };
    }
    return {
      type: "Relational Database",
      examples: "PostgreSQL, MySQL, SQLite",
      why: "Structured data with consistent schema and transactional requirements is exactly what relational databases were built for. Strong consistency, rich query language, proven reliability.",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: "▦",
    };
  }

  if (access === "analytical" && scale === "no") {
    return {
      type: "Relational Database",
      examples: "PostgreSQL, DuckDB",
      why: "At small scale, a relational database handles analytics fine. DuckDB in particular is optimized for in-process analytics on moderate data volumes.",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: "▦",
    };
  }

  return {
    type: "Relational Database",
    examples: "PostgreSQL, MySQL",
    why: "Based on your requirements, a standard relational database is the most versatile and well-supported starting point.",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    icon: "▦",
  };
}

export default function StoragePicker() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const rec = recommend(answers);

  function reset() {
    setAnswers({});
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Storage Picker</span>
        <span className="text-xs text-slate-400">{answeredCount} / {QUESTIONS.length} answered</span>
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
                  className={`w-full text-left rounded-lg border px-4 py-2.5 text-sm transition-all ${
                    answers[q.id] === opt.value
                      ? "bg-indigo-50 border-indigo-300 text-indigo-800 ring-1 ring-indigo-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Recommendation */}
        {rec && (
          <div className={`rounded-xl border-2 p-5 ${rec.color}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl leading-none">{rec.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-bold mb-0.5">{rec.type}</div>
                <div className="text-xs font-mono opacity-75 mb-2">{rec.examples}</div>
                <p className="text-sm leading-relaxed">{rec.why}</p>
              </div>
            </div>
          </div>
        )}

        {answeredCount > 0 && (
          <button
            onClick={reset}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        Framework from Ch. 1.6 — answer all four questions to see a recommendation with reasoning.
      </div>
    </div>
  );
}
