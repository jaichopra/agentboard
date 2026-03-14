import { z } from "zod";

export const WIDGET_TYPES = [
  "area_chart",
  "bar_chart",
  "line_chart",
  "donut_chart",
  "kpi_card",
  "table",
  "text",
  "image",
  "image_grid",
  "video",
  "point_cloud",
  "map",
  "markdown",
  "code_block",
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

export const ImageConfigSchema = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
  objectFit: z.enum(["cover", "contain", "fill", "none"]).optional(),
  caption: z.string().optional(),
});

export const ImageGridConfigSchema = z.object({
  images: z.array(z.object({
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  })).optional(),
  columns: z.number().optional(),
  gap: z.number().optional(),
  objectFit: z.enum(["cover", "contain"]).optional(),
});

export const VideoConfigSchema = z.object({
  src: z.string().optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  muted: z.boolean().optional(),
  controls: z.boolean().optional(),
  caption: z.string().optional(),
});

export const PointCloudConfigSchema = z.object({
  points: z.array(z.array(z.number())).optional(),
  color: z.string().optional(),
  pointSize: z.number().optional(),
  backgroundColor: z.string().optional(),
});

export const MapConfigSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  zoom: z.number().optional(),
  markers: z.array(z.object({
    lat: z.number(),
    lng: z.number(),
    label: z.string().optional(),
    color: z.string().optional(),
  })).optional(),
  mapStyle: z.string().optional(),
});

export const MarkdownConfigSchema = z.object({
  content: z.string().optional(),
});

export const CodeBlockConfigSchema = z.object({
  code: z.string().optional(),
  language: z.string().optional(),
  showLineNumbers: z.boolean().optional(),
});

export const WidgetConfigSchema = z.union([
  ChartConfigSchema,
  KPIConfigSchema,
  TableConfigSchema,
  TextConfigSchema,
  ImageConfigSchema,
  ImageGridConfigSchema,
  VideoConfigSchema,
  PointCloudConfigSchema,
  MapConfigSchema,
  MarkdownConfigSchema,
  CodeBlockConfigSchema,
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
