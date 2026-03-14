import { NextRequest, NextResponse } from "next/server";
import { DashboardGenerationSchema, type DashboardSpec } from "@/lib/schemas";
import { v4 as uuid } from "uuid";

const SYSTEM_PROMPT = `You are Agentboard, an AI that creates dashboard specifications.

When the user describes what they want to see, generate a dashboard spec as JSON.

Available widget types:
- bar_chart: For comparing values across categories
- line_chart: For trends over time
- area_chart: For trends with volume emphasis
- donut_chart: For proportional breakdown
- kpi_card: For single key metrics
- table: For detailed tabular data
- text: For explanatory text or callouts

Each widget needs:
- id: unique string (use short ids like "w1", "w2")
- type: one of the types above
- title: display title
- layout: { column (1-12), columnSpan (1-12), row (1+), rowSpan (1-6) }
- dataSource: { type: "static", data: [...], refreshInterval: 0 }
- config: type-specific config

For charts: config needs "index" (x-axis field) and "categories" (y-axis fields array)
For kpi_card: config needs "valueExpr" like "sum(fieldname)" or "avg(fieldname)", optional "prefix"/"suffix"
For table: config needs "columns" array
For text: config needs "content" string

The grid is 12 columns. Each row is 120px tall.

IMPORTANT: Always respond with a JSON object with two fields:
- "message": A brief explanation of what you created
- "spec": The dashboard spec object with title, description, widgets array, and tags

Generate realistic sample data that matches what the user asked for.`;

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
