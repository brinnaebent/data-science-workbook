import type { Section } from "@brinnaebent/workbook";

const statisticalPower: Section = {
  id: "statistical-power",
  number: 2,
  title: "Statistical Power",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Statistical power</strong> is the probability that your study will detect an effect when there really is an effect to detect. Formally: power = 1 − β, where β is the probability of a Type 2 error.</p>
<p>If your study is <em>underpowered</em>, you may very well miss real effects — and worse, you may ship the conclusion that there's no effect when there is one. An underpowered study isn't just inconclusive; it's actively misleading.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The Four Interlocking Components",
      html: `<p>Power analysis sits on four numbers that are all interconnected. Specify any three, and the fourth is determined:</p>
<ol>
<li><strong>Effect size</strong> — the magnitude of the difference you're trying to detect.</li>
<li><strong>Sample size</strong> — the number of observations.</li>
<li><strong>Significance level (α)</strong> — the probability of a Type 1 error (usually 0.05).</li>
<li><strong>Power (1 − β)</strong> — the probability of avoiding a Type 2 error (usually 0.80).</li>
</ol>
<p>The most common scenario: specify effect size, α, and power → solve for minimum sample size.</p>`,
    },
    {
      type: "text",
      html: `<p>Power gets higher when:</p>
<ul>
<li><strong>Sample size increases.</strong> More data = more power. This is usually your main lever.</li>
<li><strong>Effect size is larger.</strong> Big effects are easier to detect.</li>
</ul>
<p>Power gets lower when:</p>
<ul>
<li><strong>The significance threshold becomes stricter.</strong> Moving from α = 0.05 to α = 0.01 makes it harder to clear the bar.</li>
<li><strong>Variability in the data increases.</strong> Noisy data masks signal.</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "PowerAnalysisExplorer",
      caption: "Placeholder: Adjust effect size, sample size, and α, and watch power update in real time. Shows the two-distribution visualization of null and alternative hypotheses overlapping.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch4-s2-q1",
      kind: "mc",
      question: "A study has 80% power at α = 0.05 to detect an effect of size d = 0.5. A researcher decides to use a stricter significance threshold of α = 0.01. All else equal, what happens to power?",
      options: [
        {
          label: "Power increases, because a stricter threshold makes findings more reliable",
          correct: false,
          explanation: "A stricter threshold makes findings more reliable when they occur — but it also makes it harder to detect effects at all. Power decreases.",
        },
        {
          label: "Power stays the same, because power only depends on effect size and sample size",
          correct: false,
          explanation: "All four components are interconnected. Changing α shifts the critical value, which changes how often the test statistic falls in the rejection region under the alternative. Power decreases when α decreases.",
        },
        {
          label: "Power decreases, because moving to a stricter threshold requires the test statistic to be more extreme to reject the null",
          correct: true,
          explanation: "Correct. With a stricter α, the critical value moves further into the tail of the null distribution. The test statistic needs to be more extreme to reject. This means some true effects that would have been detected at α = 0.05 won't be detected at α = 0.01. Power drops.",
        },
        {
          label: "The effect on power depends on the effect size",
          correct: false,
          explanation: "The direction of the effect is deterministic: stricter α always reduces power, all else equal. Effect size determines the magnitude of that power, but doesn't change the direction of the relationship.",
        },
      ],
    },
  ],
};

export default statisticalPower;
