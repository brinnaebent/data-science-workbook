import type { Chapter } from "@brinnaebent/workbook";
import openingQuestions from "./01-opening-questions";
import descriptiveStatistics from "./02-descriptive-statistics";
import dataQuality from "./03-data-quality";
import variableRelationships from "./04-variable-relationships";
import visualizationInEda from "./05-visualization-in-eda";
import workedExampleIris from "./06-worked-example-iris";

const exploratoryDataAnalysis: Chapter = {
  id: "exploratory-data-analysis",
  number: 3,
  title: "Exploratory Data Analysis",
  overview:
    "EDA is the bridge between 'we have data' and 'we can model.' This chapter teaches you the questions to ask, the statistics to compute, the patterns to look for, and how to turn a complete EDA pass into a concrete modeling plan.",
  sections: [
    openingQuestions,
    descriptiveStatistics,
    dataQuality,
    variableRelationships,
    visualizationInEda,
    workedExampleIris,
  ],
};

export default exploratoryDataAnalysis;
