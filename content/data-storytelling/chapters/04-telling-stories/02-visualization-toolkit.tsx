import type { Section } from "@brinnaebent/workbook";

const visualizationToolkit: Section = {
  id: "visualization-toolkit",
  number: 2,
  title: "The Visualization Toolkit",
  blocks: [
    {
      type: "text",
      html: `<p>Know your toolbox. This isn't exhaustive, but these are the visualizations you'll reach for most — and for each one, there's a specific job it's best at.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Distribution Plots",
      html: `<ul>
<li><strong>Histogram</strong> — distribution of a single continuous variable. Best for: "what does this variable look like?" Accessible to almost any audience.</li>
<li><strong>Box plot</strong> — distribution plus outliers, often broken out by category. Best for: "how spread out is this?" Requires statistical literacy to read.</li>
<li><strong>Violin plot</strong> — box plot with the underlying distribution drawn on top. Richer than a box plot; harder to read. Reserve for technical audiences.</li>
<li><strong>Swarm plot</strong> — shows every data point as a dot along an axis. Better than box plots for small datasets where you want to see individual observations.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Relationship and Category Plots",
      html: `<ul>
<li><strong>Scatter plot</strong> — relationship between two continuous variables. Best for: "how do these two variables relate?" Works for any audience.</li>
<li><strong>Pair plot</strong> — all pairwise scatter plots in a grid. Indispensable for EDA; too complex for executive presentations.</li>
<li><strong>Heat map</strong> — correlation matrices or matrix-shaped data, color-coded. Best for: "what's the structure of relationships?"</li>
<li><strong>Bar chart</strong> — counts or frequencies across categories. Best for: "how many in each category?" Universally readable.</li>
<li><strong>Line plot</strong> — trends over time or sequential data. The default for time series. Widely readable.</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "ChartTypePicker",
      caption: "Placeholder: interactive chart selector — describe your data and audience, get a recommended visualization type.",
      props: {},
    },
    {
      type: "callout",
      variant: "tip",
      title: "Read the Room From the Dashboard",
      html: `<p>You can often tell a company's culture from its analytics dashboards. A startup with engineering DNA will have violin plots and pair plots. A consumer-facing company with marketing DNA will have bar charts and pie charts. A consultancy will have whatever the client expects. None of these is wrong — they're matched to the audience.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-stories-toolkit-q1",
      kind: "mc",
      question: "You want to show how the distribution of customer purchase amounts differs across three customer segments. Which visualization is most appropriate for a mixed technical/non-technical audience?",
      options: [
        {
          label: "Box plots faceted by segment — shows median, spread, and outliers for each group",
          correct: true,
          explanation: "Correct. Box plots effectively communicate distribution differences across groups and are readable by most audiences in a business context (more so than violin plots). Faceting by segment keeps the comparison clean. For a purely non-technical audience you might simplify further to grouped bar charts of means, but box plots strike a good balance here.",
        },
        {
          label: "A single histogram combining all three segments",
          correct: false,
          explanation: "A single combined histogram obscures segment differences — overlapping distributions merge into a single shape and you lose the comparison you're trying to show.",
        },
        {
          label: "A pair plot of all numerical variables",
          correct: false,
          explanation: "Pair plots show all pairwise relationships — far more than you need to answer 'how does purchase amount differ by segment?' They're also complex enough to lose non-technical audiences quickly.",
        },
      ],
    },
  ],
};

export default visualizationToolkit;
