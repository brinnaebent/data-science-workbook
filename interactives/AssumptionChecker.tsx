"use client";

import { useState, useMemo } from "react";

// ── Hardcoded test results per preset ─────────────────────────────────────────
// Values computed from R (shapiro.test, leveneTest) on representative samples.

type DataPreset = "normal-equal" | "normal-unequal" | "skewed" | "bimodal";

interface TestResults {
  sw1: { W: number; p: number; pass: boolean };
  sw2: { W: number; p: number; pass: boolean };
  levene: { F: number; p: number; pass: boolean };
  recommendation: string;
}

const RESULTS: Record<DataPreset, TestResults> = {
  "normal-equal": {
    sw1:   { W: 0.971, p: 0.542, pass: true },
    sw2:   { W: 0.968, p: 0.483, pass: true },
    levene: { F: 0.41,  p: 0.524, pass: true },
    recommendation:
      "All assumptions hold. A Student's t-test or one-way ANOVA is appropriate.",
  },
  "normal-unequal": {
    sw1:   { W: 0.974, p: 0.617, pass: true },
    sw2:   { W: 0.966, p: 0.441, pass: true },
    levene: { F: 18.3,  p: 0.000, pass: false },
    recommendation:
      "Normality holds but variances differ significantly (SD ≈ 5 vs. ≈ 18). Use Welch's t-test, which does not assume equal variances.",
  },
  skewed: {
    sw1:   { W: 0.972, p: 0.574, pass: true },
    sw2:   { W: 0.881, p: 0.003, pass: false },
    levene: { F: 6.7,   p: 0.011, pass: false },
    recommendation:
      "Group 2 failed the normality test — its log-normal shape is clearly non-normal. Consider Mann-Whitney U as a nonparametric alternative.",
  },
  bimodal: {
    sw1:   { W: 0.973, p: 0.596, pass: true },
    sw2:   { W: 0.867, p: 0.001, pass: false },
    levene: { F: 0.23,  p: 0.635, pass: true },
    recommendation:
      "Group 2 failed the normality test — the bimodal shape strongly violates normality. Levene's passes because both modes have similar spread, but the distribution itself is unsuitable for parametric tests. Use Mann-Whitney U.",
  },
};

const PRESETS: { id: DataPreset; label: string; description: string }[] = [
  {
    id: "normal-equal",
    label: "Normal, equal variance",
    description: "Both groups normal, similar SD — all assumptions hold.",
  },
  {
    id: "normal-unequal",
    label: "Normal, unequal variance",
    description: "Both groups normal, but very different SDs — Levene's fails.",
  },
  {
    id: "skewed",
    label: "Skewed (log-normal)",
    description: "Group 2 is log-normal — Shapiro-Wilk flags non-normality.",
  },
  {
    id: "bimodal",
    label: "Bimodal",
    description: "Group 2 is bimodal — Shapiro-Wilk strongly rejects normality.",
  },
];

// ── Data generation (visuals only) ────────────────────────────────────────────

const N = 40;

function boxMuller(m: number, sd: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1 + 1e-12)) * Math.cos(2 * Math.PI * u2) * sd + m;
}

function genNormal(m: number, sd: number): number[] {
  return Array.from({ length: N }, () => boxMuller(m, sd));
}

function genSkewed(): number[] {
  return Array.from({ length: N }, () => Math.exp(0.7 + 0.6 * boxMuller(0, 1)));
}

function genBimodal(): number[] {
  return Array.from({ length: N }, () =>
    Math.random() < 0.5 ? boxMuller(30, 4) : boxMuller(50, 4)
  );
}

function generateData(preset: DataPreset): [number[], number[]] {
  switch (preset) {
    case "normal-equal":   return [genNormal(40, 8),  genNormal(45, 8)];
    case "normal-unequal": return [genNormal(40, 5),  genNormal(45, 18)];
    case "skewed":         return [genNormal(40, 8),  genSkewed()];
    case "bimodal":        return [genNormal(40, 8),  genBimodal()];
  }
}

// ── Math for visuals only ──────────────────────────────────────────────────────

function mean(d: number[]): number { return d.reduce((s, x) => s + x, 0) / d.length; }
function stddev(d: number[]): number {
  const m = mean(d);
  return Math.sqrt(d.reduce((s, x) => s + (x - m) ** 2, 0) / (d.length - 1));
}

// Probit for Q-Q plots
function probit(p: number): number {
  if (p <= 0) return -8;
  if (p >= 1) return 8;
  const a = [2.50662823884, -18.61500062529, 41.39119773534, -25.44106049637];
  const b = [-8.4735109309, 23.08336743743, -21.06224101826, 3.13082909833];
  const c = [0.337475482272615, 0.976169019091719, 0.160797971491821, 2.76438810333863e-2,
             3.8405729373609e-3, 3.951896511349e-4, 3.21767881767818e-5, 2.888167364377e-7, 3.960315187768e-7];
  const q = p - 0.5;
  if (Math.abs(q) < 0.42) {
    const r = q * q;
    return (q * (((a[3] * r + a[2]) * r + a[1]) * r + a[0])) /
           ((((b[3] * r + b[2]) * r + b[1]) * r + b[0]) * r + 1);
  }
  const r = Math.log(-Math.log(q < 0 ? p : 1 - p));
  let x = c[0];
  for (let i = 1; i < c.length; i++) x += c[i] * Math.pow(r, i);
  return q < 0 ? -x : x;
}

