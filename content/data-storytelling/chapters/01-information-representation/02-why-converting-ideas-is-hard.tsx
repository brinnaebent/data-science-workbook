import type { Section } from "@brinnaebent/workbook";

const whyConvertingIdeasIsHard: Section = {
  id: "why-converting-ideas-is-hard",
  number: 2,
  title: "Why Converting Ideas Into Numbers Is Hard",
  blocks: [
    {
      type: "text",
      html: `<p>While there are advantages to numerical representation, there are also major gaps. Whenever you convert a concept into a representation, it is a lossy process.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Subjectivity",
      html: `<p>Your "red" is not my "red." Ideas vary from person to person, and no encoding scheme can paper over that.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Complexity",
      html: `<p>A photograph of your grandmother contains an enormous amount of information. Every encoding throws some of it away.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Ambiguity",
      html: `<p>Any encoding requires assumptions. Your assumptions might not match the next person's.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Context Dependence",
      html: `<p>"Bank" means something different in "river bank" vs. "bank account." Encoding meaning without context is nearly impossible.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Creative and Emotional Aspects",
      html: `<p>Try writing a number that captures "how moving this song is." Whatever you write, someone will disagree.</p>`,
    },
    {
      type: "text",
      html: `<p>These are not solved problems. Every encoding choice you make is a tradeoff between fidelity and tractability. The rest of this chapter is about how to make those tradeoffs sensibly for each major data type you'll encounter.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Why LLMs Still Fail",
      html: `<p>The reason large language models are so impressive is not that they "understand" language. They don't. What they do is approximate a very high-dimensional numeric representation of language patterns — billions of parameters' worth — that captures enough of the nuance to be useful. The reason these models still occasionally fail in funny or troubling ways is that the underlying problem from this section is unsolved. Subjectivity, ambiguity, and context dependence are still there, just buried under a lot of compute.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-info-rep-hard-q1",
      kind: "mc",
      question: "Which of these best explains why encoding 'color' for a machine learning model is genuinely difficult, even though color seems simple?",
      options: [
        {
          label: "Color perception is subjective and context-dependent — 'red' means different things to different people and in different lighting",
          correct: true,
          explanation: "Correct. Color is both subjective (different observers perceive it differently) and context-dependent (the same RGB value looks different next to different surrounding colors). A number like '255,0,0' captures the RGB coordinates but loses all of that nuance.",
        },
        {
          label: "Computers can only store integers, so continuous color values can't be represented",
          correct: false,
          explanation: "Computers can represent continuous values using floating-point numbers. The difficulty with color isn't storage precision — it's the gap between a number and what it means to a perceiver.",
        },
        {
          label: "There aren't enough numbers in binary to cover all possible colors",
          correct: false,
          explanation: "A standard 24-bit RGB encoding gives over 16 million distinct colors, which far exceeds human color discrimination. The difficulty is conceptual, not numerical.",
        },
      ],
    },
    {
      type: "checkpoint",
      id: "ds-info-rep-hard-reflect",
      kind: "reflective",
      question: "Think of a concept that would be especially hard to encode as numbers — something you care about or interact with regularly. What makes it hard? Which of the five difficulties (subjectivity, complexity, ambiguity, context dependence, creative/emotional aspects) applies?",
      sampleAnswer: "Music genre is a good example: it involves subjectivity (people disagree on whether a song is 'jazz' or 'soul'), context dependence (the same song can feel different genres in different eras), and creative aspects (genre categories themselves shift over time). You could encode it as a one-hot vector over genre labels, but you'd be projecting a continuous, contested space onto a discrete grid.",
    },
  ],
};

export default whyConvertingIdeasIsHard;
