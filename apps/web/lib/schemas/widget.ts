import { z } from "zod";

export const WIDGET_TYPES = [
  "area_chart",
  "bar_chart",
  "line_chart",
  "donut_chart",
  "kpi_card",
  "table",
  "text",
  "combo_chart",
  "spark_chart",
  "tracker",
  "progress_bar",
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

export const WidgetDataSourceSchema = z.object({
  type: z.enum(["modal_endpoint", "lancedb_query", "static"]),
  endpoint: z.string().optional(),
  table: z.string().optional(),
  query: z
    .object({
      columns: z.array(z.string()).optional(),
      filter: z.string().optional(),
      limit: z.number().optional(),
      orderBy: z.string().optional(),
    })
    .optional(),
  data: z.array(z.record(z.unknown())).optional(),
  refreshInterval: z.number().default(0),
});

export const WidgetLayoutSchema = z.object({
  column: z.number().min(1).max(12),
  columnSpan: z.number().min(1).max(12),
  row: z.number().min(1),
  rowSpan: z.number().min(1).max(6),
});

export const ChartConfigSchema = z.object({
  xAxis: z.string().optional(),
  yAxis: z.string().optional(),
  categories: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  index: z.string().optional(),
  valueFormatter: z.string().optional(),
  showLegend: z.boolean().optional(),
  showGrid: z.boolean().optional(),
  stack: z.boolean().optional(),
});

export const KPIConfigSchema = z.object({
  valueExpr: z.string(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  trend: z
    .object({
      value: z.number(),
      direction: z.enum(["up", "down", "flat"]),
      isPositive: z.boolean(),
    })
    .optional(),
});

export const TableConfigSchema = z.object({
  columns: z.array(z.string()).optional(),
  pageSize: z.number().optional(),
  sortable: z.boolean().optional(),
});

export const TextConfigSchema = z.object({
  content: z.string(),
  variant: z.enum(["paragraph", "heading", "callout"]).optional(),
});

export const WidgetConfigSchema = z.union([
  ChartConfigSchema,
  KPIConfigSchema,
  TableConfigSchema,
  TextConfigSchema,
  z.record(z.unknown()),
]);

export const WidgetSchema = z.object({
  id: z.string(),
  type: z.enum(WIDGET_TYPES),
  title: z.string(),
  description: z.string().optional(),
  layout: WidgetLayoutSchema,
  dataSource: WidgetDataSourceSchema,
  config: WidgetConfigSchema,
});

export type Widget = z.infer<typeof WidgetSchema>;
export type WidgetDataSource = z.infer<typeof WidgetDataSourceSchema>;
export type WidgetLayout = z.infer<typeof WidgetLayoutSchema>;