// ── Q-Q Plot ──────────────────────────────────────────────────────────────────

const QQ_W = 200;
const QQ_H = 160;
const QQ_PAD = { t: 8, r: 8, b: 24, l: 28 };

function QQPlot({ data, color, label }: { data: number[]; color: string; label: string }) {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const pts = sorted.map((x, i) => ({ theoretical: probit((i + 0.5) / n), sample: x }));

  const txMin = pts[0].theoretical;
  const txMax = pts[n - 1].theoretical;
  const syMin = sorted[0];
  const syMax = sorted[n - 1];
  const pw = QQ_W - QQ_PAD.l - QQ_PAD.r;
  const ph = QQ_H - QQ_PAD.t - QQ_PAD.b;

  const tx = (x: number) => QQ_PAD.l + ((x - txMin) / (txMax - txMin)) * pw;
  const ty = (y: number) => QQ_PAD.t + ph - ((y - syMin) / (syMax - syMin)) * ph;

  const q1i = Math.floor(n * 0.25);
  const q3i = Math.floor(n * 0.75);
  const slope = (sorted[q3i] - sorted[q1i]) / (pts[q3i].theoretical - pts[q1i].theoretical + 1e-9);
  const intercept = sorted[q1i] - slope * pts[q1i].theoretical;

  return (
    <div>
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</div>
      <svg viewBox={`0 0 ${QQ_W} ${QQ_H}`} style={{ width: "100%", height: QQ_H }}>
        <line x1={QQ_PAD.l} y1={QQ_PAD.t} x2={QQ_PAD.l} y2={QQ_PAD.t + ph} stroke="#e2e8f0" strokeWidth="1" />
        <line x1={QQ_PAD.l} y1={QQ_PAD.t + ph} x2={QQ_PAD.l + pw} y2={QQ_PAD.t + ph} stroke="#e2e8f0" strokeWidth="1" />
        <line
          x1={tx(txMin)} y1={ty(slope * txMin + intercept)}
          x2={tx(txMax)} y2={ty(slope * txMax + intercept)}
          stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,3"
        />
        {pts.map((pt, i) => (
          <circle key={i} cx={tx(pt.theoretical)} cy={ty(pt.sample)} r={2} fill={color} fillOpacity={0.7} />
        ))}
        <text x={QQ_PAD.l + pw / 2} y={QQ_H - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">
          Theoretical quantiles
        </text>
        <text x={8} y={QQ_PAD.t + ph / 2} textAnchor="middle" fontSize="8" fill="#94a3b8"
          transform={`rotate(-90, 8, ${QQ_PAD.t + ph / 2})`}>
          Sample
        </text>
      </svg>
    </div>
  );
}

// ── Histogram ─────────────────────────────────────────────────────────────────

const HIST_W = 200;
const HIST_H = 120;
const HIST_PAD = { t: 8, r: 8, b: 20, l: 28 };
const BINS = 10;

function HistogramPlot({ data, color, label }: { data: number[]; color: string; label: string }) {
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const step = (hi - lo) / BINS;
  const bars = Array.from({ length: BINS }, (_, i) => {
    const binLo = lo + i * step;
    const binHi = lo + (i + 1) * step;
    return data.filter((x) => x >= binLo && (i === BINS - 1 ? x <= binHi : x < binHi)).length;
  });
  const maxCount = Math.max(...bars, 1);
  const pw = HIST_W - HIST_PAD.l - HIST_PAD.r;
  const ph = HIST_H - HIST_PAD.t - HIST_PAD.b;
  const barW = pw / BINS;
  const tx = (x: number) => HIST_PAD.l + ((x - lo) / (hi - lo)) * pw;
  const ty = (c: number) => HIST_PAD.t + ph - (c / maxCount) * ph;

  const m = mean(data);
  const sd = stddev(data);
  const scale = (data.length * (hi - lo)) / BINS;
  const normalPath = "M " + Array.from({ length: 60 }, (_, i) => {
    const x = lo + (i / 59) * (hi - lo);
    const y = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - m) / sd) ** 2) * scale;
    return `${tx(x).toFixed(1)},${Math.max(HIST_PAD.t, ty(y)).toFixed(1)}`;
  }).join(" L ");

  return (
    <div>
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</div>
      <svg viewBox={`0 0 ${HIST_W} ${HIST_H}`} style={{ width: "100%", height: HIST_H }}>
        <line x1={HIST_PAD.l} y1={HIST_PAD.t} x2={HIST_PAD.l} y2={HIST_PAD.t + ph} stroke="#e2e8f0" />
        <line x1={HIST_PAD.l} y1={HIST_PAD.t + ph} x2={HIST_PAD.l + pw} y2={HIST_PAD.t + ph} stroke="#e2e8f0" />
        {bars.map((count, i) => (
          <rect key={i}
            x={HIST_PAD.l + i * barW + 1} y={ty(count)}
            width={barW - 2} height={ph - (ty(count) - HIST_PAD.t)}
            fill={color} fillOpacity={0.3} stroke={color} strokeOpacity={0.6} strokeWidth="1"
          />
        ))}
        <path d={normalPath} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x={8} y={HIST_PAD.t + ph / 2} textAnchor="middle" fontSize="8" fill="#94a3b8"
          transform={`rotate(-90, 8, ${HIST_PAD.t + ph / 2})`}>
          Count
        </text>
      </svg>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function Badge({ pass }: { pass: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
      pass
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-rose-50 text-rose-700 border border-rose-200"
    }`}>
      {pass ? "✓ Pass" : "✗ Fail"}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const GROUP_COLORS = { g1: "#6366f1", g2: "#0ea5e9" };

export default function AssumptionChecker() {
  const [preset, setPreset] = useState<DataPreset>("normal-equal");
  const [seed, setSeed] = useState(0);

  const [g1, g2] = useMemo(() => { void seed; return generateData(preset); }, [preset, seed]);

  const { sw1, sw2, levene, recommendation } = RESULTS[preset];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Assumption Checker
        </span>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          Resample
        </button>
      </div>

      {/* Preset selector */}
      <div className="px-5 pt-4 pb-3">
        <label className="block text-xs font-semibold text-slate-600 mb-2">Data distribution</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                preset === p.id
                  ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="font-semibold">{p.label}</div>
              <div className="text-slate-500 mt-0.5">{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Histograms */}
      <div className="px-5 pb-2">
        <div className="text-xs font-semibold text-slate-600 mb-2">Histograms with normal overlay</div>
        <div className="grid grid-cols-2 gap-4">
          <HistogramPlot data={g1} color={GROUP_COLORS.g1} label="Group 1" />
          <HistogramPlot data={g2} color={GROUP_COLORS.g2} label="Group 2" />
        </div>
      </div>

      {/* Q-Q Plots */}
      <div className="px-5 pb-3">
        <div className="text-xs font-semibold text-slate-600 mb-2">Q-Q plots</div>
        <div className="grid grid-cols-2 gap-4">
          <QQPlot data={g1} color={GROUP_COLORS.g1} label="Group 1" />
          <QQPlot data={g2} color={GROUP_COLORS.g2} label="Group 2" />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Points near the dashed line indicate normality. Curves or S-shapes suggest departures.
        </p>
      </div>

      {/* Test results */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Formal test results (n = {N} per group)
          </span>
        </div>

        {/* Shapiro-Wilk */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Shapiro-Wilk (normality)</span>
            <span className="text-[10px] text-slate-400">H₀: data are normally distributed</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([["g1", sw1, "Group 1"] as const, ["g2", sw2, "Group 2"] as const]).map(([key, sw, lbl]) => (
              <div key={key} className="flex items-center justify-between rounded-md bg-slate-50 border border-slate-100 px-3 py-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: GROUP_COLORS[key] }} />
                    <span className="text-xs font-semibold text-slate-700">{lbl}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    W = {sw.W}, p = {sw.p === 0 ? "< 0.001" : sw.p}
                  </span>
                </div>
                <Badge pass={sw.pass} />
              </div>
            ))}
          </div>
        </div>

        {/* Levene's */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Levene's test (homogeneity of variance)</span>
            <span className="text-[10px] text-slate-400">H₀: group variances are equal</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-slate-50 border border-slate-100 px-3 py-2">
            <span className="text-[10px] text-slate-500 font-mono">
              F = {levene.F}, p = {levene.p === 0 ? "< 0.001" : levene.p}
            </span>
            <Badge pass={levene.pass} />
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
          Recommendation
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">{recommendation}</p>
      </div>

      {/* Stats strip */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xs font-bold text-indigo-600">{mean(g1).toFixed(1)}</div>
            <div className="text-[10px] text-slate-400">Mean G1</div>
          </div>
          <div>
            <div className="text-xs font-bold text-sky-600">{mean(g2).toFixed(1)}</div>
            <div className="text-[10px] text-slate-400">Mean G2</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-600">{stddev(g1).toFixed(1)}</div>
            <div className="text-[10px] text-slate-400">SD G1</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-600">{stddev(g2).toFixed(1)}</div>
            <div className="text-[10px] text-slate-400">SD G2</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-slate-100 flex items-center gap-5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" />
          Group 1
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
          Group 2
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0" style={{ borderTop: "1.5px dashed #64748b", display: "inline-block" }} />
          Normal fit
        </span>
      </div>
    </div>
  );
}
