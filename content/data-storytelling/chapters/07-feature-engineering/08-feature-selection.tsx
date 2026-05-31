import type { Section } from "@brinnaebent/workbook";

const featureSelection: Section = {
  id: "feature-selection",
  number: 8,
  title: "Feature Selection",
  blocks: [
    {
      type: "text",
      html: `<p>Engineering creates features. Selection narrows them down to the ones that actually earn their place in the model. More features is not always better — dimensionality, overfitting, and interpretability all suffer when you include noise alongside signal. Three families of approaches cover most cases.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Three Selection Approaches",
      html: `<p><strong>Correlation-based selection.</strong> Compute pairwise correlations; remove one of any pair above a threshold (e.g., 0.8). Use Pearson for linear relationships, Spearman for monotonic, Kendall's tau for ordinal. Simple, fast, interpretable — but misses nonlinear relationships and may remove complementary features.</p>
<p><strong>Recursive Feature Elimination (RFE).</strong> Wrap a model. Rank features by importance (coefficients for linear models, Gini/entropy for trees). Remove the least important. Rebuild. Repeat. Captures interactions and nonlinearities; accounts for how features work together. Computationally expensive; model-specific; risks overfitting if not combined with cross-validation.</p>
<p><strong>Univariate selection.</strong> Score each feature individually based on its relationship with the target — Pearson or F-test or mutual information for regression; chi-square, ANOVA F-test, or mutual information for classification. Fast, simple, model-agnostic. But ignores feature interactions — a feature that's individually weak may be jointly strong with another. Use as a first filter, not a final answer.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Genomics: When Selection Is Everything",
      html: `<p>In genomics, you might have tens of thousands of features (gene expression levels) and a few hundred samples. Feature selection isn't an optimization — it's a requirement. Without it, any model will overfit. The right selection method depends on whether you care about interpretability (correlation), predictive performance (RFE), or speed (univariate). In high-dimensional sensor data — wearables, industrial monitoring — the same calculus applies.</p>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "Feature selection method comparison: correlation, RFE, and univariate scoring",
      caption: "Placeholder: visual comparison of the three selection methods applied to the same feature set, showing which features each retains.",
    },
    {
      type: "checkpoint",
      id: "ds-fe-selection-q1",
      kind: "mc",
      question: "You have 500 features and want to select the best 20 for a random forest. You run univariate chi-square selection and keep the top 20. A colleague says you might be missing the best features. Why might they be right?",
      options: [
        {
          label: "Univariate selection scores each feature independently — features that are only informative in combination with other features are missed",
          correct: true,
          explanation: "Correct. Chi-square and other univariate methods score each feature by its individual relationship with the target. Two features that are each weakly predictive but jointly highly predictive (an interaction effect) would both score poorly and be dropped. RFE or model-based selection would catch this because the model sees features together during training.",
        },
        {
          label: "Chi-square is only valid for categorical variables — it's always the wrong method for feature selection",
          correct: false,
          explanation: "Chi-square is indeed designed for categorical data, and would be inappropriate for continuous features without binning. But that's a different concern from the interaction issue — the question is about a general limitation of univariate selection methods, not about chi-square specifically.",
        },
        {
          label: "20 features is not enough — you should keep at least 50% of the original features",
          correct: false,
          explanation: "There's no universal rule about how many features to keep. 20 features for a 500-feature dataset is reasonable and common. The issue the colleague is raising is about the selection method's blind spot (interactions), not the number selected.",
        },
      ],
    },
  ],
};

export default featureSelection;
