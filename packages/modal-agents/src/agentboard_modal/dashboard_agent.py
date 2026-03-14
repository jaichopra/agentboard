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


SYSTEM_PROMPT = """You are Agentboard's dashboard generation agent.

Given a user's description, generate a complete dashboard specification as JSON.

Available widget types:
- bar_chart: Compare values across categories. Config: {index, categories, colors, stack}
- line_chart: Show trends over time. Config: {index, categories, colors}
- area_chart: Trends with volume emphasis. Config: {index, categories, colors, stack}
- donut_chart: Proportional breakdown. Config: {index, categories, colors}
- kpi_card: Single key metric. Config: {valueExpr: "sum(field)", prefix, suffix, trend}
- table: Detailed data. Config: {columns, pageSize}
- text: Explanatory text. Config: {content, variant: "paragraph"|"heading"|"callout"}

Layout uses a 12-column grid. Each row is 120px. Specify:
- column: starting column (1-12)
- columnSpan: width in columns
- row: starting row (1+)
- rowSpan: height in rows

For data sources:
- Use "static" type with sample data for immediate rendering
- Use "modal_endpoint" type when the user needs real API data (include the fetch logic description in endpoint field)

Generate realistic, plausible sample data matching the user's domain.
Use professional color schemes: emerald, cyan, violet, amber, rose, blue, indigo.

Output ONLY valid JSON with this structure:
{
  "title": "Dashboard Title",
  "description": "Brief description",
  "tags": ["tag1", "tag2"],
  "widgets": [...]
}"""


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
