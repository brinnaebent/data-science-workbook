import type { Chapter } from "@brinnaebent/workbook";
import howGoodIsMyModel from "./01-how-good-is-my-model";
import goodnessOfFit from "./02-goodness-of-fit";
import residualAnalysis from "./03-residual-analysis";
import simpsonsParadox from "./04-simpsons-paradox";
import evaluationChecklist from "./05-evaluation-checklist";

const modelEvaluation: Chapter = {
  id: "model-evaluation",
  number: 12,
  title: "Model Evaluation",
  overview:
    "A model with good metrics is not the same as a trustworthy model. This chapter closes the unit with the statistical toolkit for robust model evaluation: goodness-of-fit measures, residual analysis, confidence intervals, Simpson's Paradox, and a checklist that synthesizes every concept from the unit into a practical evaluation workflow.",
  sections: [
    howGoodIsMyModel,
    goodnessOfFit,
    residualAnalysis,
    simpsonsParadox,
    evaluationChecklist,
  ],
};

export default modelEvaluation;
