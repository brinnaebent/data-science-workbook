import type { Section } from "@brinnaebent/workbook";

const sixSourcesOfBias: Section = {
  id: "six-sources-of-bias",
  number: 3,
  title: "Six Sources of Bias",
  blocks: [
    {
      type: "text",
      html: `<p>Bias enters AI systems at every stage of the lifecycle — not just during training, and not just through bad intentions. Understanding where each type of bias enters is the first step toward preventing it.</p>
<p>The lifecycle: <strong>Data Collection → Labels &amp; Features → Training &amp; Evaluation → Deployment → Feedback Loop</strong></p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "1. Historical Bias — Data Collection",
      html: `<p>Collected data reflects existing biases in the world. The original Word2Vec models, trained on text from a particular era, embedded gender associations that mirrored those of the source corpus. "Engineer" pulls male. "Nurse" pulls female. You're not seeing a flaw in the algorithm — you're seeing the algorithm faithfully reproducing what was in the data, which faithfully reflected the world at the time. The data was the problem, not the math.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "2. Representation Bias — Data Collection",
      html: `<p>The training set is not representative of the target population. Most medical datasets contain very few pregnant women — pregnancy is often an exclusion criterion in studies because of risk to the fetus. So when you're pregnant and need a medication, doctors are often working without trial data, just clinical experience. The people who most need the research are systematically absent from it.</p>`,
    },
    {
      type: "text",
      html: `<p><strong>3. Measurement Bias — Labels and Features.</strong> The variable you're measuring is a poor proxy for the thing you actually care about. GPA is often used as a proxy for student learning success. GPA is not a great proxy — plenty of people with lower GPAs go on to successful careers, and vice versa. The proxy is convenient and quantitative, but it doesn't measure what we say it measures.</p>
<p><strong>4. Learning Bias — Training and Evaluation.</strong> Modeling choices amplify performance disparities across groups. Cost functions can optimize aggregate performance at the expense of consistency across subgroups. Compact models — optimized for deployment efficiency — can be pruned in ways that remove features that matter for minority subgroups, because those features don't help aggregate metrics much.</p>
<p><strong>5. Deployment Bias — Deployment.</strong> Mismatch between how a tool was intended to be used and how it's actually used. An automated teacher evaluation tool, intended to <em>assist</em> administrators, gets used to <em>terminate</em> teachers — including teachers who grade strictly but teach effectively, who then disappear from the system and stop contributing to future model training.</p>
<p><strong>6. Feedback Loop Bias — Feedback.</strong> The system's outputs influence its future inputs. A product recommendation engine that orders items by number of positive reviews makes those items more visible, leading to more reviews, reinforcing the ordering. After enough cycles, the system is mostly recommending what it has always recommended. The rich get richer; the novel and underrepresented get buried.</p>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "AI lifecycle with six bias entry points annotated",
      caption: "Placeholder: lifecycle diagram annotated with which type of bias enters at each stage.",
    },
    {
      type: "checkpoint",
      id: "ds-ethics-bias-q1",
      kind: "mc",
      question: "A hiring model is trained on 10 years of historical hire data. Over those 10 years, the company hired mostly men for technical roles. The model now recommends fewer women for technical positions. What type of bias is this?",
      options: [
        {
          label: "Historical bias — the training data reflects historical discrimination, which the model faithfully reproduces",
          correct: true,
          explanation: "Correct. The model learned from data that encodes the company's past hiring patterns — patterns that were themselves biased. The algorithm isn't introducing new bias; it's amplifying the bias already present in the historical record. This is why 'just use the data' is not a neutral choice.",
        },
        {
          label: "Measurement bias — the model is using a bad proxy for technical skill",
          correct: false,
          explanation: "Measurement bias involves a feature being a poor proxy for what you're trying to measure — e.g., using zip code as a proxy for creditworthiness. The issue here is that the training labels themselves (who was hired) reflect historical discrimination, which is historical bias.",
        },
        {
          label: "Feedback loop bias — the model's recommendations will reinforce the existing gender imbalance",
          correct: false,
          explanation: "Feedback loop bias is what will happen next if the model is deployed without intervention — its discriminatory recommendations will produce more biased training data for future models. But the initial source of the bias in the model is historical bias in the training data.",
        },
      ],
    },
  ],
};

export default sixSourcesOfBias;
