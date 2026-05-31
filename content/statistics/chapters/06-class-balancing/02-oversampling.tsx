import type { Section } from "@brinnaebent/workbook";

const oversampling: Section = {
  id: "oversampling",
  number: 2,
  title: "Oversampling: Random and SMOTE",
  blocks: [
    {
      type: "text",
      html: `<p>Before getting to oversampling and undersampling, a quick hierarchy of options in order of preference:</p>
<ol>
<li><strong>Get more real minority-class data.</strong> Collecting genuine examples is almost always better than synthesizing them.</li>
<li><strong>Data augmentation</strong> (for images, audio, text). Transforms existing minority-class examples to produce new ones that preserve class membership.</li>
<li><strong>Oversampling or undersampling</strong> the existing data.</li>
</ol>
<p>If you can collect more genuine minority-class data, you almost always should. Synthetic methods are clever, but they're synthetic.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Random Oversampling",
      html: `<p>Duplicate examples from the minority class until it matches the majority class.</p>
<pre><code>from imblearn.over_sampling import RandomOverSampler
ros = RandomOverSampler(sampling_strategy='minority')
X_resampled, y_resampled = ros.fit_resample(X, y)</code></pre>
<p><strong>Catch:</strong> You're duplicating. The model sees identical examples multiple times, which can cause overfitting — it learns those specific examples rather than the pattern behind them.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "SMOTE — Synthetic Minority Oversampling Technique",
      html: `<p>Instead of duplicating, SMOTE creates synthetic minority examples by interpolating between existing ones:</p>
<ol>
<li>Pick a minority instance.</li>
<li>Find its k nearest neighbors (typically k=5).</li>
<li>Randomly choose one neighbor.</li>
<li>Create a new synthetic point somewhere on the line between them.</li>
</ol>
<pre><code>from imblearn.over_sampling import SMOTE
smote = SMOTE(k_neighbors=5)
X_resampled, y_resampled = smote.fit_resample(X, y)</code></pre>
<p><strong>Advantages:</strong> Less prone to overfitting than random oversampling. Introduces diversity.<br>
<strong>Caveats:</strong> Can add noise if minority class is itself noisy. Can blur class boundaries if classes overlap. Only works on continuous features — use SMOTE-NC for categorical features.</p>`,
    },
    {
      type: "interactive",
      component: "SMOTEVisualizer",
      caption: "Placeholder: Visualize SMOTE in 2D. See the minority class examples, the synthetic interpolated points, and how the decision boundary shifts.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch6-s2-q1",
      kind: "mc",
      question: "You apply SMOTE to a medical dataset with a mix of continuous and categorical features (like blood type and diagnosis codes). What should you be aware of?",
      options: [
        {
          label: "SMOTE works the same way on categorical features as continuous features",
          correct: false,
          explanation: "SMOTE interpolates between numeric feature values. Interpolating between two categorical values doesn't produce a meaningful third category — e.g., interpolating between 'blood type A' and 'blood type B' produces nonsense.",
        },
        {
          label: "SMOTE cannot be applied — use random oversampling instead",
          correct: false,
          explanation: "There's a variant called SMOTE-NC (Nominal and Continuous) designed for mixed feature types. You don't have to fall back to random oversampling.",
        },
        {
          label: "Standard SMOTE will produce invalid synthetic examples for categorical features; use SMOTE-NC for mixed data",
          correct: true,
          explanation: "Correct. Standard SMOTE interpolates between feature values, which is only meaningful for continuous data. SMOTE-NC handles categorical features separately, using the mode of nearest neighbors rather than interpolation.",
        },
        {
          label: "Encode all categoricals as numbers first, then apply SMOTE normally",
          correct: false,
          explanation: "Encoding categoricals as integers (nominal encoding) doesn't make interpolation meaningful. Interpolating between 'blood type A' (encoded as 0) and 'blood type B' (encoded as 1) to get 0.5 still produces a nonsensical category.",
        },
      ],
    },
  ],
};

export default oversampling;
