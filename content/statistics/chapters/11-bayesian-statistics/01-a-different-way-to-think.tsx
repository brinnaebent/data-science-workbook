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
<p>This is a brief introduction — full Bayesian methods can fill a whole course. But you should understand the basics for two reasons. First, Bayesian thinking shows up throughout ML: probabilistic models, Bayesian neural networks, uncertainty quantification. Second, it's a common interview topic in data science roles!</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Bayesian in ML Practice",
      html: `<p>You'll meet Bayesian thinking in ML in several places:</p>
<ul>
<li><strong>Bayesian optimization</strong> for hyperparameter tuning — maintains a probabilistic model of the objective function and updates it as trials come in.</li>
<li><strong>Probabilistic classifiers</strong> like Naive Bayes.</li>
<li><strong>Bayesian neural networks</strong> — model uncertainty in weights.</li>
<li><strong>Thompson sampling</strong> in reinforcement learning and multi-armed bandits.</li>
<li><strong>Bayesian A/B testing</strong> — reports the full posterior distribution over the lift, rather than a binary reject/fail-to-reject decision.</li>
</ul>`,
    },
  ],
};

export default aDifferentWayToThink;
