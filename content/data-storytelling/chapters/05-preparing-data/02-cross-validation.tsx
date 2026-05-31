import type { Section } from "@brinnaebent/workbook";

const crossValidation: Section = {
  id: "cross-validation",
  number: 2,
  title: "Cross-Validation",
  blocks: [
    {
      type: "text",
      html: `<p>Cross-validation is a more data-efficient approach to robust evaluation — especially important with small datasets where you can't afford to hold out 20% just for validation.</p>
<p><strong>K-fold cross-validation</strong> splits your data into <em>k</em> equally-sized folds. For each fold, use that fold as the test set and the remaining k−1 folds for training. Train and evaluate k separate times, then aggregate the metrics. Common values: k = 5 or 10.</p>
<p><strong>Stratified k-fold</strong> applies the same idea but ensures each fold's class distribution matches the overall dataset — critical for imbalanced classification where a random split might leave one fold with no minority-class examples at all.</p>
<p><strong>Leave-one-out (LOOCV)</strong> sets k equal to the number of samples — each "fold" is a single observation. Extremely conservative and robust, but also extremely computationally expensive. Use when your dataset is small and you can afford the compute.</p>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "K-fold cross-validation diagram showing fold splits",
      caption: "Placeholder: visual showing 5-fold cross-validation — each row is one fold assignment, each column is a split iteration.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Cross-Validation Doesn't Replace a Held-Out Test Set",
      html: `<p>Even with cross-validation, hold out an external test set if you can. Cross-validation gives you a robust estimate of generalization <em>during model development</em>. A final held-out test set gives you an honest, untouched evaluation at the end. Use both when possible.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "When to Use Which",
      html: `<ul>
<li><strong>Large dataset, plentiful compute</strong> → simple train/validation/test split is most common in industry.</li>
<li><strong>Small dataset</strong> → k-fold or LOOCV extracts the most signal from limited data.</li>
<li><strong>Imbalanced classes</strong> → stratified k-fold is essential to ensure minority classes appear in every fold.</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "ds-prep-cv-q1",
      kind: "mc",
      question: "You're classifying medical records where only 3% of cases are positive (the condition you're trying to detect). You use standard k-fold cross-validation with k=10. What's the risk?",
      options: [
        {
          label: "Some folds may contain zero positive examples, making evaluation on those folds meaningless",
          correct: true,
          explanation: "Correct. With 3% positive rate and random fold assignment, small folds may have no positive examples at all. Training on such a fold gives you a model that never sees the class it needs to detect. The fix is stratified k-fold, which guarantees each fold has the same 3% positive rate as the full dataset.",
        },
        {
          label: "k=10 is too many folds — it will overfit to the training data",
          correct: false,
          explanation: "More folds mean each training set is larger (closer to the full dataset), which reduces overfitting risk. The issue here isn't the number of folds — it's the random assignment with a rare class.",
        },
        {
          label: "Cross-validation isn't appropriate for medical data due to privacy concerns",
          correct: false,
          explanation: "Cross-validation is a splitting strategy — it doesn't change how data is stored or who has access to it. Privacy concerns are about data governance, not evaluation methodology.",
        },
      ],
    },
  ],
};

export default crossValidation;
