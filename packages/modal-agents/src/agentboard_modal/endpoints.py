"""FastAPI endpoints exposed via Modal.

These are the primary API surface that the Next.js frontend calls.
"""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone

import modal
from .app import app, image
from . import lancedb_store


@app.function(
    image=image,
    secrets=[modal.Secret.from_name("agentboard-s3")],
)
@modal.fastapi_endpoint(method="POST")
def create_dashboard(body: dict):
    """Create a new dashboard from a spec or prompt."""
    db = lancedb_store.connect()

    if "prompt" in body:
        # Agent-based creation
        from .dashboard_agent import DashboardAgent

        agent = DashboardAgent()
        spec = agent.generate_spec.remote(body["prompt"])
    elif "spec" in body:
        spec = body["spec"]
    else:
        return {"error": "Provide either 'prompt' or 'spec'"}, 400

    # Ensure required fields
    if "id" not in spec:
        spec["id"] = str(uuid.uuid4())
    spec.setdefault("author", "anonymous")
    spec.setdefault("authorId", body.get("author_id", "anonymous"))
    spec.setdefault("createdAt", datetime.now(timezone.utc).isoformat())
    spec.setdefault("updatedAt", datetime.now(timezone.utc).isoformat())
    spec.setdefault("published", False)
    spec.setdefault("tags", [])
    spec.setdefault("version", 1)

    lancedb_store.save_dashboard(db, spec)

    # Run ingestion for any non-static widgets
    # (deferred to background in production)

    return {"dashboard_id": spec["id"], "spec": spec}


@app.function(
    image=image,
    secrets=[modal.Secret.from_name("agentboard-s3")],
)
@modal.fastapi_endpoint(method="POST")
def publish_dashboard(body: dict):
    """Publish a dashboard to the gallery."""
    dashboard_id = body.get("dashboard_id")
    if not dashboard_id:
        return {"error": "dashboard_id required"}, 400

    db = lancedb_store.connect()
    spec = lancedb_store.get_dashboard(db, dashboard_id)
    if not spec:
        return {"error": "Dashboard not found"}, 404

    spec["published"] = True
    spec["updatedAt"] = datetime.now(timezone.utc).isoformat()
    lancedb_store.save_dashboard(db, spec)

    return {"status": "published", "dashboard_id": dashboard_id}
