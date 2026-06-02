import type { Section } from "@brinnaebent/workbook";

const shapeOfUncertainty: Section = {
  id: "shape-of-uncertainty",
  number: 1,
  title: "The Shape of Uncertainty",
  blocks: [
    {
      type: "text",
      html: `<p>Every measurement, every metric, every prediction you'll ever work with has uncertainty baked in. Probability distributions are how we describe that uncertainty mathematically — what values are likely, what values are possible, and what values would be genuinely surprising.</p>
<p>If you understand the right distribution for your problem, you have a model of the world. If you assume the wrong distribution, your statistical conclusions can be quietly, confidently wrong.</p>
<p>Before we get into specific distributions, a few terms you'll see everywhere:</p>`,
    },
    {
      type: "text",
      html: `<ul>
<li><strong>Probability density function (PDF):</strong> For continuous distributions, describes the relative likelihood of a random variable taking a given value. You integrate over a range to get a probability — the PDF value itself isn't a probability.</li>
<li><strong>Probability mass function (PMF):</strong> The discrete counterpart. Gives the exact probability of a specific value. A Poisson variable equaling exactly 3 is a PMF value.</li>
<li><strong>Cumulative distribution function (CDF):</strong> The probability that a random variable takes a value ≤ x. Ranges from 0 to 1 across the full range of the variable.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>Distributions also have two key parameters:</p>
<ul>
<li><strong>Mean (expected value):</strong> The average value of the random variable, weighted by probabilities.</li>
<li><strong>Variance:</strong> How spread out the distribution is around its mean. The square root of variance is the standard deviation.</li>
</ul>
<br>
<p>Different distributions have different relationships between their parameters and their shape. Understanding those relationships is what lets you identify the right distribution for a given situation.</p>`,
    },
    {
      type: "interactive",
      component: "DistributionShapeExplorer",
      caption: "Select a distribution and adjust its parameters to see how the PDF/PMF and CDF change — and how mean, variance, and mode shift together.",
      props: {},
    },
    {
      type: "text",
      html: `<p>Each curve is computed analytically — no sampling involved. For the <strong>Normal</strong> distribution:</p>
$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\, e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$
<p>For <strong>Poisson</strong>, each bar is the PMF at integer $k$:</p>
$$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$$
<p>For <strong>Exponential</strong>, $f(x) = \\lambda e^{-\\lambda x}$ for $x \\geq 0$. For <strong>Uniform</strong>, $f(x) = \\frac{1}{b-a}$ between $a$ and $b$, zero elsewhere.</p>
<p>The CDF is the running integral of the PDF (or running sum of the PMF) from left to right — which is why it always starts near 0 and climbs to 1. The mean line marks $E[X]$, computed from the closed-form mean for each distribution.</p>`,
    },
  ],
};

export default shapeOfUncertainty;
