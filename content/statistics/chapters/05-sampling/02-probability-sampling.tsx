import type { Section } from "@brinnaebent/workbook";

const probabilitySampling: Section = {
  id: "probability-sampling",
  number: 2,
  title: "Probability Sampling",
  blocks: [
    {
      type: "text",
      html: `<p>In <strong>probability sampling</strong>, every member of the population has a known, non-zero chance of being selected. This is what we want. It's what makes our statistical claims actually transfer from the sample to the population.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Simple Random Sampling",
      html: `<p>Every member of the population has an equal chance of being selected. The conceptually cleanest method and the gold standard when feasible. Use this as your default when the population is well-defined and accessible.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Stratified Sampling",
      html: `<p>Divide the population into subgroups (strata) and randomly sample from each. Use this when you have known subgroups whose distributions matter — sampling equal numbers from each demographic group, or sampling from each class in a classification problem so your test set isn't all majority class.</p>
<p><strong>In ML:</strong> <code>sklearn.model_selection.train_test_split(stratify=y)</code> and <code>StratifiedKFold</code> both implement this. Pass the label column and your class distribution will be preserved across splits.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Cluster Sampling",
      html: `<p>Divide the population into clusters and randomly select entire clusters. Sometimes the only feasible option — think geographic sampling, where you select cities, then survey everyone in those cities. Less statistically efficient than simple random sampling for a given total sample size, but often much cheaper to execute.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Systematic Sampling",
      html: `<p>Order the population and select members at regular intervals (every k-th element). Easy to execute. It assumes the ordering isn't itself correlated with what you're studying — if it is, systematic sampling will mislead you. (Classic failure: sampling every 7th day in a weekly-seasonal dataset would always land on the same day of the week.)</p>`,
    },
    {
      type: "interactive",
      component: "SamplingMethodsExplorer",
      caption: "Placeholder: Visualize each probability sampling method applied to the same population. See how different methods affect representativeness across demographic subgroups.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch5-s2-q1",
      kind: "mc",
      question: "You're building a churn prediction model and need a test set. Your dataset is 90% non-churned users and 10% churned. You want to ensure your test set reflects this distribution rather than getting, by chance, a test set with only 2% churners. Which sampling method should you use?",
      options: [
        {
          label: "Simple random sampling",
          correct: false,
          explanation: "Simple random sampling can produce test sets with very few minority-class examples by chance — especially with high imbalance. Stratified sampling is the right tool here.",
        },
        {
          label: "Stratified sampling by churn label",
          correct: true,
          explanation: "Correct. Stratified sampling preserves the class distribution in each split. With 10% churners, you'll get 10% churners in both train and test — ensuring your evaluation metrics reflect the real distribution.",
        },
        {
          label: "Cluster sampling by user cohort",
          correct: false,
          explanation: "Cluster sampling selects entire groups, which could result in unrepresentative churn rates if some cohorts churn more than others. It doesn't address the class imbalance concern.",
        },
        {
          label: "Systematic sampling of every 10th user",
          correct: false,
          explanation: "Systematic sampling gives every user an equal chance but doesn't guarantee the churn distribution is preserved. If churn patterns are correlated with user order (e.g., older users churn less), this could be biased.",
        },
      ],
    },
  ],
};

export default probabilitySampling;
