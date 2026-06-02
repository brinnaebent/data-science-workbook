import type { Chapter } from "@brinnaebent/workbook";
import theSetup from "./01-the-setup";
import residualsAndOLS from "./02-residuals-and-ols";
import interpretingCoefficients from "./03-interpreting-coefficients";
import multipleRegression from "./04-multiple-regression";

const regression: Chapter = {
  id: "regression",
  number: 10,
  title: "Regression",
  overview:
    "Regression models the relationship between variables for prediction, for understanding effects, and for hypothesis testing on coefficients. This chapter builds linear regression from the ground up using house price prediction — starting with the assumptions that make OLS valid, then working through residuals, coefficients, and multiple predictors.",
  sections: [
    theSetup,
    residualsAndOLS,
    interpretingCoefficients,
    multipleRegression,
  ],
};

export default regression;
