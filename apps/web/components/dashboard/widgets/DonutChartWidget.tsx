"use client";

import { DonutChart } from "@tremor/react";
import type { Widget } from "@/lib/schemas";

interface DonutChartWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function DonutChartWidget({
  widget,
  data,
}: DonutChartWidgetProps) {
  const config = widget.config as {
    index?: string;
    categories?: string[];
    colors?: string[];
    xAxis?: string;
    yAxis?: string;
  };

  const category = config.index || config.xAxis || "name";
  const value = config.categories?.[0] || config.yAxis || "value";
  const colors = config.colors || [
    "emerald",
    "cyan",
    "violet",
    "amber",
    "rose",
  ];

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-zinc-200">
        {widget.title}
      </p>
      {widget.description && (
        <p className="mb-2 text-xs text-zinc-500">{widget.description}</p>
      )}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <DonutChart
          data={data as Record<string, string | number>[]}
          category={value}
          index={category}
          colors={colors}
          showAnimation={true}
          showLabel={true}
          showTooltip={true}
          variant="donut"
          className="h-full w-full"
        />
      </div>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.slice(0, 6).map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: getColorValue(colors[i % colors.length]),
              }}
            />
            <span className="text-xs text-zinc-400">
              {String(item[category])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getColorValue(name: string): string {
  const map: Record<string, string> = {
    emerald: "#10b981",
    cyan: "#06b6d4",
    violet: "#8b5cf6",
    amber: "#f59e0b",
    rose: "#f43f5e",
    blue: "#3b82f6",
    indigo: "#6366f1",
    fuchsia: "#d946ef",
    lime: "#84cc16",
    orange: "#f97316",
    pink: "#ec4899",
    teal: "#14b8a6",
    red: "#ef4444",
    green: "#22c55e",
    yellow: "#eab308",
    sky: "#0ea5e9",
    purple: "#a855f7",
  };
  return map[name] || "#71717a";
}
