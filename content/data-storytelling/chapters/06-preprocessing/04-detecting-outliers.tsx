import type { Section } from "@brinnaebent/workbook";

const detectingOutliers: Section = {
  id: "detecting-outliers",
  number: 4,
  title: "Detecting Outliers",
  blocks: [
    {
      type: "text",
      html: `<p>Outliers are points far from the rest. They can be measurement errors, data entry errors, processing artifacts — or real, important observations that just happen to be extreme. <strong>The data alone usually can't tell you which.</strong> That's why domain knowledge is the essential second step after detection.</p>
<p>Five sources of outliers to keep in mind:</p>
<ul>
<li><strong>Measurement error</strong> — faulty or miscalibrated instrument.</li>
<li><strong>Data entry error</strong> — a human typed the wrong thing.</li>
<li><strong>Experimental error</strong> — something went wrong during collection.</li>
<li><strong>Data processing error</strong> — a pipeline bug introduced an artifact.</li>
<li><strong>True outliers</strong> — real, natural observations that just happen to be extreme.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Detection Methods",
      html: `<p><strong>Visual.</strong> Scatter plots and box plots. Anything outside the box plot's whiskers is conventionally flagged.</p>
<p><strong>Z-score method.</strong> Assumes approximate normality. Compute $z = (x - \\mu) / \\sigma$ for each point. Flag any point where $|z| > k$. Common choice: $k = 3$. Sensitive to the normality assumption — if your data isn't approximately normal, the z-score method will mis-flag.</p>
<p><strong>IQR method.</strong> Does not assume normality — more general. Upper threshold: $Q3 + k \\times IQR$; lower threshold: $Q1 - k \\times IQR$, where $k = 1.5$ is conventional. Any point outside this range is flagged.</p>
<p><strong>Cook's distance.</strong> For regression: measures how much the regression parameters change when a specific point is removed. Useful for identifying <em>influential</em> observations — points that disproportionately steer the model.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Don't Assume Outliers Are Noise",
      html: `<p>In fraud detection, <em>the outliers are the point</em> — you're hunting them, not removing them. In sensor monitoring, outliers might be equipment failures you need to flag immediately. In customer analytics, outliers might be your most valuable customers. Always investigate before deciding what to do with an outlier.</p>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "Box plot and z-score comparison showing flagged outliers",
      caption: "Placeholder: side-by-side comparison of IQR and z-score outlier detection on right-skewed data, showing where each method flags differently.",
    },
    {
      type: "checkpoint",
      id: "ds-pre-outliers-q1",
      kind: "mc",
      question: "Your feature is right-skewed (long right tail). You want to detect outliers. Which method is more appropriate — z-score or IQR?",
      options: [
        {
          label: "IQR method — it doesn't assume normality, making it more appropriate for skewed distributions",
          correct: true,
          explanation: "Correct. The z-score method assumes the data is approximately normally distributed. Right-skewed data violates this assumption — the z-score method will either miss real outliers on the right tail or falsely flag many legitimate values on the left. IQR uses the median and quartiles, which are robust to skew.",
        },
        {
          label: "Z-score method — it's more statistically rigorous",
          correct: false,
          explanation: "The z-score method is more rigorous <em>when the normality assumption holds</em>. On skewed data it misbehaves — the mean and standard deviation are pulled by the extreme values in the tail, which makes z-scores unreliable. IQR is the right tool here.",
        },
        {
          label: "Apply a log transform first, then use either method",
          correct: false,
          explanation: "Transforming to approximate normality and then applying the z-score method is a valid approach — but it adds a step, and the IQR method works directly on skewed data without needing a transform. Both paths can work; IQR is simpler and more direct.",
        },
      ],
    },
  ],
};

export default detectingOutliers;
