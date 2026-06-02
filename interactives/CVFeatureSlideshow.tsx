"use client";

import type { CVFeature, CVFeatureSlideshowBlock } from "@/content/types";
import { Slideshow } from "@brinnaebent/workbook/client";

type AccentColor = CVFeatureSlideshowBlock["accentColor"];

type Props = {
  category: string;
  intro: string;
  accentColor: AccentColor;
  features: CVFeature[];
};

const HEADER_GRADIENT: Record<AccentColor, string> = {
  blue: "from-blue-50 to-indigo-100 border-indigo-200",
  violet: "from-violet-50 to-purple-100 border-purple-200",
  emerald: "from-emerald-50 to-teal-100 border-teal-200",
  amber: "from-orange-50 to-amber-100 border-amber-200",
};

const NAME_COLOR: Record<AccentColor, string> = {
  blue: "text-indigo-800",
  violet: "text-purple-800",
  emerald: "text-teal-800",
  amber: "text-amber-800",
};

// ─── SVG diagrams ────────────────────────────────────────────────────────────

function ColorHistogramSVG() {
  const bins = [
    { x: 10, h: 30, fill: "#ef4444" },
    { x: 30, h: 55, fill: "#f97316" },
    { x: 50, h: 20, fill: "#eab308" },
    { x: 70, h: 70, fill: "#22c55e" },
    { x: 90, h: 45, fill: "#3b82f6" },
    { x: 110, h: 85, fill: "#8b5cf6" },
    { x: 130, h: 40, fill: "#ec4899" },
  ];
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <rect x="0" y="0" width="160" height="100" fill="none" />
      <line x1="8" y1="95" x2="152" y2="95" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="8" y1="5" x2="8" y2="95" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="80" y="100" textAnchor="middle" fontSize="7" fill="#64748b">Color value</text>
      {bins.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={95 - b.h}
          width="16"
          height={b.h}
          fill={b.fill}
          fillOpacity="0.75"
          rx="1"
        />
      ))}
    </svg>
  );
}

function ColorMomentsSVG() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      {[
        { color: "#ef4444", label: "R", cx: 55, mean: 65 },
        { color: "#22c55e", label: "G", cx: 80, mean: 45 },
        { color: "#3b82f6", label: "B", cx: 105, mean: 70 },
      ].map(({ color, label, cx, mean }) => (
        <g key={label}>
          <ellipse cx={cx} cy={mean} rx="14" ry="22" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5" />
          <line x1={cx - 14} y1={mean} x2={cx + 14} y2={mean} stroke={color} strokeWidth="1" strokeDasharray="3 2" />
          <line x1={cx} y1={mean - 14} x2={cx} y2={mean + 14} stroke={color} strokeWidth="1" />
          <line x1={cx - 5} y1={mean - 14} x2={cx + 5} y2={mean - 14} stroke={color} strokeWidth="1" />
          <line x1={cx - 5} y1={mean + 14} x2={cx + 5} y2={mean + 14} stroke={color} strokeWidth="1" />
          <text x={cx} y={mean + 28} textAnchor="middle" fontSize="8" fill={color} fontWeight="600">{label}</text>
        </g>
      ))}
      <text x="80" y="10" textAnchor="middle" fontSize="7" fill="#64748b">μ, σ, skew per channel</text>
    </svg>
  );
}

function DominantColorsSVG() {
  const points = [
    { x: 40, y: 35, c: "#3b82f6" }, { x: 48, y: 28, c: "#3b82f6" }, { x: 35, y: 42, c: "#3b82f6" },
    { x: 44, y: 40, c: "#3b82f6" }, { x: 52, y: 32, c: "#3b82f6" },
    { x: 100, y: 60, c: "#22c55e" }, { x: 108, y: 55, c: "#22c55e" }, { x: 95, y: 65, c: "#22c55e" },
    { x: 104, y: 68, c: "#22c55e" }, { x: 112, y: 62, c: "#22c55e" },
    { x: 70, y: 75, c: "#f97316" }, { x: 78, y: 70, c: "#f97316" }, { x: 65, y: 80, c: "#f97316" },
    { x: 74, y: 78, c: "#f97316" },
  ];
  const centers = [
    { x: 44, y: 35, c: "#1d4ed8" }, { x: 103, y: 62, c: "#15803d" }, { x: 72, y: 76, c: "#c2410c" },
  ];
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={p.c} fillOpacity="0.5" />
      ))}
      {centers.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r="6" fill={c.c} stroke="white" strokeWidth="1.5" />
          <text x={c.x} y={c.y + 3} textAnchor="middle" fontSize="7" fill="white" fontWeight="700">×</text>
        </g>
      ))}
      <text x="80" y="98" textAnchor="middle" fontSize="7" fill="#64748b">k-means cluster centers = dominant colors</text>
    </svg>
  );
}

