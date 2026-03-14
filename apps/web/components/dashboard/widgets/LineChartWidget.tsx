"use client";

import {
  LineChart,
  Line,
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

interface LineChartWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function LineChartWidget({ widget, data }: LineChartWidgetProps) {
  const config = widget.config as {
    index?: string;
    categories?: string[];
    colors?: string[];
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
          <LineChart data={data as Record<string, string | number>[]}>
            <CartesianGrid {...GRID_STYLE} vertical={false} />
            <XAxis dataKey={index} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={48} />
            <Tooltip {...TOOLTIP_STYLE} />
            {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />}
            {categories.map((cat, i) => (
              <Line
                key={cat}
                type="monotone"
                dataKey={cat}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[i % colors.length], r: 3 }}
                activeDot={{ r: 5 }}
                animationDuration={600}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetShell>
  );
}
