import type { Section } from "@brinnaebent/workbook";

const whyComputersSpeakInNumbers: Section = {
  id: "why-computers-speak-in-numbers",
  number: 1,
  title: "Why Computers Speak in Numbers",
  blocks: [
    {
      type: "text",
      html: `<p>How do you, a human, communicate concepts? </p> <br>
     <p> Common answers include language (spoken and written), images (think cave drawings), and even body language. And we are not alone. Whales communicate with songs, dogs with barks, and even the cells in your body send chemical messages to communicate. </p> <br> <p> Computers communicate with numbers. Why? Because of a tiny electrical component that is behind every modern technology: the transistor. Every transistor sits in one of two electrical states — on or off. That maps directly to 0 and 1, making binary the native language of computers (quantum machines aside).</p>`,
    },
    {
      type: "interactive",
      component: "BinaryConverter",
      caption: "Type any text or number and watch it decompose into binary. Each character maps to an ASCII code; each number is stored as powers of 2 summed across 8 bits — one byte.",
      props: {},
    },
    {
      type: "text",
      html: `<p>There are four properties that make numeric representation powerful:</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Universality",
      html: `<p>A face, a sentence, a heartbeat, a click — all can be represented as numbers. One architecture handles every problem.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Efficiency",
      html: `<p>Binary arithmetic maps directly to what electronic circuits do best. The hardware and the encoding are co-designed.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Manipulability",
      html: `<p>You can't easily add two photographs together — but you <em>can</em> add their numeric representations. That's how most image processing works.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Interoperability",
      html: `<p>A file sent from a Mac to a Linux machine just works, because both speak the same numeric foundation.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds1-q1-transistors",
      kind: "mc",
      question: "Why is binary (base-2) the universal language of modern computing?",
      options: [
        {
          label: "Binary arithmetic is easier for humans to learn than decimal",
          explanation: "Binary is actually harder for humans — the advantage is hardware efficiency, not human convenience.",
        },
        {
          label: "Transistors naturally operate in two states, making binary the native language of logic gates and memory cells",
          correct: true,
          explanation: "The physical property of transistors — two stable electrical states — is exactly why all modern computing is built on binary.",
        },
        {
          label: "Binary numbers take up less storage space than decimal",
          explanation: "Binary requires more digits to represent the same value. The advantage is hardware efficiency, not compactness per digit.",
        },
        {
          label: "An international standards body chose binary in the 1950s",
          explanation: "The choice follows from transistor physics, not a committee decision.",
        },
      ],
    },
  ],
};

export default whyComputersSpeakInNumbers;
