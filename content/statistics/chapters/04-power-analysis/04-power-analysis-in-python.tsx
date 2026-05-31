import type { Section } from "@brinnaebent/workbook";

const powerAnalysisInPython: Section = {
  id: "power-analysis-in-python",
  number: 4,
  title: "Power Analysis in Python",
  blocks: [
    {
      type: "text",
      html: `<p><code>statsmodels</code> has built-in power analysis tools for most of the statistical tests we'll cover. The two you'll use most often:</p>
<ul>
<li><code>statsmodels.stats.power.TTestPower</code> — one-sample or paired t-tests.</li>
<li><code>statsmodels.stats.power.TTestIndPower</code> — independent-sample t-tests.</li>
</ul>
<p>A typical workflow:</p>
<ol>
<li>Run or find a pilot study with two groups.</li>
<li>Compute the means and pooled standard deviation.</li>
<li>Compute Cohen's d: (mean₁ − mean₂) / pooled_std.</li>
<li>Pass that effect size, along with α = 0.05 and power = 0.80, to the appropriate power function.</li>
<li>Solve for required sample size per group.</li>
</ol>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Example: Comparing Two Conversion Rates",
      html: `<pre><code>from statsmodels.stats.power import TTestIndPower

# Pilot study results:
# Control: mean = 0.042, std = 0.201
# Treatment: mean = 0.051, std = 0.220
# Pooled std ≈ 0.211

effect_size = (0.051 - 0.042) / 0.211  # Cohen's d ≈ 0.043

analysis = TTestIndPower()
n = analysis.solve_power(
    effect_size=effect_size,
    alpha=0.05,
    power=0.80,
    alternative='two-sided'
)
print(f"Required sample size per group: {n:.0f}")</code></pre>
<p>The output is the minimum sample size per group. You can hand this to your manager or stakeholder and explain exactly why you need that many users.</p>`,
    },
    {
      type: "interactive",
      component: "PowerAnalysisCalculator",
      caption: "Placeholder: Enter effect size, α, and desired power. Compute required sample size and see the power curve.",
      props: {},
    },
    {
      type: "callout",
      variant: "warning",
      title: "When the Number You Get Is Impossible",
      html: `<p>Power analysis is a respected methodology. It is also not magic. You will sometimes get back numbers like "you need 50,000 subjects" when you have budget for 200.</p>
<p>Your honest options:</p>
<ul>
<li>Report results as preliminary / underpowered (explicitly labeled).</li>
<li>Shrink the scope: design to detect only a larger effect.</li>
<li>Negotiate for more time or budget by showing the power analysis.</li>
<li>Decide not to run the study at all — an underpowered study can be worse than no study because it produces a misleading null result.</li>
</ul>
<p>What you should <em>not</em> do is run the underpowered study and report the result as definitive.</p>`,
    },
  ],
};

export default powerAnalysisInPython;
