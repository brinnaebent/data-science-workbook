import type { Section } from "@brinnaebent/workbook";

const multipleComparisons: Section = {
  id: "multiple-comparisons",
  number: 6,
  title: "The Multiple Comparisons Problem",
  blocks: [
    {
      type: "text",
      html: `<p>When you run multiple hypothesis tests, the risk of at least one false positive grows fast. Each individual test with α = 0.05 has a 5% chance of a false positive. Run 20 independent tests and you have roughly a 64% chance of at least one false positive — even when no real effects exist.</p>
<p>This is the <strong>multiple comparisons problem</strong>, and you'll bump into it constantly:</p>
<ul>
<li>Comparing each variant in a 10-arm A/B test against the control.</li>
<li>Testing whether each of 50 features is significantly associated with churn.</li>
<li>Comparing model performance across many cross-validation folds.</li>
<li>Running the same experiment in multiple geographic segments.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Bonferroni Correction",
      html: `<p>The simplest and most conservative fix. Divide your significance threshold by the number of tests:</p>
<p style="text-align:center">$$\\alpha_{adjusted} = \\frac{\\alpha}{m}$$</p>
<p>where <em>m</em> is the number of hypotheses being tested. If you're running 5 tests with α = 0.05, each individual test must clear 0.05/5 = 0.01.</p>
<p><strong>Trade-off:</strong> Bonferroni reduces power — by raising the bar, you'll miss more real effects. It's conservative by design. For very large numbers of tests, consider the Benjamini-Hochberg procedure instead, which controls the <em>false discovery rate</em> rather than the <em>family-wise error rate</em>.</p>`,
    },
    {
      type: "interactive",
      component: "MultipleComparisonsExplorer",
      caption: "Placeholder: Set the number of tests and significance threshold, and watch the family-wise error rate climb. See how Bonferroni correction restores it to the nominal level.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch3-s6-q1",
      kind: "mc",
      question: "You're running an A/B/C/D/E test — five variants against a control (six arms total). You want to control your family-wise error rate at α = 0.05. What threshold should each individual pairwise comparison use with Bonferroni correction?",
      options: [
        {
          label: "0.05 — Bonferroni correction only applies when you're using more than 10 tests",
          correct: false,
          explanation: "Bonferroni applies whenever you run multiple tests. There's no 'minimum number of tests' threshold.",
        },
        {
          label: "0.01 — divide by 5 variants",
          correct: false,
          explanation: "The number of comparisons matters, not the number of variants. With 5 variants vs. control, you're making 5 pairwise comparisons (each variant vs. control), so the Bonferroni threshold is 0.05/5 = 0.01. But if you also compare all variants against each other, the number of comparisons grows.",
        },
        {
          label: "0.01 — divide α by the number of pairwise comparisons (5 variant vs. control comparisons)",
          correct: true,
          explanation: "Correct. If each of the 5 variants is compared only against the control (not against each other), you have 5 tests. Bonferroni gives α_adjusted = 0.05/5 = 0.01. If you also compared all variant pairs, you'd have C(5,2) + 5 = 15 comparisons, giving 0.05/15 ≈ 0.0033.",
        },
        {
          label: "0.025 — divide by 2 since you have a two-tailed test",
          correct: false,
          explanation: "The two-tailed adjustment is already incorporated when you select your critical value or use a two-tailed p-value. Bonferroni correction is about the number of separate tests being run, not about the directionality of each test.",
        },
      ],
    },
  ],
};

export default multipleComparisons;
