import type { Section } from "@brinnaebent/workbook";

const theSetup: Section = {
  id: "the-setup",
  number: 1,
  title: "The Setup",
  blocks: [
    {
      type: "text",
      html: `<p>Whether you are searching for a home or just wanting to window shop, apps that predict house prices are pretty neat. Let's say that we want to predict house prices for our own app. We have data on houses — how many bedrooms they have, where they're located, whether there's a pool — and we want to build a model that takes those features as input and outputs a predicted price.</p>
<p>Linear regression is one of the oldest and most useful tools for exactly this. But before we learn <em>how</em> it works, we need to understand <em>when</em> it's valid — because the model makes assumptions about your data, and if those assumptions are badly violated, the predictions and coefficient estimates can't be trusted.</p>`,
    },
    {
      type: "interactive",
      component: "RegressionAssumptionsGrid",
      caption: "",
    },
    {
      type: "text",
      html: `<p>With those constraints in mind, here's what we're building toward. We have a dataset of houses. Each house has a sale price (what we want to predict) and one or more features (what we'll use to predict it). The simplest case is one feature, one outcome, one line.</p>
<p>The question is: which line? Any line drawn through the scatter of houses makes some errors — it predicts 280k for a house that sold for 340k, or 420k for one that sold for 390k. The errors are called <strong>residuals</strong>, and the goal of linear regression is to find the line that makes those errors as small as possible in total.</p>
<p>The next section shows exactly how residuals work — and what "as small as possible" means mathematically.</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch10-s1-q1",
      kind: "mc",
      question: "A real estate analyst fits a linear regression model predicting house price from square footage. She notices that the residuals for small houses are all clustered near zero, but for large houses the residuals vary widely — some $200k too high, some $150k too low. Which assumption is most likely violated?",
      options: [
        {
          label: "Linearity",
          correct: false,
          explanation: "Linearity would be violated if the residuals showed a curved pattern relative to the fitted values. A fan-shaped spread isn't a curved trend — it's a variance problem.",
        },
        {
          label: "Independence",
          correct: false,
          explanation: "Independence is about whether observations are correlated with each other (e.g., clustered sampling). The fan pattern described here is about residual variance, not inter-observation correlation.",
        },
        {
          label: "Homoscedasticity",
          correct: true,
          explanation: "Correct. The residuals fan out as predicted price increases — small variance for cheap houses, large variance for expensive ones. This is heteroscedasticity: non-constant variance across the range of fitted values. It biases standard errors and makes hypothesis tests unreliable.",
        },
        {
          label: "Normality of residuals",
          correct: false,
          explanation: "Normality concerns the shape of the residual distribution, not whether variance changes across fitted values. A normality violation might look like a heavy-tailed or skewed residual histogram, not a fan.",
        },
      ],
    },
  ],
};

export default theSetup;
