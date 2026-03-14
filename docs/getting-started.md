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

---

## Three Ways to Create Dashboards

### 1. Chat UI (no code)

Navigate to `/create` in the web app. Describe what you want:

> "Show me a dashboard tracking monthly revenue with KPIs for total, average, and growth"

Claude generates the spec live with a real-time preview. Click publish when you're happy.

### 2. Python SDK (programmatic)

```bash
pip install agentboard
```

#### Hello World

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
print(f"Live at: {result.url}")
```

#### Agent-Assisted Creation

Let Claude build the entire dashboard from a prompt:

```python
result = client.create_with_agent(
    prompt="Track GitHub stars for anthropics/claude-code with daily refresh"
)
print(result.url)
```

### 3. Claude Code Skill (for developers using Claude Code)

If you use [Claude Code](https://claude.com/claude-code), Agentboard includes a built-in skill. Just ask Claude to create a dashboard in your terminal:

```
> /agentboard create a dashboard tracking API latency by endpoint
```

Claude will:
1. Generate a valid dashboard spec following all layout and color rules
2. Add it to your project's demo data
3. Tell you the URL to view it

The skill is defined in `.claude/skills/agentboard.md` and is automatically available when you open the project in Claude Code.

#### What the skill knows

- The full dashboard JSON schema
- Layout rules (KPIs on top, charts need rowSpan 3, 12-column grid)
- Color system (which colors work, which combos look good)
- All widget types and their config options
- Where to write files in the project

This is the fastest way to iterate on dashboards — describe what you want in natural language and Claude handles the schema, layout, and data.

---

## Deploying the Modal Backend

For production with live data pipelines and scheduled refresh.

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
- **QueryEngine** (keep_warm=1) — serves widget data with sub-ms reads
- **API endpoints** — dashboard CRUD
- **RefreshScheduler** — cron every 5 minutes, checks for due refreshes
- **DashboardAgent + DataAgent** — on-demand Claude agents for spec/pipeline generation

## Project Structure

```
agentboard/
├── apps/web/                          # Next.js frontend
├── packages/
│   ├── sdk/                           # Python SDK (pip install agentboard)
│   └── modal-agents/                  # Modal backend (agents, LanceDB, pipelines)
├── examples/                          # Hello world, pipeline, agent examples
├── docs/                              # Architecture, SDK guide, security
└── .claude/skills/agentboard.md       # Claude Code skill
```
