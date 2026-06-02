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
      html: `<p>Before you pick a visualization, ask three questions. The answers determine the chart, not your personal preference or the sophistication of the analysis.</p>
<ol>
<li><strong>Who is looking at this?</strong> A data scientist? An executive? A regulator? A clinician? A patient? Your default visualization should be calibrated to their visual literacy.</li>
<li><strong>What decision are they trying to make?</strong> A board approving a major investment needs the headline number front-and-center. A scientist reviewing a study needs the full distribution. A clinician making a treatment decision needs the patient's specific data, not aggregate trends.</li>
<li><strong>What do they already understand about plots?</strong> If the audience has never seen a box plot in their life, throwing one at them is malpractice. If the audience reads scientific papers all day, a bar chart of means with no error bars will annoy them.</li>
</ol>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Audience Defaults",
      html: `<ul>
<li><strong>Technical and statistical</strong> — full toolkit: violin plots, pair plots, faceted plots, log scales, complex multi-panel figures.</li>
<li><strong>Executive and product</strong> — default to bar charts, line plots, histograms. Simplify aggressively. One insight per chart.</li>
<li><strong>Regulatory and compliance</strong> — ask first. There are often field-specific conventions you're expected to follow.</li>
<li><strong>Clinical</strong> — ask first. Medicine has its own conventions (e.g., Kaplan–Meier curves for survival analysis), and using the right one matters for credibility.</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "AudienceChartComparison",
      caption: "The same support-team response-time data shown as a bar chart (executive view) and a box plot (technical view). Toggle between views to see how the packaging changes what's communicated.",
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
