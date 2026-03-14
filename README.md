<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Modal-serverless-green?logo=modal" alt="Modal" />
  <img src="https://img.shields.io/badge/LanceDB-in--process-blue" alt="LanceDB" />
  <img src="https://img.shields.io/badge/Claude-AI-orange?logo=anthropic" alt="Claude" />
  <img src="https://img.shields.io/badge/Recharts-charts-8884d8" alt="Recharts" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
</p>

# Agentboard

**Multimodal dashboards powered by AI agents.** Describe what you want — charts, maps, images, video, 3D point clouds, code snippets — and background agents build the data pipeline, keep it fresh, and render a live dashboard. No infrastructure to manage.

```
"Monitor our field stations with sensor charts, a map of locations, and live camera feeds"

  →  Dashboard with area charts, interactive map, image grid, video player — live in seconds
```

---

## Why Agentboard

Most dashboard tools render charts. Agentboard renders *anything* — and agents do the work behind the scenes.

- **Multimodal widgets** — charts, tables, images, video, maps, 3D point clouds, markdown, syntax-highlighted code. Not just bar charts.
- **Background agents** — data pipelines run in sandboxed serverless containers on Modal. Agents generate pipeline code, schedule refresh, and keep data current — you never touch a cron job.
- **Schema-driven safety** — Claude's output is validated against Zod schemas. No `eval()`, no arbitrary code execution on the frontend. Ever.
- **In-process database** — LanceDB runs inside the compute container. No database server, no connection strings, no network hops. S3 backs it for durability.

---

## Widget Types

Agentboard ships with 14 widget types across three categories:

### Charts & Data

| Widget | What it renders |
|--------|----------------|
| `bar_chart` | Grouped or stacked bar charts |
| `line_chart` | Time series with monotone curves |
| `area_chart` | Filled area charts with gradient |
| `donut_chart` | Proportional breakdowns |
| `kpi_card` | Big number with trend badge |
| `table` | Sortable tabular data |

### Multimodal

| Widget | What it renders |
|--------|----------------|
| `image` | Single image with caption |
| `image_grid` | CSS grid gallery with hover zoom |
| `video` | YouTube, Vimeo, or direct video URLs |
| `map` | Interactive MapLibre map with markers |
| `point_cloud` | 3D point cloud with orbit controls |

### Text & Code

| Widget | What it renders |
|--------|----------------|
| `text` | Paragraph, heading, or callout |
| `markdown` | Rich text with GFM tables, lists, code |
| `code_block` | Syntax-highlighted code (50+ languages) |

All widgets are dark-mode native, responsive, and render from a validated JSON spec.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  You describe it              Agents build it            You see it    │
│                                                                        │
│  "Monitor field stations  ──►  Claude generates spec  ──►  Dashboard   │
│   with charts, a map,          + pipeline code.            with 14     │
│   and camera feeds"            Agents refresh data         widget      │
│                                on schedule.                types.      │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌──────────────────────────────┐
                        │      Three Ways to Create    │
                        │                              │
                        │  1. Chat UI (/create)        │
                        │  2. Python SDK               │
                        │  3. Claude Code skill        │
                        └─────────────┬────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Next.js Frontend                                                       │
│                                                                         │
│  ┌───────────┐  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │  Landing   │  │  Dashboard Renderer │  │  Chat Creator            │  │
│  │  Page +    │  │                     │  │  (Anthropic API)         │  │
│  │  Gallery   │  │  14 widget types:   │  │                          │  │
│  │            │  │  Recharts, MapLibre,│  │  Claude generates specs  │  │
│  │            │  │  Three.js, react-   │  │  validated by Zod        │  │
│  │            │  │  player, react-     │  │                          │  │
│  │            │  │  markdown, prism    │  │                          │  │
│  └───────────┘  └────────┬────────────┘  └──────────┬───────────────┘  │
│                          │                           │                  │
│              ┌───────────▼───────────────────────────▼──────────┐       │
│              │         Zod Schema Validation Layer              │       │
│              │     14 widget types — no eval, no arbitrary code │       │
│              └───────────────────────┬─────────────────────────┘       │
└──────────────────────────────────────│──────────────────────────────────┘
                                       │ HTTPS
