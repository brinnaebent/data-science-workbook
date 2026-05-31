import type { Section } from "@brinnaebent/workbook";

const whatFeatureEngineeringIs: Section = {
  id: "what-feature-engineering-is",
  number: 1,
  title: "Feature Engineering",
  blocks: [
    {
      type: "text",
      html: `<p>Feature engineering is what happens between raw data and the features that go into your model:</p>
<p style="text-align:center;"><strong>Raw Data → [ Feature Engineering ] → Features → Model</strong></p>
<p>The goal is to extract meaningful information from raw data, reduce dimensionality, and enhance the model's ability to capture patterns. The features are what the model actually sees. If the features are uninformative, no model can fix that. If the features are well-designed, even a simple model can do remarkable things.</p>
<p>It is iterative. It requires experimentation. There's a feedback loop where you try features, see what works, try variations. Sometimes ideas come from intuition. Sometimes from a research paper. Sometimes from a conversation with a domain expert. Sometimes you steal an idea from a completely different domain.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Continuous Glucose Monitoring: Engineering What Doesn't Exist",
      html: `<p>CGMs are arm-worn sensors that measure interstitial glucose every few minutes. The raw signal is a time series — a sequence of glucose readings. To build a useful model on it, I had to dig through the clinical literature and identify features that diabetes researchers had found informative.</p>
<p>The result is a table of engineered features that didn't exist in the raw signal: inter-day coefficient of variation, high blood glucose index, low blood glucose index, mean of glucose excursions, mean of daily differences. None of these are <em>given</em> by the sensor. Each is a transformation rooted in clinical knowledge of how glucose dynamics matter physiologically. Once you have these features, modeling becomes possible. Without them, you're feeding raw numbers to a model and hoping.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Where Competitions Are Won",
      html: `<p>In Kaggle competitions, the difference between leaderboard winners and also-rans is almost always feature engineering. The models are largely the same — gradient-boosted trees, neural networks — but the features are different. The same is true in industry. The companies that win on ML often win because they have feature engineering pipelines their competitors haven't thought of.</p>`,
    },
    {
      type: "text",
      html: `<p>Feature engineering relies on domain expertise. You are rarely the domain expert — and even if you are, you should seek out others. The best feature engineering work involves a data scientist who understands the math talking to a domain expert who understands what the numbers actually mean.</p>
<p>Three strategies for accessing expertise you don't have:</p>
<ul>
<li><strong>Read.</strong> Research papers, textbooks, domain lectures. Build expertise yourself, even if you'll bring in collaborators. It pays off in unexpected ways — you'll ask better questions and spot better opportunities.</li>
<li><strong>Talk to domain experts.</strong> Learn their vocabulary so you can communicate. Build relationships with people who think differently than you do. Many of the best features I've ever engineered came from a conversation where an expert said "well, we always look at X because of Y" — something I never would have found in the literature.</li>
<li><strong>Apply ideas across domains.</strong> Signal processing techniques for heartbeat detection from PPG are mathematically similar to anomaly detection in financial time series. Image augmentation from medical imaging transfers to satellite imagery. Cross-domain transfer of feature engineering ideas is wildly underrated.</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "ds-fe-what-q1",
      kind: "mc",
      question: "A model trained directly on raw sensor accelerometer readings performs poorly. You engineer features like 'mean acceleration over a 2-second window' and 'peak frequency from FFT.' Performance improves dramatically. Why?",
      options: [
        {
          label: "The engineered features capture patterns the model couldn't learn directly from raw samples",
          correct: true,
          explanation: "Correct. A windowed mean and a frequency-domain feature encode temporal structure and periodicity that are invisible in individual raw samples. The model sees the pattern you've extracted rather than noise-dominated individual readings. Feature engineering transferred domain knowledge (activity patterns have characteristic frequencies and magnitudes) into the model.",
        },
        {
          label: "The engineered features reduced dimensionality, which always improves model performance",
          correct: false,
          explanation: "Dimensionality reduction can help, but it's not guaranteed to improve performance. What happened here is that the features encode meaningful signal — not just fewer dimensions. A low-dimensional representation of noise performs no better than high-dimensional noise.",
        },
        {
          label: "More complex models would have learned these features automatically — simpler models need hand-engineering",
          correct: false,
          explanation: "Even deep learning models benefit from domain-informed features for sensor data. CNNs and RNNs can learn some temporal patterns from raw sequences, but they require far more data and compute. Hand-engineering good features is often more efficient and results in models that generalize better from limited data.",
        },
      ],
    },
  ],
};

export default whatFeatureEngineeringIs;
