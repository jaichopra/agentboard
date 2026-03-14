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

    @classmethod
    def image(
        cls,
        title: str,
        src: str,
        layout: dict[str, int],
        alt: str = "",
        object_fit: str = "cover",
        caption: str = "",
    ) -> WidgetSpec:
        config: dict[str, Any] = {"src": src, "objectFit": object_fit}
        if alt:
            config["alt"] = alt
        if caption:
            config["caption"] = caption
        return cls._make("image", title, DataPipeline.static([]), layout, config)

    @classmethod
    def image_grid(
        cls,
        title: str,
        images: list[dict[str, str]],
        layout: dict[str, int],
        columns: int = 3,
        gap: int = 8,
        object_fit: str = "cover",
    ) -> WidgetSpec:
        return cls._make(
            "image_grid",
            title,
            DataPipeline.static([]),
            layout,
            {"images": images, "columns": columns, "gap": gap, "objectFit": object_fit},
        )

    @classmethod
    def video(
        cls,
        title: str,
        src: str,
        layout: dict[str, int],
        autoplay: bool = False,
        loop: bool = False,
        muted: bool = True,
        controls: bool = True,
        caption: str = "",
    ) -> WidgetSpec:
        config: dict[str, Any] = {
            "src": src,
            "autoplay": autoplay,
            "loop": loop,
            "muted": muted,
            "controls": controls,
        }
        if caption:
            config["caption"] = caption
        return cls._make("video", title, DataPipeline.static([]), layout, config)

    @classmethod
    def map(
        cls,
        title: str,
        markers: list[dict[str, Any]],
        layout: dict[str, int],
        latitude: float | None = None,
        longitude: float | None = None,
        zoom: int = 10,
    ) -> WidgetSpec:
        config: dict[str, Any] = {"markers": markers, "zoom": zoom}
        if latitude is not None:
            config["latitude"] = latitude
        if longitude is not None:
            config["longitude"] = longitude
        return cls._make("map", title, DataPipeline.static([]), layout, config)

    @classmethod
    def markdown(
        cls,
        title: str,
        content: str,
        layout: dict[str, int],
    ) -> WidgetSpec:
        return cls._make(
            "markdown",
            title,
            DataPipeline.static([]),
            layout,
            {"content": content},
        )

    @classmethod
    def code_block(
        cls,
        title: str,
        code: str,
        layout: dict[str, int],
        language: str = "python",
        show_line_numbers: bool = True,
    ) -> WidgetSpec:
        return cls._make(
            "code_block",
            title,
            DataPipeline.static([]),
            layout,
            {"code": code, "language": language, "showLineNumbers": show_line_numbers},
        )

    @classmethod
    def point_cloud(
        cls,
        title: str,
        data_pipeline: DataPipeline,
        layout: dict[str, int],
        color: str = "#06b6d4",
        point_size: float = 0.05,
    ) -> WidgetSpec:
        return cls._make(
            "point_cloud",
            title,
            data_pipeline,
            layout,
            {"color": color, "pointSize": point_size},
        )
