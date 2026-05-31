import type { Section } from "@brinnaebent/workbook";

const wilcoxonAndMannWhitney: Section = {
  id: "wilcoxon-and-mann-whitney",
  number: 2,
  title: "Wilcoxon Signed-Rank and Mann-Whitney U",
  blocks: [
    {
      type: "callout",
      variant: "info",
      title: "Wilcoxon Signed-Rank Test (Paired)",
      html: `<p><strong>Question:</strong> Is there a significant difference in the medians of two related groups?</p>
<p><strong>Use it when:</strong> Paired data (like the paired t-test), but normality is violated.</p>
<p><strong>How it works:</strong></p>
<ol>
<li>Compute the difference between each paired observation.</li>
<li>Rank the absolute differences (ignoring sign).</li>
<li>Reattach the original signs to the ranks.</li>
<li>The test statistic W is the smaller of the sum of positive ranks vs. negative ranks.</li>
</ol>
<p><strong>In Python:</strong> <code>scipy.stats.wilcoxon(before, after)</code></p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Mann-Whitney U Test (Independent)",
      html: `<p><strong>Question:</strong> Are the distributions of two independent groups significantly different? (Equivalently: if you randomly pick one observation from each group, what's the probability that group A's value exceeds group B's?)</p>
<p><strong>Use it when:</strong> Two independent groups, normality is violated. This is the nonparametric analog of the independent t-test. Sometimes called the Wilcoxon rank-sum test — note: different from the Wilcoxon <em>signed-rank</em> test above.</p>
<p><strong>How it works:</strong></p>
<ol>
<li>Combine all observations and rank them in ascending order (average ranks for ties).</li>
<li>Sum the ranks for each group separately.</li>
<li>Compute U statistics from the rank sums; take the smaller as the test statistic.</li>
</ol>
<p><strong>In Python:</strong> <code>scipy.stats.mannwhitneyu(group1, group2)</code></p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Don't Confuse These Two",
      html: `<p>The Wilcoxon <strong>signed-rank</strong> test is for <em>paired</em> data. The Wilcoxon <strong>rank-sum</strong> test (Mann-Whitney U) is for <em>independent</em> groups. They share a name and similar mechanics but answer different questions. Check which one you need before running.</p>`,
    },
    {
      type: "interactive",
      component: "NonparametricTestExplorer",
      caption: "Placeholder: Enter two datasets and toggle between Wilcoxon signed-rank (paired) and Mann-Whitney U (independent). See the ranks, test statistic, and p-value.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch8-s2-q1",
      kind: "mc",
      question: "You measure user engagement scores before and after a UI redesign for 50 users. The scores are skewed with some large outliers (a few power users with very high engagement). Which test is most appropriate?",
      options: [
        {
          label: "Paired t-test",
          correct: false,
          explanation: "The paired t-test assumes normality of the differences. With skewed distributions and outliers, this assumption is likely violated — the Wilcoxon signed-rank test is more appropriate.",
        },
        {
          label: "Mann-Whitney U test",
          correct: false,
          explanation: "The Mann-Whitney U is for independent groups. Here the same users are measured twice — the data is paired. Use the Wilcoxon signed-rank test.",
        },
        {
          label: "Wilcoxon signed-rank test",
          correct: true,
          explanation: "Correct. The data is paired (same users, before and after), and the distribution is skewed with outliers — violating the normality assumption of the paired t-test. The Wilcoxon signed-rank test is robust to these issues.",
        },
        {
          label: "Chi-square test",
          correct: false,
          explanation: "Chi-square is for categorical data, not continuous engagement scores.",
        },
      ],
    },
  ],
};

export default wilcoxonAndMannWhitney;
