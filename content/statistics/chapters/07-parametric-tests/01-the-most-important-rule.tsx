import type { Section } from "@brinnaebent/workbook";

const theMostImportantRule: Section = {
  id: "the-most-important-rule",
  number: 1,
  title: "The Most Important Rule",
  blocks: [
    {
      type: "text",
      html: `<p>Perhaps the most important lesson in this entire unit:</p>
<blockquote><strong>You must follow the assumptions for statistical tests.</strong></blockquote><br>
<p>The most common way people misuse statistics isn't picking the wrong test on purpose — it's picking a reasonable-looking test and ignoring the assumptions it requires. The test will run. It will give you a p-value. The p-value will be wrong, possibly badly, and you won't know.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "A Real Consequence",
      html: `<p>A data scientist at a pharmaceutical company is comparing two drugs for reducing blood pressure. Two groups of patients, one on each drug. She uses a t-test.</p>
<p>The t-test assumes approximately normally distributed data. When she looks at the actual blood pressure measurements, they're skewed with outliers. She proceeds anyway. The test returns a statistically significant result: Drug A is better than Drug B.</p>
<p>A teammate catches the error before the results ship. Because she violated the normality assumption, the t-test result was unreliable. The outliers distorted the result. She could have shipped the wrong conclusion about patient care.</p>
<p>That's why this chapter starts with assumptions. Parametric tests have requirements. Checking those requirements is part of the job.</p>`,
    },
  ],
};

export default theMostImportantRule;
