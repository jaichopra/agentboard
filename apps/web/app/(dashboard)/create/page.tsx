"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import DashboardRenderer from "@/components/dashboard/DashboardRenderer";
import type { DashboardSpec } from "@/lib/schemas";

export default function CreatePage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [preview, setPreview] = useState<DashboardSpec | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt;
    setPrompt("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, something went wrong. Make sure ANTHROPIC_API_KEY is set.",
          },
        ]);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      if (data.spec) {
        setPreview(data.spec);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to connect to the API." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const widgetData: Record<string, Record<string, unknown>[]> = {};
  if (preview) {
    for (const widget of preview.widgets) {
      if (widget.dataSource.type === "static" && widget.dataSource.data) {
        widgetData[widget.id] = widget.dataSource.data;
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Chat panel */}
        <div className="flex w-[400px] flex-col border-r border-zinc-800">
          <div className="border-b border-zinc-800 p-4">
            <h2 className="font-semibold text-zinc-100">Create Dashboard</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Describe what you want to see. The agent will build it.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-sm text-zinc-600">
                <p>Try prompts like:</p>
                <ul className="mt-2 space-y-1 text-zinc-500">
                  <li>&quot;Show me a sales dashboard with revenue by month&quot;</li>
                  <li>&quot;Track GitHub stars for anthropics/claude-code&quot;</li>
                  <li>&quot;Monitor AWS costs by service with daily refresh&quot;</li>
                </ul>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm ${
                  m.role === "user" ? "text-zinc-200" : "text-zinc-400"
                }`}
              >
                <span className="text-xs font-medium text-zinc-600">
                  {m.role === "user" ? "You" : "Agent"}
                </span>
                <p className="mt-1">{m.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-600 border-t-green-400" />
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dashboard..."
                className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-green-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Preview panel */}
        <div className="flex-1 overflow-y-auto bg-zinc-950">
          {preview ? (
            <DashboardRenderer spec={preview} widgetData={widgetData} />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-600">
              <div className="text-center">
                <p className="text-lg">Dashboard preview</p>
                <p className="mt-1 text-sm">
                  Your dashboard will appear here as the agent builds it
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
