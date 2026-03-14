"""QueryEngine — read-only access to LanceDB widget data.

This is the hot path. Runs with keep_warm=1 for sub-millisecond reads.
Exposed as web endpoints that the Next.js frontend proxies to.
"""

from __future__ import annotations

import json

import modal
from .app import app, image
from . import lancedb_store


@app.cls(
    image=image,
    keep_warm=1,
    secrets=[modal.Secret.from_name("agentboard-s3")],
)
class QueryEngine:
    """Read-only query engine for serving widget data from LanceDB."""

    @modal.enter()
    def setup(self):
        self.db = lancedb_store.connect()

    @modal.web_endpoint(method="GET")
    def widget_data(self, dashboard_id: str, widget_id: str, limit: int = 1000):
        """Fetch data for a specific widget."""
        data = lancedb_store.read_widget_data(
            self.db, dashboard_id, widget_id, limit=limit
        )
        return {"data": data}

    @modal.web_endpoint(method="GET")
    def dashboard(self, dashboard_id: str):
        """Fetch a dashboard spec."""
        spec = lancedb_store.get_dashboard(self.db, dashboard_id)
        if not spec:
            return {"error": "Dashboard not found"}, 404
        return {"spec": spec}

    @modal.web_endpoint(method="GET")
    def gallery(self):
        """List all published dashboards."""
        dashboards = lancedb_store.list_published(self.db)
        return {"dashboards": dashboards}
