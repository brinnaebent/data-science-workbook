import type { Chapter } from "@brinnaebent/workbook";
import whyThisChapterMatters from "./01-why-this-chapter-matters";
import responsibleAiFramework from "./02-responsible-ai-framework";
import sixSourcesOfBias from "./03-six-sources-of-bias";
import mitigatingBias from "./04-mitigating-bias";
import transparencyInterpretabilityExplainability from "./07-transparency-interpretability-explainability";
import privacyAndRegulations from "./08-privacy-and-regulations";

const dataRisksBiasEthics: Chapter = {
  id: "data-risks-bias-ethics",
  number: 8,
  title: "Data Risks, Bias, & Ethics",
  overview:
    "The last chapter and the most important. Everything we've covered in this unit is technical. This chapter is where the technical and the ethical fuse together — covering bias sources, fairness frameworks, explainability, privacy law, and the practitioner's responsibility when shipping AI systems that affect real people.",
  sections: [
    whyThisChapterMatters,
    responsibleAiFramework,
    sixSourcesOfBias,
    mitigatingBias,
    transparencyInterpretabilityExplainability,
    privacyAndRegulations,
  ],
};

export default dataRisksBiasEthics;
