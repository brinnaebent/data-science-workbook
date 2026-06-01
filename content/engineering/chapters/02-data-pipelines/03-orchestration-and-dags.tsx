import type { Section } from "@brinnaebent/workbook";

const orchestrationAndDAGs: Section = {
  id: "orchestration-and-dags",
  number: 3,
  title: "Orchestration and DAGs",
  blocks: [
    {
      type: "text",
      html: `<p>Writing pipeline code is the easy part. Getting it to run reliably, on schedule, in the right order, with alerts when something breaks — that's orchestration.</p>
<p>Think about what a production pipeline actually needs. It needs to run at 2 a.m. every night without anyone pressing a button. It needs to know that Step 4 can't start until Steps 2 and 3 have both succeeded. It needs to retry Step 2 automatically if the source database was briefly unavailable. It needs to alert someone if it fails after three retries. And it needs to show you a history of every run so you can debug what went wrong on Tuesday.</p>
<p>That is the job of an <strong>orchestration tool</strong>. And the central concept underneath all of them is the DAG.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Directed Acyclic Graphs (DAGs)",
      html: `<p>A <strong>directed acyclic graph</strong> is a graph where edges have a direction (A → B means "A must finish before B starts") and there are no cycles (you can't loop back to a node you've already visited).</p>
<p>In a pipeline DAG:</p>
<ul>
<li><strong>Nodes</strong> are tasks — "extract orders from Postgres," "transform and join," "load to Snowflake"</li>
<li><strong>Edges</strong> are dependencies — "this task depends on that one"</li>
<li><strong>Acyclic</strong> means pipelines run forward in time, not in loops</li>
</ul>
<p>When you define a pipeline as a DAG, the orchestrator can figure out which tasks can run in parallel (those with no dependency on each other) and which must run sequentially. This is not something you calculate manually — you express the graph, and the tool does the scheduling.</p>`,
    },
    {
      type: "image",
      src: "/images/engineering/airflow-dag.png",
      alt: "Example Airflow DAG with nodes for extract, validate, transform, load, and notify, with dependency arrows between them",
      caption: "An Airflow DAG visualizes the dependency structure of a pipeline. Tasks with no dependency on each other can run in parallel; the orchestrator handles the scheduling automatically.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Apache Airflow",
      html: `<p><strong>Apache Airflow</strong> is the de facto open-source standard for pipeline orchestration. You write pipelines as Python code — each task is a Python function or operator, and you express the dependencies between them using Python. Airflow's scheduler interprets the DAG and executes tasks in order, retries failures, and surfaces everything in a web UI.</p>
<pre><code class="language-python">from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

with DAG("nightly_sales", start_date=datetime(2024, 1, 1), schedule="0 2 * * *") as dag:
    extract = PythonOperator(task_id="extract_orders", python_callable=extract_orders)
    transform = PythonOperator(task_id="transform", python_callable=transform_orders)
    load = PythonOperator(task_id="load_to_warehouse", python_callable=load_to_snowflake)

    extract >> transform >> load  # dependency chain</code></pre>
<p>The <code>>></code> operator defines the edge: extract must finish before transform, transform must finish before load.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Other Orchestration Tools",
      html: `<ul>
<li><strong>Talend</strong> — open-source data integration with a graphical drag-and-drop interface. Easier onboarding for non-engineers; less flexible than code-based approaches. Still common in organizations with mixed technical backgrounds.</li>
<li><strong>Informatica</strong> — the heavyweight enterprise option. Comprehensive, expensive, common in large organizations with strict governance and compliance requirements.</li>
<li><strong>Prefect and Dagster</strong> — newer Python-native orchestrators that address some of Airflow's rough edges (local testing, type safety, observability). Worth knowing if you're evaluating tools for a greenfield project.</li>
</ul>`,
    },
    {
      type: "checkpoint",
      id: "eng-ch2-s3-q1",
      kind: "mc",
      question: "A pipeline has four tasks: (A) extract customer records, (B) extract order records, (C) join customers to orders, (D) load the joined result to the warehouse. Which tasks can run in parallel, and why?",
      options: [
        {
          label: "A and B can run in parallel; C must wait for both A and B; D must wait for C",
          correct: true,
          explanation: "Correct. A and B are independent — neither depends on the other. C has a dependency on both (you can't join until both datasets are available). D depends on C. This DAG structure allows the orchestrator to run A and B simultaneously, cutting total runtime roughly in half compared to running them sequentially.",
        },
        {
          label: "All four must run sequentially — each step needs the previous one",
          correct: false,
          explanation: "A and B are independent extraction steps from different sources. There's no reason C needs to wait for B to finish before A starts, or vice versa. Recognizing independent tasks is core to efficient pipeline design.",
        },
        {
          label: "C and D can run in parallel because they both operate on joined data",
          correct: false,
          explanation: "D depends on C — you can't load the joined result until the join is complete. C and D must be sequential.",
        },
        {
          label: "Only A and D can run in parallel because they touch the most data",
          correct: false,
          explanation: "Parallelism is determined by dependencies, not data volume. D depends on C, which depends on both A and B — so D cannot run in parallel with A.",
        },
      ],
    },
  ],
};

export default orchestrationAndDAGs;
