import type { Section } from "@brinnaebent/workbook";

const dockerAndDeployment: Section = {
  id: "docker-and-deployment",
  number: 2,
  title: "Docker and Deployment Options",
  blocks: [
    {
      type: "text",
      html: `<p>Before we talk about where to deploy a model, we need to talk about how to package one. The answer, almost universally, is <strong>Docker</strong>. Almost every other deployment option in this section is either a wrapper around Docker, or a service that accepts Docker images.</p>`,
    },
    {
      type: "interactive",
      component: "DockerPropertiesGrid",
      caption: "",
      props: {},
    },
    {
      type: "text",
      html: `<p>Once you have a container image, you have options for where to run it. The right choice depends on your traffic, latency requirements, team size, and budget.</p>`,
    },
    {
      type: "interactive",
      component: "DeploymentOptionsGrid",
      caption: "",
      props: {},
    },
    {
      type: "callout",
      variant: "tip",
      title: "Serverless Has a Catch: Cold Starts",
      html: `<p>Serverless functions scale to zero when idle — which is great for your bill and terrible for latency-sensitive applications. When a function that hasn't been called recently receives a request, it incurs a <strong>cold start</strong> penalty: the runtime must be initialized before the request can be processed. For a simple model, this might be 200–500ms. For a large deep learning model with heavy dependencies, it can be several seconds.</p><br>
<p>Rule of thumb: serverless works well for internal tools, low-frequency models, and batch inference. For real-time user-facing predictions where 100ms latency matters, keep the server warm.</p>`,
    },
    {
      type: "interactive",
      component: "DeploymentDecisionTree",
      caption: "",
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
