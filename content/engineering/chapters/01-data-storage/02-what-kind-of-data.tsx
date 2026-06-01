import type { Section } from "@brinnaebent/workbook";

const whatKindOfData: Section = {
  id: "what-kind-of-data",
  number: 2,
  title: "What Kind of Data Are We Even Talking About?",
  blocks: [
    {
      type: "text",
      html: `<p>Before you can choose where to store something, you need to know what it <em>is</em>. Data comes in three structural forms, and each one has a different relationship with the databases designed to hold it.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Three Data Types",
      html: `<ul>
<li><strong>Structured</strong> — rows and columns. Spreadsheets, CSVs, database tables. Schema-enforced, easy to query, easy to aggregate. This is what most people picture when they hear "data."</li>
<li><strong>Semi-structured</strong> — has some shape, but not a rigid schema. JSON, XML, log files with predictable keys. Flexible enough to accommodate variation, structured enough to parse programmatically.</li>
<li><strong>Unstructured</strong> — text, audio, video, images, social posts. No predefined schema, no obvious column headers. This is now the <em>majority</em> of data generated in the world, and increasingly the richest signal for ML models.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>Knowing the type gets you halfway there. The other half is the <strong>four V's</strong> — a framework for sizing up any storage problem.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The Four V's",
      html: `<ul>
<li><strong>Volume</strong> — How much data? A few gigabytes fits on a laptop. A few petabytes requires a distributed system. The gap between those two scenarios is most of what drives database architecture decisions.</li>
<li><strong>Velocity</strong> — How fast is it arriving? A monthly data export is trivially handled with batch processes. A real-time event stream from a million devices is an entirely different engineering problem.</li>
<li><strong>Variety</strong> — One type, or many? A single schema of structured records is the easy case. A system ingesting clickstreams, images, user text, and transaction records simultaneously requires a more thoughtful architecture.</li>
<li><strong>Veracity</strong> — How trustworthy is it? Data from controlled sensors is high-veracity. Data scraped from the open web is not. Low veracity upstream means more validation and cleaning work, which affects pipeline design all the way to the model.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>Think of the four V's as an intake form. Answer them for any storage problem and the right tool usually surfaces. Skip them and you'll spend months migrating away from a database that was never right for the job.</p>
<p>A quick worked example: you're building a feature that logs every API call your model receives — the input payload, the prediction, the timestamp, the latency. What are the V's?</p>
<ul>
<li>Volume: medium-to-high, growing over time</li>
<li>Velocity: high — potentially millions of events per day</li>
<li>Variety: low — the schema is consistent</li>
<li>Veracity: high — it's your own system generating this</li>
</ul>
<p>That profile points toward a time-series or append-optimized store, not a relational database. The four V's just told you what to build before you wrote a line of code.</p>`,
    },
    {
      type: "image",
      src: "/images/engineering/four-vs-diagram.png",
      alt: "Diagram showing the four V's of data — volume, velocity, variety, veracity — as axes for storage decisions",
      caption: "The four V's provide a structured way to translate a business problem into storage requirements.",
    },
    {
      type: "checkpoint",
      id: "eng-ch1-s2-q1",
      kind: "mc",
      question: "A hospital system is adding a new feature: continuous vitals monitoring for ICU patients. Every patient generates one data point per second across six vital signs. The data must be queryable by time window (e.g., 'give me everything from the last 6 hours') and retained for two years. Which V drives the storage choice most strongly here?",
      options: [
        {
          label: "Variety — because there are six different vital signs",
          correct: false,
          explanation: "Six vital signs is low variety — it's a consistent, structured schema. Variety would be a factor if the system were mixing vitals with free-text clinical notes and images.",
        },
        {
          label: "Velocity — because the continuous stream of one reading per second per patient is what makes standard relational databases a poor fit",
          correct: true,
          explanation: "Correct. High-velocity, append-heavy, time-windowed queries are the signature of a time-series database workload. Relational databases can handle it, but they'll struggle to perform well as data accumulates. Velocity is the decisive V here.",
        },
        {
          label: "Veracity — because hospital data is high-stakes",
          correct: false,
          explanation: "Veracity is important for validation and alerting logic, but it doesn't drive the database architecture. You'd validate data the same way regardless of which storage system you used.",
        },
        {
          label: "Volume — because two years of data is large",
          correct: false,
          explanation: "Volume matters, but it's a consequence of velocity. The two-year retention policy is manageable in many systems. The streaming, time-windowed query pattern driven by velocity is what most sharply distinguishes the right tool here.",
        },
      ],
    },
  ],
};

export default whatKindOfData;
