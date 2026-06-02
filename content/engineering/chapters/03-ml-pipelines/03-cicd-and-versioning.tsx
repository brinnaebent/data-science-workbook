import type { Section } from "@brinnaebent/workbook";

const cicdAndVersioning: Section = {
  id: "cicd-and-versioning",
  number: 3,
  title: "CI/CD and Versioning Everything",
  blocks: [
    {
      type: "text",
      html: `<p>In software engineering, CI/CD — Continuous Integration / Continuous Deployment — is the practice of automating the testing and release of code. Push a change; tests run automatically; if they pass, the change ships. If they fail, it doesn't.</p>
<p>In ML, CI/CD gets harder. You're not just testing code. You're testing code, data, and models — and each one can fail independently while the others look fine. A model can pass its evaluation metrics on a frozen test set and still perform badly in production because the data distribution has shifted since the test set was created. You need to test all three layers.</p>`,
    },
    {
      type: "interactive",
      component: "MLCICDPipeline",
      caption: "",
    },
    {
      type: "text",
      html: `<p>The other half of this section is versioning — and it's one of the most neglected practices in ML engineering. In software, you version code with Git. In ML, you have three additional things to version, and failing to track any of them means you cannot debug, reproduce, or audit your system.</p>`,
    },
    {
      type: "interactive",
      component: "VersioningGrid",
      caption: "",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Start Versioning on Your First Model, Not Your Tenth",
      html: `<p>Every team I've talked to that doesn't version data says the same thing: "we'll add it later when the system is more mature." Then "later" never comes, the system grows, and retrofitting versioning onto an existing production system is orders of magnitude harder than building it in from the start.</p>
<p>The muscle of version-everything-from-day-one is the most valuable habit you can build now, when the stakes are low. Your future self — and future colleagues, and future auditors — will thank you.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Tools Worth Knowing",
      html: `<ul>
<li><strong>MLflow</strong> — open-source experiment tracking and model registry. Log parameters, metrics, and artifacts for each training run. Compare runs across experiments. One of the most widely-used MLOps tools in industry.</li>
<li><strong>DVC (Data Version Control)</strong> — Git for datasets. Track large files that can't go in Git itself, with pointers stored in the repo and the data in S3 or GCS.</li>
<li><strong>Weights & Biases (W&B)</strong> — experiment tracking, hyperparameter sweeps, model versioning. Popular in research and in companies that want a richer UI than MLflow provides Students get this for free, so it is worth trying out now!</li>
<li><strong>GitHub Actions / GitLab CI</strong> — general-purpose CI/CD. Write a YAML file that defines what to run when code is pushed. Most ML teams layer MLflow on top of GitHub Actions for the ML-specific parts.</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "eng-ch3-s3-q1",
      kind: "mc",
      question: "A team retrained their demand forecasting model and deployed it. Two weeks later, performance is noticeably worse. They want to roll back to the previous version — but they discover that the training data was overwritten with the new version's training set, and the previous model artifact wasn't saved. What could they have done to avoid this situation?",
      options: [
        {
          label: "Used a larger training dataset",
          correct: false,
          explanation: "Dataset size doesn't address the rollback problem. The issue is that previous artifacts weren't preserved — a versioning problem, not a data quantity problem.",
        },
        {
          label: "Versioned both the model artifact and the training data, so any previous version can be restored",
          correct: true,
          explanation: "Correct. If model artifacts are stored in a model registry (MLflow, W&B) and training datasets are versioned (DVC, lakeFS), rolling back to the previous version means restoring the previous model artifact and optionally retraining on the versioned historical dataset. Both are trivial operations when versioning is in place — and impossible without it.",
        },
        {
          label: "Deployed the new model as a canary release first",
          correct: false,
          explanation: "Canary releases are a deployment strategy (gradually shift traffic to the new version). They reduce risk by catching problems early — but they don't help once the rollback is needed and the previous artifacts don't exist.",
        },
        {
          label: "Run more evaluation metrics before deployment",
          correct: false,
          explanation: "More evaluation can reduce the risk of shipping a bad model, but it can't substitute for the ability to roll back when something goes wrong in production. These are separate concerns.",
        },
      ],
    },
  ],
};

export default cicdAndVersioning;
