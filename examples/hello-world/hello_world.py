"""
Agentboard Hello World

The simplest possible dashboard — static data, no external APIs.
Demonstrates: Dashboard, Widget, DataPipeline, deploy.

Usage:
    export AGENTBOARD_API_KEY=ab_...
    python hello_world.py
"""

from agentboard import AgentboardClient, Dashboard, Widget, DataPipeline

client = AgentboardClient(api_key="ab_test_key")

# Static data pipeline — no external APIs needed
sales_data = DataPipeline.static(data=[
    {"month": "Jan", "revenue": 4200, "users": 120},
    {"month": "Feb", "revenue": 5100, "users": 145},
    {"month": "Mar", "revenue": 4800, "users": 132},
    {"month": "Apr", "revenue": 6200, "users": 178},
    {"month": "May", "revenue": 7100, "users": 203},
    {"month": "Jun", "revenue": 6800, "users": 195},
])

dashboard = Dashboard(
    title="Hello Agentboard",
    description="A simple sales dashboard to get you started.",
    tags=["demo", "hello-world"],
    widgets=[
        Widget.bar_chart(
            title="Monthly Revenue",
            data_pipeline=sales_data,
            x="month",
            y="revenue",
            layout={"column": 1, "columnSpan": 8, "row": 1, "rowSpan": 2},
        ),
        Widget.kpi_card(
            title="Total Revenue",
            data_pipeline=sales_data,
            value_expr="sum(revenue)",
            prefix="$",
            layout={"column": 9, "columnSpan": 4, "row": 1, "rowSpan": 1},
        ),
        Widget.kpi_card(
            title="Total Users",
            data_pipeline=sales_data,
            value_expr="sum(users)",
            layout={"column": 9, "columnSpan": 4, "row": 2, "rowSpan": 1},
        ),
        Widget.table(
            title="Raw Data",
            data_pipeline=sales_data,
            columns=["month", "revenue", "users"],
            layout={"column": 1, "columnSpan": 12, "row": 3, "rowSpan": 2},
        ),
    ],
)

result = client.deploy(dashboard, publish=True)
print(f"Dashboard: {result.url}")
