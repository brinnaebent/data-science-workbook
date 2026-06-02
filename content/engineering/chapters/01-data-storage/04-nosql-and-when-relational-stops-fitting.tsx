import type { Section } from "@brinnaebent/workbook";

const nosqlAndWhenRelationalStopsFitting: Section = {
  id: "nosql-and-when-relational-stops-fitting",
  number: 4,
  title: "NoSQL: When Relational Stops Fitting",
  blocks: [
    {
      type: "text",
      html: `<p>The 2000s brought a problem that relational databases hadn't been designed for: internet scale. When Google needed to index the web, Amazon needed to serve product pages to millions of simultaneous shoppers, and Facebook needed to store social connections for a billion people, the relational model started to crack.</p>
<p>The response was a family of databases that prioritized horizontal scaling and schema flexibility over the relational model's consistency guarantees. The umbrella term became <strong>NoSQL</strong>, which, confusingly, doesn't mean "no SQL ever." It means "not only SQL", an acknowledgment that SQL-shaped thinking is one tool among several.</p>
<p>There are four NoSQL subtypes:</p>`,
    },
    {
      type: "interactive",
      component: "NoSQLTypesGrid",
      caption: "",
    },
    {
      type: "interactive",
      component: "DatabaseDecisionFramework",
      caption: "Practice applying the four-rule framework. Each scenario contains a signal — identify it and pick the right storage pattern.",
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
