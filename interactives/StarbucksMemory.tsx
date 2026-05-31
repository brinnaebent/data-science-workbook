"use client";

import { useRef, useState, useEffect } from "react";

type Stage = "draw" | "real" | "others" | "data" | "gallery";

const STAGES: Stage[] = ["draw", "real", "others", "data", "gallery"];

const STAGE_LABELS: Record<Stage, string> = {
  draw: "Draw from Memory",
  real: "The Real Logo",
  others: "What Others Drew",
  data: "How People Did",
  gallery: "On the Cup",
};

const COLORS = [
  "#166534", "#1e293b", "#f8fafc", "#b91c1c", "#1d4ed8",
  "#d97706", "#7c3aed", "#0e7490",
];

export default function StarbucksMemory() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<Stage>("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#166534");
  const [brushSize, setBrushSize] = useState(4);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    if (stage !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    setHasDrawn(true);
    lastPos.current = getPos(e, canvas);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing || stage !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    lastPos.current = pos;
  }

  function stopDraw() {
    setIsDrawing(false);
    lastPos.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }

  function advance() {
    const idx = STAGES.indexOf(stage);
    if (idx < STAGES.length - 1) setStage(STAGES[idx + 1]);
  }

  function back() {
    const idx = STAGES.indexOf(stage);
    if (idx > 0) setStage(STAGES[idx - 1]);
  }

  function restart() {
    setStage("draw");
    clearCanvas();
  }

  const stageIndex = STAGES.indexOf(stage);

  const backBtn = (
    <button
      onClick={back}
      className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
    >
      ← Back
    </button>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Branded in Memory
        </span>
        <div className="flex gap-1">
          {STAGES.map((s, i) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              title={STAGE_LABELS[s]}
              className={`h-1.5 w-6 rounded-full transition-all duration-200 cursor-pointer ${
                i <= stageIndex ? "bg-emerald-500 hover:bg-emerald-400" : "bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Stage heading */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 mb-1">
            Step {stageIndex + 1} of {STAGES.length}
          </p>
          <h3 className="text-base font-bold text-slate-800">{STAGE_LABELS[stage]}</h3>
        </div>

        {/* Stage: draw */}
        {stage === "draw" && (
          <>
            <p className="text-sm text-slate-600 leading-relaxed">
              Without looking it up, draw the Starbucks logo as accurately as you can.
              Use the tools below — take your time.
            </p>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                      color === c ? "border-slate-500 scale-110" : "border-slate-200 hover:border-slate-400"
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-400">Size</span>
                <input
                  type="range"
                  min={2}
                  max={20}
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20 accent-emerald-600 cursor-pointer"
                />
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1 rounded-md text-xs border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full rounded-lg border border-slate-200 touch-none bg-slate-50"
              style={{ cursor: "crosshair" }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />

            <div className="flex justify-between items-center">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
              >
                Start over
              </button>
              <button
                onClick={advance}
                disabled={!hasDrawn}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  hasDrawn
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Reveal the real logo →
              </button>
            </div>
          </>
        )}

        {/* Stage: real */}
        {stage === "real" && (
          <>
            <p className="text-sm text-slate-600 leading-relaxed">
              Here's the real Starbucks logo. Compare it to what you drew.
              What did you get right? What did your memory compress away?
            </p>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-4">
              <img
                src="/data-storytelling/starbucks_0.png"
                alt="The real Starbucks logo"
                className="max-h-80 object-contain rounded"
              />
            </div>
            <p className="text-xs text-slate-400 italic">
              Most people remember "green circle with a mermaid" — but the fine details of the crown,
              the star pattern, the exact pose of the siren? Those get lost.
            </p>
            <div className="flex justify-between items-center">
              {backBtn}
              <button
                onClick={advance}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              >
                See what others drew →
              </button>
            </div>
          </>
        )}

        {/* Stage: others */}
        {stage === "others" && (
          <>
            <p className="text-sm text-slate-600 leading-relaxed">
              You're not alone. Researchers asked hundreds of people to do exactly what you just did.
              Here's a sample of what came back.
            </p>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-4">
              <img
                src="/data-storytelling/starbucks_1.png"
                alt="Grid of drawings people made from memory of the Starbucks logo"
                className="max-h-96 object-contain rounded"
              />
            </div>
            <p className="text-xs text-slate-400 italic">
              Notice the patterns — most people captured the overall shape and color, but details
              vary wildly. Everyone compressed the same logo differently.
            </p>
            <div className="flex justify-between items-center">
              {backBtn}
              <button
                onClick={advance}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              >
                See the accuracy data →
              </button>
            </div>
          </>
        )}

        {/* Stage: data */}
        {stage === "data" && (
          <>
            <p className="text-sm text-slate-600 leading-relaxed">
              Each drawing was scored on accuracy across different elements of the logo.
              Some features — like the green color — were almost universally remembered.
              Others were almost universally forgotten.
            </p>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-4">
              <img
                src="/data-storytelling/starbucks_2.png"
                alt="Bar chart showing how accurately people recalled different features of the Starbucks logo"
                className="max-h-96 object-contain rounded"
              />
            </div>
            <p className="text-xs text-slate-400 italic">
              Source:{" "}
              <a
                href="https://www.signs.com/branded-in-memory/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                signs.com/branded-in-memory
              </a>
            </p>
            <div className="flex justify-between items-center">
              {backBtn}
              <button
                onClick={advance}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              >
                See the cup →
              </button>
            </div>
          </>
        )}

        {/* Stage: gallery */}
        {stage === "gallery" && (
          <>
            <p className="text-sm text-slate-600 leading-relaxed">
              A few of the drawings printed on an actual Starbucks cup. Same object, same brand,
              same logo everyone's seen a thousand times — but each person's mental representation
              came out completely different.
            </p>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-4">
              <img
                src="/data-storytelling/starbucks_3.gif"
                alt="A few people's hand-drawn Starbucks logos printed on a real cup"
                className="max-h-96 object-contain rounded"
              />
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
              <p className="text-sm text-emerald-900 leading-relaxed">
                <span className="font-semibold">The takeaway:</span> Every representation is a compression.
                You chose what to keep. Your brain chose what to store. The question is never
                "did you compress?" — it's always "what did you decide to throw away?"
              </p>
            </div>
            <div className="flex justify-between items-center">
              {backBtn}
              <button
                onClick={restart}
                className="px-5 py-2 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 transition-colors cursor-pointer"
              >
                Start over
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
