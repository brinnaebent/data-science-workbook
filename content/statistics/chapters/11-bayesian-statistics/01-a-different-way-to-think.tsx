import type { Section } from "@brinnaebent/workbook";

const aDifferentWayToThink: Section = {
  id: "a-different-way-to-think-about-belief",
  number: 1,
  title: "A Different Way to Think About Belief",
  blocks: [
    {
      type: "text",
      html: `<p>Most of what we've done so far has been <strong>frequentist</strong> statistics: we treat unknown quantities as fixed but unknown, collect data, and ask how surprising the data would be under some hypothesis. P-values, confidence intervals, hypothesis tests — all frequentist.</p>
<p><strong>Bayesian statistics</strong> flips the question. Instead of "given the hypothesis, how surprising is the data?", it asks "given the data, how should I update my belief about the hypothesis?" It starts with a <em>prior belief</em>, observes data, and produces a <em>posterior belief</em> that combines both.</p>
<p>This is a brief introduction — full Bayesian methods can fill a whole course. But you should understand the basics for two reasons. First, Bayesian thinking shows up throughout ML: probabilistic models, Bayesian neural networks, uncertainty quantification. Second, it's a common interview topic in data science roles.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Learning Objectives",
      html: `<ol>
<li>State Bayes' Theorem and identify each component.</li>
<li>Distinguish prior, likelihood, posterior, and marginal likelihood.</li>
<li>Explain when Bayesian methods are advantageous — and when they're not.</li>
<li>Describe the Bayesian inference workflow.</li>
<li>Understand Bayesian linear regression conceptually.</li>
</ol>`,
    },
  ],
};

export default aDifferentWayToThink;
