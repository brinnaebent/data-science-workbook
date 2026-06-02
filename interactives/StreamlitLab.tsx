"use client";

import { useState } from "react";

type StepId = "model" | "app" | "deploy" | "done";

interface Step {
  id: StepId;
  number: number;
  title: string;
  description: string;
  code?: string;
  language?: string;
  tasks: string[];
}

const STEPS: Step[] = [
  {
    id: "model",
    number: 1,
    title: "Save your model",
    description: "Before you can wrap a model in a demo, you need a saved model artifact. In scikit-learn, use joblib or pickle.",
    language: "python",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
import joblib

# Train
X, y = load_iris(return_X_y=True)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save
joblib.dump(model, "model.joblib")
print("Model saved → model.joblib")`,
    tasks: ["Install scikit-learn and joblib: pip install scikit-learn joblib", "Run the training script in your notebook or terminal", "Confirm model.joblib appears in your project directory"],
  },
  {
    id: "app",
    number: 2,
    title: "Wrap it in Streamlit",
    description: "Create app.py in the same directory as model.joblib. Streamlit re-runs the entire script on every user interaction.",
    language: "python",
    code: `import streamlit as st
import joblib
import numpy as np

# Load once (cached across reruns)
@st.cache_resource
def load_model():
    return joblib.load("model.joblib")

model = load_model()
CLASSES = ["Setosa", "Versicolor", "Virginica"]

st.title("Iris Classifier")
st.write("Adjust the sliders to get a prediction.")

sl = st.slider("Sepal length (cm)", 4.0, 8.0, 5.8)
sw = st.slider("Sepal width (cm)",  2.0, 4.5, 3.0)
pl = st.slider("Petal length (cm)", 1.0, 7.0, 4.0)
pw = st.slider("Petal width (cm)",  0.1, 2.5, 1.2)

if st.button("Predict"):
    pred = model.predict([[sl, sw, pl, pw]])[0]
    proba = model.predict_proba([[sl, sw, pl, pw]])[0]
    st.success(f"Predicted: **{CLASSES[pred]}**")
    st.bar_chart(dict(zip(CLASSES, proba)))`,
    tasks: ["pip install streamlit", "Create app.py with the code above", "Run locally: streamlit run app.py", "Open http://localhost:8501 and test the sliders"],
  },
  {
    id: "deploy",
    number: 3,
    title: "Deploy to Hugging Face Spaces",
    description: "Hugging Face Spaces hosts Streamlit apps for free. You need a requirements.txt and a README with the right metadata.",
    language: "bash",
    code: `# 1. requirements.txt  (in your project root)
# ────────────────────────
streamlit
scikit-learn
joblib
numpy

# 2. README.md  (Spaces reads this metadata)
# ────────────────────────
---
title: Iris Classifier
emoji: 🌸
colorFrom: blue
colorTo: green
sdk: streamlit
sdk_version: "1.32.0"
app_file: app.py
pinned: false
---

# 3. Push to Hugging Face
# ────────────────────────
git init
git add app.py model.joblib requirements.txt README.md
git commit -m "Initial Streamlit demo"
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/iris-demo
git push -u origin main`,
    tasks: ["Create a Hugging Face account at huggingface.co", "Create a new Space: hf.co/new-space → choose Streamlit", "Clone the Space repo, copy your files in, and push", "Wait ~2 minutes for the build — your URL is hf.co/spaces/YOU/iris-demo"],
  },
  {
    id: "done",
    number: 4,
    title: "You have a live URL",
    description: "Your model is deployed. Anyone with the URL can interact with your classifier. Now the portfolio work begins.",
    tasks: ["Share the URL in your portfolio / GitHub README", "Add a screenshot to your CV", "Write a 2-paragraph case study: what the model does, why the choices you made", "Repeat this workflow with every project you complete"],
  },
];

const STEP_COLORS: Record<StepId, { ring: string; badge: string; icon: string }> = {
  model: { ring: "ring-blue-300", badge: "bg-blue-50 border-blue-200 text-blue-700", icon: "🤖" },
  app: { ring: "ring-violet-300", badge: "bg-violet-50 border-violet-200 text-violet-700", icon: "🖥️" },
  deploy: { ring: "ring-emerald-300", badge: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: "🚀" },
  done: { ring: "ring-amber-300", badge: "bg-amber-50 border-amber-200 text-amber-700", icon: "✅" },
};

export default function StreamlitLab() {
  const [activeStep, setActiveStep] = useState<StepId>("model");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const step = STEPS.find((s) => s.id === activeStep)!;
  const stepIdx = STEPS.findIndex((s) => s.id === activeStep);
  const c = STEP_COLORS[activeStep];

  function toggleTask(key: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const stepTasks = step.tasks.map((_, i) => `${activeStep}-${i}`);
  const allDone = stepTasks.every((k) => completed.has(k));

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Streamlit Lab</span>
        <span className="text-xs text-slate-400">Step {stepIdx + 1} of {STEPS.length}</span>
      </div>

      {/* Step nav */}
      <div className="flex border-b border-slate-100 overflow-x-auto">
        {STEPS.map((s, i) => {
          const sc = STEP_COLORS[s.id];
          const isActive = s.id === activeStep;
          const stepKeys = s.tasks.map((_, ti) => `${s.id}-${ti}`);
          const isDone = stepKeys.every((k) => completed.has(k));
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`flex-1 px-3 py-3 text-xs font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 border-b-2 ${
                isActive
                  ? `border-indigo-500 text-indigo-700 bg-indigo-50`
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{isDone ? "✓" : s.number}</span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          );
        })}
      </div>

      <div className="p-5 space-y-5">
        {/* Step header */}
        <div className={`rounded-xl border-2 p-4 ${c.badge}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{c.icon}</span>
            <h3 className="text-sm font-bold">Step {step.number}: {step.title}</h3>
          </div>
          <p className="text-sm leading-relaxed">{step.description}</p>
        </div>

        {/* Code block */}
        {step.code && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600">Code</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">{step.language}</span>
            </div>
            <pre className="rounded-lg bg-slate-900 text-green-300 text-xs font-mono px-4 py-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {step.code}
            </pre>
          </div>
        )}

        {/* Checklist */}
        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">Do these tasks to complete this step:</p>
          <div className="space-y-2">
            {step.tasks.map((task, i) => {
              const key = `${activeStep}-${i}`;
              const done = completed.has(key);
              return (
                <label key={key} className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all ${done ? "bg-emerald-50 border-emerald-200" : "border-slate-200 hover:bg-slate-50"}`}>
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleTask(key)}
                    className="mt-0.5 accent-emerald-500"
                  />
                  <span className={`text-sm ${done ? "line-through text-slate-400" : "text-slate-700"}`}>{task}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Next step button */}
        {stepIdx < STEPS.length - 1 && (
          <div className="flex justify-end">
            <button
              onClick={() => setActiveStep(STEPS[stepIdx + 1].id)}
              disabled={!allDone}
              className={`text-sm px-5 py-2 rounded-lg font-semibold transition-all ${
                allDone
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {allDone ? `Next: ${STEPS[stepIdx + 1].title} →` : "Complete all tasks to continue"}
            </button>
          </div>
        )}

        {activeStep === "done" && allDone && (
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-sm font-bold text-emerald-700">Lab complete!</div>
            <p className="text-xs text-emerald-600 mt-1">You've trained a model, wrapped it in Streamlit, and deployed it. That URL on your portfolio is worth more than any bullet point.</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        This lab uses the Iris dataset as a stand-in. Repeat the same steps with any model from your projects.
      </div>
    </div>
  );
}
