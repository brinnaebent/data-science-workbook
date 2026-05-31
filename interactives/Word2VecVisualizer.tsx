"use client";

import { useState, useMemo } from "react";

// Curated 2D projections of a pretrained Word2Vec space (PCA-reduced for visualization)
// Values approximate real GloVe/Word2Vec neighborhood structure
const EMBEDDINGS: Record<string, [number, number]> = {
  // Royalty
  king: [0.82, 0.62], queen: [0.76, 0.78], prince: [0.68, 0.60], princess: [0.61, 0.76],
  lord: [0.72, 0.55], duke: [0.65, 0.58],
  // People
  man: [0.50, 0.40], woman: [0.44, 0.56], boy: [0.42, 0.38], girl: [0.36, 0.52],
  child: [0.39, 0.45], person: [0.47, 0.48], human: [0.49, 0.50],
  // Countries / Cities
  france: [-0.60, 0.40], paris: [-0.64, 0.55], germany: [-0.55, 0.38], berlin: [-0.59, 0.52],
  italy: [-0.50, 0.35], rome: [-0.54, 0.50], spain: [-0.58, 0.32], madrid: [-0.62, 0.48],
  england: [-0.48, 0.42], london: [-0.52, 0.57],
  // Animals
  dog: [0.10, -0.55], cat: [0.05, -0.52], puppy: [0.14, -0.60], kitten: [0.08, -0.58],
  wolf: [0.18, -0.65], fox: [0.15, -0.60], horse: [0.20, -0.45], bird: [0.25, -0.50],
  // Food
  apple: [-0.20, -0.40], banana: [-0.25, -0.45], orange: [-0.15, -0.38], fruit: [-0.18, -0.35],
  bread: [-0.30, -0.30], pizza: [-0.28, -0.42], coffee: [-0.35, -0.35], tea: [-0.32, -0.38],
  // Tech
  computer: [0.35, 0.10], software: [0.40, 0.12], algorithm: [0.45, 0.08], code: [0.38, 0.06],
  data: [0.42, 0.15], model: [0.48, 0.18], network: [0.50, 0.22], system: [0.44, 0.20],
  // Verbs
  run: [0.05, 0.10], walk: [0.08, 0.12], jump: [0.10, 0.08], fly: [0.15, 0.15],
  swim: [0.07, 0.06], speak: [0.12, 0.18], write: [0.18, 0.20], read: [0.20, 0.22],
};

function cosine(a: [number, number], b: [number, number]): number {
  const dot = a[0] * b[0] + a[1] * b[1];
  const na = Math.sqrt(a[0] ** 2 + a[1] ** 2);
  const nb = Math.sqrt(b[0] ** 2 + b[1] ** 2);
  return dot / (na * nb + 1e-8);
}

