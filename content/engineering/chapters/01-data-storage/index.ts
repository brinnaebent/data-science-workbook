import type { Chapter } from "@brinnaebent/workbook";
import whyStorageIsTheWholeStory from "./01-why-storage-is-the-whole-story";
import whatKindOfData from "./02-what-kind-of-data";
import relationalDatabasesAndSQL from "./03-relational-databases-and-sql";
import nosqlAndWhenRelationalStopsFitting from "./04-nosql-and-when-relational-stops-fitting";
import vectorDatabasesAndRAG from "./05-vector-databases-and-rag";
import warehousesLakesAndHowToChoose from "./06-warehouses-lakes-and-how-to-choose";

const dataStorage: Chapter = {
  id: "data-storage",
  number: 1,
  title: "Data Storage",
  overview:
    "Where your data lives shapes every model decision you can make. This chapter covers the full spectrum — relational databases, NoSQL, vector databases, warehouses, and lakes — and builds a decision framework for choosing the right tool.",
  sections: [
    whyStorageIsTheWholeStory,
    whatKindOfData,
    relationalDatabasesAndSQL,
    nosqlAndWhenRelationalStopsFitting,
    vectorDatabasesAndRAG,
    warehousesLakesAndHowToChoose,
  ],
};

export default dataStorage;
