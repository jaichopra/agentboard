import Link from "next/link";
import Header from "@/components/layout/Header";

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-50">Documentation</h1>
        <p className="mt-2 text-zinc-400">
          Everything you need to build AI-powered dashboards with Agentboard.
        </p>

        {/* Quick Start */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-100">Quick Start</h2>
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-sm font-medium text-zinc-400">
              Run the frontend locally
            </p>
            <pre className="mt-3 rounded-md bg-zinc-950 p-4 text-sm text-green-400">
              <code>
{`cd apps/web
pnpm install
pnpm dev`}
              </code>
            </pre>
            <p className="mt-4 text-sm font-medium text-zinc-400">
              Install the Python SDK
            </p>
            <pre className="mt-3 rounded-md bg-zinc-950 p-4 text-sm text-green-400">
              <code>pip install agentboard</code>
            </pre>
          </div>
        </section>

        {/* Two Paths */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-100">
            Two Ways to Create Dashboards
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="font-semibold text-zinc-200">Chat UI</h3>
              <p className="mt-2 text-sm text-zinc-500">
                For non-technical users. Go to{" "}
                <Link href="/create" className="text-green-400 hover:underline">
                  /create
                </Link>{" "}
                and describe your dashboard in plain English. The agent builds it
                live.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="font-semibold text-zinc-200">Python SDK</h3>
              <p className="mt-2 text-sm text-zinc-500">
                For engineers. Define dashboards as code, set up data pipelines,
                and deploy with a single command.
              </p>
            </div>
          </div>
        </section>

        {/* SDK Usage */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-100">
            Python SDK
          </h2>

          <h3 className="mt-6 text-lg font-medium text-zinc-200">
            Hello World
          </h3>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-300">
            <code>
{`from agentboard import AgentboardClient, Dashboard, Widget, DataPipeline

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
print(f"Live at: {result.url}")`}
            </code>
          </pre>

          <h3 className="mt-8 text-lg font-medium text-zinc-200">
            Agent-Assisted Creation
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            Let Claude build the entire dashboard from a prompt:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-300">
            <code>
{`result = client.create_with_agent(
    prompt="Track GitHub stars for anthropics/claude-code with daily refresh"
)
print(result.url)`}
            </code>
          </pre>

          <h3 className="mt-8 text-lg font-medium text-zinc-200">
            Custom Data Pipelines
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            Define pipeline code that runs on Modal with scheduled refresh:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-300">
            <code>
{`pipeline = DataPipeline.from_code(
    name="github_stats",
    code="""
import requests
resp = requests.get(f"https://api.github.com/repos/{params['repo']}")
data = resp.json()
return [{"stars": data["stargazers_count"], "forks": data["forks_count"]}]
""",
    params={"repo": "anthropics/claude-code"},
    refresh={"cron": "0 */6 * * *"},
)`}
            </code>
          </pre>
        </section>

        {/* Widget Types */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-100">Widget Types</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-3 py-2 font-medium text-zinc-400">Type</th>
                  <th className="px-3 py-2 font-medium text-zinc-400">
                    Description
                  </th>
                  <th className="px-3 py-2 font-medium text-zinc-400">
                    Key Config
                  </th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-zinc-800/50">
                  <td className="px-3 py-2">
                    <code className="text-green-400">bar_chart</code>
                  </td>
                  <td className="px-3 py-2">Compare values across categories</td>
                  <td className="px-3 py-2">
                    <code>index, categories, colors, stack</code>
                  </td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-3 py-2">
                    <code className="text-green-400">line_chart</code>
                  </td>
                  <td className="px-3 py-2">Trends over time</td>
                  <td className="px-3 py-2">
                    <code>index, categories, colors</code>
                  </td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-3 py-2">
                    <code className="text-green-400">area_chart</code>
                  </td>
                  <td className="px-3 py-2">Trends with volume emphasis</td>
                  <td className="px-3 py-2">
                    <code>index, categories, colors, stack</code>
                  </td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-3 py-2">
                    <code className="text-green-400">donut_chart</code>
                  </td>
                  <td className="px-3 py-2">Proportional breakdown</td>
                  <td className="px-3 py-2">
                    <code>index, categories, colors</code>
                  </td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-3 py-2">
                    <code className="text-green-400">kpi_card</code>
                  </td>
                  <td className="px-3 py-2">Single key metric</td>
                  <td className="px-3 py-2">
                    <code>valueExpr, prefix, suffix, trend</code>
                  </td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-3 py-2">
                    <code className="text-green-400">table</code>
                  </td>
                  <td className="px-3 py-2">Detailed tabular data</td>
                  <td className="px-3 py-2">
                    <code>columns, pageSize</code>
                  </td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-3 py-2">
                    <code className="text-green-400">text</code>
                  </td>
                  <td className="px-3 py-2">Explanatory text or callouts</td>
                  <td className="px-3 py-2">
                    <code>content, variant</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Layout */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-100">Layout System</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Dashboards use a 12-column grid. Each row is 120px tall.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-300">
            <code>
{`layout = {
    "column": 1,       # Starting column (1-12)
    "columnSpan": 6,   # Width in columns
    "row": 1,          # Starting row (1+)
    "rowSpan": 2,      # Height in rows
}`}
            </code>
          </pre>
        </section>

        {/* Architecture */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-100">Architecture</h2>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-400">
{`User prompt
    |
    v
Next.js (Zod-validated spec)
    |
    v
Modal Backend (keep_warm containers)
  ├── DashboardAgent (Claude generates specs)
  ├── DataAgent (Claude generates pipeline code)
  ├── IngestionRunner (sandboxed subprocess execution)
  ├── QueryEngine (read-only, always warm)
  └── RefreshScheduler (5-min polling cron)
    |
    v
LanceDB (in-process, S3-backed)
  └── No database server, no network hop`}
          </pre>
        </section>

        {/* Security */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-100">Security</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-400">
            <li className="flex gap-2">
              <span className="text-green-400">1.</span>
              <span>
                <strong className="text-zinc-200">Schema validation</strong> —
                Claude output is constrained to a Zod schema. Only known widget
                types render. No eval().
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400">2.</span>
              <span>
                <strong className="text-zinc-200">AST code checking</strong> —
                Pipeline code is parsed via Python AST. Dangerous imports and
                calls are rejected before execution.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400">3.</span>
              <span>
                <strong className="text-zinc-200">Subprocess sandbox</strong> —
                Pipelines run in a separate process, not in the main Modal
                container.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400">4.</span>
              <span>
                <strong className="text-zinc-200">In-process database</strong> —
                LanceDB has no exposed port. No connection string to leak.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400">5.</span>
              <span>
                <strong className="text-zinc-200">Read/write separation</strong>{" "}
                — QueryEngine is read-only. IngestionRunner has write access.
                Frontend can only reach read endpoints.
              </span>
            </li>
          </ul>
        </section>

        {/* Deploy Modal */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-100">
            Deploy Modal Backend
          </h2>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-300">
            <code>
{`# Set up secrets
modal secret create anthropic ANTHROPIC_API_KEY=sk-ant-...
modal secret create agentboard-s3 \\
  AWS_ACCESS_KEY_ID=... \\
  AWS_SECRET_ACCESS_KEY=... \\
  LANCEDB_URI=s3://your-bucket/lancedb

# Deploy
cd packages/modal-agents
modal deploy src/agentboard_modal/app.py`}
            </code>
          </pre>
        </section>

        <div className="mt-16 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-600">
          Agentboard — AI-powered dashboards
        </div>
      </div>
    </div>
  );
}
