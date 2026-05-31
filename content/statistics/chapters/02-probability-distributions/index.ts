import type { Chapter } from "@brinnaebent/workbook";
import shapeOfUncertainty from "./01-shape-of-uncertainty";
import discreteDistributions from "./02-discrete-distributions";
import continuousDistributions from "./03-continuous-distributions";
import studentTDistribution from "./04-student-t-distribution";
import distributionsAcrossML from "./05-distributions-across-ml";

const probabilityDistributions: Chapter = {
  id: "probability-distributions",
  number: 2,
  title: "Probability Distributions",
  overview:
    "Every outcome you model has a shape. Probability distributions describe that shape mathematically — what values are likely, what values are rare, and what would be genuinely surprising. This chapter builds the vocabulary you need to choose the right distribution for any data science problem.",
  sections: [
    shapeOfUncertainty,
    discreteDistributions,
    continuousDistributions,
    studentTDistribution,
    distributionsAcrossML,
  ],
};

export default probabilityDistributions;