function nearestNeighbors(word: string, k = 8): { word: string; similarity: number }[] {
  const vec = EMBEDDINGS[word];
  if (!vec) return [];
  return Object.entries(EMBEDDINGS)
    .filter(([w]) => w !== word)
    .map(([w, v]) => ({ word: w, similarity: cosine(vec, v) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
}

const WORD_GROUPS: Record<string, string[]> = {
  royalty: ["king", "queen", "prince", "princess", "lord"],
  people: ["man", "woman", "boy", "girl", "child"],
  "countries/cities": ["france", "paris", "germany", "berlin", "italy"],
  animals: ["dog", "cat", "puppy", "wolf", "horse"],
  food: ["apple", "banana", "coffee", "pizza", "bread"],
  technology: ["computer", "algorithm", "data", "model", "network"],
};

const GROUP_COLORS: Record<string, string> = {
  royalty: "#6366f1",
  people: "#10b981",
  "countries/cities": "#f59e0b",
  animals: "#ef4444",
  food: "#8b5cf6",
  technology: "#0ea5e9",
};

function getGroup(word: string): string {
  for (const [group, words] of Object.entries(WORD_GROUPS)) {
    if (words.includes(word)) return group;
  }
  return "other";
}

const SVG_W = 500;
const SVG_H = 320;
const PAD = 30;

function toSVG(x: number, y: number): [number, number] {
  const nx = ((x + 1) / 2) * (SVG_W - PAD * 2) + PAD;
  const ny = (1 - (y + 1) / 2) * (SVG_H - PAD * 2) + PAD;
  return [nx, ny];
}

export default function Word2VecVisualizer() {
  const [query, setQuery] = useState("king");
  const [activeWord, setActiveWord] = useState<string | null>("king");

  const inputWord = query.trim().toLowerCase();
  const isKnown = inputWord in EMBEDDINGS;
  const neighbors = useMemo(() => isKnown ? nearestNeighbors(inputWord) : [], [inputWord, isKnown]);
  const neighborSet = new Set(neighbors.map((n) => n.word));

  const handleSearch = () => {
    if (isKnown) setActiveWord(inputWord);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Word2Vec Visualizer — 2D Projection
        </span>
      </div>

      <div className="p-5 border-b border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter a word…"
            list="word-list"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <datalist id="word-list">
            {Object.keys(EMBEDDINGS).map((w) => <option key={w} value={w} />)}
          </datalist>
          <button
            onClick={handleSearch}
            disabled={!isKnown}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Find Neighbors
          </button>
        </div>
        {query && !isKnown && (
          <p className="mt-2 text-xs text-amber-600">
            "{query}" not in this vocabulary. Try: king, paris, computer, dog, apple…
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* 2D scatter */}
        <div className="p-4">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto select-none">
            {Object.entries(EMBEDDINGS).map(([word, [x, y]]) => {
              const [sx, sy] = toSVG(x, y);
              const group = getGroup(word);
              const color = GROUP_COLORS[group] || "#94a3b8";
              const isActive = word === activeWord;
              const isNeighbor = neighborSet.has(word);
              const isHidden = activeWord && !isActive && !isNeighbor;
              return (
                <g key={word} onClick={() => { setActiveWord(word); setQuery(word); }} className="cursor-pointer">
                  <circle
                    cx={sx} cy={sy}
                    r={isActive ? 8 : isNeighbor ? 5 : 4}
                    fill={color}
                    opacity={isHidden ? 0.15 : isActive ? 1 : isNeighbor ? 0.9 : 0.5}
                    stroke={isActive ? "white" : "none"}
                    strokeWidth={isActive ? 2 : 0}
                  />
                  {(isActive || isNeighbor || !activeWord) && (
                    <text
                      x={sx + 6} y={sy + 4}
                      fontSize={isActive ? 11 : 9}
                      fontWeight={isActive ? 700 : 400}
                      fill={isActive ? color : "#64748b"}
                      opacity={isHidden ? 0.15 : 1}
                    >
                      {word}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(GROUP_COLORS).map(([group, color]) => (
              <span key={group} className="flex items-center gap-1 text-xs text-slate-500">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
                {group}
              </span>
            ))}
          </div>
        </div>

        {/* Neighbors list */}
        <div className="p-5">
          {activeWord && EMBEDDINGS[activeWord] ? (
            <>
              <p className="text-xs font-medium text-slate-600 mb-3">
                Nearest neighbors to{" "}
                <span className="font-mono font-bold text-indigo-600">{activeWord}</span>
              </p>
              <div className="space-y-2">
                {neighbors.map(({ word, similarity }, i) => (
                  <div
                    key={word}
                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -mx-2"
                    onClick={() => { setActiveWord(word); setQuery(word); }}
                  >
                    <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                    <span className="text-xs font-mono text-slate-700 w-24">{word}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-400 transition-all"
                        style={{ width: `${similarity * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-indigo-500 w-12 text-right">
                      {similarity.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4 italic">
                Similarity = cosine similarity in 2D projection. Click any word to explore its neighbors.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <p className="text-sm text-slate-400">Search a word to see its nearest neighbors in the embedding space.</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {["king", "paris", "computer", "dog", "apple"].map((w) => (
                  <button
                    key={w}
                    onClick={() => { setQuery(w); setActiveWord(w); }}
                    className="px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
