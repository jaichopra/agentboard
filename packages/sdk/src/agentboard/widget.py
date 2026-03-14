"""Widget — builder for dashboard widget specs."""

from __future__ import annotations

import uuid
from typing import Any

from .pipeline import DataPipeline
from .types import WidgetSpec, WidgetLayout


class Widget:
    """Builder for widget specs. Use class methods to create typed widgets."""

    @staticmethod
    def _make(
        widget_type: str,
        title: str,
        data_pipeline: DataPipeline,
        layout: dict[str, int],
        config: dict[str, Any],
        description: str | None = None,
    ) -> WidgetSpec:
        return WidgetSpec(
            id=str(uuid.uuid4())[:8],
            type=widget_type,
            title=title,
            description=description,
            layout=WidgetLayout(**layout),
            dataSource=data_pipeline.to_data_source(),
            config=config,
        )

    @classmethod
    def bar_chart(
        cls,
        title: str,
        data_pipeline: DataPipeline,
        x: str,
        y: str | list[str],
        layout: dict[str, int],
        colors: list[str] | None = None,
        stack: bool = False,
    ) -> WidgetSpec:
        categories = [y] if isinstance(y, str) else y
        return cls._make(
            "bar_chart",
            title,
            data_pipeline,
            layout,
            {
                "index": x,
                "categories": categories,
                "colors": colors or ["emerald"],
                "stack": stack,
            },
        )

    @classmethod
    def line_chart(
        cls,
        title: str,
        data_pipeline: DataPipeline,
        x: str,
        y: str | list[str],
        layout: dict[str, int],
        colors: list[str] | None = None,
    ) -> WidgetSpec:
        categories = [y] if isinstance(y, str) else y
        return cls._make(
            "line_chart",
            title,
            data_pipeline,
            layout,
            {
                "index": x,
                "categories": categories,
                "colors": colors or ["emerald"],
            },
        )

    @classmethod
    def area_chart(
        cls,
        title: str,
        data_pipeline: DataPipeline,
        x: str,
        y: str | list[str],
        layout: dict[str, int],
        colors: list[str] | None = None,
        stack: bool = False,
    ) -> WidgetSpec:
        categories = [y] if isinstance(y, str) else y
        return cls._make(
            "area_chart",
            title,
            data_pipeline,
            layout,
            {
                "index": x,
                "categories": categories,
                "colors": colors or ["emerald"],
                "stack": stack,
            },
        )

    @classmethod
    def donut_chart(
        cls,
        title: str,
        data_pipeline: DataPipeline,
        category: str,
        value: str,
        layout: dict[str, int],
        colors: list[str] | None = None,
    ) -> WidgetSpec:
        return cls._make(
            "donut_chart",
            title,
            data_pipeline,
            layout,
            {
                "index": category,
                "categories": [value],
                "colors": colors or ["emerald", "cyan", "violet", "amber", "rose"],
            },
        )

    @classmethod
    def kpi_card(
        cls,
        title: str,
        data_pipeline: DataPipeline,
        value_expr: str,
        layout: dict[str, int],
        prefix: str = "",
        suffix: str = "",
    ) -> WidgetSpec:
        config: dict[str, Any] = {"valueExpr": value_expr}
        if prefix:
            config["prefix"] = prefix
        if suffix:
            config["suffix"] = suffix
        return cls._make("kpi_card", title, data_pipeline, layout, config)

    @classmethod
    def table(
        cls,
        title: str,
        data_pipeline: DataPipeline,
        columns: list[str],
        layout: dict[str, int],
        page_size: int = 50,
    ) -> WidgetSpec:
        return cls._make(
            "table",
            title,
            data_pipeline,
            layout,
            {"columns": columns, "pageSize": page_size},
        )

    @classmethod
    def text(
        cls,
        title: str,
        content: str,
        layout: dict[str, int],
        variant: str = "paragraph",
    ) -> WidgetSpec:
        return cls._make(
            "text",
            title,
            DataPipeline.static([]),
            layout,
            {"content": content, "variant": variant},
        )
