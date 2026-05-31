"use client";

import { useState, useMemo } from "react";

type AuthMethod = "none" | "apikey_header" | "apikey_query" | "bearer";
type ApiExample = "openweather" | "nasa" | "alphavantage" | "census";

interface ApiConfig {
  label: string;
  base: string;
  path: string;
  authMethod: AuthMethod;
  authParamName: string;
  defaultKey: string;
  params: { key: string; label: string; value: string }[];
  sampleResponse: object;
  description: string;
}

const APIS: Record<ApiExample, ApiConfig> = {
  openweather: {
    label: "OpenWeatherMap",
    base: "https://api.openweathermap.org",
    path: "/data/2.5/weather",
    authMethod: "apikey_query",
    authParamName: "appid",
    defaultKey: "YOUR_API_KEY",
    params: [
      { key: "q", label: "City", value: "Durham,NC,US" },
      { key: "units", label: "Units", value: "imperial" },
    ],
    sampleResponse: {
      name: "Durham",
      main: { temp: 74.3, feels_like: 75.1, humidity: 62 },
      weather: [{ main: "Clear", description: "clear sky" }],
      wind: { speed: 5.2, deg: 220 },
      dt: 1717171200,
    },
    description: "Current weather by city name. Free tier: 1,000 calls/day.",
  },
  nasa: {
    label: "NASA APOD",
    base: "https://api.nasa.gov",
    path: "/planetary/apod",
    authMethod: "apikey_query",
    authParamName: "api_key",
    defaultKey: "DEMO_KEY",
    params: [{ key: "date", label: "Date", value: "2024-06-01" }],
    sampleResponse: {
      title: "Milky Way Over Norwegian Mountains",
      date: "2024-06-01",
      media_type: "image",
      explanation: "What's happening in the sky? The Milky Way…",
      url: "https://apod.nasa.gov/apod/image/…",
      copyright: "Bjørn Jørgensen",
    },
    description: "Astronomy Picture of the Day. Free with a key; DEMO_KEY has stricter rate limits.",
  },
  alphavantage: {
    label: "Alpha Vantage",
    base: "https://www.alphavantage.co",
    path: "/query",
    authMethod: "apikey_query",
    authParamName: "apikey",
    defaultKey: "YOUR_API_KEY",
    params: [
      { key: "function", label: "Function", value: "TIME_SERIES_DAILY" },
      { key: "symbol", label: "Symbol", value: "AAPL" },
      { key: "outputsize", label: "Output Size", value: "compact" },
    ],
    sampleResponse: {
      "Meta Data": {
        "1. Information": "Daily Prices",
        "2. Symbol": "AAPL",
        "3. Last Refreshed": "2024-06-03",
      },
      "Time Series (Daily)": {
        "2024-06-03": {
          "1. open": "192.90",
          "2. high": "194.99",
          "3. low": "192.53",
          "4. close": "194.35",
          "5. volume": "53471300",
        },
      },
    },
    description: "Stock price data. Free tier: 25 requests/day.",
  },
  census: {
    label: "US Census",
    base: "https://api.census.gov",
    path: "/data/2022/acs/acs5",
    authMethod: "apikey_query",
    authParamName: "key",
    defaultKey: "YOUR_API_KEY",
    params: [
      { key: "get", label: "Variables", value: "NAME,B19013_001E" },
      { key: "for", label: "Geography", value: "county:*" },
      { key: "in", label: "State", value: "state:37" },
    ],
    sampleResponse: [
      ["NAME", "B19013_001E", "state", "county"],
      ["Durham County, NC", "65420", "37", "063"],
      ["Wake County, NC", "84110", "37", "183"],
      ["Mecklenburg County, NC", "71890", "37", "119"],
    ],
    description: "American Community Survey 5-year estimates. Free with a key.",
  },
};

const AUTH_LABELS: Record<AuthMethod, string> = {
  none: "No auth",
  apikey_query: "API key (query param)",
  apikey_header: "API key (header)",
  bearer: "Bearer token",
};

function buildUrl(config: ApiConfig, apiKey: string, params: Record<string, string>): string {
  const queryParams: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v) queryParams.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  if (config.authMethod === "apikey_query") {
    queryParams.push(`${config.authParamName}=${apiKey || config.defaultKey}`);
  }
  const qs = queryParams.length ? `?${queryParams.join("&")}` : "";
  return `${config.base}${config.path}${qs}`;
}

function buildHeaders(config: ApiConfig, apiKey: string): Record<string, string> {
  if (config.authMethod === "apikey_header") {
    return { [config.authParamName]: apiKey || config.defaultKey };
  }
  if (config.authMethod === "bearer") {
    return { Authorization: `Bearer ${apiKey || config.defaultKey}` };
  }
  return {};
}

function syntaxHighlight(json: string): string {
  return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?)/g, (match) =>
      match.endsWith(":") ? `<span class="text-violet-700">${match}</span>` : `<span class="text-emerald-700">${match}</span>`
    )
    .replace(/\b(-?\d+\.?\d*)\b/g, `<span class="text-blue-700">$1</span>`)
    .replace(/\b(true|false|null)\b/g, `<span class="text-amber-600">$1</span>`);
}

type Tab = "request" | "response";

