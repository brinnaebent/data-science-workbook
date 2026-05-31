import type { Chapter } from "@brinnaebent/workbook";
import pizzaAndHamburgers from "./01-pizza-and-hamburgers";
import oversampling from "./02-oversampling";
import undersampling from "./03-undersampling";
import decisionFramework from "./04-decision-framework";

const classBalancing: Chapter = {
  id: "class-balancing",
  number: 6,
  title: "Class Balancing",
  overview:
    "A model that predicts 'pizza' every time can be 75% accurate and completely useless. This chapter covers why class imbalance breaks naive evaluation, and the practical toolkit — SMOTE, Tomek links, class weights — for building models that actually learn the minority class.",
  sections: [
    pizzaAndHamburgers,
    oversampling,
    undersampling,
    decisionFramework,
  ],
};

export default classBalancing;
