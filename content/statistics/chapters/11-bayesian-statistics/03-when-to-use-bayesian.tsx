import type { Section } from "@brinnaebent/workbook";

const whenToUseBayesian: Section = {
  id: "when-to-use-bayesian",
  number: 3,
  title: "When to Use Bayesian Methods",
  blocks: [
    {
      type: "text",
      html: `<p>Bayesian methods have specific strengths and specific costs. Knowing when to reach for them — and when not to — is a practical skill.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Reach for Bayesian Methods When:",
      html: `<ul>
<li><strong>You have relatively few data points.</strong> Priors supply useful information when data is limited. With little data, the prior makes a meaningful difference to the posterior. With lots of data, the prior gets washed out — frequentist methods may be equivalent and computationally simpler.</li>
<li><strong>You have strong prior knowledge.</strong> Previous studies, domain expertise, physical constraints — Bayesian inference formalizes these rather than ignoring them.</li>
<li><strong>You need to quantify uncertainty fully.</strong> A posterior distribution captures uncertainty about parameters more richly than a point estimate plus confidence interval. This matters when downstream decisions are sensitive to uncertainty (medical decision-making, financial risk, robotic planning).</li>
<li><strong>You want iterative updating.</strong> Bayesian learning is naturally sequential: today's posterior becomes tomorrow's prior. This maps cleanly to streaming data or online learning scenarios.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Avoid Bayesian Methods When:",
      html: `<ul>
<li><strong>Posterior sampling is computationally prohibitive.</strong> MCMC methods (Markov Chain Monte Carlo) can be slow. For real-time applications or large-scale models, this is a real constraint.</li>
<li><strong>You have big data where the prior doesn't matter.</strong> With millions of observations, the prior contributes negligibly. Frequentist methods are simpler and give the same result.</li>
<li><strong>You can't justify a prior and uninformative priors are problematic.</strong> For some analyses, choosing an "uninformative" prior still makes implicit choices that can affect conclusions. If you can't argue for a prior, the frequentist framing may be more transparent.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Bayesian in ML Practice",
      html: `<p>You'll meet Bayesian thinking in ML in several places:</p>
<ul>
<li><strong>Bayesian optimization</strong> for hyperparameter tuning — maintains a probabilistic model of the objective function and updates it as trials come in.</li>
<li><strong>Probabilistic classifiers</strong> like Naive Bayes.</li>
<li><strong>Bayesian neural networks</strong> — model uncertainty in weights, not just outputs.</li>
<li><strong>Thompson sampling</strong> in reinforcement learning and multi-armed bandits.</li>
<li><strong>Bayesian A/B testing</strong> — reports the full posterior distribution over the lift, rather than a binary reject/fail-to-reject decision.</li>
</ul>`,
    },
    {
      type: "reflection",
      id: "stats-ch11-s3-reflect",
      question: "You're running an A/B test to evaluate a small change to a checkout flow. You have 50 prior experiments with similar changes and a good sense of typical lift magnitudes. Would you lean toward a frequentist or Bayesian approach, and why?",
      sampleAnswer: "This is a good case for Bayesian A/B testing. You have strong prior information (50 prior experiments with similar interventions), which can inform a prior distribution over the expected lift. A Bayesian approach lets you formally incorporate that prior, resulting in more reliable conclusions with fewer samples — particularly useful if traffic is limited. You can also report 'there's a 92% probability the treatment lifts conversion' rather than a binary p-value decision, which is easier for stakeholders to interpret. The computational cost is minimal for a simple proportion comparison.",
    },
  ],
};

export default whenToUseBayesian;
