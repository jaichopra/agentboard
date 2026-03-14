import type { DashboardSpec } from "./schemas";

const SENSOR_DATA = [
  { time: "00:00", temperature: 22.1, humidity: 45 },
  { time: "04:00", temperature: 19.8, humidity: 52 },
  { time: "08:00", temperature: 21.5, humidity: 48 },
  { time: "12:00", temperature: 26.3, humidity: 38 },
  { time: "16:00", temperature: 28.7, humidity: 33 },
  { time: "20:00", temperature: 24.2, humidity: 41 },
];

const SALES_DATA = [
  { month: "Jan", revenue: 4200, units: 120 },
  { month: "Feb", revenue: 5100, units: 145 },
  { month: "Mar", revenue: 4800, units: 132 },
  { month: "Apr", revenue: 6200, units: 178 },
  { month: "May", revenue: 7100, units: 203 },
  { month: "Jun", revenue: 6800, units: 195 },
];

export const DEMO_DASHBOARDS: DashboardSpec[] = [
  {
    id: "demo-sales",
    version: 1,
    title: "Hello Agentboard",
    description: "A simple sales dashboard demonstrating all widget types.",
    author: "Agentboard Team",
    createdAt: "2026-03-14T00:00:00Z",
    updatedAt: "2026-03-14T00:00:00Z",
    published: true,
    tags: ["demo", "sales"],
    widgets: [
      // Row 1: KPI cards across the top
      {
        id: "w1",
        type: "kpi_card",
        title: "Total Revenue",
        layout: { column: 1, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: { type: "static", data: SALES_DATA, refreshInterval: 0 },
        config: {
          valueExpr: "sum(revenue)",
          prefix: "$",
          trend: { value: 12, direction: "up", isPositive: true },
        },
      },
      {
        id: "w2",
        type: "kpi_card",
        title: "Avg Monthly",
        layout: { column: 4, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: { type: "static", data: SALES_DATA, refreshInterval: 0 },
        config: { valueExpr: "avg(revenue)", prefix: "$" },
      },
      {
        id: "w3",
        type: "kpi_card",
        title: "Total Units",
        layout: { column: 7, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: { type: "static", data: SALES_DATA, refreshInterval: 0 },
        config: {
          valueExpr: "sum(units)",
          trend: { value: 8, direction: "up", isPositive: true },
        },
      },
      {
        id: "w4",
        type: "kpi_card",
        title: "Best Month",
        layout: { column: 10, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: { type: "static", data: SALES_DATA, refreshInterval: 0 },
        config: { valueExpr: "max(revenue)", prefix: "$" },
      },
      // Row 2-4: Main chart
      {
        id: "w5",
        type: "bar_chart",
        title: "Monthly Revenue",
        layout: { column: 1, columnSpan: 8, row: 2, rowSpan: 3 },
        dataSource: { type: "static", data: SALES_DATA, refreshInterval: 0 },
        config: {
          index: "month",
          categories: ["revenue"],
          colors: ["emerald"],
        },
      },
      // Row 2-4: Side chart
      {
        id: "w6",
        type: "donut_chart",
        title: "Units by Month",
        layout: { column: 9, columnSpan: 4, row: 2, rowSpan: 3 },
        dataSource: { type: "static", data: SALES_DATA, refreshInterval: 0 },
        config: {
          index: "month",
          categories: ["units"],
          colors: ["emerald", "cyan", "violet", "amber", "rose", "blue"],
        },
      },
      // Row 5-6: Table
      {
        id: "w7",
        type: "table",
        title: "Detailed Data",
        layout: { column: 1, columnSpan: 12, row: 5, rowSpan: 2 },
        dataSource: { type: "static", data: SALES_DATA, refreshInterval: 0 },
        config: { columns: ["month", "revenue", "units"] },
      },
    ],
  },
  {
    id: "demo-github",
    version: 1,
    title: "GitHub Repository Analytics",
    description:
      "Track stars, forks, and contributor activity for any GitHub repo.",
    author: "Agentboard Team",
    createdAt: "2026-03-14T00:00:00Z",
    updatedAt: "2026-03-14T00:00:00Z",
    published: true,
    tags: ["github", "analytics", "open-source"],
    widgets: [
      // Row 1: KPIs
      {
        id: "g1",
        type: "kpi_card",
        title: "Total Stars",
        layout: { column: 1, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: [{ stars: 3100 }],
          refreshInterval: 0,
        },
        config: {
          valueExpr: "sum(stars)",
          trend: { value: 29, direction: "up", isPositive: true },
        },
      },
      {
        id: "g2",
        type: "kpi_card",
        title: "Open Issues",
        layout: { column: 4, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: [{ issues: 88 }],
          refreshInterval: 0,
        },
        config: {
          valueExpr: "sum(issues)",
          trend: { value: 5, direction: "down", isPositive: true },
        },
      },
      {
        id: "g3",
        type: "kpi_card",
        title: "Contributors",
        layout: { column: 7, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: [{ contributors: 47 }],
          refreshInterval: 0,
        },
        config: { valueExpr: "sum(contributors)" },
      },
      {
        id: "g4",
        type: "kpi_card",
        title: "Forks",
        layout: { column: 10, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: [{ forks: 412 }],
          refreshInterval: 0,
        },
        config: {
          valueExpr: "sum(forks)",
          trend: { value: 15, direction: "up", isPositive: true },
        },
      },
      // Row 2-4: Stars chart
      {
        id: "g5",
        type: "line_chart",
        title: "Stars Over Time",
        layout: { column: 1, columnSpan: 8, row: 2, rowSpan: 3 },
        dataSource: {
          type: "static",
          data: [
            { week: "W1", stars: 120 },
            { week: "W2", stars: 340 },
            { week: "W3", stars: 580 },
            { week: "W4", stars: 890 },
            { week: "W5", stars: 1240 },
            { week: "W6", stars: 1800 },
            { week: "W7", stars: 2400 },
            { week: "W8", stars: 3100 },
          ],
          refreshInterval: 0,
        },
        config: {
          index: "week",
          categories: ["stars"],
          colors: ["amber"],
        },
      },
      // Row 2-4: Issues donut
      {
        id: "g6",
        type: "donut_chart",
        title: "Issues by Label",
        layout: { column: 9, columnSpan: 4, row: 2, rowSpan: 3 },
        dataSource: {
          type: "static",
          data: [
            { label: "bug", count: 23 },
            { label: "feature", count: 45 },
            { label: "docs", count: 12 },
            { label: "perf", count: 8 },
          ],
          refreshInterval: 0,
        },
        config: {
          index: "label",
          categories: ["count"],
          colors: ["rose", "cyan", "violet", "amber"],
        },
      },
      // Row 5-7: Commits chart
      {
        id: "g7",
        type: "area_chart",
        title: "Weekly Commits",
        layout: { column: 1, columnSpan: 12, row: 5, rowSpan: 3 },
        dataSource: {
          type: "static",
          data: [
            { week: "W1", commits: 45, prs: 12 },
            { week: "W2", commits: 62, prs: 18 },
            { week: "W3", commits: 38, prs: 9 },
            { week: "W4", commits: 71, prs: 22 },
            { week: "W5", commits: 55, prs: 15 },
            { week: "W6", commits: 88, prs: 28 },
            { week: "W7", commits: 42, prs: 11 },
            { week: "W8", commits: 67, prs: 19 },
          ],
          refreshInterval: 0,
        },
        config: {
          index: "week",
          categories: ["commits", "prs"],
          colors: ["cyan", "violet"],
        },
      },
    ],
  },
  {
    id: "demo-infra",
    version: 1,
    title: "Infrastructure Monitor",
    description:
      "Real-time infrastructure health and cost tracking powered by AI agents.",
    author: "Agentboard Team",
    createdAt: "2026-03-14T00:00:00Z",
    updatedAt: "2026-03-14T00:00:00Z",
    published: true,
    tags: ["infrastructure", "monitoring", "devops"],
    widgets: [
      // Row 1: KPIs
      {
        id: "i1",
        type: "kpi_card",
        title: "Monthly Spend",
        layout: { column: 1, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: [{ spend: 12847 }],
          refreshInterval: 0,
        },
        config: {
          valueExpr: "sum(spend)",
          prefix: "$",
          trend: { value: 8, direction: "up", isPositive: false },
        },
      },
      {
        id: "i2",
        type: "kpi_card",
        title: "Uptime",
        layout: { column: 4, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: [{ uptime: 99.97 }],
          refreshInterval: 0,
        },
        config: { valueExpr: "avg(uptime)", suffix: "%" },
      },
      {
        id: "i3",
        type: "kpi_card",
        title: "Active Services",
        layout: { column: 7, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: [{ count: 24 }],
          refreshInterval: 0,
        },
        config: { valueExpr: "sum(count)" },
      },
      {
        id: "i4",
        type: "kpi_card",
        title: "P95 Latency",
        layout: { column: 10, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: [{ latency: 142 }],
          refreshInterval: 0,
        },
        config: { valueExpr: "avg(latency)", suffix: "ms" },
      },
      // Row 2-4: Request volume
      {
        id: "i5",
        type: "area_chart",
        title: "Request Volume",
        layout: { column: 1, columnSpan: 8, row: 2, rowSpan: 3 },
        dataSource: {
          type: "static",
          data: [
            { hour: "00:00", requests: 1200, errors: 3 },
            { hour: "04:00", requests: 800, errors: 1 },
            { hour: "08:00", requests: 3400, errors: 12 },
            { hour: "12:00", requests: 5600, errors: 8 },
            { hour: "16:00", requests: 4800, errors: 15 },
            { hour: "20:00", requests: 2100, errors: 5 },
          ],
          refreshInterval: 0,
        },
        config: {
          index: "hour",
          categories: ["requests", "errors"],
          colors: ["emerald", "rose"],
        },
      },
      // Row 2-4: Cost by service
      {
        id: "i6",
        type: "bar_chart",
        title: "Cost by Service",
        layout: { column: 9, columnSpan: 4, row: 2, rowSpan: 3 },
        dataSource: {
          type: "static",
          data: [
            { service: "EC2", cost: 4200 },
            { service: "RDS", cost: 3100 },
            { service: "S3", cost: 890 },
            { service: "Lambda", cost: 2400 },
            { service: "ECS", cost: 2257 },
          ],
          refreshInterval: 0,
        },
        config: {
          index: "service",
          categories: ["cost"],
          colors: ["amber"],
        },
      },
    ],
  },
  {
    id: "demo-multimodal",
    version: 1,
    title: "Field Station Monitor",
    description:
      "Real-time environmental monitoring with multimodal data from remote field stations.",
    author: "Agentboard Team",
    createdAt: "2026-03-14T00:00:00Z",
    updatedAt: "2026-03-14T00:00:00Z",
    published: true,
    tags: ["multimodal", "environmental", "iot"],
    widgets: [
      // Row 1: KPIs
      {
        id: "mm1",
        type: "kpi_card",
        title: "Avg Temperature",
        layout: { column: 1, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: SENSOR_DATA,
          refreshInterval: 0,
        },
        config: { valueExpr: "avg(temperature)", suffix: "°C" },
      },
      {
        id: "mm2",
        type: "kpi_card",
        title: "Avg Humidity",
        layout: { column: 4, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: SENSOR_DATA,
          refreshInterval: 0,
        },
        config: { valueExpr: "avg(humidity)", suffix: "%" },
      },
      {
        id: "mm3",
        type: "kpi_card",
        title: "Peak Temp",
        layout: { column: 7, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: SENSOR_DATA,
          refreshInterval: 0,
        },
        config: { valueExpr: "max(temperature)", suffix: "°C" },
      },
      {
        id: "mm4",
        type: "kpi_card",
        title: "Active Stations",
        layout: { column: 10, columnSpan: 3, row: 1, rowSpan: 1 },
        dataSource: {
          type: "static",
          data: [{ count: 12 }],
          refreshInterval: 0,
        },
        config: { valueExpr: "sum(count)" },
      },
      // Row 2-4: Chart + Map
      {
        id: "mm5",
        type: "area_chart",
        title: "Temperature & Humidity",
        layout: { column: 1, columnSpan: 6, row: 2, rowSpan: 3 },
        dataSource: {
          type: "static",
          data: SENSOR_DATA,
          refreshInterval: 0,
        },
        config: {
          index: "time",
          categories: ["temperature", "humidity"],
          colors: ["emerald", "cyan"],
        },
      },
      {
        id: "mm6",
        type: "map",
        title: "Station Locations",
        layout: { column: 7, columnSpan: 6, row: 2, rowSpan: 3 },
        dataSource: { type: "static", data: [], refreshInterval: 0 },
        config: {
          latitude: 37.65,
          longitude: -122.25,
          zoom: 10,
          markers: [
            { lat: 37.7749, lng: -122.4194, label: "Station Alpha", color: "#10b981" },
            { lat: 37.8716, lng: -122.2727, label: "Station Beta", color: "#06b6d4" },
            { lat: 37.5585, lng: -122.2711, label: "Station Gamma", color: "#8b5cf6" },
            { lat: 37.4419, lng: -122.143, label: "Station Delta", color: "#f59e0b" },
          ],
        },
      },
      // Row 5-7: Image + Markdown
      {
        id: "mm7",
        type: "image",
        title: "Latest Satellite Image",
        layout: { column: 1, columnSpan: 6, row: 5, rowSpan: 3 },
        dataSource: { type: "static", data: [], refreshInterval: 0 },
        config: {
          src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
          alt: "Satellite view of Earth at night",
          objectFit: "cover",
          caption: "Composite satellite imagery — updated every 6 hours",
        },
      },
      {
        id: "mm8",
        type: "markdown",
        title: "Station Notes",
        layout: { column: 7, columnSpan: 6, row: 5, rowSpan: 3 },
        dataSource: { type: "static", data: [], refreshInterval: 0 },
        config: {
          content:
            "## Weekly Summary\n\nAll stations reporting **nominal readings** this week.\n\n### Alerts\n- Station Delta: humidity sensor calibration due **March 20**\n- Station Beta: solar panel efficiency at 87%\n\n### Data Quality\n| Station | Uptime | Completeness |\n|---------|--------|--------------|\n| Alpha   | 99.9%  | 100%         |\n| Beta    | 99.7%  | 99.8%        |\n| Gamma   | 100%   | 100%         |\n| Delta   | 98.2%  | 97.5%        |",
        },
      },
      // Row 8-9: Code block + Image grid
      {
        id: "mm9",
        type: "code_block",
        title: "Ingestion Pipeline",
        layout: { column: 1, columnSpan: 6, row: 8, rowSpan: 2 },
        dataSource: { type: "static", data: [], refreshInterval: 0 },
        config: {
          code: 'from agentboard import DataPipeline\n\npipeline = DataPipeline(\n    name="sensor-ingestion",\n    source="mqtt://gateway.field.local:1883",\n    topic="sensors/+/readings",\n    transform=lambda batch: [\n        {\n            "station": msg["device_id"],\n            "temperature": msg["temp_c"],\n            "humidity": msg["rh_pct"],\n        }\n        for msg in batch\n    ],\n    schedule="*/5 * * * *",\n)\n\npipeline.deploy()',
          language: "python",
          showLineNumbers: true,
        },
      },
      {
        id: "mm10",
        type: "image_grid",
        title: "Station Photos",
        layout: { column: 7, columnSpan: 6, row: 8, rowSpan: 2 },
        dataSource: { type: "static", data: [], refreshInterval: 0 },
        config: {
          images: [
            { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80", alt: "Field station morning", caption: "Alpha" },
            { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80", alt: "Forest canopy", caption: "Beta" },
            { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80", alt: "Sunlit forest", caption: "Gamma" },
            { src: "https://images.unsplash.com/photo-1518173946687-a1e1e5a66e84?w=400&q=80", alt: "Mountain station", caption: "Delta" },
          ],
          columns: 2,
          gap: 8,
          objectFit: "cover",
        },
      },
    ],
  },
];
