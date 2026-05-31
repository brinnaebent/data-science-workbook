import type { Section } from "@brinnaebent/workbook";

const dataLeakage: Section = {
  id: "data-leakage",
  number: 3,
  title: "Data Leakage: The Silent Killer",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Data leakage</strong> is when information from outside your training data sneaks into the training process. It is everywhere. It happens often. It is usually invisible until your model fails in deployment — and by then you've often already shipped it.</p>
<p>The five most common forms:</p>
<ul>
<li><strong>Test set used for hyperparameter tuning.</strong> The canonical form, covered in §5.1.</li>
<li><strong>Normalization computed on the full dataset.</strong> When you compute mean and standard deviation to standardize features, those statistics are <em>parameters of your pipeline</em>. If you compute them using the test data, your model has effectively seen the test set. <strong>Fix: compute scaling parameters on training data only, then apply them to validation and test.</strong></li>
<li><strong>EDA leaks.</strong> Insights you derive from looking at the full dataset can influence modeling decisions in subtle ways. Best practice: partition the test set <em>before</em> you do EDA.</li>
<li><strong>Feature engineering leaks.</strong> A feature like "average sales for this customer" — if computed across all data, including future transactions — leaks future information into training.</li>
<li><strong>Time-aware leaks.</strong> For time series, your test set should be the <em>future</em>, not random samples. Otherwise the model "knows" things that in production it shouldn't.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "A Good Rule of Thumb",
      html: `<p><em>Pretend the test set doesn't exist until the very last step.</em> Run all preprocessing, EDA, feature engineering, model selection, and hyperparameter tuning as if the test set will arrive tomorrow. Then evaluate exactly once. If you don't like the result, you don't get to go back and tune. That's the deal.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Pricing Model That Lost Money",
      html: `<p>A pricing model performed beautifully in backtests and lost money the moment it went live. The reason: backtests randomly sampled across years instead of training on past and testing on future. The model had been "predicting" past prices using future data. The leakage was invisible in metrics until the system actually went live. Time-aware splits are non-negotiable in any sequential domain.</p>`,
    },
    {
      type: "interactive",
      component: "LeakageDetector",
      caption: "Placeholder: interactive leakage checker — walk through a sample ML pipeline and identify which steps introduce leakage.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "ds-prep-leakage-q1",
      kind: "mc",
      question: "You standardize all features using sklearn's StandardScaler, fitting it on the entire dataset before splitting into train/test. What is wrong with this?",
      options: [
        {
          label: "The scaler learned the mean and std of the test set, so the model has implicitly seen test data statistics",
          correct: true,
          explanation: "Correct. StandardScaler.fit() computes the mean and standard deviation of every column. If you fit on the full dataset, those statistics incorporate test-set values — which your model technically shouldn't know about at training time. The fix: fit the scaler only on training data (scaler.fit(X_train)), then transform both sets (scaler.transform(X_train), scaler.transform(X_test)).",
        },
        {
          label: "StandardScaler shouldn't be used before splitting — use MinMaxScaler instead",
          correct: false,
          explanation: "The choice of scaler isn't the issue. Both StandardScaler and MinMaxScaler have the same leakage problem if fitted on the full dataset. The fix is in when you fit, not which scaler you use.",
        },
        {
          label: "Nothing is wrong — standardization is a preprocessing step that should be applied uniformly",
          correct: false,
          explanation: "Uniformity is correct in application (apply the same transform to train and test) but the parameters must be learned only from training data. Fitting on the full dataset is a form of leakage — it's subtle enough that it's one of the most common mistakes in ML pipelines.",
        },
      ],
    },
  ],
};

export default dataLeakage;