function ColorCoherenceSVG() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <rect x="10" y="15" width="60" height="60" rx="6" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="40" y="48" textAnchor="middle" fontSize="7" fill="#1d4ed8" fontWeight="600">Coherent</text>
      <text x="40" y="57" textAnchor="middle" fontSize="6.5" fill="#1d4ed8">(large region)</text>
      {[
        [95, 20], [110, 35], [130, 18], [120, 55], [100, 65], [140, 45], [135, 70], [105, 78],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="#3b82f6" fillOpacity="0.4" />
      ))}
      <text x="118" y="92" textAnchor="middle" fontSize="7" fill="#1d4ed8" fontWeight="600">Incoherent</text>
      <text x="118" y="100" textAnchor="middle" fontSize="6.5" fill="#1d4ed8">(scattered pixels)</text>
    </svg>
  );
}

function GLCMSVG() {
  const matrix = [
    [4, 2, 1, 0],
    [2, 5, 3, 1],
    [1, 3, 6, 2],
    [0, 1, 2, 4],
  ];
  const max = 6;
  const size = 18;
  const ox = 20;
  const oy = 10;
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <text x="80" y="8" textAnchor="middle" fontSize="7" fill="#64748b">Pixel intensity pair frequency</text>
      {matrix.map((row, r) =>
        row.map((val, c) => {
          const alpha = val / max;
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={ox + c * size}
                y={oy + r * size}
                width={size}
                height={size}
                fill={`rgba(139,92,246,${alpha})`}
                stroke="white"
                strokeWidth="0.5"
              />
              <text
                x={ox + c * size + size / 2}
                y={oy + r * size + size / 2 + 3}
                textAnchor="middle"
                fontSize="7"
                fill={alpha > 0.4 ? "white" : "#4c1d95"}
              >
                {val}
              </text>
            </g>
          );
        })
      )}
      <text x="20" y="92" fontSize="7" fill="#64748b">i (ref pixel intensity) →</text>
      <text x="12" y="55" fontSize="7" fill="#64748b" transform="rotate(-90,12,55)">j →</text>
    </svg>
  );
}

function LBPSVG() {
  const center = { x: 80, y: 50, v: 128 };
  const neighbors = [
    { x: 60, y: 30, v: 90, bit: 0 },
    { x: 80, y: 25, v: 145, bit: 1 },
    { x: 100, y: 30, v: 200, bit: 1 },
    { x: 105, y: 50, v: 170, bit: 1 },
    { x: 100, y: 70, v: 60, bit: 0 },
    { x: 80, y: 75, v: 50, bit: 0 },
    { x: 60, y: 70, v: 30, bit: 0 },
    { x: 55, y: 50, v: 155, bit: 1 },
  ];
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      {neighbors.map((n, i) => (
        <line key={i} x1={center.x} y1={center.y} x2={n.x} y2={n.y} stroke="#c4b5fd" strokeWidth="1" />
      ))}
      {neighbors.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="9" fill={n.bit ? "#7c3aed" : "#e2e8f0"} stroke={n.bit ? "#5b21b6" : "#94a3b8"} strokeWidth="1" />
          <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="7" fill={n.bit ? "white" : "#64748b"} fontWeight="600">{n.bit}</text>
        </g>
      ))}
      <circle cx={center.x} cy={center.y} r="11" fill="#f1f5f9" stroke="#8b5cf6" strokeWidth="1.5" />
      <text x={center.x} y={center.y + 3} textAnchor="middle" fontSize="7" fill="#7c3aed" fontWeight="700">128</text>
      <text x="80" y="96" textAnchor="middle" fontSize="7" fill="#64748b">11010001 = LBP code</text>
    </svg>
  );
}

