"use client";

import type { Widget } from "@/lib/schemas";

interface KPICardWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

function evaluateExpr(
  data: Record<string, unknown>[],
  expr: string
): number {
  const match = expr.match(/^(sum|avg|count|min|max)\((\w+)\)$/);
  if (!match) return 0;

  const [, fn, col] = match;
  const values = data.map((r) => Number(r[col]) || 0);

  switch (fn) {
    case "sum":
      return values.reduce((a, b) => a + b, 0);
    case "avg":
      return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    case "count":
      return values.length;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    default:
      return 0;
  }
}

export default function KPICardWidget({ widget, data }: KPICardWidgetProps) {
  const config = widget.config as {
    valueExpr?: string;
    prefix?: string;
    suffix?: string;
    trend?: { value: number; direction: string; isPositive: boolean };
  };

  const value = config.valueExpr ? evaluateExpr(data, config.valueExpr) : 0;
  const formatted = value.toLocaleString();

  return (
    <div className="flex h-full flex-col justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <p className="text-sm font-medium text-zinc-400">{widget.title}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-50">
        {config.prefix}
        {formatted}
        {config.suffix}
      </p>
      {config.trend && (
        <p
          className={`mt-1 text-sm ${
            config.trend.isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {config.trend.direction === "up" ? "+" : ""}
          {config.trend.value}%
        </p>
      )}
    </div>
  );
}
