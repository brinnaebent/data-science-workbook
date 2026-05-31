import type { Section } from "@brinnaebent/workbook";

const textFeatures: Section = {
  id: "text-features",
  number: 6,
  title: "Feature Engineering for Text",
  blocks: [
    {
      type: "text",
      html: `<p>Text gets a full preprocessing pipeline before anything enters a model. Each step is a decision that affects what signal the model can see.</p>
<p><strong>The standard pipeline:</strong></p>
<ol>
<li><strong>Tokenization.</strong> Split text into substrings — primarily on whitespace and punctuation. Choose your strategy (word, subword, character) based on your task and vocabulary size.</li>
<li><strong>Stop word removal.</strong> Drop common, low-information words ("the," "and," "is"). Optional — sometimes stop words carry information you want to preserve (e.g., negations like "not").</li>
<li><strong>Lemmatization or stemming.</strong> Reduce words to their root forms ("running" → "run"). Lemmatization (dictionary-based, produces real words) is more accurate. Stemming (suffix-chopping) is faster and cruder.</li>
<li><strong>Vector representation.</strong> Convert tokens to numbers the model can use.</li>
</ol>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The Vector Representation Spectrum",
      html: `<ul>
<li><strong>Bag of Words (BoW).</strong> Count occurrences of each word per document. Ignores order. Sparse, interpretable, effective for simple tasks. Loses all context and syntax.</li>
<li><strong>TF-IDF.</strong> Weighs term frequency by inverse document frequency — rare, informative words are up-weighted; common words are down-weighted. Better signal-to-noise than raw counts.</li>
<li><strong>Word2Vec embeddings.</strong> Dense vectors learned from context. Semantic neighbors cluster together. Single fixed vector per word — no context sensitivity.</li>
<li><strong>Contextual embeddings (BERT, transformers).</strong> The vector for "bank" in "river bank" differs from "bank account." Context-sensitive, expensive to compute, dramatically more powerful for most NLP tasks.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "The Shift That Changed Everything",
      html: `<p>The transition from TF-IDF → Word2Vec → BERT → transformer-based models is one of the most dramatic methodological revolutions in any field. For your own projects: use TF-IDF when you need fast, interpretable, low-compute features; use contextual embeddings when you need maximum accuracy and can afford the compute.</p>`,
    },
    {
      type: "interactive",
      component: "TextVectorizer",
      caption: "Placeholder: interactive text vectorizer — paste a sentence and see BoW, TF-IDF, and embedding representations side by side.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "ds-fe-text-q1",
      kind: "mc",
      question: "You're building a spam classifier for email. Which representation is most appropriate given that you have 100,000 labeled emails and a single CPU?",
      options: [
        {
          label: "TF-IDF — fast, effective for keyword-driven classification, and works well on CPU without GPUs",
          correct: true,
          explanation: "Correct. Spam detection is largely keyword-driven (certain words are strong signals regardless of context). TF-IDF captures this well, trains in seconds on a CPU, and produces an interpretable model where you can inspect which words drive the spam score. Contextual embeddings would be overkill: slower, GPU-hungry, and unlikely to provide meaningful accuracy gains for this task.",
        },
        {
          label: "Contextual embeddings (BERT) — they always outperform simpler methods",
          correct: false,
          explanation: "BERT outperforms simpler methods on many NLP tasks — but not always, especially for keyword-driven tasks like spam detection. BERT also requires a GPU for practical use, runs far slower than TF-IDF, and introduces significant complexity. The right tool depends on the task and constraints.",
        },
        {
          label: "Character-level tokenization with a Bag of Words — avoids stop word decisions",
          correct: false,
          explanation: "Character-level BoW loses word structure and produces very high-dimensional, noisy representations. It would work poorly compared to word-level TF-IDF for email classification. Avoiding stop word decisions isn't worth the representation quality loss.",
        },
      ],
    },
  ],
};

export default textFeatures;
