import type { Section } from "@brinnaebent/workbook";

const populationVsSample: Section = {
  id: "population-vs-sample",
  number: 2,
  title: "Population vs. Sample",
  blocks: [
    {
      type: "text",
      html: `<p>A <strong>population</strong> is the entire group of entities you care about — all the users of your product, all the patients with a condition, all possible outputs of a process. A <strong>sample</strong> is a subset you actually have data on.</p>
<p>In data science, you almost never have the population. Even when your dataset feels huge, it's a slice in time, drawn from a particular source, filtered by whatever pipeline collected it. The model trained on it will be deployed in a world that's slightly different from the data it learned from. Treating your data as the whole truth is one of the most common ways smart people make bad decisions.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Dataset Is Never the Whole World",
      html: `<p>A model trained on last year's transactions doesn't know about next year's user behavior. A model trained on data from one hospital may not generalize to patients at another. Even "all users" is a sample — it's every user who signed up, used your product in this particular way, and was captured by your logging pipeline. The selection process is always baked in.</p>`,
    },
    {
      type: "text",
      html: `<p>This is why everything we do in this unit is <strong>sampling statistics</strong> — methods designed to make sound claims about a population when all you have is a sample. Population parameters are the unknowns we're trying to estimate. Sample statistics are our estimates.</p>
<p>A few key distinctions to hold:</p>
<ul>
<li><strong>Population mean (μ):</strong> The true average over the whole population. Unknown in practice.</li>
<li><strong>Sample mean (x̄):</strong> The average from your data. Your best estimate of μ.</li>
<li><strong>Population standard deviation (σ):</strong> The true spread. Almost always unknown.</li>
<li><strong>Sample standard deviation (s):</strong> Computed from your data, with a correction factor. Your estimate of σ.</li>
</ul>`,
    },
    {
      type: "interactive",
      component: "PopulationSampleExplorer",
      caption: "Placeholder: Draw repeated samples from a population and observe how the sample mean varies around the true population mean.",
      props: {},
    },
    {
      type: "reflection",
      id: "stats-ch1-s2-reflect",
      question: "Think about a dataset you've worked with. What population was it trying to represent? What selection processes might have biased the sample? What conclusions might be wrong because of that gap?",
      sampleAnswer: "A dataset of customer purchases represents 'all customers' — but only captures those who actually bought something, likely skewing toward engaged users. Conclusions about churn risk or average basket size would be biased toward actives, not dormant or churned users who never appear in the data.",
    },
  ],
};

export default populationVsSample;
