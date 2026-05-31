import type { Section } from "@brinnaebent/workbook";

const sevenCountriesStudy: Section = {
  id: "the-seven-countries-study",
  number: 1,
  title: "The Seven Countries Study",
  blocks: [
    {
      type: "text",
      html: `<p>For this chapter, we ground everything in a real study, because abstract regression examples never quite stick. The Seven Countries Study was a landmark project examining factors affecting cardiovascular disease across populations worldwide. We'll use simulated data based on this study to build up the mechanics of linear regression — and you'll see how regression goes from "draw a line through some dots" to "model the world."</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Learning Objectives",
      html: `<p>By the end of this chapter, you'll be able to:</p>
<ol>
<li>Define residuals and explain the logic of ordinary least squares.</li>
<li>Build and interpret a simple linear regression model.</li>
<li>State the four assumptions of linear regression and explain why each matters.</li>
<li>Interpret regression coefficients (slope and intercept).</li>
<li>Extend simple linear regression to multiple predictors.</li>
<li>Distinguish regression as a tool for prediction vs. estimation vs. hypothesis testing.</li>
</ol>`,
    },
    {
      type: "text",
      html: `<p>Here's a useful setup. We want to study the relationship between coronary heart disease (CHD) mortality and country-level features. The first feature we'll consider: an arbitrary ID number assigned to each country. Since the ID is arbitrary, we'd expect no relationship with CHD mortality.</p>
<p>We'll use this zero-relationship example to build regression's machinery — then replace the useless predictor with something meaningful: average cigarettes consumed per adult per day.</p>`,
    },
  ],
};

export default sevenCountriesStudy;
