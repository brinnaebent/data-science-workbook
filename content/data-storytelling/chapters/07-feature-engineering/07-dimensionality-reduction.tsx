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
      type: "interactive",
      component: "PCAExplorer",
      caption: "Four-step walkthrough of PCA: rotate an axis to see how variance changes, observe the eigenvector decomposition, watch a 2D-to-1D projection with its reconstruction error, then use a scree plot to choose k.",
      props: {},
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
      type: "article",
      href: "https://projector.tensorflow.org/",
      imageSrc: "/data-storytelling/tf-projector.png",
      imageAlt: "TensorFlow Embedding Projector",
      publisher: "TensorFlow",
      title: "Embedding Projector",
      excerpt: "Visualize high-dimensional data — explore word embeddings in 2D and 3D using PCA, t-SNE, and UMAP.",
      ctaLabel: "Open tool",
    },
  ],
};

export default dimensionalityReduction;
