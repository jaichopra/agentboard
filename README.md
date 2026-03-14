# Agentboard

AI-powered dashboards. Describe what you want to see — an AI agent builds the data pipeline, stores results in LanceDB, and renders a live dashboard.

## Two Ways to Create Dashboards

### For everyone: Chat UI
Go to `/create` and describe your dashboard in plain English. The agent builds it live.

### For engineers: Python SDK

```bash
pip install agentboard
```

```python
from agentboard import AgentboardClient, Dashboard, Widget, DataPipeline

client = AgentboardClient(api_key="ab_...")

# Option 1: Let Claude build it
result = client.create_with_agent(
    prompt="Track GitHub stars for my repo with daily refresh"
)

# Option 2: Define it yourself
sales = DataPipeline.static(data=[
    {"month": "Jan", "revenue": 4200},
    {"month": "Feb", "revenue": 5100},
])

dashboard = Dashboard(
    title="Sales",
    description="Revenue overview",
    widgets=[
        Widget.bar_chart(
            title="Revenue", data_pipeline=sales,
            x="month", y="revenue",
            layout={"column": 1, "columnSpan": 12, "row": 1, "rowSpan": 2},
        ),
    ],
)
result = client.deploy(dashboard, publish=True)
print(result.url)
```

## Architecture

```
User → Next.js → Claude (generates Zod-validated spec) → React renders Tremor components
                                                        ↓
                                            Modal (agent execution)
                                                        ↓
                                            LanceDB (in-process, S3-backed)
```

- **Frontend**: Next.js App Router + Tremor + Vercel AI SDK
- **Backend**: Modal (keep_warm containers, cron refresh)
- **Data**: LanceDB in-process — no database server, no network hop
- **AI**: Claude generates dashboard specs + data pipeline code
- **Security**: Zod validation, AST-based code checking, subprocess sandbox, read/write separation

## Quick Start

```bash
# Run the frontend (demo mode, no backend needed)
cd apps/web
pnpm install
pnpm dev

# Deploy the Modal backend
cd packages/modal-agents
modal secret create anthropic ANTHROPIC_API_KEY=sk-ant-...
modal deploy src/agentboard_modal/app.py
```

## Project Structure

```
agentboard/
├── apps/web/                  # Next.js frontend
│   ├── app/                   # Pages (landing, gallery, create, dashboard viewer)
│   ├── components/dashboard/  # Widget renderers (Tremor-based)
│   └── lib/schemas/           # Zod schemas (central contract)
├── packages/
│   ├── sdk/                   # Python SDK (pip install agentboard)
│   └── modal-agents/          # Modal backend (agents, LanceDB, pipelines)
├── examples/                  # Hello world, pipeline examples
└── docs/                      # Architecture, SDK guide, security
```

## Docs

- [Getting Started](docs/getting-started.md)
- [Architecture](docs/architecture.md)
- [Python SDK Guide](docs/sdk-guide.md)
- [Security Model](docs/security.md)
