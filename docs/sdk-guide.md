# Python SDK Guide

## Installation

```bash
pip install agentboard
```

## Core Concepts

### DataPipeline

Defines where data comes from. Three types:

```python
# Static — inline data, no refresh needed
pipeline = DataPipeline.static(data=[
    {"month": "Jan", "value": 100},
    {"month": "Feb", "value": 200},
])

# From code — Python function that runs on Modal
pipeline = DataPipeline.from_code(
    name="github_stars",
    code="""
import requests
resp = requests.get(f"https://api.github.com/repos/{params['repo']}")
data = resp.json()
return [{"stars": data["stargazers_count"]}]
""",
    params={"repo": "anthropics/claude-code"},
    refresh={"cron": "0 */6 * * *"},
)
```

### Widget

Builder for individual dashboard widgets:

```python
Widget.bar_chart(title, data_pipeline, x, y, layout, colors=None, stack=False)
Widget.line_chart(title, data_pipeline, x, y, layout, colors=None)
Widget.area_chart(title, data_pipeline, x, y, layout, colors=None, stack=False)
Widget.donut_chart(title, data_pipeline, category, value, layout, colors=None)
Widget.kpi_card(title, data_pipeline, value_expr, layout, prefix="", suffix="")
Widget.table(title, data_pipeline, columns, layout, page_size=50)
Widget.text(title, content, layout, variant="paragraph")
```

**Layout** uses a 12-column grid:
```python
layout = {
    "column": 1,       # Starting column (1-12)
    "columnSpan": 6,   # Width in columns
    "row": 1,          # Starting row
    "rowSpan": 2,      # Height in rows (each row = 120px)
}
```

**value_expr** for KPI cards:
- `sum(field)` — sum all values
- `avg(field)` — average
- `count(field)` — count rows
- `min(field)` / `max(field)`

### Dashboard

Combines widgets into a deployable dashboard:

```python
dashboard = Dashboard(
    title="My Dashboard",
    description="What this dashboard shows",
    widgets=[...],
    tags=["sales", "q1"],
    refresh_cron="0 */6 * * *",      # Optional: cron schedule
    refresh_interval=21600,           # Optional: seconds between refresh
)
```

### AgentboardClient

```python
client = AgentboardClient(api_key="ab_...")

# Deploy a dashboard
result = client.deploy(dashboard, publish=True)
print(result.url)

# Create with AI agent
result = client.create_with_agent(prompt="...")

# Manage dashboards
spec = client.get_dashboard(dashboard_id)
client.publish(dashboard_id)
client.refresh(dashboard_id)
```

## Agent-Assisted Creation

For engineers who want Claude to handle the details:

```python
# Full agent creation — Claude generates everything
result = client.create_with_agent(
    prompt="Build a dashboard tracking AWS costs by service with daily refresh",
    credentials={"aws_key": "...", "aws_secret": "..."},
)
```

Or use the agent helpers for coding agent integration:

```python
from agentboard.agent import create_dashboard_from_prompt, build_dashboard_with_static_data

# Simple prompt-based
result = create_dashboard_from_prompt(client, "Track our Stripe revenue")

# Structured static data
result = build_dashboard_with_static_data(
    client,
    title="Sales Q1",
    description="Q1 sales overview",
    widgets_config=[
        {
            "type": "bar_chart",
            "title": "Revenue",
            "x": "month",
            "y": "revenue",
            "data": [{"month": "Jan", "revenue": 5000}],
            "layout": {"column": 1, "columnSpan": 12, "row": 1, "rowSpan": 2},
        }
    ],
)
```

## Pipeline Security

Pipeline code runs in a sandboxed subprocess on Modal. The following are blocked:
- `subprocess`, `os.system`, `os.popen`
- `eval`, `exec`, `__import__`
- `pickle`, `ctypes`, `importlib`
- File writes via `open()` in write mode

Code is validated via AST analysis before execution. If any violation is found, the pipeline is rejected.
