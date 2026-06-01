import type { Section } from "@brinnaebent/workbook";

const monitoringAndDrift: Section = {
  id: "monitoring-and-drift",
  number: 4,
  title: "Monitoring and Data Drift",
  blocks: [
    {
      type: "text",
      html: `<p>Here is an uncomfortable truth about deployed ML models: your model's performance in production is not your model's performance in evaluation. The world changes. User behavior shifts. Data pipelines drift. Upstream systems change their schemas. A model trained on pre-pandemic mobility data is useless in 2020. A fraud detection model trained in Q1 will be fighting a different set of fraud patterns by Q4.</p>
<p>This is <strong>data drift</strong> — the distribution of the inputs your model sees in production shifts away from the distribution it was trained on. When that happens, model performance degrades. Silently, gradually, until something breaks loudly enough for someone to notice.</p>
<p>Without monitoring, you have a model. With monitoring, you have a system.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Two Types of Drift",
      html: `<ul>
<li><strong>Data drift (covariate shift)</strong> — the input distribution $P(X)$ changes while the relationship $P(Y|X)$ stays the same. Example: the age distribution of your users shifts younger. Your model's relationship between age and purchase probability is still correct; it's just seeing more inputs in a range it saw rarely during training.</li>
<li><strong>Concept drift</strong> — the relationship $P(Y|X)$ itself changes. Example: a model predicts whether a tweet will go viral. The criteria for "going viral" changes as the platform's recommendation algorithm changes. The inputs look the same; the labels that were correct for training data are no longer correct for current data.</li>
</ul>
<p>Concept drift is harder to detect because you need ground truth labels to measure it — and those often arrive with a delay or not at all.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "What a Monitoring Stack Looks Like",
      html: `<ul>
<li><strong>Performance tracking</strong> — compute accuracy, precision, recall, or RMSE on the live data as ground truth arrives. Alert when metrics fall below threshold. This is the gold standard — direct measurement of what you care about.</li>
<li><strong>Input distribution monitoring</strong> — track the statistical properties of your input features over time. If the mean of a key feature drifts significantly, that's a leading indicator of performance degradation. Statistical tests (Population Stability Index, Kolmogorov-Smirnov) formalize this comparison.</li>
<li><strong>Resource monitoring</strong> — CPU, memory, latency, throughput, error rate. Standard software operations, but essential.</li>
<li><strong>Centralized logging</strong> — every prediction logged with its inputs, output, timestamp, and model version. This is what you query when something breaks at 2 a.m.</li>
<li><strong>Alerting</strong> — for outages (the model is unreachable) and for quality degradation (the model is reachable but performing poorly). The second alert is the one most teams forget to build.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Population Stability Index",
      html: `<p>The <strong>Population Stability Index (PSI)</strong> is a common metric for detecting input drift. It measures how much a feature's distribution has shifted between a baseline (training time) and the current window:</p>
<p>$$\\text{PSI} = \\sum_{i} \\left(p_i^{\\text{actual}} - p_i^{\\text{expected}}\\right) \\cdot \\ln\\left(\\frac{p_i^{\\text{actual}}}{p_i^{\\text{expected}}}\\right)$$</p>
<p>Interpretation:</p>
<ul>
<li>$\\text{PSI} < 0.1$ — no significant shift; model should be stable</li>
<li>$0.1 \\leq \\text{PSI} < 0.2$ — moderate shift; monitor closely</li>
<li>$\\text{PSI} \\geq 0.2$ — significant shift; consider retraining</li>
</ul>
<p>PSI is widely used in financial services (credit scoring, fraud detection) because it has interpretable thresholds and requires no ground truth — you can compute it on input features alone, which matters when labels arrive weeks or months after the prediction.</p>`,
    },
    {
      type: "image",
      src: "/images/engineering/drift-over-time.png",
      alt: "Line chart showing model accuracy over time, starting high and gradually declining as data drift accumulates, with a retraining event that restores performance",
      caption: "Data drift degrades model performance gradually and silently. Monitoring catches the degradation early; a retraining trigger restores performance before it becomes a user-visible problem.",
    },
    {
      type: "interactive",
      component: "DriftDetective",
      caption: "Watch a simulated production stream. A slider gradually introduces drift. Identify which feature is affected and trigger a retrain before the model fails.",
      props: {},
    },
    {
      type: "reflection",
      id: "eng-ch3-s4-r1",
      question: "Consider a model you've worked on or can imagine working on. What would data drift look like in that domain? How would you detect it? How long would it take to notice if you had no monitoring?",
      sampleAnswer: "A good answer is domain-specific. For a recommendation model: user preferences shift seasonally, new content categories emerge, the user base ages. You'd detect it via input distribution monitoring (feature statistics drifting) and output monitoring (click-through rate declining). Without monitoring, you'd notice when users complain or A/B test results show degradation — likely weeks to months after the drift began.",
    },
  ],
};

export default monitoringAndDrift;
