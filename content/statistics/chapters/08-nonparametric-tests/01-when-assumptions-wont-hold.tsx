import type { Section } from "@brinnaebent/workbook";

const whenAssumptionsWontHold: Section = {
  id: "when-assumptions-wont-hold",
  number: 1,
  title: "When the Assumptions Won't Hold",
  blocks: [
    {
      type: "text",
      html: `<p>Real-world data is messy. Heavy tails, skew, contamination by outliers, sample sizes too small to reliably check normality — all of this is the norm, not the exception.</p>
<p><strong>Nonparametric tests</strong> don't require assumptions about the underlying distribution. Their power is generally lower than parametric tests when parametric assumptions hold — but they're robust when those assumptions don't. Often, a nonparametric test is the responsible choice.</p>`,
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
