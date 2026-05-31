import type { Section } from "@brinnaebent/workbook";

const tabularDataAndEncoding: Section = {
  id: "tabular-data-and-encoding",
  number: 3,
  title: "Tabular Data",
  blocks: [
    {
      type: "text",
      html: `<p>There are two types of tabular data: <strong>Quantitative data</strong> is already numeric: ages, prices, temperatures. <strong>Categorical data</strong> is not: colors, countries, diagnoses. Encoding categorical data correctly is an important decision, because the wrong choice may introduce false structure that biases every model downstream.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Four Encodings You Should Know",
      html: `<ul>
<li><strong>Nominal encoding</strong> — assigns each category a unique integer (Red=0, Blue=1, Green=2). Simple, but implies an ordering between categories that doesn't exist. Use cautiously.</li>
<li><strong>One-hot encoding</strong> — creates a separate binary column for each category. Each row gets a 1 in exactly one column and 0s elsewhere. Right for unordered categories; expensive if there are hundreds of categories.</li>
<li><strong>Ordinal encoding</strong> — for categories that <em>do</em> have a natural order (Small=0, Medium=1, Large=2). The numbers genuinely carry meaning here, so models can use the magnitude.</li>
<li><strong>Label encoding</strong> — assigns integers in alphabetical order of the category labels. Useful for tracking, not for conveying magnitude.</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "EncodingComparison",
      caption: "Select a categorical variable and an encoding method. Watch how the choice reshapes the data — and what assumptions get smuggled in.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "The Core Rule",
      html: `<p>If the categories have no inherent order (colors, countries, diagnoses) → use <strong>one-hot encoding</strong>. If they do have order (Small/Medium/Large, rating scales) → use <strong>ordinal encoding</strong>. Using nominal encoding on unordered categories silently introduces a false ordering that can bias your model.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds1-q3-encoding",
      kind: "mc",
      question: "You have a 'satisfaction level' variable: Very Unsatisfied → Unsatisfied → Neutral → Satisfied → Very Satisfied. Which encoding is most appropriate?",
      options: [
        {
          label: "One-hot encoding — create a separate binary column for each level",
          explanation: "One-hot is for unordered categories. These satisfaction levels have a clear inherent order — one-hot would discard that meaningful structure.",
        },
        {
          label: "Ordinal encoding — assign integers 0–4 to reflect the natural ordering",
          correct: true,
          explanation: "The integers 0–4 genuinely reflect the underlying structure: Very Satisfied (4) is more satisfied than Satisfied (3). Ordinal encoding preserves this meaning.",
        },
        {
          label: "Nominal encoding — assign arbitrary integers regardless of order",
          explanation: "Nominal encoding would mislead any model sensitive to ordinal relationships — implying false order between categories.",
        },
        {
          label: "No encoding needed — leave as text strings",
          explanation: "Most ML models cannot use text strings. Categorical variables must be encoded as numbers.",
        },
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Single Biggest Mistake",
      html: `<p>Using an encoding that introduces an ordering the data doesn't have. If you nominal-encode color (Red=0, Blue=1, Green=2) and your model is even a little bit sensitive to ordinal relationships, you've smuggled in a bias that's hard to detect later. <strong>When in doubt, use one-hot for unordered categories.</strong></p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Survey Data in the Wild",
      html: `<p>The U.S. Census, NHANES, Pew Research, the European Social Survey — every one of these is a tabular dataset full of categorical variables that someone decided how to encode. Whether you're building a model on top of survey data or reading a published analysis, the encoding choices upstream are shaping the conclusions. When a paper reports "race" as a numerical variable, take a moment to think about how it got encoded. The choice is never neutral.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-info-rep-encoding-q1",
      kind: "mc",
      question: "A dataset has a 'Education Level' column with values: 'High School', 'Bachelor's', 'Master's', 'PhD'. Which encoding is most appropriate?",
      options: [
        {
          label: "Ordinal encoding (High School=0, Bachelor's=1, Master's=2, PhD=3)",
          correct: true,
          explanation: "Correct. Education level has a natural, meaningful order — more education = higher number. Ordinal encoding lets the model use that ordering. One-hot would discard this useful structure.",
        },
        {
          label: "One-hot encoding with four binary columns",
          correct: false,
          explanation: "One-hot is right for categories with no inherent order. Education level has a clear order, so discarding that with one-hot encoding throws away useful information.",
        },
        {
          label: "Nominal encoding, because any integer assignment works",
          correct: false,
          explanation: "Nominal encoding assigns integers without regard to order. With education level, the order matters — a model seeing 'PhD=3 > Master's=2' should be able to reason about that. Nominal encoding might assign these in alphabetical order (Bachelor's=0, High School=1, Master's=2, PhD=3), which is less meaningful.",
        },
      ],
    },
  ],
};

export default tabularDataAndEncoding;
