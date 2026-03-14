"""DashboardAgent — uses Claude to generate dashboard specs from prompts.

This is the core intelligence of the platform. Takes a natural language
description and produces a validated DashboardSpec JSON.
"""

from __future__ import annotations

import json
import uuid

import anthropic
import modal
from .app import app, image


SYSTEM_PROMPT = """You are Agentboard's dashboard generation agent. You create beautiful, well-designed dashboards.

## Widget Types
- bar_chart: Compare values. Config: {index, categories, colors, stack}
- line_chart: Trends over time. Config: {index, categories, colors}
- area_chart: Trends with volume. Config: {index, categories, colors, stack}
- donut_chart: Proportional breakdown. Config: {index, categories, colors}
- kpi_card: Single key metric. Config: {valueExpr: "sum(field)", prefix, suffix, trend}
- table: Detailed data. Config: {columns, pageSize}
- text: Explanatory text. Config: {content, variant: "paragraph"|"heading"|"callout"}

## Layout Rules (12-column grid, each row is 160px)
1. ALWAYS start with a row of 3-4 KPI cards across the top (row 1, rowSpan 1, columnSpan 3 each).
2. Charts must be rowSpan 3 minimum (480px). Use rowSpan 2 only for secondary charts.
3. Use full 12 columns. A main chart can be columnSpan 8 with a side panel of columnSpan 4.
4. Tables should be columnSpan 12, rowSpan 2-3.
5. Maximum 6-8 widgets total. Don't overcrowd.

## Colors (ALWAYS specify explicitly)
Available: emerald, cyan, violet, amber, rose, blue, indigo, teal, orange, sky, pink, lime, fuchsia, purple
Good combos: ["emerald"], ["cyan", "rose"], ["emerald", "cyan", "violet", "amber", "rose"]

## Data Sources
- "static": inline sample data for immediate rendering
- "modal_endpoint": real API data (include fetch logic description in endpoint field)

Output ONLY valid JSON:
{"title": "...", "description": "...", "tags": [...], "widgets": [...]}"""


@app.cls(
    image=image,
    secrets=[modal.Secret.from_name("anthropic")],
)
class DashboardAgent:
    """Generates dashboard specs using Claude."""

    @modal.enter()
    def setup(self):
        self.client = anthropic.Anthropic()

    @modal.method()
    def generate_spec(self, prompt: str) -> dict:
        """Generate a dashboard spec from a natural language prompt."""
        response = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )

        text = response.content[0].text
        spec = json.loads(text)

        # Add IDs and metadata
        spec["id"] = str(uuid.uuid4())
        spec["version"] = 1
        for i, widget in enumerate(spec.get("widgets", [])):
            if "id" not in widget:
                widget["id"] = f"w{i + 1}"

        return spec

    @modal.method()
    def refine_spec(self, spec: dict, feedback: str) -> dict:
        """Refine an existing spec based on user feedback."""
        response = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Here is the current dashboard spec:\n\n{json.dumps(spec, indent=2)}\n\nPlease modify it based on this feedback: {feedback}\n\nReturn the complete updated JSON spec.",
                }
            ],
        )

        text = response.content[0].text
        updated = json.loads(text)
        updated["id"] = spec.get("id", str(uuid.uuid4()))
        updated["version"] = spec.get("version", 0) + 1
        return updated
