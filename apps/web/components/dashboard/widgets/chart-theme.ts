/**
 * Shared chart theming for Recharts widgets.
 * Maps Tailwind color names to hex values and provides
 * consistent axis/grid/tooltip styling for dark mode.
 */

export const COLOR_MAP: Record<string, string> = {
  emerald: "#10b981",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  blue: "#3b82f6",
  indigo: "#6366f1",
  fuchsia: "#d946ef",
  lime: "#84cc16",
  orange: "#f97316",
  pink: "#ec4899",
  teal: "#14b8a6",
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#eab308",
  sky: "#0ea5e9",
  purple: "#a855f7",
};

export function resolveColor(name: string): string {
  return COLOR_MAP[name] || name; // passthrough if already hex
}

export function resolveColors(names: string[]): string[] {
  return names.map(resolveColor);
}

export const AXIS_STYLE = {
  fontSize: 12,
  fill: "#a1a1aa",
  fontFamily: "Inter, system-ui, sans-serif",
};

export const GRID_STYLE = {
  strokeDasharray: "3 3",
  stroke: "#27272a",
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#18181b",
    border: "1px solid #3f3f46",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    fontSize: 13,
    color: "#e4e4e7",
  },
  labelStyle: {
    color: "#fafafa",
    fontWeight: 600,
    marginBottom: 4,
  },
  itemStyle: {
    color: "#a1a1aa",
  },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};
