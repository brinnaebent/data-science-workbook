import type { Section } from "@brinnaebent/workbook";

const thePracticalQuestion: Section = {
  id: "the-practical-question",
  number: 1,
  title: "The Practical Question",
  blocks: [
    {
      type: "text",
      html: `<p>You're a few weeks into a new project. Someone asks: "How many users do we need in this experiment?" Or: "How many labeled examples do we need to demonstrate this model works?" Or: "Can we cut the study short — do we have enough data yet?"</p>
<p>These are all power analysis questions. <strong>Power analysis</strong> is the closest thing we have to a principled, defensible answer to "how much data do I need?" It won't always give you a number that's compatible with your timeline and budget — sometimes the answer is "more than you can afford" — but it gives you a starting point grounded in statistics rather than guesswork.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Statistical Significance ≠ Practical Significance",
      html: `<p>Before diving into power analysis, a quick recalibration. <strong>Statistical significance</strong> is a measure of how unlikely a result is under the null — it says nothing about magnitude or importance. Four things get confused constantly:</p>
<ul>
<li>Statistical significance does <strong>not</strong> equal practical significance. A tiny effect can have a tiny p-value with enough data.</li>
<li>Statistical significance is heavily influenced by sample size. Large datasets find small effects significant.</li>
<li>Non-significant results do <strong>not</strong> prove no effect exists. Maybe the effect is real but your sample wasn't large enough.</li>
</ul>`,
    },
  ],
};

export default thePracticalQuestion;
