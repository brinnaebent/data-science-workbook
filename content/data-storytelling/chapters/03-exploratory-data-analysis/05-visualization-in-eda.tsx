import type { Section } from "@brinnaebent/workbook";

const visualizationInEda: Section = {
  id: "visualization-in-eda",
  number: 5,
  title: "Visualization in EDA",
  blocks: [
    {
      type: "text",
      html: `<p>You'll plot things during EDA primarily for <em>yourself</em>, not for stakeholders. These are throwaway plots — they don't have to be pretty. The goal is to learn something quickly. Save the polish for your final report. (We cover communication visualizations in Chapter 4.)</p>`,
    },
    {
      type: "interactive",
      component: "EDAVizTour",
      caption: "The four core EDA plot types — histogram, box plot, scatter plot, and correlation heatmap — applied to a shared dataset.",
    },
    {
      type: "callout",
      variant: "info",
      title: "The EDA Visualization Toolkit",
      html: `<ul>
<li><strong>Histograms</strong> — distribution of a single continuous variable. Skewness, peaks, gaps, all visible at a glance.</li>
<li><strong>Box plots</strong> — spread and outliers compactly. Box = IQR, line = median, whiskers = non-outlier extremes, dots = flagged outliers. Great for comparing distributions across categories.</li>
<li><strong>Scatter plots</strong> — relationship between two continuous variables. The most direct way to see correlations, clusters, and nonlinear patterns.</li>
<li><strong>Pair plots</strong> — all pairwise scatter plots in a grid, histograms on the diagonal. Indispensable when you have a modest number of features and want to scan everything at once.</li>
<li><strong>Correlation heatmaps</strong> — color-coded correlation matrix. Faster to read than raw numbers; patterns jump out immediately.</li>
<li><strong>Bar charts by category</strong> — count or distribution broken out by a categorical variable. Quick way to spot imbalance.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Build Your 'First Plots' Routine",
      html: `<p>Every data scientist builds a small set of "first plots" they run on every new dataset. A useful default routine: shape → head → info → describe → pair plot (if fewer than ~10 features) → correlation heatmap → box plots per numerical feature → bar charts per categorical feature. It takes about ten minutes and tells you 80% of what you need to know before anything else. Build your own version and run it every time.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-eda-viz-q1",
      kind: "mc",
      question: "A histogram of your target variable has two distinct peaks. What is the most likely explanation, and what should you do?",
      options: [
        {
          label: "The distribution is bimodal — likely two distinct subgroups. Investigate what distinguishes them before modeling.",
          correct: true,
          explanation: "Correct. Bimodal distributions often indicate that two fundamentally different populations are mixed in the dataset — e.g., 'purchases by new users' and 'purchases by returning users.' A model trained on the mixture may perform poorly on either subgroup. Understanding the source of bimodality often leads to better feature engineering or separate models.",
        },
        {
          label: "The data is corrupted — a clean distribution should have a single peak.",
          correct: false,
          explanation: "Many real distributions are bimodal without any corruption: height in a mixed-sex population, commute times (peak before 9am and after 5pm), test scores in a class with two distinct preparation levels. Two peaks is informative, not a sign of corruption.",
        },
        {
          label: "Apply a log transform to collapse the two peaks into one.",
          correct: false,
          explanation: "A log transform addresses skewness — it won't merge two genuinely separate peaks and shouldn't try to. Collapsing a bimodal distribution with a transform would destroy the signal that the two groups exist.",
        },
      ],
    },
  ],
};

export default visualizationInEda;
