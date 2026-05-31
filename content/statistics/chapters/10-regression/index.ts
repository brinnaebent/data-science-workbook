import type { Chapter } from "@brinnaebent/workbook";
import sevenCountriesStudy from "./01-the-seven-countries-study";
import residualsAndOLS from "./02-residuals-and-ols";
import interpretingCoefficients from "./03-interpreting-coefficients";
import assumptionsAndMultiple from "./04-assumptions-and-multiple-regression";

const regression: Chapter = {
  id: "regression",
  number: 10,
  title: "Regression",
  overview:
    "Regression models the relationship between variables — for prediction, for understanding effects, and for hypothesis testing on coefficients. This chapter builds linear regression from the ground up using a real study, establishes how to interpret coefficients, and extends to multiple predictors.",
  sections: [
    sevenCountriesStudy,
    residualsAndOLS,
    interpretingCoefficients,
    assumptionsAndMultiple,
  ],
};

export default regression;
