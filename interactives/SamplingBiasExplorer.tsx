"use client";

import { useState } from "react";

type BiasType = "selection" | "volunteer" | "response" | "measurement";

interface Scenario {
  id: BiasType;
  label: string;
  chipClass: string;         // tab active state
  dotFilled: string;         // tailwind bg for filled dot
  dotHex: string;            // hex for hollow dot border
  statAccentClass: string;   // sample stat text + border tint
  statBgClass: string;
  statBorderClass: string;
  description: string;
  setup: string;
  populationLabel: string;
  sampleLabel: string;
  people: Array<"included" | "excluded" | "distorted">;
  stat: { population: string; sample: string; label: string };
  warning: string;
  mitigation: string;
}

function buildPeople(
  includedCount: number,
  excludedCount: number,
  distortedCount: number,
  total = 80
): Array<"included" | "excluded" | "distorted"> {
  return Array.from({ length: total }, (_, i) => {
    if (i < includedCount) return "included";
    if (i < includedCount + excludedCount) return "excluded";
    if (i < includedCount + excludedCount + distortedCount) return "distorted";
    return "excluded";
  });
}

const SCENARIOS: Scenario[] = [
  {
    id: "selection",
    label: "Selection Bias",
    chipClass: "bg-blue-100 text-blue-800 border-blue-300",
    dotFilled: "bg-blue-400",
    dotHex: "#60a5fa",
    statAccentClass: "text-blue-700",
    statBgClass: "bg-blue-50",
    statBorderClass: "border-blue-200",
    description:
      "Certain groups are structurally unreachable — not because they refused, but because the collection method never touched them.",
    setup:
      "An internet-usage survey is distributed only through online platforms. People without reliable internet access are excluded before a single question is asked.",
    populationLabel: "All adults in the region",
    sampleLabel: "Online platform users only",
    people: buildPeople(28, 52, 0),
    stat: {
      population: "38% have no home broadband",
      sample: "3% report no broadband",
      label: "broadband gap",
    },
    warning: "Your sample looks like online users, not the population.",
    mitigation:
      "Random sampling gives every person an equal chance of inclusion. Stratified sampling ensures proportional coverage of known subgroups (e.g., by income or region).",
  },
  {
    id: "volunteer",
    label: "Volunteer Bias",
    chipClass: "bg-violet-100 text-violet-800 border-violet-300",
    dotFilled: "bg-violet-400",
    dotHex: "#a78bfa",
    statAccentClass: "text-violet-700",
    statBgClass: "bg-violet-50",
    statBorderClass: "border-violet-200",
    description:
      "Self-selection creates a sample of motivated participants — and they differ systematically from those who didn't bother.",
    setup:
      "A patient advocacy group emails members asking them to rate treatment satisfaction. Those with strong opinions (very satisfied or very dissatisfied) respond at far higher rates.",
    populationLabel: "All patients treated",
    sampleLabel: "Motivated self-selectors",
    people: buildPeople(22, 58, 0),
    stat: {
      population: "54% satisfied with treatment",
      sample: "83% satisfied (strong opinions dominate)",
      label: "satisfaction rate",
    },
    warning: "Volunteers are motivated outliers — the disengaged majority is silent.",
    mitigation:
      "Follow up non-respondents, offer incentives for participation, or weight responses by known population characteristics to compensate for differential response rates.",
  },
  {
    id: "response",
    label: "Response Bias",
    chipClass: "bg-amber-100 text-amber-800 border-amber-300",
    dotFilled: "bg-amber-400",
    dotHex: "#fbbf24",
    statAccentClass: "text-amber-700",
    statBgClass: "bg-amber-50",
    statBorderClass: "border-amber-200",
    description:
      "People are reachable and do respond — but their answers don't reflect reality. Social desirability, recall error, or question framing shifts what they report.",
    setup:
      "A food-frequency questionnaire asks how many servings of vegetables respondents ate last week. People consistently over-report, wanting to seem healthy.",
    populationLabel: "All survey respondents",
    sampleLabel: "Same people — distorted answers",
    people: buildPeople(0, 0, 80),
    stat: {
      population: "~2.1 servings/day (biomarker estimate)",
      sample: "4.3 servings/day (self-reported)",
      label: "daily vegetable servings",
    },
    warning: "Your sample is the right people — but the data they gave you is systematically wrong.",
    mitigation:
      "Use anonymous or confidential collection, validate self-reports against objective measures (biomarkers, records), and pre-test questions for social-desirability loading.",
  },
  {
    id: "measurement",
    label: "Measurement Bias",
    chipClass: "bg-rose-100 text-rose-800 border-rose-300",
    dotFilled: "bg-rose-400",
    dotHex: "#f87171",
    statAccentClass: "text-rose-700",
    statBgClass: "bg-rose-50",
    statBorderClass: "border-rose-200",
    description:
      "The instrument itself is miscalibrated — producing readings that are consistently off for everyone, or differently off for different groups.",
    setup:
      "A blood-pressure cuff is used uncalibrated. It reads 8 mmHg high across all patients, so hypertension prevalence appears far higher than it actually is.",
    populationLabel: "All patients measured",
    sampleLabel: "Same patients — inflated readings",
    people: buildPeople(0, 0, 80),
    stat: {
      population: "23% hypertensive (true rate)",
      sample: "41% hypertensive (inflated cuff)",
      label: "hypertension prevalence",
    },
    warning: "The problem isn't who you measured — it's what your instrument told you about them.",
    mitigation:
      "Calibrate instruments regularly, validate against gold-standard measures, and audit for differential accuracy across subgroups (some automated tools perform worse on certain demographics).",
  },
];

