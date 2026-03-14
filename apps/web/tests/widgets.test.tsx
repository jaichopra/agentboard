import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TextWidget from "@/components/dashboard/widgets/TextWidget";
import TableWidget from "@/components/dashboard/widgets/TableWidget";
import ImageWidget from "@/components/dashboard/widgets/ImageWidget";
import KPICardWidget from "@/components/dashboard/widgets/KPICardWidget";
import MarkdownWidget from "@/components/dashboard/widgets/MarkdownWidget";
import CodeBlockWidget from "@/components/dashboard/widgets/CodeBlockWidget";
import WidgetShell from "@/components/dashboard/WidgetShell";
import type { Widget } from "@/lib/schemas";

function makeWidget(overrides: Partial<Widget> = {}): Widget {
  return {
    id: "test-1",
    type: "text",
    title: "Test Widget",
    layout: { column: 1, columnSpan: 12, row: 1, rowSpan: 1 },
    dataSource: { type: "static", data: [], refreshInterval: 0 },
    config: {},
    ...overrides,
  };
}

describe("WidgetShell", () => {
  it("renders title and children", () => {
    render(
      <WidgetShell title="My Title">
        <span>child content</span>
      </WidgetShell>
    );
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <WidgetShell title="T" description="A description">
        <span />
      </WidgetShell>
    );
    expect(screen.getByText("A description")).toBeInTheDocument();
  });

  it("hides title when noTitle is true", () => {
    render(
      <WidgetShell title="Hidden" noTitle>
        <span>content</span>
      </WidgetShell>
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});

describe("TextWidget", () => {
  it("renders paragraph variant", () => {
    const widget = makeWidget({
      type: "text",
      config: { content: "Hello world", variant: "paragraph" },
    });
    render(<TextWidget widget={widget} data={[]} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders heading variant", () => {
    const widget = makeWidget({
      type: "text",
      config: { content: "Big Title", variant: "heading" },
    });
    render(<TextWidget widget={widget} data={[]} />);
    const heading = screen.getByText("Big Title");
    expect(heading.tagName).toBe("H2");
  });

  it("renders callout variant", () => {
    const widget = makeWidget({
      type: "text",
      config: { content: "Important note", variant: "callout" },
    });
    render(<TextWidget widget={widget} data={[]} />);
    expect(screen.getByText("Important note")).toBeInTheDocument();
  });
});

describe("KPICardWidget", () => {
  it("computes sum correctly", () => {
    const widget = makeWidget({
      type: "kpi_card",
      title: "Total",
      config: { valueExpr: "sum(revenue)", prefix: "$" },
    });
    const data = [{ revenue: 100 }, { revenue: 200 }, { revenue: 300 }];
    render(<KPICardWidget widget={widget} data={data} />);
    expect(screen.getByText(/\$600/)).toBeInTheDocument();
  });

  it("computes avg correctly", () => {
    const widget = makeWidget({
      type: "kpi_card",
      title: "Average",
      config: { valueExpr: "avg(value)" },
    });
    const data = [{ value: 10 }, { value: 20 }, { value: 30 }];
    render(<KPICardWidget widget={widget} data={data} />);
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("computes max correctly", () => {
    const widget = makeWidget({
      type: "kpi_card",
      title: "Peak",
      config: { valueExpr: "max(temp)", suffix: "°C" },
    });
    const data = [{ temp: 22 }, { temp: 28 }, { temp: 25 }];
    render(<KPICardWidget widget={widget} data={data} />);
    expect(screen.getByText(/28.*°C/)).toBeInTheDocument();
  });

  it("renders trend badge", () => {
    const widget = makeWidget({
      type: "kpi_card",
      title: "Revenue",
      config: {
        valueExpr: "sum(v)",
        trend: { value: 12, direction: "up", isPositive: true },
      },
    });
    render(<KPICardWidget widget={widget} data={[{ v: 100 }]} />);
    expect(screen.getByText(/12%/)).toBeInTheDocument();
  });
});

describe("TableWidget", () => {
  it("renders column headers and rows", () => {
    const widget = makeWidget({
      type: "table",
      title: "Data",
      config: { columns: ["name", "value"] },
    });
    const data = [
      { name: "Alice", value: 42 },
      { name: "Bob", value: 99 },
    ];
    render(<TableWidget widget={widget} data={data} />);
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("value")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("auto-detects columns from data keys", () => {
    const widget = makeWidget({
      type: "table",
      title: "Auto",
      config: {},
    });
    const data = [{ city: "NYC", pop: 8000000 }];
    render(<TableWidget widget={widget} data={data} />);
    expect(screen.getByText("city")).toBeInTheDocument();
    expect(screen.getByText("pop")).toBeInTheDocument();
  });

  it("formats null values as em dash", () => {
    const widget = makeWidget({
      type: "table",
      title: "Nulls",
      config: { columns: ["a"] },
    });
    render(<TableWidget widget={widget} data={[{ a: null }]} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });
});

describe("ImageWidget", () => {
  it("renders image with src and alt", () => {
    const widget = makeWidget({
      type: "image",
      title: "Photo",
      config: { src: "https://example.com/photo.jpg", alt: "A photo" },
    });
    render(<ImageWidget widget={widget} data={[]} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
    expect(img).toHaveAttribute("alt", "A photo");
  });

  it("renders caption when provided", () => {
    const widget = makeWidget({
      type: "image",
      title: "Photo",
      config: { src: "https://example.com/photo.jpg", caption: "Nice view" },
    });
    render(<ImageWidget widget={widget} data={[]} />);
    expect(screen.getByText("Nice view")).toBeInTheDocument();
  });

  it("shows placeholder when no src", () => {
    const widget = makeWidget({
      type: "image",
      title: "Empty",
      config: {},
    });
    render(<ImageWidget widget={widget} data={[]} />);
    expect(screen.getByText("No image source")).toBeInTheDocument();
  });
});

describe("MarkdownWidget", () => {
  it("renders markdown content", () => {
    const widget = makeWidget({
      type: "markdown",
      title: "Notes",
      config: { content: "**bold text**" },
    });
    render(<MarkdownWidget widget={widget} data={[]} />);
    expect(screen.getByText("bold text")).toBeInTheDocument();
    expect(screen.getByText("bold text").tagName).toBe("STRONG");
  });
});

describe("CodeBlockWidget", () => {
  it("renders code content", () => {
    const widget = makeWidget({
      type: "code_block",
      title: "Code",
      config: { code: "const x = 42;", language: "typescript" },
    });
    render(<CodeBlockWidget widget={widget} data={[]} />);
    expect(screen.getByText(/const/)).toBeInTheDocument();
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });
});
