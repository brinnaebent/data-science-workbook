import type { Chapter } from "@brinnaebent/workbook";
import youWillAlwaysBeSampling from "./01-you-will-always-be-sampling";
import probabilitySampling from "./02-probability-sampling";
import nonProbabilitySampling from "./03-non-probability-sampling";
import stratifiedForImbalancedML from "./04-stratified-for-imbalanced-ml";

const sampling: Chapter = {
  id: "sampling",
  number: 5,
  title: "Sampling",
  overview:
    "Every claim a data scientist makes is a claim about a population, made from a sample. This chapter covers the major sampling methods — probability and non-probability — and connects them to the ML workflows where sampling decisions have direct consequences: train/test splits, cross-validation, and handling class imbalance.",
  sections: [
    youWillAlwaysBeSampling,
    probabilitySampling,
    nonProbabilitySampling,
    stratifiedForImbalancedML,
  ],
};

export default sampling;
