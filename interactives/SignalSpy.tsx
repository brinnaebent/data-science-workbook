"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Signal = {
  id: number;
  label: string;
  value: string;
  kind: "implicit" | "explicit" | "context";
  ts: number;
};

type Product = {
  id: string;
  title: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  tags: string[];
  description: string;
  image: string; // emoji stand-in
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: "$249",
    rating: 4.3,
    reviews: 2841,
    tags: ["Audio", "Wireless", "Travel"],
    description:
      "30-hour battery life, adaptive ANC, foldable design. Pairs instantly with up to 3 devices. Premium drivers deliver studio-quality sound across all frequencies.",
    image: "🎧",
  },
  {
    id: "p2",
    title: "Ceramic Pour-Over Coffee Set",
    category: "Kitchen",
    price: "$68",
    rating: 4.7,
    reviews: 512,
    tags: ["Coffee", "Handmade", "Gift"],
    description:
      "Hand-thrown ceramic dripper and server with bamboo stand. Includes 40 filters. Brews 1–4 cups. Dishwasher safe.",
    image: "☕",
  },
  {
    id: "p3",
    title: "Trail Running Shoes",
    category: "Sports",
    price: "$135",
    rating: 4.5,
    reviews: 1094,
    tags: ["Running", "Outdoor", "Waterproof"],
    description:
      "Aggressive lugs for loose terrain, waterproof membrane, rock plate under forefoot. Stack height 28mm. Available in 6 colorways.",
    image: "👟",
  },
];

const KIND_COLORS: Record<Signal["kind"], string> = {
  implicit: "bg-violet-50 border-violet-200 text-violet-700",
  explicit: "bg-emerald-50 border-emerald-200 text-emerald-700",
  context: "bg-amber-50 border-amber-200 text-amber-700",
};

const KIND_LABEL: Record<Signal["kind"], string> = {
  implicit: "Implicit",
  explicit: "Explicit",
  context: "Context",
};

let _id = 0;
function mkSignal(
  label: string,
  value: string,
  kind: Signal["kind"]
): Signal {
  return { id: _id++, label, value, kind, ts: Date.now() };
}