export default function SamplingBiasExplorer() {
  const [active, setActive] = useState<BiasType>("selection");
  const [showMitigation, setShowMitigation] = useState(false);

  const s = SCENARIOS.find((sc) => sc.id === active)!;

  const isStructural = active === "selection" || active === "volunteer";
  const includedCount = s.people.filter((p) => p === "included").length;
  const excludedCount = s.people.filter((p) => p === "excluded").length;
  const distortedCount = s.people.filter((p) => p === "distorted").length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Sampling Bias Explorer
        </span>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* tab strip */}
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                setActive(sc.id);
                setShowMitigation(false);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer
                ${active === sc.id
                  ? sc.chipClass
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* description */}
        <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>

        {/* scenario box */}
        <div className={`rounded-lg border ${s.statBorderClass} ${s.statBgClass} px-4 py-3`}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
            Scenario
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{s.setup}</p>
        </div>

        {/* grid + stat comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* population dot grid */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Population (80 people)
            </p>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(10, 1fr)" }}>
              {s.people.map((state, i) => (
                <div key={i} className="flex items-center justify-center">
                  {state === "included" ? (
                    <div className={`w-3 h-3 rounded-full ${s.dotFilled}`} />
                  ) : state === "distorted" ? (
                    <div
                      className="w-3 h-3 rounded-full border-2"
                      style={{ borderColor: s.dotHex, backgroundColor: "transparent" }}
                    />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                  )}
                </div>
              ))}
            </div>
            {/* legend */}
            <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 mt-1">
              {isStructural ? (
                <>
                  <span className="flex items-center gap-1">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${s.dotFilled}`} />
                    in sample ({includedCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />
                    excluded ({excludedCount})
                  </span>
                </>
              ) : (
                <span className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block border-2"
                    style={{ borderColor: s.dotHex, backgroundColor: "transparent" }}
                  />
                  reached, biased ({distortedCount})
                </span>
              )}
            </div>
          </div>

          {/* stat comparison */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              What the numbers say
            </p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                {s.populationLabel}
              </span>
              <span className="text-base font-semibold text-slate-700">
                {s.stat.population}
              </span>
              <span className="text-[10px] text-slate-400">{s.stat.label}</span>
            </div>
            <div className={`rounded-lg border ${s.statBorderClass} ${s.statBgClass} px-3 py-2.5 flex flex-col gap-1`}>
              <span className={`text-[10px] uppercase tracking-wide ${s.statAccentClass}`}>
                {s.sampleLabel}
              </span>
              <span className={`text-base font-semibold ${s.statAccentClass}`}>
                {s.stat.sample}
              </span>
              <span className="text-[10px] text-slate-400">{s.stat.label}</span>
            </div>
          </div>
        </div>

        {/* warning */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 flex gap-2 items-start">
          <span className="text-amber-500 text-sm mt-0.5 shrink-0">⚠</span>
          <p className="text-sm text-amber-800 leading-relaxed">{s.warning}</p>
        </div>

        {/* mitigation toggle */}
        <div>
          <button
            onClick={() => setShowMitigation((v) => !v)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer
              ${showMitigation
                ? "bg-slate-100 border-slate-300 text-slate-700"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
          >
            {showMitigation ? "Hide mitigation" : "Show mitigation →"}
          </button>
          {showMitigation && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                Mitigation
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">{s.mitigation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