┌──────────────────────────────────────│──────────────────────────────────┐
│  Modal Backend — Serverless Agent Processes                             │
│                                      ▼                                  │
│  ┌────────────────┐ ┌──────────────────┐ ┌──────────────────────────┐  │
│  │ Dashboard Agent │ │  Data Agent      │ │  Query Engine            │  │
│  │                 │ │                  │ │  (keep_warm=1)           │  │
│  │ Claude Sonnet   │ │  Claude Sonnet   │ │                          │  │
│  │ generates +     │ │  generates       │ │  READ-ONLY               │  │
│  │ refines specs   │ │  pipeline code   │ │  Serves widget data      │  │
│  │                 │ │                  │ │  Sub-ms latency           │  │
│  └────────────────┘ └──────────────────┘ └────────────┬─────────────┘  │
│                                                        │ read           │
│  ┌──────────────────────────────────────┐              │                │
│  │  Ingestion Runner (sandboxed)        │              │                │
│  │                                      │              │                │
│  │  • AST-validated pipeline code       │              │                │
│  │  • subprocess isolation (120s limit) │              │                │
│  │  • WRITE access to LanceDB          │──── write ───┤                │
│  └──────────────────────────────────────┘              │                │
│                                                        │                │
│  ┌──────────────────┐                ┌─────────────────▼─────────────┐ │
│  │ Refresh Scheduler │── cron ──────►│     LanceDB (in-process)      │ │
│  │ (*/5 * * * *)     │  polls for    │     Memory-mapped Lance files │ │
│  │                   │  stale data   │     No server. No network hop.│ │
│  └──────────────────┘               └──────────────┬─────────────────┘ │
└─────────────────────────────────────────────────────│──────────────────┘
                                                      │ sync
                                                 ┌────▼────┐
                                                 │   S3    │
                                                 │ durable │
                                                 │ storage │
                                                 └─────────┘
```

### How Background Agents Work

Agentboard agents are not request-response — they run as **persistent background processes** on Modal's serverless infrastructure:

1. **Dashboard Agent** — Takes a natural language prompt, calls Claude to generate a Zod-validated dashboard spec (widget types, layout, data sources). Can iteratively refine specs based on feedback.

2. **Data Agent** — Claude generates Python pipeline code to fetch data from external sources (APIs, databases, files). The generated code is validated by an AST-based security scanner before execution.

3. **Ingestion Runner** — Executes pipeline code in a **subprocess sandbox** with a 120-second timeout. Pipelines cannot access the filesystem, spawn processes, or call dangerous functions. Only after successful execution does data get written to LanceDB.

4. **Refresh Scheduler** — A single Modal cron job (`*/5 * * * *`) polls all published dashboards, checks which ones need refresh based on their configured interval, and dispatches to the Ingestion Runner. One cron, not N crons per dashboard.

5. **Query Engine** — Read-only, always-warm (`keep_warm=1`) container that serves widget data to the frontend. Sub-millisecond latency for hot reads. Cannot write to the database.

```
 Agent Process        Lifecycle           Access
 ──────────────────────────────────────────────────
 Dashboard Agent      On-demand           Claude API
 Data Agent           On-demand           Claude API
 Ingestion Runner     On-demand           LanceDB (write)
 Refresh Scheduler    Cron (*/5 min)      LanceDB (read → dispatch)
 Query Engine         Always warm         LanceDB (read-only)
```

---

## Three Ways to Create Dashboards

### 1. Chat UI — for everyone

Go to `/create` and describe your dashboard in plain English. Claude builds it live with a real-time preview. Ask for charts, maps, images, code blocks — any of the 14 widget types.

### 2. Python SDK — for engineers

```bash
pip install agentboard
```

```python
from agentboard import AgentboardClient, Dashboard, Widget, DataPipeline

client = AgentboardClient(api_key="ab_...")

# Multimodal dashboard with charts, maps, images, and code
sensor_data = DataPipeline.static(data=[
    {"time": "08:00", "temperature": 21.5, "humidity": 48},
    {"time": "12:00", "temperature": 26.3, "humidity": 38},
    {"time": "16:00", "temperature": 28.7, "humidity": 33},
])

