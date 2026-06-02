"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Channel = "rgb" | "grayscale";

const CHANNELS: { id: Channel; label: string; color: string }[] = [
  { id: "rgb", label: "Full Color", color: "text-slate-700" },
  { id: "grayscale", label: "Grayscale", color: "text-slate-700" },
];

// 16×12 pixel art of a simple house scene — stored as [r, g, b] triples
const PIXEL_DATA: [number, number, number][][] = [
  // Row 0 – sky
  [[135,180,220],[140,185,222],[145,188,225],[138,182,221],[132,177,218],[148,190,226],[142,186,223],[136,181,220],[144,187,224],[139,183,221],[133,178,219],[147,189,225],[141,185,222],[137,182,220],[143,186,223],[138,183,221]],
  // Row 1 – sky with sun
  [[140,185,222],[145,190,226],[200,200,100],[220,215,90],[200,200,100],[148,192,227],[143,187,224],[137,182,220],[146,189,225],[140,184,221],[134,179,219],[149,191,226],[143,186,223],[138,183,221],[144,187,224],[139,184,222]],
  // Row 2 – sky
  [[142,187,223],[147,192,227],[150,194,228],[144,188,224],[138,183,220],[152,196,229],[146,190,226],[140,185,222],[148,191,226],[142,186,223],[136,181,219],[151,194,227],[145,188,224],[140,184,222],[146,189,225],[141,185,223]],
  // Row 3 – rooftop peak
  [[142,187,223],[147,192,227],[144,188,224],[139,183,221],[185,75,60],[190,80,65],[185,75,60],[190,80,65],[185,75,60],[190,80,65],[138,183,220],[151,194,227],[145,188,224],[140,184,222],[146,189,225],[141,185,223]],
  // Row 4 – roof
  [[142,187,223],[147,192,227],[180,70,55],[190,80,65],[185,75,60],[190,80,65],[185,75,60],[190,80,65],[185,75,60],[188,78,63],[180,70,55],[145,189,225],[145,188,224],[140,184,222],[146,189,225],[141,185,223]],
  // Row 5 – roof base
  [[142,187,223],[175,65,50],[185,75,60],[192,82,67],[188,78,63],[193,83,68],[188,78,63],[193,83,68],[188,78,63],[192,82,67],[185,75,60],[175,65,50],[141,185,223],[140,184,222],[146,189,225],[141,185,223]],
  // Row 6 – house wall top
  [[142,187,223],[238,220,180],[242,224,184],[239,221,181],[243,225,185],[240,222,182],[244,226,186],[241,223,183],[245,227,187],[242,224,184],[239,221,181],[238,220,180],[141,185,223],[140,184,222],[146,189,225],[141,185,223]],
  // Row 7 – house wall with window
  [[142,187,223],[238,220,180],[100,130,180],[110,140,190],[240,222,182],[244,226,186],[241,223,183],[245,227,187],[100,130,180],[110,140,190],[239,221,181],[238,220,180],[141,185,223],[140,184,222],[146,189,225],[141,185,223]],
  // Row 8 – house wall with window bottom
  [[142,187,223],[238,220,180],[105,135,183],[112,142,193],[240,222,182],[244,226,186],[241,223,183],[245,227,187],[105,135,183],[112,142,193],[239,221,181],[238,220,180],[141,185,223],[140,184,222],[146,189,225],[141,185,223]],
  // Row 9 – house wall door
  [[142,187,223],[238,220,180],[242,224,184],[239,221,181],[243,225,185],[120,80,50],[130,90,60],[241,223,183],[245,227,187],[242,224,184],[239,221,181],[238,220,180],[141,185,223],[140,184,222],[146,189,225],[141,185,223]],
  // Row 10 – grass
  [[60,140,60],[65,145,65],[70,150,65],[62,142,62],[68,148,63],[66,146,61],[72,152,67],[64,144,64],[70,150,65],[67,147,62],[63,143,63],[69,149,64],[75,155,70],[65,145,65],[70,150,65],[67,147,63]],
  // Row 11 – grass dark
  [[45,115,45],[50,120,50],[55,125,50],[47,117,47],[53,123,48],[51,121,46],[57,127,52],[49,119,49],[55,125,50],[52,122,47],[48,118,48],[54,124,49],[60,130,55],[50,120,50],[55,125,50],[52,122,48]],
];

const ROWS = PIXEL_DATA.length;
const COLS = PIXEL_DATA[0].length;

