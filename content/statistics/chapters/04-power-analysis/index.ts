import type { Chapter } from "@brinnaebent/workbook";
import thePracticalQuestion from "./01-the-practical-question";
import statisticalPower from "./02-statistical-power";
import effectSize from "./03-effect-size";
import powerAnalysisInPython from "./04-power-analysis-in-python";

const powerAnalysis: Chapter = {
  id: "power-analysis",
  number: 4,
  title: "Statistical Significance and Power Analysis",
  overview:
    "Power analysis is the principled answer to 'how much data do I need?' This chapter covers the four interlocking components of a power analysis, how to estimate effect size, and how to run a power analysis in Python — so you can give a defensible, quantitative answer to the sample size question.",
  sections: [
    thePracticalQuestion,
    statisticalPower,
    effectSize,
    powerAnalysisInPython,
  ],
};

export default powerAnalysis;
