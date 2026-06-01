import { defineConfig } from "@brinnaebent/workbook";
import { ArticleEmbed } from "@brinnaebent/workbook/client";
import ApiRequestExplorer from "./interactives/ApiRequestExplorer";
import BinaryConverter from "./interactives/BinaryConverter";
import EncodingComparison from "./interactives/EncodingComparison";
import FrequencyDomainExplorer from "./interactives/FrequencyDomainExplorer";
import PixelExplorer from "./interactives/PixelExplorer";
import SamplingExplorer from "./interactives/SamplingExplorer";
import StopWordVisualizer from "./interactives/StopWordVisualizer";
import TokenizerPlayground from "./interactives/TokenizerPlayground";
import Word2VecVisualizer from "./interactives/Word2VecVisualizer";
import SignalSpy from "./interactives/SignalSpy";
import DataScienceInterestSurvey from "./interactives/DataScienceInterestSurvey";
import LabelingWorkflow from "./interactives/LabelingWorkflow";
import WebScrapingDiagram from "./interactives/WebScrapingDiagram";
import SamplingBiasExplorer from "./interactives/SamplingBiasExplorer";
import DataInfrastructureWizard from "./interactives/DataInfrastructureWizard";
import DistributionExplorer from "./interactives/DistributionExplorer";
import CorrelationHeatmap from "./interactives/CorrelationHeatmap";
import EDAVizTour from "./interactives/EDAVizTour";
import IrisPairPlot from "./interactives/IrisPairPlot";
import StarbucksMemory from "./interactives/StarbucksMemory";
import AudienceChartComparison from "./interactives/AudienceChartComparison";
import ChartTypePicker from "./interactives/ChartTypePicker";
import ThreeSplitExplorer from "./interactives/ThreeSplitExplorer";
import KFoldExplorer from "./interactives/KFoldExplorer";
import LeakageDetector from "./interactives/LeakageDetector";
import MissingnessClassifier from "./interactives/MissingnessClassifier";
import OutlierDetector from "./interactives/OutlierDetector";
import TransformExplorer from "./interactives/TransformExplorer";
import DQAWalkthrough from "./interactives/DQAWalkthrough";
import WearableMissingnessExplorer from "./interactives/WearableMissingnessExplorer";
import TimeSeriesDecomposition from "./interactives/TimeSeriesDecomposition";
import CVFeatureSlideshow from "./interactives/CVFeatureSlideshow";
import StemmingLemmatizationDemo from "./interactives/StemmingLemmatizationDemo";
import PCAExplorer from "./interactives/PCAExplorer";
import FeatureSelectionComparison from "./interactives/FeatureSelectionComparison";
import PopulationSampleExplorer from "./interactives/PopulationSampleExplorer";
import DescriptiveStatsExplorer from "./interactives/DescriptiveStatsExplorer";
import HowMuchDataExplorer from "./interactives/HowMuchDataExplorer";

// Register your interactive components here.
// The key must match the "component" field in your content blocks.
// e.g. { type: "interactive", component: "MyDemo", ... }

export default defineConfig({
  title: "Data Science Workbook",
  description: "Learn fundamental concepts in data science including data storytelling, statistics, and data/ML engineering.",
  components: {
    ArticleEmbed,
    ApiRequestExplorer,
    BinaryConverter,
    EncodingComparison,
    FrequencyDomainExplorer,
    PixelExplorer,
    SamplingExplorer,
    StopWordVisualizer,
    TokenizerPlayground,
    Word2VecVisualizer,
    SignalSpy,
    DataScienceInterestSurvey,
    LabelingWorkflow,
    WebScrapingDiagram,
    SamplingBiasExplorer,
    DataInfrastructureWizard,
    DistributionExplorer,
    CorrelationHeatmap,
    EDAVizTour,
    IrisPairPlot,
    StarbucksMemory,
    AudienceChartComparison,
    ChartTypePicker,
    ThreeSplitExplorer,
    KFoldExplorer,
    LeakageDetector,
    MissingnessClassifier,
    OutlierDetector,
    TransformExplorer,
    DQAWalkthrough,
    WearableMissingnessExplorer,
    TimeSeriesDecomposition,
    CVFeatureSlideshow,
    StemmingLemmatizationDemo,
    PCAExplorer,
    FeatureSelectionComparison,
    PopulationSampleExplorer,
    DescriptiveStatsExplorer,
    HowMuchDataExplorer,
  },
});
