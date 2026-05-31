import type { Section } from "@brinnaebent/workbook";

const missingFeatures: Section = {
  id: "missing-features",
  number: 1,
  title: "Missing Features: Two Cautionary Tales",
  blocks: [
    {
      type: "text",
      html: `<p>Before we talk about missing <em>values</em>, let's talk about missing <em>features</em> — the variables you didn't measure that turn out to be necessary for a correct answer. This is more dangerous than missing values, because it's harder to detect.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Ice Cream and Shark Attack Problem",
      html: `<p>Ice cream sales and shark attacks are highly correlated. Both rise in summer. Does eating ice cream cause shark attacks? Of course not. The missing feature is <strong>temperature</strong>. Warm weather causes more ice cream eating <em>and</em> more people in the ocean <em>and</em> more shark encounters. Without temperature in the model, the correlation looks causal. It isn't. This is a confounder — a variable that influences both what you're measuring and what you're trying to predict.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "When Missing Features Invert the Conclusion",
      html: `<p>A famous UK study found that smoking by pregnant mothers <em>reduced</em> the rate of Down syndrome. The study was used to inform decisions. The problem: the model didn't include the mother's <strong>age</strong>, which is most strongly associated with Down syndrome risk. At the time, younger women smoked at higher rates than older women — so smokers as a group had lower Down syndrome rates. When you control for age, smoking actually <em>increases</em> the risk. The missing feature didn't just introduce noise. It inverted the conclusion entirely.</p>`,
    },
    {
      type: "text",
      html: `<p>Be conscientious about which features are in your model <em>and</em> which ones aren't. A model with the wrong feature set can confidently produce a wrong answer. In domains where causal inference matters — medicine, economics, public policy — the question of what's <em>not</em> in the model is taken as seriously as what is. Develop the habit of asking: what am I not measuring that could explain the pattern I'm seeing?</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-pre-missing-features-q1",
      kind: "mc",
      question: "A model predicts employee performance and finds that employees who drink more coffee perform better. You're about to recommend a coffee subsidy. What should you do first?",
      options: [
        {
          label: "Check for confounders — a third variable may cause both coffee consumption and performance",
          correct: true,
          explanation: "Correct. A likely confounder: hours worked. Employees who work longer hours drink more coffee and also produce more output. Without 'hours worked' in the model, coffee appears causally linked to performance. Adding the confounder may make the coffee effect disappear entirely — and save you from subsidizing caffeine for no gain.",
        },
        {
          label: "Run the model on a larger dataset to confirm the finding",
          correct: false,
          explanation: "A larger dataset gives you more confidence in a spurious correlation, not less. If the causal structure is wrong, more data makes you more confidently wrong. The issue is model specification, not sample size.",
        },
        {
          label: "The model is strong evidence — implement the subsidy and monitor the results",
          correct: false,
          explanation: "Correlation in a model without the right control variables is not strong evidence of causation. Acting on it without investigating confounders risks spending resources on something with no causal effect.",
        },
      ],
    },
  ],
};

export default missingFeatures;
