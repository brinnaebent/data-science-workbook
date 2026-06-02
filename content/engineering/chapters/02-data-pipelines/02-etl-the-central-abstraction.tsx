import type { Section } from "@brinnaebent/workbook";

const etlTheCentralAbstraction: Section = {
  id: "etl-the-central-abstraction",
  number: 2,
  title: "ETL: The Central Abstraction",
  blocks: [
    {
      type: "text",
      html: `<p>Behind every dashboard you've ever seen, every "daily KPI" email an executive receives, every training dataset that mysteriously appears in your team's S3 bucket — there is a pipeline. Almost always, that pipeline follows the same three-step pattern.</p>
<p><strong>ETL</strong> stands for <strong>Extract, Transform, Load</strong>.</p>`,
    },
    {
      type: "interactive",
      component: "ETLStepsGrid",
      caption: "",
    },
    {
      type: "callout",
      variant: "info",
      title: "ELT: The Warehouse-First Variant",
      html: `<p>As data warehouses became more powerful (and cheaper per query), a variation emerged: <strong>ELT</strong> — Extract, Load, <em>then</em> Transform. You dump raw data into the warehouse first and run transformations <em>inside</em> the warehouse using SQL. Snowflake and BigQuery both encourage this pattern. Tools like dbt (data build tool) have made it enormously popular.</p><br>
<p>The trade-off: ELT is simpler to operate — you're writing SQL, not Python pipeline code — but harder to keep clean. The "raw" layer can sprawl if nobody enforces standards. In practice, most modern teams run ELT for structured sources and ETL for heavier transformations on unstructured data.</p>`,
    },
    {
      type: "checkpoint",
      id: "eng-ch2-s2-q1",
      kind: "mc",
      question: "A team decides to use ELT instead of ETL for a new analytics pipeline. They load raw JSON from their API into BigQuery, then run SQL transformations to clean and aggregate it. What is the most significant trade-off they've made?",
      options: [
        {
          label: "ELT is always slower than ETL",
          correct: false,
          explanation: "ELT is often faster in practice because modern cloud warehouses are highly optimized for SQL. The speed comparison depends on the workload, not the pattern itself.",
        },
        {
          label: "ELT gives up Python's expressiveness for SQL's accessibility, and requires managing a 'raw' layer that can sprawl without governance",
          correct: true,
          explanation: "Correct. ELT moves transformation into the warehouse using SQL, which is simpler to operate but loses Python's flexibility for complex transformations. The bigger risk is the raw layer: if teams dump data without standards, the warehouse becomes a swamp. Governance is the essential discipline that makes ELT viable.",
        },
        {
          label: "ELT can't handle real-time data",
          correct: false,
          explanation: "ELT can work with streaming sources too — you load events as they arrive and run transformation queries on a schedule or trigger. Real-time capability is an architectural choice independent of the ETL vs. ELT distinction.",
        },
        {
          label: "ELT requires more expensive infrastructure than ETL",
          correct: false,
          explanation: "ELT typically shifts compute into the warehouse (which you're already paying for) and reduces the need for separate transformation infrastructure. It's often cheaper, not more expensive.",
        },
      ],
    },
  ],
};

export default etlTheCentralAbstraction;
