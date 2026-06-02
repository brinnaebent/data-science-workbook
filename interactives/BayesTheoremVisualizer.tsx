"use client";

import { useState, useMemo } from "react";

// ── Presets ────────────────────────────────────────────────────────────────────

interface Preset {
  id: string;
  label: string;
  description: string;
  prior: number;
  sensitivity: number;
  specificity: number;
  domain: {
    subject: string;       // e.g. "disease" | "spam"
    positive: string;      // e.g. "positive test" | "flagged as spam"
    unit: string;          // e.g. "person" | "email"
    priorLabel: string;    // e.g. "prevalence" | "spam rate"
    ppvLabel: string;      // full PPV label
    ppvCaption: string;    // one-line caption under PPV
    formulaD: string;      // symbol for hypothesis in formula
    formulaPos: string;    // symbol for positive evidence
    insightLow: (prior: number, ppv: number) => string;
    insightHigh: (prior: number, ppv: number) => string;
  };
}

const medicalDomain: Preset["domain"] = {
  subject: "disease",
  positive: "positive test",
  unit: "person",
  priorLabel: "prevalence",
  ppvLabel: "PPV — P(disease | positive test)",
  ppvCaption: "If you test positive, the probability you actually have the condition.",
  formulaD: "D",
  formulaPos: "+",
  insightLow: (prior, ppv) =>
    `With only ${prior}% prevalence, most positive tests are false positives — even a very accurate test has PPV of ${ppv.toFixed(0)}%. Prevalence (the prior) dominates the posterior.`,
  insightHigh: (prior, ppv) =>
    `At ${prior}% prevalence, the prior is high enough that PPV = ${ppv.toFixed(0)}%. As prevalence rises, false positives become a smaller fraction of all positives.`,
};

const spamDomain: Preset["domain"] = {
  subject: "spam",
  positive: "flagged as spam",
  unit: "email",
  priorLabel: "spam rate",
  ppvLabel: "PPV — P(spam | flagged)",
  ppvCaption: "If an email is flagged, the probability it is actually spam.",
  formulaD: "S",
  formulaPos: "F",
  insightLow: (prior, ppv) =>
    `With only ${prior}% spam rate, most flagged emails are legitimate — even an accurate filter has PPV of ${ppv.toFixed(0)}%. The low base rate (prior) drives most false positives.`,
  insightHigh: (prior, ppv) =>
    `At ${prior}% spam rate, the prior is high enough that PPV = ${ppv.toFixed(0)}%. As the spam rate rises, false positives become a smaller share of all flagged messages.`,
};

const PRESETS: Preset[] = [
  {
    id: "rare-disease",
    label: "Rare disease",
    description: "Disease affects 1% of population. Test is 95% sensitive and 95% specific.",
    prior: 1,
    sensitivity: 95,
    specificity: 95,
    domain: medicalDomain,
  },
  {
    id: "common",
    label: "Common condition",
    description: "30% prevalence. Same test — watch how PPV dramatically increases.",
    prior: 30,
    sensitivity: 95,
    specificity: 95,
    domain: medicalDomain,
  },
  {
    id: "spam",
    label: "Spam detection",
    description: "50% of emails are spam. Classifier is 90% sensitive and 85% specific.",
    prior: 50,
    sensitivity: 90,
    specificity: 85,
    domain: spamDomain,
  },
];

// ── Bayes calculation ──────────────────────────────────────────────────────────

function bayes(prior: number, sensitivity: number, specificity: number) {
  const p = prior / 100;
  const sens = sensitivity / 100;
  const spec = specificity / 100;
  const fpr = 1 - spec; // false positive rate

  // P(+) = P(+|D)·P(D) + P(+|¬D)·P(¬D)
  const pPos = sens * p + fpr * (1 - p);
  // P(D|+) = PPV
  const ppv = pPos > 0 ? (sens * p) / pPos : 0;
  // P(+|¬D) = FPR
  const fp = fpr * (1 - p);
  const tp = sens * p;

  return { p, sens, spec, fpr, pPos, ppv, tp, fp };
}

// ── Natural frequency diagram (100 × 100 grid of dots) ────────────────────────

const GRID_N = 200;
const GRID_COLS = 20;
const GRID_ROWS = GRID_N / GRID_COLS;
const DOT_R = 4;
const DOT_GAP = 2;
const UNIT = DOT_R * 2 + DOT_GAP;

const GW = GRID_COLS * UNIT;
const GH = GRID_ROWS * UNIT;

function FrequencyGrid({ tp, fp, fn, tn }: { tp: number; fp: number; fn: number; tn: number }) {
  const slots = [
    ...Array(tp).fill("tp"),
    ...Array(fp).fill("fp"),
    ...Array(fn).fill("fn"),
    ...Array(tn).fill("tn"),
  ];

  const colorMap = {
    tp: "#6366f1",
    fp: "#f59e0b",
    fn: "#94a3b8",
    tn: "#e2e8f0",
  };

  return (
    <svg viewBox={`0 0 ${GW} ${GH}`} style={{ width: "100%", height: GH }}>
      {slots.slice(0, GRID_N).map((type, i) => {
        const col = i % GRID_COLS;
        const row = Math.floor(i / GRID_COLS);
        const cx = col * UNIT + DOT_R;
        const cy = row * UNIT + DOT_R;
        return (
          <circle key={i} cx={cx} cy={cy} r={DOT_R - 0.5}
            fill={colorMap[type as keyof typeof colorMap]} fillOpacity={0.85} />
        );
      })}
    </svg>
  );
}

// ── Bar ───────────────────────────────────────────────────────────────────────

