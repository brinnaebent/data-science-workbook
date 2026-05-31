"use client";

import { useState } from "react";

type TokenMode = "word" | "subword" | "char";

const COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-violet-100 text-violet-800 border-violet-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-rose-100 text-rose-800 border-rose-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-pink-100 text-pink-800 border-pink-200",
];

// Simple BPE-like subword tokenizer approximation
const COMMON_SUFFIXES = ["ing", "tion", "ness", "ment", "ful", "less", "able", "ible", "al", "ous", "ive", "er", "est", "ed", "ly", "ist", "ize", "ise"];
const COMMON_PREFIXES = ["un", "re", "pre", "dis", "mis", "non", "over", "under", "out", "sub", "super", "inter", "trans", "anti"];

function wordTokenize(text: string): string[] {
  return text
    .replace(/([.,!?;:'"()[\]{}])/g, " $1 ")
    .split(/\s+/)
    .filter(Boolean);
}

function subwordTokenize(text: string): string[] {
  const words = wordTokenize(text);
  const tokens: string[] = [];
  for (const word of words) {
    const lower = word.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!lower) { tokens.push(word); continue; }

    let remaining = lower;
    const wordTokens: string[] = [];
    let found = false;

    for (const suffix of COMMON_SUFFIXES) {
      if (remaining.length > suffix.length + 2 && remaining.endsWith(suffix)) {
        const stem = remaining.slice(0, remaining.length - suffix.length);
        // Check if a prefix also applies
        for (const prefix of COMMON_PREFIXES) {
          if (stem.startsWith(prefix) && stem.length > prefix.length + 2) {
            wordTokens.push(prefix + "##");
            wordTokens.push("##" + stem.slice(prefix.length) + "##");
            wordTokens.push("##" + suffix);
            found = true;
            break;
          }
        }
        if (!found) {
          wordTokens.push(stem);
          wordTokens.push("##" + suffix);
          found = true;
        }
        break;
      }
    }

    if (!found) {
      for (const prefix of COMMON_PREFIXES) {
        if (remaining.startsWith(prefix) && remaining.length > prefix.length + 2) {
          wordTokens.push(prefix);
          wordTokens.push("##" + remaining.slice(prefix.length));
          found = true;
          break;
        }
      }
    }

    if (!found) {
      // Split long words at syllable-like boundaries (vowel clusters)
      if (lower.length > 7) {
        const mid = Math.floor(lower.length / 2);
        wordTokens.push(lower.slice(0, mid));
        wordTokens.push("##" + lower.slice(mid));
      } else {
        wordTokens.push(word);
      }
    } else {
      // Restore casing for the first token
      if (word[0] === word[0].toUpperCase() && wordTokens.length > 0) {
        wordTokens[0] = wordTokens[0].charAt(0).toUpperCase() + wordTokens[0].slice(1);
      }
    }

    tokens.push(...wordTokens);
  }
  return tokens;
}

function charTokenize(text: string): string[] {
  return text.split("").filter((c) => c !== " " || true);
}

const MODES: { id: TokenMode; label: string; description: string }[] = [
  { id: "word", label: "Word-level", description: "Split on whitespace and punctuation. Simple and fast — but out-of-vocabulary words get a single <UNK> token." },
  { id: "subword", label: "Subword (BPE-like)", description: "Split words into meaningful sub-pieces. Handles new words gracefully: 'tokenization' → ['token', '##ization']. Used by BERT, GPT, and most modern models." },
  { id: "char", label: "Character-level", description: "Every character is its own token. No unknown tokens ever, but sequences are very long and the model must learn to combine characters into meaning." },
];

function colorForToken(token: string, index: number): string {
  return COLORS[index % COLORS.length];
}

export default function TokenizerPlayground() {
  const [text, setText] = useState("Deep learning is transforming natural language processing.");

  const wordTokens = wordTokenize(text);
  const subwordTokens = subwordTokenize(text);
  const charTokens = charTokenize(text);

  const tokensByMode: Record<TokenMode, string[]> = {
    word: wordTokens,
    subword: subwordTokens,
    char: charTokens,
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tokenizer Playground
        </span>
      </div>

      <div className="p-5">
        <label className="block text-xs font-medium text-slate-600 mb-2">Input sentence</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          placeholder="Type a sentence…"
        />
      </div>

      <div className="divide-y divide-slate-100">
        {MODES.map(({ id, label, description }) => {
          const tokens = tokensByMode[id];
          return (
            <div key={id} className="p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <span className="text-xs text-slate-400 font-mono">{tokens.length} tokens</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{description}</p>
              <div className="flex flex-wrap gap-1.5">
                {tokens.map((token, i) => (
                  <span
                    key={i}
                    className={`inline-block px-2 py-0.5 rounded border text-xs font-mono ${colorForToken(token, i)}`}
                  >
                    {id === "char" && token === " " ? "·" : token}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          {MODES.map(({ id, label }) => (
            <div key={id}>
              <div className="text-lg font-bold text-slate-700">{tokensByMode[id].length}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
