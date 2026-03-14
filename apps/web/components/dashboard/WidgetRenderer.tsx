"use client";

import { WIDGET_REGISTRY } from "./widgets";
import type { Widget } from "@/lib/schemas";

interface WidgetRendererProps {
  widget: Widget;
  data: Record<string, unknown>[];
  isLoading?: boolean;
  error?: string;
}

export default function WidgetRenderer({
  widget,
  data,
  isLoading,
  error,
}: WidgetRendererProps) {
  const Component = WIDGET_REGISTRY[widget.type];

  if (!Component) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-red-900/50 bg-red-950/10 p-5">
        <p className="text-sm text-red-400/80">
          Unknown widget type: {widget.type}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-2.5 text-sm text-zinc-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-green-500" />
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-red-900/50 bg-red-950/10 p-5">
        <p className="text-sm text-red-400/80">{error}</p>
      </div>
    );
  }

  return <Component widget={widget} data={data} />;
}
