import type { Section } from "@brinnaebent/workbook";
import type { CVFeature } from "@/content/types";

const imageFeatures: Section = {
  id: "image-features",
  number: 5,
  title: "Feature Engineering for Images",
  blocks: [
    {
      type: "text",
      html: `<p>Each pixel has an RGB value from 0 to 255 — three channels of numbers per pixel. Those raw pixel values can be input features directly, but often you can engineer something richer, more compact, and more robust to variation.</p>
<p><strong>Hand-engineered image features:</strong></p>
<ul>
<li><strong>Color histograms.</strong> Distribution of pixel intensities per color channel. Simple and compact, but sensitive to lighting and ignores spatial structure.</li>
<li><strong>Texture descriptors.</strong> Local Binary Patterns (LBP), Gabor filters, Gray-Level Co-occurrence Matrix (GLCM). Robust to illumination changes, capture spatial structure. Parameter selection is tricky.</li>
<li><strong>Edge detection.</strong> Sobel, Prewitt, Canny (Canny is most popular). Identifies sharp intensity discontinuities — typically object boundaries. The early layers of CNNs often learn edge-detector-like filters spontaneously, which tells you these are genuinely the right low-level features for many visual tasks.</li>
</ul>
<p><strong>Deep learning–based feature extraction:</strong> Use pre-trained CNNs (ResNet, VGG, EfficientNet) as feature extractors, often with transfer learning and fine-tuning. Features from the penultimate layer of a pre-trained model are usually more discriminative than anything you'd engineer by hand. This is the dominant modern approach.</p>`,
    },
    {
      type: "interactive",
      component: "CVFeatureSlideshow",
      caption: "",
      props: {
        category: "Color-Based Features",
        intro:
          "The most intuitive starting point: color. Different objects tend to have different color distributions, and we can capture those distributions statistically.",
        accentColor: "blue",
        features: [
          {
            name: "Color Histograms",
            visual: "color-histogram",
            description:
              "Calculate how often each color value appears across different color spaces (RGB, HSV, LAB). A forest will have a lot of green. A beach will have a lot of blue and tan.",
          },
          {
            name: "Color Moments",
            visual: "color-moments",
            description:
              "Statistical summaries of color channels: mean, standard deviation, skewness. These three numbers per channel compactly describe the color distribution without storing the full histogram.",
          },
          {
            name: "Dominant Colors",
            visual: "dominant-colors",
            description:
              "Extract the most prevalent colors using clustering (k-means). Useful when the primary color of an object is its most distinguishing feature.",
          },
          {
            name: "Color Coherence Vectors",
            visual: "color-coherence",
            description:
              "Distinguish between large, uniformly-colored regions and small isolated patches of color. This adds spatial context that histograms miss.",
          },
        ] satisfies CVFeature[],
      },
    },
    {
      type: "interactive",
      component: "CVFeatureSlideshow",
      caption: "",
      props: {
        category: "Texture-Based Features",
        intro:
          "Texture captures how the surface of an object looks locally — rough, smooth, striped, dotted.",
        accentColor: "violet",
        features: [
          {
            name: "Gray Level Co-occurrence Matrix (GLCM)",
            visual: "glcm",
            description:
              "Captures how often pairs of pixels with specific intensity values appear adjacent to each other. Encodes the spatial structure of intensity patterns.",
          },
          {
            name: "Local Binary Patterns (LBP)",
            visual: "lbp",
            description:
              "For each pixel, compare it to its neighbors and encode whether each neighbor is brighter or darker. The resulting binary pattern is a compact texture descriptor.",
          },
          {
            name: "Gabor Filters",
            visual: "gabor",
            description:
              "Apply filters at different scales and orientations to capture texture patterns across multiple levels of detail, similar to how the human visual system processes texture.",
          },
          {
            name: "Haralick Features",
            visual: "haralick",
            description:
              "Statistical measures derived from the GLCM, including contrast, correlation, and entropy — summarizing texture properties in a handful of numbers.",
          },
        ] satisfies CVFeature[],
      },
    },
    {
      type: "interactive",
      component: "CVFeatureSlideshow",
      caption: "",
      props: {
        category: "Statistical Features",
        intro:
          "Sometimes the simplest descriptors are the most robust. Basic statistical summaries of pixel intensities — mean, variance, entropy — capture global image properties without any geometric assumptions.",
        accentColor: "emerald",
        features: [
          {
            name: "Standard Statistics",
            visual: "std-stats",
            description:
              "Mean and variance of pixel intensities give a quick summary of brightness and contrast.",
          },
          {
            name: "Entropy",
            visual: "entropy",
            description:
              "Measures image complexity. A uniform gray square has low entropy. A busy street scene has high entropy.",
          },
          {
            name: "Zernike Moments",
            visual: "zernike",
            description:
              "Rotation-invariant descriptors based on polynomial decomposition — useful when orientation of an object should not affect its classification.",
          },
          {
            name: "Wavelet Transforms",
            visual: "wavelet",
            description:
              "Multi-scale analysis that captures features at different resolutions simultaneously, useful for images where detail matters at multiple scales.",
          },
        ] satisfies CVFeature[],
      },
    },
    {
      type: "interactive",
      component: "CVFeatureSlideshow",
      caption: "",
      props: {
        category: "Shape-Based Features",
        intro:
          "Shape features describe the boundaries and structure of objects rather than their color or texture.",
        accentColor: "amber",
        features: [
          {
            name: "Edge Detection (Sobel, Canny, Prewitt)",
            visual: "edge-detection",
            description:
              "Identify boundaries in images based on intensity gradients. These operators highlight where the image changes rapidly — the outlines of objects.",
          },
          {
            name: "HOG (Histogram of Oriented Gradients)",
            visual: "hog",
            description:
              "Captures local shape information through gradient directions. HOG was the state-of-the-art for pedestrian detection for years.",
          },
          {
            name: "SIFT (Scale-Invariant Feature Transform)",
            visual: "sift",
            description:
              "Detects keypoints and computes descriptors that are robust to changes in scale, rotation, and illumination.",
          },
          {
            name: "Hu Moments",
            visual: "hu-moments",
            description:
              "Shape descriptors invariant to rotation, scale, and translation — the same shape produces the same descriptor however you flip or resize it.",
          },
        ] satisfies CVFeature[],
      },
    },
    {
      type: "callout",
      variant: "info",
      title: "Data Augmentation",
      html: `<p>A specialized form of feature engineering for images. Apply transforms to your training data <em>only</em> (never to validation or test):</p>
<ul>
<li>Random crop, rotation, horizontal flip</li>
<li>Brightness adjustment, color jitter</li>
<li>Gaussian blur, cutout</li>
</ul>
<p>In PyTorch, augmentation transforms apply at iteration time, so each epoch sees a slightly different version of each image. This makes the model more generalizable without collecting more data.</p>`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Never Augment Your Validation or Test Set",
      html: `<p>Augmentation is a training-time technique. Augmenting your validation or test set introduces artificial variation into your evaluation metric and makes results unreproducible. The test set should represent real-world data as-is — no flipping, no color jitter, no random crops.</p>`,
    },
    {
      type: "checkpoint",
      id: "ds-fe-images-q1",
      kind: "mc",
      question: "You're classifying medical X-rays. You apply horizontal flipping as a data augmentation technique during training. Is this appropriate?",
      options: [
        {
          label: "Depends on the task — horizontal flipping is inappropriate if left/right orientation is clinically meaningful (e.g., left vs. right lung pathology)",
          correct: true,
          explanation: "Correct. In natural image classification, horizontal flipping is usually safe — a cat facing left is still a cat. But in medical imaging, a left-sided pneumothorax and a right-sided pneumothorax are different diagnoses. Flipping would create a training image where the pathology appears on the wrong side, potentially teaching the model incorrect lateralization. The right augmentations depend heavily on domain knowledge.",
        },
        {
          label: "Yes — augmentation always improves model robustness regardless of domain",
          correct: false,
          explanation: "Augmentation improves robustness to the specific type of variation it introduces. If that variation doesn't correspond to real-world variation in the domain — or worse, introduces variation that changes the label — it hurts rather than helps.",
        },
        {
          label: "No — augmentation should never be applied to medical data",
          correct: false,
          explanation: "Medical imaging absolutely uses augmentation — brightness, contrast, small rotations, and zoom are commonly applied. The issue is that the specific augmentation must be appropriate for the task. Horizontal flipping is selectively inappropriate when laterality matters, not augmentation in general.",
        },
      ],
    },
  ],
};

export default imageFeatures;
