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
    <div className="h-full rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="mb-3 text-sm font-medium text-zinc-400">{widget.title}</p>
      <DonutChart
        data={data as Record<string, string | number>[]}
        category={value}
        index={category}
        colors={colors}
        className="h-[calc(100%-2rem)]"
      />
    </div>
  );
}
