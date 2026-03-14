"use client";

import {
  AreaChart,
  Area,
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
  const colors = resolveColors(config.colors || ["emerald"]);
  const showLegend = config.showLegend ?? categories.length > 1;

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data as Record<string, string | number>[]}>
            <defs>
              {categories.map((cat, i) => (
                <linearGradient key={cat} id={`grad-${cat}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid {...GRID_STYLE} vertical={false} />
            <XAxis dataKey={index} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={48} />
            <Tooltip {...TOOLTIP_STYLE} />
            {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />}
            {categories.map((cat, i) => (
              <Area
                key={cat}
                type="monotone"
                dataKey={cat}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                fill={`url(#grad-${cat})`}
                stackId={config.stack ? "stack" : undefined}
                animationDuration={600}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WidgetShell>
  );
}
