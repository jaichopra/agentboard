"""Pydantic models mirroring the Zod schemas on the frontend."""

from __future__ import annotations

from typing import Any
from pydantic import BaseModel, Field


class WidgetLayout(BaseModel):
    column: int = Field(ge=1, le=12)
    columnSpan: int = Field(ge=1, le=12)
    row: int = Field(ge=1)
    rowSpan: int = Field(ge=1, le=6)


class WidgetDataSource(BaseModel):
    type: str = "static"  # "static" | "modal_endpoint" | "lancedb_query"
    endpoint: str | None = None
    table: str | None = None
    query: dict[str, Any] | None = None
    data: list[dict[str, Any]] | None = None
    refreshInterval: int = 0


class WidgetSpec(BaseModel):
    id: str
    type: str
    title: str
    description: str | None = None
    layout: WidgetLayout
    dataSource: WidgetDataSource
    config: dict[str, Any] = {}


class RefreshSchedule(BaseModel):
    enabled: bool = False
    cron: str | None = None
    intervalSeconds: int | None = None


class DashboardSpec(BaseModel):
    id: str
    version: int = 1
    title: str
    description: str
    author: str = "sdk-user"
    authorId: str | None = None
    createdAt: str = ""
    updatedAt: str = ""
    published: bool = False
    tags: list[str] = []
    thumbnail: str | None = None
    refreshSchedule: RefreshSchedule | None = None
    widgets: list[WidgetSpec] = []
    theme: dict[str, Any] | None = None


class DeployResult(BaseModel):
    dashboard_id: str
    url: str
    spec: DashboardSpec
