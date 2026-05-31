"use client";

import { useState } from "react";

type StepId = "schema" | "naming" | "protocols" | "storage" | "documentation";

interface Choice {
  id: string;
  label: string;
  description: string;
  quality: "good" | "ok" | "bad";
  feedback: string;
}

interface Step {
  id: StepId;
  title: string;
  subtitle: string;
  accent: string;
  accentLight: string;
  accentBorder: string;
  accentText: string;
  question: string;
  context: string;
  choices: Choice[];
  goodTakeaway: string;
}

const STEPS: Step[] = [
  {
    id: "schema",
    title: "Schema Design",
    subtitle: "Fields, types, constraints",
    accent: "bg-indigo-100",
    accentLight: "bg-indigo-50",
    accentBorder: "border-indigo-200",
    accentText: "text-indigo-700",
    question: "You're collecting patient temperature readings. How do you define the temperature field?",
    context: "You're building an intake form for a small clinic. Nurses will record patient temperatures throughout the day.",
    choices: [
      {
        id: "a",
        label: "text field, no constraints",
        description: "Accept any text — \"98.6\", \"98.6 F\", \"normal\", \"thirty-seven\"",
        quality: "bad",
        feedback: "A free-text field will immediately produce inconsistent data: mixed units, prose notes, and values that can't be compared or averaged. Schema constraints exist to prevent this at ingestion.",
      },
      {
        id: "b",
        label: "decimal(4,1), unit stored separately",
        description: "Numeric value with one decimal place; a separate unit field defaults to °F",
        quality: "good",
        feedback: "Correct. Separating value from unit keeps the numeric field analytically clean, the type constraint prevents garbage input, and the default handles the common case without burdening the data entry flow.",
      },
      {
        id: "c",
        label: "integer only",
        description: "Whole numbers only — round 98.6°F to 99",
        quality: "ok",
        feedback: "Integers avoid fractions but lose clinically meaningful precision. A 0.4°F rounding error matters when the clinical threshold for fever is 100.4°F. Decimals are the right choice here.",
      },
    ],
    goodTakeaway: "Define types and constraints that match the real-world precision you need — not looser, not tighter.",
  },
  {
    id: "naming",
    title: "Naming Conventions",
    subtitle: "Consistent from day one",
    accent: "bg-violet-100",
    accentLight: "bg-violet-50",
    accentBorder: "border-violet-200",
    accentText: "text-violet-700",
    question: "Three analysts each add a column for a patient's date of birth. Which outcome are you trying to prevent?",
    context: "Your team is growing. Two analysts joined last month and a contractor starts next week. No naming guide exists yet.",
    choices: [
      {
        id: "a",
        label: "dob, date_of_birth, DateOfBirth — all in the same table",
        description: "Each person used the convention they knew. Now joins silently duplicate rows.",
        quality: "bad",
        feedback: "This is what happens without a standard. Three columns holding the same concept break every query that assumes one canonical name. Fixing it later requires a migration and re-testing everything downstream.",
      },
      {
        id: "b",
        label: "dob everywhere, documented in a data dictionary",
        description: "One abbreviation, agreed on day one, written down so new teammates learn it immediately.",
        quality: "good",
        feedback: "A single canonical name — even an abbreviated one — eliminates ambiguity. The data dictionary entry (full name, type, example value, source) means newcomers never have to guess.",
      },
      {
        id: "c",
        label: "date_of_birth everywhere, no documentation",
        description: "Descriptive and consistent, but only in tribal knowledge.",
        quality: "ok",
        feedback: "Consistent naming is correct; skipping the documentation is the gap. Without a written record, the next hire invents their own abbreviation and the drift starts again.",
      },
    ],
    goodTakeaway: "Pick one convention, write it down, and enforce it at code review time — not after the fact.",
  },
  {
    id: "protocols",
    title: "Collection Protocols",
    subtitle: "How data enters; what validation runs",
    accent: "bg-emerald-100",
    accentLight: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-700",
    question: "A sensor uploads readings every 5 minutes. Occasionally a reading is missing. What's your ingestion protocol?",
    context: "You're logging air quality sensors across 12 city locations. The pipeline runs unattended overnight.",
    choices: [
      {
        id: "a",
        label: "Skip missing rows silently",
        description: "If there's no reading, write nothing. The gap just won't exist in the table.",
        quality: "bad",
        feedback: "Silent gaps are invisible in queries. A weekly average computed over present rows will look normal even if 30% of readings are missing — and you'll never know. Always record the absence explicitly.",
      },
      {
        id: "b",
        label: "Insert a NULL with a status flag (missing_reason = 'sensor_timeout')",
        description: "The row exists; the value is null; the reason is recorded.",
        quality: "good",
        feedback: "Explicit nulls with provenance let downstream code handle missingness intentionally: exclude them, impute them, or flag reports that hit a missing-data threshold. The status flag is what separates 'not measured' from 'measured as zero'.",
      },
      {
        id: "c",
        label: "Carry forward the last known value",
        description: "Fill the gap with the previous reading to keep the time series continuous.",
        quality: "ok",
        feedback: "Forward-filling can be reasonable for visualization but is dangerous as a default ingestion rule — it manufactures data and obscures sensor failures. Better to store the null and forward-fill only when you deliberately choose to, at analysis time.",
      },
    ],
    goodTakeaway: "Design for failure at ingestion: explicit nulls, status flags, and validation rules prevent silent data rot.",
  },
  {
    id: "storage",
    title: "Storage & Version Control",
    subtitle: "Logical structure, versioned",
    accent: "bg-amber-100",
    accentLight: "bg-amber-50",
    accentBorder: "border-amber-200",
    accentText: "text-amber-700",
    question: "You've cleaned a raw CSV and produced an analysis-ready version. Where and how do you save it?",
    context: "You're working on a six-month longitudinal study. Raw files arrive monthly from a partner organization.",
    choices: [
      {
        id: "a",
        label: "Overwrite the raw file in place",
        description: "Save disk space. One file, always current.",
        quality: "bad",
        feedback: "Overwriting raw data is irreversible. If the cleaning script has a bug — or a stakeholder asks 'what did the original say?' — you have no recovery path. Raw data is read-only by convention.",
      },
      {
        id: "b",
        label: "raw/ → processed/ → analysis/ with dated filenames and a README",
        description: "Layered directories; each stage is preserved; a README explains what each layer contains.",
        quality: "good",
        feedback: "Layered storage separates concerns: raw is immutable, processed tracks every cleaning step, analysis holds the final artifacts. Dated filenames make the provenance chain obvious. The README is the map.",
      },
      {
        id: "c",
        label: "One folder, append _v2 / _final / _FINAL2 to filenames",
        description: "Keep everything, but in a flat structure with version suffixes.",
        quality: "ok",
        feedback: "Better than overwriting, but _final/_FINAL2 naming degrades quickly and gives no indication of what changed between versions. A structured directory with dates or semantic version numbers is far easier to navigate six months later.",
      },
    ],
    goodTakeaway: "Raw data is sacred — never overwrite it. Use layered directories and explicit versioning from the start.",
  },
  {
    id: "documentation",
    title: "Documentation",
    subtitle: "What each field means, where it came from",
    accent: "bg-rose-100",
    accentLight: "bg-rose-50",
    accentBorder: "border-rose-200",
    accentText: "text-rose-700",
    question: "A colleague picks up your dataset six months after collection ends. What should they find?",
    context: "You're handing off a completed survey dataset before going on leave. The project will continue without you.",
    choices: [
      {
        id: "a",
        label: "The data files only — it's self-explanatory",
        description: "Column names are descriptive enough. They'll figure it out.",
        quality: "bad",
        feedback: "Column names don't explain what 'status = 3' means, why rows from March are missing, or what cleaning was applied. Without documentation, your colleague's first week is reverse-engineering decisions you made months ago.",
      },
      {
        id: "b",
        label: "A data dictionary + a README covering collection dates, cleaning steps, known issues, and excluded records",
        description: "Every field defined; every decision recorded; known gaps disclosed.",
        quality: "good",
        feedback: "This is the minimum viable handoff. The data dictionary defines every field (name, type, allowed values, example). The README covers provenance, cleaning choices, known issues, and what was excluded and why. Future-you will thank present-you.",
      },
      {
        id: "c",
        label: "Comments in the cleaning script only",
        description: "The code documents itself. Anyone who wants to understand should read the script.",
        quality: "ok",
        feedback: "Code comments are better than nothing, but a script isn't a data dictionary. Stakeholders who don't read code won't get the context they need, and the comments won't survive if the script is refactored.",
      },
    ],
    goodTakeaway: "Documentation is a gift to your future collaborators — and to yourself. Write it before the context fades.",
  },
];

