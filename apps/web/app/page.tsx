import Link from "next/link";
import Header from "@/components/layout/Header";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { DEMO_DASHBOARDS } from "@/lib/demo-data";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-50 sm:text-6xl">
            Dashboards powered by{" "}
            <span className="text-green-400">AI agents</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Describe what you want to see. Agentboard creates the data pipeline,
            stores results in LanceDB, and renders a live dashboard — all
            orchestrated by AI agents running on Modal.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/create"
              className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-500 transition-colors"
            >
              Create a Dashboard
            </Link>
            <Link
              href="/docs"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-colors"
            >
              View Docs
            </Link>
          </div>

          {/* Quick start for engineers */}
          <div className="mt-12 mx-auto max-w-md">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 text-left">
              <p className="mb-2 text-xs font-medium text-zinc-500">
                Quick start
              </p>
              <code className="text-sm text-green-400">
                pip install agentboard
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-zinc-800/50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-zinc-100">
            How it works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-950 text-green-400 text-lg font-bold">
                1
              </div>
              <h3 className="mt-4 font-semibold text-zinc-200">Describe</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Tell the agent what data you want to track and how you want to
                see it. Or define it in code with the Python SDK.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-950 text-green-400 text-lg font-bold">
                2
              </div>
              <h3 className="mt-4 font-semibold text-zinc-200">
                Agent builds it
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Claude generates the dashboard spec, creates data pipelines on
                Modal, and stores results in LanceDB.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-950 text-green-400 text-lg font-bold">
                3
              </div>
              <h3 className="mt-4 font-semibold text-zinc-200">
                Live & refreshing
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Your dashboard stays live with scheduled agent refreshes. Share
                it or publish it to the gallery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-100">
              Community Dashboards
            </h2>
            <Link
              href="/gallery"
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="mt-6">
            <GalleryGrid dashboards={DEMO_DASHBOARDS} />
          </div>
        </div>
      </section>

      {/* Engineer section */}
      <section className="border-t border-zinc-800/50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-zinc-100">
            Built for engineers
          </h2>
          <p className="mt-3 text-center text-zinc-500">
            Use the Python SDK to define dashboards as code. Let Claude handle the rest.
          </p>
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <pre className="overflow-x-auto text-sm leading-relaxed">
              <code className="text-zinc-300">
                <span className="text-violet-400">from</span>{" "}
                <span className="text-zinc-100">agentboard</span>{" "}
                <span className="text-violet-400">import</span>{" "}
                <span className="text-zinc-100">
                  AgentboardClient, Dashboard, Widget, DataPipeline
                </span>
                {"\n\n"}
                <span className="text-zinc-100">client</span>{" "}
                <span className="text-zinc-500">=</span>{" "}
                <span className="text-green-400">AgentboardClient</span>
                <span className="text-zinc-500">(</span>
                <span className="text-zinc-100">api_key</span>
                <span className="text-zinc-500">=</span>
                <span className="text-amber-300">{'"ab_..."'}</span>
                <span className="text-zinc-500">)</span>
                {"\n\n"}
                <span className="text-zinc-600">
                  # Let Claude build the whole thing
                </span>
                {"\n"}
                <span className="text-zinc-100">result</span>{" "}
                <span className="text-zinc-500">=</span>{" "}
                <span className="text-zinc-100">client</span>
                <span className="text-zinc-500">.</span>
                <span className="text-green-400">create_with_agent</span>
                <span className="text-zinc-500">(</span>
                {"\n"}
                {"    "}
                <span className="text-zinc-100">prompt</span>
                <span className="text-zinc-500">=</span>
                <span className="text-amber-300">
                  {
                    '"Track GitHub stars for my repo with daily refresh"'
                  }
                </span>
                {"\n"}
                <span className="text-zinc-500">)</span>
                {"\n"}
                <span className="text-green-400">print</span>
                <span className="text-zinc-500">(</span>
                <span className="text-zinc-100">result</span>
                <span className="text-zinc-500">.</span>
                <span className="text-zinc-100">url</span>
                <span className="text-zinc-500">)</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-600">
          Agentboard — AI-powered dashboards
        </div>
      </footer>
    </div>
  );
}
