import { describe, it, expect } from "vitest";
import {
  COLOR_MAP,
  resolveColor,
  resolveColors,
  AXIS_STYLE,
  GRID_STYLE,
  TOOLTIP_STYLE,
} from "@/components/dashboard/widgets/chart-theme";

describe("COLOR_MAP", () => {
  it("maps all 17 Tailwind color names", () => {
    const expected = [
      "emerald", "cyan", "violet", "amber", "rose", "blue", "indigo",
      "fuchsia", "lime", "orange", "pink", "teal", "red", "green",
      "yellow", "sky", "purple",
    ];
    for (const name of expected) {
      expect(COLOR_MAP[name]).toBeDefined();
      expect(COLOR_MAP[name]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe("resolveColor", () => {
  it("resolves a named color to hex", () => {
    expect(resolveColor("emerald")).toBe("#10b981");
    expect(resolveColor("cyan")).toBe("#06b6d4");
  });

  it("passes through hex values", () => {
    expect(resolveColor("#ff0000")).toBe("#ff0000");
  });

  it("passes through unknown names", () => {
    expect(resolveColor("rainbow")).toBe("rainbow");
  });
});

describe("resolveColors", () => {
  it("resolves an array of color names", () => {
    const result = resolveColors(["emerald", "amber", "#custom"]);
    expect(result).toEqual(["#10b981", "#f59e0b", "#custom"]);
  });

  it("handles empty array", () => {
    expect(resolveColors([])).toEqual([]);
  });
});

describe("style constants", () => {
  it("AXIS_STYLE has required properties", () => {
    expect(AXIS_STYLE.fontSize).toBe(12);
    expect(AXIS_STYLE.fill).toBe("#a1a1aa");
    expect(AXIS_STYLE.fontFamily).toContain("Inter");
  });

  it("GRID_STYLE has dashed stroke", () => {
    expect(GRID_STYLE.strokeDasharray).toBe("3 3");
    expect(GRID_STYLE.stroke).toBe("#27272a");
  });

  it("TOOLTIP_STYLE has dark background", () => {
    expect(TOOLTIP_STYLE.contentStyle.backgroundColor).toBe("#18181b");
    expect(TOOLTIP_STYLE.contentStyle.borderRadius).toBe(8);
  });
});
