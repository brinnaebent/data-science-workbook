import type { Section } from "@brinnaebent/workbook";

const fatFairnessAccountabilityTransparency: Section = {
  id: "fat-fairness-accountability-transparency",
  number: 5,
  title: "FAT: Fair, Accountable, Transparent",
  blocks: [
    {
      type: "text",
      html: `<p>A useful organizing framework for ethical AI systems is <strong>FAT: Fair, Accountable, Transparent</strong>. Each term sounds simple. None of them is.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Fairness — No Single Universal Definition",
      html: `<p>There is no single universal definition of fairness. If you think about how you define fairness, it might be very different from how your neighbor describes it, or how your mom describes it.</p>
<p>Two useful distinctions:</p>
<ul>
<li><strong>Individual fairness.</strong> Similar individuals should receive similar outcomes. A system is individually fair if two people who are alike in all relevant ways get the same result.</li>
<li><strong>Group fairness.</strong> Different groups should experience similar rates of positive outcomes or similar error rates. A system is group-fair if the average outcome doesn't differ systematically across protected groups.</li>
</ul>
<p>These two definitions are often in tension. A system can be individually fair but group-unfair. A system can be group-fair but individually unfair. Choosing between them is a value judgment, not a technical decision — and should be made explicitly and documented.</p>`,
    },
    {
      type: "text",
      html: `<p><strong>Accountability</strong> means clear lines of responsibility for outcomes. Users have recourse if they identify issues. Three key questions: Who is responsible for system performance? On what set of values and laws is the system based? What recourse do users have if the system is not behaving in accordance with those values and laws?</p>
<p><strong>Transparency</strong> means users have visibility into data usage and model functioning. Document your training data, feature engineering choices, evaluation methodology, known failure modes, and deployment constraints. Transparency is what makes accountability possible — you can't hold anyone responsible for what isn't documented.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-ethics-fat-q1",
      kind: "mc",
      question: "A recidivism prediction tool has equal false positive rates across racial groups (group fair), but two individuals with identical criminal histories receive different risk scores because one has a family member with a prior conviction (individually unfair). Which statement is most accurate?",
      options: [
        {
          label: "The tool can be both group fair and individually unfair simultaneously — these are different criteria that can conflict",
          correct: true,
          explanation: "Correct. Group fairness and individual fairness measure different things. This tool is group-fair (equal error rates across groups) but individually unfair (two identical individuals get different scores due to a factor unrelated to their own behavior). There is no universal 'fairness' — the two definitions genuinely conflict here, and which one should govern is a value judgment that must be made explicitly.",
        },
        {
          label: "If the tool is group fair, it is automatically individually fair",
          correct: false,
          explanation: "These are independent properties. Group fairness averages outcomes across large groups. Individual fairness applies to specific individuals. A tool can satisfy one while violating the other — as this example shows.",
        },
        {
          label: "The tool is fundamentally broken and should be discarded",
          correct: false,
          explanation: "A tool surfacing a tension between fairness definitions is raising a legitimate policy question, not necessarily indicating a broken system. The right response is to make the fairness tradeoff explicit, document it, and have stakeholders decide which criterion should govern — not to abandon the tool without engaging with the question.",
        },
      ],
    },
  ],
};

export default fatFairnessAccountabilityTransparency;
