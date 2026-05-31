import type { Section } from "@brinnaebent/workbook";

const dataOrganization: Section = {
  id: "data-organization",
  number: 9,
  title: "Data Organization",
  blocks: [
    {
      type: "interactive",
      component: "DataInfrastructureWizard",
      caption: "Work through five infrastructure decisions — schema, naming, protocols, storage, and documentation — before the first row of data arrives.",
    },
    {
      type: "text",
      html: `<p>Set up your data structure <em>before</em> you start collecting:</p>
<ul>
<li><strong>Schema design</strong> — what fields, what types, what constraints.</li>
<li><strong>Naming conventions and formatting standards</strong> — consistent from day one.</li>
<li><strong>Collection protocols</strong> — how data enters, what validation runs on ingestion.</li>
<li><strong>Storage and version control</strong> — logical directory structure, versioned.</li>
<li><strong>Documentation</strong> — what each field means, where data came from, what's been cleaned.</li>
</ul>
<br>
<p>There's no single agreed-upon documentation standard, but several frameworks exist: <strong>Datasheets for Datasets</strong> (Gebru et al., 2018), <strong>Dataset Nutrition Labels</strong>, and <strong>Data Statements for NLP</strong>. Pick one that fits your project and use it consistently.</p>`,
    },
  ],
};

export default dataOrganization;
