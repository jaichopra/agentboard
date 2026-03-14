<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Modal-serverless-green?logo=modal" alt="Modal" />
  <img src="https://img.shields.io/badge/LanceDB-in--process-blue" alt="LanceDB" />
  <img src="https://img.shields.io/badge/Claude-AI-orange?logo=anthropic" alt="Claude" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
</p>

# Agentboard

**AI-powered dashboards.** Describe what you want to see — an AI agent builds the data pipeline, stores results, and renders a live dashboard. No infrastructure to manage.

```
"Track GitHub stars for my repo with daily refresh"  →  Live dashboard in seconds
```

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   You describe it          Claude builds it         You see it      │
│                                                                     │
│   "Show me revenue    ──►  Generates validated  ──►  Live dashboard │
│    by month with           JSON spec + data          with charts,   │
│    KPIs and trends"        pipeline on Modal         KPIs, tables   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Architecture

```
                        ┌──────────────────────────────┐
                        │      Three Ways to Create    │
                        │                              │
                        │  1. Chat UI (/create)        │
                        │  2. Python SDK               │
                        │  3. Claude Code skill        │
                        └─────────────┬────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Next.js Frontend                                                   │
│                                                                     │
│  ┌───────────┐  ┌─────────────────┐  ┌───────────────────────────┐ │
│  │  Landing   │  │  Dashboard      │  │  Chat Creator            │ │
│  │  Page +    │  │  Renderer       │  │  (Vercel AI SDK)         │ │
│  │  Gallery   │  │  (Tremor)       │  │                          │ │
│  └───────────┘  └────────┬────────┘  └────────────┬──────────────┘ │
│                          │                         │                │
│              ┌───────────▼─────────────────────────▼──────────┐     │
│              │         Zod Schema Validation Layer            │     │
│              │     (rejects invalid specs — no eval)          │     │
│              └───────────────────────┬────────────────────────┘     │
└──────────────────────────────────────│──────────────────────────────┘
                                       │ HTTPS
┌──────────────────────────────────────│──────────────────────────────┐
│  Modal Backend (Serverless)          │                              │
│                                      ▼                              │
│  ┌────────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────────┐  │
│  │ Dashboard  │ │  Data    │ │ Ingestion  │ │  Query Engine    │  │
│  │ Agent      │ │  Agent   │ │ Runner     │ │  (keep_warm=1)   │  │
│  │            │ │          │ │ (sandbox)  │ │                  │  │
│  │ Claude     │ │ Claude   │ │ subprocess │ │  READ-ONLY       │  │
│  │ generates  │ │ generates│ │ execution  │ │  serves widget   │  │
│  │ specs      │ │ pipeline │ │            │ │  data            │  │
│  │            │ │ code     │ │ WRITE      │ │                  │  │
│  └────────────┘ └──────────┘ └─────┬──────┘ └────────┬─────────┘  │
│                                    │ write            │ read       │
│                              ┌─────▼──────────────────▼─────────┐  │
│                              │     LanceDB (in-process)         │  │
│                              │     Memory-mapped Lance files    │  │
│                              │     No DB server. No network hop.│  │
│                              └──────────────┬───────────────────┘  │
│                                             │ sync                 │
│  ┌──────────────────┐                       │                      │
│  │ Refresh Scheduler │──── cron ───────────►│                      │
│  │ (every 5 min)     │                      │                      │
│  └──────────────────┘                       │                      │
└─────────────────────────────────────────────│──────────────────────┘
                                              │
                                         ┌────▼────┐
                                         │   S3    │
                                         │ durable │
                                         │ storage │
                                         └─────────┘
```

## Three Ways to Create Dashboards

### 1. Chat UI — for everyone

Go to `/create` and describe your dashboard in plain English. Claude builds it live with a real-time preview.

### 2. Python SDK — for engineers

```bash
pip install agentboard
```

```python
from agentboard import AgentboardClient, Dashboard, Widget, DataPipeline

client = AgentboardClient(api_key="ab_...")

# Let Claude build the whole thing from a prompt
result = client.create_with_agent(
    prompt="Track GitHub stars for anthropics/claude-code with daily refresh"
)
print(result.url)

# Or define it yourself with full control
sales = DataPipeline.static(data=[
    {"month": "Jan", "revenue": 4200},
    {"month": "Feb", "revenue": 5100},
    {"month": "Mar", "revenue": 4800},
])

dashboard = Dashboard(
    title="Sales Overview",
    description="Monthly revenue performance",
    widgets=[
        Widget.kpi_card(
            title="Total Revenue",
            data_pipeline=sales,
            value_expr="sum(revenue)",
            prefix="$",
            layout={"column": 1, "columnSpan": 4, "row": 1, "rowSpan": 1},
        ),
        Widget.bar_chart(
            title="Monthly Revenue",
            data_pipeline=sales,
            x="month", y="revenue",
            layout={"column": 1, "columnSpan": 12, "row": 2, "rowSpan": 3},
        ),
    ],
)
result = client.deploy(dashboard, publish=True)
print(result.url)
```