// ITU-R BT.601 luminance weights
function toLuminance([r, g, b]: [number, number, number]): number {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

function toDisplayColor(pixel: [number, number, number], channel: Channel): string {
  if (channel === "rgb") return `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
  const l = toLuminance(pixel);
  return `rgb(${l},${l},${l})`;
}

export default function PixelExplorer() {
  const [activeChannel, setActiveChannel] = useState<Channel>("rgb");
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);
  const [tapped, setTapped] = useState<{ row: number; col: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const active = hovered ?? tapped;
  const handleMouseLeave = useCallback(() => setHovered(null), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setTapped(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pixel = active ? PIXEL_DATA[active.row][active.col] : null;
  const luminance = pixel ? toLuminance(pixel) : null;
  const barWidth = (v: number) => `${(v / 255) * 100}%`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Pixel Explorer
        </span>
      </div>

      {/* Channel tabs */}
      <div className="flex gap-1 px-4 pt-3 pb-0">
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id)}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-medium border-b-2 transition-colors duration-150 cursor-pointer ${
              activeChannel === ch.id
                ? `${ch.color} border-indigo-500 bg-slate-50`
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      {/* Main panel */}
      <div className="border border-slate-200 mx-4 mb-4 rounded-b-xl rounded-tr-xl overflow-hidden bg-slate-50/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Pixel grid */}
          <div className="p-5 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col items-center justify-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 self-start">
              Sample image ({COLS}×{ROWS} px)
            </p>
            <div
              ref={gridRef}
              className="relative select-none"
              style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 1, width: "100%", maxWidth: 320 }}
              onMouseLeave={handleMouseLeave}
            >
              {PIXEL_DATA.map((row, r) =>
                row.map((px, c) => {
                  const isActive = active?.row === r && active?.col === c;
                  return (
                    <div
                      key={`${r}-${c}`}
                      style={{ backgroundColor: toDisplayColor(px, activeChannel), aspectRatio: "1" }}
                      className={`cursor-crosshair transition-all duration-75 ${isActive ? "ring-2 ring-indigo-500 ring-inset z-10" : ""}`}
                      onMouseEnter={() => setHovered({ row: r, col: c })}
                      onClick={() => setTapped(tapped?.row === r && tapped?.col === c ? null : { row: r, col: c })}
                    />
                  );
                })
              )}
            </div>
            <p className="text-xs text-slate-400 italic">Hover or tap a pixel to inspect it</p>
          </div>

          {/* Pixel inspector */}
          <div className="p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pixel inspector
            </p>

            {pixel && luminance !== null ? (
              <>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">Position</span>
                  <span className="font-mono text-slate-700">col {active!.col}, row {active!.row}</span>
                </div>

                {activeChannel === "rgb" ? (
                  <>
                    {/* Color swatch */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg border border-slate-200 shrink-0"
                        style={{ backgroundColor: `rgb(${pixel[0]},${pixel[1]},${pixel[2]})` }}
                      />
                      <div className="font-mono text-sm text-slate-700 leading-relaxed">
                        <div>[{pixel[0]}, {pixel[1]}, {pixel[2]}]</div>
                        <div className="text-xs text-slate-400">
                          #{pixel[0].toString(16).padStart(2,"0")}{pixel[1].toString(16).padStart(2,"0")}{pixel[2].toString(16).padStart(2,"0")}
                        </div>
                      </div>
                    </div>

                    {/* RGB bars */}
                    <div className="flex flex-col gap-2">
                      {(["R","G","B"] as const).map((label, i) => {
                        const val = pixel[i];
                        const barColor = i === 0 ? "bg-red-500" : i === 1 ? "bg-green-500" : "bg-blue-500";
                        const textColor = i === 0 ? "text-red-500" : i === 1 ? "text-green-600" : "text-blue-500";
                        return (
                          <div key={label} className="flex items-center gap-2">
                            <span className={`font-mono font-bold text-sm w-4 shrink-0 ${textColor}`}>{label}</span>
                            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-150 ${barColor}`} style={{ width: barWidth(val) }} />
                            </div>
                            <span className="font-mono text-xs text-slate-600 w-8 text-right">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Grayscale swatch */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg border border-slate-200 shrink-0"
                        style={{ backgroundColor: `rgb(${luminance},${luminance},${luminance})` }}
                      />
                      <div className="font-mono text-sm text-slate-700 leading-relaxed">
                        <div>[{luminance}]</div>
                        <div className="text-xs text-slate-400">single channel</div>
                      </div>
                    </div>

                    {/* Luminance bar */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm w-4 shrink-0 text-slate-500">L</span>
                      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-150 bg-slate-500" style={{ width: barWidth(luminance) }} />
                      </div>
                      <span className="font-mono text-xs text-slate-600 w-8 text-right">{luminance}</span>
                    </div>

                    <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                      Luminance = 0.299 × {pixel[0]} + 0.587 × {pixel[1]} + 0.114 × {pixel[2]} = <span className="font-mono text-slate-700">{luminance}</span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" />
                </svg>
                <p className="text-xs text-center">Hover over a pixel<br />to inspect its values</p>
              </div>
            )}

            {/* Tensor shape callout */}
            <div className="mt-auto pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Tensor shape:{" "}
                <span className="font-mono text-slate-700">
                  [{ROWS}, {COLS}, {activeChannel === "rgb" ? 3 : 1}]
                </span>
                {" "}— {(ROWS * COLS * (activeChannel === "rgb" ? 3 : 1)).toLocaleString()} values total
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
