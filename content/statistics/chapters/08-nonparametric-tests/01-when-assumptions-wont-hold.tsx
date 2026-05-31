import type { Section } from "@brinnaebent/workbook";

const whenAssumptionsWontHold: Section = {
  id: "when-assumptions-wont-hold",
  number: 1,
  title: "When the Assumptions Won't Hold",
  blocks: [
    {
      type: "text",
      html: `<p>Real-world data is messy. Heavy tails, skew, contamination by outliers, sample sizes too small to reliably check normality — all of this is the norm, not the exception. If you walked away from the parametric chapter thinking "most of my data isn't normal and may have outliers," you're not alone.</p>
<p><strong>Nonparametric tests</strong> don't require assumptions about the underlying distribution. Their power is generally lower than parametric tests when parametric assumptions hold — but they're robust when those assumptions don't. Often, a nonparametric test is the responsible choice.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Learning Objectives",
      html: `<p>By the end of this chapter, you'll be able to:</p>
<ol>
<li>Distinguish nonparametric from parametric tests and identify when each is appropriate.</li>
<li>Apply the Wilcoxon signed-rank test as a nonparametric paired test.</li>
<li>Apply the Mann-Whitney U test as a nonparametric independent-samples test.</li>
<li>Apply the chi-square test for categorical data.</li>
<li>Use the two-group test decision tree to choose the right test.</li>
</ol>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Nonparametric Tests Work on Ranks",
      html: `<p>Most nonparametric tests work by converting data to <em>ranks</em> — the 1st, 2nd, 3rd largest value — rather than operating on the raw values. This makes them robust to outliers and non-normality, since a single extreme value only contributes rank 1 (or rank n), not its actual magnitude.</p>`,
    },
  ],
};

export default whenAssumptionsWontHold;
