"use client";

import { BarChart } from "@tremor/react";
import type { Widget } from "@/lib/schemas";

interface BarChartWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function BarChartWidget({ widget, data }: BarChartWidgetProps) {
  const config = widget.config as {
    index?: string;
    categories?: string[];
    colors?: string[];
    stack?: boolean;
    showLegend?: boolean;
    xAxis?: string;
    yAxis?: string;
  };

  const index = config.index || config.xAxis || "name";
  const categories =
    config.categories || (config.yAxis ? [config.yAxis] : []);
  const colors = config.colors || ["emerald"];

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm">
      <p className="mb-1 text-sm font-semibold text-zinc-200">
        {widget.title}
      </p>
      {widget.description && (
        <p className="mb-2 text-xs text-zinc-500">{widget.description}</p>
      )}
      <div className="min-h-0 flex-1">
        <BarChart
          data={data as Record<string, string | number>[]}
          index={index}
          categories={categories}
          colors={colors}
          stack={config.stack}
          showLegend={config.showLegend ?? categories.length > 1}
          showGridLines={true}
          showAnimation={true}
          className="h-full"
          yAxisWidth={48}
        />
      </div>
    </div>
  );
}
