import type { Section } from "@brinnaebent/workbook";

const boxPlotLesson: Section = {
  id: "box-plot-lesson",
  number: 1,
  title: "The Box Plot Lesson",
  blocks: [
    {
      type: "text",
      html: `<p>Early in my career, I put together an analysis for a client. Box plots. Violin plots. Not, by any reasonable standard, the most complicated visualizations in the world. I was confident the analysis was solid.</p>
<p>I showed up. I shared the slides. I got blank stares.</p>
<p>The room had no idea what to do with the box plots. The feedback was direct: "Too complicated. We just need histograms or bar charts." We scrambled, rebuilt the analysis with the simplest possible visualizations, presented again — and <em>then</em> the insight landed and the recommendation was accepted.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Lesson",
      html: `<p>The lesson is not that box plots are bad. Box plots are perfectly good visualizations. The lesson is that <strong>the right visualization depends on your audience</strong>, not just on your data. I had picked a chart for myself, not for the room — and in doing so, I had buried the insight in a format the decision-makers couldn't read.</p>
<p>Almost every data scientist I know has at least one version of this story. The mark of experience is not that you stop having these moments — it's that you start anticipating them.</p>`,
    },
    {
      type: "text",
      html: `<p>Default visualizations by audience:</p>
<ul>
<li><strong>Board of directors, executive teams, non-technical product teams</strong> — bar charts and histograms. One insight per chart.</li>
<li><strong>Engineers and statisticians</strong> — full toolkit available.</li>
<li><strong>Clinical or regulatory audiences</strong> — ask first. These audiences often have field-specific conventions that have nothing to do with "best practices."</li>
</ul>
<p>The goal of a visualization is not to demonstrate sophistication. The goal is to land an insight. The plot that lands wins.</p>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "The same data shown as a box plot vs. a bar chart for different audiences",
      caption: "Placeholder: side-by-side showing the same insight presented as a box plot (for technical audiences) and a bar chart (for executives).",
    },
    {
      type: "checkpoint",
      id: "ds-stories-boxplot-q1",
      kind: "mc",
      question: "You've built a careful analysis using violin plots and pair plots. Your audience is the company's executive team, none of whom have a statistics background. What should you do?",
      options: [
        {
          label: "Rebuild the analysis with bar charts and line plots, keeping one insight per chart",
          correct: true,
          explanation: "Correct. The insight doesn't change — the packaging does. An executive team needs to be able to read your chart in 5 seconds and know what to decide. Violin plots require statistical training to interpret; bar charts do not. Matching the visualization to the audience is the job.",
        },
        {
          label: "Keep the violin plots but add a legend explaining how to read them",
          correct: false,
          explanation: "A legend doesn't fix the cognitive load. If the audience has to stop and read a tutorial to understand your chart, you've already lost the room. The answer is a simpler chart, not more annotations on a complex one.",
        },
        {
          label: "Present the complex charts — executives should be able to handle statistical visualizations",
          correct: false,
          explanation: "This is the error the box plot story is about. Executive expertise is in business judgment, not statistical visualization. Expecting non-statisticians to fluently read violin plots is setting the presentation up to fail.",
        },
      ],
    },
  ],
};

export default boxPlotLesson;
