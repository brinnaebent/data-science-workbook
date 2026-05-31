import type { Section } from "@brinnaebent/workbook";

const labelingData: Section = {
  id: "labeling-data",
  number: 6,
  title: "Labeling Data",
  blocks: [
    {
      type: "text",
      html: `<p>Sometimes the data you get is already labeled. Most of the time, it isn't — and someone has to label it. <strong>Labeling</strong> (also called annotation) is the process of attaching the target variable or other structured information to each example. It's unglamorous, it's expensive, and it's where a lot of projects go wrong.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Even Experts Disagree",
      html: `<p>If you give a panel of experienced radiologists the same set of images, you will get different diagnoses on the same image. Inter-annotator disagreement is <strong>normal</strong>, not necessarily a sign that something went wrong. Plan for it from the start with:</p>
<ul>
<li><strong>Clear labeling guidelines</strong> written down before you start.</li>
<li><strong>Multiple annotators per item</strong> with explicit disagreement-resolution protocols.</li>
<li><strong>Double-blind annotation</strong> where labelers don't see each other's work.</li>
<li><strong>Domain experts in the loop</strong> for ambiguous cases.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>Tools like <strong>CVAT</strong> (Computer Vision Annotation Tool) and similar platforms can dramatically speed up labeling using a human-in-the-loop pattern: an AI proposes a label, a human reviews and corrects. The human is still essential, but throughput is enormously higher than pure manual labeling. This is what production annotation actually looks like.</p>`,
    },
    {
      type: "interactive",
      component: "LabelingWorkflow",
      caption: "Demonstration of the human-in-the-loop annotation workflow — AI proposal → human review → accept/correct → next item.",
      props: {},
    },
    {
      type: "callout",
      variant: "example",
      title: "Labeling Is Often the Largest Line Item",
      html: `<p>In industry, labeling is often the single largest line item in an ML project budget. Companies like Scale AI exist precisely because labeling is so labor-intensive and quality-critical. If you can make labeling 20% more efficient on a large project, you have produced an enormous amount of value.`,
    },
    {
      type: "text",
      html: `<p>There are many platforms for labeling data with varying degrees of customizability. Some common ones include Prolific, Amazon Mechanical Turk, and Scale AI. If you want ownership over the entire process, you can spin up an EC2 instance using the open source Label Studio.</p>`,
    },
    {
      type: "article",
      href: "https://labelstud.io/",
      imageSrc: "/data-storytelling/labelstudio.png",
      imageAlt: "Label Studio - open source data annotation",
      publisher: "Label Studio",
      category: "Data Labeling",
      title: "Open Source Data Labeling with Label Studio",
      excerpt: "Here's a tool for you to check out: Label Studio is open source: spin up an EC2 instance and send your annotators a link to label.",
      byline: "Label Studio",
    },
    {
      type: "checkpoint",
      id: "ds-sourcing-labeling-q1",
      kind: "mc",
      question: "Two annotators are labeling sentiment in customer reviews. On 30% of examples they disagree (one labels 'positive', the other 'neutral'). What is the best response?",
      options: [
        {
          label: "Review the labeling guidelines, clarify the boundary between 'positive' and 'neutral', then re-annotate the disagreements with a third annotator or adjudicator",
          correct: true,
          explanation: "Correct. A 30% disagreement rate signals that the boundary between categories is under-specified in the guidelines. The fix is upstream: tighten the definition, then resolve the disputed examples with a principled process — not by picking one annotator's labels arbitrarily.",
        },
        {
          label: "Keep both annotations and let the model figure out the ambiguity during training",
          correct: false,
          explanation: "Passing noisy, contradictory labels directly to a model teaches it contradictory patterns. The model can't resolve ambiguity that the annotation process hasn't resolved — it will just learn noise.",
        },
        {
          label: "Randomly pick one annotator's labels for each disputed example to maintain dataset size",
          correct: false,
          explanation: "Random selection introduces systematic inconsistency without improving label quality. You'd have a large dataset with unreliable labels — which is often worse than a smaller dataset with reliable ones.",
        },
      ],
    },
  ],
};

export default labelingData;
