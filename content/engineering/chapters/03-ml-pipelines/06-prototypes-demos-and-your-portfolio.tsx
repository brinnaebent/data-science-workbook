import type { Section } from "@brinnaebent/workbook";

const prototypesDemosAndYourPortfolio: Section = {
  id: "prototypes-demos-and-your-portfolio",
  number: 6,
  title: "Prototypes, Demos, and Your Portfolio",
  blocks: [
    {
      type: "text",
      html: `<p>Five years ago, "deploy a demo" wasn't on a data scientist's job description. You'd show a slide deck with plots. People would nod. The meeting would end.</p>
<p>Something changed after ChatGPT. Stakeholders started expecting to <em>touch</em> what you built — to type a query into a search box and see the results, to adjust a slider and watch the output change, to actually interact with the model rather than passively receive a presentation about it. This expectation has propagated down from executive demos into technical reviews, internship portfolios, and hiring decisions.</p>
<p>Building a working demo is now a real, increasingly non-negotiable data science skill. It's also the single highest-return-on-time investment you can make for your career right now. A recruiter who clicks through your deployed app and sees it work will remember you in a way that a bullet point on a resume cannot match.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Five Frameworks, One Decision",
      html: `<table>
<thead><tr><th>Framework</th><th>Language</th><th>Best for</th><th>Deploy on</th></tr></thead>
<tbody>
<tr><td><strong>Streamlit</strong></td><td>Python</td><td>Fastest path from model to interactive demo — write Python, get a web app</td><td>Streamlit Community Cloud (free), Hugging Face Spaces</td></tr>
<tr><td><strong>Gradio</strong></td><td>Python</td><td>ML-specific demos, especially anything on Hugging Face; excellent for image/audio/text model showcases</td><td>Hugging Face Spaces (free)</td></tr>
<tr><td><strong>Flask</strong></td><td>Python</td><td>Custom backends with full control — when Streamlit's layout isn't enough</td><td>Any Python host, Docker, cloud VM</td></tr>
<tr><td><strong>Next.js (React)</strong></td><td>JavaScript</td><td>Polished, production-grade web applications; what you'd build if this were a real product</td><td>Vercel (free for personal projects)</td></tr>
<tr><td><strong>Progressive Web App (PWA)</strong></td><td>JS/HTML/CSS</td><td>Mobile-first experiences that install like native apps without an app store</td><td>Any web host</td></tr>
</tbody>
</table>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "How to Choose",
      html: `<ul>
<li><strong>Tight timeline, Python-only?</strong> Streamlit or Gradio. You'll have something deployed and shareable in under an hour.</li>
<li><strong>Want unique, polished design?</strong> Flask with a frontend, or Next.js if you're comfortable with JavaScript.</li>
<li><strong>Mobile-first user experience?</strong> PWA. Bypasses app stores, works offline, installs on the home screen.</li>
<li><strong>This is a real product someone will rely on?</strong> Next.js. It's what Notion, Twilio, eBay, and The Washington Post run — built for production scale.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Zero-Cost Portfolio Stack",
      html: `<p>Here's a complete portfolio architecture that costs nothing to run:</p>
<ol>
<li><strong>Model</strong> — trained in a notebook, saved to a file (pickle, ONNX, or a model registry).</li>
<li><strong>Demo</strong> — wrapped in a Streamlit app and deployed to Hugging Face Spaces. Free, public, shareable via URL.</li>
<li><strong>Personal site</strong> — built in Next.js, deployed on Vercel. Free for personal projects. Links to your demos, projects, and writing.</li>
<li><strong>Blog posts / case studies</strong> — written in markdown, rendered by your Next.js site. Explains the model, the data, the decisions you made.</li>
</ol>
<p>Total monthly cost: zero. Total recruiter impact: meaningful. Build it now, before you graduate, and update it with every project this program gives you.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Streamlit Is for Demos, Not for Products",
      html: `<p>Streamlit is a remarkable tool for rapidly demonstrating an idea. It is not an appropriate foundation for a system that other people depend on — it wasn't designed for multi-user production traffic, fine-grained access control, or complex UI state. If a stakeholder sees your Streamlit demo and asks "can we roll this out to our 200 sales reps?", the answer is "we need to rebuild this on a proper backend." Say it early; it's not a failure of the demo.</p>`,
    },
    {
      type: "interactive",
      component: "StreamlitLab",
      caption: "A guided lab: take a pre-trained model, wrap it in a Streamlit app, and deploy it. You'll have a live URL at the end.",
      props: {},
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
