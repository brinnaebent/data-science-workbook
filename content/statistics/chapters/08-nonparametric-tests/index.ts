import type { Chapter } from "@brinnaebent/workbook";
import whenAssumptionsWontHold from "./01-when-assumptions-wont-hold";
import wilcoxonSignedRank from "./02-wilcoxon-signed-rank";
import mannWhitney from "./03-mann-whitney";
import chiSquare from "./04-chi-square";
import decisionTree from "./05-decision-tree";

const nonparametricTests: Chapter = {
  id: "nonparametric-tests",
  number: 8,
  title: "Nonparametric Tests",
  overview:
    "When the assumptions of parametric tests break down — and they often do in real data — nonparametric tests provide valid inference. This chapter covers the Wilcoxon signed-rank test, the Mann-Whitney U test, and the chi-square test, along with a decision tree for choosing the right test for any two-group comparison.",
  sections: [
    whenAssumptionsWontHold,
    wilcoxonSignedRank,
    mannWhitney,
    chiSquare,
    decisionTree,
  ],
};

export default nonparametricTests;
