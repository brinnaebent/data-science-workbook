import type { Section } from "@brinnaebent/workbook";

const goodnessOfFit: Section = {
  id: "goodness-of-fit",
  number: 2,
  title: "Goodness-of-Fit: R², AIC, and BIC",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Goodness-of-fit</strong> measures how well a model explains the variability in the data. Three you'll see most often:</p>`,
    },
    {
      type: "text",
      html: `<h3>R² (Coefficient of Determination)</h3>
<p>The proportion of variance in the outcome explained by the predictors. Ranges from 0 to 1.</p>
<ul>
<li>R² = 1: the model explains all variance (every prediction is perfect).</li>
<li>R² = 0: the model explains nothing (you're no better than predicting the mean).</li>
</ul>
<br>
<p><strong>Critical limitation:</strong> Add more predictors and R² almost never decreases. It always "rewards" complexity, even if the extra variables are noise. R² alone will favor the most complex model, which can be problematic, as you lose understandability when your models are more complex.</p>`,
    },
    {
      type: "text",
      html: `<h3>AIC and BIC</h3>
<p>Both metrics balance goodness-of-fit against model complexity by penalizing models with more parameters. Lower values = better model.</p>
<ul>
<li><strong>AIC (Akaike Information Criterion):</strong> Lighter complexity penalty. Tends to favor slightly more complex models. Use when prediction is the goal.</li>
<li><strong>BIC (Bayesian Information Criterion):</strong> Heavier complexity penalty, especially as sample size grows. Favors simpler models more aggressively. Use when explanation and parsimony are the goal.</li>
</ul>
<br>
<p>In practice, you may choose to report R² alongside AIC or BIC. R² tells you how well the model fits. AIC/BIC tell you whether the fit is worth the complexity.</p>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch12-s2-q1",
      kind: "mc",
      question: "You compare two regression models: Model A has R² = 0.82 with 3 predictors; Model B has R² = 0.84 with 15 predictors. Model B has a higher AIC. Which model should you prefer?",
      options: [
        {
          label: "Model B, because it has higher R²",
          correct: false,
          explanation: "R² always increases or stays the same when you add predictors, even if they're noise. The 0.02 improvement from 12 extra predictors likely reflects overfitting, not genuine improvement.",
        },
        {
          label: "Model A, because it achieves nearly the same R² with far fewer predictors, and its lower AIC confirms it's the better model",
          correct: true,
          explanation: "Correct. AIC penalizes complexity. The fact that Model B has higher AIC despite a marginally higher R² means the complexity penalty outweighs the fit improvement. Model A is the more appropriate choice — it explains nearly as much variance with a much simpler model.",
        },
        {
          label: "You need more information — neither model can be chosen without a p-value",
          correct: false,
          explanation: "AIC and BIC are model selection criteria that don't require p-values. They directly compare the trade-off between fit and complexity across models.",
        },
        {
          label: "Model B, because 15 predictors capture more real-world complexity",
          correct: false,
          explanation: "More predictors capture more real-world complexity only if those predictors are genuinely informative. With 15 predictors and minimal R² improvement, it's more likely that many predictors are noise contributing to overfitting.",
        },
      ],
    },
  ],
};

export default goodnessOfFit;
