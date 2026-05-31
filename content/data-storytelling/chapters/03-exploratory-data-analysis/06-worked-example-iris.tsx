import type { Section } from "@brinnaebent/workbook";

const workedExampleIris: Section = {
  id: "worked-example-iris",
  number: 6,
  title: "Worked Example: The Iris Dataset",
  blocks: [
    {
      type: "text",
      html: `<p>The classic <strong>Iris</strong> dataset is too clean to be realistic, but it's a perfect training ground because every step works and the lessons transfer. 150 flowers across three species, each measured on four numerical features: sepal length, sepal width, petal length, petal width. Let's walk a complete EDA pass — and extract a modeling plan from it.</p>
<p><strong>Step 1 — Dimensions and Types.</strong> 150 rows × 5 columns. The four measurement features are <code>float64</code>. The target (<code>species</code>) is an object — categorical, needs encoding. No missing values, which is genuinely unheard of in real data. This alone tells us Iris is a teaching dataset.</p>
<p><strong>Step 2 — Descriptive Statistics.</strong> Mean sepal length ≈ 5.84 cm; median ≈ 5.8 cm — roughly symmetric. Standard deviation ≈ 0.83. Skewness and kurtosis values close to zero suggest approximately normal distributions for most features. Petal length and petal width have more spread and a slightly different story.</p>
<p><strong>Step 3 — Data Quality.</strong> No duplicate rows. No inconsistencies. Nothing alarming in the value ranges. Everything passes — again, this is why it's a teaching dataset. Expect far more work on real data.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Step 4 — Variable Relationships",
      html: `<p>The correlation between petal length and petal width is ≈ 0.96 — extremely high. Biologically this makes sense: bigger petals are bigger in both dimensions. For modeling, this signals <strong>redundancy</strong>: we probably don't need both features. The pair plot makes species clusters obvious — the classes are largely linearly separable, suggesting simple models (k-NN, decision tree, logistic regression) should work well.</p>`,
    },
    {
      type: "interactive",
      component: "IrisPairPlot",
      caption: "Placeholder: interactive pair plot of the Iris dataset — hover to see species labels, drag to rotate 3D scatter.",
      props: {},
    },
    {
      type: "text",
      html: `<p><strong>Step 5 — Visualization.</strong> The histogram of petal length is <strong>bimodal</strong> — two distinct peaks, likely corresponding to setosa (much smaller petals) vs. the other two species. The box plots reveal a few outliers in sepal width. The pair plot confirms the species clusters are visible to the naked eye.</p>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "Iris petal length histogram showing bimodal distribution",
      caption: "Placeholder: histogram of Iris petal length, annotated to show the setosa cluster vs. versicolor/virginica.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Step 6 — Feature Engineering Hint from EDA",
      html: `<p>A new feature like <code>petal_area = petal_length × petal_width</code> shows even cleaner separation between species in histograms. EDA just handed us a feature engineering recipe. This is the goal: EDA doesn't just describe the data — it gives you a concrete plan for what to do next.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Modeling Plan EDA Produces",
      html: `<ul>
<li>With 150 samples, complex models are overkill — start simple.</li>
<li>The categorical target needs encoding (label or one-hot).</li>
<li>Numerical features will benefit from standardization.</li>
<li>Highly correlated features (petal length + petal width) suggest considering PCA or dropping one.</li>
<li>Linear separability suggests starting with logistic regression.</li>
</ul>
<p>EDA output is a plan. If you finished EDA and don't have a plan, you didn't finish EDA.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-eda-iris-q1",
      kind: "mc",
      question: "The correlation between petal_length and petal_width in Iris is 0.96. What is the correct EDA conclusion — and what is NOT warranted?",
      options: [
        {
          label: "Correct: flag the redundancy for feature selection. Not warranted: immediately drop one of the features.",
          correct: true,
          explanation: "Correct. EDA surfaces the redundancy — it doesn't prescribe the fix. Dropping a feature is a modeling decision that belongs in the feature selection step, informed by what the model actually needs. It's possible that for some models or tasks, both features add value despite their correlation.",
        },
        {
          label: "Correct: drop petal_width immediately since petal_length has more variance.",
          correct: false,
          explanation: "EDA doesn't warrant immediate dropping. More variance isn't the criterion for keeping a feature — predictive value for the target is. EDA flags the redundancy; feature selection (Chapter 7) resolves it.",
        },
        {
          label: "Correct: the two features are so correlated that one must be an error in the dataset.",
          correct: false,
          explanation: "High correlation between two physical measurements of the same thing (flower petals) is biologically expected. It's not evidence of error — it's evidence of a real relationship between the variables.",
        },
      ],
    },
    {
      type: "checkpoint",
      id: "ds-eda-iris-reflect",
      kind: "reflective",
      question: "Think of a real dataset you'd like to work with. Walk through the six EDA steps mentally. At which step do you expect to find the most surprises — and why?",
      sampleAnswer: "For a dataset of social media engagement metrics: step 1 (structure) would likely reveal a mix of integer counts, floats, and timestamps that need careful typing. Step 4 (relationships) would probably surface the most surprises — likes and shares are likely correlated, but the relationship between posting time and engagement is probably nonlinear and would show up clearly in scatter plots. Step 3 (quality) would also be interesting — zero-engagement posts might be genuine failures or might indicate deleted content that the API still returns.",
    },
  ],
};

export default workedExampleIris;
