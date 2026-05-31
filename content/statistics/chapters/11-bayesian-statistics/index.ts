import type { Chapter } from "@brinnaebent/workbook";
import aDifferentWayToThink from "./01-a-different-way-to-think";
import bayesTheorem from "./02-bayes-theorem";
import whenToUseBayesian from "./03-when-to-use-bayesian";

const bayesianStatistics: Chapter = {
  id: "bayesian-statistics",
  number: 11,
  title: "Bayesian Statistics",
  overview:
    "Bayesian statistics asks a different question than frequentist methods: given the data, how should I update my beliefs? This chapter introduces Bayes' Theorem, the prior-likelihood-posterior framework, and the practical ML contexts where Bayesian thinking provides a real advantage.",
  sections: [
    aDifferentWayToThink,
    bayesTheorem,
    whenToUseBayesian,
  ],
};

export default bayesianStatistics;