function StarRating({
  rating,
  onRate,
}: {
  rating: number | null;
  onRate: (r: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onRate(s)}
          className="text-xl leading-none transition-transform hover:scale-110"
          aria-label={`Rate ${s} stars`}
        >
          <span
            className={
              (hover ?? rating ?? 0) >= s
                ? "text-amber-400"
                : "text-slate-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default function SignalSpy() {
  const [productIdx, setProductIdx] = useState(0);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [viewStart, setViewStart] = useState<number>(Date.now());
  const [userRating, setUserRating] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [savedToList, setSavedToList] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">(
    "overview"
  );
  const panelRef = useRef<HTMLDivElement>(null);

  const product = PRODUCTS[productIdx];

  const push = useCallback(
    (...newSignals: Signal[]) => {
      setSignals((prev) => [...newSignals, ...prev].slice(0, 40));
      // scroll panel to top
      setTimeout(() => {
        panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    },
    []
  );

  // Context signals on mount
  useEffect(() => {
    const hour = new Date().getHours();
    const timeOfDay =
      hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      new Date().getDay()
    ];
    push(
      mkSignal("Time of day", timeOfDay, "context"),
      mkSignal("Day of week", day, "context"),
      mkSignal("Device type", "Desktop", "context"),
      mkSignal("Session start", "Page load", "implicit")
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track time-on-page
  useEffect(() => {
    setViewStart(Date.now());
    const intervals = [5, 15, 30, 60];
    const timers = intervals.map((sec) =>
      setTimeout(() => {
        push(mkSignal("Dwell time", `>${sec}s on page`, "implicit"));
      }, sec * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [productIdx, push]);

  // Reset per-product state when product changes
  useEffect(() => {
    setUserRating(null);
    setAddedToCart(false);
    setSavedToList(false);
    setDescExpanded(false);
    setActiveTab("overview");
  }, [productIdx]);

  function handleProductChange(idx: number) {
    const elapsed = Math.round((Date.now() - viewStart) / 1000);
    push(
      mkSignal("Time on page", `${elapsed}s`, "implicit"),
      mkSignal("Navigation", `→ ${PRODUCTS[idx].title}`, "implicit")
    );
    setProductIdx(idx);
    setSignals((prev) =>
      [
        mkSignal("Page view", PRODUCTS[idx].title, "implicit"),
        mkSignal("Category", PRODUCTS[idx].category, "context"),
      ].concat(prev)
    );
  }

  function handleRate(r: number) {
    setUserRating(r);
    push(mkSignal("Star rating", `${r} / 5 ★`, "explicit"));
  }

  function handleAddToCart() {
    if (addedToCart) return;
    setAddedToCart(true);
    push(mkSignal("Add to cart", product.title, "implicit"));
  }

  function handleSave() {
    setSavedToList((v) => {
      const next = !v;
      push(
        mkSignal(next ? "Save to list" : "Remove from list", product.title, "implicit")
      );
      return next;
    });
  }

  function handleExpandDesc() {
    if (descExpanded) return;
    setDescExpanded(true);
    push(mkSignal("Read description", "Expanded", "implicit"));
  }

  function handleTabChange(tab: "overview" | "reviews") {
    if (tab === activeTab) return;
    setActiveTab(tab);
    if (tab === "reviews") {
      push(mkSignal("Tab view", "Reviews tab opened", "implicit"));
    }
  }

  function handleTagClick(tag: string) {
    push(mkSignal("Tag click", tag, "implicit"));
  }

  const implicitCount = signals.filter((s) => s.kind === "implicit").length;
  const explicitCount = signals.filter((s) => s.kind === "explicit").length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm text-sm">
      {/* Header bar */}
      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Signal Spy — Interact with the page. Watch what gets logged.
        </span>
      </div>

      <div className="flex h-[480px]">
        {/* ── Left: simulated product page ── */}
        <div className="flex-1 border-r border-slate-100 overflow-y-auto">
          {/* Product nav */}
          <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex gap-1 flex-wrap">
            {PRODUCTS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handleProductChange(i)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  i === productIdx
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {p.image} {p.title.split(" ").slice(0, 2).join(" ")}
              </button>
            ))}
          </div>

          {/* Main product content */}
          <div className="px-5 py-4">
            {/* Image + title row */}
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center text-4xl shrink-0">
                {product.image}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 mb-0.5">{product.category}</p>
                <h3 className="font-semibold text-slate-800 leading-snug mb-1">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-amber-500 font-bold">
                    {product.rating}★
                  </span>
                  <span className="text-slate-400 text-xs">
                    ({product.reviews.toLocaleString()} reviews)
                  </span>
                  <span className="font-bold text-slate-800">{product.price}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 mb-3 gap-4">
              {(["overview", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`text-xs pb-1.5 border-b-2 capitalize font-medium transition-colors ${
                    activeTab === tab
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="space-y-3">
                {/* Description */}
                <div>
                  <p
                    className={`text-xs text-slate-600 leading-relaxed ${
                      descExpanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {product.description}
                  </p>
                  {!descExpanded && (
                    <button
                      onClick={handleExpandDesc}
                      className="text-xs text-indigo-500 hover:text-indigo-700 mt-1"
                    >
                      Read more
                    </button>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Rate it */}
                <div className="pt-1">
                  <p className="text-xs text-slate-400 mb-1.5">Rate this item</p>
                  <StarRating rating={userRating} onRate={handleRate} />
                  {userRating && (
                    <p className="text-xs text-emerald-600 mt-1">
                      You rated {userRating}/5
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-2.5">
                {[
                  { user: "alex_m", stars: 5, text: "Exactly what I needed. Fast shipping too." },
                  { user: "coffee_nut", stars: 4, text: "Great quality but runs a bit small." },
                  { user: "techreader", stars: 3, text: "Decent but I expected more for the price." },
                ].map((r, i) => (
                  <div key={i} className="text-xs text-slate-600 border border-slate-100 rounded-lg px-3 py-2">
                    <span className="font-medium text-slate-700">{r.user}</span>
                    <span className="text-amber-400 ml-2">{"★".repeat(r.stars)}</span>
                    <p className="mt-0.5 text-slate-500">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="px-5 py-3 border-t border-slate-100 flex gap-2 flex-wrap sticky bottom-0 bg-white">
            <button
              onClick={handleAddToCart}
              className={`flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                addedToCart
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {addedToCart ? "✓ In Cart" : "Add to Cart"}
            </button>
            <button
              onClick={handleSave}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                savedToList
                  ? "bg-pink-50 text-pink-600 border-pink-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {savedToList ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
        </div>

        {/* ── Right: signals panel ── */}
        <div className="w-64 flex flex-col shrink-0 min-h-0">
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex-1">
              Signals Collected
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {signals.length} events
            </span>
          </div>

          {/* Legend */}
          <div className="px-3 py-1.5 flex gap-2 border-b border-slate-100 flex-wrap">
            {(["implicit", "explicit", "context"] as const).map((k) => (
              <span
                key={k}
                className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${KIND_COLORS[k]}`}
              >
                {KIND_LABEL[k]}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 flex gap-3 text-[10px] text-slate-500">
            <span>
              <span className="font-semibold text-violet-600">{implicitCount}</span> implicit
            </span>
            <span>
              <span className="font-semibold text-emerald-600">{explicitCount}</span> explicit
            </span>
          </div>

          {/* Signal feed */}
          <div
            ref={panelRef}
            className="flex-1 overflow-y-auto divide-y divide-slate-50"
          >
            {signals.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8 px-3">
                Interact with the page to generate signals.
              </p>
            )}
            {signals.map((s) => (
              <div
                key={s.id}
                className="px-3 py-1.5 flex items-start gap-2 text-[11px] animate-[fadeSlideIn_0.2s_ease]"
              >
                <span
                  className={`mt-0.5 shrink-0 text-[9px] px-1 py-0.5 rounded border font-semibold leading-none ${KIND_COLORS[s.kind]}`}
                >
                  {KIND_LABEL[s.kind][0]}
                </span>
                <div className="min-w-0">
                  <span className="text-slate-500">{s.label}: </span>
                  <span className="font-medium text-slate-700">{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
