"""
Agent-Assisted Dashboard Creation

Let Claude build the dashboard for you from a prompt.
The agent generates specs, pipelines, and schedules.

Usage:
    export AGENTBOARD_API_KEY=ab_...
    python agent_create.py
"""

from agentboard import AgentboardClient

client = AgentboardClient(api_key="ab_test_key")

# One-liner: Claude builds the entire dashboard
result = client.create_with_agent(
    prompt=(
        "Build a dashboard tracking GitHub repository health for "
        "anthropics/claude-code. Show stars over time as a line chart, "
        "open issues by label as a donut chart, recent commits as a table, "
        "and KPIs for total stars, open issues, and contributors. "
        "Refresh every 6 hours."
    )
)

print(f"Dashboard: {result.url}")
print(f"Widgets: {len(result.spec.widgets)}")
