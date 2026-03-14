"use client";

import { AreaChart } from "@tremor/react";
import type { Widget } from "@/lib/schemas";

interface AreaChartWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function AreaChartWidget({ widget, data }: AreaChartWidgetProps) {
  const config = widget.config as {
    index?: string;
    categories?: string[];
    colors?: string[];
    showLegend?: boolean;
    xAxis?: string;
    yAxis?: string;
    stack?: boolean;
  };

  const index = config.index || config.xAxis || "name";
  const categories = config.categories || (config.yAxis ? [config.yAxis] : []);
  const colors = config.colors || ["emerald"];

  return (
    <div className="h-full rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="mb-3 text-sm font-medium text-zinc-400">{widget.title}</p>
      <AreaChart
        data={data as Record<string, string | number>[]}
        index={index}
        categories={categories}
        colors={colors}
        showLegend={config.showLegend ?? true}
        stack={config.stack}
        className="h-[calc(100%-2rem)]"
      />
    </div>
  );
}
