import type { Section } from "@brinnaebent/workbook";

const transparencyInterpretabilityExplainability: Section = {
  id: "transparency-interpretability-explainability",
  number: 7,
  title: "Transparency, Interpretability, Explainability",
  blocks: [
    {
      type: "text",
      html: `<p>These three terms get used interchangeably. They mean different things, and the distinction matters — especially as regulation increasingly demands them.</p>
<p><strong>Transparency</strong> is about <strong>documenting the system</strong>. Model architecture, training data, optimization procedure, source code access, data sheets. It enables verification, validation, accountability, and compliance. Transparency is what makes the other two possible — you can't interpret or explain a system whose internals are secret.</p>
<p><strong>Interpretable Machine Learning</strong> uses models that are <strong>inherently understandable</strong>. Decision trees you can trace through. Linear regression with examinable coefficients. Generalized Additive Models (GAMs). The model itself doesn't need additional explanation — the model <em>is</em> the explanation. Interpretable models are often preferred in regulated domains (medicine, finance, criminal justice) where the decision process must be auditable, not just the outcome.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Explainable AI (XAI)",
      html: `<p>Used for black-box models where the internal mechanism is too complex to inspect directly. XAI methods try to <em>approximate</em> the model's reasoning post-hoc:</p>
<ul>
<li><strong>SHAP</strong> — game-theoretic feature attributions showing each feature's contribution to a specific prediction.</li>
<li><strong>LIME</strong> — local linear approximations of model behavior around a specific prediction.</li>
<li><strong>Counterfactual explanations</strong> — "what would have had to be different for the outcome to change?"</li>
<li><strong>Saliency maps</strong> — for images, highlights which pixels most influenced the prediction.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Regulation Is Arriving",
      html: `<p>The EU's AI Act has explainability requirements for high-risk systems. US financial regulators require lenders to explain credit decisions. As AI expands into regulated domains, explainability is moving from a research interest to a compliance requirement. If you go into industry, this is a skill worth developing now rather than when the regulation lands on your desk.</p>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "SHAP explanation output showing feature contributions for a single prediction",
      caption: "Placeholder: example SHAP waterfall plot showing how each feature pushed a prediction above or below the baseline.",
    },
    {
      type: "checkpoint",
      id: "ds-ethics-xai-q1",
      kind: "mc",
      question: "A bank uses a deep neural network to make loan decisions. A regulator requires that denied applicants receive an explanation of why they were denied. The bank's ML team uses SHAP to generate post-hoc explanations. Is this transparency, interpretability, or explainability — and is it sufficient?",
      options: [
        {
          label: "Explainability (XAI) — it approximates the black-box model's reasoning post-hoc. Sufficiency depends on whether regulators accept post-hoc approximations.",
          correct: true,
          explanation: "Correct. SHAP generates post-hoc attributions for a model that is itself not inherently understandable — that's explainability, not interpretability. Whether it's sufficient depends on the regulator: some accept post-hoc explanations; others require interpretable models where the explanation is part of the model itself, not an approximation of it. This is an active legal and policy question.",
        },
        {
          label: "Transparency — SHAP makes the model's internals visible to the regulator",
          correct: false,
          explanation: "Transparency refers to documentation of the system (architecture, training data, code). SHAP doesn't make the internals of a neural network visible — it approximates local behavior from the outside. That's explainability.",
        },
        {
          label: "Interpretability — a neural network with SHAP explanations is an interpretable model",
          correct: false,
          explanation: "Interpretability means the model itself is inherently understandable — you can trace a decision tree or read regression coefficients. A neural network with SHAP is still a black box with post-hoc approximations. Interpretability is a property of the model; explainability is a post-hoc technique applied to opaque models.",
        },
      ],
    },
  ],
};

export default transparencyInterpretabilityExplainability;
