"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type NodeStatus = "idle" | "running" | "done" | "failed";

interface PipelineNode {
  id: string;
  label: string;
  sublabel: string;
  deps: string[];
  col: number;
  row: number;
  color: {
    bg: string;
    border: string;
    text: string;
    sub: string;
    activeBorder: string;
  };
  duration: number;
}

const NODES: PipelineNode[] = [
  {
    id: "extract",
    label: "Extract",
    sublabel: "fetch source data",
    deps: [],
    col: 0, row: 0,
    color: {
      bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800",
      sub: "text-blue-400", activeBorder: "border-blue-500",
    },
    duration: 900,
  },
  {
    id: "validate",
    label: "Validate",
    sublabel: "check schema & nulls",
    deps: ["extract"],
    col: 1, row: 0,
    color: {
      bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800",
      sub: "text-amber-400", activeBorder: "border-amber-500",
    },
    duration: 600,
  },
  {
    id: "transform",
    label: "Transform",
    sublabel: "clean & join tables",
    deps: ["validate"],
    col: 2, row: 0,
    color: {
      bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-800",
      sub: "text-violet-400", activeBorder: "border-violet-500",
    },
    duration: 1100,
  },
  {
    id: "load",
    label: "Load",
    sublabel: "write to warehouse",
    deps: ["transform"],
    col: 3, row: 0,
    color: {
      bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800",
      sub: "text-emerald-400", activeBorder: "border-emerald-500",
    },
    duration: 800,
  },
  {
    id: "notify",
    label: "Notify",
    sublabel: "send Slack alert",
    deps: ["load"],
    col: 4, row: 0,
    color: {
      bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800",
      sub: "text-rose-400", activeBorder: "border-rose-500",
    },
    duration: 200,
  },
];

const COL_COUNT = 5;
const NODE_W = 120;
const NODE_H = 64;
const COL_GAP = 64;
const ROW_GAP = 20;
const PAD_X = 20;
const PAD_Y = 20;

function getNodeCenter(node: PipelineNode) {
  const x = PAD_X + node.col * (NODE_W + COL_GAP) + NODE_W / 2;
  const y = PAD_Y + node.row * (NODE_H + ROW_GAP) + NODE_H / 2;
  return { x, y };
}

function getNodeRect(node: PipelineNode) {
  const x = PAD_X + node.col * (NODE_W + COL_GAP);
  const y = PAD_Y + node.row * (NODE_H + ROW_GAP);
  return { x, y, w: NODE_W, h: NODE_H };
}

const SVG_W = PAD_X * 2 + COL_COUNT * NODE_W + (COL_COUNT - 1) * COL_GAP;
const SVG_H = PAD_Y * 2 + NODE_H;

const STATUS_DOT: Record<NodeStatus, { fill: string; label: string }> = {
  idle: { fill: "#cbd5e1", label: "idle" },
  running: { fill: "#6366f1", label: "running" },
  done: { fill: "#10b981", label: "done" },
  failed: { fill: "#f43f5e", label: "failed" },
};

function topoWaves(nodes: PipelineNode[]): string[][] {
  const inDeg = new Map(nodes.map((n) => [n.id, n.deps.length]));
  const queue = nodes.filter((n) => n.deps.length === 0).map((n) => n.id);
  const waves: string[][] = [];
  while (queue.length > 0) {
    waves.push([...queue]);
    const next: string[] = [];
    const current = [...queue];
    queue.length = 0;
    for (const id of current) {
      for (const n of nodes) {
        if (n.deps.includes(id)) {
          const d = (inDeg.get(n.id) ?? 0) - 1;
          inDeg.set(n.id, d);
          if (d === 0) next.push(n.id);
        }
      }
    }
    queue.push(...next);
  }
  return waves;
}

