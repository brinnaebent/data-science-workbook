import type { Section } from "@brinnaebent/workbook";

const descriptiveStatistics: Section = {
  id: "descriptive-statistics",
  number: 2,
  title: "Descriptive Statistics",
  blocks: [
    {
      type: "text",
      html: `<p>Descriptive statistics give you a compact numeric summary of each variable. Three kinds matter — and each one has downstream modeling implications, not just reporting value.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Central Tendency",
      html: `<p><strong>Mean, median, mode.</strong> What's "typical"?</p>
<ul>
<li>The <strong>mean</strong> is the arithmetic average — sensitive to outliers.</li>
<li>The <strong>median</strong> is the middle value when data is sorted — robust to outliers.</li>
<li>The <strong>mode</strong> is the most common value — most useful for categorical data.</li>
</ul>
<p>When the mean and median are close, the distribution is roughly symmetric. When they're far apart, the distribution is skewed — a single outlier can pull the mean far from where most of the data lives. If you report only the mean on skewed data, you're misleading yourself and your audience.</p>`,
    },
    {
      type: "text",
      html: `<p><strong>Dispersion</strong> tells you how spread out the data is. High standard deviation means data is variable; low means it's tightly clustered. A feature with <strong>zero variance</strong> gives the model nothing to work with — it's a constant and should be dropped. The <strong>IQR</strong> (Q3 − Q1) captures the middle 50% of observations and is robust to extreme values, making it a useful complement to standard deviation for skewed data.</p>
<p><strong>Distribution shape</strong> is captured by skewness and kurtosis. Positive skewness means a long right tail (think income distributions); negative means a long left tail. <strong>Kurtosis</strong> measures tailedness — high kurtosis means extreme values are more common than a normal distribution would predict. These matter for modeling: many ML algorithms assume approximate normality. Heavy skew often signals that a log transform is needed before fitting.</p>`,
    },
    {
      type: "interactive",
      component: "DistributionExplorer",
      caption: "Distribution explorer — adjust skewness and kurtosis sliders and see how mean vs. median diverge.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "ds-eda-descriptive-q1",
      kind: "mc",
      question: "A feature has mean = $85,000 and median = $52,000. What does this tell you — and what should you do before using this feature in a model?",
      options: [
        {
          label: "The distribution is right-skewed (long right tail). Consider a log transform before modeling.",
          correct: true,
          explanation: "Correct. When the mean is much larger than the median, extreme high values are pulling the mean up — classic right skew (like income). A log transform compresses the large values and pulls the distribution toward normality, which many models assume. Skipping this step can cause the model to be dominated by outliers.",
        },
        {
          label: "The data contains errors — mean and median should be close in a clean dataset.",
          correct: false,
          explanation: "Mean and median being far apart is normal for skewed distributions — it's not a sign of errors. Income, house prices, city populations, and many other real-world quantities are naturally right-skewed. The gap is informative, not suspicious.",
        },
        {
          label: "Use the median instead of the mean as the feature value for all rows.",
          correct: false,
          explanation: "Replacing every row's actual value with the median throws away all the variation in the feature — which is exactly the information the model would use. The median is useful as a summary statistic or for imputation, not as a replacement for the actual data.",
        },
      ],
    },
  ],
};

export default descriptiveStatistics;
