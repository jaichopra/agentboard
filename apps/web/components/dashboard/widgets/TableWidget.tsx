"use client";

import type { Widget } from "@/lib/schemas";

interface TableWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function TableWidget({ widget, data }: TableWidgetProps) {
  const config = widget.config as {
    columns?: string[];
    pageSize?: number;
  };

  const columns =
    config.columns ||
    (data.length > 0
      ? Object.keys(data[0]).filter((k) => !k.startsWith("_"))
      : []);

  const rows = config.pageSize ? data.slice(0, config.pageSize) : data;

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm">
      <p className="mb-3 text-sm font-semibold text-zinc-200">
        {widget.title}
      </p>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-zinc-900">
            <tr className="border-b border-zinc-700/50">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-zinc-800/40 transition-colors hover:bg-zinc-800/30"
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2.5 text-zinc-300">
                    {formatValue(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "\u2014";
  if (typeof val === "number") return val.toLocaleString();
  return String(val);
}
