import type { Section } from "@brinnaebent/workbook";

const plotToNarrative: Section = {
  id: "plot-to-narrative",
  number: 4,
  title: "From Plot to Narrative",
  blocks: [
    {
      type: "text",
      html: `<p>A bar chart is just a bar chart. A bar chart embedded in a clear narrative is a recommendation. The chart is a vehicle for the story — not the story itself. Below you will find the short version of one of my favorite presentations ever. The data storytelling is incredible. This is what we should try to emulate, whether we are in the boardroom, pitching our startup, or presenting in class.</p>`,
    },
    {
      type: "video",
      src: "https://www.youtube.com/watch?v=jbkSRLYSojo",
      caption: "From plot to narrative: turning a chart into a story.",
    },
    {
      type: "callout",
      variant: "info",
      title: "The Three-Part Anatomy of a Data Story",
      html: `<ol>
<li><strong>Setup.</strong> What's the situation? What's the data? What's at stake? This is where you frame the problem and orient the audience. Even if you've been working on the problem for three months, the audience may have last thought about it three months ago.</li>
<li><strong>Tension.</strong> What changed? What's the anomaly? What's the surprising finding? This is where the analysis earns its keep. If there's no tension, there's no story — you're just reporting numbers.</li>
<li><strong>Resolution.</strong> What's the recommendation? What's the next step? Analysis without a recommendation is reading off a screen. Always finish with what you'd do.</li>
</ol>`,
    },
    {
      type: "text",
      html: `<p>Take any chart you're about to present and try to write down its insight in <em>one sentence</em>. If you can, the chart is doing its job. If you can't, the chart is unclear or the insight is unclear — or both. If the one-sentence headline is so good that the chart is redundant, you may not even need the chart. Sometimes the sentence alone is more powerful.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Voice That Advances a Career",
      html: `<p>The most influential analysts in any organization are not the ones with the fanciest plots. They're the ones whose plots have the clearest headlines. You can almost predict an analyst's career trajectory from how they describe their own charts in meetings. "Here's what's happening, here's why, and here's what I think we should do" is a leader's voice. "Here's a chart" is not.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-stories-narrative-q1",
      kind: "mc",
      question: "You present a chart showing a 23% drop in user retention last month. A stakeholder asks: 'So what should we do?' You say 'I don't know — I just wanted to share the data.' What went wrong?",
      options: [
        {
          label: "The analysis stopped at tension without reaching resolution — there's no recommendation",
          correct: true,
          explanation: "Correct. Setup (context) + tension (the 23% drop) are present, but the story has no resolution. Analysis that stops at 'here's a problem' without 'here's what I'd do about it' leaves stakeholders without a path forward — and signals that the analyst is a data reporter, not a decision partner.",
        },
        {
          label: "The chart was too complex — the audience couldn't understand the finding",
          correct: false,
          explanation: "The stakeholder clearly understood the finding well enough to ask what to do next. The issue isn't comprehension — it's that the analysis ended at description rather than recommendation.",
        },
        {
          label: "You should have shown more charts to support the finding before presenting it",
          correct: false,
          explanation: "More charts aren't the answer here. The finding landed — the gap is in the recommendation. One well-analyzed chart with a clear action is more valuable than ten charts with no conclusion.",
        },
      ],
    },
  ],
};

export default plotToNarrative;
