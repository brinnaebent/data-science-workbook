import type { Section } from "@brinnaebent/workbook";

const whatStatisticsBuysYou: Section = {
  id: "what-statistics-buys-you",
  number: 1,
  title: "What Statistics Buys You",
  blocks: [
    {
      type: "text",
      html: `<p>Whether you are a data scientist, a research engineer, an ML Engineer, an AI engineer, or some title that has yet to be invited, your job will surely have some science in it. And science means hypotheses, experiments, evidence, and the discipline of saying "I'm not sure" when you're not sure. Statistics is the language we use to do that work honestly.</p>
<p>Here's something worth sitting with: across careers in this field, statistics is almost always the differentiator. Not the most fashionable framework, not the latest model architecture — statistics. The colleagues who could think clearly about a hypothesis, design an experiment, and tell you whether a result actually meant anything were the ones whose work held up. They were often the only ones in the room who could do it.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Three Places Statistics Shows Up in Your Work",
      html: `<ul>
<li><strong>Data analysis:</strong> Before you train a single model, you're computing means, standard deviations, distributions, and outliers. Statistical descriptions are the language of exploratory data analysis.</li>
<li><strong>Hypothesis testing:</strong> Every claim — "this model is better," "this feature matters," "Group A behaves differently than Group B" — is a statistical claim. There are rigorous ways to make them and sloppy ways. This unit is about the rigorous way.</li>
<li><strong>Model evaluation:</strong> "The number went up" is not the same as "the number went up <em>meaningfully</em>." Statistics is what makes that distinction concrete.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>This unit is partly remedial — most of you have seen some of this before — and partly transformative. We're going to take statistics seriously as a <em>practical</em> tool for the work you'll actually do: shipping models, running experiments, justifying decisions, and answering the question that gets asked in every meeting you'll ever attend, which is "how do we know?"</p>
<p>A few notes on how this unit is built:</p>
<ul>
<li><strong>It's practical first.</strong> Deep-theory statistics courses exist and are worth taking. This isn't one of them. We stay close to the questions you'll be asked at work.</li>
<li><strong>Real-world consequences anchor everything.</strong> Almost every chapter ends with concrete applications. If you can't picture <em>using</em> the concept, you don't really have it yet.</li>
<li><strong>Code is part of the curriculum.</strong> Python — particularly <code>scipy.stats</code>, <code>statsmodels</code>, and <code>imbalanced-learn</code> — handles most of the heavy computation. We'll point you to the libraries where they matter.</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "stats-ch1-s1-q1",
      kind: "mc",
      question: "A junior data scientist says: 'The accuracy of our new model is 94% — that's higher than the old model's 93%, so we should ship it.' What's the most important thing missing from this argument?",
      options: [
        {
          label: "The dataset might be too small",
          correct: false,
          explanation: "Sample size matters, but it's not the core gap here. The claim needs statistical reasoning regardless of dataset size.",
        },
        {
          label: "There is no assessment of whether the 1% difference is statistically or practically meaningful",
          correct: true,
          explanation: "Correct. A 1-point accuracy difference could be noise, a seasonal fluctuation, or a real improvement — you can't tell without statistical testing. This is exactly what hypothesis testing and confidence intervals are for.",
        },
        {
          label: "Accuracy is not a valid metric",
          correct: false,
          explanation: "Accuracy can be a valid metric for balanced problems. The issue isn't the metric choice — it's the lack of statistical rigor in interpreting the difference.",
        },
        {
          label: "The models should be compared on more metrics",
          correct: false,
          explanation: "More metrics can be useful, but the core problem is that even this one metric comparison lacks any statistical assessment of whether the observed gap is meaningful.",
        },
      ],
    },
  ],
};

export default whatStatisticsBuysYou;
