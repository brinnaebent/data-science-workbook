"use client";

import { useState, useMemo } from "react";

// Pricing approximations (as of 2024)
// Snowflake: ~$2/credit, ~8 credits/hr for a Medium warehouse
// BigQuery: $6.25/TB scanned; storage $0.02/GB/mo
// Redshift: ra3.4xlarge ~$3.26/hr, can handle ~2TB/node

const SNOWFLAKE_CREDIT_PRICE = 2.0; // $/credit
const SNOWFLAKE_CREDITS_PER_HR = 8; // Medium warehouse
const SNOWFLAKE_STORAGE_PER_GB = 0.023; // $/GB/mo

const BIGQUERY_SCAN_PER_TB = 6.25; // $/TB scanned
const BIGQUERY_STORAGE_PER_GB = 0.02; // $/GB/mo
const BIGQUERY_SCAN_RATIO = 0.15; // fraction of total data scanned per query (typical)

const REDSHIFT_NODE_COST_HR = 3.26; // ra3.4xlarge on-demand $/hr
const REDSHIFT_TB_PER_NODE = 64; // TB managed storage per node
const REDSHIFT_STORAGE_PER_GB = 0.024; // $/GB/mo (managed)

interface Config {
  storageGB: number;
  queriesPerDay: number;
  computeHoursPerDay: number;
}

function calcSnowflake(c: Config): number {
  const computeCost = c.computeHoursPerDay * SNOWFLAKE_CREDITS_PER_HR * SNOWFLAKE_CREDIT_PRICE * 30;
  const storageCost = c.storageGB * SNOWFLAKE_STORAGE_PER_GB;
  return computeCost + storageCost;
}

function calcBigQuery(c: Config): number {
  const gbScannedPerQuery = c.storageGB * BIGQUERY_SCAN_RATIO;
  const tbScannedPerMonth = (gbScannedPerQuery / 1024) * c.queriesPerDay * 30;
  const queryCost = Math.max(0, tbScannedPerMonth - 1) * BIGQUERY_SCAN_PER_TB; // 1TB/mo free
  const storageCost = c.storageGB * BIGQUERY_STORAGE_PER_GB;
  return queryCost + storageCost;
}

function calcRedshift(c: Config): number {
  const nodesNeeded = Math.max(1, Math.ceil(c.storageGB / 1024 / REDSHIFT_TB_PER_NODE));
  const computeCost = nodesNeeded * REDSHIFT_NODE_COST_HR * 24 * 30; // always-on
  const storageCost = c.storageGB * REDSHIFT_STORAGE_PER_GB;
  return computeCost + storageCost;
}

function fmt(n: number): string {
  if (n >= 10000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}

const WAREHOUSES = [
  { id: "snowflake", label: "Snowflake", color: "bg-cyan-50 border-cyan-200 text-cyan-800", bar: "#0ea5e9" },
  { id: "bigquery", label: "BigQuery", color: "bg-blue-50 border-blue-200 text-blue-800", bar: "#3b82f6" },
  { id: "redshift", label: "Redshift", color: "bg-orange-50 border-orange-200 text-orange-800", bar: "#f97316" },
];

function SliderRow({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="text-xs font-mono font-semibold text-slate-800">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function PipelineCostSimulator() {
  const [storageGB, setStorageGB] = useState(500);
  const [queriesPerDay, setQueriesPerDay] = useState(50);
  const [computeHoursPerDay, setComputeHoursPerDay] = useState(4);

  const config: Config = { storageGB, queriesPerDay, computeHoursPerDay };

  const costs = useMemo(() => ({
    snowflake: calcSnowflake(config),
    bigquery: calcBigQuery(config),
    redshift: calcRedshift(config),
  }), [storageGB, queriesPerDay, computeHoursPerDay]);

  const maxCost = Math.max(...Object.values(costs), 1);
  const cheapest = Object.entries(costs).sort((a, b) => a[1] - b[1])[0][0];

  const costBreakdown = {
    snowflake: {
      compute: computeHoursPerDay * SNOWFLAKE_CREDITS_PER_HR * SNOWFLAKE_CREDIT_PRICE * 30,
      storage: storageGB * SNOWFLAKE_STORAGE_PER_GB,
    },
    bigquery: {
      compute: calcBigQuery(config) - storageGB * BIGQUERY_STORAGE_PER_GB,
      storage: storageGB * BIGQUERY_STORAGE_PER_GB,
    },
    redshift: {
      compute: Math.max(1, Math.ceil(storageGB / 1024 / REDSHIFT_TB_PER_NODE)) * REDSHIFT_NODE_COST_HR * 24 * 30,
      storage: storageGB * REDSHIFT_STORAGE_PER_GB,
    },
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pipeline Cost Simulator</span>
        <span className="text-xs text-slate-400">Estimated monthly cost</span>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Your workload</p>
          <SliderRow
            label="Data stored"
            value={storageGB}
            min={10} max={10000} step={10}
            onChange={setStorageGB}
            format={(v) => v >= 1000 ? `${(v / 1024).toFixed(1)} TB` : `${v} GB`}
          />
          <SliderRow
            label="Queries per day"
            value={queriesPerDay}
            min={1} max={1000} step={1}
            onChange={setQueriesPerDay}
            format={(v) => `${v} queries`}
          />
          <SliderRow
            label="Compute hours / day (Snowflake)"
            value={computeHoursPerDay}
            min={0.5} max={24} step={0.5}
            onChange={setComputeHoursPerDay}
            format={(v) => `${v}h`}
          />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Snowflake billed per compute-hour (warehouse on/off). BigQuery billed per TB scanned. Redshift billed per node-hour (always on). Prices approximate 2024 list rates.
          </p>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monthly estimate</p>
          {WAREHOUSES.map((wh) => {
            const cost = costs[wh.id as keyof typeof costs];
            const breakdown = costBreakdown[wh.id as keyof typeof costBreakdown];
            const isMin = wh.id === cheapest;
            return (
              <div key={wh.id} className={`rounded-lg border p-4 ${isMin ? wh.color + " ring-1 ring-offset-1 ring-indigo-300" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${isMin ? "" : "text-slate-700"}`}>{wh.label}</span>
                  <div className="flex items-center gap-2">
                    {isMin && <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded px-1.5 py-0.5">Cheapest</span>}
                    <span className="text-lg font-bold font-mono">{fmt(cost)}</span>
                  </div>
                </div>
                <div className="relative h-2 rounded-full bg-slate-200 mb-2">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(cost / maxCost) * 100}%`, background: wh.bar }}
                  />
                </div>
                <div className="flex gap-4 text-[10px] text-slate-500">
                  <span>Compute: {fmt(breakdown.compute)}</span>
                  <span>Storage: {fmt(breakdown.storage)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        Tip: BigQuery's per-scan billing favors intermittent workloads. Redshift's always-on nodes favor high, sustained query volume. Snowflake's auto-suspend favors bursty compute needs.
      </div>
    </div>
  );
}
