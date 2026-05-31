import type { Section } from "@brinnaebent/workbook";

const whyThreeSplits: Section = {
  id: "why-three-splits",
  number: 1,
  title: "Why Three Splits, Not Two",
  blocks: [
    {
      type: "text",
      html: `<p>Most tutorials show this: partition your data into a training set and a test set, train on training, evaluate on test, report the result. That's what most courses teach. It's also wrong for most real work.</p>
<p>Here's what happens in practice — and I've seen this at companies, not just in student projects:</p>
<ol>
<li>You train a model on training data.</li>
<li>You evaluate it on test data.</li>
<li>You don't love the results.</li>
<li>You change the architecture, tune hyperparameters, or try a different feature set.</li>
<li>You evaluate on test data again. Better. You iterate.</li>
<li>By the time you're done, your "test" set has effectively become a <em>training signal</em> — you've been making decisions based on it.</li>
</ol>
<p>That's data leakage. Your reported test performance is now a lie.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The Three-Split Solution",
      html: `<ul>
<li><strong>Train</strong> — for training the model.</li>
<li><strong>Validation</strong> — for tuning: hyperparameters, model architecture, feature decisions.</li>
<li><strong>Test</strong> — held out, untouched, used exactly <em>once</em> at the end to report final performance.</li>
</ul>
<p>If you have an external test set — data from a completely separate collection or time period — use that instead of a third split. If you don't, <strong>always split three ways</strong>.</p>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "Three-split diagram showing train, validation, and test sets",
      caption: "Placeholder: diagram of the three-split setup, showing which operations touch which sets.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Think About What Kind of Generalization You Need",
      html: `<p>Random shuffling is rarely the right split strategy for sequential or hierarchical data. A medical imaging model that splits randomly across patients — so the same patient's images appear in both train and test — is measuring memorization, not generalization. Think about what real-world deployment looks like: test on new patients, test on future time periods, test on new geographic regions. Make your split reflect the generalization you actually need.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "99% AUC → 70% in Production",
      html: `<p>A medical imaging model I heard about scored 99% AUC during evaluation and dropped to 70% in production. The cause: random train/test split across patients, so the same patient's images appeared in both sets. The model had memorized patients, not learned the disease. A proper patient-level split would have caught it before deployment.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-prep-splits-q1",
      kind: "mc",
      question: "You've trained a model, evaluated on your test set, and got 78% accuracy. You decide to try a different feature set and re-evaluate on the same test set — getting 82%. Which number should you report?",
      options: [
        {
          label: "Neither — you've contaminated the test set by making decisions based on it. You need a fresh held-out set.",
          correct: true,
          explanation: "Correct. The moment you used the test set to decide between two feature sets, it became a validation set. Reported test performance is only trustworthy if the test set was used exactly once, at the very end. The fix: use a validation set for model selection and reserve the test set for a single final evaluation.",
        },
        {
          label: "82% — it's the better model, so that's the performance to report",
          correct: false,
          explanation: "82% is an optimistic estimate. You've implicitly tuned to the test set by selecting the feature set that performed better on it. This is exactly how reported performance drifts upward while real-world performance stays flat.",
        },
        {
          label: "78% — report the first result since it was uncontaminated",
          correct: false,
          explanation: "Even the 78% is questionable now, because you've revealed information about the test set by comparing it to 82%. The only clean path is a genuinely held-out test set used once at the very end.",
        },
      ],
    },
  ],
};

export default whyThreeSplits;
