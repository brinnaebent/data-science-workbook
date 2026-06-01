import Link from "next/link";
import { units } from "@/content";
import config from "../workbook.config";
import { PagefindSearch } from "@brinnaebent/workbook/client";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">
          Workbook
        </p>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
          {config.title}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          {config.description}
        </p>
        <div className="mt-8">
          <PagefindSearch />
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6">
        <hr className="border-slate-200" />
      </div>

      {/* Unit list */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-8">
          Units
        </h2>
        <ol className="space-y-4">
          {units.map((unit) => (
            <li key={unit.id}>
              <Link href={`/${unit.id}`} className="block">
                <div className="group flex items-start gap-6 rounded-2xl border border-slate-200 px-6 py-5 transition-colors hover:border-slate-300 hover:bg-slate-50 cursor-pointer">
                  <span className="mt-0.5 text-2xl font-bold text-slate-200 tabular-nums w-8 shrink-0">
                    {unit.number}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">
                      {unit.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                      {unit.description}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 self-center text-slate-300 group-hover:text-slate-500 transition-colors">
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
          About
        </h2>
        <p className="text-slate-600">
          This workbook was created and is maintained by Dr. Brinnae Bent at Duke University for AIPI 510: Data Sourcing for Analytics.{" "}
          {/* TODO: add your name(s) here */}
        </p>
      </section>
    </main>
  );
}
