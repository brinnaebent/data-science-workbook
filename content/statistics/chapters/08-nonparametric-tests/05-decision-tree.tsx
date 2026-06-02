import type { Section } from "@brinnaebent/workbook";

const decisionTree: Section = {
  id: "test-decision-tree",
  number: 5,
  title: "The Test Decision Tree",
  blocks: [
    {
      type: "text",
      html: `<p>When I was a graduate student, I kept an index card on my desk with a decision tree for picking the right two-group statistical test. Here is the grown-up version:</p>`,
    },
    {
      type: "interactive",
      component: "TwoGroupDecisionTree",
      caption: "The two-group comparison decision tree. Hover any node to highlight its subtree and trace the path to a test.",
      props: {},
    },
    {
      type: "callout",
      variant: "tip",
      title: "For Categorical Data",
      html: `<p>The above tree handles continuous outcomes. For categorical outcomes:</p>
<ul>
<li><strong>Two categorical variables:</strong> Chi-square test of independence (or Fisher's exact if cells are small).</li>
<li><strong>One categorical variable vs. expected distribution:</strong> Chi-square goodness-of-fit.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "For Three or More Groups",
      html: `<p>The decision tree above covers two-group comparisons. For three or more groups, you need ANOVA — which is the next chapter.</p>`,
    },
    {
      type: "interactive",
      component: "TestDecisionTree",
      caption: "Interactive decision tree — answer questions about your data (paired? normal? equal variance?) and arrive at the recommended test with a brief explanation.",
      props: {},
    },
    {
      type: "reflection",
      id: "stats-ch8-s5-reflect",
      question: "For each scenario, identify the correct test and explain why: (1) Comparing click-through rates (binary outcome) for two ad creatives shown to different users. (2) Comparing model accuracy scores across 10 benchmark datasets for two models. (3) Testing whether the distribution of error types produced by a model (Type A, Type B, Type C) matches the expected distribution.",
      sampleAnswer: "(1) Chi-square test of independence (or a proportion test) — binary categorical outcome, two independent groups. (2) Paired t-test (or Wilcoxon signed-rank if non-normal) — same 10 datasets used for both models, outcomes are paired by dataset, and you're comparing continuous accuracy scores. (3) Chi-square goodness-of-fit — one categorical variable (error type) compared against an expected distribution.",
    },
  ],
};

export default decisionTree;