export default function ApiRequestExplorer() {
  const [selectedApi, setSelectedApi] = useState<ApiExample>("openweather");
  const [apiKey, setApiKey] = useState("");
  const [params, setParams] = useState<Record<string, Record<string, string>>>({});
  const [activeTab, setActiveTab] = useState<Tab>("request");

  const config = APIS[selectedApi];

  const currentParams = useMemo(() => {
    const base: Record<string, string> = {};
    for (const p of config.params) base[p.key] = p.value;
    return { ...base, ...(params[selectedApi] ?? {}) };
  }, [selectedApi, config, params]);

  function setParam(key: string, value: string) {
    setParams((prev) => ({
      ...prev,
      [selectedApi]: { ...(prev[selectedApi] ?? {}), [key]: value },
    }));
  }

  const url = buildUrl(config, apiKey, currentParams);
  const headers = buildHeaders(config, apiKey);
  const hasHeaders = Object.keys(headers).length > 0;

  const responseJson = JSON.stringify(config.sampleResponse, null, 2);
  const highlighted = syntaxHighlight(
    responseJson.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  );

  const pythonSnippet = useMemo(() => {
    const lines: string[] = ["import requests", ""];
    if (hasHeaders) {
      lines.push(`headers = {`);
      for (const [k, v] of Object.entries(headers)) {
        lines.push(`    "${k}": "${v}",`);
      }
      lines.push(`}`);
      lines.push(`response = requests.get(`);
      lines.push(`    "${config.base}${config.path}",`);
      lines.push(`    headers=headers,`);
      lines.push(`    params=${JSON.stringify(currentParams, null, 4).split("\n").join("\n    ")},`);
      lines.push(`)`);
    } else {
      lines.push(`params = ${JSON.stringify(currentParams, null, 4)}`);
      lines.push(`response = requests.get("${config.base}${config.path}", params=params)`);
    }
    lines.push(`data = response.json()`);
    return lines.join("\n");
  }, [config, currentParams, headers, hasHeaders]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          API Request Explorer
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* API selector */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">API</label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(APIS) as [ApiExample, ApiConfig][]).map(([id, cfg]) => (
              <button
                key={id}
                onClick={() => setSelectedApi(id)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
                  selectedApi === id
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">{config.description}</p>
        </div>

        {/* Auth */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs font-medium text-slate-600">Authentication</label>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500">
              {AUTH_LABELS[config.authMethod]}
            </span>
          </div>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={config.defaultKey}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-slate-300"
          />
          {config.authMethod === "apikey_query" && (
            <p className="mt-1.5 text-xs text-slate-400">
              Key is appended as <span className="font-mono text-slate-500">?{config.authParamName}=…</span>
            </p>
          )}
          {config.authMethod === "bearer" && (
            <p className="mt-1.5 text-xs text-slate-400">
              Sent as <span className="font-mono text-slate-500">Authorization: Bearer …</span> header
            </p>
          )}
        </div>

        {/* Query params */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">Query Parameters</label>
          <div className="space-y-2">
            {config.params.map((p) => (
              <div key={p.key} className="flex items-center gap-2">
                <span className="w-36 shrink-0 text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-1.5">
                  {p.key}
                </span>
                <input
                  type="text"
                  value={currentParams[p.key] ?? p.value}
                  onChange={(e) => setParam(p.key, e.target.value)}
                  className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <span className="text-xs text-slate-400 w-28 shrink-0">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-slate-100">
        <div className="flex border-b border-slate-100">
          {(["request", "response"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-semibold capitalize transition-colors cursor-pointer border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-700"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "request" ? "Request" : "Sample Response"}
            </button>
          ))}
        </div>

        {activeTab === "request" && (
          <div className="p-5 space-y-4">
            {/* URL */}
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1.5">Constructed URL</div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-mono text-slate-700 break-all leading-relaxed">
                <span className="text-emerald-600 font-semibold">GET</span>{" "}
                <span className="text-indigo-700">{config.base}</span>
                <span className="text-slate-700">{config.path}</span>
                {(() => {
                  const parts: string[] = [];
                  for (const [k, v] of Object.entries(currentParams)) {
                    if (v) parts.push(`${k}=${encodeURIComponent(v)}`);
                  }
                  if (config.authMethod === "apikey_query") {
                    parts.push(`${config.authParamName}=`);
                  }
                  if (!parts.length) return null;
                  return (
                    <>
                      <span className="text-slate-400">?</span>
                      {parts.map((p, i) => {
                        const isAuth = p.startsWith(`${config.authParamName}=`);
                        return (
                          <span key={i}>
                            {i > 0 && <span className="text-slate-400">&amp;</span>}
                            {isAuth ? (
                              <span className="text-amber-600">{p}<span className="text-amber-400 italic">YOUR_KEY</span></span>
                            ) : (
                              <span className="text-slate-700">{p}</span>
                            )}
                          </span>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Headers */}
            {hasHeaders && (
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1.5">Headers</div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 divide-y divide-slate-100">
                  {Object.entries(headers).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3 px-3 py-2 text-xs font-mono">
                      <span className="text-violet-700 w-36 shrink-0">{k}</span>
                      <span className="text-slate-500">{v || <span className="italic text-amber-500">YOUR_KEY</span>}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Python snippet */}
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1.5">Python</div>
              <pre className="rounded-lg bg-slate-900 px-4 py-3 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                {pythonSnippet}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "response" && (
          <div className="p-5">
            <div className="text-xs text-slate-400 mb-2 leading-relaxed">
              Sample response from <span className="font-semibold text-slate-600">{config.label}</span>. Real responses vary with your parameters.
            </div>
            <pre
              className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-mono overflow-x-auto leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-300" />
          Auth key
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-400 border border-indigo-300" />
          Base URL
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-300" />
          Query params
        </span>
        <span className="ml-auto text-slate-400 font-mono">{url.length} chars</span>
      </div>
    </div>
  );
}
