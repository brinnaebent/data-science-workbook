import type { Section } from "@brinnaebent/workbook";

const userBehaviorAndCombinedTypes: Section = {
  id: "user-behavior-and-combined-types",
  number: 8,
  title: "User Behavior and Combined Data Types",
  blocks: [
    {
      type: "text",
      html: `<p><strong>User behavior data</strong> is data about what people <em>do</em>. Clicks. Purchases. Likes. Time spent on a page. A/B test outcomes. It typically comes bundled with metadata — user demographics, device type, timestamps, session identifiers — and it tends to be high-volume and fine-grained. Companies record millions or billions of events.</p>`,
    },
    {
      type: "interactive",
      component: "SignalSpy",
      caption: "Interact with the page to see the different data that can be collected when you interact with a website.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Three Properties That Define User Behavior Data",
      html: `<ul>
<li><strong>Inherently sequential.</strong> What someone clicked five minutes ago is part of the context for what they click next.</li>
<li><strong>Dynamic.</strong> Behavior shifts over time, sometimes quickly. A model trained on last month's data may already be stale.</li>
<li><strong>High volume and fine granularity.</strong> The challenge is rarely "do we have enough data." The challenge is "how do we make this tractable."</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p><strong>Combinations of multiple data types</strong> is where real-world systems live. One example is the <strong>Electronic Health Record</strong> (EHR). A single patient's record contains all of the following at once:</p>
<ul>
<li>Free-text physician notes <em>(text)</em></li>
<li>Medical images — X-rays, MRIs, CT scans <em>(images)</em></li>
<li>Sensor data — vital signs, continuous glucose monitors, ECGs <em>(sensor time series)</em></li>
<li>Survey-style structured fields — intake forms, demographics <em>(tabular)</em></li>
<li>Lab results at irregular intervals <em>(sparse time series)</em></li>
</ul>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Three Challenges of Combined Data",
      html: `<ul>
<li><strong>Inconsistency.</strong> Different entries follow different conventions. A blood pressure reading might be <code>"120/80"</code> in one record and <code>{'{'}systolic: 120, diastolic: 80{'}'}</code> in another.</li>
<li><strong>Organization.</strong> You can structure this data by date, by individual, by visit, by encounter type. None of these is obviously right.</li>
<li><strong>"Missing" data is everywhere — and most of it isn't really missing.</strong> A null in "MRI taken" means the patient didn't need an MRI, not that the data is absent. Your code might not know that.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Self-Driving Cars: Multi-Modal Fusion",
      html: `<p>A single autonomous vehicle is simultaneously producing camera images, LIDAR point clouds (3D sensor data), IMU readings (motion sensors), map data (text and structured), and GPS (time series). All of it has to be fused in real time to make a single decision: brake, accelerate, turn, lane-change. The hard part of self-driving isn't any one modality — it's the fusion.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-info-rep-combined-q1",
      kind: "mc",
      question: "An EHR record has a null value in the 'MRI result' column for a patient. What is most likely true?",
      options: [
        {
          label: "The patient didn't have an MRI — the null indicates absence of a procedure, not missing data",
          correct: true,
          explanation: "Correct. This is a crucial distinction. In clinical data, a null in 'MRI result' almost always means 'no MRI was ordered,' not that someone forgot to record the result. Imputing this null as if it were missing data would be a serious mistake.",
        },
        {
          label: "The MRI result was not recorded properly and should be imputed",
          correct: false,
          explanation: "This assumes the procedure happened but the data is absent. In clinical records, the more likely explanation is that the procedure never occurred — and treating it as 'missing to be imputed' would introduce false information.",
        },
        {
          label: "The null represents an error in the data pipeline and should be flagged for removal",
          correct: false,
          explanation: "A null for a procedure that wasn't performed is not a pipeline error — it's the correct representation. Flagging and removing it would lose meaningful signal about that patient's care.",
        },
      ],
    },
    {
      type: "checkpoint",
      id: "ds-info-rep-combined-reflect",
      kind: "reflective",
      question: "Look at an app or service you use daily. What data types does it probably collect about you? How might those types be combined to make predictions about your behavior?",
      sampleAnswer: "A music streaming service collects user behavior data (plays, skips, playlists), text data (search queries, playlist names), and time series data (when you listen). It might combine these: if you consistently play slower music on Sunday evenings, and your playlists have titles like 'wind down,' the system can combine temporal patterns (time series) with behavioral patterns (plays/skips) and textual signals (playlist names) to predict your mood and recommend accordingly.",
    },
  ],
};

export default userBehaviorAndCombinedTypes;
