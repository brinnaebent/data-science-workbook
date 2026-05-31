import type { Section } from "@brinnaebent/workbook";

const distributionsAcrossML: Section = {
  id: "distributions-across-ml",
  number: 5,
  title: "Distributions Across the ML Stack",
  blocks: [
    {
      type: "text",
      html: `<p>You don't need to memorize every formula — you need to recognize which distribution describes your situation. The skill that pays off: seeing a problem and knowing what shape the uncertainty should take.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Where Each Distribution Lives in Practice",
      html: `<ul>
<li><strong>Bernoulli / Binomial:</strong> Underlie logistic regression and any binary classification problem. Click-through rates, conversion rates, fraud detection, disease diagnosis.</li>
<li><strong>Poisson:</strong> Count-based features and outcomes. Call volumes, request counts, defect counts, rare event modeling. Also the foundation for Poisson regression.</li>
<li><strong>Normal:</strong> The assumption behind most parametric statistical tests. Residuals of linear regression (when assumptions hold). Initialization weights in neural networks.</li>
<li><strong>Exponential:</strong> Survival analysis, churn prediction, reliability modeling, time-to-failure. The foundation for Cox proportional hazards models.</li>
<li><strong>Uniform:</strong> Random weight initialization, A/B test group assignment, Monte Carlo simulation, dropout masks.</li>
<li><strong>t-distribution:</strong> Hypothesis tests about means when population variance is unknown. Confidence intervals on regression coefficients.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>The most important skill here isn't choosing the "right" distribution from a formula sheet — it's understanding why the choice matters and what can go wrong when it's wrong.</p>
<p>A useful heuristic for choosing:</p>
<ol>
<li><strong>Is the outcome binary?</strong> → Bernoulli (single event) or Binomial (count of successes).</li>
<li><strong>Is the outcome a count per time period?</strong> → Poisson.</li>
<li><strong>Is it time to an event?</strong> → Exponential (or Weibull for more flexibility).</li>
<li><strong>Is it a continuous measurement with no known structure?</strong> → Normal (especially for residuals and errors).</li>
<li><strong>Do you genuinely have no reason to prefer any value?</strong> → Uniform.</li>
</ol>`,
    },
    {
      type: "reflection",
      id: "stats-ch2-s5-reflect",
      question: "For each of these ML tasks, identify the most appropriate distribution for the outcome variable and explain why: (1) predicting whether an email is spam, (2) predicting the number of support tickets a customer will submit next month, (3) predicting how long a customer will remain subscribed before canceling.",
      sampleAnswer: "(1) Spam/not-spam → Bernoulli (single binary trial). Use logistic regression with a Bernoulli likelihood. (2) Number of support tickets → Poisson (count of independent events in a fixed time window). Use Poisson regression. (3) Time until cancellation → Exponential (or a more flexible distribution like Weibull if you expect hazard rate to change over time). Use survival analysis (e.g., Cox regression).",
    },
  ],
};

export default distributionsAcrossML;
