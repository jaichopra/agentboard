# Getting Started

## Quick Start (Frontend Only)

Run the dashboard UI locally with demo data — no Modal or S3 required.

```bash
cd apps/web
pnpm install
pnpm dev
```

Open http://localhost:3000 to see:
- Landing page with community dashboard gallery
- Click any dashboard to see it rendered
- Go to `/create` to generate a dashboard via chat (requires `ANTHROPIC_API_KEY`)

### Environment Variables

Create `apps/web/.env.local`:

```bash
# Required for chat-based dashboard creation
ANTHROPIC_API_KEY=sk-ant-...

# Optional — for production backend
MODAL_API_URL=https://your-modal-app--agentboard.modal.run
LANCEDB_URI=s3://your-bucket/lancedb
```

## Python SDK

```bash
pip install agentboard
```

### Hello World

```python
from agentboard import AgentboardClient, Dashboard, Widget, DataPipeline

client = AgentboardClient(api_key="ab_...")

sales = DataPipeline.static(data=[
    {"month": "Jan", "revenue": 4200},
    {"month": "Feb", "revenue": 5100},
    {"month": "Mar", "revenue": 4800},
])

dashboard = Dashboard(
    title="My First Dashboard",
    description="Revenue overview",
    widgets=[
        Widget.bar_chart(
            title="Revenue",
            data_pipeline=sales,
            x="month", y="revenue",
            layout={"column": 1, "columnSpan": 12, "row": 1, "rowSpan": 2},
        ),
    ],
)

result = client.deploy(dashboard, publish=True)
print(f"Live at: {result.url}")
```

### Agent-Assisted Creation

Let Claude build the entire dashboard from a prompt:

```python
result = client.create_with_agent(
    prompt="Track GitHub stars for anthropics/claude-code with daily refresh"
)
print(result.url)
```

## Deploying the Modal Backend

### Prerequisites
- Modal account with `modal` CLI installed
- S3 bucket for LanceDB durability
- Anthropic API key

### Setup Modal Secrets

```bash
modal secret create anthropic ANTHROPIC_API_KEY=sk-ant-...
modal secret create agentboard-s3 \
  AWS_ACCESS_KEY_ID=... \
  AWS_SECRET_ACCESS_KEY=... \
  LANCEDB_URI=s3://your-bucket/lancedb
```

### Deploy

```bash
cd packages/modal-agents
modal deploy src/agentboard_modal/app.py
```

This starts:
- QueryEngine (keep_warm=1) — serves widget data
- API endpoints — dashboard CRUD
- RefreshScheduler — cron every 5 minutes
- DashboardAgent + DataAgent — on-demand Claude agents

## Project Structure

```
agentboard/
├── apps/web/              # Next.js frontend
├── packages/
│   ├── sdk/               # Python SDK (pip install agentboard)
│   └── modal-agents/      # Modal backend
├── examples/              # Example dashboards
└── docs/                  # Documentation
```
