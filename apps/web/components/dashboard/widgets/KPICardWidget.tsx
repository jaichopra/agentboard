"use client";

import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";

interface KPICardWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

function evaluateExpr(data: Record<string, unknown>[], expr: string): number {
  const match = expr.match(/^(sum|avg|count|min|max)\((\w+)\)$/);
  if (!match) return 0;
  const [, fn, col] = match;
  const values = data.map((r) => Number(r[col]) || 0);
  switch (fn) {
    case "sum": return values.reduce((a, b) => a + b, 0);
    case "avg": return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    case "count": return values.length;
    case "min": return Math.min(...values);
    case "max": return Math.max(...values);
    default: return 0;
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
  const formatted = value.toLocaleString(undefined, { maximumFractionDigits: 1 });

  return (
    <WidgetShell title={widget.title} labelTitle>
      <div>
        <p className="text-4xl font-bold tracking-tight text-zinc-50">
          {config.prefix}{formatted}{config.suffix}
        </p>
        {config.trend && (
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                config.trend.isPositive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {config.trend.direction === "up" ? "\u2191" : "\u2193"} {config.trend.value}%
            </span>
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
