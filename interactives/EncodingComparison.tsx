"use client";

import { useState } from "react";

type Dataset = {
  label: string;
  ordered: boolean;
  values: string[];
  ordinalNote?: string;
};

const DATASETS: Dataset[] = [
  {
    label: "T-shirt size",
    ordered: true,
    values: ["XS", "S", "M", "L", "XL"],
    ordinalNote: "XS < S < M < L < XL — real order exists",
  },
  {
    label: "Eye color",
    ordered: false,
    values: ["Brown", "Blue", "Green", "Hazel"],
  },
  {
    label: "Country",
    ordered: false,
    values: ["USA", "Germany", "Japan", "Brazil"],
  },
  {
    label: "Satisfaction",
    ordered: true,
    values: ["Very Low", "Low", "Medium", "High", "Very High"],
    ordinalNote: "Very Low < Low < Medium < High < Very High",
  },
  {
    label: "Diagnosis",
    ordered: false,
    values: ["Healthy", "At Risk", "Diabetic", "Pre-diabetic"],
  },
];

type EncodingKey = "nominal" | "onehot" | "ordinal" | "label";

const ENCODINGS: { key: EncodingKey; name: string; description: string }[] = [
  {
    key: "nominal",
    name: "Nominal",
    description: "Arbitrary integers. Implies false ordering.",
  },
  {
    key: "onehot",
    name: "One-Hot",
    description: "One binary column per category. No implied order.",
  },
  {
    key: "ordinal",
    name: "Ordinal",
    description: "Integers that reflect a meaningful natural order.",
  },
  {
    key: "label",
    name: "Label",
    description: "Alphabetical integers. Order is an artifact of sorting.",
  },
];

function getNominalMap(values: string[]): Record<string, number> {
  return Object.fromEntries(values.map((v, i) => [v, i + 1]));
}

function getLabelMap(values: string[]): Record<string, number> {
  const sorted = [...values].sort();
  return Object.fromEntries(sorted.map((v, i) => [v, i]));
}

function getOrdinalMap(values: string[]): Record<string, number> {
  return Object.fromEntries(values.map((v, i) => [v, i]));
}