### 3. Claude Code Skill — for developers using Claude Code

Agentboard ships with a Claude Code skill. Just ask Claude to create a dashboard:

```
> /agentboard create a dashboard tracking our API latency by endpoint
```

Claude will generate the spec, add it to the project, and tell you where to view it. The skill knows the full schema, layout rules, and color system.

To set it up, add the skill to your project's `.claude/` directory (already included in this repo).

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-org/agentboard.git
cd agentboard

# Install dependencies
pnpm install

# Run the frontend (works immediately with demo dashboards)
cd apps/web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page with community dashboards.

To enable AI-powered dashboard creation via the chat UI:

```bash
# Add your Anthropic API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > apps/web/.env.local
```

### Deploy the Modal Backend (optional)

For production with live data pipelines and scheduled refresh:

```bash
# Set up Modal secrets
modal secret create anthropic ANTHROPIC_API_KEY=sk-ant-...
modal secret create agentboard-s3 \
  AWS_ACCESS_KEY_ID=... \
  AWS_SECRET_ACCESS_KEY=... \
  LANCEDB_URI=s3://your-bucket/lancedb

# Deploy
cd packages/modal-agents
modal deploy src/agentboard_modal/app.py
```

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 15, Tremor, Tailwind | App Router + streaming + beautiful chart components |
| **AI** | Claude (Anthropic API) | Generates dashboard specs + data pipeline code |
| **Validation** | Zod (TS) / Pydantic (Python) | Schema-driven — Claude output is always validated |
| **Compute** | Modal | Serverless containers with keep_warm for hot reads |
| **Data** | LanceDB | In-process columnar DB — no server, no network hop |
| **Storage** | S3 | Durable backing for LanceDB, auto-synced |

## Project Structure

```
agentboard/
├── apps/web/                          # Next.js frontend
│   ├── app/                           # Pages: landing, gallery, create, dashboard viewer, docs
│   ├── components/dashboard/widgets/  # Widget renderers (Bar, Line, Area, Donut, KPI, Table, Text)
│   ├── lib/schemas/                   # Zod schemas — the central contract
│   └── lib/demo-data.ts              # Demo dashboards with sample data
│
├── packages/
│   ├── sdk/                           # Python SDK (pip install agentboard)
│   │   └── src/agentboard/            # Client, Dashboard, Widget, DataPipeline builders
│   └── modal-agents/                  # Modal backend
│       └── src/agentboard_modal/      # DashboardAgent, DataAgent, QueryEngine, IngestionRunner
│
├── examples/
│   └── hello-world/                   # hello_world.py, agent_create.py, pipeline_example.py
│
├── docs/                              # Architecture, SDK guide, security model
│   ├── architecture.md
│   ├── getting-started.md
│   ├── sdk-guide.md
│   └── security.md
│
└── .claude/skills/                    # Claude Code skill for dashboard creation
    └── agentboard.md
```

## Security Model

Agentboard has five independent security boundaries:

| Boundary | What it protects |
|----------|-----------------|
| **Zod validation** | Claude output constrained to known widget types — no eval, no arbitrary code |
| **AST code checking** | Pipeline code parsed via Python AST — blocks subprocess, eval, os.system |
| **Subprocess sandbox** | Pipelines run in isolated processes, not in the main container |
| **In-process database** | LanceDB has no exposed port — no connection string to leak |
| **Read/write separation** | QueryEngine is read-only; IngestionRunner has write access; frontend can only reach reads |

See [Security Model](docs/security.md) for the full deep-dive.

## Documentation

- **[Getting Started](docs/getting-started.md)** — Install, run, deploy
- **[Architecture](docs/architecture.md)** — System design, data flows, Modal classes
- **[Python SDK Guide](docs/sdk-guide.md)** — DataPipeline, Widget, Dashboard builders
- **[Security Model](docs/security.md)** — Defense in depth, threat model

## Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Run `pnpm build` to verify
5. Open a PR

## License

MIT
