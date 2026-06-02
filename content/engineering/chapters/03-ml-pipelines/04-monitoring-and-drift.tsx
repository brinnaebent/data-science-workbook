import type { Section } from "@brinnaebent/workbook";

const monitoringAndDrift: Section = {
  id: "monitoring-and-drift",
  number: 4,
  title: "Monitoring and Data Drift",
  blocks: [
    {
      type: "text",
      html: `<p>Your model's performance in production is not your model's performance in evaluation. The world changes. User behavior shifts. Data pipelines drift. Upstream systems change their schemas. A model trained on pre-pandemic mobility data is useless in 2020. A fraud detection model trained in Q1 will be fighting a different set of fraud patterns by Q4.</p>
<p>This is <strong>data drift</strong> — the distribution of the inputs your model sees in production shifts away from the distribution it was trained on. When that happens, model performance degrades. Silently, gradually, until something breaks loudly enough for someone to notice.</p>
<p>Without monitoring, you have a model. With monitoring, you have a system.</p>`,
    },
    {
      type: "interactive",
      component: "DataDriftVisualizer",
      caption: "Student arrival times shift over a semester — the same pattern your model faces as production data drifts away from training data.",
      props: {},
    },
    {
      type: "callout",
      variant: "info",
      title: "Two Types of Drift",
      html: `<ul>
<li><strong>Data drift (covariate shift)</strong> — the input distribution $P(X)$ changes while the relationship $P(Y|X)$ stays the same. Example: the age distribution of your users shifts younger. Your model's relationship between age and purchase probability is still correct; it's just seeing more inputs in a range it saw rarely during training.</li><br>
<li><strong>Concept drift</strong> — the relationship $P(Y|X)$ itself changes. Example: a model predicts whether a tweet will go viral. The criteria for "going viral" changes as the platform's recommendation algorithm changes. The inputs look the same; the labels that were correct for training data are no longer correct for current data.</li>
</ul>
<p>Concept drift is harder to detect because you need ground truth labels to measure it — and those often arrive with a delay or not at all.</p>`,
    },
    {
      type: "interactive",
      component: "MonitoringStackGrid",
      caption: "",
      props: {},
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
</ul><br>
<p>PSI is widely used in financial services (credit scoring, fraud detection) because it has interpretable thresholds and requires no ground truth — you can compute it on input features alone, which matters when labels arrive weeks or months after the prediction.</p>`,
    },
    {
      type: "interactive",
      component: "DriftDetective",
      caption: "",
      props: {},
    },
  ],
};

export default monitoringAndDrift;
