import type { Unit } from "@brinnaebent/workbook";
import dataStorage from "./chapters/01-data-storage";
import dataPipelines from "./chapters/02-data-pipelines";
import mlPipelines from "./chapters/03-ml-pipelines";

const engineering: Unit = {
  id: "engineering",
  number: 3,
  title: "Data/ML Engineering",
  description:
    "Where does your data actually live, how does it get to you, and how does the model you build ever escape your laptop? This unit covers data storage, data pipelines, and ML pipelines — the infrastructure layer that separates a science project from a production system.",
  chapters: [dataStorage, dataPipelines, mlPipelines],
};

export default engineering;
