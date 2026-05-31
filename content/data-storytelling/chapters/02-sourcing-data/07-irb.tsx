import type { Section } from "@brinnaebent/workbook";

const irb: Section = {
  id: "irb",
  number: 7,
  title: "IRB",
  blocks: [
    {
      type: "text",
      html: `<p>If you're collecting data from human subjects for research, you may need approval from an <strong>Institutional Review Board</strong>. File if any of these apply:</p>
<ul>
<li>You're collecting any <strong>Personally Identifiable Information (PII)</strong> or running experiments on humans → Campus IRB.</li>
<li>You're collecting any <strong>Personal Health Information (PHI)</strong> → Health IRB.</li>
<li>You're going to publish results from a dataset that involves humans.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "What counts as PII?",
      html: `<p>PII (Personally Identifiable Information) includes: names, SSNs, dates of birth, addresses, phone numbers, email addresses, biometric data, IP addresses, driver's license numbers, passport numbers, and financial account information.</p>
<p>If you're <em>not</em> collecting PII, IRB approval is usually fast. If you are, build the review into your project timeline — not at the end.</p>`,
    },
    {
      type: "text",
      html: `<p>Outside academia, there's no campus IRB — but ethical and legal obligations around human subjects research don't disappear. Companies conducting research that could be publishable, regulated, or that involves sensitive data typically use <strong>independent (hired) IRBs</strong>. Common providers include WCG IRB, Advarra, and Copernicus Group.</p>

<p>When to consider a hired IRB:</p>
<ul>
<li>Your company intends to <strong>publish or present findings</strong> from human-subjects research (journals and conferences increasingly require IRB approval).</li>
<li>You're running <strong>clinical, health, or behavioral studies</strong> that fall under FDA or HHS regulations.</li>
<li>You're working with a <strong>regulated partner</strong> (hospital, university, government agency) that requires IRB oversight for all collaborators.</li>
</ul>
<br>
<p>For internal product research — A/B tests, UX studies, customer surveys — formal IRB review is rarely required, but your company's legal and privacy teams should still review data collection practices, especially if PII or PHI is involved.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-sourcing-irb-q1",
      kind: "mc",
      question: "You're conducting research that involves collecting email addresses and health survey responses from university students. Which review board(s) should you consult?",
      options: [
        {
          label: "Both Campus IRB (for PII — email addresses) and Health IRB (for health information)",
          correct: true,
          explanation: "Correct. Email addresses are PII, which triggers Campus IRB review. Health survey responses are PHI, which triggers Health IRB review. When a study involves both types, you typically need both. Always check your institution's specific rules, but when in doubt, file.",
        },
        {
          label: "No IRB needed — students are consenting adults who chose to participate",
          correct: false,
          explanation: "Consent is one requirement of IRB-approved research, not a substitute for it. IRB review ensures the research design protects participants appropriately — consent alone doesn't satisfy that requirement when PII or PHI is involved.",
        },
        {
          label: "Campus IRB only — health surveys don't count as PHI unless they include diagnoses",
          correct: false,
          explanation: "PHI is broader than formal diagnoses. Self-reported health information — symptoms, conditions, medications, behaviors — is covered. If your health survey captures anything about a person's health status, Health IRB review is appropriate.",
        },
      ],
    },
  ],
};

export default irb;
