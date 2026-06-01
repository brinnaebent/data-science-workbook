import type { Section } from "@brinnaebent/workbook";

const effectSize: Section = {
  id: "effect-size",
  number: 3,
  title: "Determining Effect Size",
  blocks: [
    {
      type: "text",
      html: `<p>The hardest part of a power analysis is the effect size. We usually set significance level and power to the defaults: α to 0.05 and power to 0.80. Effect size is the last remaining piece. Three common ways to estimate it:</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Method 1: Pilot Study",
      html: `<p>Run a small feasibility study first. Observe the effect size from the pilot, then use it to plan the full study. This is the most rigorous approach when you can afford it — you're grounding the power analysis in actual data from the real system.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Method 2: Literature Review",
      html: `<p>Find prior studies on closely related questions and use their reported effect sizes as your estimate. This is the most common source in academic research and genuinely useful in industry when similar work has been done before — competitor analyses, prior product experiments, published benchmarks.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Method 3: Cohen's Conventions",
      html: `<p>Jacob Cohen published widely used conventions for what counts as a small, medium, or large effect for various statistical tests. For comparing means, <strong>Cohen's d</strong> is the standard effect size measure:</p>
<ul>
<li><strong>Small:</strong> d ≈ 0.2</li>
<li><strong>Medium:</strong> d ≈ 0.5</li>
<li><strong>Large:</strong> d ≈ 0.8</li>
</ul>
<p>Cohen's d is computed as the difference in means divided by the pooled standard deviation. These should be treated as rough guidelines — a "small" effect in a high-stakes context can still be enormously important.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Effect Size ≠ Importance",
      html: `<p>A 0.01% improvement in CTR might be a "tiny" effect by Cohen's standards, but on a platform with 100 million users it could mean millions of dollars. Always interpret effect size in context — the statistical label "small" is not the same as "doesn't matter."</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch4-s3-q1",
      kind: "mc",
      question: "You're running a power analysis for an A/B test on a checkout flow change. You have no prior data. Which approach is most appropriate for estimating effect size?",
      options: [
        {
          label: "Assume a large effect size (d = 0.8) to minimize the required sample",
          correct: false,
          explanation: "Assuming a large effect size just to reduce sample requirements leads to underpowered studies when the actual effect is smaller. You'll miss the real effect and draw wrong conclusions.",
        },
        {
          label: "Run a small pilot (e.g., 5% of traffic) for a week, observe the effect, then use it for the full power analysis",
          correct: true,
          explanation: "Correct. A pilot study gives you a data-grounded effect size estimate from the actual system. With no prior data, this is far better than assuming an effect size from conventions that may not apply.",
        },
        {
          label: "Use a standard effect size from any published study",
          correct: false,
          explanation: "Using published effect sizes from unrelated domains can be very misleading. A checkout flow change for your specific product may have a very different effect size than a UI change studied in a different context.",
        },
        {
          label: "Skip the power analysis since you don't have prior data",
          correct: false,
          explanation: "Lacking prior data is exactly the situation a pilot study addresses. Skipping power analysis doesn't make the problem go away — it just means you won't know if your study is underpowered until it's too late.",
        },
      ],
    },
  ],
};

export default effectSize;
