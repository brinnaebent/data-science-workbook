import type { Section } from "@brinnaebent/workbook";

const residualsAndOLS: Section = {
  id: "residuals-and-ols",
  number: 2,
  title: "Residuals and Ordinary Least Squares",
  blocks: [
    {
      type: "text",
      html: `<p>Start with any line drawn through a scatter plot. For each data point, the <strong>residual</strong> is the vertical distance between the point and the line. Points above the line have positive residuals; below have negative. If a point lies exactly on the line, the residual is zero.</p>
<p>A residual is the <em>error</em> of the line's prediction: the line predicts a value, the data shows the actual value, and the residual is the difference.</p>
<p>If you sum all residuals for a well-fit line, you get zero — the positive and negative residuals cancel. But "sums to zero" isn't useful. A terrible line could still have residuals that sum to zero. We need a measure of total error that doesn't cancel.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Ordinary Least Squares",
      html: `<p>The solution: <strong>square</strong> the residuals before summing them. Squaring does two things:</p>
<ol>
<li>Makes everything positive — negatives don't cancel positives.</li>
<li>Emphasizes large deviations. A residual of 10 contributes 100 to the sum; a residual of 2 contributes only 4. The line "cares" more about points it's far from.</li>
</ol>
<p>The <strong>sum of squared residuals (SSE)</strong> measures total model error. <strong>Ordinary least squares (OLS)</strong> finds the line that minimizes SSE. Calculus gives us the exact solution; Python computes it directly.</p>`,
    },
    {
      type: "interactive",
      component: "ResidualsExplorer",
      caption: "Placeholder: Drag a regression line and see the residuals update in real time. Observe how the SSE changes as the line moves toward and away from the OLS solution.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch10-s2-q1",
      kind: "mc",
      question: "Why does OLS minimize the sum of *squared* residuals rather than just the sum of residuals?",
      options: [
        {
          label: "Squared residuals are easier to compute",
          correct: false,
          explanation: "Squaring is slightly more computation, not less. This isn't the reason.",
        },
        {
          label: "Because the sum of raw residuals is always zero for any line, making it useless as a loss function",
          correct: true,
          explanation: "Correct. For any line where the mean is on the line (which OLS guarantees), positive and negative residuals cancel exactly. Squaring prevents this cancellation and creates a meaningful error measure that OLS can minimize.",
        },
        {
          label: "To penalize outliers equally regardless of direction",
          correct: false,
          explanation: "Squaring penalizes large residuals more heavily regardless of direction — it doesn't treat both directions equally, it makes the loss function symmetric. But the core reason for squaring is to prevent cancellation of positive and negative residuals.",
        },
        {
          label: "Squared residuals satisfy normality assumptions",
          correct: false,
          explanation: "OLS doesn't assume residuals are normally distributed — that's a separate assumption about the residuals of the fitted model, not a reason for squaring.",
        },
      ],
    },
  ],
};

export default residualsAndOLS;
