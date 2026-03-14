"""RefreshScheduler — polling cron that triggers pipeline re-runs.

A single Modal cron runs every 5 minutes, checks which dashboards are due
for refresh, and dispatches IngestionRunner for each. This avoids creating
one Modal cron per dashboard.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone

import modal
from .app import app, image
from . import lancedb_store


@app.function(
    image=image,
    secrets=[modal.Secret.from_name("agentboard-s3")],
    schedule=modal.Cron("*/5 * * * *"),
)
def refresh_due_dashboards():
    """Check all dashboards and refresh those that are due."""
    db = lancedb_store.connect()

    try:
        dashboards = lancedb_store.list_published(db)
    except Exception:
        return {"refreshed": 0, "errors": []}

    refreshed = 0
    errors = []
    now = datetime.now(timezone.utc)

    for spec in dashboards:
        schedule = spec.get("refreshSchedule")
        if not schedule or not schedule.get("enabled"):
            continue

        interval = schedule.get("intervalSeconds", 0)
        if interval <= 0:
            continue

        # Check if enough time has passed since last update
        updated = spec.get("updatedAt", "")
        if updated:
            try:
                last = datetime.fromisoformat(updated.replace("Z", "+00:00"))
                elapsed = (now - last).total_seconds()
                if elapsed < interval:
                    continue
            except (ValueError, TypeError):
                pass

        # Trigger refresh via IngestionRunner
        try:
            from .ingestion import IngestionRunner

            runner = IngestionRunner()
            results = runner.run_all_pipelines.remote(spec["id"])
            refreshed += 1
        except Exception as e:
            errors.append({"dashboard_id": spec["id"], "error": str(e)})

    return {"refreshed": refreshed, "errors": errors}
