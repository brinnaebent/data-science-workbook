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
      type: "callout",
      variant: "info",
      title: "PDF, PMF, and CDF",
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
<p>Different distributions have different relationships between their parameters and their shape. Understanding those relationships is what lets you identify the right distribution for a given situation.</p>`,
    },
    {
      type: "interactive",
      component: "DistributionShapeExplorer",
      caption: "Placeholder: Select a distribution, adjust its parameters, and observe how PDF, CDF, mean, and variance shift together.",
      props: {},
    },
  ],
};

export default shapeOfUncertainty;
