import type { Section } from "@brinnaebent/workbook";

const bigDataHadoopSparkHive: Section = {
  id: "big-data-hadoop-spark-hive",
  number: 4,
  title: "Big Data: Hadoop, Spark, and Hive",
  blocks: [
    {
      type: "text",
      html: `<p>There's a moment in every data team's life when the data outgrows a single machine. Maybe you're joining 50 GB tables and your laptop starts sweating. Maybe a query that ran in ten minutes last year now takes three hours. Maybe you're trying to process a week's worth of clickstream data and it simply doesn't fit in memory.</p>
<p>When that moment arrives, you need a <strong>distributed</strong> processing framework — software that splits a computation across many machines and coordinates the results. Three names define this space, and they often appear in job descriptions, architecture docs, and technical interviews.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Apache Hadoop",
      html: `<p>Hadoop introduced two foundational ideas in the mid-2000s:</p>
<ul>
<li><strong>HDFS (Hadoop Distributed File System)</strong> — store data across many machines, with automatic replication for fault tolerance. If one node fails, the data exists on two others.</li>
<li><strong>MapReduce</strong> — process distributed data in parallel using a two-phase programming model: a <em>map</em> step that processes each chunk independently, and a <em>reduce</em> step that aggregates the results.</li>
</ul>
<p>MapReduce is elegant in theory and painful in practice. Every intermediate result gets written to disk before the next step reads it — which makes it slow. Writing complex transformations in MapReduce requires thinking in terms of map/reduce phases, which is not how most people think about data manipulation.</p>
<p>Hadoop is still in production at large enterprises, but most new workloads have migrated to Spark.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Apache Spark",
      html: `<p>Spark is the current default for large-scale data processing, and the improvement over Hadoop MapReduce is substantial. The key insight: instead of writing intermediate results to disk between steps, Spark keeps them in memory. On iterative workloads (like machine learning training, which makes many passes over the data), this can be 100× faster.</p>
<p>Spark supports four workloads in a single framework:</p>
<ul>
<li><strong>Batch processing</strong> — process a large chunk of data on a schedule</li>
<li><strong>Stream processing</strong> — process events as they arrive (Spark Streaming)</li>
<li><strong>Machine learning</strong> — via the built-in MLlib library</li>
<li><strong>Interactive SQL</strong> — via Spark SQL, which accepts standard SQL syntax</li>
</ul>
<p>The PySpark API means you write Python — which is the reason Spark has become the default for data science teams that also need distributed compute.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Apache Hive",
      html: `<p>Hive sits on top of Hadoop (or Spark) and lets you query distributed data using <strong>HiveQL</strong>, a SQL dialect. Under the hood, Hive translates your query into MapReduce or Spark jobs. Hive made big data queryable by analysts who couldn't write MapReduce programs.</p>
<p>A common architecture you'll encounter in Hadoop-heritage environments:</p>
<pre><code>sources → HDFS (storage) → Spark (processing) → Hive (querying)</code></pre>
<p>Hive is less prominent in greenfield projects — modern cloud warehouses provide SQL over distributed data without the operational complexity of a Hadoop cluster — but it's ubiquitous in enterprises that built their data infrastructure in the 2010s.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "You Don't Need a Hadoop Cluster for Most Problems",
      html: `<p>Hadoop and Spark are solutions to genuinely big data problems. A 10 GB dataset that fits in a Pandas DataFrame or a Postgres table does not need Spark. A common mistake is reaching for distributed tools before you've outgrown single-machine tools — and then spending weeks on infrastructure instead of on the analysis.</p>
<p>The rule of thumb: try Pandas first. Try DuckDB (a fast in-process analytical database) second. Add distributed compute only when you've verified that the data genuinely doesn't fit single-machine processing.</p>`,
    },
    {
      type: "interactive",
      component: "SparkArchitecture",
      caption: "Step through the four phases of a Spark job to see how the driver partitions data, dispatches tasks to executors, and collects results — all without touching disk for intermediate state.",
    },
    {
      type: "checkpoint",
      id: "eng-ch2-s4-q1",
      kind: "mc",
      question: "Why is Apache Spark typically much faster than Hadoop MapReduce for iterative machine learning workloads?",
      options: [
        {
          label: "Spark uses faster hardware",
          correct: false,
          explanation: "Spark can run on the same hardware as Hadoop. The speedup is architectural, not hardware-dependent.",
        },
        {
          label: "Spark keeps intermediate results in memory rather than writing them to disk between steps, which eliminates the I/O bottleneck that makes MapReduce slow on iterative tasks",
          correct: true,
          explanation: "Correct. MapReduce writes all intermediate results to disk between the map and reduce phases. Machine learning is iterative — it makes many passes over the same data. With MapReduce, each pass incurs disk I/O. Spark's in-memory computation means data stays in RAM across iterations, which is the primary source of its speed advantage.",
        },
        {
          label: "Spark uses Python while Hadoop requires Java",
          correct: false,
          explanation: "Hadoop can be used from Python too (via the streaming API or higher-level tools). The performance difference is about the execution model, not the programming language.",
        },
        {
          label: "Spark doesn't use a distributed file system, so there's no network overhead",
          correct: false,
          explanation: "Spark frequently uses distributed storage (HDFS, S3) for input and output data. The speedup comes from in-memory intermediate storage between processing steps, not from avoiding distributed file systems.",
        },
      ],
    },
  ],
};

export default bigDataHadoopSparkHive;
