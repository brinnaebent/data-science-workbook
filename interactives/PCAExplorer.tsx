"use client";

import { useState, useMemo } from "react";

// ----- Data ----------------------------------------------------------------

// 2D dataset: two correlated features (height-ish vs weight-ish, normalized)
// Generated once with a fixed seed so the shape is always the same
const RAW_POINTS: [number, number][] = [
  [2.1, 1.8], [1.5, 1.3], [3.2, 2.9], [0.8, 0.5], [2.8, 2.4],
  [1.2, 1.0], [3.6, 3.3], [0.5, 0.2], [2.4, 2.6], [1.9, 1.6],
  [3.0, 2.7], [0.3, 0.7], [1.7, 1.4], [2.6, 2.2], [3.8, 3.6],
  [1.1, 0.9], [2.9, 3.1], [0.7, 0.4], [2.2, 2.0], [1.4, 1.7],
  [3.4, 3.0], [0.9, 1.1], [2.7, 2.5], [1.6, 1.2], [3.1, 2.8],
  [0.6, 0.8], [2.3, 2.1], [1.8, 1.5], [3.5, 3.2], [1.0, 1.3],
];

// Center the data (subtract mean)
function centerData(pts: [number, number][]): [number, number][] {
  const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([x, y]) => [x - mx, y - my]);
}

const POINTS = centerData(RAW_POINTS);

// ----- Math ----------------------------------------------------------------

function dot(a: [number, number], b: [number, number]) {
  return a[0] * b[0] + a[1] * b[1];
}

function norm(v: [number, number]) {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2);
}

function project1D(pts: [number, number][], axis: [number, number]): number[] {
  const n = norm(axis);
  return pts.map((p) => dot(p, [axis[0] / n, axis[1] / n]));
}

function variance1D(vals: number[]): number {
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  return vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
}

// Compute 2x2 covariance matrix eigenvalues/vectors analytically
function pca2D(pts: [number, number][]): {
  pc1: [number, number];
  pc2: [number, number];
  var1: number;
  var2: number;
  totalVar: number;
} {
  const n = pts.length;
  let cxx = 0, cxy = 0, cyy = 0;
  for (const [x, y] of pts) {
    cxx += x * x;
    cxy += x * y;
    cyy += y * y;
  }
  cxx /= n; cxy /= n; cyy /= n;

  // Eigenvalues of [[cxx, cxy],[cxy, cyy]]
  const trace = cxx + cyy;
  const det = cxx * cyy - cxy * cxy;
  const disc = Math.sqrt(Math.max(0, (trace / 2) ** 2 - det));
  const lam1 = trace / 2 + disc;
  const lam2 = trace / 2 - disc;

  // Eigenvectors
  let v1: [number, number];
  if (Math.abs(cxy) > 1e-10) {
    const nx = lam1 - cyy;
    const ny = cxy;
    const mag = Math.sqrt(nx * nx + ny * ny);
    v1 = [nx / mag, ny / mag];
  } else {
    v1 = cxx >= cyy ? [1, 0] : [0, 1];
  }
  const v2: [number, number] = [-v1[1], v1[0]];

  return {
    pc1: v1,
    pc2: v2,
    var1: lam1,
    var2: lam2,
    totalVar: lam1 + lam2,
  };
}

// ----- SVG helpers ---------------------------------------------------------

const SVG_W = 420;
const SVG_H = 320;
const CX = SVG_W / 2;
const CY = SVG_H / 2;
const SCALE = 58; // data units → pixels

function dataToSVG(x: number, y: number): [number, number] {
  return [CX + x * SCALE, CY - y * SCALE];
}

// ----- Tabs ----------------------------------------------------------------

type Tab = "variance" | "principal" | "projection" | "scree";

const TABS: { id: Tab; label: string; shortLabel: string }[] = [
  { id: "variance", label: "1. What is variance?", shortLabel: "Variance" },
  { id: "principal", label: "2. Principal components", shortLabel: "Components" },
  { id: "projection", label: "3. The projection", shortLabel: "Projection" },
  { id: "scree", label: "4. Choosing k", shortLabel: "Scree plot" },
];

