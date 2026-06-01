import type { Section } from "@brinnaebent/workbook";

const sixSteps: Section = {
  id: "six-steps-of-hypothesis-testing",
  number: 2,
  title: "The Six Steps",
  blocks: [
    {
      type: "text",
      html: `<p>Done well, hypothesis testing looks like this — six steps, in order, with no shortcuts.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Step 1: Formulate Hypotheses",
      html: `<p>You need two: a <strong>null hypothesis ($H_0$)</strong> and an <strong>alternative hypothesis ($H_1$)</strong>.</p>
<p>The null is the assumption of no significant difference or effect. The alternative is the claim you're trying to support. The null is what you're trying to produce evidence <em>against</em>.</p>
<p>Example: Testing a new image recognition algorithm against a baseline with 85% accuracy.</p>
<ul>
<li>$H_0$: The new algorithm's average accuracy equals 85%.</li>
<li>$H_1$: The new algorithm's average accuracy is greater than 85%.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Step 2: Select Your Statistical Test",
      html: `<p>Choose your test <em>before looking at the data</em>. Different tests are appropriate for different data structures. Part III of this textbook is about how to choose. For now: the test must be locked in a priori.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Step 3: Collect Your Data",
      html: `<p>Notice this is step three, not step one. Hypotheses and test choice must come before data collection. This is what separates a real experiment from a fishing expedition. The moment you look at data before forming a hypothesis, you're at risk of p-hacking (more on that shortly).</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Steps 4–6: Compute, Evaluate, Decide",
      html: `<p><strong>Step 4:</strong> Calculate the <strong>test statistic</strong> — a number computed from your sample that summarizes how far the data deviates from what the null predicts.</p>
<p><strong>Step 5:</strong> Calculate the <strong>p-value</strong> — the probability of seeing a test statistic at least as extreme as yours, assuming the null is true.</p>
<p><strong>Step 6:</strong> Make your decision. If $p \leq \alpha$ (your pre-chosen significance level), <strong>reject the null</strong>. Otherwise, <strong>fail to reject</strong>.</p>
<p>Critical language note: you <em>fail to reject</em> the null — you never "accept" it. The world is allowed to remain ambiguous.</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch3-s2-q1",
      kind: "mc",
      question: "A researcher collects data, looks at it, notices an interesting pattern, forms a hypothesis based on what she saw, then runs a statistical test on the same data. What is wrong with this approach?",
      options: [
        {
          label: "She should have used a larger sample",
          correct: false,
          explanation: "Sample size is a separate concern. The fundamental problem here is the order of operations.",
        },
        {
          label: "The hypothesis must be formed before data collection; forming it from the same data you'll test on inflates the false positive rate",
          correct: true,
          explanation: "Correct. When you use the data to generate your hypothesis and then test that same data, you're capitalizing on chance patterns. The test's assumptions about null distribution are violated because your hypothesis was shaped by the data — you'll find 'significant' results far more often than the nominal α would suggest.",
        },
        {
          label: "She should have used a different statistical test",
          correct: false,
          explanation: "The test choice is a secondary issue. Even the right test applied to a hypothesis-after-data-collection situation is biased.",
        },
        {
          label: "This is fine as long as she documents the process",
          correct: false,
          explanation: "Documentation doesn't fix the methodological problem. The issue is that tests run on data you've already looked at have inflated Type 1 error rates — documentation doesn't change that.",
        },
      ],
    },
  ],
};

export default sixSteps;
