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
import DistributionShapeExplorer from "./interactives/DistributionShapeExplorer";
import DiscreteDistributionExplorer from "./interactives/DiscreteDistributionExplorer";
import ContinuousDistributionExplorer from "./interactives/ContinuousDistributionExplorer";
import TDistributionExplorer from "./interactives/TDistributionExplorer";
import PValueVisualizer from "./interactives/PValueVisualizer";
import PowerAnalysisExplorer from "./interactives/PowerAnalysisExplorer";
import SamplingMethodsExplorer from "./interactives/SamplingMethodsExplorer";
import StratifiedSplitExplorer from "./interactives/StratifiedSplitExplorer";
import SMOTEVisualizer from "./interactives/SMOTEVisualizer";
import ClassBalancingComparison from "./interactives/ClassBalancingComparison";
import AssumptionChecker from "./interactives/AssumptionChecker";
import ZScoreExplorer from "./interactives/ZScoreExplorer";
import OneSampleTTest from "./interactives/OneSampleTTest";
import IndependentSamplesTTest from "./interactives/IndependentSamplesTTest";
import PairedVsIndependentExplorer from "./interactives/PairedVsIndependentExplorer";
import TestDecisionTree from "./interactives/TestDecisionTree";
import ANOVAVariancePartitioner from "./interactives/ANOVAVariancePartitioner";
import ResidualsExplorer from "./interactives/ResidualsExplorer";
import RegressionInterpreter from "./interactives/RegressionInterpreter";
import BayesTheoremVisualizer from "./interactives/BayesTheoremVisualizer";
import ResidualAnalysisDashboard from "./interactives/ResidualAnalysisDashboard";
import SimpsonsParadoxVisualizer from "./interactives/SimpsonsParadoxVisualizer";
import SQLSandbox from "./interactives/SQLSandbox";
import StoragePicker from "./interactives/StoragePicker";
import PipelineCostSimulator from "./interactives/PipelineCostSimulator";
import DAGBuilder from "./interactives/DAGBuilder";
import DeploymentDecisionTree from "./interactives/DeploymentDecisionTree";
import DriftDetective from "./interactives/DriftDetective";
import StreamlitLab from "./interactives/StreamlitLab";
import WilcoxonWalkthrough from "./interactives/WilcoxonWalkthrough";
import MannWhitneyWalkthrough from "./interactives/MannWhitneyWalkthrough";
import ChiSquareIndependenceWalkthrough from "./interactives/ChiSquareIndependenceWalkthrough";
import ChiSquareGoodnessOfFit from "./interactives/ChiSquareGoodnessOfFit";
import TwoGroupDecisionTree from "./interactives/TwoGroupDecisionTree";
import TukeyHSDExplorer from "./interactives/TukeyHSDExplorer";
import EvaluationChecklist from "./interactives/EvaluationChecklist";
import RegressionAssumptionsGrid from "./interactives/RegressionAssumptionsGrid";
import RegressionUsesGrid from "./interactives/RegressionUsesGrid";
import DataTypesGrid from "./interactives/DataTypesGrid";
import FourVsGrid from "./interactives/FourVsGrid";
import JoinTypesGrid from "./interactives/JoinTypesGrid";
import DatabaseDecisionFramework from "./interactives/DatabaseDecisionFramework";
import NoSQLTypesGrid from "./interactives/NoSQLTypesGrid";
import LakehouseComparison from "./interactives/LakehouseComparison";
import ETLStepsGrid from "./interactives/ETLStepsGrid";
import AirflowDAG from "./interactives/AirflowDAG";
import SparkArchitecture from "./interactives/SparkArchitecture";
import MLCICDPipeline from "./interactives/MLCICDPipeline";
import MLOpsLifecycleGrid from "./interactives/MLOpsLifecycleGrid";
import DeploymentOptionsGrid from "./interactives/DeploymentOptionsGrid";
import DockerPropertiesGrid from "./interactives/DockerPropertiesGrid";
import VersioningGrid from "./interactives/VersioningGrid";
import DataDriftVisualizer from "./interactives/DataDriftVisualizer";
import MonitoringStackGrid from "./interactives/MonitoringStackGrid";
import DemoFrameworksGrid from "./interactives/DemoFrameworksGrid";

// Register your interactive components here.
// The key must match the "component" field in your content blocks.
// e.g. { type: "interactive", component: "MyDemo", ... }

export default defineConfig({
  title: "Data Science",
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
    DistributionShapeExplorer,
    DiscreteDistributionExplorer,
    ContinuousDistributionExplorer,
    TDistributionExplorer,
    PValueVisualizer,
    PowerAnalysisExplorer,
    SamplingMethodsExplorer,
    StratifiedSplitExplorer,
    SMOTEVisualizer,
    ClassBalancingComparison,
    AssumptionChecker,
    ZScoreExplorer,
    OneSampleTTest,
    IndependentSamplesTTest,
    PairedVsIndependentExplorer,
    TestDecisionTree,
    ANOVAVariancePartitioner,
    ResidualsExplorer,
    RegressionInterpreter,
    BayesTheoremVisualizer,
    ResidualAnalysisDashboard,
    SimpsonsParadoxVisualizer,
    SQLSandbox,
    StoragePicker,
    PipelineCostSimulator,
    DAGBuilder,
    DeploymentDecisionTree,
    DriftDetective,
    StreamlitLab,
    WilcoxonWalkthrough,
    MannWhitneyWalkthrough,
    ChiSquareIndependenceWalkthrough,
    ChiSquareGoodnessOfFit,
    TwoGroupDecisionTree,
    TukeyHSDExplorer,
    EvaluationChecklist,
    RegressionAssumptionsGrid,
    RegressionUsesGrid,
    DataTypesGrid,
    FourVsGrid,
    JoinTypesGrid,
    DatabaseDecisionFramework,
    NoSQLTypesGrid,
    LakehouseComparison,
    ETLStepsGrid,
    AirflowDAG,
    SparkArchitecture,
    MLCICDPipeline,
    MLOpsLifecycleGrid,
    DeploymentOptionsGrid,
    DockerPropertiesGrid,
    VersioningGrid,
    DataDriftVisualizer,
    MonitoringStackGrid,
    DemoFrameworksGrid,
  },
});
