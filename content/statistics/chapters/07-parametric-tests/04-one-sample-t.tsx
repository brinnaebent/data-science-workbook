import type { Section } from "@brinnaebent/workbook";

const oneSampleT: Section = {
  id: "one-sample-t",
  number: 4,
  title: "The One-Sample t-Test",
  blocks: [
    {
      type: "text",
      html: `<h3>The One-Sample t-Test</h3>
<p><strong>Question:</strong> Is there a significant difference between the mean of your sample and a known benchmark?</p>
<p><strong>Use it when:</strong> You have one group and want to compare its mean to a fixed value.</p>
<p><strong>Hypotheses:</strong></p>
<ul><li>$H_0$: The sample mean equals the benchmark.</li><li>$H_1$: The sample mean differs from the benchmark.</li></ul>
<p><br><strong>Test statistic:</strong></p>
<p style="text-align:center">$$t = \\frac{\\bar{x} - \\mu}{s/\\sqrt{n}}$$</p>
<p>where $\\bar{x}$ is the sample mean, $\mu$ is the benchmark, $s$ is the sample standard deviation, and $n$ is the sample size.</p>
<p><strong>In Python:</strong> <code>scipy.stats.ttest_1samp(sample, popmean=benchmark)</code></p>`,
    },
    {
      type: "interactive",
      component: "OneSampleTTest",
      caption: "Enter sample statistics (mean, SD, n). Compute the t-statistic and p-value, and see where the statistic falls on the t-distribution.",
      props: {},
    },
  ],
};

export default oneSampleT;
