import type { Section } from "@brinnaebent/workbook";

const text: Section = {
  id: "text",
  number: 7,
  title: "Text",
  blocks: [
    {
      type: "text",
      html: `<p>In computer vision, every pixel cleanly converts into three numbers: red, green, blue. Language is a little harder to convert into numbers...</p>

        <p>Consider the word <strong>bank</strong>.</p>
        <ul>
          <li><em>"bank of the river"</em> — a little hill next to a river.</li>
          <li><em>"deposited money at the bank"</em> — a financial institution.</li>
        </ul>
        <p>Same string of four letters, completely different meaning. Ideally we want to represent these as <em>different numbers</em>, because they really are different things. This is the <strong>homonym problem</strong>, and it's everywhere in language.</p>
        <p>Now flip it. "Sneakers," "running shoes," and "tennis shoes" all refer to the same physical object in everyday speech. <strong>Synonym problem.</strong> How do we encode them in a way that captures that they mean the same thing without manually building a thesaurus?</p>
        <p>And then there's the fact that observations are not independent. "The dog ate the bone. It tasted good." What is "it"? You can only answer because you read the previous sentence. <strong>History matters.</strong></p>`,
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
      type: "article",
      href: "https://projector.tensorflow.org/",
      imageSrc: "/data-storytelling/tf-projector.png",
      imageAlt: "TensorFlow Embedding Projector",
      publisher: "TensorFlow",
      title: "Embedding Projector",
      excerpt: "Visualize high-dimensional data — explore word embeddings in 2D and 3D using PCA, t-SNE, and UMAP.",
      ctaLabel: "Open tool",
    },
    {
      type: "image",
      src: "/data-storytelling/laion.jpeg",
      alt: "UMAP of LAION-Aesthetics",
      caption: `All 12M captions from LAION-Aesthetics with score > 6, embedded with CLIP and UMAP'ed to 2d. Color is the domain of the image URL. <a href="https://x.com/clured/status/1565399157606580224/photo/1" target="_blank" rel="noopener noreferrer">[Source]</a>`
    },
    {
      type: "checkpoint",
      id: "ds-info-rep-text-q1",
      kind: "mc",
      question: "Word2Vec assigns a vector to each word. What property of those vectors makes them useful for downstream ML tasks?",
      options: [
        {
          label: "Semantically similar words end up close together in the vector space, so the model can reason about meaning geometrically",
          correct: true,
          explanation: "Correct. Word2Vec learns vectors such that words used in similar contexts end up near each other. This means 'doctor' and 'physician' are close, and the direction from 'king' to 'queen' is similar to the direction from 'man' to 'woman'. The geometry encodes semantic relationships.",
        },
        {
          label: "Each vector is a count of how many times the word appeared in the training corpus",
          correct: false,
          explanation: "That's Bag of Words, not Word2Vec. Word2Vec produces dense, fixed-length vectors learned from context — not raw counts.",
        },
        {
          label: "Contextual embeddings like Word2Vec generate different vectors for the same word depending on context",
          correct: false,
          explanation: "Word2Vec assigns a single fixed vector to each word regardless of context. It's contextual embeddings (BERT, transformers) that generate context-dependent vectors. This is a common confusion — and an important distinction.",
        },
      ],
    },
  ],
};

export default text;
