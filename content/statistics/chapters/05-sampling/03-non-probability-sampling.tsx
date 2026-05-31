import type { Section } from "@brinnaebent/workbook";

const nonProbabilitySampling: Section = {
  id: "non-probability-sampling",
  number: 3,
  title: "Non-Probability Sampling",
  blocks: [
    {
      type: "text",
      html: `<p>Non-probability sampling is included here somewhat reluctantly. The samples it produces are biased in ways that are hard to characterize, and statistical claims based on them have weaker external validity. But here's the reality: it's often the only thing available. If it's what you have, you work with it — but you should always strive for probability sampling and be honest about the limitations when it's not feasible.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Four Non-Probability Methods — Know Them to Recognize Their Limitations",
      html: `<ul>
<li><strong>Convenience sampling:</strong> Select subjects because they're convenient — nearby, already in your database, responded to your email. The classic research example is recruiting your own students. You can imagine what this does to representativeness.</li>
<li><strong>Purposive (judgmental) sampling:</strong> Researchers hand-pick subjects they believe are most representative. Selection bias is baked in — your judgment of who is "representative" shapes the conclusions.</li>
<li><strong>Snowball sampling:</strong> Participants recruit other participants. Useful for hard-to-reach populations, but you often end up with a homogeneous chain — friends recruiting friends. Used legitimately in research on marginalized communities; less legitimate in contexts that assume representativeness.</li>
<li><strong>Quota sampling:</strong> Divide the population into subgroups and non-randomly select observations to meet a quota. It looks structured but the within-stratum selection isn't random.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Key Bias Types to Know",
      html: `<ul>
<li><strong>Selection bias:</strong> Your sampling method systematically over- or under-represents some part of the population.</li>
<li><strong>Non-response bias:</strong> People who respond to your survey differ systematically from those who don't.</li>
<li><strong>Undercoverage:</strong> Your sampling frame doesn't include parts of the population you care about.</li>
<li><strong>Sampling frame errors:</strong> Your sampling frame is wrong — outdated, mismatched, full of duplicates.</li>
</ul>`,
    },
    {
      type: "reflection",
      id: "stats-ch5-s3-reflect",
      question: "A company trains a content recommendation model on data from its most engaged users, since those are the users with the most behavioral history. What type of bias does this introduce, and how might it affect model behavior for new or less-engaged users?",
      sampleAnswer: "This is selection bias (specifically, a type of undercoverage). Engaged users likely have different content preferences, interaction patterns, and demographics than typical or new users. A model trained on this data learns to optimize for already-engaged users — it may recommend 'sticky' but niche content that works for power users, while failing to surface the on-ramp content that new users would find valuable. The model generalizes poorly to the population it's actually supposed to serve.",
    },
  ],
};

export default nonProbabilitySampling;
