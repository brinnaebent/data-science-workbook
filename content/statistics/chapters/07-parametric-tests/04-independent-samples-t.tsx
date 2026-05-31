import type { Section } from "@brinnaebent/workbook";

const independentSamplesT: Section = {
  id: "independent-samples-t",
  number: 4,
  title: "Independent Samples and Welch's t-Test",
  blocks: [
    {
      type: "callout",
      variant: "info",
      title: "Student's Independent Samples t-Test",
      html: `<p><strong>Question:</strong> Are the means of two independent groups significantly different?</p>
<p><strong>Use it when:</strong> Two separate groups, no overlap between subjects, means compared. Common in A/B tests.</p>
<p><strong>Assumptions:</strong> Independence, normality within each group, <em>equal variances (homogeneity)</em>.</p>
<p><strong>In Python:</strong> <code>scipy.stats.ttest_ind(group1, group2)</code></p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Welch's t-Test (Unequal Variances)",
      html: `<p><strong>Question:</strong> Same as Student's — but used when the equal-variance assumption may not hold.</p>
<p><strong>Use it when:</strong> Two independent groups, but variance in the groups differs or you're unsure. Welch's computes an adjusted degrees of freedom (Welch-Satterthwaite equation) that accounts for unequal variances.</p>
<p><strong>Recommendation:</strong> Default to Welch's. The cost of using it when variances are actually equal is small. The cost of using Student's when they're not can be substantial — your p-values will be wrong.</p>
<p><strong>In Python:</strong> <code>scipy.stats.ttest_ind(group1, group2, equal_var=False)</code></p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Worked Example: New vs. Returning Customers",
      html: `<p>Comparing average purchase amounts: new customers (mean = $65, SD = $5, n = 100) vs. returning customers (mean = $67, SD = $15, n = 100).</p>
<p>Notice the standard deviations: $5 vs. $15. That's a 3x difference in spread — Levene's test would likely flag this, and Welch's is clearly the right choice here.</p>
<p>Running the independent t-test, you might find the means are not statistically significantly different (because the high variance in returning customers creates a wide confidence interval around their mean). The lesson: visually similar sample means don't necessarily mean a significant difference when variance is high.</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch7-s4-q1",
      kind: "mc",
      question: "You're comparing average response time between two groups in an A/B test. Levene's test returns p = 0.01, indicating significantly unequal variances. Which test should you use?",
      options: [
        {
          label: "Student's t-test, because it's the standard choice for two-group comparisons",
          correct: false,
          explanation: "Student's t-test assumes equal variances. With Levene's test showing p = 0.01 (unequal variances), Student's t-test will produce biased p-values.",
        },
        {
          label: "Welch's t-test, because it doesn't assume equal variances and is valid when they differ",
          correct: true,
          explanation: "Correct. Welch's t-test is designed exactly for this case. It adjusts the degrees of freedom to account for the variance heterogeneity, giving valid inference even when group variances differ substantially.",
        },
        {
          label: "Transform the data to equalize variances, then use Student's t-test",
          correct: false,
          explanation: "Transforming data can sometimes help, but it changes the question you're answering (you'd be comparing the transformed means). Welch's t-test is a more principled solution that doesn't require data manipulation.",
        },
        {
          label: "Use a nonparametric test since the variance assumption is violated",
          correct: false,
          explanation: "Welch's t-test is the standard fix for unequal variances in a two-group comparison. Jumping to nonparametric isn't necessary — you've only violated one assumption (equal variances), and Welch's directly addresses it.",
        },
      ],
    },
  ],
};

export default independentSamplesT;
