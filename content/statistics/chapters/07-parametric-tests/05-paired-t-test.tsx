import type { Section } from "@brinnaebent/workbook";

const pairedTTest: Section = {
  id: "paired-t-test",
  number: 5,
  title: "The Paired Samples t-Test",
  blocks: [
    {
      type: "callout",
      variant: "info",
      title: "The Paired Samples t-Test",
      html: `<p><strong>Question:</strong> Is there a significant difference between the means of two <em>related</em> measurements?</p>
<p><strong>Use it when:</strong> The same subjects are measured under two conditions (before/after, treatment/control on same subjects). Pairing controls for individual variability — this is where paired tests get their statistical power advantage over independent tests.</p>
<p><strong>Test statistic:</strong></p>
<p style="text-align:center">$$t = \\frac{\\bar{d} - \\mu_d}{s_d/\\sqrt{n}}$$</p>
<p>where $\bar{d}$ is the mean of paired differences, $\mu_d$ is 0 under the null, $s_d$ is the SD of the differences, and $n$ is the number of pairs.</p>
<p><strong>In Python:</strong> <code>scipy.stats.ttest_rel(before, after)</code></p>`,
    },
    {
      type: "text",
      html: `<p>The paired t-test shows up constantly in ML contexts, beyond the obvious before-and-after scenarios:</p>
<ul>
<li><strong>Model version comparison:</strong> Compare predictions from baseline vs. optimized model on the <em>same</em> test examples. Pair the errors per example, then test if the mean difference is significant.</li>
<li><strong>Algorithm comparison across datasets:</strong> Model A and B evaluated on the same 10 benchmark datasets. Pair the performance by dataset.</li>
<li><strong>Feature engineering evaluation:</strong> Same model trained with and without a feature, evaluated on the same test set. Pair by fold in cross-validation.</li>
</ul>
<p>The key insight: pairing removes between-subject variability from the error term. If different test folds vary a lot in difficulty, the paired test adjusts for that. An independent test wouldn't — it would treat all that fold variability as error, reducing power.</p>`,
    },
    {
      type: "interactive",
      component: "PairedVsIndependentExplorer",
      caption: "Placeholder: Compare the same dataset analyzed as paired vs. independent. See how the paired test has more power when individual variation is large.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch7-s5-q1",
      kind: "mc",
      question: "You compare two NLP models using 5-fold cross-validation on the same dataset. For each fold, you record Model A's F1 score and Model B's F1 score. Which test should you use to determine if one model is significantly better?",
      options: [
        {
          label: "Independent samples t-test, since each model produces independent scores",
          correct: false,
          explanation: "The scores aren't independent — both models were evaluated on the same fold data, so their scores are correlated through the shared evaluation data. A paired test is more appropriate.",
        },
        {
          label: "Paired t-test, since both models are evaluated on the same folds — the differences are paired",
          correct: true,
          explanation: "Correct. The 5 fold-level scores for each model are paired by fold. Using the differences removes fold difficulty as a confound, giving a more powerful and more appropriate test.",
        },
        {
          label: "Wilcoxon signed-rank test, since cross-validation scores are rarely normally distributed",
          correct: false,
          explanation: "The Wilcoxon signed-rank test is the nonparametric analog of the paired t-test and may be appropriate if normality assumptions are severely violated. But with only 5 folds, either approach should be interpreted cautiously — 5 data points is a very small sample for any test.",
        },
        {
          label: "One-sample t-test, comparing each model's mean F1 to 0.5",
          correct: false,
          explanation: "The question is about the difference between models, not whether either model beats a specific benchmark. A one-sample test doesn't address the comparison question.",
        },
      ],
    },
  ],
};

export default pairedTTest;
