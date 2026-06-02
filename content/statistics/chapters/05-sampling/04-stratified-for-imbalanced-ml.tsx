import type { Section } from "@brinnaebent/workbook";

const stratifiedForImbalancedML: Section = {
  id: "stratified-sampling-for-imbalanced-ml",
  number: 4,
  title: "Stratified Sampling for Imbalanced ML",
  blocks: [
    {
      type: "text",
      html: `<p>The most concrete place sampling concepts hit your ML workflow is class imbalance. If your dataset has 95% one class and 5% another, a naive random train/val/test split can produce a test set with very few minority-class examples — making your evaluation metrics noisy and your model's behavior on the minority class unstable.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The Two-Line Fix",
      html: `<pre><code>from sklearn.model_selection import train_test_split, StratifiedKFold

# Stratified train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Stratified cross-validation
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for train_idx, val_idx in skf.split(X, y):
    ...</code></pre>
<p>Pass <code>stratify=y</code> to <code>train_test_split</code> and the class distribution is preserved across both splits. <code>StratifiedKFold</code> does the same for cross-validation. These are the simplest, highest-leverage habits to build for imbalanced classification.</p>`,
    },
    {
      type: "text",
      html: `<p>Note: stratified sampling preserves the imbalance — it doesn't fix it. If your dataset is 95/5, your training and test sets will both be 95/5. The goal of stratification is representativeness, not balance. For actually addressing the imbalance, see the next chapter on class balancing techniques.</p>`,
    },
    {
      type: "interactive",
      component: "StratifiedSplitExplorer",
      caption: "Compare random vs. stratified train/test splits on an imbalanced dataset. Notice how random splits can produce test sets with very few — or zero — minority examples, while stratified splits preserve the true class ratio in both sets.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch5-s4-q1",
      kind: "mc",
      question: "You apply SMOTE to your dataset to oversample the minority class, then do a stratified train/test split. What's wrong with this order of operations?",
      options: [
        {
          label: "SMOTE should only be applied after stratified splitting — to the training set only",
          correct: true,
          explanation: "Correct. If you apply SMOTE before splitting, synthetic minority examples land in both your training and test sets. Your test set no longer reflects the real-world distribution — it's been artificially balanced. This gives optimistic test metrics that won't hold in production. Always: split first, resample training only.",
        },
        {
          label: "Stratified splitting should not be used with SMOTE",
          correct: false,
          explanation: "Stratified splitting is still valuable even when you plan to resample — it ensures the test set preserves the real imbalance. The order of operations is the problem, not the combination.",
        },
        {
          label: "SMOTE before splitting is fine because synthetic data is clearly not real data",
          correct: false,
          explanation: "Your test set is supposed to represent real-world conditions. Including synthetic data in it violates that assumption, regardless of whether you 'know' it's synthetic.",
        },
        {
          label: "Nothing is wrong — SMOTE improves all downstream analysis",
          correct: false,
          explanation: "SMOTE should only modify your training data. Leaking synthetic examples into the test set corrupts your evaluation metrics.",
        },
      ],
    },
  ],
};

export default stratifiedForImbalancedML;
