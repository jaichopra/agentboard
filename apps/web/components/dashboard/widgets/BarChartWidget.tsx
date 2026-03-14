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
  const categories = config.categories || (config.yAxis ? [config.yAxis] : []);
  const colors = config.colors || ["emerald"];

  return (
    <div className="h-full rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="mb-3 text-sm font-medium text-zinc-400">{widget.title}</p>
      <BarChart
        data={data as Record<string, string | number>[]}
        index={index}
        categories={categories}
        colors={colors}
        stack={config.stack}
        showLegend={config.showLegend ?? true}
        className="h-[calc(100%-2rem)]"
      />
    </div>
  );
}
