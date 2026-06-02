import type { Section } from "@brinnaebent/workbook";

const interpretingCoefficients: Section = {
  id: "interpreting-regression-coefficients",
  number: 3,
  title: "Interpreting Regression Coefficients",
  blocks: [
    {
      type: "text",
      html: `<p>Now that we have the OLS line for bedrooms vs. house price, let's see what it actually means:</p>
<p style="text-align:center">$$\\hat{\\text{price}} = 65{,}000 \\times \\text{bedrooms} + 100{,}000$$</p>
<p>This is the same y = mx + b you know from algebra!</p>
<ul>
<li><strong>65,000</strong> is the <strong>slope</strong> ($\\beta_1$): each additional bedroom is associated with a $65,000 increase in predicted price.</li>
<li><strong>100,000</strong> is the <strong>intercept</strong> ($\\beta_0$): the predicted price of a house with zero bedrooms.</li>
</ul>
<br>
<p>The slope tells you how much bedrooms matter; the intercept is the baseline.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Reading the Equation",
      html: `<p><strong>How much does a 3-bedroom house cost, according to this model?</strong><br>
$\\hat{\\text{price}} = 65{,}000 \\times 3 + 100{,}000 = 295{,}000$</p>
<p><strong>What about a 5-bedroom house?</strong><br>
$\\hat{\\text{price}} = 65{,}000 \\times 5 + 100{,}000 = 425{,}000$</p>
<p>The difference — 130,000 for two extra bedrooms — is exactly $2 \\times \\beta_1$. The slope is constant: the model says every bedroom adds the same amount regardless of whether you're going from 1→2 or 4→5.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "When the Intercept Doesn't Make Sense",
      html: `<p>The intercept here is $100,000 — the predicted price of a house with <em>zero</em> bedrooms. Does that make sense? Maybe a studio apartment or a parking space. But if your dataset contains only 2–6 bedroom houses, then zero bedrooms is an extrapolation far outside your data. The intercept is a mathematical anchor for the line, not always a meaningful real-world quantity.</p><br>
<p>Be especially careful when the intercept is negative. A model predicting sale time from listing price might give a negative time for very cheap homes — which is physically impossible. The intercept anchors the line; it isn't always interpretable.</p>`,
    },
    {
      type: "interactive",
      component: "RegressionInterpreter",
      caption: "Use the probe to predict prices at specific bedroom counts. Notice: what does the intercept tell you about the predicted price at zero bedrooms?",
      props: {},
    },
    {
      type: "callout",
      variant: "warning",
      title: "Correlation ≠ Causation",
      html: `<p>The slope of 65,000 says bedrooms and price are <em>associated</em> — not that buying more bedrooms <em>causes</em> a house to be worth more. More bedrooms also means more square footage, better neighborhoods, and other correlated features. Simple linear regression can't separate those effects.</p>
<p>The regression line describes the data you have. Claims about causation require study design, natural experiments, or explicit controls for confounders.</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch10-s3-q1",
      kind: "mc",
      question: "A model gives: price = 60,000 × bedrooms + 80,000. A house has 4 bedrooms and sold for $310,000. What is the residual?",
      options: [
        {
          label: "$70,000",
          correct: false,
          explanation: "Check the direction. The model predicts 60,000 × 4 + 80,000 = $320,000. The actual price is $310,000. The residual is actual minus predicted: 310,000 − 320,000 = −$10,000.",
        },
        {
          label: "−$10,000",
          correct: true,
          explanation: "Correct. The model predicts $320,000; the house sold for $310,000. Residual = actual − predicted = 310,000 − 320,000 = −$10,000. Negative means the model overpredicted.",
        },
        {
          label: "$10,000",
          correct: false,
          explanation: "The sign matters. The house sold for less than the model predicted, so the residual is negative: actual − predicted = −$10,000.",
        },
        {
          label: "$320,000",
          correct: false,
          explanation: "$320,000 is the model's prediction (60,000 × 4 + 80,000), not the residual. The residual is the difference between actual and predicted.",
        },
      ],
    },
  ],
};

export default interpretingCoefficients;
