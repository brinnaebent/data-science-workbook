import type { Section } from "@brinnaebent/workbook";

const userDataAndApps: Section = {
  id: "user-data-and-apps",
  number: 3,
  title: "User Data and User-Generated Apps",
  blocks: [
    {
      type: "text",
      html: `<p><strong>User data</strong> is what you get when you instrument an existing product. Classic examples include the <strong>MovieLens</strong> dataset, the <strong>Netflix Prize</strong> dataset, the <strong>Amazon Product</strong> dataset, and Microsoft's <strong>MIND</strong> dataset. The advantages are powerful: user data reflects actual behavior (not what people say they do), it's granular, and it's continuous as long as users keep using the platform.</p>
<p>The limitations are serious: <strong>no existing users means no user data</strong> (a chicken-and-egg problem for startups); ethical and legal considerations around consent apply; and your user base is not the general population.</p>`,
    },
    {
      type: "interactive",
      component: "SignalSpy",
      caption: "Interact with the page to see the different data that can be collected when you interact with a website.",
    },
    {
      type: "text",
      html: `<p><strong>Web apps for data collection</strong> are a related but distinct approach. Instead of collecting data from existing users of an existing product, you <em>build</em> an app specifically to collect data for a research project. The advantages: customization, accessibility from any device, and real-time analysis. The limitations: you have to build it, users must actively engage, and you take on a security responsibility for whatever data you collect.</p>
<p>For rapid prototyping, <strong>Streamlit</strong> or <strong>Gradio</strong> let you spin up data collection apps in Python quickly. Pair them with a cloud bucket (S3, GCS, or Azure Blob) for storage and host on Streamlit Cloud, Hugging Face Spaces, or Vercel.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Building the Collection Tool Is Part of the Project",
      html: `<p>Some of the best student projects I've seen involved building a polished web app, using it to collect a nice dataset, and then turning around and using that dataset to power the actual model. The "data collection" step and the "model" step are not separate — they inform each other. Building a tool to collect your own data is often the fastest path to a strong portfolio project.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-sourcing-userdata-q1",
      kind: "mc",
      question: "A startup wants to build a recommendation model. They plan to train it on user behavior data collected from their app. What is the most significant risk with this approach?",
      options: [
        {
          label: "Their user base may not represent the broader population the model will eventually serve",
          correct: true,
          explanation: "Correct. Early adopters and existing users are rarely representative of the general population. A recommendation model trained on tech-savvy early adopters may behave poorly when the product scales to mainstream users. This is a systematic representativeness issue, not a data quality issue.",
        },
        {
          label: "User data is always lower quality than survey data",
          correct: false,
          explanation: "Not true — user data often captures actual behavior rather than self-reported behavior, which can be higher quality in important ways. The risk is representativeness, not inherent quality.",
        },
        {
          label: "Collecting user data always requires an IRB protocol",
          correct: false,
          explanation: "IRB applies to academic research involving human subjects. Commercial user analytics typically operates under terms of service and privacy policy agreements, not IRB review. The requirements differ by context.",
        },
      ],
    },
  ],
};

export default userDataAndApps;
