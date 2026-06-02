import type { Section } from "@brinnaebent/workbook";

const studentTDistribution: Section = {
  id: "student-t-distribution",
  number: 4,
  title: "The Student's t-Distribution",
  blocks: [
    {
      type: "text",
      html: `<p>One more distribution needs introducing before we get to hypothesis testing: the <strong>Student's t-distribution</strong>. It looks like the normal but with heavier tails, and it's parameterized by <em>degrees of freedom</em> (related to sample size).</p>
<p>Why does it exist? Here's the situation: when you run a hypothesis test, you often need to know the standard deviation of a population — but you don't. You only have a sample standard deviation. And that sample standard deviation has its own uncertainty, especially when your sample is small. Estimating variance from a small sample is less reliable, and that extra uncertainty has to go somewhere.</p>
<p>The t-distribution accounts for it. Its heavier tails represent the increased probability of extreme values when your variance estimate is imprecise. When sample sizes are large (roughly n > 30), the t-distribution converges to the normal — the extra uncertainty becomes negligible. When samples are small, the heavier tails make your tests appropriately more conservative.</p>`,
    },
    {
      type: "interactive",
      component: "TDistributionExplorer",
      caption: "Adjust degrees of freedom and threshold to see how the t-distribution's heavier tails shrink toward the normal — and how much more tail probability a t-test assigns compared to a z-test at the same cutoff.",
      props: {},
    },
    {
      type: "callout",
      variant: "tip",
      title: "When to Use t vs. Normal",
      html: `<p>In practice: <strong>always use the t-distribution</strong> for tests about means unless you somehow know the population standard deviation (which you almost never do). For large samples, the t and normal give nearly identical results. For small samples, the t is more honest about uncertainty.</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch2-s4-q1",
      kind: "mc",
      question: "You're running a test with n=8 samples. You compute a test statistic and need to determine whether it's extreme enough to reject the null hypothesis. Should you compare it to the normal distribution or the t-distribution — and why?",
      options: [
        {
          label: "Normal, because the Central Limit Theorem applies to all sample sizes",
          correct: false,
          explanation: "The CLT says the sampling distribution of the mean approaches normal as n grows — it does NOT say it's already normal at n=8. With such a small sample, the normal approximation is poor.",
        },
        {
          label: "t-distribution, because with n=8 the sample standard deviation is an imprecise estimate of the population standard deviation",
          correct: true,
          explanation: "Correct. With only 8 observations, your sample standard deviation has substantial uncertainty. The t-distribution's heavier tails account for that — they make it harder to declare a result significant, which is the right call when you have limited data.",
        },
        {
          label: "Normal, because it's easier to use in practice",
          correct: false,
          explanation: "Both are easy to use in Python (scipy computes both). Ease of use is not a reason to accept a worse approximation. At n=8, using the normal gives overconfident p-values.",
        },
        {
          label: "t-distribution for any sample size, because it's always more conservative",
          correct: false,
          explanation: "This is close to correct as a practical heuristic, but the technical reason matters: you use the t-distribution when the population standard deviation is unknown (nearly always). The conservatism is appropriate when n is small and converges away at large n.",
        },
      ],
    },
  ],
};

export default studentTDistribution;
