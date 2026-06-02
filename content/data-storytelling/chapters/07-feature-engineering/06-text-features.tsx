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
      type: "text",
      html: `<h3>Tokenization</h3>
      <p>The first step in any text --> number conversion is tokenization. Tokenization splits a string into substrings. The default is to split on whitespace and punctuation:</p>
 
        <blockquote>"Which class is the best class at Duke? Deep Learning Applications."</blockquote>
        <p>becomes</p>
        <blockquote><code>['Which', 'class', 'is', 'the', 'best', 'class', 'at', 'Duke', '?', 'Deep', 'Learning', 'Applications', '.']</code></blockquote>
        <br>
        <p>You can also tokenize by sentence (useful for long documents you want to summarize one sentence at a time), by <strong>subword</strong> (the modern default — <code>tokenization</code> → <code>['token', 'ization']</code>), or by character (rarely useful, but possible).</p>`,
    },
    {
      type: "interactive",
      component: "TokenizerPlayground",
      caption: "Type any sentence and compare word-level, subword, and character-level tokenization side by side.",
      props: {},
    },
    {
      type: "text",
      html: `<h3>Stop Word Removal</h3>
        <p>Many common words — <em>the, of, and, is</em> — appear so frequently that they swamp the signal in your features. Stop word removal drops them so the model can focus on what carries meaning.</p>
        <p>NLTK ships with a default English stop word list, but you can absolutely add to it. If you're classifying product reviews, the word "product" is technically informative but in practice useless, since it appears in every document. Add it.</p>
        <p>Apply stop word removal to our example tokens and watch what gets stripped:</p>`,
    },
    {
      type: "interactive",
      component: "StopWordVisualizer",
      caption: "Tokens struck through in red are NLTK stop words. The filtered list keeps only content-bearing words.",
      props: {},
    },
    {
      type: "text",
      html: `<h3>Stemming vs. Lemmatization</h3>
        <p>The words <em>branch, branches, branching, branched</em> all refer to roughly the same concept. We'd like to collapse them.</p>
        <ul>
          <li><strong>Stemming</strong> chops off suffixes mechanically. <em>changes, changed, changing</em> → <code>chang</code>. Not a real word. Doesn't matter — it's a feature, not a noun. Fast, crude.</li>
          <li><strong>Lemmatization</strong> uses a dictionary to map each form to a canonical root. <em>is, am, were</em> → <code>be</code>. <em>changes</em> → <code>change</code>. Slower, but the output is always a real word.</li>
        </ul>
        <p>If you're throwing together a quick keyword classifier on millions of documents, stem. If you care about interpretability or accuracy, lemmatize.</p>`,
    },
    {
      type: "interactive",
      component: "StemmingLemmatizationDemo",
      caption: "Type any text and see Porter stemming vs. WordNet lemmatization side by side. Highlighted tokens changed from their original form.",
      props: {},
    },
    {
      type: "text",
      html: `<h3>Embedding Models</h3>
        <p>Over the decades, we have experimented with many modeling techniques to turn tokens of words into numbers. From Bag of Words to Word2Vec to modern transformer approaches, you will cover these in great detail in Deep Learning. For now, we will abstract away the architectures and focus on the concepts. Embedding models are neural network based models that allow us to take words and convert them into numbers. Attention-based embedding models enable us to do this extremely well due to the attention mechanism (you will also learn a lot more about this later).</p>`,
    },
    {
      type: "interactive",
      component: "Word2VecVisualizer",
      caption: "Explore a pretrained Word2Vec embedding space. Word2Vec is a simple but powerful neural-network based embedding model. Search for a word and see its nearest neighbors. Try words with multiple meanings.",
      props: {},
    },
    {
      type: "callout",
      variant: "info",
      title: "The Vector Representation Spectrum",
      html: `<ul>
<li><strong>Bag of Words (BoW).</strong> Count occurrences of each word per document. Ignores order. Sparse, interpretable, effective for simple tasks. Loses all context and syntax.</li>
<li><strong>TF-IDF.</strong> Weighs term frequency by inverse document frequency — rare, informative words are up-weighted; common words are down-weighted. Better signal-to-noise than raw counts.</li>
<li><strong>Word2Vec embeddings.</strong> Dense vectors learned from context. Semantic neighbors cluster together. Single fixed vector per word — no context sensitivity.</li>
<li><strong>Contextual embeddings (BERT, transformers).</strong> The vector for "bank" in "river bank" differs from "bank account." Context-sensitive, expensive to compute, more powerful for most NLP tasks.</li>
</ul>`,
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
