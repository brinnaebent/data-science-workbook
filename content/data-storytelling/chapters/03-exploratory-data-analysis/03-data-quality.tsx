import type { Section } from "@brinnaebent/workbook";

const dataQuality: Section = {
  id: "data-quality",
  number: 3,
  title: "Data Quality",
  blocks: [
    {
      type: "text",
      html: `<p>After descriptive statistics, run a quality pass. The goal is to surface problems before they become invisible assumptions baked into your model. Four questions drive this pass.</p>
<ul>
<li><strong>Duplicate rows?</strong> Duplicates can be exact (same row appears twice) or near-duplicates (same entity with small differences — the same person entered twice with slightly different names). Both are real engineering problems.</li>
<li><strong>Inconsistent values?</strong> A "country" column with "USA," "United States," and "U.S." A "dates" column in three different formats. An "age" column with values of 200. Inconsistency is the rule, not the exception, in real-world data.</li>
<li><strong>Outliers or extreme values?</strong> Outliers can be sensor failures, data entry errors, or real-but-rare events. <em>The data alone usually can't tell you which.</em></li>
<li><strong>Values that make sense given domain knowledge?</strong> A heart rate of 800 bpm is not a real heart rate. A house listing at $1.00 is not a deal. Sanity-check against what should be possible.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Domain Knowledge Beats Statistical Anomaly Detection",
      html: `<p>A statistician can flag an extreme value as a numerical outlier. Only a domain expert can tell you whether it's a sensor failure or a real, important event. Engage your experts before making outlier decisions — not after.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Negative Purchases That Were Returns",
      html: `<p>A friend working in retail analytics found that a "purchases" column contained negative values for thousands of customers. It turned out those values represented returns — perfectly meaningful data, just undocumented. Without that one piece of context, every downstream model would have been wrong. With it, the negative values were one of the most predictive features in the dataset. Domain knowledge unlocked the value.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-eda-quality-q1",
      kind: "mc",
      question: "Your dataset has a 'systolic_blood_pressure' column with one value of 420 mmHg. A normal human range is roughly 80–180 mmHg. What should you do?",
      options: [
        {
          label: "Investigate before removing: check the data source, look for a pattern in surrounding rows, and consult a domain expert",
          correct: true,
          explanation: "Correct. 420 mmHg is physiologically implausible, but the right response isn't automatic removal — it's investigation. Is this a unit error (maybe the value was entered in Pa instead of mmHg)? A data entry error (maybe a decimal was dropped)? A sensor malfunction? A merge artifact? Understanding the cause determines the right fix.",
        },
        {
          label: "Remove it immediately — it's clearly an error",
          correct: false,
          explanation: "It looks like an error, but removing it without investigation means you lose the chance to fix the underlying cause. If the same error affects 10% of rows and you only catch the most extreme case, you'll have subtly corrupted data you won't notice.",
        },
        {
          label: "Replace it with the column mean so the model isn't distorted",
          correct: false,
          explanation: "Replacing an implausible value with the mean before understanding why it's implausible is premature. If this is a systematic error (wrong units), mean imputation hides the problem instead of resolving it.",
        },
      ],
    },
  ],
};

export default dataQuality;
