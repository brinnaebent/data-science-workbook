import type { Section } from "@brinnaebent/workbook";

const howMuchData: Section = {
  id: "how-much-data",
  number: 5,
  title: "The \"How Much Data\" Question",
  blocks: [
    {
      type: "text",
      html: `<p>If you spend any time around data, you will be asked some version of this question approximately forever: <em>How much data do I need?</em> To predict churn. To detect this disease. To prove this campaign worked.</p>
<p>Well, the answer is: <strong>it depends.</strong></p>
<p>It depends on the complexity of your problem. The model you plan to use. The expected variability in your data. The quality of that data. The dimensionality of your feature space. The class imbalance you anticipate. The effect size you're hoping to detect. The significance level you've chosen. And sometimes most decisively — your time and budget constraints.</p>`,
    },
    {
      type: "text",
      html: `<p>You'll leave this unit with the language to give a better answer than "it depends" — though fair warning, you'll still say "it depends" a lot. The difference is you'll be able to enumerate exactly what it depends on, and you'll know how to get an answer.</p>
<p>The factors that determine how much data you need, in rough order of importance:</p>
<ol>
<li><strong>Effect size you're trying to detect.</strong> Small effects require much more data than large ones.</li>
<li><strong>Variability in your outcome.</strong> Noisy outcomes require more data to find signal in.</li>
<li><strong>Statistical power you want.</strong> Wanting to miss fewer real effects (higher power) means more data.</li>
<li><strong>Significance threshold (α).</strong> Stricter thresholds require larger samples.</li>
<li><strong>Model complexity.</strong> More parameters generally means more training examples needed.</li>
<li><strong>Class imbalance.</strong> A dataset that's 99% one class effectively has very few examples of what you care about.</li>
</ol>`,
    },
    {
      type: "interactive",
      component: "HowMuchDataExplorer",
      caption: "Adjust effect size, desired power, and significance threshold to see how required sample size changes. The curve makes viscerally clear why detecting small effects is so expensive. We will dive into this in great detail in Chapter 4!",
      props: {},
    },
    {
      type: "reflection",
      id: "stats-ch1-s5-reflect",
      question: "You're asked to evaluate whether a new recommendation algorithm increases click-through rate from 2.1% to 2.3%. How would you think about how much data you need? What would make this easier or harder?",
      sampleAnswer: "The effect is a 0.2 percentage-point improvement on a 2.1% baseline — a relative lift of about 9.5%, but in absolute terms very small. You'd need a formal power analysis, but intuition says a lot of users — likely hundreds of thousands — because the absolute effect is tiny. Having lower traffic, more noise (e.g., weekend vs. weekday effects), or multiple simultaneous experiments would all make it harder.",
    },
  ],
};

export default howMuchData;
