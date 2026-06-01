import type { Section } from "@brinnaebent/workbook";

const distributionsAcrossML: Section = {
  id: "distributions-across-ml",
  number: 5,
  title: "Distributions Across the ML Stack",
  blocks: [
    {
      type: "text",
      html: `<p>Rather than memorizing every formula, you should focus on recognizing which distribution describes your situation. The skill that pays off: seeing a problem and knowing what shape the uncertainty should take.</p>`,
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
      html: `
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
      question: "Identify the most appropriate distribution for the outcome variable and explain why: predicting the number of support tickets a customer will submit next month",
      sampleAnswer: "Number of support tickets → Poisson (count of independent events in a fixed time window). Use Poisson regression.",
    },
    {
      type: "reflection",
      id: "stats-ch2-s5-reflect",
      question: "Identify the most appropriate distribution for the outcome variable and explain why: predicting whether an email is spam",
      sampleAnswer: "Spam/not-spam → Bernoulli (single binary trial). Use logistic regression with a Bernoulli likelihood.",
    },
    {
      type: "reflection",
      id: "stats-ch2-s5-reflect",
      question: "Identify the most appropriate distribution for the outcome variable and explain why: predicting how long a customer will remain subscribed before canceling.",
      sampleAnswer: "Time until cancellation → Exponential (or a more flexible distribution like Weibull if you expect hazard rate to change over time). Use survival analysis (e.g., Cox regression).",
    },
  ],
};

export default distributionsAcrossML;
