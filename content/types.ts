export type CVFeature = {
  name: string;
  visual: string;
  description: string;
};

export type CVFeatureSlideshowBlock = {
  type: "cv-feature-slideshow";
  category: string;
  intro: string;
  accentColor: "blue" | "violet" | "emerald" | "amber";
  features: CVFeature[];
};
