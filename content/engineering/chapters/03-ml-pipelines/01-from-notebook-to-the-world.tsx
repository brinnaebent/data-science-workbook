import type { Section } from "@brinnaebent/workbook";

const fromNotebookToTheWorld: Section = {
  id: "from-notebook-to-the-world",
  number: 1,
  title: "From Notebook to the World",
  blocks: [
    {
      type: "text",
      html: `<p>Here is the part of the ML lifecycle that nobody teaches you in school: finishing the model is not the finish line. It's the starting gun for a second race — one that involves containers, CI/CD pipelines, monitoring dashboards, rollback procedures, and the uncomfortable question of what happens when your model starts making worse predictions and nobody notices for six months.</p>
<p>Most ML projects that fail don't fail because the model was bad. They fail because nobody built the operations layer, or because the model made it to production and quietly broke — and nobody was watching. A model without an operations layer is a science project. A model with one is a product.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Learning Objectives",
      html: `<p>By the end of this chapter, you'll be able to:</p>
<ol>
<li>Map the full MLOps lifecycle from design through deployment and monitoring.</li>
<li>Compare deployment strategies — container, serverless, edge, managed platform — and recommend one for a given scenario.</li>
<li>Read and write a basic Dockerfile and explain what each instruction does.</li>
<li>Define data drift and describe how monitoring detects and responds to it.</li>
<li>Describe a CI/CD pipeline for an ML project: what gets tested, what gets versioned, what triggers a rollback.</li>
<li>Name the four things you must version in an ML system and explain why each matters.</li>
<li>Choose a prototyping framework for a given audience and timeline.</li>
</ol>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The MLOps Lifecycle",
      html: `<p><strong>MLOps</strong> — Machine Learning Operations — is the practice of treating ML systems as production software. The lifecycle has three phases:</p>
<ol>
<li><strong>ML Design</strong> — requirements, use case prioritization, data acquisition, problem framing. This course's first two units live here.</li>
<li><strong>Model Development</strong> — data prep, feature engineering, training, experimentation, evaluation. The part you'll do most in your modeling courses.</li>
<li><strong>Operations</strong> — deployment, CI/CD, monitoring, triggered retraining. The part that gets you paged at 2 a.m. This chapter is mostly here.</li>
</ol>
<p>The cost distribution is backwards from what intuition suggests. In industry, phase 3 consumes more engineering time than phases 1 and 2 combined — because a production system runs forever, and the model was trained once.</p>`,
    },
    {
      type: "image",
      src: "/images/engineering/mlops-lifecycle.png",
      alt: "MLOps lifecycle diagram with three phases: ML Design (requirements, data acquisition), Model Development (training, evaluation), and Operations (deployment, monitoring, retraining), arranged in a cycle",
      caption: "MLOps treats model development as the beginning, not the end. The operations phase is where production systems live — and where most engineering effort is spent.",
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
