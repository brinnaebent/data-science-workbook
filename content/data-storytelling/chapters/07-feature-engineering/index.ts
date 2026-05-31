import type { Chapter } from "@brinnaebent/workbook";
import whatFeatureEngineeringIs from "./01-what-feature-engineering-is";
import domainExpertise from "./02-domain-expertise";
import tabularFeatures from "./03-tabular-features";
import timeSeriesFeatures from "./04-time-series-features";
import imageFeatures from "./05-image-features";
import textFeatures from "./06-text-features";
import dimensionalityReduction from "./07-dimensionality-reduction";
import featureSelection from "./08-feature-selection";

const featureEngineering: Chapter = {
  id: "feature-engineering",
  number: 7,
  title: "Feature Engineering",
  overview:
    "The highest-leverage thing you can do for model performance — and the place where domain expertise pays off more than anywhere else in the pipeline. This chapter covers feature engineering for tabular, time series, image, and text data, plus dimensionality reduction and feature selection.",
  sections: [
    whatFeatureEngineeringIs,
    domainExpertise,
    tabularFeatures,
    timeSeriesFeatures,
    imageFeatures,
    textFeatures,
    dimensionalityReduction,
    featureSelection,
  ],
};

export default featureEngineering;
