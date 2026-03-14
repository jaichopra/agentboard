import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Widget, WidgetType } from "@/lib/schemas";
import AreaChartWidget from "./AreaChartWidget";
import BarChartWidget from "./BarChartWidget";
import DonutChartWidget from "./DonutChartWidget";
import KPICardWidget from "./KPICardWidget";
import LineChartWidget from "./LineChartWidget";
import TableWidget from "./TableWidget";
import TextWidget from "./TextWidget";
import ImageWidget from "./ImageWidget";
import ImageGridWidget from "./ImageGridWidget";
import MarkdownWidget from "./MarkdownWidget";
import CodeBlockWidget from "./CodeBlockWidget";

// Dynamically imported widgets (heavy deps, SSR-incompatible)
const VideoWidget = dynamic(() => import("./VideoWidget"), { ssr: false });
const PointCloudWidget = dynamic(() => import("./PointCloudWidget"), { ssr: false });
const MapWidget = dynamic(() => import("./MapWidget"), { ssr: false });

export interface WidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export const WIDGET_REGISTRY: Record<
  WidgetType,
  ComponentType<WidgetProps>
> = {
  area_chart: AreaChartWidget,
  bar_chart: BarChartWidget,
  line_chart: LineChartWidget,
  donut_chart: DonutChartWidget,
  kpi_card: KPICardWidget,
  table: TableWidget,
  text: TextWidget,
  image: ImageWidget,
  image_grid: ImageGridWidget,
  video: VideoWidget,
  point_cloud: PointCloudWidget,
  map: MapWidget,
  markdown: MarkdownWidget,
  code_block: CodeBlockWidget,
};
