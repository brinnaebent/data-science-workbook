import type { Chapter } from "@brinnaebent/workbook";
import surveys from "./01-surveys";
import webScraping from "./02-web-scraping";
import userDataAndApps from "./03-user-data-and-apps";
import apis from "./04-apis";
import hardwareAndSensors from "./05-hardware-and-sensors";
import labelingData from "./06-labeling-data";
import irb from "./07-irb";
import samplingBias from "./08-sampling-bias";
import dataOrganization from "./09-data-organization";

const sourcingData: Chapter = {
  id: "sourcing-data",
  number: 2,
  title: "Sourcing Data",
  overview:
    "Where does data come from — and what tradeoffs did you accept the moment you chose that source? This chapter covers surveys, web scraping, user data, APIs, and sensors, then builds the organizational discipline (IRB, bias mitigation, documentation) that separates usable datasets from data swamps.",
  sections: [
    surveys,
    webScraping,
    userDataAndApps,
    apis,
    hardwareAndSensors,
    labelingData,
    irb,
    samplingBias,
    dataOrganization,
  ],
};

export default sourcingData;
