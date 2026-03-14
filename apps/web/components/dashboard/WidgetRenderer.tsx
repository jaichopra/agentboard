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
      <div className="flex h-full items-center justify-center rounded-lg border border-red-800/50 bg-red-950/20 p-4">
        <p className="text-sm text-red-400">
          Unknown widget type: {widget.type}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-green-400" />
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-red-800/50 bg-red-950/20 p-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return <Component widget={widget} data={data} />;
}
