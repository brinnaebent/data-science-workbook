import type { Section } from "@brinnaebent/workbook";

const beyondTwoGroups: Section = {
  id: "beyond-two-groups",
  number: 1,
  title: "Beyond Two Groups",
  blocks: [
    {
      type: "text",
      html: `<p>You've seen t-tests for comparing two groups. Inevitably, you'll want to compare three or more. You might be wondering: can't I just run a t-test between every pair of groups?</p>
<p>You can. You absolutely should not. Run a t-test between every pair of, say, five groups, and you've run ten tests. Multiple comparisons problem. False positives compound rapidly. With ten tests at α = 0.05, you have roughly a 40% chance of at least one false positive even when no real differences exist.</p>
<p><strong>ANOVA</strong> — Analysis of Variance — lets you ask "are any of these groups different from each other?" with a single test, while controlling Type 1 error appropriately.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Learning Objectives",
      html: `<p>By the end of this chapter, you'll be able to:</p>
<ol>
<li>Explain why ANOVA is preferred over multiple t-tests for three or more groups.</li>
<li>Understand the logic of partitioning variability (SST, SSB, SSW).</li>
<li>Interpret the F-statistic.</li>
<li>Identify ANOVA's assumptions.</li>
<li>Apply a post hoc test (Tukey's HSD) to identify which group pairs differ.</li>
</ol>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "ANOVA Tells You 'Some Group Differs' — Not Which One",
      html: `<p>The alternative hypothesis in ANOVA is: "at least one group mean is significantly different from the others." When you reject the null, you know <em>something</em> is different — not <em>what</em>. You need post hoc tests for that, and they're covered at the end of this chapter.</p>`,
    },
  ],
};

export default beyondTwoGroups;
