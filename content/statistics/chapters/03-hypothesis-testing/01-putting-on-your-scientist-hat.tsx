import type { Section } from "@brinnaebent/workbook";

const puttingOnYourScientistHat: Section = {
  id: "putting-on-your-scientist-hat",
  number: 1,
  title: "Putting On Your Scientist Hat",
  blocks: [
    {
      type: "text",
      html: `<p>Here's something that gets lost when we focus on shipping code: as a data scientist or ML engineer, you are doing science. You're forming hypotheses. You're designing experiments. You're drawing conclusions from evidence. Every time you tune hyperparameters, compare algorithms, or evaluate whether a new feature improved your model, you're doing hypothesis testing — whether you call it that or not.</p>
<p>This is genuinely overlooked in our field. We have to take off our software engineering hats sometimes and put on our scientist hats, because so much of what we do is, at its core, the scientific method dressed up in Python.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Learning Objectives",
      html: `<p>By the end of this chapter, you'll be able to:</p>
<ol>
<li>Formulate null and alternative hypotheses for a research question.</li>
<li>Walk through the full hypothesis testing procedure from hypothesis to decision.</li>
<li>Interpret p-values correctly and name the most common misinterpretations.</li>
<li>Distinguish Type 1 and Type 2 errors and reason about which matters more in context.</li>
<li>Apply Bonferroni correction when running multiple tests.</li>
<li>Recognize and avoid p-hacking.</li>
</ol>`,
    },
    {
      type: "text",
      html: `<p>Hypothesis testing is a formal procedure with six steps. The discipline of the procedure is its value — deviation from it is where bad science happens.</p>`,
    },
    {
      type: "interactive",
      component: "HypothesisTestingWalkthrough",
      caption: "Placeholder: Step-by-step walkthrough of a hypothesis test with a concrete example — adjust the inputs and see each step update.",
      props: {},
    },
  ],
};

export default puttingOnYourScientistHat;
