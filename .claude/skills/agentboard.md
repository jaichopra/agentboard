# agentboard

Create and deploy AI-powered dashboards from natural language descriptions.

## When to use

Use this skill when the user asks to:
- Create a dashboard
- Build a data visualization
- Set up monitoring or analytics views
- Track metrics with charts, KPIs, or tables

## How it works

You generate a dashboard spec (JSON) that conforms to the Agentboard schema, then either:
1. Write it as a static dashboard in `apps/web/lib/demo-data.ts`
2. Deploy it via the Python SDK
3. Create it via the `/api/chat` endpoint

## Dashboard Spec Schema

```json
{
  "id": "unique-id",
  "version": 1,
  "title": "Dashboard Title",
  "description": "One sentence description",
  "author": "author name",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  "published": true,
  "tags": ["tag1", "tag2"],
  "widgets": [...]
}
```

## Widget Types

| Type | Config | Use for |
|------|--------|---------|
| `bar_chart` | `{index, categories, colors, stack}` | Comparing values |
| `line_chart` | `{index, categories, colors}` | Trends over time |
| `area_chart` | `{index, categories, colors, stack}` | Trends with volume |
| `donut_chart` | `{index, categories, colors}` | Proportions |
| `kpi_card` | `{valueExpr, prefix, suffix, trend}` | Key metrics |
| `table` | `{columns, pageSize}` | Detailed data |
| `text` | `{content, variant}` | Explanations |

## Layout Rules (CRITICAL)

The grid is 12 columns. Each row is 160px tall.

1. **Start with KPI cards** in row 1: 3-4 cards, columnSpan 3 each, rowSpan 1
2. **Charts need rowSpan 3** minimum (480px) for readability
3. **Use full width**: main chart columnSpan 8 + side panel columnSpan 4
4. **Tables**: columnSpan 12, rowSpan 2-3, placed at the bottom
5. **Max 6-8 widgets** per dashboard

## Colors (always specify explicitly)

Available: `emerald`, `cyan`, `violet`, `amber`, `rose`, `blue`, `indigo`, `teal`, `orange`, `sky`, `pink`, `lime`, `fuchsia`, `purple`

Recommended combos:
- Single: `["emerald"]`
- Dual: `["emerald", "amber"]` or `["cyan", "rose"]`
- Multi: `["emerald", "cyan", "violet", "amber", "rose"]`

## valueExpr for KPI Cards

- `sum(field)` — sum all values
- `avg(field)` — average
- `count(field)` — count rows
- `min(field)` / `max(field)`

Optional trend: `{"trend": {"value": 12, "direction": "up", "isPositive": true}}`

## Data Source

Each widget needs a `dataSource`:

```json
{
  "type": "static",
  "data": [{"month": "Jan", "revenue": 4200}, ...],
  "refreshInterval": 0
}
```

## Example: Creating a Dashboard

When the user asks "create a dashboard tracking sales", generate the full spec and write it. Here's a minimal example:

```json
{
  "id": "sales-q1",
  "version": 1,
  "title": "Sales Overview",
  "description": "Q1 2026 sales performance across all regions.",
  "author": "You",
  "createdAt": "2026-03-14T00:00:00Z",
  "updatedAt": "2026-03-14T00:00:00Z",
  "published": true,
  "tags": ["sales", "q1"],
  "widgets": [
    {
      "id": "k1",
      "type": "kpi_card",
      "title": "Total Revenue",
      "layout": {"column": 1, "columnSpan": 4, "row": 1, "rowSpan": 1},
      "dataSource": {"type": "static", "data": [{"revenue": 142000}], "refreshInterval": 0},
      "config": {"valueExpr": "sum(revenue)", "prefix": "$", "trend": {"value": 18, "direction": "up", "isPositive": true}}
    },
    {
      "id": "k2",
      "type": "kpi_card",
      "title": "Total Orders",
      "layout": {"column": 5, "columnSpan": 4, "row": 1, "rowSpan": 1},
      "dataSource": {"type": "static", "data": [{"orders": 1847}], "refreshInterval": 0},
      "config": {"valueExpr": "sum(orders)"}
    },
    {
      "id": "k3",
      "type": "kpi_card",
      "title": "Avg Order Value",
      "layout": {"column": 9, "columnSpan": 4, "row": 1, "rowSpan": 1},
      "dataSource": {"type": "static", "data": [{"aov": 77}], "refreshInterval": 0},
      "config": {"valueExpr": "avg(aov)", "prefix": "$"}
    },
    {
      "id": "c1",
      "type": "bar_chart",
      "title": "Monthly Revenue",
      "layout": {"column": 1, "columnSpan": 12, "row": 2, "rowSpan": 3},
      "dataSource": {
        "type": "static",
        "data": [
          {"month": "Jan", "revenue": 42000},
          {"month": "Feb", "revenue": 48000},
          {"month": "Mar", "revenue": 52000}
        ],
        "refreshInterval": 0
      },
      "config": {"index": "month", "categories": ["revenue"], "colors": ["emerald"]}
    }
  ]
}
```

## Workflow

1. Ask the user what they want to track
2. Generate the dashboard spec following all layout rules
3. Add it to `apps/web/lib/demo-data.ts` by importing and appending to the `DEMO_DASHBOARDS` array
4. Tell the user to visit `localhost:3000/{dashboard-id}` to see it

## File Locations

- Dashboard data: `apps/web/lib/demo-data.ts`
- Zod schemas: `apps/web/lib/schemas/`
- Widget components: `apps/web/components/dashboard/widgets/`
- API route: `apps/web/app/api/chat/route.ts`
- Python SDK: `packages/sdk/src/agentboard/`
- Modal backend: `packages/modal-agents/src/agentboard_modal/`
