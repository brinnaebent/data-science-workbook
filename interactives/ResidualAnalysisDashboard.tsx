"use client";

import { useState, useMemo } from "react";

// ── Math ───────────────────────────────────────────────────────────────────────

function mean(d: number[]) { return d.reduce((s, x) => s + x, 0) / d.length; }
function sd(d: number[]) {
  const m = mean(d);
  return Math.sqrt(d.reduce((s, x) => s + (x - m) ** 2, 0) / (d.length - 1));
}
function probit(p: number): number {
  if (p <= 0) return -4; if (p >= 1) return 4;
  const a = [2.50662823884, -18.61500062529, 41.39119773534, -25.44106049637];
  const b = [-8.4735109309, 23.08336743743, -21.06224101826, 3.13082909833];
  const c = [0.337475482272615, 0.976169019091719, 0.160797971491821, 2.76438810333863e-2,
    3.8405729373609e-3, 3.951896511349e-4, 3.21767881767818e-5, 2.888167364377e-7, 3.960315187768e-7];
  const q = p - 0.5;
  if (Math.abs(q) < 0.42) {
    const r = q * q;
    return q * (((a[3]*r+a[2])*r+a[1])*r+a[0]) / ((((b[3]*r+b[2])*r+b[1])*r+b[0])*r+1);
  }
  const r = Math.log(-Math.log(q < 0 ? p : 1 - p));
  let x = c[0];
  for (let i = 1; i < c.length; i++) x += c[i] * Math.pow(r, i);
  return q < 0 ? -x : x;
}

// ── Model data presets ─────────────────────────────────────────────────────────

type ModelType = "good" | "heteroscedastic" | "nonlinear";

interface ModelPreset {
  id: ModelType;
  label: string;
  description: string;
}

const MODELS: ModelPreset[] = [
  {
    id: "good",
    label: "Well-specified",
    description: "Linear relationship, constant variance, normally distributed residuals — all diagnostic plots look clean.",
  },
  {
    id: "heteroscedastic",
    label: "Heteroscedasticity",
    description: "Variance of residuals grows with fitted values — a classic funnel pattern in the residuals vs. fitted plot.",
  },
  {
    id: "nonlinear",
    label: "Nonlinear pattern",
    description: "True relationship is curved but model is linear — residuals show a U-shape, revealing model misspecification.",
  },
];

const N = 50;

function buildData(type: ModelType) {
  // Deterministic using sine-based pseudorandom for reproducibility
  const pseudo = (i: number, seed = 1) => {
    const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const norm = (i: number, seed = 1) => {
    const u1 = pseudo(i, seed), u2 = pseudo(i, seed + 1);
    return Math.sqrt(-2 * Math.log(u1 + 1e-9)) * Math.cos(2 * Math.PI * u2);
  };

  const xs = Array.from({ length: N }, (_, i) => 1 + (i / (N - 1)) * 9);

  let yHats: number[], residuals: number[];

  switch (type) {
    case "good": {
      const trueY = xs.map(x => 2 + 3 * x);
      yHats = trueY;
      residuals = xs.map((x, i) => norm(i, 1) * 2);
      break;
    }
    case "heteroscedastic": {
      const trueY = xs.map(x => 2 + 3 * x);
      yHats = trueY;
      residuals = xs.map((x, i) => norm(i, 2) * x * 0.6);
      break;
    }
    case "nonlinear": {
      const trueY = xs.map(x => 2 + 3 * x + 0.5 * (x - 5) ** 2);
      // Model only fits linear part
      const linearYHat = xs.map(x => 2 + 3 * x + 3);
      yHats = linearYHat;
      residuals = trueY.map((ty, i) => ty - linearYHat[i] + norm(i, 3) * 1.2);
      break;
    }
  }

  return xs.map((x, i) => ({ x, yHat: yHats[i], residual: residuals[i] }));
}

// ── Residuals vs Fitted chart ──────────────────────────────────────────────────

const CW = 220;
const CH = 160;
const P = { t: 10, r: 10, b: 28, l: 32 };

function RvFChart({ data }: { data: { yHat: number; residual: number }[] }) {
  const xs = data.map(d => d.yHat);
  const ys = data.map(d => d.residual);
  const xlo = Math.min(...xs) - 0.5, xhi = Math.max(...xs) + 0.5;
  const ym = Math.max(Math.abs(Math.min(...ys)), Math.abs(Math.max(...ys))) * 1.2;
  const pw = CW - P.l - P.r, ph = CH - P.t - P.b;
  const sx = (v: number) => P.l + ((v - xlo) / (xhi - xlo)) * pw;
  const sy = (v: number) => P.t + ph / 2 - (v / ym) * (ph / 2);

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      <line x1={P.l} y1={P.t + ph / 2} x2={P.l + pw} y2={P.t + ph / 2} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
      <line x1={P.l} y1={P.t} x2={P.l} y2={P.t + ph} stroke="#e2e8f0" />
      <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph} stroke="#e2e8f0" />
      {data.map((d, i) => (
        <circle key={i} cx={sx(d.yHat)} cy={sy(d.residual)} r={3}
          fill="#6366f1" fillOpacity={0.65} />
      ))}
      <text x={P.l + pw / 2} y={CH - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">Fitted values</text>
      <text x={8} y={P.t + ph / 2} textAnchor="middle" fontSize="8" fill="#94a3b8"
        transform={`rotate(-90, 8, ${P.t + ph / 2})`}>Residuals</text>
    </svg>
  );
}

