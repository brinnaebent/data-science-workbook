import type { Section } from "@brinnaebent/workbook";

const missingnessAsFeature: Section = {
  id: "missingness-as-feature",
  number: 3,
  title: "When Missingness Is a Feature",
  blocks: [
    {
      type: "text",
      html: `<p>Sometimes the fact that data is missing is itself informative. If "income field is blank" predicts something about your customers, that pattern is a feature, not a bug — and you should preserve it rather than impute it away.</p>
<p>Two ways to encode missingness explicitly:</p>
<ul>
<li><strong>Sentinel value</strong> — use a distinct value like <code>−1</code>, <code>−9999</code>, or a category like <code>"unknown"</code> that the model can learn to recognize as "was missing."</li>
<li><strong>Binary missing flag</strong> — add a separate 0/1 column indicating whether the original was missing. Keep the imputed value in the original column; add the flag alongside it.</li>
</ul>
<p>Use these only when the feature is genuinely important and the missingness pattern is meaningfully predictive. Don't add missing flags everywhere just because you can — it adds dimensionality for no gain when the pattern is random.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Credit Scoring and Fraud Detection",
      html: `<p>Credit scoring is a domain where missingness-as-feature is widely used. The pattern of which fields a borrower fills in — and which they leave blank — is itself predictive of creditworthiness. Models exploit this. The same pattern appears in fraud detection (which fields does the fraudster skip?), insurance underwriting, and many user-facing systems where users self-select what to disclose. In these domains, treating a missing value as "just missing" throws away signal you actually need.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-pre-missingness-feature-q1",
      kind: "mc",
      question: "In a loan application dataset, 'employer_name' is blank for 18% of applicants. A domain expert tells you that self-employed applicants and unemployed applicants both tend to leave this field blank. Should you impute the missing values or encode the missingness?",
      options: [
        {
          label: "Encode the missingness — add a binary flag for 'employer_name_missing', since the blank itself is informative",
          correct: true,
          explanation: "Correct. The domain expert tells you the blank has a meaning — it identifies a subgroup of applicants (self-employed and unemployed) who share a characteristic. Imputing a fake employer name would destroy that signal. A binary missing flag preserves it, and the model can learn that 'employer_name_missing = 1' is associated with different risk profiles.",
        },
        {
          label: "Impute with 'Unknown' to standardize the field",
          correct: false,
          explanation: "'Unknown' as an imputed category would technically encode the missingness as a category — which is actually close to the right approach. But more precisely, you want a binary flag rather than overloading the original column, so the model can separately learn the effect of missingness from the effect of any specific employer name.",
        },
        {
          label: "Drop the column — it has too much missing data to be useful",
          correct: false,
          explanation: "18% missing is not too much if the missingness is informative. Dropping the column would throw away a potentially strong predictive signal about self-employment and unemployment status.",
        },
      ],
    },
  ],
};

export default missingnessAsFeature;
