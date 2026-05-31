"use client";

import { useState } from "react";

// ─── Shared dataset: weekly sales for two product lines ───────────────────────

const SALES_A = [42, 55, 61, 38, 72, 48, 53, 67, 44, 59, 91, 50, 46, 63, 57, 70, 40, 52, 83, 65];
const SALES_B = [30, 35, 110, 28, 32, 41, 27, 38, 120, 34, 29, 45, 33, 115, 31, 36, 28, 43, 118, 37];

function pct(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

// ─── Histogram ────────────────────────────────────────────────────────────────

const NUM_BINS = 10;

function buildHistogram(data: number[]): { lo: number; hi: number; count: number }[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const width = (max - min) / NUM_BINS;
  const bins = Array.from({ length: NUM_BINS }, (_, i) => ({
    lo: min + i * width,
    hi: min + (i + 1) * width,
    count: 0,
  }));
  for (const v of data) {
    const idx = Math.min(Math.floor((v - min) / width), NUM_BINS - 1);
    bins[idx].count++;
  }
  return bins;
}

function Histogram() {
  const [series, setSeries] = useState<"A" | "B">("A");
  const data = series === "A" ? SALES_A : SALES_B;
  const bins = buildHistogram(data);
  const maxCount = Math.max(...bins.map((b) => b.count));
  const mean = data.reduce((s, v) => s + v, 0) / data.length;
  const median = pct(data, 50);
  const isSkewed = Math.abs(mean - median) > 3;
  const rightSkew = mean > median + 3;

  return (
    <div className="space-y-4">
      {/* Series toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Dataset:</span>
        {(["A", "B"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSeries(s)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors border ${
              series === s
                ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                : "text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            Product {s}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative h-36">
        {/* Mean / median lines */}
        <div
          className="absolute bottom-5 top-0 w-px z-10"
          style={{ left: `${((median - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 100}%`, backgroundColor: "#6366f1" }}
        >
          <div className="absolute -top-4 -translate-x-1/2 text-[9px] font-bold text-indigo-500 whitespace-nowrap">median</div>
        </div>
        <div
          className="absolute bottom-5 top-0 w-px z-10"
          style={{ left: `${((mean - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 100}%`, backgroundColor: "#f59e0b" }}
        >
          <div className="absolute -top-4 -translate-x-1/2 text-[9px] font-bold text-amber-500 whitespace-nowrap">mean</div>
        </div>

        {/* Bars */}
        <div className="absolute bottom-5 left-0 right-0 flex items-end gap-0.5 h-28">
          {bins.map((bin, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-indigo-300 hover:bg-indigo-400 transition-colors cursor-default"
              style={{ height: `${(bin.count / maxCount) * 100}%`, opacity: 0.85 }}
              title={`${Math.round(bin.lo)}–${Math.round(bin.hi)}: ${bin.count}`}
            />
          ))}
        </div>
        <div className="absolute bottom-5 left-0 right-0 h-px bg-slate-200" />
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400">
          <span>{Math.min(...data)}</span>
          <span>Sales units</span>
          <span>{Math.max(...data)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-indigo-500" />Median</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-amber-400" />Mean</span>
      </div>

      {/* Insight */}
      <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-slate-700 leading-relaxed">
        <span className="font-semibold text-amber-700">What to look for: </span>
        {isSkewed ? (
          rightSkew ? (
            <>Product {series} is <span className="font-semibold">right-skewed</span> — a few big weeks pull the <span className="font-semibold text-amber-600">mean</span> above the <span className="font-semibold text-indigo-600">median</span>. The median is a better "typical week" here.</>
          ) : (
            <>Product {series} is <span className="font-semibold">left-skewed</span> — a few slow weeks drag the <span className="font-semibold text-amber-600">mean</span> below the <span className="font-semibold text-indigo-600">median</span>.</>
          )
        ) : (
          <>Product {series} is roughly <span className="font-semibold">symmetric</span> — mean and median are close together, so either is a fair summary.</>
        )} Switch to Product B to see a spike-heavy distribution.
      </div>
    </div>
  );
}

// ─── Box Plot ─────────────────────────────────────────────────────────────────

function BoxPlot() {
  const [hovered, setHovered] = useState<"A" | "B" | null>(null);

  const series = [
    { key: "A" as const, label: "Product A", data: SALES_A, color: "bg-indigo-400", border: "border-indigo-300", text: "text-indigo-700", fill: "#818cf8" },
    { key: "B" as const, label: "Product B", data: SALES_B, color: "bg-rose-400", border: "border-rose-200", text: "text-rose-700", fill: "#fb7185" },
  ];

  const stats = series.map(({ key, label, data, fill }) => {
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = pct(data, 25);
    const q2 = pct(data, 50);
    const q3 = pct(data, 75);
    const iqr = q3 - q1;
    const loFence = q1 - 1.5 * iqr;
    const hiFence = q3 + 1.5 * iqr;
    const whiskerLo = sorted.find((v) => v >= loFence) ?? sorted[0];
    const whiskerHi = [...sorted].reverse().find((v) => v <= hiFence) ?? sorted[sorted.length - 1];
    const outliers = data.filter((v) => v < loFence || v > hiFence);
    return { key, label, q1, q2, q3, iqr, whiskerLo, whiskerHi, outliers, fill, min: Math.min(...data), max: Math.max(...data) };
  });

  const globalMin = 20;
  const globalMax = 130;
  const range = globalMax - globalMin;
  const toX = (v: number) => `${((v - globalMin) / range) * 100}%`;

  return (
    <div className="space-y-4">
      <div className="space-y-6 pt-2">
        {stats.map((s) => {
          const isHov = hovered === s.key;
          return (
            <div
              key={s.key}
              className={`space-y-2 cursor-default transition-opacity ${hovered && !isHov ? "opacity-40" : ""}`}
              onMouseEnter={() => setHovered(s.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="text-xs font-semibold text-slate-600">{s.label}</div>
              <div className="relative h-10">
                {/* Whisker line */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-0.5"
                  style={{ left: toX(s.whiskerLo), right: `${100 - parseFloat(toX(s.whiskerHi))}%`, backgroundColor: s.fill, opacity: 0.5 }}
                />
                {/* IQR box */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-5 rounded"
                  style={{
                    left: toX(s.q1),
                    width: `${((s.q3 - s.q1) / range) * 100}%`,
                    backgroundColor: s.fill,
                    opacity: isHov ? 0.85 : 0.65,
                  }}
                />
                {/* Median line */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-0.5 h-7 bg-white z-10"
                  style={{ left: toX(s.q2) }}
                />
                {/* Whisker caps */}
                {[s.whiskerLo, s.whiskerHi].map((v, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4"
                    style={{ left: toX(v), backgroundColor: s.fill }}
                  />
                ))}
                {/* Outlier dots */}
                {s.outliers.map((v, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2"
                    style={{ left: `calc(${toX(v)} - 4px)`, borderColor: s.fill, backgroundColor: "white" }}
                  />
                ))}
              </div>
              {/* Stats row */}
              {isHov && (
                <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
                  <span>Q1 {s.q1.toFixed(0)}</span>
                  <span className="font-bold text-slate-700">Med {s.q2.toFixed(0)}</span>
                  <span>Q3 {s.q3.toFixed(0)}</span>
                  <span>IQR {s.iqr.toFixed(0)}</span>
                  {s.outliers.length > 0 && <span className="text-rose-500">{s.outliers.length} outlier{s.outliers.length > 1 ? "s" : ""}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Axis */}
      <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1">
        <span>{globalMin}</span>
        <span>Sales units</span>
        <span>{globalMax}</span>
      </div>

      {/* Insight */}
      <div className="rounded-lg bg-rose-50 border border-rose-100 px-4 py-3 text-xs text-slate-700 leading-relaxed">
        <span className="font-semibold text-rose-700">What to look for: </span>
        Product B has <span className="font-semibold">outliers</span> (open dots beyond the whiskers) — those spike weeks sit outside 1.5× IQR. The IQR box for B is narrow, meaning most weeks are consistent; the spikes are genuine anomalies worth investigating. Hover each series to inspect the numbers.
      </div>
    </div>
  );
}

// ─── Scatter Plot ─────────────────────────────────────────────────────────────

const PROMO_SPEND = [5, 12, 8, 20, 3, 15, 9, 25, 11, 18, 6, 22, 14, 7, 30, 17, 10, 28, 4, 16];
const REVENUE =    [38, 62, 51, 88, 29, 71, 55, 95, 60, 79, 41, 91, 68, 45, 112, 76, 57, 105, 33, 74];

function scatter(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b) / n;
  const my = ys.reduce((a, b) => a + b) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); dx2 += (xs[i] - mx) ** 2; dy2 += (ys[i] - my) ** 2; }
  const r = num / Math.sqrt(dx2 * dy2);
  const slope = num / dx2;
  const intercept = my - slope * mx;
  return { r, slope, intercept };
}

function ScatterPlot() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { r, slope, intercept } = scatter(PROMO_SPEND, REVENUE);

  const xMin = 0, xMax = 35, yMin = 20, yMax = 120;
  const px = (v: number) => ((v - xMin) / (xMax - xMin)) * 100;
  const py = (v: number) => 100 - ((v - yMin) / (yMax - yMin)) * 100;

  const x1 = xMin, y1 = slope * x1 + intercept;
  const x2 = xMax, y2 = slope * x2 + intercept;

  return (
    <div className="space-y-4">
      <div className="relative border border-slate-100 rounded-lg overflow-hidden bg-slate-50" style={{ paddingBottom: "56.25%" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[30, 50, 70, 90].map((y) => (
            <line key={y} x1={0} y1={py(y)} x2={100} y2={py(y)} stroke="#e2e8f0" strokeWidth="0.4" />
          ))}
          {[10, 20, 30].map((x) => (
            <line key={x} x1={px(x)} y1={0} x2={px(x)} y2={100} stroke="#e2e8f0" strokeWidth="0.4" />
          ))}
          {/* Regression line */}
          <line
            x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)}
            stroke="#6366f1" strokeWidth="0.8" strokeDasharray="2 1" opacity={0.7}
          />
          {/* Points */}
          {PROMO_SPEND.map((x, i) => (
            <circle
              key={i}
              cx={px(x)} cy={py(REVENUE[i])}
              r={hovered === i ? 2.2 : 1.5}
              fill={hovered === i ? "#4f46e5" : "#818cf8"}
              stroke="white" strokeWidth="0.4"
              className="cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        {/* Axis labels (positioned outside the SVG) */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 text-[9px] text-slate-400 pointer-events-none">
          <span>$0k</span><span>Promo spend</span><span>$35k</span>
        </div>
        <div className="absolute top-1 left-1 text-[9px] text-slate-400 pointer-events-none">$120k</div>
        <div className="absolute bottom-4 left-1 text-[9px] text-slate-400 pointer-events-none">$20k</div>
      </div>

      {/* Hover info */}
      <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 min-h-[40px] flex items-center text-xs">
        {hovered !== null ? (
          <span className="text-slate-700">
            Spend <span className="font-mono font-semibold">${PROMO_SPEND[hovered]}k</span> → Revenue <span className="font-mono font-semibold">${REVENUE[hovered]}k</span>
          </span>
        ) : (
          <span className="text-slate-400 italic">Hover a point to inspect it.</span>
        )}
      </div>

      {/* Insight */}
      <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-xs text-slate-700 leading-relaxed">
        <span className="font-semibold text-indigo-700">What to look for: </span>
        The dashed line is the linear regression fit. With r = <span className="font-mono font-semibold">{r.toFixed(2)}</span>, spend and revenue are <span className="font-semibold">strongly correlated</span> — but the scatter also shows some variation, suggesting spend isn't the only driver. Look for points that deviate far from the line (residuals worth investigating).
      </div>
    </div>
  );
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────

const VARS = ["Sales", "Spend", "Visits", "Returns", "Rating"];
const MATRIX = [
  [ 1.00,  0.92,  0.74, -0.31,  0.45],
  [ 0.92,  1.00,  0.68, -0.22,  0.38],
  [ 0.74,  0.68,  1.00, -0.18,  0.61],
  [-0.31, -0.22, -0.18,  1.00, -0.44],
  [ 0.45,  0.38,  0.61, -0.44,  1.00],
];

function corrColor(r: number): string {
  if (r >= 0) {
    const t = r;
    return `rgb(${Math.round(238 + (79 - 238) * t)},${Math.round(242 + (70 - 242) * t)},${Math.round(255 + (229 - 255) * t)})`;
  }
  const t = -r;
  return `rgb(${Math.round(238 + (239 - 238) * t)},${Math.round(242 + (68 - 242) * t)},${Math.round(255 + (68 - 255) * t)})`;
}

function Heatmap() {
  const [cell, setCell] = useState<[number, number] | null>(null);

  const cr = cell ? MATRIX[cell[0]][cell[1]] : null;
  const isDiag = cell ? cell[0] === cell[1] : false;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `52px repeat(${VARS.length}, 1fr)` }}>
          <div />
          {VARS.map((v) => (
            <div key={v} className="text-center text-[10px] font-semibold text-slate-500 pb-1 truncate">{v}</div>
          ))}
          {VARS.map((rowV, row) => (
            <>
              <div key={`l-${row}`} className="flex items-center justify-end pr-2 text-[10px] font-semibold text-slate-500 truncate">{rowV}</div>
              {VARS.map((_, col) => {
                const r = MATRIX[row][col];
                const active = cell?.[0] === row && cell?.[1] === col;
                const textColor = Math.abs(r) > 0.55 ? "text-white" : "text-slate-700";
                return (
                  <div
                    key={`${row}-${col}`}
                    onMouseEnter={() => setCell([row, col])}
                    onMouseLeave={() => setCell(null)}
                    className={`flex items-center justify-center rounded cursor-default select-none ${textColor} ${active ? "ring-2 ring-indigo-400 ring-offset-1 z-10 relative" : ""}`}
                    style={{ width: 48, height: 40, backgroundColor: corrColor(r), opacity: row === col ? 0.8 : 1 }}
                  >
                    <span className="text-[11px] font-mono font-semibold">{r.toFixed(2)}</span>
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Hover panel */}
      <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 min-h-[40px] flex items-center text-xs">
        {cell && cr !== null ? (
          isDiag ? (
            <span className="text-slate-500"><span className="font-semibold text-slate-700">{VARS[cell[0]]}</span> vs itself — always 1.00.</span>
          ) : (
            <span className="text-slate-600">
              <span className="font-semibold text-slate-800">{VARS[cell[0]]}</span> & <span className="font-semibold text-slate-800">{VARS[cell[1]]}</span>: r = <span className="font-mono font-semibold">{cr.toFixed(2)}</span>
              {Math.abs(cr) >= 0.7 && <span className="text-amber-600 ml-1">— high correlation, potential redundancy in a model.</span>}
              {cr < 0 && <span className="text-rose-600 ml-1">— as one rises, the other tends to fall.</span>}
            </span>
          )
        ) : (
          <span className="text-slate-400 italic">Hover a cell to inspect the relationship.</span>
        )}
      </div>

      {/* Color scale */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400">
        <span className="font-mono">−1</span>
        <div className="flex-1 h-2 rounded-full" style={{ background: "linear-gradient(to right, rgb(239,68,68), rgb(238,242,255), rgb(79,70,229))" }} />
        <span className="font-mono">+1</span>
      </div>

      {/* Insight */}
      <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs text-slate-700 leading-relaxed">
        <span className="font-semibold text-emerald-700">What to look for: </span>
        Scan for dark cells away from the diagonal — those are strong relationships worth modeling. The <span className="font-semibold">Sales / Spend</span> pair (r = 0.92) is so correlated you may only need one as a feature. <span className="font-semibold">Returns</span> is negatively correlated with most things — a useful signal in the opposite direction.
      </div>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  {
    id: "histogram",
    label: "Histogram",
    badge: "distribution",
    badgeColor: "bg-indigo-100 text-indigo-700",
    desc: "Shows the distribution of a single continuous variable. Reveals skew, peaks, and gaps.",
    component: Histogram,
  },
  {
    id: "boxplot",
    label: "Box Plot",
    badge: "spread + outliers",
    badgeColor: "bg-rose-100 text-rose-700",
    desc: "Compresses spread into five numbers. The box is the IQR, the line is the median, dots are outliers.",
    component: BoxPlot,
  },
  {
    id: "scatter",
    label: "Scatter Plot",
    badge: "relationship",
    badgeColor: "bg-violet-100 text-violet-700",
    desc: "Plots two continuous variables against each other. The direct way to see correlations and clusters.",
    component: ScatterPlot,
  },
  {
    id: "heatmap",
    label: "Heatmap",
    badge: "all pairs",
    badgeColor: "bg-emerald-100 text-emerald-700",
    desc: "Color-codes every pairwise correlation at once. Patterns jump out faster than reading raw numbers.",
    component: Heatmap,
  },
] as const;

// ─── Main export ──────────────────────────────────────────────────────────────

export default function EDAVizTour() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("histogram");
  const tab = TABS.find((t) => t.id === active)!;
  const Component = tab.component;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          EDA Visualization Toolkit
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-100 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex-1 min-w-[100px] px-3 py-3 text-xs font-semibold transition-colors border-b-2 ${
              active === t.id
                ? "border-indigo-500 text-indigo-700 bg-indigo-50/60"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Description row */}
        <div className="flex items-start gap-2 flex-wrap">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tab.badgeColor}`}>
            {tab.badge}
          </span>
          <p className="text-xs text-slate-500 leading-relaxed flex-1 min-w-[160px]">{tab.desc}</p>
        </div>

        {/* Chart */}
        <Component />
      </div>
    </div>
  );
}
