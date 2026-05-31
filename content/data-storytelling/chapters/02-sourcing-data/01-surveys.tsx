import type { Section } from "@brinnaebent/workbook";

const surveys: Section = {
  id: "surveys",
  number: 1,
  title: "Surveys",
  blocks: [
    {
      type: "text",
      html: `<p>Surveys are usually the data source students are most familiar with — because we've all <em>been</em> surveyed. The classics include the <strong>U.S. Census</strong>, the <strong>National Health and Nutrition Examination Survey (NHANES)</strong>, the <strong>Pew Research Center</strong> surveys, the <strong>European Social Survey (ESS)</strong>, and the <strong>Consumer Expenditure Survey</strong>. These are foundational for an enormous amount of social science and applied research.</p>`,
    },
    {
      type: "interactive",
      component: "DataScienceInterestSurvey",
      caption: "A live survey using four common question formats — Likert scales, a slider, ranking, and multi-select. Notice how each format captures a structurally different kind of data.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Advantages",
      html: `
<ul>
<li><strong>Customizable.</strong> You control the questions and can tailor them to your specific research question.</li>
<li><strong>Dual capture.</strong> Can gather both qualitative and quantitative data, making them flexible.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Limitations",
      html: `
<ul>
<li><strong>Response bias.</strong> Responses may be biased, skewed, or simply false. People misremember. People want to seem better than they are.</li>
<li><strong>Limited reach.</strong> You may never hear from the population you're most interested in.</li>
<li><strong>Subjectivity in interpretation.</strong> The same question can be read differently by different respondents.</li>
</ul>`,
    },
    {
      type: "text",
      html: `<p>The delivery method shapes who responds — and therefore what you learn. <strong>Online platforms</strong> (Qualtrics, Google Forms, SurveyMonkey) are free or low-cost and easy to share, but they introduce selection bias toward internet-accessible, motivated respondents. <strong>In-person</strong> methods (focus groups, interviews, paper surveys) yield richer detail but bring interviewer bias and higher logistical cost. <strong>Mail</strong> surveys carry very high non-response bias and aren't generally recommended. <strong>Phone</strong> surveys can work for semantic analysis but face spam-filtering challenges — most people don't answer unknown numbers anymore.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "Why Survey Methodology Shapes What You Think You Know",
      html: `<p>Every public-health intervention you've ever heard of was informed by survey data at some point. NHANES alone is the foundation under thousands of papers and most U.S. nutritional guidelines. When you read "X% of Americans believe Y," you are reading a survey result — and the choices made by whoever ran that survey (sample, delivery, question wording) are shaping what you think you know.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-sourcing-surveys-q1",
      kind: "mc",
      question: "You want to survey internet usage patterns across a wide demographic range, including elderly and low-income populations. Which survey delivery method is most likely to introduce selection bias against your target population?",
      options: [
        {
          label: "Online survey distributed via social media",
          correct: true,
          explanation: "Correct. Distributing an internet usage survey online immediately excludes people without consistent internet access — exactly the populations you're trying to study. You'd be sampling internet users to learn about internet usage, which guarantees your sample doesn't represent people with limited access.",
        },
        {
          label: "In-person interviews at community centers",
          correct: false,
          explanation: "In-person surveys can reach people who don't have regular internet access. They have their own biases (interviewer bias, self-selection by who visits community centers), but they're less likely to structurally exclude your target populations.",
        },
        {
          label: "Random-digit-dialing phone survey",
          correct: false,
          explanation: "Phone surveys can reach landline and cell phone holders, which includes many people without regular internet access. Response rates are low, but the access barrier is lower than online-only surveys.",
        },
      ],
    },
  ],
};

export default surveys;
