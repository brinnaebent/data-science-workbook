import type { Section } from "@brinnaebent/workbook";

const whyThisChapterMatters: Section = {
  id: "why-this-chapter-matters",
  number: 1,
  title: "Why This Chapter Matters",
  blocks: [
    {
      type: "text",
      html: `<p>In 2023, Detroit police used facial recognition technology to falsely identify Portia Woodruff as a carjacking suspect. She was arrested while eight months pregnant, for a crime she did not commit. When her lawyers asked why the model had identified her, the answer was: they couldn't say. The model had simply produced an output. The team that deployed it could not explain why.</p>`,
    },
    {
      type: "text",
      html: `<p>A recent study by Sorokovikova, et al., showed that all tested LLMs exhibited perceived gender bias when providing recommendations for salary negotiation. The only difference in the prompt was the name on the provided resume -- either a female presenting name or a male presenting name!</p>`,
    },
    {
      type: "image",
      src: "/data-storytelling/salary.png",
      alt: "Chart showing gender bias in LLM salary negotiation recommendations",
      width: "50%",
      caption: `<a href="https://arxiv.org/pdf/2506.10491" target="_blank" rel="noopener noreferrer">[Source]</a>`,
    },

    {
      type: "text",
      html: `<p>Recruitment, finance, and healthcare are real high-stakes domains actively using AI tools. The patterns these examples describe are not fictional. They have happened. They will happen again. Building AI tools means accepting some responsibility for outcomes like these — and this chapter is about giving you the vocabulary and frameworks to handle that responsibility.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-ethics-why-q1",
      kind: "mc",
      question: "A facial recognition system misidentifies a person, leading to their wrongful arrest. The engineering team says 'the model just did what it was trained to do.' Why is this insufficient as a response?",
      options: [
        {
          label: "The team that deploys a model bears responsibility for its real-world outcomes, not just its training behavior",
          correct: true,
          explanation: "Correct. 'The model did what it was trained to do' describes a mechanism, not a moral justification. Engineers make choices about what data to train on, what to optimize for, what to deploy, and what safeguards to include. Those choices have consequences for real people. Abdicating responsibility to 'the model' ignores the human decisions that created and deployed it.",
        },
        {
          label: "The response is sufficient — if the model behaved as designed, the engineers did their job",
          correct: false,
          explanation: "The design itself is the problem. A system that misidentifies people and leads to wrongful arrests is not doing its job well, regardless of whether it's doing what it was designed to do. The design choices — training data, evaluation criteria, deployment context — are the engineers' responsibility.",
        },
        {
          label: "The response is insufficient only if the team didn't test the model before deployment",
          correct: false,
          explanation: "Testing is necessary but not sufficient. A model can pass standard benchmarks while still having systematic failure modes for specific populations (as facial recognition does, with well-documented accuracy gaps by race and gender). The responsibility extends beyond testing to the design of the system and the decision to deploy it.",
        },
      ],
    },
  ],
};

export default whyThisChapterMatters;
