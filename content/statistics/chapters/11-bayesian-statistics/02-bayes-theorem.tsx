import type { Section } from "@brinnaebent/workbook";

const bayesTheorem: Section = {
  id: "bayes-theorem",
  number: 2,
  title: "Bayes' Theorem",
  blocks: [
    {
      type: "text",
      html: `<p>Bayes' Theorem describes how to update the probability of a hypothesis based on new evidence:</p>
<p style="text-align:center">$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}$$</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Breaking Down Each Term",
      html: `<ul>
<li><strong>P(A | B)</strong> — <em>Posterior:</em> Probability of hypothesis A given evidence B. Your updated belief after seeing data.</li>
<li><strong>P(B | A)</strong> — <em>Likelihood:</em> Probability of observing evidence B given that A is true. How well does the hypothesis explain the data?</li>
<li><strong>P(A)</strong> — <em>Prior:</em> Probability of A before seeing any evidence. Your initial belief.</li>
<li><strong>P(B)</strong> — <em>Marginal likelihood (evidence):</em> Probability of observing B under any hypothesis. Acts as a normalization constant.</li>
</ul>
<p>In plain language: <strong>posterior ∝ likelihood × prior</strong>. Your updated belief is your initial belief, scaled by how well the hypothesis explains what you observed.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Intuitive Example: Medical Testing",
      html: `<p>A disease affects 1% of the population. A test is 99% accurate (P(positive | disease) = 0.99, P(negative | no disease) = 0.99). You test positive. What's the probability you have the disease?</p>
<p>Intuition says ~99%. Bayes says something different:</p>
<ul>
<li>P(disease) = 0.01 (prior)</li>
<li>P(positive | disease) = 0.99 (likelihood)</li>
<li>P(positive) = 0.99 × 0.01 + 0.01 × 0.99 = 0.0198 (marginal likelihood)</li>
<li>P(disease | positive) = (0.99 × 0.01) / 0.0198 ≈ 0.50</li>
</ul>
<p>A 99%-accurate test on a 1%-prevalence disease yields only ~50% probability of disease given a positive result. The low prior (rare disease) pulls against the high likelihood. This is why medical screening relies on prevalence data, not just test accuracy.</p>`,
    },
    {
      type: "interactive",
      component: "BayesTheoremVisualizer",
      caption: "Placeholder: Adjust prior probability, test sensitivity, and specificity. See the posterior probability update. Visualize how prevalence (prior) dramatically affects the positive predictive value.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch11-s2-q1",
      kind: "mc",
      question: "In the Bayesian framework, what is the role of the prior — and what happens to its influence as data accumulates?",
      options: [
        {
          label: "The prior encodes your initial belief; with more data, the likelihood dominates and the prior's influence diminishes",
          correct: true,
          explanation: "Correct. The posterior is proportional to likelihood × prior. As more data accumulates, the likelihood becomes more peaked and informative — it 'overwhelms' the prior. With very large datasets, the prior contributes negligibly and the posterior converges to the maximum likelihood estimate.",
        },
        {
          label: "The prior is a fixed correction factor that always shifts the posterior by a constant amount",
          correct: false,
          explanation: "The prior's influence is relative to the data, not fixed. It matters a lot with small samples and matters very little with large ones.",
        },
        {
          label: "The prior encodes your initial belief; it maintains equal influence regardless of how much data you have",
          correct: false,
          explanation: "This is incorrect. The posterior is a product of likelihood and prior — as data accumulates, the likelihood grows more informative and dominates the prior.",
        },
        {
          label: "The prior represents the true population distribution and should only be set by domain experts",
          correct: false,
          explanation: "Priors can come from domain expertise, but they can also be uninformative (e.g., uniform distributions) when you genuinely lack prior knowledge. They don't have to represent a known 'true' distribution.",
        },
      ],
    },
  ],
};

export default bayesTheorem;
