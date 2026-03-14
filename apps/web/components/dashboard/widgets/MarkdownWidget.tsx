"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";

interface MarkdownWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function MarkdownWidget({ widget, data }: MarkdownWidgetProps) {
  const config = widget.config as { content?: string };
  const content = config.content || (data[0]?.content as string) || "";

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div className="prose prose-invert prose-sm max-w-none min-h-0 flex-1 overflow-auto prose-headings:text-zinc-200 prose-p:text-zinc-400 prose-a:text-cyan-400 prose-strong:text-zinc-300 prose-code:text-emerald-400 prose-code:bg-zinc-800 prose-code:rounded prose-code:px-1 prose-pre:bg-zinc-800/80 prose-pre:border prose-pre:border-zinc-700/50 prose-blockquote:border-zinc-700 prose-blockquote:text-zinc-400 prose-th:text-zinc-300 prose-td:text-zinc-400 prose-hr:border-zinc-700">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </WidgetShell>
  );
}
