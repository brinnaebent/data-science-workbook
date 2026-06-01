import type { Section } from "@brinnaebent/workbook";

const cloudWarehouses: Section = {
  id: "cloud-warehouses",
  number: 5,
  title: "The Cloud Warehouses",
  blocks: [
    {
      type: "text",
      html: `<p>Modern data engineering rarely runs on raw Hadoop clusters anymore. The dominant pattern at most companies is a managed cloud data warehouse — a service where the underlying distributed infrastructure is someone else's problem, and you focus on SQL and pipeline design.</p>
<p>Three platforms define this space. You typically don't pick the warehouse — your employer already has. But understanding the trade-offs makes you useful in architecture conversations, and it comes up in interviews more than you'd expect.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Snowflake",
      html: `<p>Snowflake is cloud-native and multi-cloud — it runs on AWS, Azure, and GCP, and you can query data across all three from the same interface. Its signature architectural decision is <strong>separating storage from compute</strong>: you scale them independently, which means you can spin up a large compute cluster for a complex query and then scale back down, paying only for what you use.</p>
<p>Snowflake is popular with organizations that operate across cloud providers or want to avoid cloud lock-in. It's also the choice when you're buying the warehouse as a service rather than building it yourself — Snowflake handles performance tuning, indexing, and maintenance.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Amazon Redshift",
      html: `<p>Redshift is AWS's managed warehouse. It uses columnar storage and massively parallel query execution. It's tightly integrated with the rest of the AWS ecosystem — S3, Glue, Lambda, SageMaker — which makes it the natural choice for teams already deep in AWS.</p>
<p>Redshift works well for read-heavy analytical workloads at significant scale. Its Redshift Spectrum feature lets you query data directly in S3 without loading it into the warehouse — a useful bridge between lake and warehouse patterns.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Google BigQuery",
      html: `<p>BigQuery is serverless — you don't provision clusters or think about nodes. You write SQL, submit queries, pay per byte scanned. This makes it the fastest path from "zero" to "querying petabytes of data" of any warehouse in the market.</p>
<p>The billing model is also different from Redshift: you pay per query rather than per cluster-hour, which is cheaper for intermittent workloads but can become expensive if you run large scans frequently. BigQuery has become the default recommendation for learning and prototyping precisely because the operational overhead is near-zero.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Which Would You Choose?",
      html: `<p>A healthcare analytics team is moving from an on-premises data warehouse to the cloud. They need strong compliance controls (HIPAA), SQL-based transformations, and an easy bridge to their existing AWS infrastructure. Their team is deep in AWS and doesn't want to manage multiple cloud accounts.</p>
<p><strong>Best fit: Redshift.</strong> Native AWS integration, HIPAA-eligible (with proper configuration), columnar storage for the analytical workloads they're running. Snowflake would also work but introduces multi-cloud complexity they don't need. BigQuery would require migrating their AWS infrastructure to GCP or managing cross-cloud access.</p>
<p>This is the kind of reasoning that makes you useful in an architecture conversation — not memorizing product names, but matching architectural trade-offs to real constraints.</p>`,
    },
    {
      type: "interactive",
      component: "PipelineCostSimulator",
      caption: "Estimate the monthly cost of a pipeline at different volumes and frequencies on Snowflake vs. BigQuery vs. Redshift. Real pricing, real numbers.",
      props: {},
    },
    {
      type: "reflection",
      id: "eng-ch2-s5-r1",
      question: "You're joining a small startup that has been storing all of its data in flat CSV files in S3. They've asked you to recommend a warehouse. What questions would you ask before making a recommendation?",
      sampleAnswer: "Good questions include: What are the current query patterns? (Ad hoc exploration vs. fixed dashboards.) How large is the data today and how fast is it growing? (Volume and velocity.) What does the team's SQL proficiency look like? (Affects how much managed infrastructure is worth paying for.) Are there compliance requirements? (Affects cloud provider choices.) What cloud infrastructure do they already use? (Lock-in considerations.) What's the analytics budget? (BigQuery's per-query billing vs. Snowflake's per-compute billing have very different cost curves at different usage patterns.)",
    },
  ],
};

export default cloudWarehouses;
