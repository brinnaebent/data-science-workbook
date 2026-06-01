"use client";

import { useState } from "react";

const PRESETS = [0, 1, 7, 42, 100, 200, 255];

function toBits(n: number): boolean[] {
  return Array.from({ length: 8 }, (_, i) => Boolean((n >> (7 - i)) & 1));
}

export default function BinaryConverter() {
  const [value, setValue] = useState(65);

  const bits = toBits(value);
  const onCount = bits.filter(Boolean).length;

  function toggle(i: number) {
    const flipped = value ^ (1 << (7 - i));
    setValue(flipped);
  }

  function handleSlider(raw: string) {
    setValue(Number(raw));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          How a Number Becomes Bits
        </span>
      </div>

      <div className="p-5 flex flex-col gap-6">

        {/* Concept line */}
        <p className="text-sm text-slate-600 leading-relaxed">
          A computer stores numbers as a row of switches — each one either{" "}
          <span className="text-emerald-600 font-semibold">ON</span> or{" "}
          <span className="text-slate-400 font-semibold">OFF</span>. Nothing else.
          Eight switches = one byte. Click any switch or drag the slider.
        </p>

        {/* The switches */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end gap-1.5">
            {bits.map((on, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                aria-label={`Bit ${7 - i}: ${on ? "ON" : "OFF"}`}
              >
                {/* Switch body */}
                <div
                  className={`w-full rounded-lg border-2 transition-all duration-150 flex items-center justify-center aspect-square text-xs font-mono font-bold
                    ${on
                      ? "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-200"
                      : "bg-white border-slate-300 text-slate-400 group-hover:border-slate-400"
                    }`}
                >
                  {on ? "1" : "0"}
                </div>
                {/* ON / OFF label */}
                <span className={`text-[9px] uppercase font-semibold tracking-wide ${on ? "text-emerald-600" : "text-slate-400"}`}>
                  {on ? "on" : "off"}
                </span>
              </button>
            ))}
          </div>

          {/* Bit position labels */}
          <div className="flex justify-between gap-1.5">
            {bits.map((_, i) => (
              <div key={i} className="flex-1 text-center text-[9px] text-slate-400 font-mono">
                bit {7 - i}
              </div>
            ))}
          </div>
        </div>

        {/* Result callout */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">This pattern of switches means</p>
            <p className="font-mono text-3xl font-bold text-slate-800">{value}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-0.5">Pattern</p>
            <p className="font-mono text-sm text-slate-700 tracking-widest">
              {bits.map(b => b ? "1" : "0").join("")}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{onCount} of 8 switches on</p>
          </div>
        </div>

        {/* Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>0</span>
            <span className="text-slate-500">drag to change the number</span>
            <span>255</span>
          </div>
          <input
            type="range"
            min={0}
            max={255}
            value={value}
            onChange={(e) => handleSlider(e.target.value)}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Try:</span>
          {PRESETS.map((n) => (
            <button
              key={n}
              onClick={() => setValue(n)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-colors cursor-pointer
                ${value === n
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
          With 8 switches you can represent 256 different patterns — the numbers 0 through 255.
          Every file, image, and message on any computer is ultimately stored as patterns like this.
        </p>

      </div>
    </div>
  );
}
