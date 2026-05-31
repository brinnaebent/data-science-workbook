import type { Section } from "@brinnaebent/workbook";

const timeSeriesFeatures: Section = {
  id: "time-series-features",
  number: 4,
  title: "Feature Engineering for Time Series",
  blocks: [
    {
      type: "text",
      html: `<p>Time series shows up everywhere — stock prices, weather, energy consumption, vital signs, machine performance, web traffic. Most companies you'd never think of as "time series companies" are working on time series data. The raw signal is rarely the right input to a model — the features you engineer from it are.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Six Feature Categories",
      html: `<ul>
<li><strong>Temporal features.</strong> Day of week, month, quarter, hour, time of day. Capture recurring patterns aligned with calendar or clock structure.</li>
<li><strong>Lagged features.</strong> Past values of the variable as features for the current prediction. "Yesterday's sales" as a feature for today's. The model learns temporal dependencies — what came before predicts what comes next.</li>
<li><strong>Rolling statistics.</strong> Moving averages, rolling standard deviations over sliding windows. Smooth out noise and reveal underlying trends. An Oura ring's daily relative body temperature looks like pure noise until you apply a 3–5 day rolling window, at which point a clear trend emerges.</li>
<li><strong>Seasonal features.</strong> Patterns that repeat at regular intervals. US electricity demand has a textbook seasonal pattern: a big peak July through September when most of the country runs AC.</li>
<li><strong>Frequency-domain features.</strong> Fourier transforms decompose the time series into frequency components. Useful when patterns are periodic — heart rate variability, vibration analysis, audio signals.</li>
<li><strong>Autocorrelation features.</strong> Correlation between the series and a lagged version of itself. These help identify the temporal structure of the series and inform which lag features are worth engineering.</li>
</ul>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "Time series decomposition into trend, seasonal, and residual components",
      caption: "Placeholder: time series decomposition diagram showing raw signal split into trend + seasonal + residual components.",
    },
    {
      type: "callout",
      variant: "example",
      title: "Forecasting at Every Scale",
      html: `<p>Demand forecasting in retail, load forecasting in utilities, patient deterioration prediction in hospitals, financial volatility forecasting — the specific features differ, but these six categories appear everywhere. Temporal features handle calendar effects. Lagged features handle autoregressive structure. Rolling stats handle trend extraction. Seasonal features handle recurring patterns. Frequency features handle periodic signals. Pick the categories that match your application's time scale and domain.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-fe-timeseries-q1",
      kind: "mc",
      question: "You're predicting tomorrow's electricity demand. You include 'demand yesterday' (lag-1) as a feature. A colleague suggests also including 'demand one week ago' (lag-7). Why might lag-7 be valuable?",
      options: [
        {
          label: "Weekly seasonality — electricity demand has a strong day-of-week pattern (weekday vs. weekend), so last week's same day is highly predictive",
          correct: true,
          explanation: "Correct. Electricity demand follows a strong weekly cycle — Monday demand is more similar to last Monday's demand than to yesterday's Sunday demand. Lag-7 captures that weekly seasonal pattern directly. This is a case where domain knowledge guides feature engineering: you include lag-7 not because it's mechanically the 'next' lag, but because you know the data has weekly seasonality.",
        },
        {
          label: "Lag-7 reduces model overfitting by adding noise to the feature space",
          correct: false,
          explanation: "Adding a feature to reduce overfitting is backwards reasoning. You add lag-7 because it's predictive — not to add noise. Overfitting is reduced by regularization, dropout, and simpler models, not by deliberately adding uninformative features.",
        },
        {
          label: "More lag features always improve time series models",
          correct: false,
          explanation: "More lags is not always better. Uninformative lags add dimensionality without signal, increasing overfitting risk. The right lags are the ones that capture temporal structure meaningful in your domain — weekly seasonality, daily cycles, momentum effects — not every possible lag.",
        },
      ],
    },
  ],
};

export default timeSeriesFeatures;
