import type { Section } from "@brinnaebent/workbook";

const postHocTests: Section = {
  id: "post-hoc-tests",
  number: 3,
  title: "Post Hoc Tests",
  blocks: [
    {
      type: "text",
      html: `<p>When ANOVA says "some group differs," post hoc tests tell you <em>which</em> groups differ — while controlling the family-wise error rate across all pairwise comparisons.</p>`,
    },
    {
      type: "text",
      html: `<h3><strong>Tukey's HSD (Honestly Significant Difference)</strong></h3>
<p>The most commonly used post hoc test. Compares all possible pairs of group means while controlling family-wise Type 1 error. Assumes equal variance and approximately normal data.</p>
<p><strong>How it works:</strong> Computes an HSD value based on the critical q value from the studentized range distribution. If a pairwise mean difference exceeds HSD, those groups are significantly different.</p>
<p><strong>In Python:</strong> <code>statsmodels.stats.multicomp.pairwise_tukeyhsd(values, groups)</code></p>
<p><strong>Default choice</strong> for post hoc testing after a significant ANOVA.</p>`,
    },
    {
      type: "interactive",
      component: "TukeyHSDExplorer",
      caption: "Adjust group means and spread to see how Tukey's HSD threshold responds. The bar chart shows each pairwise mean difference against the HSD cutoff — when the bar exceeds the marker, that pair is significant at α = 0.05.",
    },
    {
      type: "text",
      html: `<h3><strong>Other Options</strong></h3>
<ul>
<li><strong>Bonferroni-adjusted pairwise comparisons:</strong> Conduct pairwise t-tests and adjust the significance threshold to α/m, where m is the number of comparisons. Controls the family-wise error rate and is simple to apply, though it can be conservative when many comparisons are performed.</li>
<li><strong>Scheffé's test:</strong> Most conservative. Controls for all possible comparisons (not just pairwise), including complex contrasts. Use when you want to make comparisons you didn't pre-specify.</li>
<li><strong>Duncan's new multiple range test:</strong> Less conservative than Tukey's. More prone to Type 1 errors. Less commonly used today.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Example: Three Recommendation Algorithms",
      html: `<p>You're comparing user ratings for collaborative filtering, content-based filtering, and matrix factorization. ANOVA returns p = 0.012 — at least one algorithm differs. You run Tukey's HSD and find:</p>
<ul>
<li>Collaborative filtering vs. content-based: p = 0.021 (significant)</li>
<li>Collaborative filtering vs. matrix factorization: p = 0.008 (significant)</li>
<li>Content-based vs. matrix factorization: p = 0.42 (not significant)</li>
</ul>
<p>Conclusion: matrix factorization and content-based filtering are comparable to each other, but collaborative filtering differs from both.</p>`,
    },
    {
      type: "reflection",
      id: "stats-ch9-s3-reflect",
      question: "You're comparing five ML models on 10 benchmark datasets. You want to know if any models perform significantly differently. Walk through the full analysis plan: what test do you start with, what do you do if it's significant, and what corrections apply?",
      sampleAnswer: "Start with a one-way ANOVA with the five models as groups and performance on each dataset as the outcome. If ANOVA is significant (p ≤ α), run Tukey's HSD for pairwise comparisons — it controls family-wise error across all 10 pairwise comparisons (C(5,2) = 10). Note that performance across datasets might be correlated (same datasets for all models), which could call for a different design (repeated-measures ANOVA or Friedman test). Always report whether the ANOVA assumptions were checked — normality within groups, homogeneity of variance.",
    },
  ],
};

export default postHocTests;
