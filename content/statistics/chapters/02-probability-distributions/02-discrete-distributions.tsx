import type { Section } from "@brinnaebent/workbook";

const discreteDistributions: Section = {
  id: "discrete-distributions",
  number: 2,
  title: "Discrete Distributions",
  blocks: [
    {
      type: "text",
      html: `<p><strong>Discrete distributions</strong> describe outcomes that are distinct and countable. Heads or tails. Number of clicks. Number of customer support tickets in an hour. The value can only be a whole number — you can't have 2.7 clicks.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Bernoulli Distribution",
      html: `<p>Models a single binary trial with two possible outcomes: success (1) or failure (0). Single parameter <em>p</em> is the probability of success.</p>
<p><strong>When it shows up:</strong> Did the user click the ad? Did the transaction succeed? Did the patient survive? Any yes/no outcome is Bernoulli.</p>
<p><strong>Mean:</strong> p. <strong>Variance:</strong> p(1−p).</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Binomial Distribution",
      html: `<p>Models the number of successes in <em>n</em> independent Bernoulli trials. Parameters: <em>n</em> (number of trials) and <em>p</em> (probability of success per trial).</p>
<p><strong>When it shows up:</strong> Out of 10,000 marketing emails sent, how many will be opened? Out of 500 A/B test participants, how many convert? Any "count of successes in fixed trials" is binomial.</p>
<p><strong>Mean:</strong> np. <strong>Variance:</strong> np(1−p).</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Poisson Distribution",
      html: `<p>Models the number of events occurring in a fixed interval of time or space, given a constant average rate. Single parameter $\\lambda$ (the rate).</p>
<p><strong>When it shows up:</strong> Customer service calls per hour. API requests per second. Defects per meter of manufacturing line. Any "count of independent events arriving at a steady rate" is Poisson.</p>
<p><strong>Mean:</strong> $\\lambda$. <strong>Variance:</strong> $\\lambda$. (The mean and variance are equal — this is a unique property of the Poisson.)</p>`,
    },
    {
      type: "interactive",
      component: "DiscreteDistributionExplorer",
      caption: "Toggle between Bernoulli, Binomial, and Poisson. Adjust parameters with the sliders and watch the PMF bars shift — hover any bar to see its exact probability.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "stats-ch2-s2-q1",
      kind: "mc",
      question: "You're modeling the number of fraudulent transactions per day on a payment platform, where fraud events arrive independently and at a roughly constant average rate. Which distribution best describes this count?",
      options: [
        {
          label: "Bernoulli",
          correct: false,
          explanation: "Bernoulli models a single binary trial (one event, two outcomes). You need a distribution over counts, not a single yes/no.",
        },
        {
          label: "Binomial",
          correct: false,
          explanation: "Binomial works when you have a fixed number of trials (n). If the number of transactions per day varies, you don't have a fixed n — Poisson is the better fit for counts of independent events in a fixed time window.",
        },
        {
          label: "Poisson",
          correct: true,
          explanation: "Correct. The Poisson distribution is designed for counts of independent events occurring at a constant average rate over a fixed interval. Fraud events arriving per day fits this description well.",
        },
        {
          label: "Normal",
          correct: false,
          explanation: "Normal is a continuous distribution — it's not appropriate for count data. While large Poisson counts approximate the normal, the underlying data-generating process here is discrete.",
        },
      ],
    },
  ],
};

export default discreteDistributions;
