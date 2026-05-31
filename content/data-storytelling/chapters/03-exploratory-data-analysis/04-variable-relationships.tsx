import type { Section } from "@brinnaebent/workbook";

const variableRelationships: Section = {
  id: "variable-relationships",
  number: 4,
  title: "Variable Relationships",
  blocks: [
    {
      type: "text",
      html: `<p>Once you understand each variable individually, you start asking about pairs and groups. This is where EDA starts generating genuine insight rather than just summary numbers.</p>
<p>The <strong>pairwise correlation matrix</strong> gives you a compact summary of linear relationships between numerical variables. Plot it as a heatmap — color-coded matrices make patterns jump out fast. Values close to +1 mean variables move together strongly; close to −1 means they move opposite each other; close to 0 means no linear relationship. A critical caveat: low correlation does not mean no relationship — nonlinear relationships can be strong and correlation will miss them entirely.</p>
<p>The most common downstream implication: <strong>highly correlated features are largely redundant.</strong> Including all of them adds dimensionality without much new information and can confuse some models. We'll come back to this in feature selection (Chapter 7).</p>`,
    },
    {
      type: "interactive",
      component: "CorrelationHeatmap",
      caption: "Placeholder: interactive correlation heatmap — upload or select a sample dataset and explore pairwise relationships.",
      props: {},
    },
    {
      type: "callout",
      variant: "tip",
      title: "What to Look For Beyond Correlation",
      html: `<ul>
<li><strong>Bimodal distributions</strong> (two peaks in a histogram) often indicate hidden subgroups worth investigating.</li>
<li><strong>Clusters in scatter plots</strong> suggest natural separability — and may change how you think about modeling.</li>
<li><strong>Strong nonlinear patterns</strong> hint at features that need engineering before they'll be useful to a linear model.</li>
<li><strong>Box plots by category</strong> — does a numerical variable's distribution differ across categories? This is fast visual evidence of a feature-target relationship.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Correlation Is Not Causation",
      html: `<p>The classic warning still holds. Ice cream sales and shark attacks are correlated (both peak in summer — the missing variable is temperature). Correlation is where most analyses <em>begin</em>, not where they end. It is evidence of a relationship to investigate, not evidence of a cause to act on.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-eda-relationships-q1",
      kind: "mc",
      question: "In a housing dataset, square footage and number of rooms have a correlation of 0.91. What is the most important modeling implication?",
      options: [
        {
          label: "These features are largely redundant — including both adds dimensionality without proportional information gain",
          correct: true,
          explanation: "Correct. A correlation of 0.91 means these two features are moving almost in lockstep. For most models, using both provides little additional signal beyond using one. For distance-based models (KNN, clustering) and linear models, high collinearity can actively cause problems. In EDA, this is a flag to consider in feature selection.",
        },
        {
          label: "One of the features must be wrong — real variables shouldn't correlate this strongly",
          correct: false,
          explanation: "High correlation is common and expected between related physical quantities. Square footage and room count are genuinely related — bigger homes tend to have more rooms. High correlation is informative, not suspicious.",
        },
        {
          label: "You should drop square footage, since room count is easier to collect",
          correct: false,
          explanation: "EDA identifies the redundancy — it doesn't prescribe which to drop. That decision involves domain knowledge (which is more informative for the specific task?), model requirements, and data availability. EDA surfaces the question; feature selection (Chapter 7) answers it.",
        },
      ],
    },
  ],
};

export default variableRelationships;
