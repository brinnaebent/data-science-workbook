import type { Section } from "@brinnaebent/workbook";

const evaluationChecklist: Section = {
  id: "evaluation-checklist",
  number: 5,
  title: "The Evaluation Checklist",
  blocks: [
    {
      type: "text",
      html: `<p>When you're evaluating a model, walk through this checklist. Every item maps back to something in this unit.</p>`,
    },
    {
      type: "interactive",
      component: "EvaluationChecklist",
      caption: "Work through each evaluation step and check it off. Progress is tracked as you go.",
      props: {},
    },
  ],
};

export default evaluationChecklist;
