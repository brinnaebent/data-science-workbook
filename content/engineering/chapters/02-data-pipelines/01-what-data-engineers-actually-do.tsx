import type { Section } from "@brinnaebent/workbook";

const whatDataEngineersActuallyDo: Section = {
  id: "what-is-data-engineering",
  number: 1,
  title: "What is Data Engineering?",
  blocks: [
    {
      type: "text",
      html: `<p>There's a fantasy version of the data scientist role where clean datasets materialize each morning, perfectly formatted, ready to model. In reality, someone built the pipeline that produced that data. Someone decided how to partition it. Someone set the schedule. Someone is getting paged at 2 a.m. when it breaks.</p>
<p><i>That person is the data engineer — and on smaller teams, that person is you.</i></p>`,
    },
    {
      type: "text",
      html: `<p>Data engineering is the practice of designing, building, and maintaining the infrastructure that collects, stores, and serves data at scale.</p>
<p>In practice, the line between data engineering and ML engineering is porous. At a startup, you might own the entire pipeline from raw source to deployed model. At a large company, a specialized data engineering team will own the pipeline up to the feature store, and your job starts where theirs ends. Either way, you'll be more effective — and more trusted — if you can speak the language of data engineering.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "The Data Engineer's Core Toolkit",
      html: `<ul>
<li><strong>Languages</strong> — Python and SQL are non-negotiable. Scala or Java still appear around Spark and Kafka.</li>
<li><strong>A cloud platform</strong> — AWS, Azure, or GCP. Usually your employer decides.</li>
<li><strong>A warehouse</strong> — Snowflake, Redshift, or BigQuery.</li>
<li><strong>An ETL/orchestration tool</strong> — Apache Airflow leads the open-source pack.</li>
<li><strong>Version control and containers</strong> — Git, Docker, often Kubernetes.</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "eng-ch2-s1-q1",
      kind: "mc",
      question: "A data scientist at a startup says: 'I spend 70% of my time getting data into a usable format — cleaning it, joining it, scheduling jobs to refresh it.' What is the most accurate description of what they're doing?",
      options: [
        {
          label: "They're doing the wrong kind of work and should hire a data engineer",
          correct: false,
          explanation: "At a startup, resource constraints mean data scientists frequently own the pipeline layer. This isn't wrong — it's the reality of small-team engineering. Understanding pipeline work makes you more effective regardless of your title.",
        },
        {
          label: "They're performing data engineering tasks — building the infrastructure that makes modeling possible",
          correct: true,
          explanation: "Correct. Cleaning, joining, and scheduling data jobs is data engineering. The boundary between data science and data engineering is a team-size and company-maturity concern, not a hard technical distinction. Many practitioners do both.",
        },
        {
          label: "They're doing feature engineering",
          correct: false,
          explanation: "Feature engineering is the process of transforming raw data into predictive signals for a model. What's described here — getting data into a usable format, joining sources, scheduling refreshes — is pipeline/infrastructure work that happens before feature engineering begins.",
        },
        {
          label: "They're doing exploratory data analysis",
          correct: false,
          explanation: "EDA is analytical — exploring data to understand its structure and surface patterns. Scheduling jobs, building joins, and pipeline management are operational and infrastructure tasks.",
        },
      ],
    },
  ],
};

export default whatDataEngineersActuallyDo;
