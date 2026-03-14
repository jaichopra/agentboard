"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";
import { resolveColors, AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE } from "./chart-theme";

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
  const colors = resolveColors(config.colors || ["emerald"]);
  const showLegend = config.showLegend ?? categories.length > 1;

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data as Record<string, string | number>[]}>
            <CartesianGrid {...GRID_STYLE} vertical={false} />
            <XAxis dataKey={index} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={48} />
            <Tooltip {...TOOLTIP_STYLE} />
            {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />}
            {categories.map((cat, i) => (
              <Bar
                key={cat}
                dataKey={cat}
                fill={colors[i % colors.length]}
                radius={[4, 4, 0, 0]}
                stackId={config.stack ? "stack" : undefined}
                animationDuration={600}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WidgetShell>
  );
}
