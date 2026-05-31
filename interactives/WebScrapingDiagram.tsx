"use client";

import { useState } from "react";

type Stage = "request" | "parse" | "extract" | "store";

const STAGES: { id: Stage; label: string; tool: string; description: string; color: string; badge: string }[] = [
  {
    id: "request",
    label: "HTTP Request",
    tool: "requests",
    description: "Your script sends an HTTP GET to the target URL. The server returns raw HTML (or JSON for an API). If the page is JavaScript-rendered, you need Selenium to drive a real browser first.",
    color: "bg-blue-50 text-blue-800 border-blue-200",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "parse",
    label: "HTML Parsing",
    tool: "BeautifulSoup",
    description: "The raw HTML string is parsed into a tree you can navigate. BeautifulSoup builds a DOM-like structure so you can query by tag, class, or CSS selector — without regex hacks.",
    color: "bg-violet-50 text-violet-800 border-violet-200",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },
  {
    id: "extract",
    label: "Data Extraction",
    tool: ".find() / .select()",
    description: "You walk the parsed tree to pull out the specific fields you want — text, links, prices, dates. This is where selector knowledge matters: CSS selectors and XPath let you target exactly the right nodes.",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: "store",
    label: "Storage",
    tool: "CSV / DB / JSON",
    description: "Extracted records are written to a destination — a CSV for small jobs, a database for anything ongoing. Real pipelines also add deduplication, error logging, and retry logic here.",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
];

const CODE_SNIPPETS: Record<Stage, string> = {
  request: `import requests

url = "https://example.com/data"
response = requests.get(url, headers={
    "User-Agent": "Mozilla/5.0"
})
html = response.text`,
  parse: `from bs4 import BeautifulSoup

soup = BeautifulSoup(html, "html.parser")

# Now you can navigate the tree
title = soup.find("h1").text`,
  extract: `# By CSS selector
rows = soup.select("table.results tr")

# Pull specific fields
records = []
for row in rows:
    cols = row.find_all("td")
    if cols:
        records.append({
            "name": cols[0].text.strip(),
            "value": cols[1].text.strip(),
        })`,
  store: `import csv

with open("output.csv", "w", newline="") as f:
    writer = csv.DictWriter(
        f, fieldnames=["name", "value"]
    )
    writer.writeheader()
    writer.writerows(records)

print(f"Saved {len(records)} records.")`,
};

export default function WebScrapingDiagram() {
  const [active, setActive] = useState<Stage>("request");

  const activeStage = STAGES.find((s) => s.id === active)!;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Scraping Pipeline
        </span>
      </div>

      {/* Pipeline steps */}
      <div className="p-5">
        <div className="flex items-center gap-0">
          {STAGES.map((stage, i) => (
            <div key={stage.id} className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => setActive(stage.id)}
                className={`flex-1 min-w-0 flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg border transition-all text-center cursor-pointer ${
                  active === stage.id
                    ? stage.color + " shadow-sm ring-1 ring-inset ring-current/10"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span className="text-xs font-semibold leading-tight">{stage.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    active === stage.id ? stage.badge : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}
                >
                  {stage.tool}
                </span>
              </button>
              {i < STAGES.length - 1 && (
                <div className="flex-shrink-0 flex items-center px-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="border-t border-slate-100 divide-y divide-slate-100">
        <div className="px-5 py-4">
          <p className="text-sm text-slate-600 leading-relaxed">{activeStage.description}</p>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Code
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${activeStage.badge}`}>
              {activeStage.tool}
            </span>
          </div>
          <pre className="bg-slate-900 rounded-lg px-4 py-3 overflow-x-auto text-xs font-mono text-slate-100 leading-relaxed">
            {CODE_SNIPPETS[active]}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-400 flex-wrap">
        {STAGES.map((stage, i) => (
          <span key={stage.id} className="flex items-center gap-1">
            <span className={`font-medium ${active === stage.id ? "text-slate-700" : ""}`}>{stage.label}</span>
            {i < STAGES.length - 1 && <span>→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
