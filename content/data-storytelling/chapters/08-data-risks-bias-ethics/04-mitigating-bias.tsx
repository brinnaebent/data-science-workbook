import type { Section } from "@brinnaebent/workbook";

const mitigatingBias: Section = {
  id: "mitigating-bias",
  number: 4,
  title: "Mitigating Data Bias",
  blocks: [
    {
      type: "text",
      html: `<p>Knowing where bias enters is necessary but not sufficient. You need mitigation strategies at each stage. The general principles below apply broadly; the specific tactics depend on your domain, your data, and what kind of bias you've identified.</p>
<ul>
<li><strong>Representativeness.</strong> Ensure your dataset represents the target population — not just your convenient sampling frame.</li>
<li><strong>Diverse and inclusive collection.</strong> Sources and participants spanning gender, race, ethnicity, age, socioeconomic status, geography, and other relevant attributes.</li>
<li><strong>Balanced distribution.</strong> Across groups and categories. If a subgroup is genuinely rare, consider oversampling or synthetic augmentation.</li>
<li><strong>Objective and consistent labeling.</strong> Clear guidelines. Multiple annotators. Double-blind annotation for sensitive categories.</li>
<li><strong>Audit for sensitive attribute proxies.</strong> Postal code is often a proxy for race. Time-of-day-of-shopping can be a proxy for socioeconomic status. Removing the explicit sensitive attribute isn't enough if correlated proxies remain.</li>
<li><strong>Documentation and transparency.</strong> Collection process, sources, known biases, limitations — all documented.</li>
<li><strong>Regular monitoring.</strong> Especially with internet-sourced data — biases shift over time as the world changes.</li>
<li><strong>Diverse teams.</strong> People with different perspectives spot different problems. This is not decorative — it is functional.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Synthetic Data as One Tool",
      html: `<p>Synthetic data can address data scarcity for underrepresented groups, rebalance distributions, protect privacy when real personal data is too sensitive to expose, and enable controlled experiments.</p>
<p>The challenges are real: the generative process must accurately capture the true underlying distribution (if it makes wrong assumptions, it can introduce new biases); the test set still needs to be real; and there's potential for reverse engineering if the synthetic data allows re-identification of originals. Synthetic data is a tool. It can do a lot of good in the right hands and cause new problems in the wrong hands.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Self-Driving Cars and Synthetic Data",
      html: `<p>Self-driving car companies use synthetic data extensively because collecting real-world data for rare but critical scenarios — a child running into the road, an unusual sensor failure mode — is expensive and dangerous. Healthcare research uses synthetic data for similar reasons: rare disease research suffers chronically from small sample sizes that synthetic augmentation can address without compromising patient privacy.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-ethics-mitigation-q1",
      kind: "mc",
      question: "You remove 'race' from your loan model's features to prevent discriminatory outcomes. A fairness audit later shows the model still produces disparate outcomes across racial groups. What most likely explains this?",
      options: [
        {
          label: "Proxy variables — other features (zip code, occupation history, credit history) correlate with race and carry the discriminatory signal",
          correct: true,
          explanation: "Correct. This is the proxy problem. Removing the explicit sensitive attribute doesn't prevent discrimination if correlated features remain. Zip code, school district, employer history, and many financial variables are correlated with race in ways that reflect historical discrimination. The model learns from these proxies and produces racially disparate outcomes without ever seeing the 'race' feature directly.",
        },
        {
          label: "The model needs more training data to learn unbiased patterns",
          correct: false,
          explanation: "More training data on the same biased distributions produces more confident biased predictions, not less biased ones. The issue is in the data's structure, not its volume.",
        },
        {
          label: "Race is a protected attribute that can't be used in any model — but removing it always fixes disparate impact",
          correct: false,
          explanation: "Removing protected attributes is necessary but not sufficient — and in some fairness frameworks, you actually need to measure outcomes across protected groups (which requires knowing those groups) to audit for disparate impact. Removal alone doesn't address proxy variables.",
        },
      ],
    },
  ],
};

export default mitigatingBias;
