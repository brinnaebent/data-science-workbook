import type { Section } from "@brinnaebent/workbook";

const mannWhitney: Section = {
  id: "mann-whitney",
  number: 3,
  title: "Mann-Whitney U Test",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Question:</strong> Are the distributions of two independent groups significantly different? (Equivalently: if you randomly pick one observation from each group, what's the probability that group A's value exceeds group B's?)</p>
<p><strong>Use it when:</strong> Two independent groups, normality is violated. This is the nonparametric analog of the independent t-test. Sometimes called the Wilcoxon rank-sum test — note: different from the Wilcoxon <em>signed-rank</em> test.</p>
<p><strong>How it works:</strong></p>
<ol>
<li>Combine all observations and rank them in ascending order (average ranks for ties).</li>
<li>Sum the ranks for each group separately.</li>
<li>Compute U statistics from the rank sums; take the smaller as the test statistic.</li>
</ol>
<br>
<p><strong>In Python:</strong> <code>scipy.stats.mannwhitneyu(group1, group2)</code></p>`,
    },
    {
      type: "interactive",
      component: "MannWhitneyWalkthrough",
      caption: "Walk through the three steps of the Mann-Whitney U test on real data. Switch datasets to see how the combined ranks and U statistics change.",
      props: {},
    },
    {
      type: "callout",
      variant: "warning",
      title: "Don't Confuse The Two",
      html: `<p>The Wilcoxon <strong>signed-rank</strong> test is for <em>paired</em> data. The Wilcoxon <strong>rank-sum</strong> test (Mann-Whitney U) is for <em>independent</em> groups. They share a name and similar mechanics but answer different questions. Check which one you need before running.</p>`,
    },
  ],
};

export default mannWhitney;
