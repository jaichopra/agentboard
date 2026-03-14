"use client";

import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";

interface TextWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function TextWidget({ widget, data }: TextWidgetProps) {
  const config = widget.config as {
    content?: string;
    variant?: "paragraph" | "heading" | "callout";
  };
  const content = config.content || widget.description || "";
  const variant = config.variant || "paragraph";

  return (
    <WidgetShell title={widget.title} noTitle={variant === "heading"}>
      {variant === "heading" && (
        <h2 className="text-xl font-bold text-zinc-50">{content}</h2>
      )}
      {variant === "callout" && (
        <div className="w-full rounded-lg border border-green-800/40 bg-green-950/20 p-4 text-sm leading-relaxed text-green-300">
          {content}
        </div>
      )}
      {variant === "paragraph" && (
        <p className="text-sm leading-relaxed text-zinc-400">{content}</p>
      )}
    </WidgetShell>
  );
}
