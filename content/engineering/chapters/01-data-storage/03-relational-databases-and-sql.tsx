import type { Section } from "@brinnaebent/workbook";

const relationalDatabasesAndSQL: Section = {
  id: "relational-databases-and-sql",
  number: 3,
  title: "Relational Databases and SQL",
  blocks: [
    {
      type: "text",
      html: `<p>Edgar F. Codd published the relational model in 1970. The databases it inspired — Postgres, MySQL, SQL Server, SQLite — are still the workhorses of structured data half a century later. That's not inertia; it's that the relational model is genuinely good at what it does. Data lives in <strong>tables</strong> of rows and columns. Tables relate to each other through <strong>keys</strong>. Queries are expressed in SQL, a language that is approachable enough for analysts and powerful enough for production systems.</p>
<p>If you take nothing else from this section: SQL will appear in technical interviews. Plan accordingly.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The Four Operations: CRUD",
      html: `<p>Every data system is built on four fundamental operations — Create, Read, Update, Delete. In SQL:</p>
<pre><code class="language-sql">-- Read
SELECT first_name, last_name FROM employees WHERE department = 'sales';

-- Create
INSERT INTO employees (first_name, last_name, department, salary)
VALUES ('Jordan', 'Lee', 'marketing', 72000);

-- Update
UPDATE employees SET salary = salary * 1.1 WHERE department = 'sales';

-- Delete
DELETE FROM employees WHERE department = 'HR';</code></pre>`,
    },
    {
      type: "text",
      html: `<p>The operation that trips up most candidates is <strong>JOIN</strong> — combining rows from two or more tables based on a related column. The mental model is set theory, but you don't need to think in sets to use joins fluently. Think instead about what rows you want in your result.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "The Four Join Types",
      html: `<ul>
<li><strong>INNER JOIN</strong> — only rows where a match exists in <em>both</em> tables. If a row in the left table has no corresponding row in the right, it's excluded.</li>
<li><strong>LEFT JOIN</strong> — all rows from the left table, matched rows from the right. If no match exists, the right-side columns are <code>NULL</code>. Use this when "give me everything from A, and whatever B has on it" is the question.</li>
<li><strong>RIGHT JOIN</strong> — mirror of LEFT JOIN. Less commonly used; most engineers just swap the table order and use LEFT.</li>
<li><strong>FULL OUTER JOIN</strong> — all rows from both tables, matched where possible. Unmatched rows from either side get NULLs. Useful for identifying discrepancies between two datasets.</li>
</ul>
<pre><code class="language-sql">-- Every employee and their department name (even if department is NULL)
SELECT e.first_name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;</code></pre>`,
    },
    {
      type: "image",
      src: "/images/engineering/sql-joins-venn.png",
      alt: "Venn diagram showing INNER, LEFT, RIGHT, and FULL OUTER JOIN overlap patterns",
      caption: "Each join type returns a different portion of the combined tables. INNER keeps only the overlap; FULL OUTER keeps everything.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Most Common SQL Interview Mistake",
      html: `<p>Candidates often confuse LEFT JOIN and INNER JOIN by forgetting that LEFT JOIN preserves rows with no match (filling them with NULLs) while INNER JOIN silently drops them. This matters enormously in analytics: if you INNER JOIN orders to customers, you'll drop any orders without a linked customer — and you won't know you dropped them. When in doubt, start with LEFT JOIN and filter afterward.</p>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "When Relational Databases Fit (and When They Don't)",
      html: `<p>Relational databases excel at: structured data with a consistent schema, complex queries with multiple joins, transactional workloads where consistency matters (financial records, order systems), and moderate data volumes.</p>
<p>They start to strain at: schema-flexible documents where every row looks different, extremely high write throughput, data too large to fit on a single machine without careful partitioning, and highly connected data (social graphs, fraud networks) where joins across many tables become expensive.</p>`,
    },
    {
      type: "interactive",
      component: "SQLSandbox",
      caption: "Write SQL queries against a live in-browser database. Try each join type and watch which rows appear and disappear.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "eng-ch1-s3-q1",
      kind: "mc",
      question: "You want a list of all customers and how many orders each has placed — including customers who have placed zero orders. Which SQL approach returns the correct result?",
      options: [
        {
          label: "INNER JOIN between customers and orders, grouped by customer",
          correct: false,
          explanation: "INNER JOIN only returns rows with matches in both tables. Customers with no orders would be excluded — exactly the customers you're trying to surface.",
        },
        {
          label: "LEFT JOIN from customers to orders, then COUNT with GROUP BY, treating NULLs as zero",
          correct: true,
          explanation: "Correct. LEFT JOIN preserves all customers, including those with no orders. After the join, customers with no orders have NULL in the order columns. A COUNT(orders.id) — which doesn't count NULLs — will return 0 for those customers. This is the canonical pattern for 'count of related records, including zero counts.'",
        },
        {
          label: "RIGHT JOIN from orders to customers",
          correct: false,
          explanation: "A RIGHT JOIN here would return all rows from orders (the right table), which excludes customers with no orders. Swapping the table order and using LEFT JOIN would work, but RIGHT JOIN as written does not.",
        },
        {
          label: "A subquery that selects customers, then a separate query for order counts",
          correct: false,
          explanation: "Two separate queries would require combining results in application code — this is what SQL JOINs exist to avoid. A single LEFT JOIN with GROUP BY is cleaner and more efficient.",
        },
      ],
    },
  ],
};

export default relationalDatabasesAndSQL;
