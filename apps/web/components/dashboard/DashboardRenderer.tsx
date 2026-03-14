"use client";

import type { DashboardSpec } from "@/lib/schemas";
import WidgetRenderer from "./WidgetRenderer";

interface DashboardRendererProps {
  spec: DashboardSpec;
  widgetData: Record<string, Record<string, unknown>[]>;
  loadingWidgets?: Set<string>;
  widgetErrors?: Record<string, string>;
}

export default function DashboardRenderer({
  spec,
  widgetData,
  loadingWidgets,
  widgetErrors,
}: DashboardRendererProps) {
  const maxRow = Math.max(
    ...spec.widgets.map((w) => w.layout.row + w.layout.rowSpan - 1)
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
          {spec.title}
        </h1>
        {spec.description && (
          <p className="mt-2 text-sm text-zinc-500">{spec.description}</p>
        )}
        {spec.tags.length > 0 && (
          <div className="mt-3 flex gap-2">
            {spec.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-2.5 py-0.5 text-xs font-medium text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: `repeat(${maxRow}, 160px)`,
        }}
      >
        {spec.widgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              gridColumn: `${widget.layout.column} / span ${widget.layout.columnSpan}`,
              gridRow: `${widget.layout.row} / span ${widget.layout.rowSpan}`,
            }}
          >
            <WidgetRenderer
              widget={widget}
              data={widgetData[widget.id] || []}
              isLoading={loadingWidgets?.has(widget.id)}
              error={widgetErrors?.[widget.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
