import type { Chapter } from "@brinnaebent/workbook";
import missingFeatures from "./01-missing-features";
import missingValues from "./02-missing-values";
import missingnessAsFeature from "./03-missingness-as-feature";
import detectingOutliers from "./04-detecting-outliers";
import handlingOutliersAndTransforms from "./05-handling-outliers-and-transforms";
import dataQualityAssessment from "./06-data-quality-assessment";

const preprocessing: Chapter = {
  id: "preprocessing",
  number: 6,
  title: "Preprocessing",
  overview:
    "Before any complex modeling, you have to make your data fit to model on. This chapter covers missing features, missing values (MCAR/MAR/MNAR), outlier detection and handling, data transformations, and the structured quality assessment process that separates professional data work from notebook hacking.",
  sections: [
    missingFeatures,
    missingValues,
    missingnessAsFeature,
    detectingOutliers,
    handlingOutliersAndTransforms,
    dataQualityAssessment,
  ],
};

export default preprocessing;
