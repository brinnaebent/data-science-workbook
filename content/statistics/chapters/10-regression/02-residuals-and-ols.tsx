import type { Section } from "@brinnaebent/workbook";

const residualsAndOLS: Section = {
  id: "residuals-and-ols",
  number: 2,
  title: "Residuals and Ordinary Least Squares",
  blocks: [
    {
      type: "text",
      html: `<p>Imagine plotting house prices against the number of cats in the neighborhood. You'd see something like the chart in the workbook: dots scattered with no discernible pattern. Cats tell you nothing about prices.</p>
<p>Now draw any line through that scatter. For each house, the <strong>residual</strong> is the vertical distance between the actual price (the dot) and the line's prediction. Points above the line have positive residuals — the model underpredicted. Points below have negative — the model overpredicted. A residual of zero means the prediction was exactly right.</p>
<p>Residuals measure prediction error. The line is your model; the residuals are everywhere it's wrong.</p>`,
    },
    {
      type: "text",
      html: `<p>Here's the problem with simply summing residuals: for any line that passes through the mean of the data (which all OLS lines do), the positive and negative residuals cancel perfectly. The sum is always zero — for a terrible line and an excellent one alike. Zero tells you nothing.</p>
<p>To solve this, let's <strong>square each residual</strong> before summing. Squaring does two things. First, it makes everything positive — no more cancellation. Second, it penalizes large errors more than small ones: a residual of 100k contributes 10 billion to the sum, while a residual of 10k contributes only 100 million. The line "cares" more about the houses it gets badly wrong.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Ordinary Least Squares",
      html: `<p>The <strong>sum of squared errors (SSE)</strong> — or sum of squared residuals — is our measure of total model error:</p>
<p style="text-align:center">$$\\text{SSE} = \\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2$$</p>
<p>where $y_i$ is the actual price of house $i$ and $\\hat{y}_i$ is the line's prediction. <strong>Ordinary least squares (OLS)</strong> finds the line that minimizes SSE. Calculus gives a closed-form solution; no iteration required. In Python, <code>sklearn.linear_model.LinearRegression</code> and <code>statsmodels.api.OLS</code> both solve it directly.</p>`,
    },
    {
      type: "interactive",
      component: "ResidualsExplorer",
      caption: "Drag the line and watch the residuals (vertical bars) and SSE update in real time. Try: start with cats as the predictor — can you beat the OLS line? Then switch to bedrooms and see how much tighter the OLS solution is.",
      props: {},
    },
    {
      type: "text",
      html: `<p>Notice what happened when you switched from cats to bedrooms: the OLS line's SSE dropped substantially. The residuals are smaller and more symmetric. This is a better-fitting model — not because we tried harder, but because bedrooms actually carry information about price. Cats don't.</p>
<p>That's the intuition behind model quality: a predictor is useful if it reduces SSE compared to knowing nothing (a flat line at the mean). If it doesn't, adding it to your model is noise.</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch10-s2-q1",
      kind: "mc",
      question: "You draw two lines through the same house-price scatter plot. Line A has a raw sum of residuals of 0. Line B has a sum of squared residuals of 0. Which line fits the data better?",
      options: [
        {
          label: "Line A — residuals sum to zero, so it must be centered correctly",
          correct: false,
          explanation: "Any line that passes through the mean of the data will have residuals summing to zero — including terrible fits. A sum of zero is guaranteed by construction, not by fit quality.",
        },
        {
          label: "Line B — a sum of squared residuals of zero means every prediction is exact",
          correct: true,
          explanation: "Correct. The only way SSE = 0 is if every single residual is zero — meaning the line passes through every data point exactly. This is perfect fit (or the data is perfectly collinear). Line A's sum-of-residuals = 0 is uninformative.",
        },
        {
          label: "They're equivalent — both sums being zero means the same thing",
          correct: false,
          explanation: "They're not equivalent. Sum of raw residuals = 0 is a property of any line through the mean. Sum of squared residuals = 0 requires perfect prediction of every point. These are very different conditions.",
        },
        {
          label: "You can't compare lines without knowing their slopes",
          correct: false,
          explanation: "You can compare fit quality directly via SSE. A smaller SSE means better fit, regardless of slope.",
        },
      ],
    },
  ],
};

export default residualsAndOLS;
