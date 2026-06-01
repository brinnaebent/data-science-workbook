import type { Section } from "@brinnaebent/workbook";

const warehousesLakesAndHowToChoose: Section = {
  id: "warehouses-lakes-and-how-to-choose",
  number: 6,
  title: "Warehouses, Lakes, and How to Choose",
  blocks: [
    {
      type: "text",
      html: `<p>The conversation about data warehouses and data lakes is partly technical and partly organizational. The technical part is straightforward. The organizational part is where things get messy — because "where should our data live?" is a question with budget implications, team implications, and the quiet politics of who controls what.</p>
<p>Let's do the technical part first.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Data Warehouse",
      html: `<p>A <strong>data warehouse</strong> is a centralized repository of integrated, historical data from across an organization, optimized for analytical queries rather than transactional ones. The defining traits:</p>
<ul>
<li><strong>Subject-oriented</strong> — organized around business topics (sales, customers, products), not application workflows</li>
<li><strong>Integrated</strong> — data from multiple sources is cleaned and unified into a consistent schema</li>
<li><strong>Non-volatile</strong> — you don't overwrite history; you append</li>
<li><strong>Time-variant</strong> — you keep a historical record, not just current state</li>
</ul>
<p>The big names: Snowflake, Amazon Redshift, Google BigQuery. They all use columnar storage — storing data column-by-column rather than row-by-row — which makes analytical queries (aggregate this column, filter by that column) dramatically faster.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Data Lake",
      html: `<p>A <strong>data lake</strong> is a centralized repository that stores raw data — structured, semi-structured, and unstructured — in its native format, with no upfront schema requirement. Think of it as a staging area for everything: raw logs, JSON API responses, images, audio, CSV exports. Schema is applied at read time rather than write time.</p>
<p>The big names: AWS S3, Azure Data Lake Storage, Google Cloud Storage. Cheap per-byte, theoretically infinite, accepts anything.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Comparing the Two",
      html: `<table>
<thead><tr><th></th><th>Data Lake</th><th>Data Warehouse</th></tr></thead>
<tbody>
<tr><td><strong>Schema</strong></td><td>On read — applied when queried</td><td>On write — enforced at ingestion</td></tr>
<tr><td><strong>Data</strong></td><td>Raw, all types</td><td>Cleaned, structured</td></tr>
<tr><td><strong>Cost</strong></td><td>Cheap</td><td>More expensive</td></tr>
<tr><td><strong>Best for</strong></td><td>ML training, exploration, archiving</td><td>BI, dashboards, reporting</td></tr>
<tr><td><strong>Risk</strong></td><td>Becomes a swamp if unmanaged</td><td>Expensive to store everything</td></tr>
</tbody>
</table>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Data Swamp Problem",
      html: `<p>A data lake without discipline becomes a <strong>data swamp</strong> — and faster than you'd expect. Dump enough unlabeled, unmanaged, unversioned data into S3 over a few years and you end up with tens of thousands of objects nobody can describe, query performance that has degraded to unusable, and no audit trail for compliance. If you've ever inherited a <code>data/</code> bucket with 40,000 files and no documentation, you know the feeling.</p>
<p>The fix isn't a different storage system — it's governance: naming conventions, partitioning schemes, metadata catalogs, and access controls from day one. A lake without governance is just a filesystem with better marketing.</p>`,
    },
    {
      type: "text",
      html: `<p>The <strong>lakehouse</strong> is the 2019-era attempt to get the best of both: cheap, flexible lake storage with warehouse-quality schema enforcement, governance, and SQL performance. Databricks coined the term. Delta Lake, Apache Iceberg, and Apache Hudi are the open table formats that power it. Whether your team uses one depends on your vendor relationships and scale — but knowing the concept is useful for design conversations.</p>
<p>Finally, a word on the common file formats you'll see inside lakes:</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Lake File Formats",
      html: `<ul>
<li><strong>Parquet</strong> — columnar, excellent compression, great for analytical queries. The default choice for ML training data.</li>
<li><strong>ORC</strong> — also columnar, optimized for Hive and Presto workloads. More common in Hadoop-heritage environments.</li>
<li><strong>Avro</strong> — row-based, supports schema evolution, well-suited for streaming pipelines.</li>
</ul>
<p>Parquet has become the de facto standard for data science workflows. If you're storing a training dataset and don't have a reason to do otherwise, use Parquet.</p>`,
    },
    {
      type: "text",
      html: `<p>When a stakeholder asks "what should we use to store this?", walk through five questions:</p>
<ol>
<li><strong>What's the data?</strong> Structured, semi-structured, unstructured?</li>
<li><strong>How big, how fast, how varied?</strong> (The four V's.)</li>
<li><strong>What are the access patterns?</strong> Heavy reads? Heavy writes? Complex joins? Similarity search?</li>
<li><strong>What scale do we need?</strong> Today, and in two years?</li>
<li><strong>What's the team's existing ecosystem?</strong> A "perfect" choice nobody can operate is worse than a "good" choice that fits the team's skills.</li>
</ol>
<p>There is rarely one right answer. There is almost always one wrong answer you can rule out by asking those five questions.</p>`,
    },
    {
      type: "image",
      src: "/images/engineering/cloud-storage-services.png",
      alt: "Table mapping AWS, Azure, and GCP storage services by category: object storage, relational, warehouse, NoSQL, data lake, and vector",
      caption: "Each major cloud provider offers equivalent services in every storage category. Knowing the mapping saves you in interviews and cross-team conversations.",
    },
    {
      type: "interactive",
      component: "StoragePicker",
      caption: "Answer questions about your data's V's and access patterns. The tool surfaces the storage type that fits — with its reasoning.",
      props: {},
    },
    {
      type: "reflection",
      id: "eng-ch1-s6-r1",
      question: "Think about a data science project you've worked on or can imagine working on. Walk through the five storage questions for it. What storage type does the framework point to? Is that what you would have chosen intuitively?",
      sampleAnswer: "A good answer names the specific data type (e.g., clickstream events — semi-structured), estimates the V's (high velocity, medium volume, low variety, high veracity), identifies the access pattern (time-windowed aggregations for a daily dashboard), and reaches a conclusion (data lake for raw storage, warehouse for analytics). The interesting part is whether intuition and framework agree — and if not, why.",
    },
  ],
};

export default warehousesLakesAndHowToChoose;
