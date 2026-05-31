import type { Section } from "@brinnaebent/workbook";

const assumptionsAndMultiple: Section = {
  id: "assumptions-and-multiple-regression",
  number: 4,
  title: "Assumptions and Multiple Regression",
  blocks: [
    {
      type: "callout",
      variant: "warning",
      title: "The Four Assumptions of Linear Regression",
      html: `<p>OLS relies on four assumptions. Violations bias your coefficient estimates, corrupt your standard errors, and make your hypothesis tests unreliable.</p>
<ol>
<li><strong>Linearity:</strong> The relationship between predictors and outcome is approximately linear. If your data shows a curve, fitting a line misleads.</li>
<li><strong>Independence of observations:</strong> Each data point is independent. Time series (autocorrelated) or clustered data (students within classrooms) violate this.</li>
<li><strong>Homoscedasticity:</strong> Residuals have constant variance across all predictor values. If residuals fan out as predictions get larger, you have heteroscedasticity — standard errors are biased.</li>
<li><strong>Normality of residuals:</strong> The residuals are approximately normally distributed. Matters most for confidence intervals and hypothesis tests on coefficients.</li>
</ol>
<p>You check these with residual plots (Chapter 12). Visual inspection of residuals vs. fitted values is the workhorse diagnostic.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Multiple Linear Regression",
      html: `<p>What if more than one variable matters? CHD mortality is probably influenced by smoking, age, saturated fat consumption, exercise, and more. Multiple linear regression handles many predictors:</p>
<p style="text-align:center">$$y = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\cdots + \\beta_p x_p + \\epsilon$$</p>
<p>Each β_i is interpreted as: the change in y per one-unit change in x_i, <strong>holding all other predictors constant</strong>. That last clause matters. Interpretation of one coefficient depends on what else is in the model. Adding or removing a variable can change other coefficients.</p>
<p><strong>In Python:</strong> <code>statsmodels.api.OLS</code> or <code>sklearn.linear_model.LinearRegression</code> with a multi-column predictor matrix.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "What Regression Is Good For",
      html: `<ul>
<li><strong>Prediction:</strong> Given values of predictors, estimate the outcome.</li>
<li><strong>Estimation:</strong> Estimate the effect of one variable, controlling for others.</li>
<li><strong>Hypothesis testing:</strong> Test whether a coefficient is significantly different from zero.</li>
<li><strong>Foundation for other methods:</strong> Logistic regression, Ridge/Lasso regularization, generalized linear models — all extend from linear regression.</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch10-s4-q1",
      kind: "mc",
      question: "You build a multiple regression predicting house price with features: square footage, number of bedrooms, and distance from city center. The coefficient on bedrooms is -$15,000. What does this mean?",
      options: [
        {
          label: "Houses with more bedrooms are worth less",
          correct: false,
          explanation: "The sign is negative, but the interpretation requires the 'holding all else constant' clause. Taken in isolation, more bedrooms do tend to cost more — but once you control for square footage, an additional bedroom often means smaller rooms, which can reduce price.",
        },
        {
          label: "Controlling for square footage and distance from center, each additional bedroom is associated with a $15,000 decrease in predicted price",
          correct: true,
          explanation: "Correct. This is the conditional interpretation. Once square footage is held constant, an extra bedroom means smaller rooms — which is negatively associated with price. This is a common example of how controlling for other variables can reverse the sign of a coefficient.",
        },
        {
          label: "Bedrooms are negatively correlated with price in the data",
          correct: false,
          explanation: "The regression coefficient is a conditional effect, not a simple correlation. The raw correlation between bedrooms and price in the data could be positive — the coefficient controls for the other variables.",
        },
        {
          label: "The model has an error — more bedrooms should always increase value",
          correct: false,
          explanation: "Negative coefficients in multiple regression are not errors — they represent conditional effects that control for other variables. The result is statistically and practically plausible.",
        },
      ],
    },
  ],
};

export default assumptionsAndMultiple;
