import type { Section } from "@brinnaebent/workbook";

const samplingBias: Section = {
  id: "sampling-bias",
  number: 8,
  title: "Sampling Bias",
  blocks: [
    {
      type: "interactive",
      component: "SamplingBiasExplorer",
      caption: "Select a bias type to see how each one distorts what ends up in your data — and what a clean sample should look like instead.",
    },
    {
      type: "text",
      html: `<p>Sampling bias is systematic error in who ends up in your dataset. Four forms appear most often:</p>
<ul>
<li><strong>Selection bias.</strong> Certain groups are systematically excluded — like distributing an internet-usage survey only through online platforms.</li>
<li><strong>Volunteer bias.</strong> Motivated self-selectors aren't representative of the broader population.</li>
<li><strong>Response bias.</strong> Systematic differences between respondents and non-respondents — people over- or under-reporting income, for example.</li>
<li><strong>Measurement bias.</strong> The instrument itself favors certain outcomes — a thermometer that reads high will overestimate fever prevalence.</li>
</ul>
<br>
<p><strong>Mitigations:</strong> random sampling (every member of the population has equal probability of inclusion), stratified sampling (proportional sampling from known subgroups), and careful design throughout.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Evaluating a Data Source: Five Criteria",
      html: `<ul>
<li><strong>Accuracy</strong> — How closely does it reflect reality?</li>
<li><strong>Completeness</strong> — Is all necessary information present?</li>
<li><strong>Consistency</strong> — Does it match other reliable sources?</li>
<li><strong>Relevance</strong> — Is it applicable to the problem?</li>
<li><strong>Timeliness</strong> — Is it up to date?</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "ds-sourcing-sampling-bias-reflect",
      kind: "reflective",
      question: "Think of a dataset you've used or would like to use for a project. Apply the five evaluation criteria (accuracy, completeness, consistency, relevance, timeliness) to it. Which criterion is hardest to satisfy, and what would you do about it?",
      sampleAnswer: "For a dataset of Yelp restaurant reviews: accuracy is hard to verify (reviews reflect perception, not objective quality); completeness is limited (only businesses with Yelp presence, only users who write reviews); consistency is reasonable (standardized format); relevance depends on the task; timeliness is a concern for closed businesses. The hardest criterion is usually accuracy — reviews are subjective and potentially fake. A mitigation is to filter by verified purchases or cross-reference with other signals, and to acknowledge the limitation explicitly in any published analysis.",
    },
  ],
};

export default samplingBias;
