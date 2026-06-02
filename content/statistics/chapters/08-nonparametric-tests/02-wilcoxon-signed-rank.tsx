import type { Section } from "@brinnaebent/workbook";

const wilcoxonSignedRank: Section = {
  id: "wilcoxon-signed-rank",
  number: 2,
  title: "Wilcoxon Signed-Rank Test",
  blocks: [
    {
      type: "text",
      html: `
<p><strong>Question:</strong> Is there a significant difference in the medians of two related groups?</p>
<p><strong>Use it when:</strong> Paired data (like the paired t-test), but normality is violated.</p>
<p><strong>How it works:</strong></p>
<ol>
<li>Compute the difference between each paired observation.</li>
<li>Rank the absolute differences (ignoring sign).</li>
<li>Reattach the original signs to the ranks.</li>
<li>The test statistic W is the smaller of the sum of positive ranks vs. negative ranks.</li>
</ol>
<br>
<p><strong>In Python:</strong> <code>scipy.stats.wilcoxon(before, after)</code></p>`,
    },
    {
      type: "interactive",
      component: "WilcoxonWalkthrough",
      caption: "Walk through the four steps of the Wilcoxon signed-rank test on real paired data. Switch datasets to see how the ranks and test statistic change.",
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

export default wilcoxonSignedRank;
