import type { Section } from "@brinnaebent/workbook";

const zScores: Section = {
  id: "z-scores",
  number: 3,
  title: "Z-Scores",
  blocks: [
    {
      type: "text",
      html: `<h3>Z-score</h3>
<p>The z-score represents the number of standard deviations a data point is from the mean of its distribution:</p>
<p style="text-align:center">$$z = \\frac{x - \\mu}{\\sigma}$$</p>
<p>A positive z-score means the point is above the mean; negative means below. A z-score of zero means exactly at the mean. Z-scores assume your data is normally distributed and are sensitive to outliers (which inflate $\sigma$, deflating everything's z-score).</p>
<p>When the assumptions hold, z-scores enable probability statements: a z-score of 2 corresponds to roughly the 97.5th percentile in a standard normal distribution.</p>`,
    },
    {
      type: "interactive",
      component: "ZScoreExplorer",
      caption: "Adjust x to see the z-score.",
    },
  ],
};

export default zScores;
