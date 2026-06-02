"use client";

const JOINS = [
  {
    label: "INNER JOIN",
    color: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
      fill: "fill-indigo-400",
      circle: "stroke-indigo-400",
    },
    tag: "Intersection Only",
    summary: "Returns only rows where a match exists in both tables.",
    detail: "If a row in the left table has no corresponding row in the right table (or vice versa), it's excluded from the result. Silent drops are the most common source of analytics bugs.",
    signal: "Use when every row must match",
    sql: "SELECT * FROM a\nINNER JOIN b ON a.id = b.a_id",
    diagram: "inner",
  },
  {
    label: "LEFT JOIN",
    color: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "text-rose-500",
      badge: "bg-rose-100 text-rose-700",
      fill: "fill-rose-400",
      circle: "stroke-rose-400",
    },
    tag: "All Left Rows",
    summary: "Returns every row from the left table, plus matched rows from the right.",
    detail: "When no match exists in the right table, its columns appear as NULL. The most-used join in analytics — \"give me everything from A, and whatever B has on it.\"",
    signal: "Use for counts that include zero",
    sql: "SELECT * FROM a\nLEFT JOIN b ON a.id = b.a_id",
    diagram: "left",
  },
  {
    label: "RIGHT JOIN",
    color: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
      fill: "fill-amber-400",
      circle: "stroke-amber-400",
    },
    tag: "All Right Rows",
    summary: "Returns every row from the right table, plus matched rows from the left.",
    detail: "Mirror of LEFT JOIN. Rarely used in practice — most engineers swap the table order and write a LEFT JOIN instead. Same result, more readable.",
    signal: "Usually replaced by LEFT JOIN",
    sql: "SELECT * FROM a\nRIGHT JOIN b ON a.id = b.a_id",
    diagram: "right",
  },
  {
    label: "FULL OUTER JOIN",
    color: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
      fill: "fill-emerald-400",
      circle: "stroke-emerald-400",
    },
    tag: "All Rows, Both Sides",
    summary: "Returns all rows from both tables, matched where possible.",
    detail: "Unmatched rows from either side get NULLs on the other side. Best for finding discrepancies — rows that exist in one dataset but not the other.",
    signal: "Use for reconciliation queries",
    sql: "SELECT * FROM a\nFULL OUTER JOIN b ON a.id = b.a_id",
    diagram: "full",
  },
];

function VennDiagram({ type, color }: { type: string; color: (typeof JOINS)[0]["color"] }) {
  // Two overlapping circles. Highlighted region shows what the join returns.
  const cx1 = 28;
  const cx2 = 52;
  const cy = 24;
  const r = 18;

  const highlightLeft = type === "left" || type === "full";
  const highlightRight = type === "right" || type === "full";
  const highlightCenter = type === "inner" || type === "left" || type === "right" || type === "full";

  const fillColor = color.fill.replace("fill-", "");
  const tailwindToHex: Record<string, string> = {
    "indigo-400": "#818cf8",
    "rose-400": "#fb7185",
    "amber-400": "#fbbf24",
    "emerald-400": "#34d399",
  };
  const highlight = tailwindToHex[fillColor] ?? "#94a3b8";
  const muted = "#e2e8f0";

  return (
    <svg width="80" height="48" viewBox="0 0 80 48" aria-hidden="true">
      {/* left-only region */}
      <circle cx={cx1} cy={cy} r={r} fill={highlightLeft ? highlight : muted} fillOpacity="0.6" />
      {/* right-only region */}
      <circle cx={cx2} cy={cy} r={r} fill={highlightRight ? highlight : muted} fillOpacity="0.6" />
      {/* intersection clip — paint on top so center is always distinguishable */}
      <clipPath id={`clip-left-${type}`}>
        <circle cx={cx1} cy={cy} r={r} />
      </clipPath>
      <circle
        cx={cx2}
        cy={cy}
        r={r}
        fill={highlightCenter ? highlight : muted}
        fillOpacity={highlightCenter ? "0.85" : "0.6"}
        clipPath={`url(#clip-left-${type})`}
      />
      {/* outlines */}
      <circle cx={cx1} cy={cy} r={r} fill="none" stroke="#94a3b8" strokeWidth="1.2" />
      <circle cx={cx2} cy={cy} r={r} fill="none" stroke="#94a3b8" strokeWidth="1.2" />
      {/* labels */}
      <text x={cx1 - 7} y={cy + 1} fontSize="7" fill="#64748b" fontFamily="monospace" dominantBaseline="middle">A</text>
      <text x={cx2 + 5} y={cy + 1} fontSize="7" fill="#64748b" fontFamily="monospace" dominantBaseline="middle">B</text>
    </svg>
  );
}

export default function JoinTypesGrid() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          The Four SQL Join Types
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {JOINS.map(({ label, color, tag, summary, detail, signal, sql, diagram }) => (
          <div
            key={label}
            className={`rounded-xl border ${color.border} ${color.bg} p-4 flex flex-col gap-3`}
          >
            <div className="flex items-start justify-between gap-2">
              <VennDiagram type={diagram} color={color} />
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${color.badge}`}>
                {tag}
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-800 mb-1 font-mono">{label}</div>
              <div className="text-xs text-slate-600 leading-relaxed">{summary}</div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed">{detail}</div>

            <pre className="text-[11px] font-mono bg-white/70 rounded-lg px-3 py-2 text-slate-700 border border-slate-200/60 leading-relaxed whitespace-pre overflow-x-auto">{sql}</pre>

            <div className="mt-auto pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">When to use</span>
              <div className="text-xs font-medium text-slate-700 mt-0.5">{signal}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">When in doubt, start with LEFT JOIN. It preserves all rows from the primary table and makes missing matches visible as NULLs — silent row drops are the most common source of analytics errors.</p>
      </div>
    </div>
  );
}
