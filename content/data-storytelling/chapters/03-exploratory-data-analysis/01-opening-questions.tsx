import type { Section } from "@brinnaebent/workbook";

const openingQuestions: Section = {
  id: "opening-questions",
  number: 1,
  title: "The Questions That Open a Dataset",
  blocks: [
    {
      type: "text",
      html: `<p>The temptation when you get a new dataset is to load it into a notebook, call <code>df.head()</code>, and start fitting models. Don't. Start with questions. EDA begins before you look at an ML model!</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Four Categories of Opening Questions",
      html: `<p><strong>Context questions.</strong> What is the source of the data? Who collected it, how, and when? What are the known biases and limitations? How does this data relate to the problem you're solving? This is the connective tissue between sourcing (Chapter 2) and everything that comes next. </p>
<p><strong>Sampling questions.</strong> Is the dataset representative of the population of interest? Will you need train/validation/test splits? How will you split? Are there subgroups that need separate analysis? If your dataset is 95% from one country but you'll deploy globally, you need to know that now — not after the model is in production.</p>
<p><strong>Structure questions.</strong> What are the dimensions? What are the data types of each variable — numerical, categorical, text, datetime? Are there missing values, and how are they represented?</p>
<p><strong>Quality questions.</strong> Are there duplicates? Inconsistent values? Columns that look numeric but contain strings? Outliers visible even before any statistics are computed?</p>`,
    },
    {
      type: "text",
      html: `<p>Missing values are encoded in more ways than you expect: blank cells, <code>NaN</code>, <code>0</code>, <code>-9999</code>, the empty string <code>""</code>, or a special sentinel the original collector chose. Figuring out what counts as "missing" in your particular dataset is non-trivial — and worth checking before anything else. The wrong assumption here corrupts every downstream step.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Healthcare Null That Wasn't Missing",
      html: `<p>I once worked on a healthcare project where what I assumed were missing values in a column were actually patients who hadn't yet had a particular test. The data wasn't missing — the test wasn't performed yet. Treating those nulls as missing data and imputing them would have been an enormous mistake. The context question — <em>why</em> is this null? — is the question that catches this. In industry, the experienced data scientists spend the most time on context questions and the least time fitting models. The juniors are often the opposite. Be the experienced one.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-eda-questions-q1",
      kind: "mc",
      question: "You receive a dataset and immediately run df.describe() to get summary statistics. What critical information might you be missing?",
      options: [
        {
          label: "Context about who collected the data, how, and what the known limitations are",
          correct: true,
          explanation: "Correct. df.describe() tells you about the numbers — but not why the data exists, what the collection biases are, or what certain values actually mean. A mean of 0.0 in one column might be the actual average, or it might be a sentinel for 'not recorded.' Only context tells you which.",
        },
        {
          label: "The number of rows and columns",
          correct: false,
          explanation: "df.describe() does show count, and df.shape gives you rows × columns. These are structural facts available from the data itself — they're not context.",
        },
        {
          label: "Whether the data has already been cleaned by the previous team",
          correct: false,
          explanation: "This is part of the context question, but it's not the only thing you'd be missing. More fundamentally, you'd be missing everything about why the data was collected, what the sampling strategy was, and what the domain constraints on values should be.",
        },
      ],
    },
  ],
};

export default openingQuestions;
