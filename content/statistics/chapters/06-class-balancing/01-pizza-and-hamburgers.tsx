import type { Section } from "@brinnaebent/workbook";

const pizzaAndHamburgers: Section = {
  id: "pizza-and-hamburgers",
  number: 1,
  title: "A Story About Pizza and Hamburgers",
  blocks: [
    {
      type: "text",
      html: `<p>Let me start this chapter with the example I always use, because it crystallizes everything that goes wrong with imbalanced data.</p>
<p>Imagine your training set: six images of pizza, two images of hamburgers. You train a model. The reported accuracy is 75%.</p>
<p>You go to celebrate. Then you actually run the model. You feed it a picture of a pizza — it correctly says "pizza." You feed it a picture of a hamburger — it confidently says "pizza." You feed it a third picture of anything — "pizza."</p>
<p>The model has learned exactly one thing: pizza is more common than hamburgers. By predicting "pizza" every single time, it gets six out of eight examples right. Seventy-five percent accuracy. The number is real. The model is useless.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "This Happens Constantly in High-Stakes Domains",
      html: `<p>A healthcare diagnostic where 99% of patients are healthy: a model that predicts "healthy" for everyone scores 99% accuracy and detects no one who's actually sick. Fraud detection. Defect detection. Rare event prediction. Whenever your outcome is rare, accuracy as a sole metric is a trap.</p>
<p>Here's a personal story. I lost a hackathon over this once. I'd adjusted for class imbalance — my model was learning to discriminate the minority class properly, and my accuracy came in around 92%. The team that won didn't adjust. Their model essentially predicted the majority class every time and got 99.5% accuracy. The judges scored on accuracy alone, and that was that. Their model was technically the "winner" and operationally worthless. It has stuck with me ever since as a reminder that imbalanced data plus the wrong metric is a recipe for impressive-looking models that don't actually work.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Learning Objectives",
      html: `<p>By the end of this chapter, you'll be able to:</p>
<ol>
<li>Explain why class imbalance breaks naive model evaluation.</li>
<li>Distinguish data-level and algorithm-level approaches.</li>
<li>Apply random oversampling and SMOTE.</li>
<li>Apply random undersampling and Tomek links.</li>
<li>Reason through a decision framework for when to balance and how.</li>
</ol>`,
    },
  ],
};

export default pizzaAndHamburgers;
