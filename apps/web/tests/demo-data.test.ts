import { describe, it, expect } from "vitest";
import { DEMO_DASHBOARDS } from "@/lib/demo-data";
import { WIDGET_TYPES } from "@/lib/schemas/widget";

describe("DEMO_DASHBOARDS", () => {
  it("has at least 4 demo dashboards", () => {
    expect(DEMO_DASHBOARDS.length).toBeGreaterThanOrEqual(4);
  });

  it("all dashboards have unique ids", () => {
    const ids = DEMO_DASHBOARDS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all widgets reference valid types", () => {
    for (const dashboard of DEMO_DASHBOARDS) {
      for (const widget of dashboard.widgets) {
        expect(WIDGET_TYPES).toContain(widget.type);
      }
    }
  });

  it("all widget layouts have valid column values (1-12)", () => {
    for (const dashboard of DEMO_DASHBOARDS) {
      for (const widget of dashboard.widgets) {
        expect(widget.layout.column).toBeGreaterThanOrEqual(1);
        expect(widget.layout.column).toBeLessThanOrEqual(12);
        expect(widget.layout.columnSpan).toBeGreaterThanOrEqual(1);
        expect(widget.layout.columnSpan).toBeLessThanOrEqual(12);
      }
    }
  });

  it("includes a multimodal demo dashboard", () => {
    const multimodal = DEMO_DASHBOARDS.find((d) => d.id === "demo-multimodal");
    expect(multimodal).toBeDefined();
    const types = multimodal!.widgets.map((w) => w.type);
    expect(types).toContain("map");
    expect(types).toContain("image");
    expect(types).toContain("markdown");
    expect(types).toContain("code_block");
  });

  it("all dashboards are published", () => {
    for (const d of DEMO_DASHBOARDS) {
      expect(d.published).toBe(true);
    }
  });
});
