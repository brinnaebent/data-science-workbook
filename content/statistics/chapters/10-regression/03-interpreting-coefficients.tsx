import type { Section } from "@brinnaebent/workbook";

const interpretingCoefficients: Section = {
  id: "interpreting-regression-coefficients",
  number: 3,
  title: "Interpreting Regression Coefficients",
  blocks: [
    {
      type: "text",
      html: `<p>Now swap the useless ID predictor for something meaningful: average cigarettes consumed per adult per day. Plot CHD mortality against smoking rate — a linear relationship appears. Run OLS and get:</p>
<p style="text-align:center">$$y = 0.25 + 2.41x$$</p>
<p>This matches the y = mx + b form from algebra:</p>
<ul>
<li><em>y</em> is the <strong>dependent variable</strong> (outcome, response, target): CHD mortality.</li>
<li><em>x</em> is the <strong>independent variable</strong> (predictor, regressor): average cigarettes per adult per day.</li>
<li>0.25 is the <strong>intercept</strong> ($\beta_0$): the predicted value of y when x = 0.</li>
<li>2.41 is the <strong>slope</strong> ($\beta_1$): the change in y per one-unit increase in x.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Interpretation Practice",
      html: `<p><strong>What does $\beta_1$ = 2.41 mean?</strong><br>For each additional cigarette per adult per day, CHD mortality is expected to increase by 2.41 units.</p>
<p><strong>If a ninth country had x = 20 (average 20 cigarettes per adult per day), what would we predict for its CHD mortality?</strong><br>y = 0.25 + 2.41(20) = 48.45 ≈ 48.</p>
<p>That's regression as prediction: feed in x, get an estimated y.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Correlation ≠ Causation — and the Intercept Can Be Meaningless",
      html: `<p>A statistically significant slope tells you the predictor and outcome are linearly associated — not that the predictor causes the outcome. The smoking/CHD relationship is plausibly causal, but the statistical analysis alone doesn't establish that.</p>
<p>The intercept ($\beta_0$ = 0.25) is the predicted CHD mortality when cigarettes per day = 0. This interpretation only makes sense if x = 0 is within the data range. If the minimum smoking rate in the dataset is 5 cigarettes/day, x = 0 is an extrapolation and $\beta_0$ is a mathematical artifact, not a meaningful prediction.</p>`,
    },
    {
      type: "interactive",
      component: "RegressionInterpreter",
      caption: "Adjust slope and intercept on a scatter plot. See the equation update and practice interpreting what a unit change in x means for predicted y.",
      props: {},
    },
  ],
};

export default interpretingCoefficients;
