import type { Section } from "@brinnaebent/workbook";

const pHacking: Section = {
  id: "p-hacking",
  number: 5,
  title: "P-Hacking and Why α Comes First",
  blocks: [
    {
      type: "text",
      html: `<p>Here's a problem you have to actively guard against. Suppose you collect your data, look at it, decide you'd love the result to be significant, and start shopping. You try α = 0.05 — your p of 0.07 doesn't make the cut. You think, "0.10 is sometimes used in exploratory research." Now you have significance.</p>
<p>This is <strong>p-hacking</strong>: bending the rules after the fact to get the result you want. It's not always this brazen. Sometimes it's running a dozen statistical tests and only reporting the one that came out significant. Sometimes it's slicing the data by every demographic until one slice shows an effect. Sometimes it's stopping data collection the moment a result crosses the significance threshold.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Defense: Discipline Before Data",
      html: `<ul>
<li><strong>Choose α before you look at the data.</strong></li>
<li><strong>Decide on your test before you collect.</strong></li>
<li><strong>Pre-register your analysis plan</strong> — even informally, by writing it down before running anything.</li>
<li>If you explore the data and try multiple things, that's fine — but be honest about it. Treat exploratory results as hypothesis-generating, not confirmatory. Correct for multiple comparisons.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>In industry, this pressure is real. Your manager wants a result. Your stakeholder wants justification for a decision they've already made. The temptation to "find" significance is constant. The antidote is to set your statistical plan before your data arrives — and to document that you did.</p>`,
    },
    {
      type: "reflection",
      id: "stats-ch3-s5-reflect",
      question: "Describe a scenario where p-hacking could be tempting in an industry ML context. What pressures would create the temptation, and what safeguards would you put in place?",
      sampleAnswer: "Running an A/B test on a new product feature with weak initial results. The product team is excited about the feature and the timeline is tight. Temptation: slice the data by user segment or device type until some slice shows significance, then claim the feature works 'for mobile users' or similar. Safeguards: pre-register the primary metric and segmentation plan before the test starts; require that secondary analyses be labeled as exploratory; use a corrections procedure (Bonferroni or Benjamini-Hochberg) for any multiple comparisons.",
    },
  ],
};

export default pHacking;
