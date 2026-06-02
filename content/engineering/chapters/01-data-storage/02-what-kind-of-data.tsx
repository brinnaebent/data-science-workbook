import type { Section } from "@brinnaebent/workbook";

const whatKindOfData: Section = {
  id: "what-kind-of-data",
  number: 2,
  title: "What Kind of Data?",
  blocks: [
    {
      type: "text",
      html: `<p>Before you can choose where to store something, you need to know what it <em>is</em>. Data comes in three structural forms, and each one has a different relationship with the databases designed to hold it.</p>`,
    },
    {
      type: "interactive",
      component: "DataTypesGrid",
      caption: "",
      props: {},
    },
    {
      type: "text",
      html: `<p>Knowing the type gets you halfway there. The other half is the <strong>four V's</strong> — a framework for sizing up any storage problem.</p>`,
    },
    {
      type: "interactive",
      component: "FourVsGrid",
      caption: "",
      props: {},
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
