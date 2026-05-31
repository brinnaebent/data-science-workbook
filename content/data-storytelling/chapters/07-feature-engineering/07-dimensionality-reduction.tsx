import type { Section } from "@brinnaebent/workbook";

const dimensionalityReduction: Section = {
  id: "dimensionality-reduction",
  number: 7,
  title: "Dimensionality Reduction",
  blocks: [
    {
      type: "text",
      html: `<p>When the number of features grows, several things go wrong: data becomes increasingly sparse (the <strong>curse of dimensionality</strong>), computational complexity grows, overfitting risk increases, distance measures become less meaningful, and visualization becomes impossible. Dimensionality reduction addresses this by projecting data into a lower-dimensional space while preserving as much information as possible.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "PCA — Principal Component Analysis",
      html: `<p>Unsupervised, optimal for dense data with approximately Gaussian features. Finds the directions (principal components) of maximum variance and projects onto the top <em>k</em> of them.</p>
<p><strong>Strengths:</strong> interpretable components, mathematically optimal for linear reduction, widely supported.</p>
<p><strong>Limitations:</strong> assumes linear relationships; sensitive to outliers; information is lost — you choose how much to sacrifice by choosing <em>k</em>.</p>`,
    },
    {
      type: "text",
      html: `<p><strong>t-SNE</strong> and <strong>UMAP</strong> are nonlinear methods designed to preserve local structure — nearby points in high dimensions stay nearby in the projection. Both are excellent for visualizing clusters and structure in high-dimensional data.</p>
<p>Critical distinction: <strong>t-SNE and UMAP are visualization tools, not feature extraction tools.</strong> Use them to <em>see</em> structure in your data. Don't use them as preprocessing steps for downstream prediction — the axes have no stable interpretation, and results can change with different random seeds. UMAP tends to preserve global structure better than t-SNE and runs faster; it's increasingly the preferred choice for exploration.</p>
<p>Two other methods worth knowing: <strong>Truncated SVD</strong> works like PCA but on sparse data — use it for TF-IDF vectors. <strong>Linear Discriminant Analysis (LDA)</strong> is supervised and finds axes that maximize class separation — use when you have class labels and want dimensionality reduction that's class-aware.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Compare Methods Interactively",
      html: `<p>The TensorFlow Embedding Projector (projector.tensorflow.org) lets you compare PCA, t-SNE, and UMAP on the same data interactively. Seeing how different methods organize the same high-dimensional space is one of the fastest ways to build intuition about what each method is preserving and what it's discarding.</p>`,
    },
    {
      type: "interactive",
      component: "DimReductionComparison",
      caption: "Placeholder: interactive comparison of PCA, t-SNE, and UMAP applied to a sample high-dimensional dataset.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "ds-fe-dr-q1",
      kind: "mc",
      question: "You've applied UMAP to visualize a dataset and can see four clear clusters in the 2D projection. Can you use these 2D coordinates as features for a classifier?",
      options: [
        {
          label: "Technically yes, but it's risky — UMAP coordinates aren't stable across runs and the projection is task-agnostic",
          correct: true,
          explanation: "Correct. UMAP is stochastic — the exact coordinates change with different random seeds. The projection also optimizes for visual cluster separation, not for any downstream task. If you train a classifier on UMAP coordinates and then apply it to new data, you can't guarantee the new UMAP projection will be spatially consistent with the training projection. For actual prediction, use PCA or the original features directly.",
        },
        {
          label: "Yes — the clusters are clearly visible, so the 2D coordinates are high-quality features",
          correct: false,
          explanation: "Visual clarity doesn't imply feature stability or downstream usefulness. UMAP coordinates are a nonlinear, stochastic projection — they're great for showing you that structure exists, not for building a replicable prediction pipeline on top of.",
        },
        {
          label: "No — UMAP always destroys information, making its output useless for modeling",
          correct: false,
          explanation: "UMAP can preserve structure well enough to be useful. The issue isn't information destruction — it's stability and interpretability. For exploration, UMAP is excellent. For features you'll use in a deployed model, PCA is more appropriate.",
        },
      ],
    },
  ],
};

export default dimensionalityReduction;
