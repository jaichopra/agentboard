"""DataPipeline — defines how data is fetched for a widget."""

from __future__ import annotations

from typing import Any

from .types import WidgetDataSource


class DataPipeline:
    """Defines a data pipeline for a dashboard widget.

    Pipelines can be static (inline data), or dynamic (code that runs on Modal).
    """

    def __init__(
        self,
        name: str,
        fetch_fn: str | None = None,
        data: list[dict[str, Any]] | None = None,
        params: dict[str, Any] | None = None,
        refresh: dict[str, Any] | None = None,
    ):
        self.name = name
        self.fetch_fn = fetch_fn
        self.data = data
        self.params = params or {}
        self.refresh = refresh

    @classmethod
    def static(cls, data: list[dict[str, Any]], name: str = "static") -> DataPipeline:
        """Create a pipeline with inline static data."""
        return cls(name=name, data=data)

    @classmethod
    def from_code(
        cls,
        name: str,
        code: str,
        params: dict[str, Any] | None = None,
        refresh: dict[str, Any] | None = None,
    ) -> DataPipeline:
        """Create a pipeline from a Python function body."""
        return cls(name=name, fetch_fn=code, params=params, refresh=refresh)

    def to_data_source(self) -> WidgetDataSource:
        """Convert to a WidgetDataSource spec."""
        if self.data is not None:
            return WidgetDataSource(
                type="static",
                data=self.data,
                refreshInterval=0,
            )

        return WidgetDataSource(
            type="modal_endpoint",
            endpoint=self.name,
            refreshInterval=self.refresh.get("intervalSeconds", 0)
            if self.refresh
            else 0,
        )

    @property
    def static_data(self) -> list[dict[str, Any]] | None:
        """Return inline data if this is a static pipeline."""
        return self.data
