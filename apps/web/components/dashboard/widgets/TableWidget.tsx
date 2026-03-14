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
    (data.length > 0 ? Object.keys(data[0]).filter((k) => !k.startsWith("_")) : []);

  const rows = config.pageSize ? data.slice(0, config.pageSize) : data;

  return (
    <div className="h-full overflow-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="mb-3 text-sm font-medium text-zinc-400">{widget.title}</p>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 font-medium capitalize text-zinc-400"
              >
                {col.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-800/50">
              {columns.map((col) => (
                <td key={col} className="px-3 py-2 text-zinc-300">
                  {String(row[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
