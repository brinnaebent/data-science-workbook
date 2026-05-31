import type { Section } from "@brinnaebent/workbook";

const descriptiveVsInferential: Section = {
  id: "descriptive-vs-inferential",
  number: 4,
  title: "Descriptive vs. Inferential Statistics",
  blocks: [
    {
      type: "text",
      html: `<p>Statistics splits into two broad modes of work, and knowing which one you're doing matters.</p>
<p><strong>Descriptive statistics</strong> summarize the data you have. Mean, median, standard deviation, a histogram — these describe your sample. They make no claims about a broader population. There's no inference, no probability, no "and therefore." You're just characterizing what's in the table.</p>
<p><strong>Inferential statistics</strong> go further. They use your sample to make claims about a population you haven't fully observed. "The new algorithm is significantly better." "Users in segment A convert at a higher rate than users in segment B." These are claims about the world based on limited data — and that's where probability and hypothesis testing enter.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "The Bridge: Probability Distributions",
      html: `<p>The bridge between descriptive and inferential work is the concept of a <strong>probability distribution</strong>. If you know (or assume) what distribution your data comes from, you can make probability statements about values you haven't seen. Most inferential procedures are built on this foundation — assuming a distribution, estimating its parameters from your sample, and then drawing conclusions about the population.</p>`,
    },
    {
      type: "text",
      html: `<p>A practical distinction: you'll use descriptive statistics constantly during exploratory data analysis. You'll reach for inferential statistics when you need to make a claim that goes beyond your data — "does this model generalize?", "does this intervention work?", "is this feature actually predictive?"</p>
<p>When I open a new dataset, before any modeling, I run a quick descriptive pass:</p>
<ul>
<li>Are my features on wildly different scales? (Scaling will matter.)</li>
<li>Are any features very skewed? (Transformations may help.)</li>
<li>Where are the extreme values, and do they make sense?</li>
<li>What does "typical" look like for each variable?</li>
</ul>
<p>You'd be amazed how often this five-second check catches data quality problems, label leakage, or misunderstandings about what a column means. Before you train, describe.</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch1-s4-q1",
      kind: "mc",
      question: "Which of the following is an inferential statistical claim (as opposed to a descriptive one)?",
      options: [
        {
          label: "The average session duration in our dataset is 4.3 minutes",
          correct: false,
          explanation: "This is purely descriptive — it summarizes the data you have, with no claim about a broader population or comparison.",
        },
        {
          label: "75% of rows in the training set have label = 0",
          correct: false,
          explanation: "This is descriptive. It characterizes the composition of a specific dataset without making any inference about a broader population.",
        },
        {
          label: "Users shown the new onboarding flow convert at a significantly higher rate than users shown the old flow",
          correct: true,
          explanation: "This is inferential. 'Significantly higher' implies a statistical comparison — a claim that the observed difference is unlikely to be random noise, extending from your sample to broader behavior. It requires a hypothesis test to support.",
        },
        {
          label: "The correlation between feature A and feature B in our dataset is 0.72",
          correct: false,
          explanation: "Computing a correlation coefficient is descriptive — it characterizes your data. Drawing a conclusion like 'these variables are reliably correlated in the real world' would be inferential.",
        },
      ],
    },
  ],
};

export default descriptiveVsInferential;
