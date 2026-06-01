import type { Chapter } from "@brinnaebent/workbook";
import fromNotebookToTheWorld from "./01-from-notebook-to-the-world";
import dockerAndDeployment from "./02-docker-and-deployment";
import cicdAndVersioning from "./03-cicd-and-versioning";
import monitoringAndDrift from "./04-monitoring-and-drift";
import scalabilityCostAndSecurity from "./05-scalability-cost-and-security";
import prototypesDemosAndYourPortfolio from "./06-prototypes-demos-and-your-portfolio";

const mlPipelines: Chapter = {
  id: "ml-pipelines",
  number: 3,
  title: "Building ML Pipelines",
  overview:
    "Getting a model out of the notebook and into production is the second half of the ML engineer's job. This chapter covers the full MLOps lifecycle — Docker, deployment strategies, CI/CD, monitoring for data drift, scalability, cost, security, and building demos that get you hired.",
  sections: [
    fromNotebookToTheWorld,
    dockerAndDeployment,
    cicdAndVersioning,
    monitoringAndDrift,
    scalabilityCostAndSecurity,
    prototypesDemosAndYourPortfolio,
  ],
};

export default mlPipelines;
