import type { Section } from "@brinnaebent/workbook";

const missingValues: Section = {
  id: "missing-values",
  number: 2,
  title: "Missing Values: MCAR, MAR, and MNAR",
  blocks: [
    {
      type: "text",
      html: `<p>When values are missing <em>within</em> a feature, the right strategy depends on <em>why</em> they're missing. There are three categories, and they need very different handling. Applying the wrong strategy can introduce systematic bias into everything downstream.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "MCAR — Missing Completely At Random",
      html: `<p>No pattern. The missingness is independent of everything — like a sensor glitch that randomly drops 2% of readings. This is the easy case.</p>
<p><strong>Handling:</strong> If it's less than ~5% of data, it's generally fine to drop the affected rows or fill in with mean, median, or mode. For time series, forward-fill or back-fill. The key test: missingness should not correlate with any other variable.</p>`,
    },
    {
      type: "text",
      html: `<p><strong>MAR — Missing At Random.</strong> Missingness in column C is associated with the values in <em>some other column</em>. Example: people with high blood pressure may hesitate to report their weight, so weight is missing more often when blood pressure is high. The missingness is "random" given the other variables, but not unconditionally.</p>
<p>Test for it by dividing into subgroups and checking whether the missingness rate differs significantly across groups. Simple mean/median fills give unreliable results here — use <strong>model-based imputation</strong> that conditions on the related variables. If 60% or more of a feature is missing, consider dropping the feature entirely.</p>
<p><strong>MNAR — Missing Not At Random.</strong> Missingness depends on the missing value itself. Examples: very rich and very poor people skip income fields; older applicants worried about age discrimination leave the age field blank. The right fix is almost always to <strong>revisit the data collection mechanism</strong> rather than impute — because imputation gives unreliable results no matter how clever the method.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Summary: Which Strategy for Which Type",
      html: `<ul>
<li><strong>MCAR</strong> → drop or simple fill (mean/median/mode)</li>
<li><strong>MAR</strong> → model-based imputation conditioned on related variables</li>
<li><strong>MNAR</strong> → fix the collection mechanism if possible; impute with caution and document the limitation</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "MissingnessClassifier",
      caption: "Placeholder: interactive tool — describe your missing data pattern and get a MCAR/MAR/MNAR classification with recommended strategy.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "ds-pre-missing-values-q1",
      kind: "mc",
      question: "In a healthcare dataset, 'weight' is missing more often for patients with higher blood pressure readings. What type of missingness is this, and what's the right imputation strategy?",
      options: [
        {
          label: "MAR — use model-based imputation conditioned on blood pressure (and other related variables)",
          correct: true,
          explanation: "Correct. The missingness in 'weight' is associated with the value of another observed variable ('blood pressure'). That's the definition of MAR. Simple mean imputation would ignore the fact that missing weights cluster in higher-blood-pressure patients — a model-based approach that conditions on blood pressure gives a more accurate imputed value.",
        },
        {
          label: "MCAR — drop the rows with missing weight since it's random",
          correct: false,
          explanation: "MCAR requires that missingness be independent of all variables. Here, missingness correlates with blood pressure — so it's not MCAR. Dropping those rows would disproportionately remove high-blood-pressure patients from your dataset, introducing systematic bias.",
        },
        {
          label: "MNAR — the missing weight values are probably higher than average, since heavier patients might avoid reporting",
          correct: false,
          explanation: "MNAR means missingness depends on the missing value itself (e.g., heavy people avoid reporting their weight). That might also be true here, but the evidence we're given is that missingness correlates with blood pressure — which is MAR. Without additional evidence about the direction of the relationship to the weight values themselves, MAR is the better-supported classification.",
        },
      ],
    },
  ],
};

export default missingValues;
