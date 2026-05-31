import type { Chapter } from "@brinnaebent/workbook";
import theMostImportantRule from "./01-the-most-important-rule";
import checkingAssumptions from "./02-checking-assumptions";
import zScoresAndOneSampleT from "./03-z-scores-and-one-sample-t";
import independentSamplesT from "./04-independent-samples-t";
import pairedTTest from "./05-paired-t-test";

const parametricTests: Chapter = {
  id: "parametric-tests",
  number: 7,
  title: "Parametric Tests",
  overview:
    "Parametric tests are powerful — but only when their assumptions hold. This chapter covers the three assumptions you must check every time, then walks through the t-test family: one-sample, independent (Student's and Welch's), and paired — with worked examples from real ML scenarios.",
  sections: [
    theMostImportantRule,
    checkingAssumptions,
    zScoresAndOneSampleT,
    independentSamplesT,
    pairedTTest,
  ],
};

export default parametricTests;
