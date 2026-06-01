import type { Section } from "@brinnaebent/workbook";

const chiSquare: Section = {
  id: "chi-square",
  number: 4,
  title: "The Chi-Square Test",
  blocks: [
    {
      type: "text",
      html: `<p>The tests so far compare means or distributions of continuous data. The chi-square test is fundamentally different — it's for <strong>categorical data</strong>. Are two categorical variables associated? Does a categorical variable's distribution match what you'd expect?</p>`,
    },
    {
      type: "text",
      html: `<h3><strong>Chi-Square Test of Independence</strong></h3>
<p><strong>Question:</strong> Are two categorical variables associated?</p>
<p><strong>Use it when:</strong> You have two categorical variables and want to know if they're related — or independent.</p>
<p><strong>Process:</strong></p>
<ol>
<li>Build a contingency table of observed frequencies (rows × columns = one cell per category combination).</li>
<li>Compute expected frequencies under independence: (row total × column total) / grand total.</li>
<li>Chi-square statistic: $\\chi^2 = \\sum \\frac{(O - E)^2}{E}$</li>
</ol><br>
<p><strong>Examples:</strong> Is device type associated with conversion? Is gender associated with product preference? Is neighborhood associated with churn?</p>
<p><strong>In Python:</strong> <code>scipy.stats.chi2_contingency(contingency_table)</code></p>`,
    },
    {
      type: "interactive",
      component: "ChiSquareIndependenceWalkthrough",
      caption: "Walk through the four steps of the chi-square test of independence. Switch datasets to see how expected counts, cell contributions, and the final p-value change.",
      props: {},
    },
    {
      type: "text",
      html: `<h3><strong>Chi-Square Goodness-of-Fit</strong></h3>
<p><strong>Question:</strong> Does the distribution of a single categorical variable match an expected distribution?</p>
<p><strong>Examples:</strong> Are customer arrivals uniformly distributed across days of the week? Are dice rolls actually uniform? Does the demographic distribution of your users match the national distribution?</p>
<p><strong>In Python:</strong> <code>scipy.stats.chisquare(observed, expected)</code></p>`,
    },
    {
      type: "interactive",
      component: "ChiSquareGoodnessOfFit",
      caption: "Walk through the goodness-of-fit test step by step. See how observed counts compare to a reference distribution and which categories drive the test statistic.",
      props: {},
    },
    {
      type: "callout",
      variant: "warning",
      title: "Assumptions That Get Missed",
      html: `<ul>
<li><strong>Independence of observations.</strong></li>
<li><strong>Sufficient sample size:</strong> Each cell of the contingency table should have at least 5 expected occurrences. Fewer than 20% of cells with expected frequencies below 5.</li>
<li>If cells have very low expected counts, use <strong>Fisher's exact test</strong> instead — it doesn't rely on the chi-square approximation and works well with small samples.</li>
<li><strong>Mutually exclusive categories:</strong> Each data point must fit into exactly one category.</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch8-s4-q1",
      kind: "mc",
      question: "You want to test whether users from different countries (US, UK, Germany, France) have different rates of opting into push notifications (Yes/No). You build a 4×2 contingency table. One cell has an expected count of 3. What should you do?",
      options: [
        {
          label: "Proceed with the chi-square test — one low cell is acceptable",
          correct: false,
          explanation: "The chi-square approximation breaks down when expected counts are too low. The rule of thumb is that all cells should have expected counts ≥ 5, or at most 20% below 5. A single cell with 3 likely makes the chi-square approximation unreliable.",
        },
        {
          label: "Use Fisher's exact test, which is valid for small expected counts",
          correct: true,
          explanation: "Correct. Fisher's exact test doesn't rely on the chi-square approximation and is appropriate when expected cell counts are too low. For large tables, it can be computationally expensive, but for a 4×2 table it's perfectly tractable.",
        },
        {
          label: "Drop the country with the low cell count",
          correct: false,
          explanation: "Dropping data because the test doesn't fit is data manipulation. The solution is to choose a test appropriate for the data, not to modify the data to fit the test.",
        },
        {
          label: "Combine the low-count cell with an adjacent cell",
          correct: false,
          explanation: "Combining categories changes the question you're asking. This can sometimes be appropriate (e.g., if two countries are similar), but it requires domain justification — not just 'the count was too low.'",
        },
      ],
    },
  ],
};

export default chiSquare;