dashboard = Dashboard(
    title="Field Station Monitor",
    description="Environmental monitoring with multimodal data",
    widgets=[
        Widget.kpi_card(
            title="Peak Temp", data_pipeline=sensor_data,
            value_expr="max(temperature)", suffix="°C",
            layout={"column": 1, "columnSpan": 4, "row": 1, "rowSpan": 1},
        ),
        Widget.area_chart(
            title="Temperature & Humidity", data_pipeline=sensor_data,
            x="time", y=["temperature", "humidity"], colors=["emerald", "cyan"],
            layout={"column": 1, "columnSpan": 6, "row": 2, "rowSpan": 3},
        ),
        Widget.map(
            title="Station Locations",
            markers=[
                {"lat": 37.77, "lng": -122.42, "label": "Alpha", "color": "#10b981"},
                {"lat": 37.87, "lng": -122.27, "label": "Beta", "color": "#06b6d4"},
            ],
            latitude=37.8, longitude=-122.3, zoom=10,
            layout={"column": 7, "columnSpan": 6, "row": 2, "rowSpan": 3},
        ),
        Widget.markdown(
            title="Notes",
            content="## Status\n\nAll stations **nominal**.\n\n| Station | Uptime |\n|---------|--------|\n| Alpha | 99.9% |\n| Beta | 99.7% |",
            layout={"column": 1, "columnSpan": 6, "row": 5, "rowSpan": 2},
        ),
        Widget.code_block(
            title="Pipeline", language="python",
            code='pipeline = DataPipeline(\n    source="mqtt://gateway:1883",\n    schedule="*/5 * * * *",\n)\npipeline.deploy()',
            layout={"column": 7, "columnSpan": 6, "row": 5, "rowSpan": 2},
        ),
    ],
)

result = client.deploy(dashboard, publish=True)
print(result.url)
```

See [`examples/multimodal-dashboard/`](examples/multimodal-dashboard/) for a full working example.

### 3. Claude Code Skill — for developers using Claude Code

Agentboard ships with a Claude Code skill. Just ask Claude to create a dashboard:

```
> /agentboard create a dashboard with sensor charts, a map of stations, and station photos
```

Claude generates the spec with the correct schema, layout rules, color system, and multimodal widget types. The skill is at `.claude/skills/agentboard.md`.

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/jaichopra/agentboard.git
cd agentboard

# Install dependencies
pnpm install

# Run the frontend (works immediately with demo dashboards)
cd apps/web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page. Visit `/demo-multimodal` to see the multimodal showcase.

To enable AI-powered dashboard creation via the chat UI:

```bash
# Add your Anthropic API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > apps/web/.env.local
```

### Run Tests

```bash
cd apps/web
pnpm test        # 58 tests across schemas, widgets, registry, demo data
```

### Deploy the Modal Backend (optional)

For production with live data pipelines, background agents, and scheduled refresh:

```bash
# Set up Modal secrets
modal secret create anthropic ANTHROPIC_API_KEY=sk-ant-...
modal secret create agentboard-s3 \
  AWS_ACCESS_KEY_ID=... \
  AWS_SECRET_ACCESS_KEY=... \
  LANCEDB_URI=s3://your-bucket/lancedb

