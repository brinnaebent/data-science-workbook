import type { Section } from "@brinnaebent/workbook";

const descriptiveStatistics: Section = {
  id: "descriptive-statistics-foundations",
  number: 3,
  title: "Descriptive Statistics",
  blocks: [
    {
      type: "text",
      html: `<p>Most of you have seen this material before. We're moving quickly, but let's get the vocabulary down in one place so we can build on it throughout the unit.</p>
<p><strong>Measures of central tendency</strong> answer: <em>what's typical?</em></p>
<ul>
<li><strong>Mean</strong> is the arithmetic average. Sensitive to outliers — one billionaire moves the average household income of a small town enormously.</li>
<li><strong>Median</strong> is the middle value when data is sorted. Robust to outliers — the billionaire doesn't change the median household income.</li>
<li><strong>Mode</strong> is the most frequently occurring value. The only measure of central tendency that makes sense for purely categorical data.</li>
</ul>
<p>When you have a skewed distribution — income, web session length, time-to-failure — the gap between mean and median tells you something. Mean substantially greater than median? Long right tail. Mean substantially less? Long left tail.</p>`,
    },
    {
      type: "text",
      html: `<p><strong>Measures of dispersion</strong> answer: <em>how spread out is the data?</em></p>
<ul>
<li><strong>Standard deviation</strong> is the average distance of data points from the mean. The workhorse measure of spread.</li>
<li><strong>Variance</strong> is the square of the standard deviation. Useful in statistical derivations.</li>
<li><strong>Range</strong> is maximum minus minimum. Dominated by extremes.</li>
<li><strong>Interquartile range (IQR)</strong> is Q3 − Q1. Captures the spread of the middle half of your data, robust to outliers — which is why box plots use it.</li>
</ul>
<p>A note on the formulas: the <strong>population standard deviation</strong> divides by N. The <strong>sample standard deviation</strong> divides by <em>n − 1</em>. That <em>n − 1</em> is Bessel's correction — it compensates for the systematic underestimation that happens when you use the sample mean instead of the true population mean.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The Empirical Rule",
      html: `<p>If your data is approximately normal, standard deviations have a concrete meaning:</p>
<ul>
<li><strong>±1σ:</strong> ~68% of data</li>
<li><strong>±2σ:</strong> ~95% of data</li>
<li><strong>±3σ:</strong> ~99.7% of data</li>
</ul>
<p>This is why "more than 3 standard deviations from the mean" is a common outlier threshold. In a normal distribution, under 0.3% of data should be out there. If you're seeing substantially more, investigate.</p>`,
    },
    {
      type: "text",
      html: `<p><strong>Measures of distribution shape</strong> describe asymmetry and tailedness.</p>
<ul>
<li><strong>Skewness</strong> measures asymmetry. Positive skewness = longer right tail (right-skewed). Negative = longer left tail. Symmetric distributions like the normal have skewness near zero.</li>
<li><strong>Kurtosis</strong> measures tailedness — how prone the distribution is to extreme values. Higher kurtosis = heavier tails = more outliers relative to a normal distribution.</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "DescriptiveStatsExplorer",
      caption: "Placeholder: Adjust a dataset's shape (skew, spread, outliers) and observe how mean, median, standard deviation, and IQR respond differently.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch1-s3-q1",
      kind: "mc",
      question: "You compute descriptive statistics on a salary dataset and find: mean = $95,000, median = $62,000, standard deviation = $85,000. What is the most likely explanation, and what should you do?",
      options: [
        {
          label: "The data has errors — the standard deviation can't be larger than the mean",
          correct: false,
          explanation: "Standard deviation can absolutely exceed the mean, especially for data bounded at zero with a long right tail. Salary data often looks exactly like this.",
        },
        {
          label: "The distribution is heavily right-skewed, likely driven by a small number of very high earners. Consider a log transform or report the median rather than the mean.",
          correct: true,
          explanation: "Correct. Mean >> median indicates a long right tail — classic for income data. The high standard deviation confirms extreme spread. The mean is being pulled up by a few outliers and is a poor measure of 'typical' salary. Reporting the median (or applying a log transform before modeling) is the right move.",
        },
        {
          label: "Use the mode instead, since mean and median disagree",
          correct: false,
          explanation: "Mode is most useful for categorical data or discrete counts. For continuous salary data, the mode isn't particularly informative, and the disagreement between mean and median is itself the useful signal — it tells you the distribution is skewed.",
        },
        {
          label: "Drop all salaries above $100,000 as outliers",
          correct: false,
          explanation: "Dropping high salaries arbitrarily removes real data. High earners are a genuine part of the population, not statistical errors. The right response to skew is to report or model it appropriately, not delete it.",
        },
      ],
    },
  ],
};

export default descriptiveStatistics;
