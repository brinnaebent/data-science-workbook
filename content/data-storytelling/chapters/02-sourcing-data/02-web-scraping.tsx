import type { Section } from "@brinnaebent/workbook";

const webScraping: Section = {
  id: "web-scraping",
  number: 2,
  title: "Web Scraping",
  blocks: [
    {
      type: "text",
      html: `<p>Web scraping is the technique of programmatically extracting data from websites. Famous scraped datasets include <strong>LAION</strong> (images), the <strong>Twitter Sentiment Analysis</strong> dataset, the <strong>Reddit Comment</strong> dataset, the <strong>IMDB Movie</strong> dataset, and the <strong>Wikipedia</strong> dataset. A lot of these have driven enormous research programs.</p>`,
    },
    {
      type: "image",
      src: "/data-storytelling/laion-cat.gif",
      alt: "GIF of images queried from the LAION dataset",
      caption: `Searches over the web-scraped LAION dataset <a href="https://www.deeplearning.ai/the-batch/the-story-of-laion-the-dataset-behind-stable-diffusion" target="_blank" rel="noopener noreferrer">[Source]</a>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Advantages",
      html: `<ul>
<li><strong>Automation.</strong> Gather large amounts of data quickly without ongoing human effort.</li>
<li><strong>Customization.</strong> Target very specific information from specific sources.</li>
<li><strong>Real-time capability.</strong> Scrape continuously to keep data updated.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>For any nontrivial scraping project you'll reach for three Python tools. <strong>Selenium</strong> handles browser automation — essential for JavaScript-rendered pages. <strong>BeautifulSoup</strong> parses the HTML once you have it. <strong>Requests</strong> makes the raw HTTP calls. Most real scraping projects use all three.</p>
<p>What you get for that automation is not necessarily good data. Look at the LAION dataset and search for "cat" — a lot of results don't look much like cats. Bulk scraping gives you <em>a lot</em> of data, not necessarily a lot of <em>good</em> data. Legality is a separate concern that cannot be ignored: scraping may violate a website's terms of service, and websites increasingly block scraping, especially in the generative-AI era.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Check robots.txt and ToS First",
      html: `<p>Before writing any code, check the site's <code>robots.txt</code> file and terms of service. This has been litigated — it is not a theoretical concern. Technical feasibility is irrelevant if you're not allowed to scrape. Legal permission comes first.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "The Foundation of Modern AI — and Its Complications",
      html: `<p>Almost every large language model you've used was trained, at least in part, on web-scraped text. Almost every image generation model was trained on web-scraped images. The quality of those datasets — and the question of who owns what was scraped — is now one of the central legal and ethical questions in the field. If you're going to do meaningful work in this space, you need to understand both the technical and the legal side.</p>`,
    },
    {
      type: "interactive",
      component: "WebScrapingDiagram",
      caption: "Diagram showing the scraping pipeline — HTTP request → HTML parsing → data extraction → storage.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "ds-sourcing-scraping-q1",
      kind: "mc",
      question: "You want to scrape product reviews from an e-commerce site. Before writing any code, what is the single most important thing to check?",
      options: [
        {
          label: "The site's robots.txt file and terms of service",
          correct: true,
          explanation: "Correct. robots.txt specifies which pages can and can't be scraped. The terms of service tells you whether scraping is legally permitted. Violating either can create legal risk — this is not hypothetical; scraping disputes have gone to court.",
        },
        {
          label: "Whether the site uses JavaScript rendering",
          correct: false,
          explanation: "Important technically (you'd need Selenium if so), but you need to answer the legal question first. Technical feasibility is irrelevant if you're not allowed to scrape.",
        },
        {
          label: "How many reviews the site has, to estimate scraping time",
          correct: false,
          explanation: "This is a planning question, not a prerequisite. Check legal permission before estimating scope.",
        },
      ],
    },
  ],
};

export default webScraping;
