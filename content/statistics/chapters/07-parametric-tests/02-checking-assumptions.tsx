import type { Section } from "@brinnaebent/workbook";

const checkingAssumptions: Section = {
  id: "checking-assumptions",
  number: 2,
  title: "Checking the Assumptions",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Parametric tests</strong> are statistical tests that make specific assumptions about the population distribution. They have greater statistical power than nonparametric tests when assumptions hold — you need smaller samples to detect effects. The trade-off: they're only valid when the assumptions are met.</p>
<p>Three assumptions most parametric tests share:</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Assumption 1: Independence of Observations",
      html: `<p>Each observation must be independent of the others, both within and across groups. Check this by examining your data collection process:</p>
<ul>
<li>Did you measure the same subject multiple times? → Violation (use paired tests or repeated-measures designs).</li>
<li>Is your data time-ordered and likely autocorrelated? → Violation.</li>
<li>Are observations clustered (students within classrooms, patients within hospitals)? → Violation; may need hierarchical models.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Assumption 2: Normality",
      html: `<p>The data within each group should be approximately normally distributed. Three ways to check:</p>
<ul>
<li><strong>Visual:</strong> Histogram and Q-Q plot. A Q-Q plot where points fall near the diagonal indicates normality.</li>
<li><strong>Shapiro-Wilk test:</strong> Most widely used. Null: sample came from a normal distribution. Significant p → reject normality. Best for n up to a few thousand.</li>
<li><strong>Anderson-Darling test:</strong> More sensitive to tail deviations.</li>
</ul>
<p><strong>Practical note:</strong> With very large samples, even tiny departures from normality show as significant. With very small samples, the tests have low power. Always pair formal tests with visual inspection.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Assumption 3: Homogeneity of Variance",
      html: `<p>The groups being compared should have approximately equal variances. Check with <strong>Levene's test</strong>: the null is that variances are equal; a significant p-value means they're not.</p>
<p>If Levene's test is significant, switch to <strong>Welch's t-test</strong>, which doesn't assume equal variances. Many statisticians recommend defaulting to Welch's regardless — the cost of using it when variances are equal is small, but the cost of using Student's when they're not can be substantial.</p>`,
    },
    {
      type: "interactive",
      component: "AssumptionChecker",
      caption: "Placeholder: Upload or generate a dataset, and run Shapiro-Wilk and Levene's tests. View Q-Q plots and histogram overlays to visually assess normality.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch7-s2-q1",
      kind: "mc",
      question: "You run a Shapiro-Wilk test on each group in your dataset (n = 2,000 per group). Both return p < 0.001, suggesting non-normality. Before concluding the parametric test is invalid, what should you also check?",
      options: [
        {
          label: "Run a different normality test, since Shapiro-Wilk has low power",
          correct: false,
          explanation: "Shapiro-Wilk has good power. With n = 2,000, the issue is the opposite: high power. Other tests would show the same thing.",
        },
        {
          label: "With n = 2,000, Shapiro-Wilk will detect even trivial departures from normality. Inspect Q-Q plots visually — if the data is only slightly non-normal, the t-test may still be robust.",
          correct: true,
          explanation: "Correct. Formal normality tests become very sensitive at large sample sizes. A Q-Q plot is essential context — if the points fall nearly on the line with only minor deviations at the tails, the t-test is likely still valid. The Central Limit Theorem also helps: with large samples, the sampling distribution of the mean approaches normal regardless of the underlying distribution.",
        },
        {
          label: "Switch to a nonparametric test without further investigation",
          correct: false,
          explanation: "Switching without visual inspection may be overcautious. Nonparametric tests sacrifice statistical power compared to parametric ones when the data is close-to-normal. Inspect the Q-Q plot first.",
        },
        {
          label: "The p < 0.001 result proves the data is non-normal, so the t-test is definitely invalid",
          correct: false,
          explanation: "'Statistically significant departure from normality' at n = 2,000 doesn't mean 'practically relevant departure.' The effect may be negligible for purposes of the t-test. Statistical significance and practical significance differ here too.",
        },
      ],
    },
  ],
};

export default checkingAssumptions;
