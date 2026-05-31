import type { Section } from "@brinnaebent/workbook";

const apis: Section = {
  id: "apis",
  number: 4,
  title: "APIs",
  blocks: [
    {
      type: "text",
      html: `<p><strong>APIs</strong> (Application Programming Interfaces) let you retrieve data from a provider programmatically. The list of domains where APIs give you access to interesting data is essentially endless:</p>
<ul>
<li><strong>Weather</strong> — OpenWeatherMap</li>
<li><strong>Finance</strong> — Alpha Vantage, Yahoo Finance</li>
<li><strong>Social media</strong> — Twitter/X, Facebook, Instagram, Strava</li>
<li><strong>Science</strong> — NASA's Open Data Portal (satellite imagery, astronomy)</li>
<li><strong>Health</strong> — CDC</li>
<li><strong>Commerce</strong> — Amazon, eBay</li>
<li><strong>Sports</strong> — ESPN, Sportradar</li>
<li><strong>Government</strong> — census, crime statistics, transportation</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Advantages",
      html: `<ul>
<li><strong>Structured data.</strong> APIs return data in a standardized, machine-readable format — no scraping HTML, no parsing PDFs.</li>
<li><strong>Programmatic retrieval.</strong> Pull data automatically on whatever schedule you need.</li>
<li><strong>Reliability and freshness.</strong> Reputable APIs are often reliable and up to date.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Limitations",
      html: `<ul>
<li><strong>Usage limits and paywalls.</strong> Most APIs throttle free use and charge for premium tiers. Plan your queries carefully!</li>
<li><strong>Access limits.</strong> APIs only expose what the provider chose to expose. The data you want might simply not be available.</li>
<li><strong>Technical complexity.</strong> Every API has its own authentication scheme, its own quirks, and its own documentation quality. There is no shortcut — read the docs.</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "ApiRequestExplorer",
      caption: "API request builder showing authentication, endpoint construction, and response parsing.",
      props: {},
    },
    {
      type: "callout",
      variant: "example",
      title: "Most Data Products Are API Pipelines",
      html: `<p>A flight-comparison site calls airline APIs. A weather app calls a weather API. A trading platform calls market data APIs. A logistics dashboard calls shipping APIs. As a data scientist, you will likely spend time architecting and/or writing code that talks to someone else's API and processing what comes back.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-sourcing-apis-q1",
      kind: "mc",
      question: "You're building a dataset of historical stock prices using a financial API. You notice the API returns data in JSON with fields you don't recognize. What should you do first?",
      options: [
        {
          label: "Read the API's documentation to understand what each field means",
          correct: true,
          explanation: "Correct. Every API has its own data model, field names, and conventions. A field named 'adj_close' might mean adjusted close price — critical for backtesting — while 'close' means unadjusted. Using the wrong one without knowing the difference is a modeling error that won't surface until much later.",
        },
        {
          label: "Infer the field meanings from their values by inspecting a sample of rows",
          correct: false,
          explanation: "Dangerous. Many financial fields look similar numerically but mean very different things (adjusted vs. unadjusted prices, bid vs. ask, trading volume vs. dollar volume). Guessing from values can produce subtly wrong data that's hard to detect.",
        },
        {
          label: "Drop unfamiliar fields and only use the ones you recognize",
          correct: false,
          explanation: "You might be dropping something important. 'adj_close' is unfamiliar to many beginners but is the correct price to use for most analysis. Always understand what you're discarding before discarding it.",
        },
      ],
    },
  ],
};

export default apis;
