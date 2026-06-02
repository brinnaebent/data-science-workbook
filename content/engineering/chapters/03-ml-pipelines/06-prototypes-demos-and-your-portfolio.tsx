import type { Section } from "@brinnaebent/workbook";

const prototypesDemosAndYourPortfolio: Section = {
  id: "prototypes-demos-and-your-portfolio",
  number: 6,
  title: "Prototypes, Demos, and Your Portfolio",
  blocks: [
    {
      type: "text",
      html: `<p>Five years ago, "deploy a demo" wasn't on a data scientist's job description. You'd show a slide deck with plots during a meeting.</p>
<p>Something changed after ChatGPT. Stakeholders started expecting to <em>interact with</em> what you built — to type a query into a search box and see the results, to adjust a slider and watch the output change, to actually interact with the model rather than passively receive a presentation about it. This expectation has propagated down from executive demos into technical reviews, internship portfolios, and hiring decisions.</p>
<p>Building a working demo is now a real, increasingly non-negotiable data science skill. It's also the single highest-return-on-time investment you can make for your career right now. A recruiter who clicks through your deployed app and sees it work will remember you in a way that a bullet point on a resume cannot match.</p>`,
    },
    {
      type: "interactive",
      component: "DemoFrameworksGrid",
      caption: "",
      props: {},
    },
    {
      type: "interactive",
      component: "StreamlitLab",
      caption: "",
      props: {},
    },
    {
      type: "callout",
      variant: "warning",
      title: "Streamlit Is for Demos, Not for Products",
      html: `<p>Streamlit is a remarkable tool for rapidly demonstrating an idea. It is not an appropriate foundation for a system that other people depend on — it wasn't designed for multi-user production traffic, fine-grained access control, or complex UI state.</p>`,
    },
    {
      type: "reflection",
      id: "eng-ch3-s6-r1",
      question: "Think about the projects you've done in this program so far. Pick one and design a demo for it. What framework would you use? What would a user be able to do with it? What would you need to build that you don't currently have?",
      sampleAnswer: "A good answer identifies a specific project (e.g., a classification model from the statistics unit), proposes a framework appropriate to the timeline and audience (Streamlit for speed, Next.js for polish), describes a concrete user interaction (upload an image, adjust a threshold, see the predicted class and confidence), and honestly identifies what's missing (a saved model artifact, a requirements.txt, a cloud account for deployment). The last part is where most students discover the gap between 'notebook that works' and 'app someone can use.'",
    },
  ],
};

export default prototypesDemosAndYourPortfolio;
