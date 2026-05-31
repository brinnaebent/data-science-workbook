import type { Section } from "@brinnaebent/workbook";

const tabularFeatures: Section = {
  id: "tabular-features",
  number: 3,
  title: "Feature Engineering for Tabular Data",
  blocks: [
    {
      type: "text",
      html: `<p>Tabular feature engineering is the most general category and the one you'll do most often. The techniques here apply across domains — from customer churn to credit risk to healthcare outcomes.</p>
<p><strong>Core techniques:</strong></p>
<ul>
<li><strong>Descriptive statistics as features.</strong> Compute mean, std, min, max on numerical columns; frequency counts on categorical columns. These summary statistics can become inputs to downstream models — especially useful when aggregating over groups.</li>
<li><strong>Encoding categorical variables.</strong> One-hot for unordered; ordinal for ordered; target encoding for high-cardinality categoricals; frequency encoding when count of occurrences is itself predictive.</li>
<li><strong>Scaling and standardization.</strong> Required for distance-based models (KNN, clustering) where comparing age and household income raw is meaningless. Also speeds convergence for logistic regression and neural networks.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Interaction Features",
      html: `<p>Combine features through multiplication, addition, division, or any function that captures their joint behavior. Examples:</p>
<ul>
<li><strong>BMI = weight / height²</strong> — captures something neither weight nor height captures alone.</li>
<li><strong>Debt-to-income ratio</strong> — captures affordability in a way that raw income and raw debt don't.</li>
<li><strong>Petal area = petal_length × petal_width</strong> — which we saw in the Iris EDA gave cleaner species separation than either dimension alone.</li>
</ul>
<p>You can also create <strong>polynomial features</strong> by raising existing features to higher powers — these capture nonlinear relationships in linear models.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Interactions and Polynomials: Use Deliberately",
      html: `<p>Interaction and polynomial features increase dimensionality, raise overfitting risk, and reduce interpretability. Use them when EDA shows a clear pair relationship, when model performance plateaus and you need more signal, and always pair them with regularization. Don't blanket-apply them — that's a recipe for an overfit, opaque model.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Credit Risk Modeling",
      html: `<p>In credit risk modeling, classic interaction features have been used for decades: debt-to-income ratio, payment-to-income ratio, account-age × utilization. The features are simple, but they encode decades of credit-industry domain expertise. The newest ML models often beat older rule-based ones not because the models are smarter, but because they use <em>more</em> engineered features that encode more domain knowledge.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-fe-tabular-q1",
      kind: "mc",
      question: "You have features 'loan_amount' and 'annual_income'. A domain expert says the ratio between them is more predictive than either value alone. What should you do?",
      options: [
        {
          label: "Engineer a 'debt_to_income' interaction feature and include it alongside or instead of the originals",
          correct: true,
          explanation: "Correct. The domain expert is telling you that the relationship between the two values — not their raw magnitudes — is what predicts default risk. Engineering loan_amount / annual_income creates exactly that signal. Whether to keep the originals alongside it depends on whether they add independent information (they often do) and whether your model benefits from the redundancy.",
        },
        {
          label: "Use polynomial features to capture the nonlinear relationship between them",
          correct: false,
          explanation: "Polynomial features capture nonlinearity within a single variable (squared, cubed terms). A ratio is an interaction between two variables — that's an interaction feature, not a polynomial feature.",
        },
        {
          label: "Drop both and use only the ratio — the domain expert said the ratio is more predictive",
          correct: false,
          explanation: "'More predictive than either alone' doesn't mean 'the others contribute nothing.' Raw loan amount and income may still carry independent signal (e.g., model risk at very high income levels). A sensible approach is to add the ratio and let regularization or feature selection determine whether to drop the originals.",
        },
      ],
    },
  ],
};

export default tabularFeatures;