// ── Q-Q Plot ──────────────────────────────────────────────────────────────────

function QQChart({ residuals }: { residuals: number[] }) {
  const sorted = [...residuals].sort((a, b) => a - b);
  const n = sorted.length;
  const pts = sorted.map((r, i) => ({ theoretical: probit((i + 0.5) / n), sample: r }));
  const sdR = sd(residuals);
  const m = mean(residuals);
  const tlo = pts[0].theoretical, thi = pts[n - 1].theoretical;
  const slo = sorted[0], shi = sorted[n - 1];
  const pw = CW - P.l - P.r, ph = CH - P.t - P.b;
  const sx = (v: number) => P.l + ((v - tlo) / (thi - tlo)) * pw;
  const sy = (v: number) => P.t + ph - ((v - slo) / (shi - slo)) * ph;
  // Reference line
  const q1i = Math.floor(n * 0.25), q3i = Math.floor(n * 0.75);
  const slope = (sorted[q3i] - sorted[q1i]) / (pts[q3i].theoretical - pts[q1i].theoretical + 1e-9);
  const intercept = sorted[q1i] - slope * pts[q1i].theoretical;

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      <line x1={P.l} y1={P.t} x2={P.l} y2={P.t + ph} stroke="#e2e8f0" />
      <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph} stroke="#e2e8f0" />
      <line x1={sx(tlo)} y1={sy(slope * tlo + intercept)} x2={sx(thi)} y2={sy(slope * thi + intercept)}
        stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,3" />
      {pts.map((pt, i) => (
        <circle key={i} cx={sx(pt.theoretical)} cy={sy(pt.sample)} r={3}
          fill="#0ea5e9" fillOpacity={0.65} />
      ))}
      <text x={P.l + pw / 2} y={CH - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">Theoretical quantiles</text>
      <text x={8} y={P.t + ph / 2} textAnchor="middle" fontSize="8" fill="#94a3b8"
        transform={`rotate(-90, 8, ${P.t + ph / 2})`}>Sample quantiles</text>
    </svg>
  );
}

// ── Scale-location chart ───────────────────────────────────────────────────────

