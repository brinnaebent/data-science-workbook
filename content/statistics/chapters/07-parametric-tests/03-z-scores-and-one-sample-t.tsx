import type { Section } from "@brinnaebent/workbook";

const zScoresAndOneSampleT: Section = {
  id: "z-scores-and-one-sample-t",
  number: 3,
  title: "Z-Scores and the One-Sample t-Test",
  blocks: [
    {
      type: "text",
      html: `<p>Before the t-tests, one foundational concept: the <strong>z-score</strong>.</p>
<p>The z-score represents the number of standard deviations a data point is from the mean of its distribution:</p>
<p style="text-align:center">$$z = \\frac{x - \\mu}{\\sigma}$$</p>
<p>A positive z-score means the point is above the mean; negative means below. A z-score of zero means exactly at the mean. Z-scores assume your data is normally distributed and are sensitive to outliers (which inflate $\sigma$, deflating everything's z-score).</p>
<p>When the assumptions hold, z-scores enable probability statements: a z-score of 2 corresponds to roughly the 97.5th percentile in a standard normal distribution.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The One-Sample t-Test",
      html: `<p><strong>Question:</strong> Is there a significant difference between the mean of your sample and a known benchmark?</p>
<p><strong>Use it when:</strong> You have one group and want to compare its mean to a fixed value.</p>
<p><strong>Hypotheses:</strong></p>
<ul><li>$H_0$: The sample mean equals the benchmark.</li><li>$H_1$: The sample mean differs from the benchmark.</li></ul>
<p><strong>Test statistic:</strong></p>
<p style="text-align:center">$$t = \\frac{\\bar{x} - \\mu}{s/\\sqrt{n}}$$</p>
<p>where $\bar{x}$ is the sample mean, $\mu$ is the benchmark, $s$ is the sample standard deviation, and $n$ is the sample size.</p>
<p><strong>In Python:</strong> <code>scipy.stats.ttest_1samp(sample, popmean=benchmark)</code></p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Worked Example: Recommendation System Ratings",
      html: `<p>The current system has an average user rating of 4.5 stars. You've deployed a new algorithm and want to know if its average rating differs significantly.</p>
<ul>
<li>$H_0$: New algorithm average = 4.5</li>
<li>$H_1$: New algorithm average ≠ 4.5</li>
</ul>
<p>Sample of 100 users: mean = 4.7, SD = 0.3.</p>
<p>$$t = \\frac{4.7 - 4.5}{0.3/\\sqrt{100}} = \\frac{0.2}{0.03} \\approx 6.67$$</p>
<p>With df = 99 and α = 0.05, the critical t ≈ 1.98. Your t = 6.67 far exceeds this. Reject the null — the new algorithm produces significantly different ratings.</p>`,
    },
    {
      type: "interactive",
      component: "OneSampleTTest",
      caption: "Placeholder: Enter sample statistics (mean, SD, n) and a benchmark. Compute the t-statistic and p-value, and see where the statistic falls on the t-distribution.",
      props: {},
    },
  ],
};

export default zScoresAndOneSampleT;