function OneHotTable({ values }: { values: string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="text-xs font-mono w-full">
        <thead>
          <tr>
            <th className="text-left py-1 pr-3 text-slate-500 font-semibold uppercase tracking-wide">
              value
            </th>
            {values.map((v) => (
              <th
                key={v}
                className="text-center py-1 px-2 text-slate-500 font-semibold uppercase tracking-wide whitespace-nowrap"
              >
                is_{v.toLowerCase().replace(/\s+/g, "_")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, ri) => (
            <tr key={row} className={ri % 2 === 0 ? "bg-slate-50" : ""}>
              <td className="py-1.5 pr-3 text-slate-700 font-semibold">{row}</td>
              {values.map((col) => {
                const active = row === col;
                return (
                  <td key={col} className="text-center py-1.5 px-2">
                    <span
                      className={`inline-block w-5 h-5 rounded text-[11px] font-bold leading-5 text-center
                        ${active
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-400"
                        }`}
                    >
                      {active ? "1" : "0"}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScalarTable({
  values,
  map,
  highlight,
}: {
  values: string[];
  map: Record<string, number>;
  highlight?: (v: string, n: number) => boolean;
}) {
  const nums = values.map((v) => map[v]);
  const sorted = [...nums].sort((a, b) => a - b);
  const isMonotone =
    nums.every((n, i) => i === 0 || n >= nums[i - 1]) ||
    nums.every((n, i) => i === 0 || n <= nums[i - 1]);

  return (
    <div className="overflow-x-auto">
      <table className="text-xs font-mono w-full">
        <thead>
          <tr>
            <th className="text-left py-1 pr-6 text-slate-500 font-semibold uppercase tracking-wide">
              value
            </th>
            <th className="text-left py-1 text-slate-500 font-semibold uppercase tracking-wide">
              encoded
            </th>
            <th className="text-left py-1 pl-4 text-slate-500 font-semibold uppercase tracking-wide">
              implied rank
            </th>
          </tr>
        </thead>
        <tbody>
          {values.map((v, i) => {
            const n = map[v];
            const rank = sorted.indexOf(n) + 1;
            const flagged = highlight ? highlight(v, n) : false;
            return (
              <tr key={v} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                <td className="py-1.5 pr-6 text-slate-700 font-semibold">{v}</td>
                <td className="py-1.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded font-bold text-sm
                      ${flagged
                        ? "bg-amber-100 text-amber-700 border border-amber-300"
                        : "bg-slate-200 text-slate-700"
                      }`}
                  >
                    {n}
                  </span>
                </td>
                <td className="py-1.5 pl-4 text-slate-400">#{rank}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!isMonotone && (
        <p className="mt-2 text-[10px] text-amber-600 italic">
          Note: assigned integers don't follow input order.
        </p>
      )}
    </div>
  );
}

export default function EncodingComparison() {
  const [datasetIdx, setDatasetIdx] = useState(0);
  const [activeEncoding, setActiveEncoding] = useState<EncodingKey>("onehot");

  const dataset = DATASETS[datasetIdx];
  const { values, ordered, ordinalNote } = dataset;

  const nominalMap = getNominalMap(values);
  const labelMap = getLabelMap(values);
  const ordinalMap = getOrdinalMap(values);

  const isGoodChoice =
    (activeEncoding === "onehot" && !ordered) ||
    (activeEncoding === "ordinal" && ordered);

  const isBadChoice =
    (activeEncoding === "nominal" && !ordered) ||
    (activeEncoding === "label" && !ordered) ||
    (activeEncoding === "onehot" && ordered) ||
    (activeEncoding === "nominal" && ordered) ||
    (activeEncoding === "label" && ordered);

  const verdict = isGoodChoice
    ? { color: "emerald", label: "Good choice for this variable" }
    : isBadChoice
    ? { color: "rose", label: "Problematic for this variable" }
    : { color: "slate", label: "Depends on context" };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Encoding Comparison
        </span>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Variable picker */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
            Categorical variable
          </p>
          <div className="flex flex-wrap gap-2">
            {DATASETS.map((ds, i) => (
              <button
                key={ds.label}
                onClick={() => setDatasetIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer
                  ${i === datasetIdx
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
              >
                {ds.label}
                {ds.ordered && (
                  <span className="ml-1.5 text-[9px] uppercase tracking-wide opacity-70">
                    ordered
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Values:{" "}
            <span className="font-mono text-slate-700">
              {values.join(", ")}
            </span>
            {ordered && ordinalNote && (
              <span className="ml-2 text-violet-600 italic">({ordinalNote})</span>
            )}
          </p>
        </div>

        {/* Encoding picker */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
            Encoding method
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ENCODINGS.map((enc) => (
              <button
                key={enc.key}
                onClick={() => setActiveEncoding(enc.key)}
                className={`flex flex-col gap-1 px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer
                  ${activeEncoding === enc.key
                    ? "bg-slate-100 border-slate-400 text-slate-800"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
              >
                <span className="text-xs font-bold">{enc.name}</span>
                <span className="text-[10px] leading-tight opacity-70">
                  {enc.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Verdict badge */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold
            ${verdict.color === "emerald"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : verdict.color === "rose"
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
        >
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0
              ${verdict.color === "emerald"
                ? "bg-emerald-500"
                : verdict.color === "rose"
                ? "bg-rose-500"
                : "bg-slate-400"
              }`}
          />
          {verdict.label}
          {verdict.color === "rose" && !ordered && (
            <span className="ml-1 font-normal opacity-80">
              — this encoding implies an ordering that doesn&apos;t exist
            </span>
          )}
          {verdict.color === "rose" && ordered && activeEncoding === "onehot" && (
            <span className="ml-1 font-normal opacity-80">
              — one-hot discards the meaningful order between categories
            </span>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg bg-white border border-slate-200 p-4">
          {activeEncoding === "onehot" ? (
            <OneHotTable values={values} />
          ) : activeEncoding === "nominal" ? (
            <ScalarTable
              values={values}
              map={nominalMap}
              highlight={!ordered ? () => true : undefined}
            />
          ) : activeEncoding === "ordinal" ? (
            <ScalarTable values={values} map={ordinalMap} />
          ) : (
            <ScalarTable
              values={values}
              map={labelMap}
              highlight={!ordered ? () => true : undefined}
            />
          )}
        </div>

        {/* Explainer */}
        <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3 space-y-1">
          {activeEncoding === "onehot" && (
            <p>
              One-hot creates a separate binary column for each category.
              No column is numerically "higher" than another —{" "}
              {ordered
                ? "but you're throwing away the real ordering between values."
                : "which is exactly right for unordered categories like these."}
            </p>
          )}
          {activeEncoding === "ordinal" && (
            <p>
              Ordinal encoding assigns integers that reflect a deliberate order you define.{" "}
              {ordered
                ? "This matches the natural order of these categories."
                : "But these categories have no inherent order — any integers you assign are arbitrary and will mislead models."}
            </p>
          )}
          {activeEncoding === "nominal" && (
            <p>
              Nominal encoding assigns integers without any ordering intent — but any model that sees
              numbers will treat{" "}
              <span className="font-mono text-slate-700">3</span> as greater than{" "}
              <span className="font-mono text-slate-700">1</span>.{" "}
              {ordered ? "With an ordered variable, this could accidentally work — but ordinal encoding is more explicit." : "With unordered categories, this silently introduces false structure."}
            </p>
          )}
          {activeEncoding === "label" && (
            <p>
              Label encoding assigns integers alphabetically. The ordering is a byproduct of the
              alphabet, not of any real-world meaning.{" "}
              {ordered
                ? "Your order probably doesn't match alphabetical order — use ordinal encoding instead."
                : "For unordered categories, it still implies false ordering to any model."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
