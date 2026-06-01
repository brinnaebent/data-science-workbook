import type { Chapter } from "@brinnaebent/workbook";
import whatDataEngineersActuallyDo from "./01-what-data-engineers-actually-do";
import etlTheCentralAbstraction from "./02-etl-the-central-abstraction";
import orchestrationAndDAGs from "./03-orchestration-and-dags";
import bigDataHadoopSparkHive from "./04-big-data-hadoop-spark-hive";
import cloudWarehouses from "./05-cloud-warehouses";
import designingAPipeline from "./06-designing-a-pipeline";

const dataPipelines: Chapter = {
  id: "data-pipelines",
  number: 2,
  title: "Building Data Pipelines",
  overview:
    "Data engineering is the infrastructure that makes modeling possible. This chapter covers the ETL pattern, pipeline orchestration with DAGs, distributed processing with Spark, the major cloud warehouses, and how to design a pipeline from source to dashboard.",
  sections: [
    whatDataEngineersActuallyDo,
    etlTheCentralAbstraction,
    orchestrationAndDAGs,
    bigDataHadoopSparkHive,
    cloudWarehouses,
    designingAPipeline,
  ],
};

export default dataPipelines;