function GaborSVG() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      {[
        { angle: 0, cx: 32, cy: 50, color: "#8b5cf6" },
        { angle: 45, cx: 80, cy: 50, color: "#7c3aed" },
        { angle: 90, cx: 128, cy: 50, color: "#6d28d9" },
      ].map(({ angle, cx, cy, color }, idx) => {
        const stripes = [-16, -8, 0, 8, 16];
        return (
          <g key={idx}>
            <rect x={cx - 22} y={cy - 22} width="44" height="44" rx="22" fill="#f5f3ff" stroke={color} strokeWidth="1.5" />
            {stripes.map((offset, si) => {
              const rad = (angle * Math.PI) / 180;
              const cos = Math.cos(rad);
              const sin = Math.sin(rad);
              const x1 = cx + (offset * cos - 22 * sin);
              const y1 = cy + (offset * sin + 22 * cos);
              const x2 = cx + (offset * cos + 22 * sin);
              const y2 = cy + (offset * sin - 22 * cos);
              return (
                <line
                  key={si}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={color}
                  strokeWidth="2.5"
                  strokeOpacity={0.15 + si * 0.12}
                  clipPath={`circle(22px at ${cx}px ${cy}px)`}
                />
              );
            })}
            <text x={cx} y={cy + 32} textAnchor="middle" fontSize="7" fill={color}>{angle}°</text>
          </g>
        );
      })}
      <text x="80" y="10" textAnchor="middle" fontSize="7" fill="#64748b">Filters at multiple orientations &amp; scales</text>
    </svg>
  );
}

function HaralickSVG() {
  const features = [
    { label: "Contrast", val: 0.72, color: "#7c3aed" },
    { label: "Correlation", val: 0.45, color: "#8b5cf6" },
    { label: "Entropy", val: 0.88, color: "#6d28d9" },
    { label: "Homogeneity", val: 0.31, color: "#a78bfa" },
  ];
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <text x="80" y="10" textAnchor="middle" fontSize="7" fill="#64748b">GLCM → scalar statistics</text>
      {features.map((f, i) => (
        <g key={i}>
          <text x="8" y={25 + i * 20} fontSize="7" fill="#4c1d95" dominantBaseline="middle">{f.label}</text>
          <rect x="80" y={18 + i * 20} width="70" height="10" rx="5" fill="#ede9fe" />
          <rect x="80" y={18 + i * 20} width={70 * f.val} height="10" rx="5" fill={f.color} fillOpacity="0.7" />
          <text x={80 + 70 * f.val + 3} y={25 + i * 20} fontSize="6.5" fill="#4c1d95" dominantBaseline="middle">{f.val.toFixed(2)}</text>
        </g>
      ))}
    </svg>
  );
}

function StdStatsSVG() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <defs>
        <linearGradient id="gray-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>
      <rect x="15" y="25" width="130" height="28" rx="4" fill="url(#gray-grad)" />
      <line x1="80" y1="22" x2="80" y2="56" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="80" y="18" textAnchor="middle" fontSize="7" fill="#1d4ed8" fontWeight="600">μ = 128</text>
      <line x1="47" y1="60" x2="113" y2="60" stroke="#8b5cf6" strokeWidth="1.5" />
      <line x1="47" y1="56" x2="47" y2="64" stroke="#8b5cf6" strokeWidth="1.5" />
      <line x1="113" y1="56" x2="113" y2="64" stroke="#8b5cf6" strokeWidth="1.5" />
      <text x="80" y="72" textAnchor="middle" fontSize="7" fill="#7c3aed">σ = 51</text>
      <text x="80" y="92" textAnchor="middle" fontSize="7" fill="#64748b">Pixel intensity distribution</text>
    </svg>
  );
}

function EntropySVG() {
  const cells = Array.from({ length: 36 }, (_, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const grays = [180, 220, 95, 250, 40, 160, 210, 70, 230, 55, 195, 130,
                   85, 245, 115, 175, 60, 205, 150, 90, 235, 45, 190, 125,
                   215, 75, 165, 240, 100, 185, 140, 65, 225, 50, 200, 110];
    return { col, row, gray: grays[i] };
  });
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <rect x="8" y="18" width="52" height="52" rx="4" fill="#64748b" />
      <text x="34" y="84" textAnchor="middle" fontSize="7" fill="#475569" fontWeight="600">Low entropy</text>
      <text x="34" y="92" textAnchor="middle" fontSize="6.5" fill="#64748b">H ≈ 1.2 bits</text>
      {cells.map(({ col, row, gray }) => (
        <rect
          key={`${row}-${col}`}
          x={102 + col * 9}
          y={18 + row * 9}
          width="9"
          height="9"
          fill={`rgb(${gray},${gray},${gray})`}
        />
      ))}
      <text x="126" y="84" textAnchor="middle" fontSize="7" fill="#475569" fontWeight="600">High entropy</text>
      <text x="126" y="92" textAnchor="middle" fontSize="6.5" fill="#64748b">H ≈ 7.8 bits</text>
      <text x="80" y="48" textAnchor="middle" fontSize="14" fill="#94a3b8">→</text>
    </svg>
  );
}

