import type { Section } from "@brinnaebent/workbook";

const dataQualityAssessment: Section = {
  id: "data-quality-assessment",
  number: 6,
  title: "The Data Quality Assessment",
  blocks: [
    {
      type: "text",
      html: `<p>A structured <strong>data quality assessment (DQA)</strong> should happen before you start modeling. Garbage in, garbage out — and the only way to know whether you have garbage is to check systematically. Ad-hoc quality checks miss things. A structured process doesn't.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The Eight Dimensions of a DQA",
      html: `<ul>
<li><strong>Profiling</strong> — EDA on the dataset: distributions, types, ranges.</li>
<li><strong>Completeness</strong> — missing values and incomplete records.</li>
<li><strong>Accuracy</strong> — cross-check against trusted sources or via manual validation.</li>
<li><strong>Consistency</strong> — across sources, formats, and time periods.</li>
<li><strong>Integrity</strong> — enforced constraints: unique IDs, valid value ranges, referential integrity.</li>
<li><strong>Lineage and provenance</strong> — where the data came from, what transformations have been applied.</li>
<li><strong>Automated testing</strong> — validation rules baked into your pipeline so quality regressions are caught automatically.</li>
<li><strong>Continuous monitoring</strong> — quality is not a one-time check.</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "DQAWalkthrough",
    },
    {
      type: "text",
      html: `<p>Real-time systems need continuous DQA. Tools like <strong>Great Expectations</strong> and <strong>Soda</strong> let you encode data quality rules as code and run them every time new data arrives. If you're going into a data-intensive role in industry, these are worth learning.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-pre-dqa-reflect",
      kind: "reflective",
      question: "You're handed a dataset from an external vendor with no documentation. Walk through the first three DQA steps — profiling, completeness, and accuracy — describing specifically what you'd check and how.",
      sampleAnswer: "Profiling: run df.info() and df.describe() to get types, ranges, and counts; look for columns that should be numeric but are stored as strings (a sign of mixed types or sentinel values); check dtypes match expected types. Completeness: compute missingness rate per column with df.isnull().mean(); note any column above 10% missing; for time series, check whether missingness is random or clustered in specific time periods. Accuracy: for at least 3–5 key columns, spot-check a sample of rows against any external reference you can find (published statistics, domain norms, the vendor's own documentation if any exists); sanity-check value ranges against domain constraints (ages between 0–120, prices non-negative, percentages between 0–100).",
    },
  ],
};

export default dataQualityAssessment;
