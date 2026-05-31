"use client";

import { useState } from "react";

// Porter stemmer rules (simplified but accurate for most common cases)
function porterStem(word: string): string {
  if (word.length <= 2) return word;
  let w = word.toLowerCase();

  // Step 1a
  if (w.endsWith("sses")) w = w.slice(0, -2);
  else if (w.endsWith("ies")) w = w.slice(0, -2);
  else if (w.endsWith("ss")) { /* no change */ }
  else if (w.endsWith("s")) w = w.slice(0, -1);

  // Step 1b
  const hasCVC = (s: string) => {
    const vowels = /[aeiou]/;
    let v = false;
    for (const c of s) {
      if (vowels.test(c)) { v = true; break; }
    }
    return v;
  };

  if (w.endsWith("eed")) {
    if (w.length > 4) w = w.slice(0, -1);
  } else if (w.endsWith("ed") && hasCVC(w.slice(0, -2))) {
    w = w.slice(0, -2);
    if (w.endsWith("at") || w.endsWith("bl") || w.endsWith("iz")) w += "e";
    else if (/([^aeiou])\1$/.test(w) && !w.endsWith("l") && !w.endsWith("s") && !w.endsWith("z")) w = w.slice(0, -1);
  } else if (w.endsWith("ing") && hasCVC(w.slice(0, -3))) {
    w = w.slice(0, -3);
    if (w.endsWith("at") || w.endsWith("bl") || w.endsWith("iz")) w += "e";
    else if (/([^aeiou])\1$/.test(w) && !w.endsWith("l") && !w.endsWith("s") && !w.endsWith("z")) w = w.slice(0, -1);
  }

  // Step 1c
  if (w.endsWith("y") && hasCVC(w.slice(0, -1))) w = w.slice(0, -1) + "i";

  // Step 2 (common suffixes)
  const step2: [string, string][] = [
    ["ational", "ate"], ["tional", "tion"], ["enci", "ence"], ["anci", "ance"],
    ["izer", "ize"], ["iser", "ise"], ["abli", "able"], ["alli", "al"],
    ["entli", "ent"], ["eli", "e"], ["ousli", "ous"], ["ization", "ize"],
    ["isation", "ise"], ["ation", "ate"], ["ator", "ate"], ["alism", "al"],
    ["iveness", "ive"], ["fulness", "ful"], ["ousness", "ous"], ["aliti", "al"],
    ["iviti", "ive"], ["biliti", "ble"],
  ];
  for (const [suf, rep] of step2) {
    if (w.endsWith(suf) && w.length > suf.length + 1) {
      w = w.slice(0, -suf.length) + rep;
      break;
    }
  }

  // Step 3
  const step3: [string, string][] = [
    ["icate", "ic"], ["ative", ""], ["alize", "al"], ["alise", "al"],
    ["iciti", "ic"], ["ical", "ic"], ["ful", ""], ["ness", ""],
  ];
  for (const [suf, rep] of step3) {
    if (w.endsWith(suf) && w.length > suf.length + 1) {
      w = w.slice(0, -suf.length) + rep;
      break;
    }
  }

  return w;
}

// WordNet-style lemmatizer (lookup table for common irregular forms + rules)
const LEMMA_MAP: Record<string, string> = {
  // Irregular verbs
  am: "be", is: "be", are: "be", was: "be", were: "be", been: "be", being: "be",
  have: "have", has: "have", had: "have", having: "have",
  do: "do", does: "do", did: "do", done: "do", doing: "do",
  go: "go", goes: "go", went: "go", gone: "go", going: "go",
  ran: "run", runs: "run", running: "run",
  saw: "see", seen: "see", sees: "see", seeing: "see",
  took: "take", takes: "take", taken: "take", taking: "take",
  came: "come", comes: "come", coming: "come",
  knew: "know", knows: "know", known: "know", knowing: "know",
  got: "get", gets: "get", gotten: "get", getting: "get",
  said: "say", says: "say", saying: "say",
  made: "make", makes: "make", making: "make",
  // Irregular nouns
  children: "child", men: "man", women: "woman", feet: "foot", teeth: "tooth",
  mice: "mouse", geese: "goose", oxen: "ox", data: "datum", criteria: "criterion",
  // Adjectives
  better: "good", best: "good", worse: "bad", worst: "bad",
  more: "more", most: "most",
};

