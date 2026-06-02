import type { Section } from "@brinnaebent/workbook";

const handlingOutliersAndTransforms: Section = {
  id: "handling-outliers-and-transforms",
  number: 5,
  title: "Handling Outliers and Transforming Data",
  blocks: [
    {
      type: "text",
      html: `<p>Once you've detected outliers, you need to decide what to do. And regardless of outlier decisions, you'll almost always need to transform your features before modeling. The two tasks are related: handle outliers <em>before</em> applying scaling, since outliers distort both normalization and standardization.</p>
<p><strong>For response variable (Y) outliers</strong> — don't auto-remove. They may signal model deficiencies, incorrect assumptions, or missing features. Investigate first.</p>
<p><strong>For predictor (X) outliers</strong> — first determine whether they're influential (use Cook's distance or similar). If they significantly steer the model, investigate the root cause. If they're real, natural observations, leave them in. If they're errors, remove or correct them.</p>`,
    },
    {
      type: "text",
      html: `<h3>Common Transforms</h3><p><strong>Min-Max Scaling (Normalization).</strong> Rescales each feature to [0, 1]: $x_{\\text{scaled}} = (x - x_{\\min}) / (x_{\\max} - x_{\\min})$. Use when data is bounded or binary, or for computer vision (pixel values). Watch out: sensitive to outliers — a single extreme value compresses everything else into a narrow range.</p>
<p><strong>Z-Score Standardization.</strong> Rescales to zero mean and unit variance: $x_{\\text{standardized}} = (x - \\mu) / \\sigma$. Use when data is approximately Gaussian and unbounded. Helpful for clustering, PCA, and neural networks. Doesn't produce bounded output.</p>
<p><strong>Log Transformation.</strong> For right-skewed data: $x_{\\text{log}} = \\log(x + 1)$. Compresses large values, pulls the distribution toward normality. Required before linear regression, ANOVA, and models assuming normal features. Classic candidates: income, population, prices, word counts, file sizes.</p>`,
    },
    {
      type: "interactive",
      component: "TransformExplorer",
      caption: "Apply min-max, z-score, or log to a sample distribution and see the effect on shape and outlier behavior.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "ds-pre-transforms-q1",
      kind: "mc",
      question: "You're building a KNN classifier. One feature is age (range 20–80) and another is annual income (range $20,000–$2,000,000). You apply no scaling. What happens?",
      options: [
        {
          label: "Income will dominate the distance calculation — the age feature is effectively ignored",
          correct: true,
          explanation: "Correct. KNN computes distances between points. A difference of 60 in age and a difference of $1,980,000 in income are treated as raw numbers — the income difference is ~33,000× larger, so it dominates every distance calculation. Age becomes meaningless. The fix: standardize or normalize both features before computing distances.",
        },
        {
          label: "The model will automatically normalize features during training",
          correct: false,
          explanation: "KNN has no learning step — it just computes distances at prediction time using whatever values you pass. It does not normalize internally. You must do this preprocessing yourself.",
        },
        {
          label: "The wider-range feature (income) is more informative, so this is correct behavior",
          correct: false,
          explanation: "A wider range doesn't mean more informative — it means the raw numbers are larger. Whether income is more predictive than age is a domain question, not a scale question. Letting scale determine influence conflates the two.",
        },
      ],
    },
  ],
};

export default handlingOutliersAndTransforms;
