import type { Section } from "@brinnaebent/workbook";

const representationIsCompression: Section = {
  id: "representation-is-compression",
  number: 9,
  title: "Representation Is Compression",
  blocks: [
    {
      type: "text",
      html: `<p>Every time you represent something — in a drawing, a word, a number, a file — you are making a decision about what to keep and what to throw away. That is compression.</p><br>
<p>The original thing (a landscape, a face, a song) contains infinite detail. Any representation of it is finite. Something always gets left out. The only question is <em>which</em> details survive the translation.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Lossy vs. Lossless",
      html: `<p>In computing, compression is either <strong>lossless</strong> (the original can be perfectly reconstructed — like a ZIP file) or <strong>lossy</strong> (some information is permanently discarded — like a JPEG or an MP3). Human memory is almost always lossy. So is most real-world data collection.</p>`,
    },
    {
      type: "text",
      html: `<p>This isn't a flaw. It's the point. A map that contains every detail of a city at 1:1 scale is useless — it's just the city again. Compression is what makes information <em>actionable</em>. The data scientist's job is to choose compressions that preserve what matters for the task at hand.</p><br>
<p>Here's a concrete demonstration. You've seen the Starbucks logo hundreds of times. But how much of it actually made it into your memory?</p>`,
    },
    {
      type: "interactive",
      component: "StarbucksMemory",
      caption: "Draw the Starbucks logo from memory, then compare your compressed representation to the original — and to everyone else's.",
      props: {},
    },
    {
      type: "text",
      html: `<p>Notice what happened. You and hundreds of other people encoded the same logo, but each representation was different. Everyone kept the dominant features — green circle, mermaid figure — and dropped the fine details. That's the compression in action: high-frequency visual information (the exact crown shape, the star count, the precise arm position) got filtered out; low-frequency structure (color, rough shape, general subject) was retained.</p><br>
<p>This is exactly what a JPEG does to a photograph. It discards high-frequency detail that is expensive to store and that most viewers won't notice. It keeps the broad strokes. Your visual memory runs the same algorithm.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Compression in Every Data Type",
      html: `<ul>
<li><strong>Text:</strong> A summary compresses a document. A word compresses a concept. An emoji compresses an emotion.</li>
<li><strong>Images:</strong> JPEG compression discards high-frequency pixel variation. Downsampling throws away resolution.</li>
<li><strong>Tabular data:</strong> Binning a continuous variable (age → "20–30") compresses by quantizing. Averaging discards variance.</li>
<li><strong>Models:</strong> A trained model is itself a compression — it encodes statistical patterns from millions of training examples into a fixed number of parameters.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>When you choose a representation for your data, you are choosing a compression scheme. The decision is never neutral. A feature you don't include can't influence your model. A resolution you discard can't be recovered. A category boundary you draw will shape every downstream result.</p><br>
<p>Understanding representation as compression reframes the question. It's not "how do I store this data?" It's "what do I need to preserve — and what am I willing to lose?"</p>`,
    },
    {
      type: "checkpoint",
      id: "ds1-q9-compression",
      kind: "mc",
      question: "A data scientist bins a continuous \"age\" column into ranges like 0–18, 19–35, 36–60, 60+. What kind of compression is this?",
      options: [
        {
          label: "Lossless — the original ages can be reconstructed from the bins",
          explanation: "Once you bin the data, you know someone is in the 19–35 range but not whether they are 22 or 34. The original value is gone.",
        },
        {
          label: "Lossy — exact ages are permanently discarded in favor of categories",
          correct: true,
          explanation: "Binning is lossy compression. You trade precision for simplicity, which can reduce noise or improve interpretability — but the original values cannot be recovered.",
        },
      ],
    },
  ],
};

export default representationIsCompression;
