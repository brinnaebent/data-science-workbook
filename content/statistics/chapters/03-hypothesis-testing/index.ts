import type { Chapter } from "@brinnaebent/workbook";
import puttingOnYourScientistHat from "./01-putting-on-your-scientist-hat";
import sixSteps from "./02-six-steps";
import typeErrors from "./03-type-1-and-type-2-errors";
import pValues from "./04-p-values";
import pHacking from "./05-p-hacking";
import multipleComparisons from "./06-multiple-comparisons";

const hypothesisTesting: Chapter = {
  id: "hypothesis-testing",
  number: 3,
  title: "The Logic of Hypothesis Testing",
  overview:
    "Every model comparison, A/B test, and feature evaluation is hypothesis testing. This chapter establishes the formal procedure — hypotheses, test statistics, p-values, error types — and the discipline required to do it honestly: pre-registering your analysis, avoiding p-hacking, and correcting for multiple comparisons.",
  sections: [
    puttingOnYourScientistHat,
    sixSteps,
    typeErrors,
    pValues,
    pHacking,
    multipleComparisons,
  ],
};

export default hypothesisTesting;
