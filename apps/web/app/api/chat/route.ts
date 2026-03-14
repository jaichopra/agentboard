import { NextRequest, NextResponse } from "next/server";
import { DashboardGenerationSchema, type DashboardSpec } from "@/lib/schemas";
import { v4 as uuid } from "uuid";

const SYSTEM_PROMPT = `You are Agentboard, an AI that creates beautiful, well-designed dashboard specifications.

When the user describes what they want to see, generate a dashboard spec as JSON.

## Widget Types
- bar_chart: Compare values across categories
- line_chart: Trends over time
- area_chart: Trends with volume emphasis
- donut_chart: Proportional breakdown
- kpi_card: Single key metric (big number)
- table: Detailed tabular data
- text: Explanatory text or callouts

## Widget Schema
Each widget needs:
- id: unique string (use short ids like "w1", "w2")
- type: one of the types above
- title: display title (keep concise)
- layout: { column (1-12), columnSpan (1-12), row (1+), rowSpan (1-6) }
- dataSource: { type: "static", data: [...], refreshInterval: 0 }
- config: type-specific config (see below)

## Config by Type
- Charts (bar_chart, line_chart, area_chart): { "index": "x-axis-field", "categories": ["y-field1", "y-field2"], "colors": ["emerald", "cyan"] }
- donut_chart: { "index": "label-field", "categories": ["value-field"], "colors": ["emerald", "cyan", "violet", "amber", "rose"] }
- kpi_card: { "valueExpr": "sum(fieldname)", "prefix": "$", "suffix": "%" }
  - valueExpr supports: sum(field), avg(field), count(field), min(field), max(field)
  - Optional trend: { "trend": { "value": 12, "direction": "up", "isPositive": true } }
- table: { "columns": ["col1", "col2"] }
- text: { "content": "Some text", "variant": "paragraph" | "heading" | "callout" }

## Layout Guidelines (CRITICAL)
The grid is 12 columns wide. Each row is 160px tall.

Follow these design principles:
1. START with a row of 3-4 KPI cards across the top (row 1, rowSpan 1). Use columns 1-3, 4-6, 7-9, 10-12 (columnSpan 3 each) or 1-4, 5-8, 9-12 (columnSpan 4 each).
2. Charts should be rowSpan 2 minimum (320px) for readability. Prefer rowSpan 3 for primary charts.
3. Use the full 12 columns. Don't leave gaps. A main chart can be columnSpan 8 with a side panel of columnSpan 4.
4. Tables should be full width (columnSpan 12) and rowSpan 2-3.
5. Don't stack more than 2 KPI cards vertically — they should be in a horizontal row.
6. Maximum 6-8 widgets per dashboard. Don't overcrowd.

## Color Palette
Always specify colors explicitly. Available colors:
emerald, cyan, violet, amber, rose, blue, indigo, teal, orange, sky, pink, lime, fuchsia, purple, red, green, yellow

Use vibrant, contrasting colors. Good combinations:
- Single series: ["emerald"] or ["cyan"] or ["violet"]
- Two series: ["emerald", "amber"] or ["cyan", "rose"] or ["blue", "orange"]
- Multi series: ["emerald", "cyan", "violet", "amber", "rose"]

NEVER leave colors unspecified. ALWAYS include the "colors" array in chart configs.

## Response Format
IMPORTANT: Always respond with a JSON object with two fields:
- "message": A brief explanation of what you created
- "spec": The dashboard spec object with title, description, widgets array, and tags

Generate realistic, plausible sample data that matches what the user asked for.
Keep titles concise (2-4 words). Write a clear 1-sentence description.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "ANTHROPIC_API_KEY not configured", spec: null },
      { status: 200 }
    );
  }

  const { messages } = await req.json();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: messages.map(
          (m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })
        ),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json(
        { message: "Failed to generate dashboard. Check API key.", spec: null },
        { status: 200 }
      );
    }

    const result = await response.json();
    const text =
      result.content?.[0]?.type === "text" ? result.content[0].text : "";

    // Try to parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ message: text, spec: null });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (parsed.spec) {
      // Add required fields
      const spec: DashboardSpec = {
        id: uuid(),
        version: 1,
        author: "You",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: false,
        tags: parsed.spec.tags || [],
        ...parsed.spec,
      };

      return NextResponse.json({
        message: parsed.message || "Dashboard created!",
        spec,
      });
    }

    return NextResponse.json({ message: parsed.message || text, spec: null });
  } catch (e) {
    console.error("Chat error:", e);
    return NextResponse.json(
      { message: "An error occurred generating the dashboard.", spec: null },
      { status: 200 }
    );
  }
}
