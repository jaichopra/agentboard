"""Agent-assisted dashboard creation helpers.

These are tools designed for Claude coding agents to call when building
dashboards on behalf of an engineer. The agent can:
1. Create a dashboard from a natural language prompt
2. Add widgets to an existing dashboard
3. Set up data pipelines
4. Configure refresh schedules

This module exposes simple functions that a Claude agent can invoke
via tool_use to build dashboards step by step.
"""

from __future__ import annotations

from typing import Any

from .client import AgentboardClient
from .dashboard import Dashboard
from .widget import Widget
from .pipeline import DataPipeline


def create_dashboard_from_prompt(
    client: AgentboardClient,
    prompt: str,
    publish: bool = True,
) -> dict[str, str]:
    """Create a complete dashboard from a natural language description.

    Designed to be called by a Claude coding agent as a tool.

    Args:
        client: Authenticated AgentboardClient
        prompt: What the dashboard should show
        publish: Whether to make it public

    Returns:
        {"dashboard_id": "...", "url": "..."}
    """
    result = client.create_with_agent(prompt)
    if publish:
        client.publish(result.dashboard_id)
    return {
        "dashboard_id": result.dashboard_id,
        "url": result.url,
    }


def build_dashboard_with_static_data(
    client: AgentboardClient,
    title: str,
    description: str,
    widgets_config: list[dict[str, Any]],
    tags: list[str] | None = None,
    publish: bool = True,
) -> dict[str, str]:
    """Build a dashboard with static data — no external APIs needed.

    Designed for quick prototyping and demos.

    Each widget_config dict should have:
        - type: "bar_chart" | "line_chart" | "kpi_card" | "table" | etc.
        - title: str
        - data: list[dict]
        - layout: {"column": int, "columnSpan": int, "row": int, "rowSpan": int}
        - Plus type-specific fields (x, y, value_expr, columns, etc.)

    Returns:
        {"dashboard_id": "...", "url": "..."}
    """
    widget_specs = []
    for wc in widgets_config:
        pipeline = DataPipeline.static(wc["data"])
        wtype = wc["type"]
        layout = wc["layout"]
        title_ = wc["title"]

        if wtype in ("bar_chart", "line_chart", "area_chart"):
            builder = getattr(Widget, wtype)
            spec = builder(
                title=title_,
                data_pipeline=pipeline,
                x=wc.get("x", "name"),
                y=wc.get("y", "value"),
                layout=layout,
                colors=wc.get("colors"),
            )
        elif wtype == "donut_chart":
            spec = Widget.donut_chart(
                title=title_,
                data_pipeline=pipeline,
                category=wc.get("category", "name"),
                value=wc.get("value", "count"),
                layout=layout,
            )
        elif wtype == "kpi_card":
            spec = Widget.kpi_card(
                title=title_,
                data_pipeline=pipeline,
                value_expr=wc.get("value_expr", "sum(value)"),
                layout=layout,
                prefix=wc.get("prefix", ""),
                suffix=wc.get("suffix", ""),
            )
        elif wtype == "table":
            spec = Widget.table(
                title=title_,
                data_pipeline=pipeline,
                columns=wc.get("columns", []),
                layout=layout,
            )
        else:
            continue

        widget_specs.append(spec)

    dashboard = Dashboard(
        title=title,
        description=description,
        widgets=widget_specs,
        tags=tags,
    )

    result = client.deploy(dashboard, publish=publish)
    return {
        "dashboard_id": result.dashboard_id,
        "url": result.url,
    }
