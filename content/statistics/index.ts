import type { Unit } from "@brinnaebent/workbook";
import thinkingLikeADataScientist from "./chapters/01-practical-statistics";
import probabilityDistributions from "./chapters/02-probability-distributions";
import hypothesisTesting from "./chapters/03-hypothesis-testing";
import powerAnalysis from "./chapters/04-power-analysis";
import sampling from "./chapters/05-sampling";
import classBalancing from "./chapters/06-class-balancing";
import parametricTests from "./chapters/07-parametric-tests";
import nonparametricTests from "./chapters/08-nonparametric-tests";
import anova from "./chapters/09-anova";
import regression from "./chapters/10-regression";
import bayesianStatistics from "./chapters/11-bayesian-statistics";
import modelEvaluation from "./chapters/12-model-evaluation";

const statistics: Unit = {
  id: "statistics",
  number: 2,
  title: "Statistics",
  description:
    "This unit builds a practitioner's statistical toolkit — from descriptive foundations through hypothesis testing, power analysis, sampling, the full test toolkit, regression, Bayesian inference, and rigorous model evaluation.",
  chapters: [
    thinkingLikeADataScientist,
    probabilityDistributions,
    hypothesisTesting,
    powerAnalysis,
    sampling,
    classBalancing,
    parametricTests,
    nonparametricTests,
    anova,
    regression,
    bayesianStatistics,
    modelEvaluation,
  ],
};

export default statistics;
