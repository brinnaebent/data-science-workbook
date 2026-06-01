import type { Section } from "@brinnaebent/workbook";

const vectorDatabasesAndRAG: Section = {
  id: "vector-databases-and-rag",
  number: 5,
  title: "Vector Databases and RAG",
  blocks: [
    {
      type: "text",
      html: `<p>Five years ago, "vector database" didn't exist as a product category. Today it's in every AI job description. Understanding why requires understanding what embeddings are — and that's worth doing carefully, because the concept is genuinely elegant.</p>
<p>A <strong>vector embedding</strong> is a list of real numbers that represents a piece of content — a word, a sentence, an image, an audio clip — in a high-dimensional space. The magic property is this: <strong>semantic similarity becomes geometric proximity.</strong> Things that mean similar things end up near each other in that space.</p>
<p>The classic demonstration comes from word2vec, an embedding model trained on text in 2013. If you take the vector for "king," subtract the vector for "man," and add the vector for "woman," you get a vector that is closest to "queen." The arithmetic literally encoded that cultural relationship:</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Embedding Arithmetic",
      html: `<p>$$\\vec{\\text{king}} - \\vec{\\text{man}} + \\vec{\\text{woman}} \\approx \\vec{\\text{queen}}$$</p>
<p>This works because embeddings are trained to place words used in similar contexts near each other. "King" and "queen" appear in similar sentence structures; so do "man" and "woman." The difference vector encodes the concept of gender, and adding it shifts you from the male-royalty cluster to the female-royalty cluster.</p>`,
    },
    {
      type: "text",
      html: `<p>Modern embeddings come out of transformer models. OpenAI's <code>text-embedding-3-small</code> produces 1,536-dimensional vectors; the large model produces 3,072. Open-source alternatives often produce 768. Whatever the dimensionality, the storage problem is the same: you need a database that can hold millions of these vectors and answer the question "find me the $k$ most similar to this query vector" in milliseconds.</p>
<p>That's what <strong>vector databases</strong> do. Pinecone, Weaviate, Milvus, Chroma, and the pgvector extension for Postgres all implement some variant of approximate nearest-neighbor search — an algorithm that finds the $k$ closest vectors without comparing against every vector in the database.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Nearest-Neighbor Search",
      html: `<p>The similarity metric most commonly used is <strong>cosine similarity</strong> — the cosine of the angle between two vectors:</p>
<p>$$\\text{similarity}(\\mathbf{a}, \\mathbf{b}) = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\|\\mathbf{a}\\| \\|\\mathbf{b}\\|}$$</p>
<p>A value of 1 means the vectors point in the same direction (maximally similar). A value of 0 means they're perpendicular (orthogonal/unrelated). A value of −1 means they point in opposite directions.</p>
<p>Algorithms like HNSW (Hierarchical Navigable Small World graphs) and IVFFlat allow approximate nearest-neighbor search at scale — finding the $k$ closest vectors quickly without an exhaustive scan.</p>`,
    },
    {
      type: "text",
      html: `<p>The most important application of vector storage right now is <strong>Retrieval-Augmented Generation (RAG)</strong>. If you've used an "AI chatbot for our docs" product — a customer support bot, a document Q&A system, an internal knowledge assistant — you've almost certainly used RAG. Here's the pattern:</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The RAG Pattern",
      html: `<ol>
<li>Take your private knowledge base — your company's docs, your product catalog, your internal wiki — and split it into chunks.</li>
<li>Embed each chunk into a vector using an embedding model. Store the vectors in a vector database alongside the original text.</li>
<li>When a user asks a question, embed <em>the question</em> with the same model.</li>
<li>Query the vector database: find the $k$ chunks most similar to the question vector.</li>
<li>Stuff those chunks into the LLM prompt as context: "Given the following documents, answer the question..."</li>
<li>The LLM answers — grounded in <em>your</em> data, not its training data.</li>
</ol>
<p>Why does this matter? LLMs are trained on public data with a knowledge cutoff. They don't know what's in your internal docs, your proprietary research, or anything that happened after their training ended. RAG solves this without fine-tuning, at a fraction of the cost.</p>`,
    },
    {
      type: "image",
      src: "/images/engineering/rag-architecture.png",
      alt: "Diagram of a RAG system: documents are embedded and stored in a vector database; at query time, the question is embedded, nearest neighbors are retrieved, and results are passed to an LLM",
      caption: "A RAG system has two phases: an offline indexing phase (embed and store) and an online retrieval phase (embed the query, find neighbors, augment the LLM prompt).",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Bottleneck Is the Vector Database, Not the LLM",
      html: `<p>After building multiple RAG systems, the consistent finding is: the quality of answers is almost entirely determined by the quality of what's in the vector database. A powerful LLM can't answer a question if the relevant chunk wasn't retrieved. If the chunking strategy is wrong, if the embedding model doesn't capture the domain well, or if the retrieval step returns irrelevant context — the LLM will hallucinate or hedge. Invest in the data layer, not just the model layer.</p>`,
    },
    {
      type: "interactive",
      component: "EmbeddingPlayground",
      caption: "Type two phrases and see their cosine similarity. Watch the score rise as the phrases become semantically closer.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "eng-ch1-s5-q1",
      kind: "mc",
      question: "A legal tech company wants to build an AI assistant that can answer questions about their clients' specific contracts — documents that were created after any LLM's training cutoff and contain proprietary information that should never leave the company. Which approach best fits this requirement?",
      options: [
        {
          label: "Fine-tune a large language model on the contract documents",
          correct: false,
          explanation: "Fine-tuning requires sending documents to a training provider, potentially violating confidentiality. It also doesn't update dynamically when new contracts are added — you'd need to retrain. Fine-tuning is expensive and inflexible for this use case.",
        },
        {
          label: "Use RAG: embed contracts into a self-hosted vector database, retrieve relevant chunks at query time, and pass them as context to an LLM",
          correct: true,
          explanation: "Correct. RAG keeps the documents on-premises in a vector database the company controls. No contract text needs to leave the company to train the model. New contracts can be indexed immediately. The LLM sees only the retrieved chunk for a given query — not the entire contract corpus.",
        },
        {
          label: "Use a relational database to store contracts and write SQL queries to find relevant clauses",
          correct: false,
          explanation: "SQL is great for structured data with known schemas, but 'find clauses semantically relevant to this question' is a similarity search problem — not a structured query problem. SQL's LIKE operator does text matching, not semantic matching.",
        },
        {
          label: "Ask users to paste the relevant contract excerpt into their query manually",
          correct: false,
          explanation: "This shifts a retrieval problem to the user — who may not know which section is relevant. It's also error-prone and doesn't scale. The whole point of RAG is to automate this retrieval step.",
        },
      ],
    },
  ],
};

export default vectorDatabasesAndRAG;
