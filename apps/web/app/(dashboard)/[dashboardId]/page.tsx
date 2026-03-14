"use client";

import { use } from "react";
import Header from "@/components/layout/Header";
import DashboardRenderer from "@/components/dashboard/DashboardRenderer";
import { DEMO_DASHBOARDS } from "@/lib/demo-data";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ dashboardId: string }>;
}) {
  const { dashboardId } = use(params);

  // For now, look up from demo data. In production this fetches from Modal/LanceDB.
  const spec = DEMO_DASHBOARDS.find((d) => d.id === dashboardId);

  if (!spec) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-32 text-zinc-500">
          Dashboard not found
        </div>
      </div>
    );
  }

  // For static data sources, extract data directly from the spec
  const widgetData: Record<string, Record<string, unknown>[]> = {};
  for (const widget of spec.widgets) {
    if (widget.dataSource.type === "static" && widget.dataSource.data) {
      widgetData[widget.id] = widget.dataSource.data;
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <DashboardRenderer spec={spec} widgetData={widgetData} />
    </div>
  );
}
