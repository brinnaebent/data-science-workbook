import type { Section } from "@brinnaebent/workbook";

const whyStorageIsTheWholeStory: Section = {
  id: "why-storage-is-the-whole-story",
  number: 1,
  title: "Why Storage Is the Whole Story",
  blocks: [
    {
      type: "text",
      html: `<p>In the early 2010s, several tech companies made a decision that looked, frankly, irresponsible: they started storing everything. Every click. Every page view. Every user interaction, every log line, every raw API response. Storage was getting cheaper by the month, and they were hoarding data like it was precious — except nobody could clearly articulate what it was for yet!</p>
<p>A decade later, those companies had the training corpora that made massive recommendation systems, prediction models, and even large language models possible. The data they'd accumulated wasn't junk. It was the moat. The companies that hadn't done it couldn't catch up by buying compute alone ... they simply didn't have the data. Storage, as a strategic decision made years before anyone knew why, turned out to be the whole game.</p>
<p><strong>The storage decisions you inherit will constrain every model decision you can make.</strong> You cannot train on data you didn't keep. You cannot reproduce a model built on a dataset that got overwritten. You cannot audit a system that never logged its inputs. Storage is upstream of everything.</p>`,
    },
    {
      type: "text",
      html: `<p>Storage matters in five practical ways:</p>
<ul>
<li><strong>Decision-making.</strong> Dashboards, business intelligence, the gut-check an executive needs before signing a contract — all of it runs on stored data.</li>
<li><strong>Regulatory compliance.</strong> HIPAA, GDPR, financial recordkeeping — compliance is inseparable from storage architecture. "We didn't keep that log" is not a defense.</li>
<li><strong>Business continuity.</strong> Reliable storage is what keeps a company alive when a cloud region goes down.</li>
<li><strong>Training data access.</strong> Fast, reproducible access to training sets is a prerequisite for doing the work at all.</li>
<li><strong>Reproducibility and versioning.</strong> Storing your data <em>and</em> your model artifacts <em>and</em> the metadata linking them is what makes a model rerunnable six months from now — not just by you, but by anyone auditing the system.</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "eng-ch1-s1-q1",
      kind: "mc",
      question: "A startup's ML team retrains their recommendation model every week. Six months in, a stakeholder asks why the model's performance suddenly dropped around week 14. The team can't answer because they overwrote the training data with each new version. What storage principle did they violate?",
      options: [
        {
          label: "They should have used a NoSQL database instead of a relational one",
          correct: false,
          explanation: "The choice of database type isn't the issue here. The problem is about versioning and retention, not the database model.",
        },
        {
          label: "They failed to version and retain their training data, making reproducibility and auditing impossible",
          correct: true,
          explanation: "Correct. Without versioned training data, you cannot reproduce a specific model, debug regressions, or answer 'what changed between week 13 and week 14?' This is one of the core reasons storage decisions matter — overwriting history destroys your ability to understand the system.",
        },
        {
          label: "They trained too frequently — monthly retraining would have avoided this",
          correct: false,
          explanation: "Training frequency is unrelated. The problem would exist whether they retrained weekly or monthly; the issue is that they didn't preserve the datasets used for each run.",
        },
        {
          label: "They needed a data warehouse, not a data lake",
          correct: false,
          explanation: "Neither warehouse nor lake choice addresses the fundamental issue: the data was overwritten rather than versioned. You can store data in either system responsibly or irresponsibly.",
        },
      ],
    },
  ],
};

export default whyStorageIsTheWholeStory;
