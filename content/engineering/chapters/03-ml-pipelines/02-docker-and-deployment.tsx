import type { Section } from "@brinnaebent/workbook";

const dockerAndDeployment: Section = {
  id: "docker-and-deployment",
  number: 2,
  title: "Docker and Deployment Options",
  blocks: [
    {
      type: "text",
      html: `<p>Before we talk about where to deploy a model, we need to talk about how to package one. The answer, almost universally, is <strong>Docker</strong>.</p>
<p>Docker is the lingua franca of deployment. Almost every other deployment option in this section is either a wrapper around Docker, or a service that accepts Docker images. Learn Docker first; everything else follows from it.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "What Docker Actually Does",
      html: `<p>A <strong>container</strong> is a lightweight, standalone, executable package that includes everything needed to run a piece of software: code, runtime, system libraries, settings. The key properties:</p>
<ul>
<li><strong>Isolation</strong> — each container runs in a sandbox. Your model's dependencies don't collide with the web server's dependencies.</li>
<li><strong>Consistency</strong> — what runs on your laptop runs identically in production. The phrase "it works on my machine" disappears.</li>
<li><strong>Portability</strong> — any system with Docker installed can run any container, regardless of what's installed on the host.</li>
<li><strong>Versionability</strong> — container images are versioned and immutable. Rollbacks are as simple as switching which image version is running.</li>
</ul>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "A Minimal Dockerfile",
      html: `<p>A <strong>Dockerfile</strong> is a text file with one instruction per line. Here's a minimal example for a Flask app serving a scikit-learn model:</p>
<pre><code class="language-dockerfile">FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]</code></pre>
<p>What each line does:</p>
<ul>
<li><code>FROM</code> — the base image. <code>python:3.11-slim</code> is a lightweight Python image; "slim" variants exclude documentation and non-essential packages to reduce size.</li>
<li><code>WORKDIR</code> — set the working directory inside the container. All subsequent commands run from here.</li>
<li><code>COPY</code> — copy files from your machine into the container's filesystem.</li>
<li><code>RUN</code> — execute a shell command at build time. Here, install dependencies. This layer is cached — if <code>requirements.txt</code> hasn't changed, Docker reuses the cached layer.</li>
<li><code>EXPOSE</code> — document that the container listens on port 5000. This is informational; it doesn't publish the port to your host machine.</li>
<li><code>CMD</code> — the command to run when the container starts.</li>
</ul>
<p>Build and run:</p>
<pre><code class="language-bash">docker build -t my-ml-app .
docker run -p 5000:5000 my-ml-app</code></pre>
<p>The <code>-p 5000:5000</code> flag maps the container's port 5000 to your machine's port 5000. Without it, the container is isolated and unreachable from your browser.</p>`,
    },
    {
      type: "text",
      html: `<p>Once you have a container image, you have options for where to run it. The right choice depends on your traffic, latency requirements, team size, and budget.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Deployment Options",
      html: `<table>
<thead><tr><th>Option</th><th>What it is</th><th>Best for</th></tr></thead>
<tbody>
<tr><td><strong>Container (Docker + Kubernetes)</strong></td><td>Run containers on a managed cluster — AWS ECS, GKE, AKS</td><td>High-traffic, production-grade APIs that need auto-scaling and fine-grained control</td></tr>
<tr><td><strong>Serverless</strong></td><td>AWS Lambda, Azure Functions, Google Cloud Functions — pay per invocation, scales to zero</td><td>Low-traffic or bursty models where you don't want to pay for idle compute</td></tr>
<tr><td><strong>Managed ML Platform</strong></td><td>AWS SageMaker, Vertex AI (GCP), Azure ML — handles deployment, endpoints, monitoring</td><td>Teams that want the full MLOps stack without building it themselves</td></tr>
<tr><td><strong>Model-as-a-Service</strong></td><td>Hugging Face Inference Endpoints, Replicate, OpenAI — you call an API</td><td>Prototyping, or when you don't want to run the model at all</td></tr>
<tr><td><strong>Edge Deployment</strong></td><td>TensorFlow Lite, ONNX, Core ML — model runs on-device (phone, sensor, car)</td><td>Latency-critical or privacy-sensitive applications with no reliable internet</td></tr>
</tbody>
</table>`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Serverless Has a Catch: Cold Starts",
      html: `<p>Serverless functions scale to zero when idle — which is great for your bill and terrible for latency-sensitive applications. When a function that hasn't been called recently receives a request, it incurs a <strong>cold start</strong> penalty: the runtime must be initialized before the request can be processed. For a simple model, this might be 200–500ms. For a large deep learning model with heavy dependencies, it can be several seconds.</p>
<p>Rule of thumb: serverless works well for internal tools, low-frequency models, and batch inference. For real-time user-facing predictions where 100ms latency matters, keep the server warm.</p>`,
    },
    {
      type: "interactive",
      component: "DeploymentDecisionTree",
      caption: "Answer questions about traffic, latency requirements, team size, and budget. The tool recommends a deployment strategy with its reasoning.",
      props: {},
    },
    {
      type: "checkpoint",
      id: "eng-ch3-s2-q1",
      kind: "mc",
      question: "A mobile health startup is deploying a model that predicts heart rate anomalies from wearable sensor data. The model must respond in under 50ms, the app must work without internet connectivity, and patient health data cannot leave the device. Which deployment option fits?",
      options: [
        {
          label: "Serverless (AWS Lambda) — pay only when predictions are requested",
          correct: false,
          explanation: "Serverless requires internet connectivity (requests go to AWS) and the 50ms latency requirement is incompatible with cold start penalties and round-trip network latency. Data leaving the device also creates a compliance concern.",
        },
        {
          label: "Container deployment on a Kubernetes cluster in the cloud",
          correct: false,
          explanation: "Cloud-hosted inference requires internet connectivity (fails the offline requirement) and involves data leaving the device (compliance concern). Cloud round-trip latency also makes 50ms very difficult to achieve reliably.",
        },
        {
          label: "Edge deployment (TensorFlow Lite or Core ML) — the model runs on-device",
          correct: true,
          explanation: "Correct. Edge deployment packages the model for on-device inference. No internet required, no data leaves the device, and inference happens locally with sub-millisecond overhead after the model is loaded. This is exactly the trade-off edge deployment was designed for: privacy and latency at the cost of model complexity (you're constrained by device memory and compute).",
        },
        {
          label: "Model-as-a-Service via a Hugging Face endpoint",
          correct: false,
          explanation: "Model-as-a-Service requires internet connectivity and sends data to a third-party provider — two disqualifying constraints for this use case.",
        },
      ],
    },
  ],
};

export default dockerAndDeployment;
