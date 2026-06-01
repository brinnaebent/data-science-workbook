import type { Section } from "@brinnaebent/workbook";

const designingAPipeline: Section = {
  id: "designing-a-pipeline",
  number: 6,
  title: "Designing a Pipeline",
  blocks: [
    {
      type: "text",
      html: `<p>Concepts are useful. Worked examples are where understanding actually forms. Let's build a pipeline — from business requirement to architecture sketch — and then talk about the part nobody covers in textbooks: quality, governance, and what keeps a pipeline alive after you ship it.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Brief: E-Commerce Sales Dashboard",
      html: `<p>An e-commerce company wants a daily dashboard of sales by region. The data lives in three places: orders in a Postgres database, web events in Kafka, and marketing spend in the Salesforce API. The dashboard needs to be ready by 7 a.m. every day, reflecting the previous day's data.</p>
<p>Here's a reasonable pipeline:</p>
<ol>
<li><strong>Source layer</strong> — Postgres (orders), Kafka (web events), Salesforce API (marketing spend). Three different systems, three different access patterns.</li>
<li><strong>Ingestion</strong> — An Airflow DAG that runs at 2 a.m. every night: extracts yesterday's orders via SQL, the day's events from Kafka, and the marketing data via REST API call.</li>
<li><strong>Staging</strong> — Raw data lands in S3, partitioned by date, in Parquet format. Nothing is transformed yet. This is the insurance policy: if a transformation breaks, you can rerun it without re-extracting from source.</li>
<li><strong>Transformation</strong> — A Spark job joins orders, events, and spend; computes per-region totals; writes a clean fact table back to S3.</li>
<li><strong>Load</strong> — The fact table is loaded into Snowflake, ready for query.</li>
<li><strong>Serving</strong> — A BI tool (Tableau, Looker, Metabase) queries Snowflake to render the dashboard.</li>
<li><strong>Monitoring</strong> — Airflow alerts if any step fails. Data quality checks (row counts within expected ranges, no nulls in key fields) run after the transform step.</li>
</ol>`,
    },
    {
      type: "text",
      html: `<p>Every job in data engineering is a version of this pipeline, at different scales and in different domains. What changes is the volume, the sources, and the transformation complexity. What doesn't change: data needs to get extracted from somewhere, transformed into something useful, and loaded somewhere reliable.</p>
<p>Now for the part nobody writes about.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Unsexy 20%: Quality, Lineage, Governance, Cost",
      html: `<p>Getting a pipeline to run for the first time is 80% of the work. Keeping it running when the company grows — and proving to auditors that it runs correctly — is the other 80%.</p>
<ul>
<li><strong>Data quality</strong> — schema checks, null-rate monitoring, distribution drift detection. Tools: Great Expectations, dbt tests, Soda. Without automated quality checks, you'll find out about bad data when the CEO asks why the dashboard shows $0 in sales for a region that shipped 10,000 units.</li>
<li><strong>Lineage</strong> — given a number on a dashboard, can you trace it back to the source rows that produced it? Lineage tools (DataHub, OpenLineage) make this possible. Regulators and auditors increasingly require it.</li>
<li><strong>Governance</strong> — who is allowed to see what, and how do you prove it? Access control isn't a nice-to-have; it's a HIPAA requirement, a GDPR requirement, and a SOC 2 requirement depending on your industry.</li>
<li><strong>Cost</strong> — pipelines that worked fine at 100 GB/day can bankrupt you at 10 TB/day. Watch query costs. BigQuery and Snowflake both have pricing models where a single poorly-optimized query can be shockingly expensive.</li>
</ul>`,
    },
    {
      type: "image",
      src: "/images/engineering/pipeline-architecture.png",
      alt: "End-to-end pipeline architecture diagram: sources on the left feed into ingestion, staging in S3, transformation via Spark, loading into Snowflake, and serving to a BI tool; a monitoring layer runs alongside all steps",
      caption: "A complete pipeline has a monitoring layer — not just a monitoring afterthought. Quality checks, alerting, and cost tracking run alongside every step.",
    },
    {
      type: "interactive",
      component: "DAGBuilder",
      caption: "Wire up pipeline nodes — Extract, Transform, Load — and watch the dependency graph render. Click 'run' to see tasks execute in order.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "eng-ch2-s6-q1",
      kind: "mc",
      question: "At 6:58 a.m., the head of sales reports that the regional dashboard is empty — it shows no data for any region. You're the on-call engineer. In what order do you investigate?",
      options: [
        {
          label: "Check the BI tool configuration first, then the database connection",
          correct: false,
          explanation: "Starting at the serving layer (BI tool) when the problem might be upstream is inefficient. If the data isn't in Snowflake, the BI tool configuration is irrelevant.",
        },
        {
          label: "Check the orchestrator (Airflow) for failed task runs, then trace the failure to its source — extract, transform, or load",
          correct: true,
          explanation: "Correct. The orchestrator is the single pane of glass for pipeline status. Check whether the nightly DAG ran successfully. If not, which task failed? That tells you whether the problem is in extraction (source connectivity), transformation (business logic error), or loading (warehouse write failure). You work upstream from the symptom to the root cause.",
        },
        {
          label: "Query Snowflake directly to see if the data is there, then check the BI tool",
          correct: false,
          explanation: "Querying Snowflake is a reasonable second step — it tells you whether the data exists and the BI tool has a configuration problem, or whether the pipeline failed to deliver data at all. But checking the orchestrator first tells you whether any step failed, which is faster information than running a query.",
        },
        {
          label: "Wait until 9 a.m. to see if it resolves on its own",
          correct: false,
          explanation: "A dashboard that was supposed to be ready at 7 a.m. is empty at 6:58 a.m. — the window has passed. This is already an incident that needs immediate investigation.",
        },
      ],
    },
  ],
};

export default designingAPipeline;
