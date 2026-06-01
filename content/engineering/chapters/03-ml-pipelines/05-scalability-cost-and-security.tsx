import type { Section } from "@brinnaebent/workbook";

const scalabilityCostAndSecurity: Section = {
  id: "scalability-cost-and-security",
  number: 5,
  title: "Scalability, Cost, and Security",
  blocks: [
    {
      type: "text",
      html: `<p>Three topics that are often treated as advanced — system scalability, operational cost, and security — are actually decisions you make on day one, whether you intend to or not. An architecture that can't scale costs you a rewrite later. A model that runs without cost controls costs you real money. A system built without security consideration costs you trust, compliance, and potentially your users' data. These aren't afterthoughts; they're design constraints.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Scalability: Serving More Requests",
      html: `<p>When traffic grows, you have two options:</p>
<ul>
<li><strong>Vertical scaling</strong> — give the existing machine more resources (bigger CPU, more RAM, a faster GPU). Simple, but has a ceiling — machines only get so big, and a single machine is a single point of failure.</li>
<li><strong>Horizontal scaling</strong> — add more instances behind a load balancer. Traffic is distributed across many machines. No ceiling, no single point of failure.</li>
</ul>
<p><strong>Auto-scaling</strong> is the version that responds dynamically: when traffic spikes, new instances spin up; when traffic subsides, instances scale down. Most cloud platforms (AWS ECS, Kubernetes, SageMaker) support auto-scaling on CPU or request queue depth.</p>
<p>One design decision that affects everything: <strong>batch vs. real-time inference</strong>. Batch inference processes many predictions at once (a nightly job scoring all customers for a churn model); real-time inference processes one request at a time as it arrives (a recommendation engine serving users live). Batch is cheaper — you can run it on off-peak compute, optimize for throughput. Real-time requires always-on infrastructure optimized for latency.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Cost: Where Your Inference Budget Goes",
      html: `<ul>
<li><strong>Right-sizing</strong> — match the infrastructure to the actual workload. A model that gets two requests per day doesn't need a dedicated GPU instance. A model serving a million requests per hour does.</li>
<li><strong>Spot instances</strong> — cloud providers sell spare capacity at a steep discount (60–90% off on-demand prices). The catch: the instance can be terminated with 2 minutes' notice. Great for training jobs (just checkpoint frequently). Risky for latency-sensitive inference.</li>
<li><strong>Caching</strong> — if your model frequently receives the same or similar inputs, cache the predictions. A recommendation model that shows the same top-10 products to most anonymous users can serve those from a cache rather than running inference.</li>
<li><strong>Model compression</strong> — smaller models cost less to run and respond faster. Three techniques worth knowing:
  <ul>
    <li><strong>Quantization</strong> — reduce the precision of weights from float32 to int8. Often 4× smaller with minimal accuracy loss.</li>
    <li><strong>Pruning</strong> — remove weights that contribute little to predictions. Reduces parameter count.</li>
    <li><strong>Distillation</strong> — train a small "student" model to mimic a large "teacher" model. The student is far cheaper to run.</li>
  </ul>
</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "ML-Specific Security Threats",
      html: `<p>Standard security hygiene (encryption in transit and at rest, access control, regular audits) applies to ML systems just as to any software. But ML models face a class of attacks that general software does not:</p>
<ul>
<li><strong>Model inversion attacks</strong> — an adversary queries the model repeatedly to reconstruct its training data. If the model was trained on sensitive records (medical data, PII), this is a serious privacy concern.</li>
<li><strong>Membership inference attacks</strong> — the adversary tries to determine whether a specific record was in the training set. This leaks information about who was included in your training data.</li>
<li><strong>Adversarial examples</strong> — inputs crafted to cause the model to misclassify. A stop sign with a few stickers that a human reads as "stop sign" but a computer vision model reads as "speed limit." In autonomous systems, this is a safety concern.</li>
</ul>
<p>These aren't theoretical. Defenses include differential privacy during training, rate-limiting and anomaly detection on API queries, and adversarial training. Most ML engineers won't implement these from scratch, but you should be able to recognize the threat and escalate to a security team that can.</p>`,
    },
    {
      type: "checkpoint",
      id: "eng-ch3-s5-q1",
      kind: "mc",
      question: "A product team has a recommendation model that returns the same top-10 trending items to 80% of anonymous users. The current architecture runs full model inference for every request, and compute costs are high. What is the cheapest, lowest-risk optimization?",
      options: [
        {
          label: "Switch to a smaller model",
          correct: false,
          explanation: "A smaller model would reduce per-inference cost, but it may sacrifice recommendation quality and still runs inference for every request. Caching is a simpler, lower-risk first step when 80% of requests return the same result.",
        },
        {
          label: "Cache the top-10 result for anonymous users and serve it from cache, running inference only when the cache expires or for logged-in users",
          correct: true,
          explanation: "Correct. When 80% of requests return the same output, that output is a perfect cache candidate. Cache the trending list, refresh it on a schedule, and serve it directly — no inference required. This can reduce compute costs by the fraction of traffic that hits the cache, with zero impact on recommendation quality.",
        },
        {
          label: "Move to batch inference — precompute all predictions nightly",
          correct: false,
          explanation: "Batch inference works well when you can precompute predictions for every user ahead of time. For anonymous users with no identity, this is harder. Caching the popular result is simpler and more immediate.",
        },
        {
          label: "Use spot instances for the inference server",
          correct: false,
          explanation: "Spot instances reduce cost per hour, but they introduce interruption risk for a real-time recommendation service. The question asks for 'lowest risk' — spot instances increase operational risk while caching reduces compute entirely.",
        },
      ],
    },
  ],
};

export default scalabilityCostAndSecurity;
