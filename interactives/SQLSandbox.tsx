"use client";

import { useState } from "react";

type Row = Record<string, string | number | null>;

const CUSTOMERS: Row[] = [
  { id: 1, name: "Alice Chen", city: "Durham" },
  { id: 2, name: "Ben Mora", city: "Raleigh" },
  { id: 3, name: "Carmen Li", city: "Chapel Hill" },
  { id: 4, name: "David Park", city: "Durham" },
  { id: 5, name: "Eva Torres", city: "Cary" },
];

const ORDERS: Row[] = [
  { id: 101, customer_id: 1, amount: 149.99, product: "Laptop Stand" },
  { id: 102, customer_id: 1, amount: 29.99, product: "USB Hub" },
  { id: 103, customer_id: 2, amount: 399.0, product: "Monitor" },
  { id: 104, customer_id: 3, amount: 89.5, product: "Keyboard" },
  { id: 105, customer_id: 3, amount: 55.0, product: "Mouse" },
  { id: 106, customer_id: 6, amount: 12.0, product: "Cable" },
];

type JoinType = "inner" | "left" | "right" | "full";

function runJoin(joinType: JoinType): { cols: string[]; rows: Row[] } {
  const cols = ["c.id", "c.name", "c.city", "o.id as order_id", "o.amount", "o.product"];

  const results: Row[] = [];

  if (joinType === "inner") {
    for (const c of CUSTOMERS) {
      for (const o of ORDERS) {
        if (o.customer_id === c.id) {
          results.push({ "c.id": c.id, "c.name": c.name, "c.city": c.city, "order_id": o.id, amount: o.amount, product: o.product });
        }
      }
    }
  } else if (joinType === "left") {
    for (const c of CUSTOMERS) {
      const matched = ORDERS.filter((o) => o.customer_id === c.id);
      if (matched.length === 0) {
        results.push({ "c.id": c.id, "c.name": c.name, "c.city": c.city, "order_id": null, amount: null, product: null });
      } else {
        for (const o of matched) {
          results.push({ "c.id": c.id, "c.name": c.name, "c.city": c.city, "order_id": o.id, amount: o.amount, product: o.product });
        }
      }
    }
  } else if (joinType === "right") {
    for (const o of ORDERS) {
      const c = CUSTOMERS.find((c) => c.id === o.customer_id);
      if (c) {
        results.push({ "c.id": c.id, "c.name": c.name, "c.city": c.city, "order_id": o.id, amount: o.amount, product: o.product });
      } else {
        results.push({ "c.id": null, "c.name": null, "c.city": null, "order_id": o.id, amount: o.amount, product: o.product });
      }
    }
  } else {
    // full outer
    const leftRows = new Set<number>();
    for (const c of CUSTOMERS) {
      const matched = ORDERS.filter((o) => o.customer_id === c.id);
      if (matched.length === 0) {
        results.push({ "c.id": c.id, "c.name": c.name, "c.city": c.city, "order_id": null, amount: null, product: null });
      } else {
        for (const o of matched) {
          leftRows.add(o.id as number);
          results.push({ "c.id": c.id, "c.name": c.name, "c.city": c.city, "order_id": o.id, amount: o.amount, product: o.product });
        }
      }
    }
    for (const o of ORDERS) {
      if (!leftRows.has(o.id as number)) {
        results.push({ "c.id": null, "c.name": null, "c.city": null, "order_id": o.id, amount: o.amount, product: o.product });
      }
    }
  }

  return { cols, rows: results };
}

const JOIN_OPTIONS: { id: JoinType; label: string; desc: string; color: string }[] = [
  { id: "inner", label: "INNER JOIN", desc: "Only matched rows from both tables", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "left", label: "LEFT JOIN", desc: "All customers, matched orders or NULL", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "right", label: "RIGHT JOIN", desc: "All orders, matched customers or NULL", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "full", label: "FULL OUTER JOIN", desc: "All rows from both, NULLs where unmatched", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

const COL_LABELS = ["c.id", "c.name", "c.city", "order_id", "amount", "product"];

export default function SQLSandbox() {
  const [join, setJoin] = useState<JoinType>("inner");
  const { rows } = runJoin(join);
  const active = JOIN_OPTIONS.find((j) => j.id === join)!;

  const SQL_TEXT = {
    inner: `SELECT c.id, c.name, c.city,\n       o.id AS order_id, o.amount, o.product\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id;`,
    left: `SELECT c.id, c.name, c.city,\n       o.id AS order_id, o.amount, o.product\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;`,
    right: `SELECT c.id, c.name, c.city,\n       o.id AS order_id, o.amount, o.product\nFROM customers c\nRIGHT JOIN orders o ON c.id = o.customer_id;`,
    full: `SELECT c.id, c.name, c.city,\n       o.id AS order_id, o.amount, o.product\nFROM customers c\nFULL OUTER JOIN orders o ON c.id = o.customer_id;`,
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">SQL Join Sandbox</span>
        <span className="text-xs text-slate-400">customers (5 rows) × orders (6 rows)</span>
      </div>

      {/* Join type selector */}
      <div className="p-5 pb-0">
        <p className="text-xs font-medium text-slate-600 mb-3">Select a join type to see which rows appear:</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {JOIN_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setJoin(opt.id)}
              className={`rounded-lg border px-3 py-2 text-left transition-all text-xs ${
                join === opt.id
                  ? opt.color + " ring-2 ring-offset-1 ring-indigo-400"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="font-semibold font-mono">{opt.label}</div>
              <div className="text-[10px] mt-0.5 opacity-80">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* SQL preview */}
      <div className="px-5 pt-4">
        <pre className="rounded-lg bg-slate-900 text-green-300 text-xs font-mono px-4 py-3 overflow-x-auto leading-relaxed">
          {SQL_TEXT[join]}
        </pre>
      </div>

      {/* Results table */}
      <div className="p-5 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-slate-600">Result</span>
          <span className="text-xs font-mono text-slate-400">{rows.length} rows</span>
          <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded border ${active.color}`}>{active.label}</span>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {COL_LABELS.map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-semibold text-slate-500 font-mono whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  {COL_LABELS.map((col) => {
                    const val = row[col];
                    const isNull = val === null;
                    return (
                      <td
                        key={col}
                        className={`px-3 py-2 font-mono whitespace-nowrap ${
                          isNull ? "text-rose-400 italic" : "text-slate-700"
                        }`}
                      >
                        {isNull ? "NULL" : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded bg-slate-300 border border-slate-400" />
          Matched row
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded bg-rose-100 border border-rose-200" />
          NULL (no match)
        </span>
        <span className="ml-auto text-slate-400">Eva Torres has no orders — watch her appear/disappear</span>
      </div>
    </div>
  );
}
