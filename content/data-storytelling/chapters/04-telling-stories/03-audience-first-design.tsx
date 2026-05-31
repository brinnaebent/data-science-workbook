import type { Section } from "@brinnaebent/workbook";

const audienceFirstDesign: Section = {
  id: "audience-first-design",
  number: 3,
  title: "Audience-First Design",
  blocks: [
    {
      type: "text",
      html: `<p>Before you pick a visualization, ask three questions. The answers determine the chart, not your personal preference or the sophistication of the analysis.</p>
<ol>
<li><strong>Who is looking at this?</strong> A data scientist? An executive? A regulator? A clinician? A patient? Your default visualization should be calibrated to their visual literacy.</li>
<li><strong>What decision are they trying to make?</strong> A board approving a major investment needs the headline number front-and-center. A scientist reviewing a study needs the full distribution. A clinician making a treatment decision needs the patient's specific data, not aggregate trends.</li>
<li><strong>What do they already understand about plots?</strong> If the audience has never seen a box plot in their life, throwing one at them is malpractice. If the audience reads scientific papers all day, a bar chart of means with no error bars will annoy them.</li>
</ol>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Audience Defaults",
      html: `<ul>
<li><strong>Technical and statistical</strong> — full toolkit: violin plots, pair plots, faceted plots, log scales, complex multi-panel figures.</li>
<li><strong>Executive and product</strong> — default to bar charts, line plots, histograms. Simplify aggressively. One insight per chart.</li>
<li><strong>Regulatory and compliance</strong> — ask first. There are often field-specific conventions you're expected to follow.</li>
<li><strong>Clinical</strong> — ask first. Medicine has its own conventions (e.g., Kaplan–Meier curves for survival analysis), and using the right one matters for credibility.</li>
</ul>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "Audience-to-visualization mapping decision tree",
      caption: "Placeholder: decision tree diagram mapping audience type and decision context to recommended chart types.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Simplicity Is Harder Than Complexity",
      html: `<p>This isn't about dumbing things down. A good simple chart is harder to make than a good complex chart. Removing visual noise, picking the right scale, choosing labels that read naturally — these are skills that take practice. The act of asking "what does this person need to know?" also forces you to clarify what the insight actually <em>is</em> — which makes you a better analyst.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-stories-audience-q1",
      kind: "reflective",
      question: "Think of a real or hypothetical analysis you'd present to two different audiences: (1) your team's data scientists, and (2) your company's CEO. How would the same underlying finding be presented differently for each?",
      sampleAnswer: "For data scientists: a pair plot showing feature correlations, confusion matrix with per-class precision/recall, learning curves showing training vs. validation loss. For the CEO: a single bar chart showing 'model accuracy vs. previous system' (one number), a plain-language sentence about what the model does, and a bullet on business impact in dollar terms. The underlying finding is identical — the packaging is completely different.",
    },
  ],
};

export default audienceFirstDesign;
