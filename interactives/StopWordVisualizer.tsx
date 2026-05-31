"use client";

const NLTK_STOP_WORDS = new Set([
  "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
  "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she",
  "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
  "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
  "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
  "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
  "at", "by", "for", "with", "about", "against", "between", "into", "through",
  "during", "before", "after", "above", "below", "to", "from", "up", "down",
  "in", "out", "on", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not",
  "only", "own", "same", "so", "than", "too", "very", "s", "t", "can",
  "will", "just", "don", "should", "now", "d", "ll", "m", "o", "re", "ve",
  "y", "ain", "aren", "couldn", "didn", "doesn", "hadn", "hasn", "haven",
  "isn", "ma", "mightn", "mustn", "needn", "shan", "shouldn", "wasn",
  "weren", "won", "wouldn",
]);

const ORIGINAL_TOKENS = [
  "Which", "class", "is", "the", "best", "class", "at", "Duke",
  "?", "AIPI", "510", ".",
];

function isStopWord(token: string): boolean {
  if (token === "?" || token === ".") return true;
  return NLTK_STOP_WORDS.has(token.toLowerCase());
}

export default function StopWordVisualizer() {
  const kept = ORIGINAL_TOKENS.filter((t) => !isStopWord(t));

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Stop Word Removal
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* Before */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Before</span>
            <span className="text-xs text-slate-400 font-mono">{ORIGINAL_TOKENS.length} tokens</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ORIGINAL_TOKENS.map((token, i) => {
              const stop = isStopWord(token);
              return (
                <div key={i} className="relative flex flex-col items-center gap-1">
                  <span
                    className={`inline-block px-2.5 py-1 rounded border text-sm font-mono transition-all ${
                      stop
                        ? "bg-red-50 text-red-400 border-red-200 line-through decoration-red-400"
                        : "bg-indigo-50 text-indigo-800 border-indigo-200"
                    }`}
                  >
                    {token}
                  </span>
                  {stop && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-red-400">
                      stop
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            filtered
          </div>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* After */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">After</span>
            <span className="text-xs text-slate-400 font-mono">{kept.length} tokens</span>
            <span className="ml-auto text-xs text-emerald-600 font-medium">
              {ORIGINAL_TOKENS.length - kept.length} removed
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {kept.map((token, i) => (
              <span
                key={i}
                className="inline-block px-2.5 py-1 rounded border text-sm font-mono bg-indigo-50 text-indigo-800 border-indigo-200"
              >
                {token}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-indigo-100 border border-indigo-200" />
          Kept
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-red-50 border border-red-200" />
          Stop word (removed)
        </span>
      </div>
    </div>
  );
}
