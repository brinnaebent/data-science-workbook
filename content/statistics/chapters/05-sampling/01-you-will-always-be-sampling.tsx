import type { Section } from "@brinnaebent/workbook";

const youWillAlwaysBeSampling: Section = {
  id: "you-will-always-be-sampling",
  number: 1,
  title: "You Will Always Be Sampling",
  blocks: [
    {
      type: "text",
      html: `<p>Virtually every statistical claim a data scientist makes is a claim about a population, made from a sample. You will essentially never get the entire population. Even when your dataset feels exhaustive — every transaction, every user, every log line — it's still a sample from the conceptual population of "all transactions, users, and log lines, including the ones that will happen tomorrow."</p>
<p>So sampling isn't just about surveys and academic studies. It's about train/test splits, cross-validation, mini-batch training, bootstrap confidence intervals, active learning, and anomaly detection. The way you sample shapes everything that comes after.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Learning Objectives",
      html: `<p>By the end of this chapter, you'll be able to:</p>
<ol>
<li>Define sampling and explain its role in machine learning.</li>
<li>Distinguish between probability and non-probability sampling.</li>
<li>Identify the four core probability sampling methods and when to use each.</li>
<li>Connect sampling concepts to common ML workflows.</li>
<li>Recognize common sampling biases.</li>
</ol>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Sampling Is Everywhere in ML",
      html: `<ul>
<li><strong>Dataset creation:</strong> Collecting representative training data. Balancing classes. The decisions you make here echo through your entire model.</li>
<li><strong>Train/test split:</strong> Randomly partitioning data is sampling. So is k-fold cross-validation.</li>
<li><strong>Bootstrapping:</strong> Sampling with replacement to estimate variability or train ensemble methods like random forests.</li>
<li><strong>Mini-batch sampling:</strong> In stochastic gradient descent, you sample subsets of data each iteration. How you batch matters more than people think.</li>
<li><strong>Active learning:</strong> Selectively sampling the most informative instances for labeling — useful when labels are expensive.</li>
</ul>`,
    },
  ],
};

export default youWillAlwaysBeSampling;
