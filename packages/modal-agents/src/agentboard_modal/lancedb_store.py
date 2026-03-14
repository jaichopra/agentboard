"""LanceDB connection and data layer.

All database access goes through this module, enforcing:
- Table naming conventions (dashboards can only write to their own tables)
- Read/write separation (QueryEngine uses read-only methods, IngestionRunner uses write)
- S3-backed durability with in-process performance
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone

import lancedb
import pyarrow as pa


def connect() -> lancedb.DBConnection:
    """Connect to LanceDB backed by S3 or local storage."""
    uri = os.environ.get("LANCEDB_URI", "/tmp/agentboard-lancedb")
    return lancedb.connect(uri)


# --- Dashboard metadata ---

DASHBOARDS_SCHEMA = pa.schema([
    pa.field("id", pa.string()),
    pa.field("spec", pa.string()),  # JSON-serialized dashboard spec
    pa.field("author_id", pa.string()),
    pa.field("published", pa.bool_()),
    pa.field("created_at", pa.timestamp("ms")),
    pa.field("updated_at", pa.timestamp("ms")),
    pa.field("view_count", pa.int32()),
    pa.field("tags", pa.list_(pa.string())),
])


def ensure_dashboards_table(db: lancedb.DBConnection) -> lancedb.table.Table:
    """Get or create the dashboards metadata table."""
    try:
        return db.open_table("dashboards")
    except Exception:
        return db.create_table("dashboards", schema=DASHBOARDS_SCHEMA)


def save_dashboard(db: lancedb.DBConnection, spec: dict) -> None:
    """Save a dashboard spec to the dashboards table."""
    table = ensure_dashboards_table(db)
    now = datetime.now(timezone.utc)
    table.add([{
        "id": spec["id"],
        "spec": json.dumps(spec),
        "author_id": spec.get("authorId", "anonymous"),
        "published": spec.get("published", False),
        "created_at": now,
        "updated_at": now,
        "view_count": 0,
        "tags": spec.get("tags", []),
    }])


def get_dashboard(db: lancedb.DBConnection, dashboard_id: str) -> dict | None:
    """Fetch a dashboard spec by ID."""
    table = ensure_dashboards_table(db)
    results = table.search().where(f"id = '{dashboard_id}'").limit(1).to_list()
    if not results:
        return None
    return json.loads(results[0]["spec"])


def list_published(db: lancedb.DBConnection) -> list[dict]:
    """List all published dashboards."""
    table = ensure_dashboards_table(db)
    results = table.search().where("published = true").to_list()
    return [json.loads(r["spec"]) for r in results]


# --- Widget data ---

def _widget_table_name(dashboard_id: str, widget_id: str) -> str:
    """Generate a namespaced table name for widget data."""
    # Sanitize IDs to prevent injection
    safe_dash = "".join(c for c in dashboard_id if c.isalnum() or c == "-")
    safe_widget = "".join(c for c in widget_id if c.isalnum() or c == "-")
    return f"data_{safe_dash}_{safe_widget}"


def write_widget_data(
    db: lancedb.DBConnection,
    dashboard_id: str,
    widget_id: str,
    data: list[dict],
) -> None:
    """Write data for a widget. Overwrites existing data."""
    table_name = _widget_table_name(dashboard_id, widget_id)
    # Add metadata columns
    now = datetime.now(timezone.utc)
    for row in data:
        row["_timestamp"] = now
        row["_dashboard_id"] = dashboard_id
        row["_widget_id"] = widget_id

    try:
        table = db.open_table(table_name)
        table.delete("true")  # Clear old data
        table.add(data)
    except Exception:
        db.create_table(table_name, data=data)


def read_widget_data(
    db: lancedb.DBConnection,
    dashboard_id: str,
    widget_id: str,
    limit: int = 1000,
) -> list[dict]:
    """Read data for a widget."""
    table_name = _widget_table_name(dashboard_id, widget_id)
    try:
        table = db.open_table(table_name)
        results = table.to_pandas().head(limit).to_dict(orient="records")
        # Strip internal columns
        return [
            {k: v for k, v in row.items() if not k.startswith("_")}
            for row in results
        ]
    except Exception:
        return []
