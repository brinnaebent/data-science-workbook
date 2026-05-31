import type { Section } from "@brinnaebent/workbook";

const decisionFramework: Section = {
  id: "class-balancing-decision-framework",
  number: 4,
  title: "A Decision Framework",
  blocks: [
    {
      type: "text",
      html: `<p>When you encounter imbalanced data, walk through these questions in roughly this order:</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Step 1: Is the Metric the Problem?",
      html: `<p>If you're optimizing for accuracy on an imbalanced dataset, the metric is part of the problem. Look at precision, recall, F1, and AUC-PR (precision-recall AUC) for the minority class. Sometimes "fixing" the metric is the right answer, not resampling the data.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Step 2: Can You Get More Minority Data?",
      html: `<p>Always the first ask. If yes, do that. Real data beats synthetic data every time.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Step 3: Is the Imbalance Severe Enough to Warrant Synthetic Methods?",
      html: `<p>A 60/40 split usually isn't worth resampling. A 99/1 split almost always is. There's no hard cutoff — use domain judgment about how much the minority class matters to your task.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Step 4: If Resampling, How?",
      html: `<p>Try SMOTE before random oversampling — less likely to cause overfitting. If classes overlap significantly, combine SMOTE with Tomek links to clean the boundary. Consider algorithm-level fixes too: class weights in your loss function (e.g., <code>class_weight='balanced'</code> in sklearn) can be effective without touching the data at all.</p>`,
    },
    {
      type: "reflection",
      id: "stats-ch6-s4-reflect",
      question: "You're working on a fraud detection model with 99.9% legitimate transactions and 0.1% fraud. Your manager wants you to 'balance the classes.' Walk through the decision framework: what questions would you ask first, and what approach would you recommend?",
      sampleAnswer: "First: is accuracy misleading here? Yes — 99.9% baseline accuracy by always predicting 'legitimate.' Switch to precision-recall or F1 on the fraud class. Second: can we get more fraud data? Often no — fraud is rare by definition. Third: yes, the 0.1% imbalance is severe. Fourth: SMOTE to oversample fraud examples (only on training data), possibly combined with Tomek links. Also try class_weight='balanced' in sklearn — it's a free, no-data-modification way to penalize misclassifying the minority class more heavily.",
    },
  ],
};

export default decisionFramework;
