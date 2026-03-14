"""
Custom Data Pipeline Example

Demonstrates how engineers define custom data pipelines
that run on Modal and refresh on a schedule.

Usage:
    export AGENTBOARD_API_KEY=ab_...
    python pipeline_example.py
"""

from agentboard import AgentboardClient, Dashboard, Widget, DataPipeline

client = AgentboardClient(api_key="ab_test_key")

# Define a pipeline that fetches data from an API
# This code runs on Modal in a sandboxed subprocess
github_stars = DataPipeline.from_code(
    name="github_stars",
    code="""
import requests

repo = params.get("repo", "anthropics/claude-code")
url = f"https://api.github.com/repos/{repo}"
resp = requests.get(url)
data = resp.json()

return [
    {"metric": "stars", "value": data.get("stargazers_count", 0)},
    {"metric": "forks", "value": data.get("forks_count", 0)},
    {"metric": "open_issues", "value": data.get("open_issues_count", 0)},
    {"metric": "watchers", "value": data.get("subscribers_count", 0)},
]
""",
    params={"repo": "anthropics/claude-code"},
    refresh={"cron": "0 */6 * * *", "intervalSeconds": 21600},
)

dashboard = Dashboard(
    title="GitHub Repo Health",
    description="Live metrics from the GitHub API, refreshed every 6 hours.",
    tags=["github", "api", "live"],
    refresh_cron="0 */6 * * *",
    widgets=[
        Widget.bar_chart(
            title="Repo Metrics",
            data_pipeline=github_stars,
            x="metric",
            y="value",
            layout={"column": 1, "columnSpan": 12, "row": 1, "rowSpan": 3},
            colors=["emerald"],
        ),
    ],
)

result = client.deploy(dashboard, publish=True)
print(f"Dashboard: {result.url}")
