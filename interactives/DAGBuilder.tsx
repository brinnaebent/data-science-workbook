"use client";

import { useState, useCallback } from "react";

type NodeType = "extract" | "transform" | "load" | "quality";
type NodeStatus = "idle" | "running" | "done" | "failed";

interface DAGNode {
  id: string;
  type: NodeType;
  label: string;
  deps: string[];
  status: NodeStatus;
  duration: number; // ms for simulation
}

const NODE_COLORS: Record<NodeType, { bg: string; border: string; text: string; dot: string }> = {
  extract: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-800", dot: "#3b82f6" },
  transform: { bg: "bg-violet-50", border: "border-violet-300", text: "text-violet-800", dot: "#8b5cf6" },
  load: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-800", dot: "#10b981" },
  quality: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-800", dot: "#f59e0b" },
};

const STATUS_ICONS: Record<NodeStatus, string> = {
  idle: "○",
  running: "◌",
  done: "●",
  failed: "✕",
};

const STATUS_COLORS: Record<NodeStatus, string> = {
  idle: "text-slate-400",
  running: "text-indigo-500 animate-pulse",
  done: "text-emerald-500",
  failed: "text-rose-500",
};

const DEFAULT_NODES: DAGNode[] = [
  { id: "ex1", type: "extract", label: "Extract: Postgres (orders)", deps: [], status: "idle", duration: 800 },
  { id: "ex2", type: "extract", label: "Extract: Kafka (events)", deps: [], status: "idle", duration: 600 },
  { id: "ex3", type: "extract", label: "Extract: Salesforce API", deps: [], status: "idle", duration: 1200 },
  { id: "tr1", type: "transform", label: "Join: orders + events", deps: ["ex1", "ex2"], status: "idle", duration: 1000 },
  { id: "tr2", type: "transform", label: "Join: marketing spend", deps: ["tr1", "ex3"], status: "idle", duration: 800 },
  { id: "qa1", type: "quality", label: "Quality check: null rates", deps: ["tr2"], status: "idle", duration: 400 },
  { id: "lo1", type: "load", label: "Load → Snowflake", deps: ["qa1"], status: "idle", duration: 700 },
];

function topoSort(nodes: DAGNode[]): string[][] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const inDegree = new Map(nodes.map((n) => [n.id, n.deps.length]));
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
          const newDeg = (inDegree.get(n.id) ?? 0) - 1;
          inDegree.set(n.id, newDeg);
          if (newDeg === 0) next.push(n.id);
        }
      }
    }
    queue.push(...next);
  }
  return waves;
}

export default function DAGBuilder() {
  const [nodes, setNodes] = useState<DAGNode[]>(DEFAULT_NODES);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const reset = useCallback(() => {
    setNodes((prev) => prev.map((n) => ({ ...n, status: "idle" })));
    setLog([]);
    setRunning(false);
  }, []);

  const runDAG = useCallback(async () => {
    reset();
    setRunning(true);
    const waves = topoSort(nodes);
    const newLog: string[] = [];

    for (const wave of waves) {
      const promises = wave.map(async (id) => {
        setNodes((prev) => prev.map((n) => n.id === id ? { ...n, status: "running" } : n));
        const node = nodes.find((n) => n.id === id)!;
        await new Promise((r) => setTimeout(r, node.duration));
        const failed = Math.random() < 0.03; // 3% random failure
        setNodes((prev) => prev.map((n) => n.id === id ? { ...n, status: failed ? "failed" : "done" } : n));
        newLog.push(`${failed ? "✕" : "✓"} ${node.label} (${node.duration}ms)`);
        setLog([...newLog]);
        if (failed) throw new Error(id);
      });

      try {
        await Promise.all(promises);
      } catch {
        setRunning(false);
        setLog((prev) => [...prev, "Pipeline halted — downstream tasks skipped."]);
        return;
      }
    }

    setRunning(false);
    setLog((prev) => [...prev, "Pipeline complete ✓"]);
  }, [nodes, reset]);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const waves = topoSort(nodes);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">DAG Builder</span>
        <div className="flex gap-2">
          <button
            onClick={reset}
            disabled={running}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={runDAG}
            disabled={running}
            className="text-xs px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {running ? "Running…" : "▶ Run Pipeline"}
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* DAG visualization: columns per wave */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {waves.map((wave, wi) => (
            <div key={wi} className="flex flex-col gap-3 min-w-[180px]">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide text-center">
                Wave {wi + 1}
              </div>
              {wave.map((id) => {
                const node = nodeMap.get(id)!;
                const c = NODE_COLORS[node.type];
                return (
                  <div key={id} className={`rounded-lg border-2 px-3 py-2.5 ${c.bg} ${c.border} transition-all`}>
                    <div className="flex items-start gap-2">
                      <span className={`text-base leading-none mt-0.5 ${STATUS_COLORS[node.status]}`}>
                        {STATUS_ICONS[node.status]}
                      </span>
                      <div>
                        <div className={`text-xs font-semibold leading-tight ${c.text}`}>{node.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 capitalize font-medium">{node.type}</div>
                      </div>
                    </div>
                    {node.deps.length > 0 && (
                      <div className="mt-2 text-[9px] text-slate-400">
                        depends on: {node.deps.map((d) => nodeMap.get(d)?.label.split(":")[0]).join(", ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
          {(Object.entries(NODE_COLORS) as [NodeType, typeof NODE_COLORS["extract"]][]).map(([type, c]) => (
            <span key={type} className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border ${c.bg} ${c.border} ${c.text}`}>
              {type}
            </span>
          ))}
          <span className="ml-auto text-[10px] text-slate-400">Tasks in same wave run in parallel</span>
        </div>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="mx-5 mb-5 rounded-lg bg-slate-900 px-4 py-3">
          <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Execution Log</div>
          {log.map((line, i) => (
            <div key={i} className={`text-xs font-mono ${line.startsWith("✕") || line.includes("halted") ? "text-rose-400" : line.includes("complete") ? "text-emerald-400" : "text-slate-300"}`}>
              {line}
            </div>
          ))}
        </div>
      )}

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        Tasks in the same wave run in parallel; each wave waits for the previous to complete.
      </div>
    </div>
  );
}
