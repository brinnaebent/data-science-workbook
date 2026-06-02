import type { Section } from "@brinnaebent/workbook";

const undersampling: Section = {
  id: "undersampling",
  number: 3,
  title: "Undersampling: Random and Tomek Links",
  blocks: [
    {
      type: "text",
      html: `<h3>Random Undersampling</h3>
<p>Discard majority-class examples until you match the minority class.</p>
<pre><code>from imblearn.under_sampling import RandomUnderSampler
rus = RandomUnderSampler(sampling_strategy='majority')
X_resampled, y_resampled = rus.fit_resample(X, y)</code></pre>
<p><br><strong>The cost:</strong> You're throwing away real data. Sometimes that's fine — if you have a million majority examples and a thousand minority examples, you can afford to discard most of the majority. However, every discarded example is information you'll never recover.</p>`,
    },
    {
      type: "text",
      html: `<h3>Tomek Links</h3>
<p>A smarter form of undersampling. A Tomek link exists between two examples of different classes that are each other's nearest neighbors — meaning they sit right on top of the decision boundary. Tomek links removes the majority-class member from each such pair.</p>
<p>The intuition: these boundary cases are noisy or genuinely ambiguous observations. Removing them helps the model find a cleaner decision boundary.</p>
<pre><code>from imblearn.under_sampling import TomekLinks
tl = TomekLinks()
X_resampled, y_resampled = tl.fit_resample(X, y)</code></pre>
<p><br><strong>Good use:</strong> As a complement to SMOTE — apply SMOTE first to balance, then Tomek links to clean up the noisy boundary that may have formed.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Golden Rule: Resample Training Data Only",
      html: `<p>Your test set should always reflect the real-world distribution. If you resample your full dataset <em>then</em> split into train and test, your test set is no longer representative of production — and your evaluation will be optimistic.</p>
<br><p><strong>Always: split first, resample the training set only.</strong> This is the single most commonly violated rule in ML work involving imbalanced data.</p>`,
    },
    {
      type: "interactive",
      component: "ClassBalancingComparison",
      caption: "The same imbalanced dataset across four resampling strategies — compare how each technique changes the composition and distribution of training points.",
      props: {},
    },
  ],
};

export default undersampling;
