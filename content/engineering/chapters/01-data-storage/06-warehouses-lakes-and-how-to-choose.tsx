import type { Section } from "@brinnaebent/workbook";

const warehousesLakesAndHowToChoose: Section = {
  id: "warehouses-lakes-and-how-to-choose",
  number: 6,
  title: "Warehouses, Lakes, and How to Choose",
  blocks: [
    {
      type: "text",
      html: `<h3>Data Warehouse</h3><p>A data warehouse is a centralized repository of integrated, historical data from across an organization, optimized for analytical queries rather than transactional ones. The defining traits:</p>
<ul>
<li><strong>Subject-oriented</strong> — organized around business topics (sales, customers, products), not application workflows</li>
<li><strong>Integrated</strong> — data from multiple sources is cleaned and unified into a consistent schema</li>
<li><strong>Non-volatile</strong> — you don't overwrite history; you append</li>
<li><strong>Time-variant</strong> — you keep a historical record, not just current state</li>
</ul><br>
<p>The big names: Snowflake, Amazon Redshift, Google BigQuery. They all use columnar storage — storing data column-by-column rather than row-by-row — which makes analytical queries (aggregate this column, filter by that column) dramatically faster.</p>`,
    },
    {
      type: "text",
      html: `<h3>Data Lake</h3><p>A data lake is a centralized repository that stores raw data — structured, semi-structured, and unstructured — in its native format, with no upfront schema requirement. Think of it as a staging area for everything: raw logs, JSON API responses, images, audio, CSV exports. Schema is applied at read time rather than write time.</p>
<p>The big names: AWS S3, Azure Data Lake Storage, Google Cloud Storage. Cheap per-byte, theoretically infinite, accepts anything.</p>`,
    },
    {
      type: "text",
      html: `<p>A data lake without discipline becomes a <strong>data swamp</strong>. Dump enough unlabeled, unmanaged, unversioned data into S3 over a few years and you end up with tens of thousands of objects nobody can describe, query performance that has degraded to unusable, and no audit trail for compliance. If you've ever inherited a <code>data/</code> bucket with 40,000 files and no documentation, you know the feeling.</p>
<p>Governance is necessary for a data lake: naming conventions, partitioning schemes, metadata catalogs, and access controls from day one. A lake without governance is just a filesystem with better marketing.</p>`,
    },
    {
      type: "interactive",
      component: "LakehouseComparison",
      caption: "Click any row to expand the reasoning behind each trade-off — not just what differs, but why it matters.",
      props: {},
    },
    {
      type: "text",
      html: `<h3>Data Lakehouse</h3><p>The lakehouse is the 2019-era attempt to get the best of both: cheap, flexible lake storage with warehouse-quality schema enforcement, governance, and SQL performance. Databricks coined the term. Delta Lake, Apache Iceberg, and Apache Hudi are the open table formats that power it. Whether your team uses one depends on your vendor relationships and scale — but knowing the concept is useful for design conversations.</p>
<p>Finally, a word on the common file formats you'll see inside lakes:</p>`,
    },
    {
      type: "text",
      html: `<h3>Common File Formats</h3><ul>
<li><strong>Parquet</strong> — columnar, excellent compression, great for analytical queries. The default choice for ML training data.</li>
<li><strong>ORC</strong> — also columnar, optimized for Hive and Presto workloads. More common in Hadoop-heritage environments.</li>
<li><strong>Avro</strong> — row-based, supports schema evolution, well-suited for streaming pipelines.</li>
</ul><br>
<p>Parquet has become the de facto standard for data science workflows. If you're storing a training dataset and don't have a reason to do otherwise, use Parquet.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Five Questions to Pick the Right Storage",
      html: `<p>When a stakeholder asks "what should we use to store this?", walk through five questions:</p>
<ol><br>
<li><strong>1. What's the data?</strong> Structured, semi-structured, unstructured?</li>
<li><strong>2. How big, how fast, how varied?</strong> (The four V's.)</li>
<li><strong>3. What are the access patterns?</strong> Heavy reads? Heavy writes? Complex joins? Similarity search?</li>
<li><strong>4. What scale do we need?</strong> Today, and in two years?</li>
<li><strong>5. What's the team's existing ecosystem?</strong> A "perfect" choice nobody can operate is worse than a "good" choice that fits the team's skills.</li>
</ol><br>
<p>There is rarely one right answer. There is almost always one wrong answer you can rule out by asking those five questions.</p>`,
    },
    {
      type: "interactive",
      component: "StoragePicker",
      caption: "Answer questions about your data's V's and access patterns. The tool surfaces the storage type that fits — with its reasoning.",
      props: {},
    },
  ],
};

export default warehousesLakesAndHowToChoose;
