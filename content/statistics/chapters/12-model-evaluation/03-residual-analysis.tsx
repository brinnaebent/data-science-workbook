import type { Section } from "@brinnaebent/workbook";

const residualAnalysis: Section = {
  id: "residual-analysis",
  number: 3,
  title: "Residual Analysis and Confidence Intervals",
  blocks: [
    {
      type: "text",
      html: `<p>Residuals don't just minimize — they reveal. After fitting a regression, examining patterns in the residuals is how you check whether the model's assumptions actually hold.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Three Residual Analyses to Run",
      html: `<ul>
<li><strong>Residual plots:</strong> Plot residuals on the y-axis vs. fitted values on the x-axis. You want a random, structureless cloud centered on zero. Watch for:<ul>
<li><em>Curvature</em> → nonlinear relationship, the linear model is wrong.</li>
<li><em>Fan or funnel shape</em> → heteroscedasticity (non-constant variance).</li>
<li><em>Large individual outliers</em> → may unduly influence the model.</li></ul></li>
<li><strong>Normality test:</strong> Shapiro-Wilk on the residuals. A Q-Q plot of residuals should have points near the diagonal.</li>
<li><strong>Homoscedasticity test:</strong> Breusch-Pagan test. Null: residual variance is constant. Significant p → heteroscedasticity. Fix: log-transform the outcome, use weighted least squares, or switch to a model that accommodates non-constant variance.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Confidence Intervals",
      html: `<p>A <strong>confidence interval</strong> gives a range of values likely to contain the true population parameter. A 95% CI from repeated sampling would contain the true value about 95% of the time.</p>
<p><strong>Z-score method</strong> (population $\sigma$ known, $n \geq 30$):</p>
<p style="text-align:center">$$\\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}$$</p>
<p><strong>T-score method</strong> (population $\sigma$ unknown — use this one in practice):</p>
<p style="text-align:center">$$\\bar{x} \\pm t_{\\alpha/2} \\cdot \\frac{s}{\\sqrt{n}}$$</p>
<p><strong>Careful:</strong> A 95% CI does NOT mean "there's a 95% probability the true value is in this interval." That's a Bayesian statement. The frequentist interpretation: if we repeated the procedure many times, ~95% of computed intervals would contain the true parameter.</p>`,
    },
    {
      type: "interactive",
      component: "ResidualAnalysisDashboard",
      caption: "Fit a regression model and display residual plots (vs. fitted values, Q-Q plot). Toggle between a well-specified model and one with heteroscedasticity to see the patterns.",
      props: {},
    },
  ],
};

export default residualAnalysis;
