import type { Unit } from "@brinnaebent/workbook";
import informationRepresentation from "./chapters/01-information-representation";
import sourcingData from "./chapters/02-sourcing-data";
import exploratoryDataAnalysis from "./chapters/03-exploratory-data-analysis";
import tellingStories from "./chapters/04-telling-stories";
import preparingData from "./chapters/05-preparing-data";
import preprocessing from "./chapters/06-preprocessing";
import featureEngineering from "./chapters/07-feature-engineering";
import dataRisksBiasEthics from "./chapters/08-data-risks-bias-ethics";

const dataStorytelling: Unit = {
  id: "data-storytelling",
  number: 1,
  title: "Data Storytelling",
  description:
    "From raw information to actionable insight: how data is represented, sourced, explored, visualized, and prepared for modeling — and the ethical responsibilities that come with it.",
  chapters: [
    informationRepresentation,
    sourcingData,
    exploratoryDataAnalysis,
    tellingStories,
    preparingData,
    preprocessing,
    featureEngineering,
    dataRisksBiasEthics,
  ],
};

export default dataStorytelling;
