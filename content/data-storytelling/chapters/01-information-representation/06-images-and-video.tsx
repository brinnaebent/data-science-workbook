import type { Section } from "@brinnaebent/workbook";

const imagesAndVideo: Section = {
  id: "images-and-video",
  number: 6,
  title: "Images and Video",
  blocks: [
    {
      type: "text",
      html: `<p>Before we can train any model, we need to first understand what an image actually looks like to a computer.</p>
        <p>An image is stored as a grid of pixels. Each pixel encodes the color at that location using three numbers: how much red, how much green, and how much blue. Those values range from 0 to 255. A pure white pixel is [255, 255, 255]. A pure black pixel is [0, 0, 0]. A pale blue-tinted light might read [204, 229, 255].</p>
        <p>A standard HD image might be 1080 rows by 1920 columns, with three channels per pixel. That means a single image is a <strong>tensor</strong> of shape <code>[1080, 1920, 3]</code>, containing over six million numbers!</p>`,
    },
    {
      type: "interactive",
      component: "PixelExplorer",
      caption: "Hover over any pixel in the sample image to see its RGB values. Toggle to grayscale to see how color collapses to a single luminance value per pixel.",
      props: {},
    },
    {
      type: "reflection",
      id: "cv-r1-tensor",
      question: "A grayscale medical X-ray is 512 × 512 pixels. What shape is its tensor representation, and how many total numbers does it contain?",
      sampleAnswer: "The tensor shape is [512, 512, 1] — height × width × channels. Grayscale images have a single intensity channel rather than three. The total number of values is 512 × 512 × 1 = 262,144.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Video Is a Time Series of Images",
      html: `<p>Videos extend the idea by one dimension. A video is a sequence of image frames over time. Once you internalize that — <em>video is a time series of images</em> — a lot of video modeling stops feeling mysterious. The same convolutional building blocks that work on images also work on video, just with an extra time axis.</p>`,
    },
    {
      type: "callout",
      variant: "example",
      title: "One Encoding, Many Applications",
      html: `<p>The exact same RGB encoding scheme — a tensor of numbers between 0 and 255 — is the foundation under medical imaging, autonomous driving perception, manufacturing quality control, satellite imagery, and your Instagram filter. A radiologist's MRI viewer and your phone's camera app are reading the same kind of numbers; what's different is the model on top.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-info-rep-image-q1",
      kind: "mc",
      question: "A 64×64 pixel color image (RGB). How many numbers does it take to represent it?",
      options: [
        {
          label: "12,288 (64 × 64 × 3)",
          correct: true,
          explanation: "Correct. 64 pixels wide × 64 pixels tall = 4,096 pixels. Each pixel has 3 channels (R, G, B). So 4,096 × 3 = 12,288 numbers total.",
        },
        {
          label: "4,096 (64 × 64)",
          correct: false,
          explanation: "That's the number of pixels, but each pixel has three color channels. You need to multiply by 3 for RGB: 64 × 64 × 3 = 12,288.",
        },
        {
          label: "192 (64 × 3)",
          correct: false,
          explanation: "This would be the number of values in a single row of pixels. The full image has 64 rows of 64 pixels, each with 3 channels: 64 × 64 × 3 = 12,288.",
        },
      ],
    },
  ],
};

export default imagesAndVideo;
