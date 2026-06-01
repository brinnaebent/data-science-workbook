import type { Section } from "@brinnaebent/workbook";

const continuousDistributions: Section = {
  id: "continuous-distributions",
  number: 3,
  title: "Continuous Distributions",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Continuous distributions</strong> describe outcomes that can take any value within a range — heights, weights, latencies, prices. The outcome isn't restricted to whole numbers; it can be 4.7, 4.71, 4.712, and so on.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Normal (Gaussian) Distribution",
      html: `<p>Symmetric, bell-shaped, characterized by mean $\mu$ and standard deviation $\sigma$. The most important distribution in statistics, for two reasons:</p>
<ol>
<li><strong>The Central Limit Theorem:</strong> The distribution of sample means approaches normal as sample size grows, regardless of the underlying distribution. This is why so many statistical tests assume normality — in the limit, it's valid even when the raw data isn't normal.</li>
<li><strong>Natural prevalence:</strong> Heights, measurement errors, sums of many small independent effects — these all tend toward normal in practice.</li>
</ol>
<p><strong>When it shows up:</strong> Test scores. Measurement error. Model residuals (when assumptions hold). Many parametric statistical tests assume normal data.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Uniform Distribution",
      html: `<p>Equal probability for all values within a specified range [a, b]. The flattest distribution — no value is more likely than any other.</p>
<p><strong>When it shows up:</strong> Random number generation. A/B test bucketing. Monte Carlo simulation. Any situation where you have no reason to prefer one value over another.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Exponential Distribution",
      html: `<p>Models the time between events in a Poisson process. Single parameter: the rate $\lambda$ (higher rate = shorter typical waiting time). It has the <em>memoryless property</em>: knowing that you've already waited 5 minutes tells you nothing about how much longer you'll wait.</p>
<p><strong>When it shows up:</strong> Time between bus arrivals. Time until a customer churns. Time to component failure. Survival analysis. Any "how long until the next event?" question where events arrive at a steady rate.</p>`,
    },
    {
      type: "interactive",
      component: "ContinuousDistributionExplorer",
      caption: "Toggle between Normal, Uniform, and Exponential. Adjust parameters with the sliders and switch between the PDF and CDF views to see how each distribution's shape and cumulative probability change.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch2-s3-q1",
      kind: "mc",
      question: "You're predicting 'time until a user churns' for a subscription service. Users who haven't churned after 6 months don't seem meaningfully less likely to churn next month than users who just signed up. Which distribution best describes this outcome?",
      options: [
        {
          label: "Normal",
          correct: false,
          explanation: "Normal is symmetric and unbounded in both directions — it doesn't naturally model time-to-event data, which is positive and often skewed. The memoryless property described here points elsewhere.",
        },
        {
          label: "Binomial",
          correct: false,
          explanation: "Binomial models counts of successes in discrete trials, not time-to-event. Churn time is continuous.",
        },
        {
          label: "Exponential",
          correct: true,
          explanation: "Correct. The exponential distribution is specifically designed for time-to-event data where the 'memoryless property' holds — knowing how long something has survived tells you nothing about how much longer it will last. That's exactly the scenario described.",
        },
        {
          label: "Uniform",
          correct: false,
          explanation: "Uniform assigns equal probability to all values in a range, which would mean a user is equally likely to churn at month 1 as at month 24. That's not how churn works — most churn happens earlier.",
        },
      ],
    },
  ],
};

export default continuousDistributions;