function ZernikeSVG() {
  const shapes = [
    { cx: 35, cy: 50, angle: 0 },
    { cx: 80, cy: 50, angle: 45 },
    { cx: 125, cy: 50, angle: 90 },
  ];
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <text x="80" y="10" textAnchor="middle" fontSize="7" fill="#64748b">Same Zernike descriptor regardless of rotation</text>
      {shapes.map(({ cx, cy, angle }, i) => (
        <g key={i} transform={`rotate(${angle},${cx},${cy})`}>
          <ellipse cx={cx} cy={cy} rx="18" ry="12" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
          <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      ))}
      <text x="35" y="78" textAnchor="middle" fontSize="7" fill="#065f46">0°</text>
      <text x="80" y="78" textAnchor="middle" fontSize="7" fill="#065f46">45°</text>
      <text x="125" y="78" textAnchor="middle" fontSize="7" fill="#065f46">90°</text>
      <text x="80" y="92" textAnchor="middle" fontSize="7.5" fill="#059669" fontWeight="600">Z = [0.82, 0.14, 0.51, …]</text>
    </svg>
  );
}

function WaveletSVG() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <polyline
        points="10,55 20,45 30,30 40,48 50,55 60,42 70,28 80,50 90,58 100,40 110,25 120,45 130,55 140,38 150,50"
        fill="none" stroke="#10b981" strokeWidth="1.5"
      />
      <text x="12" y="65" fontSize="6.5" fill="#065f46">Original</text>
      <polyline
        points="10,70 30,65 50,72 70,68 90,73 110,67 130,72 150,69"
        fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 1"
      />
      <text x="12" y="82" fontSize="6.5" fill="#1d4ed8">Approx (low-freq)</text>
      <polyline
        points="10,90 20,87 30,93 40,88 50,91 60,87 70,94 80,89 90,92 100,88 110,93 120,89 130,91 140,87 150,90"
        fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="2 2"
      />
      <text x="12" y="100" fontSize="6.5" fill="#c2410c">Detail (high-freq)</text>
      <text x="80" y="10" textAnchor="middle" fontSize="7" fill="#64748b">Multi-scale decomposition</text>
    </svg>
  );
}

function EdgeDetectionSVG() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <rect x="10" y="20" width="60" height="60" rx="4" fill="#d1d5db" stroke="none" />
      <circle cx="40" cy="50" r="18" fill="#6b7280" />
      <text x="40" y="92" textAnchor="middle" fontSize="7" fill="#64748b">Original</text>
      <rect x="88" y="20" width="60" height="60" rx="4" fill="#0f172a" />
      <rect x="88" y="20" width="60" height="60" rx="4" fill="none" stroke="#f8fafc" strokeWidth="1.5" />
      <circle cx="118" cy="50" r="18" fill="none" stroke="#f8fafc" strokeWidth="1.5" />
      <text x="118" y="92" textAnchor="middle" fontSize="7" fill="#64748b">Edge map</text>
      <text x="80" y="12" textAnchor="middle" fontSize="8" fill="#d97706">→</text>
    </svg>
  );
}

function HOGSVG() {
  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const cx = 20 + c * 25;
      const cy = 20 + r * 20;
      const angle = ((r * 5 + c) * 37) % 180;
      const rad = (angle * Math.PI) / 180;
      const len = 8;
      cells.push({ cx, cy, rad, len });
    }
  }
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <text x="80" y="10" textAnchor="middle" fontSize="7" fill="#64748b">Gradient orientation per cell</text>
      {cells.map(({ cx, cy, rad, len }, i) => (
        <g key={i}>
          <rect x={cx - 11} y={cy - 9} width="22" height="18" fill="#fef3c7" stroke="#fde68a" strokeWidth="0.5" />
          <line
            x1={cx - Math.cos(rad) * len}
            y1={cy - Math.sin(rad) * len}
            x2={cx + Math.cos(rad) * len}
            y2={cy + Math.sin(rad) * len}
            stroke="#b45309"
            strokeWidth="1.5"
          />
        </g>
      ))}
    </svg>
  );
}

