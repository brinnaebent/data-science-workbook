import type { Section } from "@brinnaebent/workbook";

const typeErrors: Section = {
  id: "type-1-and-type-2-errors",
  number: 3,
  title: "Type 1 and Type 2 Errors",
  blocks: [
    {
      type: "text",
      html: `<p>Any time you run a hypothesis test, you can be wrong in two distinct ways. Understanding these errors — and which one you care about more — is one of the most important practical skills in this unit.</p>
<p>A <strong>Type 1 error</strong> is a false positive: you rejected a true null hypothesis. You concluded there was an effect when there wasn't one.</p>
<p>A <strong>Type 2 error</strong> is a false negative: you failed to reject a false null hypothesis. There really was an effect, and you missed it.</p>`,
    },
    {
      type: "image",
      src: "/stats/bday.png",
      alt: "Difference between T1 error and T2 error",
      width: "100%",
      caption: `Type 1 vs. Type 2 Error`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "A Mnemonic That Sticks",
      html: `<p>Imagine you're trying to remember if it's someone's birthday.</p>
<ul>
<li><strong>Type 1 error:</strong> You say "happy birthday" — and it's not their birthday. (False positive.)</li>
<li><strong>Type 2 error:</strong> You say nothing — and it <em>is</em> their birthday. (False negative.)</li>
</ul>
<p>Which is worse depends entirely on who the person is. For a colleague you barely know: Type 1 (saying happy birthday incorrectly) is mildly awkward. For your partner: Type 2 (forgetting) could be catastrophic!</p>`,
    },
    {
      type: "text",
      html: `<p>Let's anchor this with a more permanent example: you build a machine learning model that detects cancer.</p>
<ul>
<li>A <strong>Type 1 error</strong> means your model tells a patient they have cancer when they don't. They may undergo unnecessary biopsies, treatments, and serious psychological distress.</li>
<li>A <strong>Type 2 error</strong> means your model fails to detect cancer that's actually there. The patient doesn't receive treatment, the disease progresses.</li>
</ul>
<br>
<p>If you have to favor one, you'd rather have the false alarm. Missing a real cancer is far worse than triggering a follow-up test. This shapes everything: the decision threshold, the loss function, which metric you optimize for.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "This Trade-off Is Everywhere in ML",
      html: `<p>Fraud detection skews the same direction: a missed fraud (Type 2) is usually worse than a false flag (Type 1) that a human can review. Medical screening tests are deliberately tuned toward Type 1 errors. Content moderation may trade off differently depending on the platform's values.</p>
<p>Your choice of decision threshold and your primary evaluation metric both encode an implicit answer to the Type 1 / Type 2 trade-off. Make that choice deliberately — don't let it happen by default!</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch3-s3-q1",
      kind: "mc",
      question: "You're building a model to detect critical equipment failures in a factory. A missed failure (no alert when failure is imminent) could cause a catastrophic accident. A false alarm (alert when no failure is coming) causes a brief, costly shutdown. Which error type should you minimize, and what does that imply about your threshold?",
      options: [
        {
          label: "Minimize Type 1 errors (false alarms); raise the threshold so you only alert when very confident",
          correct: false,
          explanation: "Raising the threshold reduces false alarms but increases missed failures — which are catastrophic here. This gets the trade-off backwards.",
        },
        {
          label: "Minimize Type 2 errors (missed failures); lower the threshold so you catch more real failures at the cost of more false alarms",
          correct: true,
          explanation: "Correct. A missed failure is catastrophic, a false alarm is costly but manageable. So you want high recall (low Type 2 error rate), accepting more false alarms to ensure you don't miss real events. This means lowering the classification threshold.",
        },
        {
          label: "Both errors are equal; use the default threshold of 0.5",
          correct: false,
          explanation: "The problem explicitly states that missed failures are much worse than false alarms. The errors are not equal here. Treating them symmetrically — as a default 0.5 threshold does — fails to incorporate the domain's cost structure.",
        },
        {
          label: "Optimize for accuracy, since it balances both error types",
          correct: false,
          explanation: "Accuracy averages over both error types equally, ignoring that they have very different consequences. In any domain with asymmetric costs, accuracy is the wrong metric.",
        },
      ],
    },
  ],
};

export default typeErrors;
