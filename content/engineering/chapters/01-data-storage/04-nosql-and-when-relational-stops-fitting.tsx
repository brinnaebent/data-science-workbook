import type { Section } from "@brinnaebent/workbook";

const nosqlAndWhenRelationalStopsFitting: Section = {
  id: "nosql-and-when-relational-stops-fitting",
  number: 4,
  title: "NoSQL: When Relational Stops Fitting",
  blocks: [
    {
      type: "text",
      html: `<p>The 2000s brought a problem that relational databases hadn't been designed for: internet scale. When Google needed to index the web, Amazon needed to serve product pages to millions of simultaneous shoppers, and Facebook needed to store social connections for a billion people, the relational model started to crack. Not because it was bad — because the workloads were genuinely different.</p>
<p>The response was a family of databases that prioritized horizontal scaling and schema flexibility over the relational model's consistency guarantees. The umbrella term became <strong>NoSQL</strong> — which, confusingly, doesn't mean "no SQL ever." It means "not only SQL" — a acknowledgment that SQL-shaped thinking is one tool among several.</p>
<p>There are four NoSQL subtypes, and the cheat code is to learn them by <em>use case</em>, not by name.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Four NoSQL Types and When to Reach for Each",
      html: `<table>
<thead><tr><th>Type</th><th>What it stores</th><th>Reach for it when</th><th>Examples</th></tr></thead>
<tbody>
<tr><td><strong>Document</strong></td><td>JSON-like objects, each self-describing</td><td>Content management, user profiles, event logs — anything where each record can have a different shape</td><td>MongoDB, Couchbase, DocumentDB</td></tr>
<tr><td><strong>Key-Value</strong></td><td>Key → value pairs</td><td>Caching, session state, real-time lookups — you know exactly what you're looking for</td><td>Redis, DynamoDB</td></tr>
<tr><td><strong>Column-Family</strong></td><td>Rows grouped into column families</td><td>IoT telemetry, time-series at massive scale, very large web apps with simple access patterns</td><td>Cassandra, HBase, Bigtable</td></tr>
<tr><td><strong>Graph</strong></td><td>Nodes and edges</td><td>Social networks, fraud detection, recommendations, knowledge graphs — any domain where relationships are first-class</td><td>Neo4j, Neptune, OrientDB</td></tr>
</tbody>
</table>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Fraud Detection Case for Graph Databases",
      html: `<p>A bank's fraud team needs to answer: "Is this account within three hops of a known fraudulent account?" In SQL, that's a recursive self-join — expensive to write, expensive to run, and it gets worse as the network grows. In a graph database, "find all nodes within three hops" is a native operation. The query is three lines. The result comes back in milliseconds.</p>
<p>This isn't a case where graph databases are slightly better. It's a case where graph databases make the query possible at scale and relational databases make it nearly impossible. Recognizing which problem you have is 80% of the storage decision.</p>`,
    },
    {
      type: "text",
      html: `<p>The general decision framework, compressed to a sentence each:</p>
<ul>
<li>Structured + transactional → relational</li>
<li>Highly connected data → graph</li>
<li>Massive scale with simple access patterns → key-value or column-family</li>
<li>Schema-flexible documents → document store</li>
</ul>
<p>Notice what this framework doesn't do: it doesn't say "use NoSQL" as a blanket answer. NoSQL databases give up things — typically, strong consistency guarantees and rich query languages — in exchange for scale and flexibility. Those trade-offs are worth making when your workload demands it. They're not worth making when a Postgres instance would have been fine.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "NoSQL Does Not Mean Schema-Free Forever",
      html: `<p>Document and key-value stores don't enforce schemas at the database level — but your application still has expectations about what's in each record. When those expectations aren't documented and enforced somewhere, you end up with a "document store" where documents gradually diverge in shape over years of development, and querying becomes a series of defensive null-checks. Schema flexibility is a feature when you need it. It's a liability when it becomes an excuse not to think about data structure.</p>`,
    },
    {
      type: "checkpoint",
      id: "eng-ch1-s4-q1",
      kind: "mc",
      question: "A music streaming service stores user playlists. Each playlist is a list of track IDs with metadata (name, created date, last modified). Different playlists have different numbers of tracks, and the feature team adds new metadata fields frequently. Which storage pattern fits best?",
      options: [
        {
          label: "Relational database — playlists and tracks are naturally tabular",
          correct: false,
          explanation: "You could model this relationally, but the variable number of tracks per playlist and the frequently-changing metadata fields are exactly the cases where schema-enforced relational tables become cumbersome. You'd be adding columns frequently and dealing with lots of NULLs.",
        },
        {
          label: "Document store — each playlist is a self-describing JSON document that naturally accommodates variable track lists and evolving metadata",
          correct: true,
          explanation: "Correct. A document store like MongoDB lets each playlist document contain its own track array (variable length, no join table needed) and accept new metadata fields without a schema migration. This is the canonical document store use case.",
        },
        {
          label: "Graph database — playlists connect to tracks",
          correct: false,
          explanation: "Graph databases shine when relationships are complex and traversal is the primary query (e.g., 'find all users who follow people who like this track'). Playlist storage doesn't require graph traversal — the data model is hierarchical, not network-shaped.",
        },
        {
          label: "Key-value store — just store playlist IDs as keys",
          correct: false,
          explanation: "Key-value stores are optimized for single-key lookups. If you need to search, filter, or aggregate playlists, key-value stores provide no query capability beyond 'get by key.' The feature team's metadata evolution also doesn't fit key-value ergonomics well.",
        },
      ],
    },
  ],
};

export default nosqlAndWhenRelationalStopsFitting;
