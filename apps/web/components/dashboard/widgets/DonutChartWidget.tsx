"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";
import { resolveColors, TOOLTIP_STYLE } from "./chart-theme";

interface DonutChartWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function DonutChartWidget({ widget, data }: DonutChartWidgetProps) {
  const config = widget.config as {
    index?: string;
    categories?: string[];
    colors?: string[];
    xAxis?: string;
    yAxis?: string;
  };

  const nameKey = config.index || config.xAxis || "name";
  const valueKey = config.categories?.[0] || config.yAxis || "value";
  const colors = resolveColors(
    config.colors || ["emerald", "cyan", "violet", "amber", "rose"]
  );

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data as Record<string, string | number>[]}
              dataKey={valueKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              animationDuration={600}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip {...TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.slice(0, 6).map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="text-xs text-zinc-400">
              {String(item[nameKey])}
            </span>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}
