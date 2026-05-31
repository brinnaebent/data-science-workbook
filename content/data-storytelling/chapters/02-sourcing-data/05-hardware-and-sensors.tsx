import type { Section } from "@brinnaebent/workbook";

const hardwareAndSensors: Section = {
  id: "hardware-and-sensors",
  number: 5,
  title: "Hardware and Sensors",
  blocks: [
    {
      type: "text",
      html: `<p>Getting data <strong>directly from hardware and sensors</strong> means you own the collection rig. Examples of public sensor datasets include EKG heartbeat categorization datasets, environmental sensor telemetry, the <strong>MotionSense</strong> dataset (smartphone sensors for human activity recognition), solar power generation data, vehicular sensor datasets, and nurse stress prediction datasets from wearable sensors.</p>`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Advantages",
      html: `<p>Sensors can capture things no survey, no scrape, and no API can — physiological signals, environmental conditions, motion, structural strain. If you need data that doesn't yet exist in the world, sensors are how you make it exist.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Limitations",
      html: `<ul>
<li><strong>Cost.</strong> Hardware is expensive to deploy and maintain. Sensors need calibration. Devices fail.</li>
<li><strong>Heterogeneity.</strong> Different sensors use different formats, sample rates, and protocols. Stitching them together is real engineering work.</li>
<li><strong>Preprocessing happens upstream.</strong> You are almost never receiving truly raw sensor data. A "heart rate" in a smartwatch data file is the output of an on-device signal processing chain. Understand what's happening upstream of the file you're reading.</li>
</ul>`,
    },
    {
      type: "article",
      href: "https://medium.com/edge-analytics/building-a-cnn-to-predict-bicycle-wheelies-insights-into-rapid-prototyping-143d5f09c167",
      imageSrc: "/data-storytelling/hardware.gif",
      imageAlt: "CNN predicting bicycle wheelies using IMU sensor data",
      publisher: "Ren Gibbons",
      category: "Rapid Prototyping",
      title: "Building a CNN to Predict Bicycle Wheelies",
      excerpt: "An example of building your own hardware to collect data for modeling.",
      byline: "Ren Gibbons",
    },
    {
      type: "callout",
      variant: "example",
      title: "Building the Rig When the Hardware Doesn't Exist Yet",
      html: `<p>One of my favorite approaches: if you need sensor data and the hardware doesn't exist yet, build the rig and collect it yourself. I once worked on a project where the production hardware wasn't ready, so we strapped our own IMU sensors to the ends of dumbbells, collected a labeled dataset ourselves, and built the algorithms on that. It was faster than waiting for the hardware.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-sourcing-sensors-q1",
      kind: "mc",
      question: "You receive a CSV of accelerometer data from a wearable. The file has no timestamp column — just rows of x, y, z values. How do you recover the timing of each sample?",
      options: [
        {
          label: "Find the sensor's sample rate in its data sheet and compute timestamps from that",
          correct: true,
          explanation: "Correct. Most wearable sensors don't embed timestamps row-by-row. The sample rate is specified in the hardware data sheet — if the sensor runs at 50 Hz, each row is 1/50 = 20ms apart. Knowing how to read a data sheet is a core sensor-data skill.",
        },
        {
          label: "Interpolate timestamps from the file creation time and modification time",
          correct: false,
          explanation: "File system timestamps are not recording timestamps — they reflect when the file was written, not when individual samples were captured. This approach would give you garbage timing.",
        },
        {
          label: "Assume 1 second per row as a safe default",
          correct: false,
          explanation: "Accelerometers commonly run at 25–200 Hz — meaning 25 to 200 rows per second, not one. Assuming 1 second per row would make your time axis wrong by a factor of 25–200x.",
        },
      ],
    },
  ],
};

export default hardwareAndSensors;
