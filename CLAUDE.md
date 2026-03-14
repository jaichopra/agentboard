# Agentboard — Claude Code Guide

This is Agentboard, an AI-powered dashboard platform.

## Skills

- `/agentboard` — Create dashboards by describing what you want. The skill knows the full schema, layout rules, and color system. See `.claude/skills/agentboard.md`.

## Key Files

- `apps/web/lib/schemas/` — Zod schemas (the central contract between AI output and UI)
- `apps/web/lib/demo-data.ts` — Demo dashboards (add new ones here)
- `apps/web/components/dashboard/widgets/` — Widget renderers
- `packages/sdk/src/agentboard/` — Python SDK
- `packages/modal-agents/src/agentboard_modal/` — Modal backend

## Commands

```bash
pnpm dev          # Run frontend (from apps/web/)
pnpm build        # Build frontend
```

## Architecture

- Frontend: Next.js 15 + Recharts + Tailwind (dark mode)
- Multimodal: MapLibre, Three.js, react-player, react-markdown, Prism
- Backend: Modal (serverless Python) — 5 agent processes
- Data: LanceDB (in-process, S3-backed)
- AI: Claude via Anthropic API
- Testing: Vitest + Testing Library (58 tests)

## Dashboard Layout Rules

- 12-column grid, 160px per row
- KPI cards: row 1, columnSpan 3, rowSpan 1
- Charts: rowSpan 3 minimum
- Tables: columnSpan 12, at the bottom
- Always specify colors explicitly
