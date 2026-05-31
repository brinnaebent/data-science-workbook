import type { Section } from "@brinnaebent/workbook";

const domainExpertise: Section = {
  id: "domain-expertise",
  number: 2,
  title: "Domain Expertise as the Secret Ingredient",
  blocks: [
    {
      type: "text",
      html: `<p>Feature engineering relies on domain expertise. You are rarely the domain expert — and even if you are, you should seek out others. The best feature engineering work involves a data scientist who understands the math talking to a domain expert who understands what the numbers actually mean.</p>
<p>Three strategies for accessing expertise you don't have:</p>
<ul>
<li><strong>Read.</strong> Research papers, textbooks, domain lectures. Build expertise yourself, even if you'll bring in collaborators. It pays off in unexpected ways — you'll ask better questions and spot better opportunities.</li>
<li><strong>Talk to domain experts.</strong> Learn their vocabulary so you can communicate. Build relationships with people who think differently than you do. Many of the best features I've ever engineered came from a conversation where an expert said "well, we always look at X because of Y" — something I never would have found in the literature.</li>
<li><strong>Apply ideas across domains.</strong> Signal processing techniques for heartbeat detection from PPG are mathematically similar to anomaly detection in financial time series. Image augmentation from medical imaging transfers to satellite imagery. Cross-domain transfer of feature engineering ideas is wildly underrated.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Build a Feature Engineering Library",
      html: `<p>The most senior data scientists I know all maintain libraries of feature engineering recipes collected across years of projects. Some are domain-specific. Some are general. All are field-tested. Start building yours now — future projects will thank you. Even a simple notes document organized by data type (tabular, time series, image, text) is worth maintaining.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-fe-domain-reflect",
      kind: "reflective",
      question: "Pick a domain you know well — sports, medicine, finance, music, logistics, whatever you have real experience with. Name two features you would engineer that wouldn't be obvious to a generalist data scientist but would be obvious to a domain expert.",
      sampleAnswer: "In basketball analytics: (1) 'Effective field goal percentage' (eFG%) — adjusts field goal percentage to account for the extra point value of 3-pointers: eFG% = (FGM + 0.5 × 3PM) / FGA. A generalist would use raw FG%; a basketball analyst knows eFG% is the right measure. (2) 'Usage rate in the fourth quarter vs. overall' — whether a player's usage increases in close fourth quarters is a measure of clutch-situation deployment that raw stats don't capture. A generalist wouldn't know to look for this; a coach would immediately recognize its value.",
    },
  ],
};

export default domainExpertise;
