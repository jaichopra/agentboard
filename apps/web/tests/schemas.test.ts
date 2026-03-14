import { describe, it, expect } from "vitest";
import {
  WidgetSchema,
  WIDGET_TYPES,
  WidgetLayoutSchema,
  WidgetDataSourceSchema,
  ChartConfigSchema,
  KPIConfigSchema,
  ImageConfigSchema,
  VideoConfigSchema,
  MapConfigSchema,
  MarkdownConfigSchema,
  CodeBlockConfigSchema,
  PointCloudConfigSchema,
} from "@/lib/schemas/widget";

describe("WIDGET_TYPES", () => {
  it("includes all expected widget types", () => {
    const expected = [
      "area_chart", "bar_chart", "line_chart", "donut_chart",
      "kpi_card", "table", "text",
      "image", "image_grid", "video",
      "point_cloud", "map", "markdown", "code_block",
    ];
    for (const t of expected) {
      expect(WIDGET_TYPES).toContain(t);
    }
  });

  it("has 14 widget types", () => {
    expect(WIDGET_TYPES).toHaveLength(14);
  });
});

describe("WidgetLayoutSchema", () => {
  it("validates a correct layout", () => {
    const result = WidgetLayoutSchema.safeParse({
      column: 1, columnSpan: 6, row: 1, rowSpan: 3,
    });
    expect(result.success).toBe(true);
  });

  it("rejects column > 12", () => {
    const result = WidgetLayoutSchema.safeParse({
      column: 13, columnSpan: 1, row: 1, rowSpan: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects rowSpan > 6", () => {
    const result = WidgetLayoutSchema.safeParse({
      column: 1, columnSpan: 1, row: 1, rowSpan: 7,
    });
    expect(result.success).toBe(false);
  });
});

describe("WidgetDataSourceSchema", () => {
  it("validates static data source", () => {
    const result = WidgetDataSourceSchema.safeParse({
      type: "static",
      data: [{ x: 1 }],
      refreshInterval: 0,
    });
    expect(result.success).toBe(true);
  });

  it("defaults refreshInterval to 0", () => {
    const result = WidgetDataSourceSchema.parse({
      type: "static",
    });
    expect(result.refreshInterval).toBe(0);
  });

  it("rejects unknown data source type", () => {
    const result = WidgetDataSourceSchema.safeParse({
      type: "unknown",
    });
    expect(result.success).toBe(false);
  });
});

describe("ChartConfigSchema", () => {
  it("validates chart config", () => {
    const result = ChartConfigSchema.safeParse({
      index: "month",
      categories: ["revenue"],
      colors: ["emerald"],
    });
    expect(result.success).toBe(true);
  });

  it("allows empty config", () => {
    const result = ChartConfigSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("KPIConfigSchema", () => {
  it("validates KPI config with trend", () => {
    const result = KPIConfigSchema.safeParse({
      valueExpr: "sum(revenue)",
      prefix: "$",
      trend: { value: 12, direction: "up", isPositive: true },
    });
    expect(result.success).toBe(true);
  });

  it("requires valueExpr", () => {
    const result = KPIConfigSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("Multimodal config schemas", () => {
  it("validates ImageConfigSchema", () => {
    const result = ImageConfigSchema.safeParse({
      src: "https://example.com/img.jpg",
      objectFit: "cover",
      caption: "A photo",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid objectFit in ImageConfigSchema", () => {
    const result = ImageConfigSchema.safeParse({
      objectFit: "stretch",
    });
    expect(result.success).toBe(false);
  });

  it("validates VideoConfigSchema", () => {
    const result = VideoConfigSchema.safeParse({
      src: "https://youtube.com/watch?v=abc",
      autoplay: false,
      controls: true,
    });
    expect(result.success).toBe(true);
  });

  it("validates MapConfigSchema with markers", () => {
    const result = MapConfigSchema.safeParse({
      latitude: 37.77,
      longitude: -122.42,
      zoom: 12,
      markers: [
        { lat: 37.77, lng: -122.42, label: "SF", color: "#10b981" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects MapConfigSchema marker without lat", () => {
    const result = MapConfigSchema.safeParse({
      markers: [{ lng: -122.42 }],
    });
    expect(result.success).toBe(false);
  });

  it("validates MarkdownConfigSchema", () => {
    const result = MarkdownConfigSchema.safeParse({
      content: "## Hello\n\nWorld",
    });
    expect(result.success).toBe(true);
  });

  it("validates CodeBlockConfigSchema", () => {
    const result = CodeBlockConfigSchema.safeParse({
      code: "const x = 1;",
      language: "typescript",
      showLineNumbers: true,
    });
    expect(result.success).toBe(true);
  });

  it("validates PointCloudConfigSchema", () => {
    const result = PointCloudConfigSchema.safeParse({
      points: [[0, 0, 0], [1, 1, 1]],
      color: "#06b6d4",
      pointSize: 0.05,
    });
    expect(result.success).toBe(true);
  });
});

describe("WidgetSchema", () => {
  it("validates a complete bar_chart widget", () => {
    const result = WidgetSchema.safeParse({
      id: "w1",
      type: "bar_chart",
      title: "Revenue",
      layout: { column: 1, columnSpan: 12, row: 1, rowSpan: 3 },
      dataSource: { type: "static", data: [], refreshInterval: 0 },
      config: { index: "month", categories: ["revenue"], colors: ["emerald"] },
    });
    expect(result.success).toBe(true);
  });

  it("validates a map widget", () => {
    const result = WidgetSchema.safeParse({
      id: "m1",
      type: "map",
      title: "Locations",
      layout: { column: 1, columnSpan: 6, row: 1, rowSpan: 3 },
      dataSource: { type: "static", data: [], refreshInterval: 0 },
      config: { latitude: 40.7, longitude: -74.0, zoom: 10, markers: [] },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown widget type", () => {
    const result = WidgetSchema.safeParse({
      id: "x1",
      type: "unknown_widget",
      title: "Bad",
      layout: { column: 1, columnSpan: 1, row: 1, rowSpan: 1 },
      dataSource: { type: "static", data: [], refreshInterval: 0 },
      config: {},
    });
    expect(result.success).toBe(false);
  });
});
