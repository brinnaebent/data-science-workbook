import type { Section } from "@brinnaebent/workbook";

const evaluationChecklist: Section = {
  id: "evaluation-checklist",
  number: 5,
  title: "The Evaluation Checklist",
  blocks: [
    {
      type: "text",
      html: `<p>When you're evaluating a model, walk through this checklist. Every item maps back to something in this unit. That's not a coincidence — statistics is, in the end, the discipline of knowing whether to believe yourself.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Model Evaluation Checklist",
      html: `<ol>
<li><strong>Is the metric appropriate?</strong> For imbalanced classification, accuracy lies. For regression with outliers, MSE may overweight them. Match the metric to the problem.</li>
<li><strong>Goodness-of-fit, with complexity in mind.</strong> R² alone isn't enough. Report AIC or BIC when comparing models of different complexity.</li>
<li><strong>Residual analysis.</strong> Look at residual plots. Check normality. Check homoscedasticity. Fix problems you find before trusting coefficients.</li>
<li><strong>Confidence intervals.</strong> Don't just report point estimates. Quantify uncertainty.</li>
<li><strong>Subgroup analysis.</strong> Look for Simpson's Paradox. Check whether your model's performance is consistent across important subgroups — fairness considerations live here too.</li>
<li><strong>Cross-validation.</strong> Single-split evaluation is noisy. K-fold cross-validation gives you a distribution of performance estimates.</li>
<li><strong>Statistical significance on model comparisons.</strong> When you claim Model A beats Model B, can you back it up? Use a paired test on cross-validation fold performance, with Bonferroni correction if testing many models.</li>
<li><strong>Practical significance.</strong> Even if a difference is statistically significant, is it large enough to matter operationally? A 0.001 RMSE improvement after a month of engineering is statistically real and practically irrelevant.</li>
</ol>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Thread Through the Unit",
      html: `<p>We started with descriptive statistics — summarizing what we have. We learned to design experiments with power analysis. We learned to sample with intent and handle imbalanced data. We worked through the parametric and nonparametric test toolkits, ANOVA for multi-group comparison, regression for modeling relationships, and Bayesian inference as an alternative framework for belief.</p>
<p>The thread through all of it: <strong>be honest about uncertainty.</strong> Frequentist methods quantify it through p-values and confidence intervals. Bayesian methods quantify it through posterior distributions. Residual analysis surfaces the uncertainty you didn't see at first. Multiple-testing corrections defend against the uncertainty introduced by your own search procedures.</p>
<p>The candidates who stand out in data science roles — and the practitioners who produce work that holds up — are the ones who tell you exactly what their models <em>can't</em> do, and how confident they are in the difference. That's a statistical instinct. It comes from working through this material, internalizing it, and applying it until it's automatic.</p>`,
    },
    {
      type: "reflection",
      id: "stats-ch12-s5-reflect",
      question: "Walk through the full evaluation checklist for a model you've worked on (or a hypothetical churn prediction model). Which items are most often skipped in practice, and what are the consequences of skipping them?",
      sampleAnswer: "Most commonly skipped in practice: (1) subgroup analysis — teams focus on aggregate metrics and miss Simpson's Paradox or fairness issues across demographic groups; (2) statistical significance on model comparisons — teams compare models on a single test set and declare a winner based on a 0.3-point F1 difference that's within noise; (3) residual analysis — regression models get shipped without checking if linearity and homoscedasticity hold, leading to biased coefficients and unreliable confidence intervals. The consequences range from misleading stakeholders about model improvement to shipping models that perform well in aggregate but fail systematically on important subgroups.",
    },
  ],
};

export default evaluationChecklist;
