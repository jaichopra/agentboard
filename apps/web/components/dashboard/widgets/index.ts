import type { ComponentType } from "react";
import type { Widget, WidgetType } from "@/lib/schemas";
import AreaChartWidget from "./AreaChartWidget";
import BarChartWidget from "./BarChartWidget";
import DonutChartWidget from "./DonutChartWidget";
import KPICardWidget from "./KPICardWidget";
import LineChartWidget from "./LineChartWidget";
import TableWidget from "./TableWidget";
import TextWidget from "./TextWidget";

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
  // Placeholder — these render as text for now
  combo_chart: BarChartWidget,
  spark_chart: LineChartWidget,
  tracker: TableWidget,
  progress_bar: KPICardWidget,
};
