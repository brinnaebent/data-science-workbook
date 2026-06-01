import type { Section } from "@brinnaebent/workbook";

const pValues: Section = {
  id: "p-values",
  number: 4,
  title: "P-Values, Carefully",
  blocks: [
    {
      type: "text",
      html: `<p>The <strong>p-value</strong> is the probability of obtaining test results at least as extreme as your observed results, <em>assuming the null hypothesis is true</em>. It ranges from 0 to 1. Smaller p-values indicate stronger evidence against the null.</p>
<p>That definition is precise and commonly misread. Let's slow down on it.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Common Misinterpretations of the p-value",
      html: `<ul>
<li><strong>Wrong:</strong> "p = 0.03 means there's a 3% chance the null is true."<br><strong>Right:</strong> "If the null were true, we'd see results this extreme about 3% of the time." The p-value is about the data given the null — not about the null given the data.</li>
<li><strong>Wrong:</strong> "p &lt; 0.05 means the effect is real and important."<br><strong>Right:</strong> Statistical significance and practical significance are different. A tiny effect can have a tiny p-value if you have enough data.</li>
<li><strong>Wrong:</strong> "p &gt; 0.05 proves there's no effect."<br><strong>Right:</strong> Failing to reject the null means you lack evidence for an effect — not that there's no effect. The effect might be real but your sample might be too small to detect it.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>Common significance thresholds (α): 0.05 is standard in most fields; 0.01 is used when false positives are particularly costly; 0.10 is sometimes used in exploratory work. Choose α <em>before</em> looking at the data.</p>
<p>Use p-values as one piece of evidence for decisions, not as proof. They are tools, not verdicts.</p>`,
    },
    {
      type: "interactive",
      component: "PValueVisualizer",
      caption: "Drag the test statistic to see the p-value (shaded area) update in real time. Toggle between one- and two-tailed tests and change α to see how the rejection decision changes.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch3-s4-q1",
      kind: "mc",
      question: "An A/B test shows that users who saw the new homepage design clicked \"sign up\" at a rate of 4.21% vs. 4.20% for the old design, with p = 0.003. What is the most appropriate conclusion?",
      options: [
        {
          label: "The new design is significantly better — ship it",
          correct: false,
          explanation: "Statistical significance doesn't equal practical significance. A 0.01 percentage point improvement might not be worth the engineering effort, design rollout, and potential downstream effects of a redesign.",
        },
        {
          label: "The result is statistically significant but probably not practically meaningful — the 0.01 pp difference is almost certainly too small to act on",
          correct: true,
          explanation: "Correct. With enough users, even negligible effects become statistically significant. p = 0.003 confirms the test has enough power to detect the 0.01 pp difference, but that difference is unlikely to matter operationally. Always ask: 'Even if this is real, does it matter?'",
        },
        {
          label: "p = 0.003 means there's a 0.3% chance the new design is no better — so it's probably better",
          correct: false,
          explanation: "This is the classic p-value misinterpretation. p = 0.003 means: if there were no effect, we'd see this result 0.3% of the time. It does NOT mean there's a 0.3% probability the null is true.",
        },
        {
          label: "Fail to reject the null — the 0.01 pp difference is too small",
          correct: false,
          explanation: "With p = 0.003, you do reject the null at any conventional threshold. But rejecting the null is not the same as recommending action — practical significance is a separate judgment.",
        },
      ],
    },
  ],
};

export default pValues;
