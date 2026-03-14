import { describe, it, expect } from "vitest";
import { WIDGET_REGISTRY } from "@/components/dashboard/widgets";
import { WIDGET_TYPES } from "@/lib/schemas/widget";

describe("WIDGET_REGISTRY", () => {
  it("has a component for every widget type", () => {
    for (const type of WIDGET_TYPES) {
      expect(WIDGET_REGISTRY[type]).toBeDefined();
      expect(["function", "object"]).toContain(typeof WIDGET_REGISTRY[type]);
    }
  });

  it("has no extra entries beyond WIDGET_TYPES", () => {
    const registryKeys = Object.keys(WIDGET_REGISTRY);
    expect(registryKeys.length).toBe(WIDGET_TYPES.length);
  });
});