# Deploy all agents
cd packages/modal-agents
modal deploy src/agentboard_modal/app.py
```

This deploys five agent processes:

| Process | What it does | Lifecycle |
|---------|-------------|-----------|
| Dashboard Agent | Claude generates dashboard specs from prompts | On-demand |
| Data Agent | Claude generates pipeline code | On-demand |
| Ingestion Runner | Executes pipelines in subprocess sandbox | On-demand |
| Refresh Scheduler | Polls for stale data, dispatches refresh | Cron (every 5 min) |
| Query Engine | Serves widget data to frontend | Always warm |

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 15, Recharts, Tailwind | App Router + dark-mode-native charts |
| **Multimodal** | MapLibre, Three.js, react-player, react-markdown, Prism | Maps, 3D, video, rich text, code |
| **AI** | Claude (Anthropic API) | Generates dashboard specs + pipeline code |
| **Validation** | Zod (TS) / Pydantic (Python) | Schema-driven — AI output is always validated |
| **Compute** | Modal | Serverless containers with keep_warm for hot reads |
| **Data** | LanceDB | In-process columnar DB — no server, no network hop |
| **Storage** | S3 | Durable backing for LanceDB |
| **Testing** | Vitest, Testing Library | 58 tests across schemas, widgets, and integration |

## Project Structure

```
agentboard/
├── apps/web/                              # Next.js frontend
│   ├── app/                               # Pages: landing, gallery, create, dashboard viewer
│   ├── components/dashboard/
│   │   ├── WidgetShell.tsx                # Shared card wrapper for all widgets
│   │   ├── WidgetRenderer.tsx             # Looks up widget type → component
│   │   ├── DashboardRenderer.tsx          # 12-column grid layout engine
│   │   └── widgets/                       # 14 widget renderers
│   │       ├── BarChartWidget.tsx          #   ├── Charts (Recharts)
│   │       ├── LineChartWidget.tsx         #   │
│   │       ├── AreaChartWidget.tsx         #   │
│   │       ├── DonutChartWidget.tsx        #   │
│   │       ├── KPICardWidget.tsx           #   │
│   │       ├── TableWidget.tsx             #   ├── Data
│   │       ├── ImageWidget.tsx             #   ├── Multimodal
│   │       ├── ImageGridWidget.tsx         #   │
│   │       ├── VideoWidget.tsx             #   │
│   │       ├── MapWidget.tsx               #   │
│   │       ├── PointCloudWidget.tsx        #   │
│   │       ├── TextWidget.tsx              #   ├── Text & Code
│   │       ├── MarkdownWidget.tsx          #   │
│   │       ├── CodeBlockWidget.tsx         #   │
│   │       ├── chart-theme.ts             #   └── Shared color/style config
│   │       └── index.ts                   #       Widget registry
│   ├── lib/
│   │   ├── schemas/                       # Zod schemas (the central contract)
│   │   ├── demo-data.ts                   # 4 demo dashboards incl. multimodal
│   │   └── utils.ts                       # cn() helper
│   └── tests/                             # Vitest test suite (58 tests)
│
├── packages/
│   ├── sdk/                               # Python SDK (pip install agentboard)
│   │   └── src/agentboard/
│   │       ├── widget.py                  # Builders for all 14 widget types
│   │       ├── pipeline.py                # DataPipeline (static, endpoint, LanceDB)
│   │       ├── dashboard.py               # Dashboard builder
│   │       └── client.py                  # AgentboardClient
│   └── modal-agents/                      # Modal backend (5 agent processes)
│       └── src/agentboard_modal/
│           ├── app.py                     # Modal app definition
│           ├── dashboard_agent.py         # Claude generates specs
│           ├── data_agent.py              # Claude generates pipeline code
│           ├── ingestion.py               # Subprocess sandbox execution
│           ├── refresh.py                 # Cron scheduler (*/5 * * * *)
│           ├── query_engine.py            # Read-only data server (keep_warm=1)
│           ├── security.py                # AST-based code validation
│           └── lancedb_store.py           # LanceDB read/write helpers
│
├── examples/
│   ├── hello-world/                       # Minimal dashboard example
│   └── multimodal-dashboard/             # Full multimodal example (all widget types)
│
├── docs/                                  # Architecture, SDK guide, security model
└── .claude/skills/agentboard.md          # Claude Code skill
```

## Security Model

Agentboard has five independent security boundaries:

| Boundary | What it protects |
|----------|-----------------|
| **Zod validation** | Claude output constrained to 14 known widget types — no eval, no arbitrary code |
| **AST code checking** | Pipeline code parsed via Python AST — blocks subprocess, eval, os.system, dangerous imports |
| **Subprocess sandbox** | Pipelines run in isolated processes with 120-second timeout, not in the main container |
| **In-process database** | LanceDB has no exposed port — no connection string to leak |
| **Read/write separation** | QueryEngine is read-only; IngestionRunner has write access; frontend can only reach reads |

See [Security Model](docs/security.md) for the full deep-dive.

## Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Run `pnpm build && pnpm test` to verify
4. Open a PR

## License

MIT
