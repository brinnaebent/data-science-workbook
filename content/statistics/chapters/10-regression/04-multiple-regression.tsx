import type { Section } from "@brinnaebent/workbook";

const multipleRegression: Section = {
  id: "multiple-regression",
  number: 4,
  title: "Multiple Regression",
  blocks: [
    {
      type: "text",
      html: `<p>Bedrooms alone is a limited model. House price is shaped by location, square footage, proximity to good schools, whether there's a pool, and dozens of other factors. We need more than one predictor.</p>
<p><strong>Multiple linear regression</strong> extends the single-predictor model to as many features as you have. For our house-price problem, suppose we add location (distance from city center in miles) and whether the house has a pool:</p>
<p style="text-align:center">$$\\hat{\\text{price}} = \\beta_0 + \\beta_1(\\text{bedrooms}) + \\beta_2(\\text{distance}) + \\beta_3(\\text{pool})$$</p><br>
<p>Price is a weighted sum of predictors plus a baseline. OLS still minimizes SSE — it now finds the hyperplane (rather than a line) that does so. Python handles this identically: just pass a multi-column feature matrix.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "A Fitted Multiple Regression",
      html: `<p>Suppose OLS returns:</p>
<p style="text-align:center">$$\\hat{\\text{price}} = 100{,}000 + 60{,}000(\\text{bedrooms}) - 8{,}000(\\text{distance}) + 45{,}000(\\text{pool})$$</p>
<p>Reading each coefficient:</p>
<ul>
<li><strong>$\\beta_1 = 60{,}000$</strong>: Holding distance and pool constant, each additional bedroom adds $60,000 to predicted price.</li>
<li><strong>$\\beta_2 = -8{,}000$</strong>: Holding bedrooms and pool constant, each additional mile from city center reduces predicted price by $8,000.</li>
<li><strong>$\\beta_3 = 45{,}000$</strong>: Holding bedrooms and distance constant, having a pool adds $45,000 to predicted price.</li>
</ul><br>
<p><strong>Prediction:</strong> A 3-bedroom house, 5 miles from center, with a pool:<br>
$\\hat{\\text{price}} = 100{,}000 + 60{,}000(3) - 8{,}000(5) + 45{,}000(1) = 325{,}000$</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Critical Clause: Holding All Else Constant",
      html: `<p>Every coefficient in a multiple regression carries a hidden clause: <em>holding all other predictors constant</em>.</p><br>
<p>Example: the coefficient on bedrooms was 65,000 in the simple model (Section 3) and 60,000 in the multiple model above. The difference is because the multiple model has already "absorbed" some of the bedroom effect via distance and pool. Coefficients shift when you add or remove predictors.</p><br>
<p>A dramatic version of this is <strong>sign reversal</strong>. In a dataset of houses, more bedrooms tends to mean higher price — a positive raw correlation. But once you control for square footage, an extra bedroom sometimes means <em>smaller</em> rooms, which can flip the coefficient negative. Interpreting a coefficient in isolation, without knowing what else is in the model, is unreliable.</p>`,
    },
    {
      type: "interactive",
      component: "RegressionUsesGrid",
      caption: "",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch10-s4-q1",
      kind: "mc",
      question: "You build a multiple regression predicting house price from: bedrooms, square footage, and distance from city center. The coefficient on bedrooms is −$12,000. What is the most likely explanation?",
      options: [
        {
          label: "More bedrooms always makes a house less valuable",
          correct: false,
          explanation: "In the raw data, bedrooms and price are probably positively correlated. The negative coefficient is a conditional effect, not a simple correlation.",
        },
        {
          label: "Controlling for square footage, an extra bedroom means smaller rooms — which is negatively associated with price",
          correct: true,
          explanation: "Correct. Once square footage is held constant, adding a bedroom means dividing the same space into more, smaller rooms. That's less desirable, and the negative coefficient captures it. This is a classic example of how conditional effects can reverse the sign of a simple correlation.",
        },
        {
          label: "The model has an error — more bedrooms should always increase value",
          correct: false,
          explanation: "Negative coefficients are not errors. They represent conditional effects: the relationship between a predictor and the outcome after the other predictors are controlled for.",
        },
        {
          label: "The intercept is too high, which is pushing the bedroom coefficient negative",
          correct: false,
          explanation: "The intercept and slope coefficients are estimated jointly by OLS to minimize SSE. The intercept being large or small doesn't mechanically push slope coefficients in a particular direction.",
        },
      ],
    },
  ],
};

export default multipleRegression;
