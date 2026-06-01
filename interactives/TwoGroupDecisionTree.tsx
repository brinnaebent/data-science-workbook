"use client";

import { useState } from "react";

type NodeId =
  | "start"
  | "paired"
  | "independent"
  | "paired-normal"
  | "indep-normal"
  | "indep-variance"
  | "result-paired-t"
  | "result-wilcoxon"
  | "result-mann-whitney"
  | "result-students-t"
  | "result-welchs-t";

// Which nodes light up when you hover a given node (the node + all descendants)
const SUBTREES: Record<NodeId, NodeId[]> = {
  start: ["start", "paired", "independent", "paired-normal", "indep-normal", "indep-variance", "result-paired-t", "result-wilcoxon", "result-mann-whitney", "result-students-t", "result-welchs-t"],
  paired: ["paired", "paired-normal", "result-paired-t", "result-wilcoxon"],
  independent: ["independent", "indep-normal", "indep-variance", "result-mann-whitney", "result-students-t", "result-welchs-t"],
  "paired-normal": ["paired-normal", "result-paired-t", "result-wilcoxon"],
  "indep-normal": ["indep-normal", "indep-variance", "result-mann-whitney", "result-students-t", "result-welchs-t"],
  "indep-variance": ["indep-variance", "result-students-t", "result-welchs-t"],
  "result-paired-t": ["result-paired-t"],
  "result-wilcoxon": ["result-wilcoxon"],
  "result-mann-whitney": ["result-mann-whitney"],
  "result-students-t": ["result-students-t"],
  "result-welchs-t": ["result-welchs-t"],
};

interface NodeDef {
  label: string;
  sublabel?: string;
  kind: "root" | "question" | "result";
  // Tailwind color tokens
  bg: string;
  border: string;
  text: string;
  hoverBg: string;
  hoverBorder: string;
}

const NODE_DEFS: Record<NodeId, NodeDef> = {
  start: {
    label: "Compare two groups",
    kind: "root",
    bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-700",
    hoverBg: "bg-slate-200", hoverBorder: "border-slate-500",
  },
  paired: {
    label: "Paired data",
    sublabel: "same unit measured twice",
    kind: "question",
    bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-800",
    hoverBg: "bg-violet-100", hoverBorder: "border-violet-400",
  },
  independent: {
    label: "Independent data",
    sublabel: "different subjects in each group",
    kind: "question",
    bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800",
    hoverBg: "bg-sky-100", hoverBorder: "border-sky-400",
  },
  "paired-normal": {
    label: "Differences normal?",
    sublabel: "Shapiro-Wilk on paired diffs",
    kind: "question",
    bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700",
    hoverBg: "bg-violet-100", hoverBorder: "border-violet-400",
  },
  "indep-normal": {
    label: "Both groups normal?",
    sublabel: "Q-Q plot or Shapiro-Wilk",
    kind: "question",
    bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700",
    hoverBg: "bg-sky-100", hoverBorder: "border-sky-400",
  },
  "indep-variance": {
    label: "Equal variances?",
    sublabel: "Levene's test",
    kind: "question",
    bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700",
    hoverBg: "bg-sky-100", hoverBorder: "border-sky-400",
  },
  "result-paired-t": {
    label: "Paired t-test",
    sublabel: "ttest_rel(before, after)",
    kind: "result",
    bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-900",
    hoverBg: "bg-violet-200", hoverBorder: "border-violet-500",
  },
  "result-wilcoxon": {
    label: "Wilcoxon signed-rank",
    sublabel: "wilcoxon(before, after)",
    kind: "result",
    bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-900",
    hoverBg: "bg-amber-200", hoverBorder: "border-amber-500",
  },
  "result-mann-whitney": {
    label: "Mann-Whitney U",
    sublabel: "mannwhitneyu(a, b)",
    kind: "result",
    bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-900",
    hoverBg: "bg-amber-200", hoverBorder: "border-amber-500",
  },
  "result-students-t": {
    label: "Student's t-test",
    sublabel: "ttest_ind(a, b, equal_var=True)",
    kind: "result",
    bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-900",
    hoverBg: "bg-emerald-200", hoverBorder: "border-emerald-500",
  },
  "result-welchs-t": {
    label: "Welch's t-test",
    sublabel: "ttest_ind(a, b, equal_var=False)",
    kind: "result",
    bg: "bg-sky-100", border: "border-sky-300", text: "text-sky-900",
    hoverBg: "bg-sky-200", hoverBorder: "border-sky-500",
  },
};

// Fixed layout: x, y in a 700×460 coordinate space
// Nodes are 130w × 52h (questions) or 140w × 52h (results)
const NODE_W = 138;
const NODE_H = 52;

// X-centers have 20px left padding baked in so no node bleeds outside the viewBox
const POSITIONS: Record<NodeId, { x: number; y: number }> = {
  start:                 { x: 420 - NODE_W / 2, y: 10 },
  paired:                { x: 180 - NODE_W / 2, y: 120 },
  independent:           { x: 660 - NODE_W / 2, y: 120 },
  "paired-normal":       { x: 180 - NODE_W / 2, y: 230 },
  "indep-normal":        { x: 660 - NODE_W / 2, y: 230 },
  "result-paired-t":     { x: 110 - NODE_W / 2, y: 350 },
  "result-wilcoxon":     { x: 255 - NODE_W / 2, y: 350 },
  "indep-variance":      { x: 600 - NODE_W / 2, y: 350 },
  "result-mann-whitney": { x: 740 - NODE_W / 2, y: 350 },
  "result-students-t":   { x: 530 - NODE_W / 2, y: 470 },
  "result-welchs-t":     { x: 675 - NODE_W / 2, y: 470 },
};