// ----- Component -----------------------------------------------------------

export default function PCAExplorer() {
  const [tab, setTab] = useState<Tab>("variance");
  const [angleDeg, setAngleDeg] = useState(45); // for variance tab
  const [k, setK] = useState(1); // for scree tab

  const { pc1, pc2, var1, var2, totalVar } = useMemo(() => pca2D(POINTS), []);

  const angleRad = (angleDeg * Math.PI) / 180;
  const axis: [number, number] = [Math.cos(angleRad), Math.sin(angleRad)];
  const proj1D = useMemo(() => project1D(POINTS, axis), [angleDeg]);
  const currentVar = useMemo(() => variance1D(proj1D), [proj1D]);
  const maxVar = var1;

  const pct1 = (var1 / totalVar) * 100;
  const pct2 = (var2 / totalVar) * 100;

  // Projected points onto PC1 and PC2
  const projOntoPC1: [number, number][] = POINTS.map((p) => {
    const s = dot(p, pc1);
    return [s * pc1[0], s * pc1[1]];
  });
  const projOntoPC2: [number, number][] = POINTS.map((p) => {
    const s = dot(p, pc2);
    return [s * pc2[0], s * pc2[1]];
  });

  // Projection lines for current axis (variance tab)
  const varProjPoints: [number, number][] = POINTS.map((p) => {
    const s = dot(p, axis) / (norm(axis) ** 2);
    return [axis[0] * s * (norm(axis) ** 2) / norm(axis), axis[1] * s * (norm(axis) ** 2) / norm(axis)];
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          PCA Explorer — How Principal Component Analysis Works
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-100 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tab 1: Variance                                                     */}
      {/* ------------------------------------------------------------------ */}
      {tab === "variance" && (
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            PCA finds the direction in feature space that <strong>captures the most variance</strong>. Drag the angle below to rotate a projection axis. Watch how the spread of projected points changes — and notice what happens near 45°.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Scatter + projection */}
            <div>
              <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto select-none rounded-lg bg-slate-50 border border-slate-100">
                {/* Axis lines */}
                <line x1={0} y1={CY} x2={SVG_W} y2={CY} stroke="#e2e8f0" strokeWidth={1} />
                <line x1={CX} y1={0} x2={CX} y2={SVG_H} stroke="#e2e8f0" strokeWidth={1} />

                {/* Projection axis */}
                {(() => {
                  const ex = axis[0] * 180;
                  const ey = axis[1] * 180;
                  return (
                    <line
                      x1={CX - ex} y1={CY + ey}
                      x2={CX + ex} y2={CY - ey}
                      stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" opacity={0.7}
                    />
                  );
                })()}

                {/* Projection lines (thin, gray) */}
                {POINTS.map((p, i) => {
                  const [px, py] = dataToSVG(p[0], p[1]);
                  const pp = varProjPoints[i];
                  const [ppx, ppy] = dataToSVG(pp[0], pp[1]);
                  return (
                    <line key={i} x1={px} y1={py} x2={ppx} y2={ppy}
                      stroke="#a5b4fc" strokeWidth={1} opacity={0.5} />
                  );
                })}

                {/* Projected points on axis */}
                {varProjPoints.map((p, i) => {
                  const [px, py] = dataToSVG(p[0], p[1]);
                  return <circle key={`proj-${i}`} cx={px} cy={py} r={3} fill="#6366f1" opacity={0.5} />;
                })}

                {/* Original points */}
                {POINTS.map(([x, y], i) => {
                  const [px, py] = dataToSVG(x, y);
                  return <circle key={i} cx={px} cy={py} r={4} fill="#10b981" opacity={0.8} />;
                })}
              </svg>
              <p className="text-[11px] text-slate-400 mt-1 text-center">
                Green = original points · Purple = projections onto axis
              </p>
            </div>

            {/* Controls + variance meter */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Axis angle: <span className="text-indigo-600 font-mono">{angleDeg}°</span>
                </label>
                <input
                  type="range" min={0} max={179} value={angleDeg}
                  onChange={(e) => setAngleDeg(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0° (horizontal)</span>
                  <span>90° (vertical)</span>
                  <span>179°</span>
                </div>
              </div>

              {/* Variance meter */}
              <div>
                <div className="flex items-end justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">Captured variance</span>
                  <span className="text-xs font-mono text-indigo-600">
                    {((currentVar / maxVar) * 100).toFixed(0)}% of max
                  </span>
                </div>
                <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-100"
                    style={{
                      width: `${(currentVar / maxVar) * 100}%`,
                      background: `hsl(${180 + (currentVar / maxVar) * 60}, 80%, 45%)`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  σ² = {currentVar.toFixed(3)}
                </p>
              </div>

              <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 space-y-1">
                <p className="text-xs font-semibold text-indigo-700">Why does ~45° capture the most?</p>
                <p className="text-xs text-indigo-600 leading-relaxed">
                  The two features are positively correlated — points stretch diagonally. The axis aligned with that diagonal captures the longest spread. PCA finds this automatically.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-600">The math</p>
                <p className="text-xs text-slate-500 font-mono leading-relaxed">
                  Var(Xw) = wᵀΣw
                </p>
                <ul className="space-y-1 text-xs text-slate-500 list-disc list-inside">
                  <li><strong>w</strong> — the unit vector defining the axis direction</li>
                  <li><strong>Σ</strong> — the covariance matrix: captures how every pair of features varies together</li>
                  <li><strong>wᵀΣw</strong> — the variance of the data after projecting onto w</li>
                  <li><strong>‖w‖ = 1</strong> — we constrain the axis to be a unit vector so that length doesn&apos;t inflate the variance</li>
                </ul>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Maximizing <span className="font-mono">wᵀΣw</span> subject to <span className="font-mono">‖w‖ = 1</span> is a constrained optimization problem. Using Lagrange multipliers, it reduces to solving <span className="font-mono">Σw = λw</span> — the definition of an eigenvector. The largest eigenvalue <span className="font-mono">λ</span> gives the maximum variance, and its eigenvector is PC1.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Tab 2: Principal components                                         */}
      {/* ------------------------------------------------------------------ */}
      {tab === "principal" && (
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            PCA finds a new coordinate system defined by <strong>principal components</strong> — orthogonal axes ordered by how much variance they capture. PC1 captures the most, PC2 the rest.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto select-none rounded-lg bg-slate-50 border border-slate-100">
                {/* Grid */}
                <line x1={0} y1={CY} x2={SVG_W} y2={CY} stroke="#e2e8f0" strokeWidth={1} />
                <line x1={CX} y1={0} x2={CX} y2={SVG_H} stroke="#e2e8f0" strokeWidth={1} />

                {/* PC2 axis */}
                {(() => {
                  const scale = 150;
                  return (
                    <g>
                      <line
                        x1={CX - pc2[0] * scale} y1={CY + pc2[1] * scale}
                        x2={CX + pc2[0] * scale} y2={CY - pc2[1] * scale}
                        stroke="#f59e0b" strokeWidth={2} opacity={0.8}
                      />
                      <text
                        x={CX + pc2[0] * scale + (pc2[0] > 0 ? 6 : -32)}
                        y={CY - pc2[1] * scale + (pc2[1] > 0 ? -6 : 14)}
                        fontSize={11} fontWeight={700} fill="#d97706"
                      >
                        PC2
                      </text>
                    </g>
                  );
                })()}

                {/* PC1 axis */}
                {(() => {
                  const scale = 150;
                  return (
                    <g>
                      <line
                        x1={CX - pc1[0] * scale} y1={CY + pc1[1] * scale}
                        x2={CX + pc1[0] * scale} y2={CY - pc1[1] * scale}
                        stroke="#6366f1" strokeWidth={2.5} opacity={0.9}
                      />
                      {/* Arrowhead */}
                      <polygon
                        points={`
                          ${CX + pc1[0] * scale},${CY - pc1[1] * scale}
                          ${CX + pc1[0] * scale - pc1[0] * 12 + pc1[1] * 7},${CY - pc1[1] * scale + pc1[1] * 12 + pc1[0] * 7}
                          ${CX + pc1[0] * scale - pc1[0] * 12 - pc1[1] * 7},${CY - pc1[1] * scale + pc1[1] * 12 - pc1[0] * 7}
                        `}
                        fill="#6366f1"
                      />
                      <text
                        x={CX + pc1[0] * scale + 10}
                        y={CY - pc1[1] * scale - 6}
                        fontSize={11} fontWeight={700} fill="#6366f1"
                      >
                        PC1
                      </text>
                    </g>
                  );
                })()}

                {/* Original points */}
                {POINTS.map(([x, y], i) => {
                  const [px, py] = dataToSVG(x, y);
                  return <circle key={i} cx={px} cy={py} r={4} fill="#10b981" opacity={0.8} />;
                })}
              </svg>
            </div>

            <div className="space-y-4">
              {/* Variance bars */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-3">Variance explained by each component</p>
                <div className="space-y-3">
                  {[
                    { label: "PC1", pct: pct1, color: "bg-indigo-400", textColor: "text-indigo-700", vec: pc1 },
                    { label: "PC2", pct: pct2, color: "bg-amber-400", textColor: "text-amber-700", vec: pc2 },
                  ].map(({ label, pct, color, textColor, vec }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
                        <span className="text-xs font-mono text-slate-500">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        direction = [{vec[0].toFixed(3)}, {vec[1].toFixed(3)}]
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-600">Key properties</p>
                <ul className="space-y-1 text-xs text-slate-500 list-disc list-inside">
                  <li>Components are <strong>orthogonal</strong> — at right angles to each other</li>
                  <li>Each component is a <strong>linear combination</strong> of original features</li>
                  <li>They are ordered: PC1 &gt; PC2 &gt; ... by variance</li>
                  <li>Total variance is preserved (just redistributed)</li>
                </ul>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 space-y-2">
                <p className="text-xs font-semibold text-amber-700">Eigendecomposition</p>
                <p className="text-xs text-amber-600 font-mono">Σ = V · Λ · Vᵀ</p>
                <ul className="space-y-1 text-xs text-amber-700 list-disc list-inside">
                  <li><strong>Eigenvector</strong> — a direction that the matrix only <em>scales</em>, never rotates. For the covariance matrix, each eigenvector is a principal component: a direction of pure variance with no mix-in from other directions.</li>
                  <li><strong>Eigenvalue λ</strong> — the scale factor: how much variance exists along that eigenvector. Larger λ means more spread in that direction.</li>
                  <li><strong>V</strong> — matrix whose columns are the eigenvectors (the PCs shown on the plot)</li>
                  <li><strong>Λ</strong> — diagonal matrix of eigenvalues; the diagonal entries are the per-component variances above</li>
                </ul>
                <p className="text-xs text-amber-600 leading-relaxed">
                  In practice, PCA is computed via SVD rather than explicitly forming Σ — it&apos;s more numerically stable and works even when you have more features than samples.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Tab 3: Projection                                                   */}
      {/* ------------------------------------------------------------------ */}
      {tab === "projection" && (
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            To reduce from 2D to 1D, PCA <strong>projects every point onto PC1</strong>. Each point is replaced by its coordinate along PC1 — we lose the PC2 component entirely. You can see both the original positions and their reconstructions below.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] text-slate-500 mb-1 font-medium">Original 2D space</p>
              <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto select-none rounded-lg bg-slate-50 border border-slate-100">
                <line x1={0} y1={CY} x2={SVG_W} y2={CY} stroke="#e2e8f0" strokeWidth={1} />
                <line x1={CX} y1={0} x2={CX} y2={SVG_H} stroke="#e2e8f0" strokeWidth={1} />

                {/* PC1 axis */}
                <line
                  x1={CX - pc1[0] * 180} y1={CY + pc1[1] * 180}
                  x2={CX + pc1[0] * 180} y2={CY - pc1[1] * 180}
                  stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" opacity={0.6}
                />

                {/* Projection lines */}
                {POINTS.map((p, i) => {
                  const [ox, oy] = dataToSVG(p[0], p[1]);
                  const pp = projOntoPC1[i];
                  const [ppx, ppy] = dataToSVG(pp[0], pp[1]);
                  return (
                    <line key={i} x1={ox} y1={oy} x2={ppx} y2={ppy}
                      stroke="#fca5a5" strokeWidth={1} opacity={0.6} />
                  );
                })}

                {/* Projected (reconstructed) points */}
                {projOntoPC1.map(([x, y], i) => {
                  const [px, py] = dataToSVG(x, y);
                  return <circle key={`r-${i}`} cx={px} cy={py} r={4} fill="#6366f1" opacity={0.7} />;
                })}

                {/* Original points */}
                {POINTS.map(([x, y], i) => {
                  const [px, py] = dataToSVG(x, y);
                  return <circle key={i} cx={px} cy={py} r={4} fill="#10b981" opacity={0.8} />;
                })}
              </svg>
              <p className="text-[11px] text-slate-400 mt-1 text-center">
                Green = original · Purple = projected onto PC1 · Red lines = information lost
              </p>
            </div>

            <div className="space-y-4">
              {/* Reconstruction error */}
              <div className="rounded-lg bg-rose-50 border border-rose-100 p-3">
                <p className="text-xs font-semibold text-rose-700 mb-1">Information lost (reconstruction error)</p>
                <p className="text-xs text-rose-600 leading-relaxed">
                  Each red line is the component discarded — the PC2 coordinate. Projecting back to the original space from just PC1 produces a point <em>on</em> the PC1 axis, not the original.
                </p>
                <p className="text-xs font-mono text-rose-500 mt-2">
                  error = {(var2 / totalVar * 100).toFixed(1)}% of total variance
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-600">The projection formula</p>
                <p className="text-xs text-slate-500 font-mono">z = x · pc1</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For each data point <span className="font-mono">x</span>, the dot product with <span className="font-mono">pc1</span> gives a single number <span className="font-mono">z</span> — the signed distance along PC1. This is the point&apos;s new coordinate in the reduced space. Two points with the same <span className="font-mono">z</span> are indistinguishable after reduction, no matter how different they were in the original space.
                </p>
                <p className="text-xs text-slate-500 font-mono mt-1">X̂ = z · pc1</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To reconstruct back to original coordinates, multiply the score by the PC1 direction vector. The result lands exactly on the PC1 axis — not at the original point. The gap between <span className="font-mono">x</span> and <span className="font-mono">X̂</span> is the red line: the information that was discarded.
                </p>
              </div>

              <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
                <p className="text-xs font-semibold text-indigo-700 mb-1">Choosing k components</p>
                <p className="text-xs text-indigo-600 leading-relaxed">
                  With k=1 here we keep {pct1.toFixed(1)}% of variance. With k=2 (all components) we keep 100%. In practice you pick k using a <strong>scree plot</strong> — see the next tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Tab 4: Scree plot                                                   */}
      {/* ------------------------------------------------------------------ */}
      {tab === "scree" && (
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            A <strong>scree plot</strong>{" "}shows explained variance per component. Look for the &quot;elbow&quot; — the point where adding more components gives diminishing returns. The cumulative line shows how much total variance you retain with k components.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Scree visualization */}
            <div>
              <p className="text-[11px] text-slate-500 mb-1 font-medium">Explained variance per component</p>
              <svg viewBox="0 0 420 240" className="w-full h-auto select-none rounded-lg bg-slate-50 border border-slate-100">
                {/* Y gridlines */}
                {[0, 25, 50, 75, 100].map((pct) => {
                  const y = 200 - (pct / 100) * 160;
                  return (
                    <g key={pct}>
                      <line x1={50} y1={y} x2={390} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                      <text x={44} y={y + 4} fontSize={9} fill="#94a3b8" textAnchor="end">{pct}%</text>
                    </g>
                  );
                })}

                {/* Individual bars */}
                {[pct1, pct2].map((pct, i) => {
                  const barX = 90 + i * 140;
                  const barH = (pct / 100) * 160;
                  const isSelected = i + 1 <= k;
                  return (
                    <g key={i}>
                      <rect
                        x={barX - 30} y={200 - barH} width={60} height={barH}
                        fill={isSelected ? "#6366f1" : "#e2e8f0"}
                        rx={4}
                        className="cursor-pointer transition-colors"
                        onClick={() => setK(i + 1)}
                      />
                      <text x={barX} y={200 - barH - 5} fontSize={10} fill={isSelected ? "#6366f1" : "#94a3b8"} textAnchor="middle" fontWeight={700}>
                        {pct.toFixed(1)}%
                      </text>
                      <text x={barX} y={218} fontSize={10} fill="#64748b" textAnchor="middle">PC{i + 1}</text>
                    </g>
                  );
                })}

                {/* Cumulative line */}
                {(() => {
                  const cumPcts = [pct1, pct1 + pct2];
                  const xs = [90, 230];
                  const points = xs.map((x, i) => {
                    const y = 200 - (cumPcts[i] / 100) * 160;
                    return `${x},${y}`;
                  });
                  return (
                    <g>
                      <polyline
                        points={points.join(" ")}
                        fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="5 3"
                      />
                      {xs.map((x, i) => {
                        const y = 200 - (cumPcts[i] / 100) * 160;
                        return <circle key={i} cx={x} cy={y} r={4} fill="#10b981" />;
                      })}
                    </g>
                  );
                })()}

                {/* Legend */}
                <g>
                  <rect x={290} y={15} width={12} height={12} fill="#6366f1" rx={2} />
                  <text x={307} y={25} fontSize={9} fill="#64748b">Selected</text>
                  <rect x={290} y={32} width={12} height={12} fill="#e2e8f0" rx={2} />
                  <text x={307} y={42} fontSize={9} fill="#64748b">Not selected</text>
                  <line x1={290} y1={52} x2={302} y2={52} stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" />
                  <text x={307} y={56} fontSize={9} fill="#64748b">Cumulative</text>
                </g>
              </svg>
              <p className="text-[11px] text-slate-400 mt-1 text-center">Click a bar to select k components</p>
            </div>

            {/* k selector + summary */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  k = <span className="text-indigo-600">{k}</span> component{k > 1 ? "s" : ""}
                </label>
                <input
                  type="range" min={1} max={2} value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Retention summary */}
              <div className="rounded-lg border border-slate-100 overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Variance retained</span>
                </div>
                <div className="p-3">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-bold text-indigo-600">
                      {(k === 1 ? pct1 : 100).toFixed(1)}%
                    </span>
                    <span className="text-xs text-slate-400">with k={k}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-400 transition-all duration-300"
                      style={{ width: `${k === 1 ? pct1 : 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-600">Reading the scree plot</p>
                <ul className="space-y-1 text-xs text-slate-500 list-disc list-inside">
                  <li>Look for an <strong>elbow</strong> — steep drop followed by flatness</li>
                  <li>Common rule: keep components that explain &gt;1× average variance</li>
                  <li>Common rule: keep components until cumulative ≥ 90–95%</li>
                  <li>In real datasets there are many components — the shape matters</li>
                </ul>
              </div>

              <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                <p className="text-xs font-semibold text-emerald-700 mb-1">Practical note</p>
                <p className="text-xs text-emerald-600 leading-relaxed">
                  This dataset has only 2 features so there are only 2 components. In a real 100-feature dataset, you might find that k=5 captures 90% of variance — reducing 100 dimensions to 5 with minimal loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-4 flex-wrap">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-xs transition-colors ${
              tab === t.id ? "text-indigo-600 font-semibold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {i + 1}. {t.shortLabel}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-slate-300">
          30 synthetic data points · centered
        </span>
      </div>
    </div>
  );
}
