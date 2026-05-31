import type { Section } from "@brinnaebent/workbook";

const howGoodIsMyModel: Section = {
  id: "how-good-is-my-model",
  number: 1,
  title: "How Good Is My Model, Actually?",
  blocks: [
    {
      type: "text",
      html: `<p>You've trained a model. The metrics look promising. You're ready to ship.</p>
<p>Before you do, there are a few questions that go beyond accuracy or RMSE. Does this model fit the data well? Is it the right kind of complex? Are there hidden structures in the errors that suggest you've missed something? Is the relationship you found real, or an artifact of how you sliced the data?</p>
<p>Model evaluation is the toolkit for asking these questions rigorously. It's also where statistics circles back to ML in the most direct way — the same concepts we've been building (residuals, hypothesis tests, confidence intervals) become tools for deciding whether your model is trustworthy.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Learning Objectives",
      html: `<ol>
<li>Define goodness-of-fit and apply R², AIC, and BIC.</li>
<li>Conduct residual analysis to validate regression model assumptions.</li>
<li>Construct and interpret confidence intervals using Z and T methods.</li>
<li>Identify Simpson's Paradox and design analyses that detect it.</li>
<li>Apply a complete model evaluation checklist to a real model.</li>
</ol>`,
    },
  ],
};

export default howGoodIsMyModel;
