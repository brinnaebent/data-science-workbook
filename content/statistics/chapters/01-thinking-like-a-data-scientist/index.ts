import type { Chapter } from "@brinnaebent/workbook";
import whatStatisticsBuysYou from "./01-what-statistics-buys-you";
import populationVsSample from "./02-population-vs-sample";
import descriptiveStatistics from "./03-descriptive-statistics";
import descriptiveVsInferential from "./04-descriptive-vs-inferential";
import howMuchData from "./05-how-much-data";

const thinkingLikeADataScientist: Chapter = {
  id: "thinking-like-a-data-scientist",
  number: 1,
  title: "Thinking Like a Data Scientist",
  overview:
    "Statistics is what separates 'the number went up' from 'the number went up meaningfully.' This chapter establishes why statistical thinking matters, introduces the core vocabulary of populations and samples, and frames the unit's central question: how much data do you actually need?",
  sections: [
    whatStatisticsBuysYou,
    populationVsSample,
    descriptiveStatistics,
    descriptiveVsInferential,
    howMuchData,
  ],
};

export default thinkingLikeADataScientist;
