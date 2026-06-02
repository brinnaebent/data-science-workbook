import type { Chapter } from "@brinnaebent/workbook";
import boxPlotLesson from "./01-box-plot-lesson";
import visualizationToolkit from "./02-visualization-toolkit";
import plotToNarrative from "./04-plot-to-narrative";

const tellingStories: Chapter = {
  id: "telling-stories",
  number: 4,
  title: "Telling Stories with Data",
  overview:
    "Producing good insights is only half the job. Delivering them to people who need to make decisions is the other half — and it requires a different set of skills. This chapter covers visualization choice, audience design, and the three-part anatomy of a data story that actually lands.",
  sections: [boxPlotLesson, visualizationToolkit, plotToNarrative],
};

export default tellingStories;
