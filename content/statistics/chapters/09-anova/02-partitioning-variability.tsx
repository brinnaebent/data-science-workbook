import type { Section } from "@brinnaebent/workbook";

const partitioningVariability: Section = {
  id: "partitioning-variability",
  number: 2,
  title: "The Logic: Partitioning Variability",
  blocks: [
    {
      type: "text",
      html: `<p>The key insight behind ANOVA is that total variability in your data can be split into two parts:</p>
<ul>
<li><strong>Variability between groups</strong> — how much do the group means differ from the overall mean?</li>
<li><strong>Variability within groups</strong> — how much do individual observations vary from their own group mean?</li>
</ul>
<p>If between-group variability is large compared to within-group variability, that's evidence the groups really differ. If between-group variability is small relative to within-group, you can't distinguish group differences from random noise.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Three Sums of Squares",
      html: `<p><strong>Sum of Squares Total (SST):</strong> Total variability around the grand mean.</p>
<p style="text-align:center">$$\\text{SST} = \\sum_{i=1}^{n}(y_i - \\bar{y})^2$$</p>
<p><strong>Sum of Squares Between (SSB):</strong> Variability of group means around the grand mean.</p>
<p style="text-align:center">$$\\text{SSB} = \\sum_{j=1}^{k} n_j(\\bar{y}_j - \\bar{y})^2$$</p>
<p><strong>Sum of Squares Within (SSW):</strong> Variability within each group around its own mean.</p>
<p style="text-align:center">$$\\text{SSW} = \\sum_{j=1}^{k}\\sum_{i=1}^{n_j}(y_{ij} - \\bar{y}_j)^2$$</p>
<p>These three quantities satisfy: <strong>SST = SSB + SSW</strong>.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The F-Statistic",
      html: `<p>The F-statistic compares between-group and within-group variability, normalized by degrees of freedom:</p>
<p style="text-align:center">$$F = \\frac{\\text{SSB}/(k-1)}{\\text{SSW}/(n-k)}$$</p>
<p>A large F means between-group variability dominates within-group variability — evidence against the null. If p ≤ α, reject the null: at least one group mean differs.</p>
<p><strong>In Python:</strong> <code>scipy.stats.f_oneway(group1, group2, group3, ...)</code></p>`,
    },
    {
      type: "interactive",
      component: "ANOVAVariancePartitioner",
      caption: "Placeholder: Adjust the means and spreads of three groups. See SSB, SSW, and the F-statistic update in real time. Observe how group separation relative to within-group spread determines F.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch9-s2-q1",
      kind: "mc",
      question: "You run a one-way ANOVA comparing three ML models on the same metric and get F = 0.8, p = 0.46. What can you conclude?",
      options: [
        {
          label: "All three models have identical performance",
          correct: false,
          explanation: "Failing to reject the null doesn't prove the models are identical — it means you lack evidence of a significant difference. The effect may be real but too small to detect with your sample size.",
        },
        {
          label: "You fail to reject the null — there is no statistically significant evidence that any model performs differently from the others",
          correct: true,
          explanation: "Correct. p = 0.46 is far above any conventional α threshold. You cannot conclude any model differs significantly. This could be because there truly is no difference, or because your study was underpowered to detect the real difference.",
        },
        {
          label: "At least one model is significantly better",
          correct: false,
          explanation: "This would require p ≤ α. With p = 0.46, you have no grounds for this conclusion.",
        },
        {
          label: "Run post hoc tests to identify which models differ",
          correct: false,
          explanation: "Post hoc tests are only appropriate after a significant ANOVA result. Running them when ANOVA fails to reject the null inflates your Type 1 error rate — you'd be fishing for significance.",
        },
      ],
    },
  ],
};

export default partitioningVariability;
