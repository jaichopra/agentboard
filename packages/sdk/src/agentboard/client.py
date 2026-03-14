"""AgentboardClient — main entry point for the SDK."""

from __future__ import annotations

from typing import Any

import httpx

from .dashboard import Dashboard
from .types import DeployResult, DashboardSpec


class AgentboardClient:
    """Client for the Agentboard API.

    Usage:
        client = AgentboardClient(api_key="ab_...")
        result = client.deploy(dashboard, publish=True)
        print(result.url)
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://agentboard.dev/api",
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self._http = httpx.Client(
            base_url=self.base_url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            timeout=120.0,
        )

    def deploy(self, dashboard: Dashboard, publish: bool = False) -> DeployResult:
        """Deploy a dashboard.

        Args:
            dashboard: Dashboard instance to deploy
            publish: Whether to publish to the gallery immediately

        Returns:
            DeployResult with dashboard_id and url
        """
        spec = dashboard.to_spec()

        response = self._http.post(
            "/dashboards",
            json={"spec": spec.model_dump(), "publish": publish},
        )
        response.raise_for_status()
        data = response.json()

        return DeployResult(
            dashboard_id=data["dashboard_id"],
            url=f"{self.base_url.replace('/api', '')}/{data['dashboard_id']}",
            spec=DashboardSpec(**data["spec"]),
        )

    def create_with_agent(
        self,
        prompt: str,
        credentials: dict[str, str] | None = None,
    ) -> DeployResult:
        """Create a dashboard using an AI agent.

        The agent will:
        1. Generate a dashboard spec from your prompt
        2. Create data pipelines for each widget
        3. Run the initial data fetch
        4. Set up refresh schedules

        Args:
            prompt: Natural language description of the dashboard
            credentials: Optional API credentials for data sources

        Returns:
            DeployResult with dashboard_id and url
        """
        body: dict[str, Any] = {"prompt": prompt}
        if credentials:
            body["credentials"] = credentials

        response = self._http.post("/agent/create", json=body)
        response.raise_for_status()
        data = response.json()

        return DeployResult(
            dashboard_id=data["dashboard_id"],
            url=f"{self.base_url.replace('/api', '')}/{data['dashboard_id']}",
            spec=DashboardSpec(**data["spec"]),
        )

    def get_dashboard(self, dashboard_id: str) -> DashboardSpec:
        """Fetch a dashboard spec by ID."""
        response = self._http.get(f"/dashboards/{dashboard_id}")
        response.raise_for_status()
        return DashboardSpec(**response.json()["spec"])

    def publish(self, dashboard_id: str) -> None:
        """Publish a dashboard to the gallery."""
        response = self._http.post(
            f"/dashboards/{dashboard_id}/publish",
            json={"dashboard_id": dashboard_id},
        )
        response.raise_for_status()

    def refresh(self, dashboard_id: str) -> dict:
        """Trigger a manual refresh of all pipelines."""
        response = self._http.post(f"/dashboards/{dashboard_id}/refresh")
        response.raise_for_status()
        return response.json()
