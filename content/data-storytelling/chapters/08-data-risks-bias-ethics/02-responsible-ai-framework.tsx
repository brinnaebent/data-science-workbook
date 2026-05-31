import type { Section } from "@brinnaebent/workbook";

const responsibleAiFramework: Section = {
  id: "responsible-ai-framework",
  number: 2,
  title: "The Responsible AI Framework",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Responsible AI</strong> is the development and use of AI systems in ways that are ethical, transparent, and accountable, and that respect human values and rights. It's not a separate ethics process bolted onto the side of an ML project — it's integrated into every stage of the work. The chapters we've covered so far (sourcing, EDA, preprocessing, engineering) all touch one or more of its pillars.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Seven Pillars",
      html: `<ol>
<li><strong>Ethics and value alignment.</strong> Designing and deploying AI aligned with ethical principles, human rights, and societal values like fairness, privacy, security, and wellbeing.</li>
<li><strong>Transparency and explainability.</strong> Making systems and their decision processes understandable to stakeholders.</li>
<li><strong>Privacy and data governance.</strong> Responsibly managing data used to train models. Protecting privacy. Collecting and using data ethically.</li>
<li><strong>Fairness and non-discrimination.</strong> Mitigating bias. Not discriminating against individuals or groups on the basis of sensitive attributes.</li>
<li><strong>Human oversight and control.</strong> Building in the ability for humans to intervene and maintain meaningful control over critical decisions.</li>
<li><strong>Robustness and safety.</strong> Ensuring systems are tested, monitored, and reliable. Risk management.</li>
<li><strong>Accountability and governance.</strong> Clear lines of accountability. Audit trails. Governance frameworks that outlast any individual engineer's tenure.</li>
</ol>`,
    },
    {
      type: "image",
      src: "/images/placeholder.png",
      alt: "Responsible AI seven pillars diagram",
      caption: "Placeholder: visual map of the seven responsible AI pillars, showing how they connect to different lifecycle stages.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Integration, Not Isolation",
      html: `<p>Most large tech companies now have responsible AI teams. The teams that work well are integrated into engineering and product from the start. The teams that fail are isolated and reactive — brought in after something has gone wrong. If you ever work on or with a responsible AI team, fight to keep it integrated.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-ethics-rai-reflect",
      kind: "reflective",
      question: "You're joining a team building a hiring recommendation tool that will help screen resumes for a large company. Which of the seven pillars do you think are most critical to address before the tool ships — and what specific questions would you ask?",
      sampleAnswer: "Fairness and non-discrimination would be top priority: what is the demographic composition of the training data (historical hires)? Have we tested for disparate impact across gender, race, age? What are the error rates by group? Transparency and explainability matter too: can a rejected candidate be told why the model scored them low? Human oversight is critical: is the model a decision-maker or a decision-support tool — and can a human override it? Privacy and data governance: what personal data is collected and retained? Accountability: who is responsible if the model systematically screens out a protected class?",
    },
  ],
};

export default responsibleAiFramework;