// Edges: [from, to, label, label color class]
const EDGES: [NodeId, NodeId, string, string][] = [
  ["start", "paired", "Paired", "text-violet-500"],
  ["start", "independent", "Independent", "text-sky-500"],
  ["paired", "paired-normal", "", ""],
  ["independent", "indep-normal", "", ""],
  ["paired-normal", "result-paired-t", "Normal", "text-violet-500"],
  ["paired-normal", "result-wilcoxon", "Not normal", "text-amber-500"],
  ["indep-normal", "indep-variance", "Normal", "text-sky-500"],
  ["indep-normal", "result-mann-whitney", "Not normal", "text-amber-500"],
  ["indep-variance", "result-students-t", "Equal", "text-emerald-600"],
  ["indep-variance", "result-welchs-t", "Not equal", "text-sky-600"],
];

function cx(id: NodeId) { return POSITIONS[id].x + NODE_W / 2; }
function cy(id: NodeId) { return POSITIONS[id].y + NODE_H / 2; }
function top(id: NodeId) { return POSITIONS[id].y; }
function bot(id: NodeId) { return POSITIONS[id].y + NODE_H; }

const SVG_W = 830;
const SVG_H = 534;

export default function TwoGroupDecisionTree() {
  const [hovered, setHovered] = useState<NodeId | null>(null);

  const highlighted = hovered ? new Set(SUBTREES[hovered]) : new Set<NodeId>();
  const anyHovered = hovered !== null;

  function nodeClass(id: NodeId) {
    const def = NODE_DEFS[id];
    if (!anyHovered || highlighted.has(id)) {
      return `${def.hoverBg} ${def.hoverBorder}`;
    }
    return "bg-slate-50 border-slate-200 opacity-30";
  }

  function textClass(id: NodeId) {
    const def = NODE_DEFS[id];
    if (!anyHovered || highlighted.has(id)) return def.text;
    return "text-slate-300";
  }

  function edgeOpacity(from: NodeId, to: NodeId) {
    if (!anyHovered) return 1;
    return highlighted.has(from) && highlighted.has(to) ? 1 : 0.12;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm" style={{ overflow: "clip" }}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Two-Group Test Decision Tree
        </span>
      </div>

      {/* SVG tree */}
      <div className="px-2 py-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ maxWidth: `${SVG_W}px`, display: "block", margin: "0 auto" }}
        >
          {/* Draw edges first (behind nodes) */}
          {EDGES.map(([from, to, label, labelColor]) => {
            const x1 = cx(from);
            const y1 = bot(from);
            const x2 = cx(to);
            const y2 = top(to);
            const midY = (y1 + y2) / 2;
            const opacity = edgeOpacity(from, to);
            // Elbow path: down, horizontal, down
            const d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
            // Label positioned at the elbow corner
            const lx = x2 + (x2 < x1 ? -6 : 6);
            const ly = midY - 4;
            return (
              <g key={`${from}-${to}`} style={{ opacity }}>
                <path d={d} stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
                {label && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={x2 < x1 ? "end" : "start"}
                    fontSize="10"
                    fontWeight="600"
                    className={labelColor}
                    fill="currentColor"
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Draw nodes */}
          {(Object.keys(POSITIONS) as NodeId[]).map((id) => {
            const pos = POSITIONS[id];
            const def = NODE_DEFS[id];
            const isActive = !anyHovered || highlighted.has(id);
            const isResult = def.kind === "result";

            return (
              <foreignObject
                key={id}
                x={pos.x}
                y={pos.y}
                width={NODE_W}
                height={NODE_H}
                style={{ cursor: "default", overflow: "visible" }}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className={`
                    w-full h-full rounded-lg border px-2 py-1.5 flex flex-col justify-center
                    transition-all duration-150
                    ${isActive
                      ? `${def.hoverBg} ${def.hoverBorder}`
                      : "bg-slate-50 border-slate-200 opacity-30"
                    }
                    ${isResult ? "shadow-sm" : ""}
                  `}
                >
                  <div className={`text-[11px] font-bold text-center leading-tight ${isActive ? def.text : "text-slate-300"}`}>
                    {def.label}
                  </div>
                  {def.sublabel && (
                    <div className={`text-[9px] text-center mt-0.5 leading-tight ${isActive ? "opacity-70 " + def.text : "text-slate-300"}`}>
                      {def.sublabel}
                    </div>
                  )}
                </div>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-x-5 gap-y-1.5 items-center">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-3 h-3 rounded bg-violet-100 border border-violet-300" />
          Paired branch
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-3 h-3 rounded bg-sky-100 border border-sky-300" />
          Independent branch
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-3 h-3 rounded bg-amber-100 border border-amber-300" />
          Nonparametric
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
          Parametric
        </span>
        <span className="ml-auto text-[10px] text-slate-400">Hover a node to highlight its subtree</span>
      </div>
    </div>
  );
}
