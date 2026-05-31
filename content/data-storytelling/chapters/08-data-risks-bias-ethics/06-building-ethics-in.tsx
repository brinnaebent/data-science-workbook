import type { Section } from "@brinnaebent/workbook";

const buildingEthicsIn: Section = {
  id: "building-ethics-in",
  number: 6,
  title: "Building Ethics In",
  blocks: [
    {
      type: "text",
      html: `<p>Ethics isn't something you add at the end. By the time the model ships, most of the ethical decisions have already been made — through data collection choices, labeling choices, feature choices, and evaluation choices. Building ethics in means making those decisions deliberately, at each stage, with the right people in the room.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "An Ethical Checklist by Phase",
      html: `<p><strong>Project selection.</strong> Is the problem we're solving a symptom of a bigger issue? Is AI even the right tool? A small honesty moment: AI is often <em>not</em> the right tool. Sometimes the answer is a simple if-then statement. You're in a master's program in AI, so AI will be your hammer — but a hammer isn't always right for the job. Be honest about that.</p>
<p><strong>Team composition.</strong> Does the team include or consider individuals who will be affected? Is there diversity of opinion and background?</p>
<p><strong>Data collection.</strong> Does collection impede on privacy? Have we obtained appropriate consents? Were collection processes biased against any groups?</p>
<p><strong>Analysis and modeling.</strong> Have we introduced bias in variable selection? Have we tested for fairness across user groups? Have we tested for disparate error rates?</p>
<p><strong>Implementation.</strong> Are users aware of model shortcomings? Do we have a redress mechanism if people are harmed? Have we thought about how the technology could be attacked or abused?</p>`,
    },
    {
      type: "text",
      html: `<p><strong>Datasheets for Datasets</strong> is a standardized documentation format covering: motivation (why was the dataset created?), composition (what do instances represent?), collection process (how was data acquired?), preprocessing (what cleaning was done?), uses (what tasks is it appropriate for?), distribution (what license?), and maintenance (who supports it?).</p>
<p>If you look at almost any dataset in the wild today, you'll be able to answer very few of these questions from available documentation. That's part of the problem the datasheet framework is trying to fix. In most other industries, all inputs are accompanied by detailed data sheets. ML doesn't have this yet.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Ethical Pre-Mortems",
      html: `<p>Before launching a high-stakes ML system, get a diverse group in a room and imagine the system has just failed catastrophically. Now reason backwards: what would have caused it? What could you have done to prevent it? This pre-mortem pattern is remarkably effective at surfacing issues that would otherwise emerge only post-launch — when fixing them is much more expensive.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-ethics-building-reflect",
      kind: "reflective",
      question: "You're building a mental health screening tool that will be used in hospital emergency rooms to identify patients at risk of self-harm. Run a quick ethical pre-mortem: what could go wrong, and what safeguards would you build in?",
      sampleAnswer: "Things that could go wrong: (1) high false negative rate misses at-risk patients who are then discharged without appropriate care; (2) high false positive rate leads to unnecessary psychiatric holds that are traumatic and costly; (3) model works poorly for specific demographic groups (known issue in clinical AI) leading to disparate care; (4) clinicians over-rely on the model and reduce their own clinical judgment; (5) model is applied outside its intended context (e.g., used for screening in non-emergency settings it wasn't validated for). Safeguards: validate performance separately by demographic group; require human clinician override capability; set up monitoring for disparate outcomes; include a clear statement of the tool's intended use scope and known limitations; establish a feedback mechanism for clinicians to flag unexpected behavior.",
    },
  ],
};

export default buildingEthicsIn;