function ProbBar({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <span className={`text-xs font-bold font-mono ${color}`}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${bg}`} style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

// ── Slider row ─────────────────────────────────────────────────────────────────

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-28 shrink-0">{label}</span>
      <input type="range" min={1} max={99} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full accent-indigo-500" />
      <span className="text-xs font-mono text-slate-700 w-10 text-right">{value}%</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function BayesTheoremVisualizer() {
  const [presetId, setPresetId] = useState("rare-disease");
  const [prior, setPrior] = useState(1);
  const [sensitivity, setSensitivity] = useState(95);
  const [specificity, setSpecificity] = useState(95);
  const [domain, setDomain] = useState<Preset["domain"]>(medicalDomain);

  function loadPreset(p: Preset) {
    setPresetId(p.id);
    setPrior(p.prior);
    setSensitivity(p.sensitivity);
    setSpecificity(p.specificity);
    setDomain(p.domain);
  }

  const { p, sens, spec, fpr, pPos, ppv, tp, fp } = useMemo(
    () => bayes(prior, sensitivity, specificity),
    [prior, sensitivity, specificity]
  );

  // Scale to GRID_N for visualization
  const tpN = Math.round(tp * GRID_N);
  const fpN = Math.round(fp * GRID_N);
  const fnN = Math.round((1 - sens) * p * GRID_N);
  const tnN = GRID_N - tpN - fpN - fnN;

  const npv = (1 - p) * spec / (1 - pPos || 1e-9);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Bayes' Theorem Visualizer
        </span>
      </div>

      {/* Presets */}
      <div className="px-5 pt-4 pb-3">
        <div className="text-xs font-semibold text-slate-600 mb-2">Choose a scenario</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => loadPreset(p)}
              className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                presetId === p.id
                  ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}>
              <div className="font-semibold">{p.label}</div>
              <div className="text-slate-500 mt-0.5 leading-snug">{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="px-5 pb-4">
        <div className="rounded-lg border border-slate-100 p-3 space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Adjust inputs
          </div>
          <SliderRow label={`Prior (${domain.priorLabel})`} value={prior} onChange={v => { setPrior(v); setPresetId("custom"); }} />
          <SliderRow label="Sensitivity (TPR)" value={sensitivity} onChange={v => { setSensitivity(v); setPresetId("custom"); }} />
          <SliderRow label="Specificity (TNR)" value={specificity} onChange={v => { setSpecificity(v); setPresetId("custom"); }} />
        </div>
      </div>

      {/* Grid + formula side by side */}
      <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Natural frequency grid */}
        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">
            Out of {GRID_N} {domain.unit}s
          </div>
          <FrequencyGrid tp={tpN} fp={fpN} fn={fnN} tn={tnN} />
          <p className="text-[10px] text-slate-400 mt-1">
            Each dot = 1 {domain.unit}. Indigo = true positive, amber = false positive.
          </p>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-600">Posterior probabilities</div>

          <div className={`rounded-lg border px-3 py-3 ${ppv > 0.5 ? "bg-indigo-50 border-indigo-200" : "bg-amber-50 border-amber-200"}`}>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-0.5">
              {domain.ppvLabel}
            </div>
            <div className={`text-3xl font-bold font-mono ${ppv > 0.5 ? "text-indigo-600" : "text-amber-600"}`}>
              {(ppv * 100).toFixed(1)}%
            </div>
            <p className="text-[10px] text-slate-600 mt-1 leading-snug">
              {domain.ppvCaption}
            </p>
          </div>

          <div className="space-y-2">
            <ProbBar label="Sensitivity (recall)" value={sens} color="text-indigo-600" bg="bg-indigo-400" />
            <ProbBar label="Specificity" value={spec} color="text-emerald-600" bg="bg-emerald-400" />
            <ProbBar label="False positive rate" value={fpr} color="text-amber-600" bg="bg-amber-400" />
            <ProbBar label="P(positive test)" value={pPos} color="text-sky-600" bg="bg-sky-400" />
          </div>
        </div>
      </div>

      {/* Bayes formula breakdown */}
      <div className="mx-5 mb-4 rounded-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Bayes' Theorem Step-by-Step
          </span>
        </div>
        <div className="px-4 py-3 space-y-2 font-mono text-xs">
          <div className="text-slate-500">
            P({domain.formulaD}|{domain.formulaPos}) = P({domain.formulaPos}|{domain.formulaD}) × P({domain.formulaD}) / P({domain.formulaPos})
          </div>
          <div className="text-slate-600">
            = {(sens * 100).toFixed(0)}% × {prior}% / P({domain.formulaPos})
          </div>
          <div className="text-slate-600">
            P({domain.formulaPos}) = {(sens * 100).toFixed(0)}% × {prior}% + {(fpr * 100).toFixed(0)}% × {(100 - prior).toFixed(0)}%
            = {(pPos * 100).toFixed(2)}%
          </div>
          <div className="text-indigo-700 font-bold">
            P({domain.formulaD}|{domain.formulaPos}) = {(tp * 100).toFixed(2)}% / {(pPos * 100).toFixed(2)}% = {(ppv * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div className="mx-5 mb-4 rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Key insight</div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {prior <= 5
            ? domain.insightLow(prior, ppv * 100)
            : domain.insightHigh(prior, ppv * 100)}
        </p>
      </div>

      {/* Footer counts */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { label: "True +", value: tpN, color: "text-indigo-600" },
            { label: "False +", value: fpN, color: "text-amber-600" },
            { label: "False −", value: fnN, color: "text-slate-500" },
            { label: "True −", value: tnN, color: "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className={`text-sm font-bold ${color}`}>{value}</div>
              <div className="text-[10px] text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
