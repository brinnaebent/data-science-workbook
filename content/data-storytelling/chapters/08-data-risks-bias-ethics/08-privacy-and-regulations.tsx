import type { Section } from "@brinnaebent/workbook";

const privacyAndRegulations: Section = {
  id: "privacy-and-regulations",
  number: 8,
  title: "Privacy and Regulations",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Data privacy</strong> is the right of users to have control over how their information is collected, used, and shared. Understanding it is not optional for anyone building data products — both because it's ethically important and because it's legally required.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Case 1: Location Data — 'Anonymized' Isn't Anonymous",
      html: `<p>At least 75 companies receive precise, "anonymized" location data from apps whose users enabled location services for weather, news, or similar purposes. They sell it to advertisers, retailers, and hedge funds. The market is in the tens of billions of dollars per year.</p>
<p>The New York Times investigation tracked specific individuals via this data. A teacher's device pinged from home to school hundreds of times — they could identify how long she spent at the dermatologist, when she went to the gym, when she visited a Weight Watchers location. The data is "anonymous" only in the sense that names aren't attached to the IDs. Location patterns over time identify people uniquely. Anonymization-by-removing-names is not real anonymization.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Case 2: Target Knew Before Her Father Did",
      html: `<p>Target's data team identified about 25 products that, when purchased together, indicated a customer was likely pregnant — and even allowed estimation of due dates. Things like unscented lotion in the second trimester, calcium supplements, large quantities of cotton balls. They sent targeted coupons. A teenager started receiving baby coupons in the mail. Her father confronted Target. Then he found out his daughter was pregnant — she hadn't told him yet.</p>
<p>These are not hypothetical. These are normal applications of normal techniques to normal data. The question isn't whether your data work has privacy implications. It's whether you've thought about them.</p>`,
    },
    {
      type: "text",
      html: `<p><strong>Key US Privacy Regulations:</strong></p>
<ul>
<li><strong>HIPAA</strong> — governs protected health information (PHI) used by covered entities. Requires privacy notices, limits use to treatment/payment/operations without additional consent, gives users right of access.</li>
<li><strong>FERPA</strong> (1974) — gives students control over disclosure of educational records. Applies to all educational institutions receiving federal funding.</li>
<li><strong>FCRA / FACTA / GLBA</strong> — govern financial data. FCRA limits consumer credit report use and requires notification of adverse decisions. GLBA introduced privacy notices and security program requirements for financial institutions.</li>
<li><strong>CCPA</strong> — California's Consumer Privacy Act, the strictest state-level privacy law in the US. Applies broadly to businesses that serve California residents, regardless of where the business is located.</li>
</ul>
<p>If your organization offers services in a country — even free services — or processes data of users who live there, you must follow that country's privacy laws regardless of where you're physically located.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "PII vs. Sensitive Information",
      html: `<p><strong>PII (Personally Identifiable Information)</strong> — non-public information tied to or identifiable to a specific person: names, SSNs, dates of birth, addresses, phone numbers, email addresses, biometric data, IP addresses, financial account numbers.</p>
<p><strong>Sensitive information</strong> — a subset with stricter rules: Social Security numbers, financial information, medical records.</p>
<p>PII can be directly identifiable (name) or indirectly identifiable (a combination of attributes that allow re-identification — which is what the location data case demonstrates). "Anonymized" data can still be PII if re-identification is feasible.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-ethics-privacy-q1",
      kind: "mc",
      question: "You publish a dataset of 'anonymized' user location pings, removing names and user IDs. A researcher later shows that 95% of individuals in the dataset can be uniquely identified from just 4 random location samples. Does this dataset contain PII?",
      options: [
        {
          label: "Yes — if re-identification is feasible, the data is still PII regardless of the removal of explicit identifiers",
          correct: true,
          explanation: "Correct. This is exactly the location data case. Removing names and IDs doesn't make data anonymous if the remaining attributes (here, location patterns) allow re-identification. Legal and regulatory frameworks are increasingly recognizing this — GDPR in Europe and some US regulations treat indirectly identifiable data as PII. Publishing data you believed was anonymous but which enables re-identification creates legal and ethical liability.",
        },
        {
          label: "No — PII requires explicit identifiers like names or SSNs; location data is not PII",
          correct: false,
          explanation: "PII is defined by identifiability, not by the specific type of data. If location patterns uniquely identify 95% of individuals, those location records are personally identifiable — and therefore PII — regardless of the fact that names were removed.",
        },
        {
          label: "Only if someone actually uses the dataset to re-identify individuals",
          correct: false,
          explanation: "Potential for re-identification is what matters for privacy risk, not whether someone has already exploited it. Publishing data with high re-identification potential creates that risk at the moment of publication, not only when it's realized.",
        },
      ],
    },
  ],
};

export default privacyAndRegulations;
