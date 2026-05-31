import type { Chapter } from "@brinnaebent/workbook";
import beyondTwoGroups from "./01-beyond-two-groups";
import partitioningVariability from "./02-partitioning-variability";
import postHocTests from "./03-post-hoc-tests";

const anova: Chapter = {
  id: "anova",
  number: 9,
  title: "ANOVA",
  overview:
    "Comparing three or more groups with multiple t-tests inflates your false positive rate. ANOVA tests all groups simultaneously by partitioning variability into between-group and within-group components. This chapter covers one-way ANOVA, the F-statistic, and post hoc tests for identifying which groups differ.",
  sections: [
    beyondTwoGroups,
    partitioningVariability,
    postHocTests,
  ],
};

export default anova;
