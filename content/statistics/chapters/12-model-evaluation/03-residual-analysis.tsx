import type { Section } from "@brinnaebent/workbook";

const residualAnalysis: Section = {
  id: "residual-analysis",
  number: 3,
  title: "Residual Analysis and Confidence Intervals",
  blocks: [
    {
      type: "text",
      html: `<h3>Residual Analysis</h3><p>After fitting a regression, examining patterns in the residuals is how you check whether the model's assumptions actually hold.</p>`,
    },
    {
      type: "text",
      html: `<ul>
<li><strong>Residuals vs. Fitted:</strong> Plot residuals on the y-axis vs. fitted values on the x-axis. You want a random, structureless cloud centered on zero. Watch for:<ul>
<li><em>Curvature</em> → nonlinear relationship, the linear model is wrong.</li>
<li><em>Fan or funnel shape</em> → heteroscedasticity (non-constant variance).</li>
<li><em>Large individual outliers</em> → may unduly influence the model.</li></ul></li>
<li><strong>Normal Q-Q:</strong> Plots sorted residuals against the quantiles you'd expect from a normal distribution. Points hugging the diagonal mean normality holds. Shapiro-Wilk formalizes this as a hypothesis test.</li>
<li><strong>Scale-Location:</strong> Plots $\\sqrt{|\\text{residual}|}$ vs. fitted values. A flat, horizontal spread of points confirms homoscedasticity; an upward slope signals that variance is growing with the fitted value (heteroscedasticity).</li>
<li><strong>Homoscedasticity test:</strong> Breusch-Pagan test. Null: residual variance is constant. Significant p → heteroscedasticity. Fix: log-transform the outcome, use weighted least squares, or switch to a model that accommodates non-constant variance.</li>
</ul>
<br>
<p><strong>Summary statistics to watch:</strong></p>
<ul>
<li><strong>Mean residual</strong> — should be near zero. A non-zero mean indicates systematic bias; the model is consistently over- or under-predicting.</li>
<li><strong>SD of residuals</strong> — the typical size of a prediction error. Smaller is better, but what counts as "small" depends on the scale of your outcome.</li>
<li><strong>SSE (Sum of Squared Errors)</strong> — $\\sum (y_i - \\hat{y}_i)^2$. The raw total of all squared residuals. It shrinks as the model fits better, and is the quantity OLS regression directly minimizes.</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "ResidualAnalysisDashboard",
      caption: "Fit a regression model and display residual plots (vs. fitted values, Q-Q plot). Toggle between a well-specified model and one with heteroscedasticity to see the patterns.",
      props: {},
    },
    {
      type: "text",
      html: `<h3>Confidence Intervals</h3><p>A <strong>confidence interval</strong> gives a range of values likely to contain the true population parameter. A 95% CI from repeated sampling would contain the true value about 95% of the time.</p>
<p><strong>Z-score method</strong> (population $\\sigma$ known, $n \\geq 30$):</p>
<p style="text-align:center">$$\\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}$$</p>
<p><strong>T-score method</strong> (population $\\sigma$ unknown — use this one in practice):</p>
<p style="text-align:center">$$\\bar{x} \\pm t_{\\alpha/2} \\cdot \\frac{s}{\\sqrt{n}}$$</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Common Misconception",
      html: `<p>A 95% CI does NOT mean "there's a 95% probability the true value is in this interval." That's a Bayesian statement. The frequentist interpretation: if we repeated the procedure many times, ~95% of computed intervals would contain the true parameter.</p>`,
    },
  ],
};

export default residualAnalysis;
