import type { Section } from "@brinnaebent/workbook";

const pizzaAndHamburgers: Section = {
  id: "pizza-and-hamburgers",
  number: 1,
  title: "A Story About Pizza and Hamburgers",
  blocks: [
    {
      type: "image",
      src: "/stats/imbalance1.png",
      alt: "Training set with six pizza images and two hamburger images illustrating class imbalance",
      width: "50%",
    },
    {
      type: "text",
      html: `<p>Imagine your training set: six images of pizza, two images of hamburgers. You train a model. The reported accuracy is 75%.</p>`,
    },
    {
      type: "image",
      src: "/stats/imbalance2.png",
      alt: "Model predicting pizza for every input regardless of the actual food shown",
      width: "50%",
    },
    {
      type: "text",
      html: `<p>You go to celebrate. Then you actually run the model. You feed it a picture of a pizza — it correctly says "pizza." You feed it a picture of a hamburger — it confidently says "pizza." You feed it a third picture of anything — "pizza."</p>`,
    },
    {
      type: "image",
      src: "/stats/imbalance3.png",
      alt: "Diagram showing 75% accuracy achieved by always predicting the majority class",
      width: "50%",
    },
    {
      type: "text",
      html: `<p>The model has learned exactly one thing: pizza is more common than hamburgers. By predicting "pizza" every single time, it gets six out of eight examples right. Seventy-five percent accuracy. The accuracy is technically true. The model is useless.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "In High-Stakes Domains",
      html: `<p>A healthcare diagnostic where 99% of patients are healthy: a model that predicts "healthy" for everyone scores 99% accuracy and detects no one who's actually sick. Fraud detection. Defect detection. Rare event prediction. Whenever your outcome is rare, accuracy as a sole metric is a trap.</p>
<p>Here's a personal story. I lost a hackathon over this once. I'd adjusted for class imbalance — my model was learning to discriminate the minority class properly, and my accuracy came in around 92%. The team that won didn't adjust. Their model essentially predicted the majority class every time and got 99.5% accuracy. The judges scored on accuracy alone, and that was that. Their model was technically the "winner" and operationally worthless. It has stuck with me ever since as a reminder that imbalanced data plus the wrong metric is a recipe for impressive-looking models that don't actually work.</p>`,
    },
  ],
};

export default pizzaAndHamburgers;
