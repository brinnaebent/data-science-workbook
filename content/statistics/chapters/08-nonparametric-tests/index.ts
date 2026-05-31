import type { Chapter } from "@brinnaebent/workbook";
import whenAssumptionsWontHold from "./01-when-assumptions-wont-hold";
import wilcoxonAndMannWhitney from "./02-wilcoxon-and-mann-whitney";
import chiSquare from "./03-chi-square";
import decisionTree from "./04-decision-tree";

const nonparametricTests: Chapter = {
  id: "nonparametric-tests",
  number: 8,
  title: "Nonparametric Tests",
  overview:
    "When the assumptions of parametric tests break down — and they often do in real data — nonparametric tests provide valid inference. This chapter covers the Wilcoxon signed-rank test, the Mann-Whitney U test, and the chi-square test, along with a decision tree for choosing the right test for any two-group comparison.",
  sections: [
    whenAssumptionsWontHold,
    wilcoxonAndMannWhitney,
    chiSquare,
    decisionTree,
  ],
};

export default nonparametricTests;
