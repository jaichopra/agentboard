"""Dashboard — top-level builder for dashboard specs."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from .types import DashboardSpec, WidgetSpec, RefreshSchedule


class Dashboard:
    """Builder for dashboard specs.

    Usage:
        dashboard = Dashboard(
            title="My Dashboard",
            description="...",
            widgets=[Widget.bar_chart(...), Widget.kpi_card(...)],
        )
    """

    def __init__(
        self,
        title: str,
        description: str,
        widgets: list[WidgetSpec],
        tags: list[str] | None = None,
        refresh_cron: str | None = None,
        refresh_interval: int | None = None,
    ):
        self.title = title
        self.description = description
        self.widgets = widgets
        self.tags = tags or []
        self.refresh_cron = refresh_cron
        self.refresh_interval = refresh_interval

    def to_spec(self, author: str = "sdk-user") -> DashboardSpec:
        """Convert to a deployable DashboardSpec."""
        now = datetime.now(timezone.utc).isoformat()

        refresh = None
        if self.refresh_cron or self.refresh_interval:
            refresh = RefreshSchedule(
                enabled=True,
                cron=self.refresh_cron,
                intervalSeconds=self.refresh_interval,
            )

        return DashboardSpec(
            id=str(uuid.uuid4()),
            version=1,
            title=self.title,
            description=self.description,
            author=author,
            createdAt=now,
            updatedAt=now,
            published=False,
            tags=self.tags,
            refreshSchedule=refresh,
            widgets=self.widgets,
        )
