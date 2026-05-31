import type { Section } from "@brinnaebent/workbook";

const historicalTimeSeries: Section = {
  id: "historical-time-series",
  number: 4,
  title: "Time Series",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Time series</strong> is data recorded in order, at intervals, over time. It might be numeric — financial data, energy load, stock prices — or categorical, like demographic snapshots or weather conditions. What unites time series data is that <em>the order matters</em>. You can't shuffle the rows the way you could in a survey.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Sample Rate: The Most Important Decision You'll Make",
      html: `<p>How often was the data collected? Hourly? Daily? Monthly? Every five minutes? <strong>Sample rate decisions are not technical decisions — they're modeling decisions.</strong></p>
<ul>
<li>Do you really need to record weather every minute? Probably not.</li>
<li>Do you want a heart-rate reading every week? Probably not.</li>
<li>The right sample rate is driven by the patterns you're trying to capture. What temporal resolution do those patterns require? Faster than that is wasteful. Slower and the patterns disappear from your data entirely.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Connection to Feature Engineering",
      html: `<p>You'll see time series again in Chapter 7 when we talk about engineering features for it — rolling statistics, lag features, seasonal decompositions. For now, just internalize: sequential data, sample rate matters, granularity is a modeling choice.</p>`,
    },
    {
      type: "interactive",
      component: "FrequencyDomainExplorer",
      caption: "Toggle frequency components to see how they combine in the time domain — and how the frequency domain makes each component visible separately.",
    },
    {
      type: "callout",
      variant: "example",
      title: "High-Frequency Trading vs. Macroeconomics",
      html: `<p>High-frequency trading firms sample on sub-millisecond cadences because their patterns live there. Macroeconomic forecasters sample monthly or quarterly because their patterns live there. Both are right — they're working on different problems. The sample rate follows from the application, not from convention.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-info-rep-timeseries-q1",
      kind: "mc",
      question: "Why can't you shuffle the rows of a time series dataset the way you can shuffle rows of a survey?",
      options: [
        {
          label: "Because the ordering encodes temporal relationships — each value depends on what came before it",
          correct: true,
          explanation: "Correct. In a time series, the sequence carries information. A heart rate of 120 bpm right after intense exercise is very different from a heart rate of 120 bpm at rest — and shuffling rows would destroy that context.",
        },
        {
          label: "Because time series data is usually larger, making shuffling computationally expensive",
          correct: false,
          explanation: "Size is a practical concern but not the conceptual reason. You could shuffle a small time series — but it would break the temporal structure that makes the data meaningful.",
        },
        {
          label: "Because time series data always contains timestamps, which must stay sorted",
          correct: false,
          explanation: "Not all time series have explicit timestamps — many sensor datasets don't include timestamps in the file (you infer them from the sample rate). The real reason is that temporal order encodes the relationships between observations.",
        },
      ],
    },
  ],
};

export default historicalTimeSeries;
