import type { Section } from "@brinnaebent/workbook";

const simpsonsParadox: Section = {
  id: "simpsons-paradox",
  number: 4,
  title: "Simpson's Paradox",
  blocks: [
    {
      type: "text",
      html: `<p>Before we close, one of the most counterintuitive — and important — phenomena in applied statistics: <strong>Simpson's Paradox</strong>.</p>
<p>Simpson's Paradox occurs when a trend or relationship visible in subgroups of data <strong>disappears or reverses</strong> when the subgroups are aggregated. A drug appears effective in men, appears effective in women, and appears ineffective in the combined dataset. An algorithm appears better than another within each user segment but worse overall. These aren't statistical errors — they're real properties of the data — and they can completely upend your conclusions.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "A Famous Real Example: UC Berkeley Admissions (1973)",
      html: `<p>Aggregate data showed men were admitted at a higher rate than women (44% vs. 35%), suggesting gender bias. But when broken down by department, most departments showed women being admitted at <em>equal or higher</em> rates than men.</p>
<p>The resolution: women disproportionately applied to more competitive departments (lower overall admission rates). The aggregate rate was driven by department selection, not discrimination within departments. The paradox was real.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "What Causes It",
      html: `<ul>
<li><strong>Confounding variables</strong> that influence both the predictor and the outcome differently across subgroups.</li>
<li><strong>Group heterogeneity</strong> — differences in the size or composition of subgroups pull the aggregate trend in a different direction than within-group trends.</li>
</ul>
<p><strong>The defense:</strong> Always run subgroup analysis alongside aggregate analysis. Visualize relationships within meaningful slices of your data before declaring the aggregate result. This is part of what makes good exploratory data analysis so much more than just "looking at the data."</p>`,
    },
    {
      type: "interactive",
      component: "SimpsonsParadoxVisualizer",
      caption: "Placeholder: Display a Simpson's Paradox scenario — show the aggregate trend and the per-subgroup trends side by side. Adjust the subgroup sizes to watch the paradox emerge and disappear.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch12-s4-q1",
      kind: "mc",
      question: "An analysis shows that among all customers, those who used the chat support feature had a lower 30-day retention rate than those who didn't. But within each customer tier (new, returning, VIP), chat users have higher retention. What is the most likely explanation?",
      options: [
        {
          label: "The analysis has an error — a feature can't improve and worsen retention simultaneously",
          correct: false,
          explanation: "Simpson's Paradox shows this is possible. A feature can show opposite effects at the aggregate and subgroup level without any error in the analysis.",
        },
        {
          label: "Chat support users are probably higher-value customers, so the aggregate result reflects selection bias",
          correct: false,
          explanation: "This gets the direction backwards. If chat users have lower aggregate retention despite higher within-tier retention, they're likely disproportionately new or at-risk customers (lower tier), which pulls down the aggregate. The confound is customer tier, not value.",
        },
        {
          label: "Simpson's Paradox: chat users are disproportionately in low-retention customer tiers (e.g., new customers), making the aggregate rate look worse even though within each tier, chat users do better",
          correct: true,
          explanation: "Correct. If most chat users are new customers (who have lower retention regardless), then the aggregate chat-user group looks worse — even if within each tier, chat users retain better. Customer tier is the confounding variable creating the paradox.",
        },
        {
          label: "The subgroup analysis must have errors, since the aggregate analysis shows the true effect",
          correct: false,
          explanation: "Neither analysis is more 'true' — they answer different questions. The subgroup analysis controls for tier; the aggregate does not. Both results can be valid while telling different stories.",
        },
      ],
    },
  ],
};

export default simpsonsParadox;