function SIFTSVG() {
  const keypoints = [
    { x: 45, y: 40, r: 14 },
    { x: 90, y: 60, r: 20 },
    { x: 130, y: 30, r: 10 },
  ];
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <text x="80" y="10" textAnchor="middle" fontSize="7" fill="#64748b">Keypoints + orientation descriptor</text>
      <rect x="5" y="15" width="150" height="80" rx="4" fill="#fef9f0" stroke="#fde68a" strokeWidth="1" />
      {keypoints.map(({ x, y, r }, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="none" stroke="#d97706" strokeWidth="1.5" />
          <line x1={x} y1={y} x2={x + r} y2={y} stroke="#d97706" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="2" fill="#b45309" />
        </g>
      ))}
    </svg>
  );
}

function HuMomentsSVG() {
  const shapes = [
    { cx: 30, cy: 45, rx: 18, ry: 11, angle: 0 },
    { cx: 80, cy: 55, rx: 18, ry: 11, angle: 60 },
    { cx: 130, cy: 42, rx: 12, ry: 8, angle: 30 },
  ];
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <text x="80" y="10" textAnchor="middle" fontSize="7" fill="#64748b">Rotation + scale + translation invariant</text>
      {shapes.map(({ cx, cy, rx, ry, angle }, i) => (
        <g key={i} transform={`rotate(${angle},${cx},${cy})`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        </g>
      ))}
      <text x="30" y="72" textAnchor="middle" fontSize="6.5" fill="#92400e">h = [0.21,…]</text>
      <text x="80" y="80" textAnchor="middle" fontSize="6.5" fill="#92400e">h = [0.21,…]</text>
      <text x="130" y="68" textAnchor="middle" fontSize="6.5" fill="#92400e">h = [0.21,…]</text>
    </svg>
  );
}

// ─── Visual registry ──────────────────────────────────────────────────────────

const VISUALS: Record<string, React.FC> = {
  "color-histogram": ColorHistogramSVG,
  "color-moments": ColorMomentsSVG,
  "dominant-colors": DominantColorsSVG,
  "color-coherence": ColorCoherenceSVG,
  glcm: GLCMSVG,
  lbp: LBPSVG,
  gabor: GaborSVG,
  haralick: HaralickSVG,
  "std-stats": StdStatsSVG,
  entropy: EntropySVG,
  zernike: ZernikeSVG,
  wavelet: WaveletSVG,
  "edge-detection": EdgeDetectionSVG,
  hog: HOGSVG,
  sift: SIFTSVG,
  "hu-moments": HuMomentsSVG,
};

// ─── Slide ────────────────────────────────────────────────────────────────────

const BADGE_COLORS: Record<AccentColor, string> = {
  blue: "bg-blue-100 text-blue-800",
  violet: "bg-violet-100 text-violet-800",
  emerald: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
};

const VISUAL_BG: Record<AccentColor, string> = {
  blue: "bg-blue-50",
  violet: "bg-violet-50",
  emerald: "bg-emerald-50",
  amber: "bg-amber-50",
};

function FeatureSlide({
  feature,
  accentColor,
  index,
  total,
}: {
  feature: CVFeature;
  accentColor: AccentColor;
  index: number;
  total: number;
}) {
  const headerGradient = HEADER_GRADIENT[accentColor];
  const nameColor = NAME_COLOR[accentColor];
  const Visual = VISUALS[feature.visual];

  return (
    <div className="flex flex-col gap-5">
      <div
        className={`flex flex-col items-center gap-3 -mx-6 -mt-6 md:-mx-8 md:-mt-8 px-6 py-5 mb-1 bg-gradient-to-br border-b ${headerGradient}`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE_COLORS[accentColor]}`}>
            {index + 1} of {total}
          </span>
        </div>
        <h3 className={`text-xl font-semibold text-center ${nameColor}`}>{feature.name}</h3>
        <div className={`w-full max-w-xs h-28 rounded-lg ${VISUAL_BG[accentColor]} p-2`}>
          {Visual ? <Visual /> : null}
        </div>
      </div>
      <p className="text-slate-700 leading-relaxed text-sm">{feature.description}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CVFeatureSlideshow({ category, intro, accentColor, features }: Props) {
  const slides = features.map((feature, i) => (
    <FeatureSlide
      key={feature.visual}
      feature={feature}
      accentColor={accentColor}
      index={i}
      total={features.length}
    />
  ));

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 pt-2">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">{category}</h3>
        <p className="text-slate-600 leading-relaxed">{intro}</p>
      </div>
      <Slideshow slides={slides} />
    </div>
  );
}
