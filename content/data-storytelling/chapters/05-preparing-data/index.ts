import type { Chapter } from "@brinnaebent/workbook";
import whyThreeSplits from "./01-why-three-splits";
import crossValidation from "./02-cross-validation";
import dataLeakage from "./03-data-leakage";
import versioningAndReproducibility from "./04-versioning-and-reproducibility";

const preparingData: Chapter = {
  id: "preparing-data",
  number: 5,
  title: "Preparing Data for Modeling",
  overview:
    "The chapter that decides whether your model works in the real world or only in your notebook. Learn why three splits beat two, how cross-validation works, and — most importantly — how data leakage quietly destroys models that look great in evaluation.",
  sections: [whyThreeSplits, crossValidation, dataLeakage, versioningAndReproducibility],
};

export default preparingData;