const QUALITY_STYLES = {
  good: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    feedback: "bg-emerald-50 border-emerald-200 text-emerald-800",
    icon: "✓",
  },
  ok: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    feedback: "bg-amber-50 border-amber-200 text-amber-800",
    icon: "~",
  },
  bad: {
    badge: "bg-red-100 text-red-600 border-red-200",
    feedback: "bg-red-50 border-red-200 text-red-700",
    icon: "✕",
  },
};

const QUALITY_LABELS = { good: "Good choice", ok: "Partial", bad: "Watch out" };

function StepDot({ step, index, current, answered }: {
  step: Step;
  index: number;
  current: number;
  answered: boolean;
}) {
  const isActive = index === current;
  const isPast = index < current;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
          isActive
            ? `${step.accent} ${step.accentBorder} ${step.accentText}`
            : isPast || answered
            ? "bg-slate-100 border-slate-300 text-slate-500"
            : "bg-white border-slate-200 text-slate-300"
        }`}
      >
        {isPast ? "✓" : index + 1}
      </div>
      <span className={`text-[9px] font-semibold uppercase tracking-wide hidden sm:block ${
        isActive ? step.accentText : "text-slate-400"
      }`}>
        {step.title.split(" ")[0]}
      </span>
    </div>
  );
}

export default function DataInfrastructureWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<StepId, string | null>>({
    schema: null, naming: null, protocols: null, storage: null, documentation: null,
  });
  const [revealed, setRevealed] = useState<Record<StepId, boolean>>({
    schema: false, naming: false, protocols: false, storage: false, documentation: false,
  });
  const [done, setDone] = useState(false);

  const step = STEPS[currentStep];
  const selected = selections[step.id];
  const isRevealed = revealed[step.id];
  const selectedChoice = step.choices.find((c) => c.id === selected);
  const isLast = currentStep === STEPS.length - 1;

  function select(choiceId: string) {
    if (isRevealed) return;
    setSelections((s) => ({ ...s, [step.id]: choiceId }));
  }

  function reveal() {
    if (!selected) return;
    setRevealed((r) => ({ ...r, [step.id]: true }));
  }

  function next() {
    if (isLast) {
      setDone(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function reset() {
    setCurrentStep(0);
    setSelections({ schema: null, naming: null, protocols: null, storage: null, documentation: null });
    setRevealed({ schema: false, naming: false, protocols: false, storage: false, documentation: false });
    setDone(false);
  }

  const goodCount = STEPS.filter((s) => {
    const sel = selections[s.id];
    return sel && s.choices.find((c) => c.id === sel)?.quality === "good";
  }).length;

  if (done) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Data Infrastructure Wizard — Complete
          </span>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-slate-100 bg-slate-50 py-4">
              <div className="text-2xl font-bold text-slate-700">{STEPS.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Decisions</div>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 py-4">
              <div className="text-2xl font-bold text-emerald-600">{goodCount}</div>
              <div className="text-xs text-emerald-500 mt-0.5">Best choice</div>
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 py-4">
              <div className="text-2xl font-bold text-amber-600">{STEPS.length - goodCount}</div>
              <div className="text-xs text-amber-500 mt-0.5">Room to improve</div>
            </div>
          </div>

          <div className="space-y-2">
            {STEPS.map((s) => {
              const sel = selections[s.id];
              const choice = s.choices.find((c) => c.id === sel);
              if (!choice) return null;
              const styles = QUALITY_STYLES[choice.quality];
              return (
                <div key={s.id} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 flex items-start gap-3">
                  <span className={`shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs font-bold ${styles.badge}`}>
                    {styles.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-600">{s.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-snug">{s.goodTakeaway}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={reset}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Data Infrastructure Wizard
        </span>
        <span className="text-xs text-slate-400 font-mono">{currentStep + 1} / {STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-indigo-300 transition-all duration-300"
          style={{ width: `${((currentStep + (isRevealed ? 1 : 0)) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="px-5 pt-4 pb-2 flex items-start justify-between gap-1">
        {STEPS.map((s, i) => (
          <StepDot
            key={s.id}
            step={s}
            index={i}
            current={currentStep}
            answered={!!selections[s.id]}
          />
        ))}
      </div>

      <div className="p-5 space-y-5">
        {/* Step header */}
        <div className={`rounded-lg px-4 py-3 ${step.accentLight} border ${step.accentBorder}`}>
          <div className={`text-xs font-semibold uppercase tracking-wide ${step.accentText} mb-0.5`}>
            {step.title}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{step.context}</p>
        </div>

        {/* Question */}
        <div>
          <p className="text-sm font-semibold text-slate-700 leading-snug">{step.question}</p>
        </div>

        {/* Choices */}
        <div className="space-y-2">
          {step.choices.map((choice) => {
            const isSelected = selected === choice.id;
            const styles = isRevealed ? QUALITY_STYLES[choice.quality] : null;
            return (
              <button
                key={choice.id}
                onClick={() => select(choice.id)}
                disabled={isRevealed}
                className={`w-full text-left rounded-lg border px-4 py-3 transition-all ${
                  isRevealed
                    ? isSelected
                      ? `${styles!.feedback} border-current`
                      : "bg-slate-50 border-slate-100 opacity-50"
                    : isSelected
                    ? `${step.accentLight} ${step.accentBorder} ring-2 ring-offset-0 ${step.accentText.replace("text-", "ring-")}`
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    isRevealed && isSelected
                      ? `${styles!.badge}`
                      : isSelected
                      ? `${step.accentBorder} ${step.accentText} ${step.accentLight}`
                      : "border-slate-300 text-slate-400"
                  }`}>
                    {isRevealed && isSelected ? styles!.icon : ""}
                  </span>
                  <div className="min-w-0">
                    <div className={`text-sm font-medium leading-snug ${
                      isRevealed && isSelected ? "" : "text-slate-700"
                    }`}>
                      {choice.label}
                    </div>
                    <div className={`text-xs mt-0.5 leading-relaxed ${
                      isRevealed && isSelected ? "opacity-80" : "text-slate-500"
                    }`}>
                      {choice.description}
                    </div>
                  </div>
                  {isRevealed && isSelected && (
                    <span className={`shrink-0 ml-auto text-xs font-semibold px-2 py-0.5 rounded border ${styles!.badge}`}>
                      {QUALITY_LABELS[choice.quality]}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isRevealed && selectedChoice && (
          <div className={`rounded-lg border px-4 py-3 ${QUALITY_STYLES[selectedChoice.quality].feedback} border-current`}>
            <p className="text-sm leading-relaxed">{selectedChoice.feedback}</p>
            {selectedChoice.quality !== "good" && (
              <p className="text-xs font-semibold mt-2 pt-2 border-t border-current border-opacity-20">
                Key principle: {step.goodTakeaway}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {!isRevealed ? (
          <button
            onClick={reveal}
            disabled={!selected}
            className="w-full rounded-lg bg-indigo-600 text-white text-sm font-semibold py-2.5 disabled:opacity-40 hover:bg-indigo-700 transition-colors"
          >
            Check my answer
          </button>
        ) : (
          <button
            onClick={next}
            className="w-full rounded-lg bg-indigo-600 text-white text-sm font-semibold py-2.5 hover:bg-indigo-700 transition-colors"
          >
            {isLast ? "See summary →" : "Next step →"}
          </button>
        )}
      </div>
    </div>
  );
}