export default function AirflowDAG() {
  const [statuses, setStatuses] = useState<Record<string, NodeStatus>>(
    Object.fromEntries(NODES.map((n) => [n.id, "idle"]))
  );
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const nodeMap = new Map(NODES.map((n) => [n.id, n]));

  const reset = useCallback(() => {
    setStatuses(Object.fromEntries(NODES.map((n) => [n.id, "idle"])));
    setLog([]);
    setRunning(false);
  }, []);

  const runPipeline = useCallback(async () => {
    reset();
    await new Promise((r) => setTimeout(r, 50)); // let reset flush
    setRunning(true);
    const waves = topoWaves(NODES);
    const logLines: string[] = [];

    for (const wave of waves) {
      const promises = wave.map(async (id) => {
        setStatuses((prev) => ({ ...prev, [id]: "running" }));
        const node = nodeMap.get(id)!;
        await new Promise((r) => setTimeout(r, node.duration));
        const failed = false; // deterministic for a diagram demo
        const status: NodeStatus = failed ? "failed" : "done";
        setStatuses((prev) => ({ ...prev, [id]: status }));
        logLines.push(`${status === "done" ? "✓" : "✕"} ${node.label} (${node.duration}ms)`);
        setLog([...logLines]);
      });
      await Promise.all(promises);
    }

    setRunning(false);
    setLog((prev) => [...prev, "Pipeline complete ✓"]);
  }, [nodeMap, reset]);

  // Build edges
  const edges: { from: PipelineNode; to: PipelineNode }[] = [];
  for (const node of NODES) {
    for (const depId of node.deps) {
      const dep = nodeMap.get(depId);
      if (dep) edges.push({ from: dep, to: node });
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Airflow DAG — Nightly Sales Pipeline
        </span>
        <div className="flex gap-2">
          <button
            onClick={reset}
            disabled={running}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={runPipeline}
            disabled={running}
            className="text-xs px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {running ? "Running…" : "▶ Run"}
          </button>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="p-5 overflow-x-auto">
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="block mx-auto"
          style={{ minWidth: SVG_W }}
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8" />
            </marker>
            <marker
              id="arrow-active"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map(({ from, to }) => {
            const fc = getNodeRect(from);
            const tc = getNodeRect(to);
            const x1 = fc.x + fc.w;
            const y1 = fc.y + fc.h / 2;
            const x2 = tc.x - 2; // stop before arrowhead
            const y2 = tc.y + tc.h / 2;
            const mx = (x1 + x2) / 2;
            const fromStatus = statuses[from.id];
            const isActive = fromStatus === "done" || fromStatus === "running";
            return (
              <path
                key={`${from.id}-${to.id}`}
                d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                fill="none"
                stroke={isActive ? "#6366f1" : "#cbd5e1"}
                strokeWidth={isActive ? 2 : 1.5}
                markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const { x, y, w, h } = getNodeRect(node);
            const status = statuses[node.id];
            const dot = STATUS_DOT[status];
            const isActive = status !== "idle";
            return (
              <g key={node.id}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={10}
                  ry={10}
                  className={`transition-all duration-200 ${
                    status === "running"
                      ? "fill-indigo-50"
                      : status === "done"
                      ? "fill-emerald-50"
                      : status === "failed"
                      ? "fill-rose-50"
                      : "fill-white"
                  }`}
                  stroke={
                    status === "running"
                      ? "#6366f1"
                      : status === "done"
                      ? "#10b981"
                      : status === "failed"
                      ? "#f43f5e"
                      : "#e2e8f0"
                  }
                  strokeWidth={status !== "idle" ? 2 : 1.5}
                />
                {/* Status dot */}
                <circle
                  cx={x + w - 12}
                  cy={y + 12}
                  r={5}
                  fill={dot.fill}
                  className="transition-all duration-300"
                />
                {/* Pulse ring when running */}
                {status === "running" && (
                  <circle
                    cx={x + w - 12}
                    cy={y + 12}
                    r={8}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth={1.5}
                    opacity={0.4}
                  />
                )}
                {/* Label */}
                <text
                  x={x + 12}
                  y={y + 26}
                  fontSize={12}
                  fontWeight="600"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                  fill={
                    status === "running"
                      ? "#4338ca"
                      : status === "done"
                      ? "#065f46"
                      : status === "failed"
                      ? "#9f1239"
                      : "#1e293b"
                  }
                >
                  {node.label}
                </text>
                {/* Sublabel */}
                <text
                  x={x + 12}
                  y={y + 42}
                  fontSize={9.5}
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                  fill="#94a3b8"
                >
                  {node.sublabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-5 pb-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        {(Object.entries(STATUS_DOT) as [NodeStatus, { fill: string; label: string }][]).map(([s, d]) => (
          <span key={s} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: d.fill }}
            />
            {d.label}
          </span>
        ))}
        <span className="ml-auto text-slate-400 italic">dependency arrows show execution order</span>
      </div>

      {/* Execution log */}
      {log.length > 0 && (
        <div className="mx-5 mb-5 mt-3 rounded-lg bg-slate-900 px-4 py-3">
          <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Execution Log</div>
          {log.map((line, i) => (
            <div
              key={i}
              className={`text-xs font-mono ${
                line.includes("complete")
                  ? "text-emerald-400"
                  : line.startsWith("✕")
                  ? "text-rose-400"
                  : "text-slate-300"
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        Each node is a task; arrows are dependencies. Tasks with no shared dependency can run in parallel — the orchestrator schedules this automatically.
      </div>
    </div>
  );
}