function lemmatize(word: string): string {
  const lower = word.toLowerCase();
  if (LEMMA_MAP[lower]) return LEMMA_MAP[lower];

  // Regular rules
  if (lower.endsWith("ies") && lower.length > 4) return lower.slice(0, -3) + "y";
  if (lower.endsWith("ves") && lower.length > 4) return lower.slice(0, -3) + "f";
  if (lower.endsWith("ses") || lower.endsWith("xes") || lower.endsWith("zes") || lower.endsWith("ches") || lower.endsWith("shes")) {
    return lower.slice(0, -2);
  }
  if (lower.endsWith("s") && lower.length > 3 && !lower.endsWith("ss")) return lower.slice(0, -1);
  if (lower.endsWith("ing") && lower.length > 5) {
    const base = lower.slice(0, -3);
    if (/[^aeiou]$/.test(base) && base.length > 2) {
      const lastChar = base[base.length - 1];
      if (/[^aeiou]/.test(base[base.length - 2]) === false) return base + "e";
    }
    return base;
  }
  if (lower.endsWith("ed") && lower.length > 4) {
    const base = lower.slice(0, -2);
    if (/[^aeiou][^aeiou]$/.test(base)) return base.slice(0, -1);
    if (base.endsWith("e")) return base;
    return base;
  }
  return lower;
}

function tokenize(text: string): string[] {
  return text.match(/[a-zA-Z'-]+/g) || [];
}

const EXAMPLES = [
  "running quickly",
  "He studied and studying",
  "The trees are beautiful",
  "Changes were made quickly",
  "She goes faster",
];

export default function StemmingLemmatizationDemo() {
  const [text, setText] = useState("The dogs were running and jumping quickly.");

  const tokens = tokenize(text);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Stemming vs. Lemmatization
        </span>
      </div>

      <div className="p-5">
        <label className="block text-xs font-medium text-slate-600 mb-2">Input text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setText(ex)}
              className="px-2 py-0.5 rounded text-xs border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {tokens.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-100">
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Original</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                  Porter Stem
                </th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                  WordNet Lemma
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tokens.map((token, i) => {
                const stem = porterStem(token);
                const lemma = lemmatize(token);
                const stemChanged = stem !== token.toLowerCase();
                const lemmaChanged = lemma !== token.toLowerCase();
                return (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="px-5 py-2 font-mono text-slate-700">{token}</td>
                    <td className="px-5 py-2 font-mono">
                      <span className={stemChanged ? "text-indigo-600 font-semibold" : "text-slate-400"}>
                        {stem}
                      </span>
                      {stemChanged && (
                        <span className="ml-2 text-xs text-indigo-300 font-sans font-normal">
                          -{token.toLowerCase().slice(stem.length) || "…"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-2 font-mono">
                      <span className={lemmaChanged ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                        {lemma}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mx-5 my-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3">
          <p className="text-xs font-semibold text-indigo-700 mb-1">Porter Stemmer</p>
          <p className="text-xs text-indigo-600 leading-relaxed">Mechanically chops suffixes. Fast, language-agnostic. Output may not be a real word — <code className="text-xs bg-indigo-100 px-1 rounded">chang</code> for <em>changing</em>. Fine for keyword matching.</p>
        </div>
        <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3">
          <p className="text-xs font-semibold text-emerald-700 mb-1">WordNet Lemmatizer</p>
          <p className="text-xs text-emerald-600 leading-relaxed">Uses a dictionary to return canonical root words. Always a real word. <code className="text-xs bg-emerald-100 px-1 rounded">be</code> for <em>was, is, are</em>. Better for interpretability.</p>
        </div>
      </div>
    </div>
  );
}
