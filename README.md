# SysTem-Application

LPVN HR Workflow SaaS — internal HR workflow system: React + TypeScript + Vite, Supabase (Auth/PostgreSQL/RLS/Storage/Edge Functions), Cloudflare Pages/Workers.

## Governance documents

| File | Purpose |
|---|---|
| `plan.md` | Project roadmap, architecture, phases, data model |
| `rule.md` | Operating rules for agents (security, workflow, git) |
| `skill.md` | Agent skills: database, RLS, workflow, document generation |
| `agent.md` | Agent constitution: identity, workflow, skill activation |
| `state.json` | Session memory: phase progress, decisions, next actions |
| `DESIGN.md` | Reference design system (token methodology) |

## Quickstart

```bash
scripts/bootstrap-project.sh   # verify environment
scripts/quality-gate.sh        # run typecheck/lint/test/build + state validation
```

## Status

Planning phase (phase-00). See `plan.md` and `state.json` for active phase and next actions.
