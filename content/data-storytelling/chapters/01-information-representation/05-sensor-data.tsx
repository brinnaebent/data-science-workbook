import type { Section } from "@brinnaebent/workbook";

const sensorData: Section = {
  id: "sensor-data",
  number: 5,
  title: "Sensor Data",
  blocks: [
    {
      type: "text",
      html: `<p>Sensor data is a special case of time series. It's encoded as numbers, it's inherently sequential, and the ordering carries information. If you call your sample at time <em>n</em> by the name <em>x</em>, then <em>x</em><sub>n−1</sub> came before it and <em>x</em><sub>n+1</sub> comes after. Order matters; you can't reshuffle.</p>
<p>Two things that aren't obvious if you've never worked with sensors before:</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Timestamps Aren't in the File",
      html: `<p>Most of the time, when you receive sensor data, the timestamps aren't included row by row. Instead, you infer them from the sensor's <strong>sample rate</strong>, which lives in the sensor's <strong>data sheet</strong>. Become very familiar with the data sheets of the sensors you work with. They tell you what the numbers actually mean, what the sample rate is, and what filtering has been applied. Without the data sheet, you're flying blind.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Downsample Yes — Upsample With Extreme Care",
      html: `<p><strong>Downsampling</strong> means removing samples (100 Hz → 10 Hz). You're throwing data away, but you're not introducing anything new.</p>
<p><strong>Upsampling</strong> means adding samples — filling in values where there weren't any. Whatever method you use (interpolation, repetition, smoothing) introduces assumptions that may not be true. With sensor data, you can introduce bias that distorts every model trained downstream.</p>
<p>Default rule: <strong>downsample yes, upsample very carefully.</strong></p>`,
    },
    {
      type: "interactive",
      component: "SamplingExplorer",
      caption: "Downsampling removes real samples but introduces nothing new. Upsampling fabricates values — and whatever method you use encodes assumptions that may not be true.",
    },
    {
      type: "checkpoint",
      id: "ds1-q4-upsample",
      kind: "mc",
      question: "A sensor dataset was collected at 50 Hz. A teammate proposes upsampling to 200 Hz to match another sensor. What is the core risk?",
      options: [
        {
          label: "Upsampling increases file size, slowing training",
          explanation: "File size is a practical concern, not the fundamental risk.",
        },
        {
          label: "Upsampling introduces fabricated data points based on assumptions that may not reflect the true underlying signal",
          correct: true,
          explanation: "Any upsampling method fills in values that were never actually measured. Those synthetic values encode assumptions that can introduce bias into every downstream model.",
        },
        {
          label: "Upsampling changes the sample rate label, causing documentation confusion",
          explanation: "Documentation issues are real but secondary. The core problem is fabricated signal values.",
        },
        {
          label: "Upsampling is fine as long as you use linear interpolation",
          explanation: "Linear interpolation is one upsampling method — it still introduces assumptions, especially problematic for nonlinear physiological signals.",
        },
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "You Are Rarely Getting Raw Data",
      html: `<p>A heart-rate sensor in a smartwatch does not give you "heart rate." It gives you the output of a multi-stage signal processing pipeline running on the device. The actual <em>raw</em> signal — photoplethysmography (PPG) — has been filtered, peak-detected, smoothed, compressed, and translated into beats per minute before it ever reaches your data file. If you want to build sensor-data models that work, you have to understand what's happening upstream of the file you're reading.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Research Example: Non-Invasive Glucose Detection",
      html: `<p>During my PhD, I investigated sources of inaccuracy in wearable heart-rate sensors and engineered digital biomarkers of interstitial glucose from smartwatch data — the goal being non-invasive glucose detection instead of a finger prick. To do that, I had to understand the PPG signal at the hardware level, not just the aggregated "heart rate per minute" level. The patterns we cared about lived in the raw signal.</p>`,
    },
  ],
};

export default sensorData;
