import type { Section } from "@brinnaebent/workbook";

const versioningAndReproducibility: Section = {
  id: "versioning-and-reproducibility",
  number: 4,
  title: "Versioning and Reproducibility",
  blocks: [
    {
      type: "text",
      html: `<p>Reproducibility is the goal: someone restarting your work from scratch should arrive at the same results. This sounds obvious until you're six months into a project and can't remember which version of the preprocessing script produced the model that's currently in production.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Best Practices for Data Versioning",
      html: `<ul>
<li><strong>Use version control</strong> — for data transformations alongside code.</li>
<li><strong>Write meaningful commit messages</strong> — your future self is the primary user.</li>
<li><strong>Maintain a data catalog</strong> — a metadata file describing each dataset version: what it contains, where it came from, what was cleaned.</li>
<li><strong>Consistent folder structure</strong> — raw / interim / processed / final. Stick to it.</li>
<li><strong>Document and share your versioning practices</strong> with the team before work starts, not after.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>Increasingly sophisticated tools exist for data versioning: <strong>DVC</strong> (Data Version Control), <strong>MLflow</strong>, <strong>Weights &amp; Biases</strong>, <strong>LakeFS</strong>. These treat data with the same rigor we treat code. If you go into industry, expect to encounter at least one of these on any serious ML team. Learning one as a student is a genuine résumé differentiator.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "A Small Honesty Moment",
      html: `<p>This is hard to do in a classroom setting. You're working with multiple people, rushed, under deadline pressure. "Consistency" is the first casualty. I have absolutely cut corners here in my own career and regretted it — sometimes losing an entire day trying to figure out which version of a dataset produced which model. Practice the discipline in the classroom so it becomes second nature in industry. The ten extra minutes you spend on documentation now save you an entire day of confusion six months from now.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-prep-versioning-reflect",
      kind: "reflective",
      question: "Imagine you trained a model three months ago that's now running in production. Your manager asks you to retrain it with new data — but the original preprocessing script is gone and you don't remember the exact steps. What would you have done differently at the start of the project to prevent this situation?",
      sampleAnswer: "Version-controlled the preprocessing scripts alongside the model code; maintained a README or data catalog entry documenting the exact steps applied to produce each dataset version; used a tool like DVC or MLflow to link dataset versions to model versions; and set a consistent folder structure so raw, interim, and processed data are clearly separated. The key insight is that data work needs the same engineering discipline as code — and that 'I'll document it later' is a lie you tell yourself.",
    },
  ],
};

export default versioningAndReproducibility;