function ScaleLocChart({ data }: { data: { yHat: number; residual: number }[] }) {
  const sqrtAbs = data.map(d => Math.sqrt(Math.abs(d.residual)));
  const xlo = Math.min(...data.map(d => d.yHat)) - 0.5;
  const xhi = Math.max(...data.map(d => d.yHat)) + 0.5;
  const yhi = Math.max(...sqrtAbs) * 1.2;
  const pw = CW - P.l - P.r, ph = CH - P.t - P.b;
  const sx = (v: number) => P.l + ((v - xlo) / (xhi - xlo)) * pw;
  const sy = (v: number) => P.t + ph - (v / yhi) * ph;

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", height: CH }}>
      <line x1={P.l} y1={P.t} x2={P.l} y2={P.t + ph} stroke="#e2e8f0" />
      <line x1={P.l} y1={P.t + ph} x2={P.l + pw} y2={P.t + ph} stroke="#e2e8f0" />
      {data.map((d, i) => (
        <circle key={i} cx={sx(d.yHat)} cy={sy(sqrtAbs[i])} r={3}
          fill="#10b981" fillOpacity={0.65} />
      ))}
      <text x={P.l + pw / 2} y={CH - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">Fitted values</text>
      <text x={8} y={P.t + ph / 2} textAnchor="middle" fontSize="8" fill="#94a3b8"
        transform={`rotate(-90, 8, ${P.t + ph / 2})`}>√|residuals|</text>
    </svg>
  );
}

// ── Diagnosis ─────────────────────────────────────────────────────────────────

const DIAGNOSES: Record<ModelType, { ok: boolean; text: string }[]> = {
  good: [
    { ok: true, text: "Residuals scatter randomly around zero — no pattern." },
    { ok: true, text: "Spread is roughly constant across fitted values (homoscedastic)." },
    { ok: true, text: "Q-Q plot points follow the diagonal — normality holds." },
  ],
  heteroscedastic: [
    { ok: false, text: "Funnel shape: spread increases with fitted values." },
    { ok: false, text: "Violates constant-variance (homoscedasticity) assumption." },
    { ok: true, text: "Q-Q plot is roughly linear — normality is acceptable." },
    { ok: false, text: "Fix: use log/sqrt transform on y, or robust regression." },
  ],
  nonlinear: [
    { ok: false, text: "Curved (U-shaped) residual pattern — systematic misfit." },
    { ok: false, text: "Model is missing a quadratic or polynomial term." },
    { ok: false, text: "Q-Q plot may show mild departure at tails." },
    { ok: false, text: "Fix: add x² term or use nonlinear model." },
  ],
};

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ResidualAnalysisDashboard() {
  const [model, setModel] = useState<ModelType>("good");

  const data = useMemo(() => buildData(model), [model]);
  const residuals = useMemo(() => data.map(d => d.residual), [data]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Residual Analysis Dashboard
        </span>
      </div>

      {/* Model selector */}
      <div className="px-5 pt-4 pb-3">
        <div className="text-xs font-semibold text-slate-600 mb-2">Model type</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {MODELS.map(m => (
            <button key={m.id} onClick={() => setModel(m.id)}
              className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                model === m.id
                  ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}>
              <div className="font-semibold">{m.label}</div>
              <div className="text-slate-500 mt-0.5 leading-snug">{m.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3-panel plots */}
      <div className="px-5 pb-3">
        <div className="text-xs font-semibold text-slate-600 mb-2">Diagnostic plots</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Residuals vs. Fitted
            </div>
            <RvFChart data={data} />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Normal Q-Q
            </div>
            <QQChart residuals={residuals} />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Scale-Location
            </div>
            <ScaleLocChart data={data} />
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Diagnosis</span>
        </div>
        <ul className="px-4 py-3 space-y-2">
          {DIAGNOSES[model].map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
              <span className={`mt-0.5 shrink-0 font-bold ${d.ok ? "text-emerald-500" : "text-rose-500"}`}>
                {d.ok ? "✓" : "✗"}
              </span>
              {d.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Stats strip */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs font-bold text-indigo-600">{mean(residuals).toFixed(3)}</div>
            <div className="text-[10px] text-slate-400">Mean residual</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-700">{sd(residuals).toFixed(3)}</div>
            <div className="text-[10px] text-slate-400">SD of residuals</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-700">{residuals.reduce((s, r) => s + r ** 2, 0).toFixed(2)}</div>
            <div className="text-[10px] text-slate-400">SSE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
