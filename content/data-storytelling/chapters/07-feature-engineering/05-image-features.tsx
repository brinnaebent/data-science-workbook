import type { Section } from "@brinnaebent/workbook";

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
      type: "image",
      src: "/images/placeholder.png",
      alt: "Image feature extraction pipeline from raw pixels to CNN embeddings",
      caption: "Placeholder: diagram showing the feature extraction pipeline from raw image → hand-crafted features vs. CNN embedding.",
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
