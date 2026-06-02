import type { Section } from "@brinnaebent/workbook";

const fromNotebookToTheWorld: Section = {
  id: "from-notebook-to-the-world",
  number: 1,
  title: "From Notebook to the World",
  blocks: [
    {
      type: "text",
      html: `
<p>Most ML projects that fail don't fail because the model was bad. They fail because nobody built the operations layer, or because the model made it to production and quietly broke — and nobody was watching. A model without an operations layer is a project. A model with one is a product.</p>`,
    },
    {
      type: "interactive",
      component: "MLOpsLifecycleGrid",
      caption: "",
    },
    {
      type: "checkpoint",
      id: "eng-ch3-s1-q1",
      kind: "mc",
      question: "Six months after deploying a fraud detection model, the ops team reports that the false positive rate has tripled — the model is incorrectly flagging three times as many legitimate transactions as fraudulent. The model hasn't been retrained. What is the most likely explanation?",
      options: [
        {
          label: "The model was undertrained — it didn't see enough data before deployment",
          correct: false,
          explanation: "Undertraining would have been apparent immediately after deployment. A problem that appears six months later and wasn't present at launch points to something that changed over time — not a static training deficiency.",
        },
        {
          label: "Data drift — the distribution of transaction patterns has shifted since the model was trained, making the model's learned decision boundary misaligned with current data",
          correct: true,
          explanation: "Correct. Fraud patterns evolve as fraudsters adapt to detection systems, merchant behavior changes, and user habits shift seasonally. A model trained on last year's transaction data may have learned patterns that are no longer representative. The gradual degradation over six months is a textbook data drift signature.",
        },
        {
          label: "The model's threshold was changed after deployment",
          correct: false,
          explanation: "A threshold change is possible, but it would typically be documented and intentional. Gradual, unexplained drift over six months is more consistent with distributional shift than a configuration change.",
        },
        {
          label: "The serving infrastructure introduced a bug in how predictions are rounded",
          correct: false,
          explanation: "An infrastructure bug would likely produce discontinuous behavior — a sudden jump at a point in time when code was deployed. Gradual drift over six months suggests distributional shift rather than a code defect.",
        },
      ],
    },
  ],
};

export default fromNotebookToTheWorld;
