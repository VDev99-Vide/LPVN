# Phase-00 Project Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the React + TypeScript + Vite application foundation for the LPVN HR Workflow SaaS with strict linting, typed environment variables, a test stack, and CI — completing `plan.md` Phase 00.

**Architecture:** Vite 7 + React 19 + TypeScript strict, ESLint 9 flat config + Prettier, Vitest + React Testing Library, typed env access via a single `src/env.ts` module, GitHub Actions CI. Scaffolding happens in a temp dir and is copied into the repo root (the root is non-empty with governance docs that must NOT be deleted). All work happens directly on `main` (the user's established workflow — no worktree).

**Tech Stack:** Node 24, npm 11, Vite 7, React 19, TypeScript ~5.9, ESLint 9, Prettier, Vitest, jsdom, React Testing Library.

**Spec:** `plan.md` Phase 00 checklist (repo+branch strategy, Vite scaffold, ESLint/Prettier/TS strict, env vars, CI, `.agent/` + state management) and `agent.md` steps A–F (understand → inspect → plan → implement → validate → checkpoint).

## Global Constraints

- Root `package.json` scripts MUST include exactly: `dev`, `build`, `preview`, `lint`, `typecheck`, `test` (run by `scripts/quality-gate.sh`: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`).
- Never delete or modify the governance docs at repo root: `agent.md`, `plan.md`, `rule.md`, `skill.md`, `state.json`, `DESIGN.md`, `scripts/`.
- Do NOT use `npm create vite` inside the repo root — it would prompt to delete existing files. Scaffold in `/tmp/opencode/vite-scaffold` and copy files over.
- Env vars follow the `VITE_` prefix; secrets never committed; `.env.local` ignored.
- No code comments unless required by the task.

---

### Task 1: Scaffold React + TS + Vite app

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `index.html`, `public/vite.svg`, `src/main.tsx`, `src/App.tsx`, `src/App.css`, `src/index.css`, `src/vite-env.d.ts`, `src/assets/react.svg`
- Modify: `.gitignore` (add `node_modules/`, `dist/`, `*.local`)

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `npm run dev|build|preview|lint|typecheck` scripts that later tasks extend; `src/App.tsx` rendered by `src/main.tsx`; `src/vite-env.d.ts` typing `import.meta.env`.

- [ ] **Step 1: Scaffold in temp dir**

```bash
rm -rf /tmp/opencode/vite-scaffold
npm create vite@latest vite-scaffold -- --template react-ts
```

Run in `/tmp/opencode`. Expected: `vite-scaffold/` with `package.json`, `tsconfig*.json`, `eslint.config.js`, `src/`, `index.html`, `public/`.

- [ ] **Step 2: Copy scaffold into repo root (skip conflicts)**

```bash
cd /workspaces/SysTem-Application
cp -r /tmp/opencode/vite-scaffold/src /tmp/opencode/vite-scaffold/public \
      /tmp/opencode/vite-scaffold/index.html /tmp/opencode/vite-scaffold/vite.config.ts \
      /tmp/opencode/vite-scaffold/tsconfig.json /tmp/opencode/vite-scaffold/tsconfig.app.json \
      /tmp/opencode/vite-scaffold/tsconfig.node.json /tmp/opencode/vite-scaffold/eslint.config.js .
cp /tmp/opencode/vite-scaffold/package.json ./package.json
```

Expected: `git status` shows new files; governance docs untouched.

- [ ] **Step 3: Add missing npm scripts**

Edit `package.json` scripts to add:

```json
"typecheck": "tsc -b",
"test": "vitest run"
```

(`lint`, `build`, `dev`, `preview` come from the template.)

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: `package-lock.json` created, exit 0.

- [ ] **Step 5: Verify scaffold works**

```bash
npm run typecheck && npm run lint && npm run build
```

Expected: all three exit 0; `dist/` created.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold React+TS+Vite application foundation"
```

---

### Task 2: Lint/format/strict TS + test stack

**Files:**
- Create: `.prettierrc.json`, `.prettierignore`, `vitest.config.ts` (or `test` block in `vite.config.ts`), `src/test/setup.ts`, `src/App.test.tsx`
- Modify: `vite.config.ts` (add vitest config), `tsconfig.app.json` (verify `strict`, `noUnusedLocals`, `noUnusedParameters`)

**Interfaces:**
- Consumes: Task 1 scaffold (`npm run test` script stub exists but vitest not installed).
- Produces: `npm test` green with one real test; `npm run format:check` script; strict TS verified.

- [ ] **Step 1: Write the failing test**

`src/App.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the app shell', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Vite/i)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL with "vitest: not found" (not installed yet).

- [ ] **Step 3: Install test stack**

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event prettier
```

- [ ] **Step 4: Configure vitest + setup**

In `vite.config.ts` add:

```ts
/// <reference types="vitest/config" />
```

and inside `defineConfig`:

```ts
test: {
  environment: 'jsdom',
  globals: false,
  setupFiles: ['./src/test/setup.ts'],
},
```

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 5: Add Prettier config**

`.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "all"
}
```

`.prettierignore`:

```
dist
node_modules
```

Add script `"format:check": "prettier --check ."` and run `npx prettier --write .` once to normalize.

- [ ] **Step 6: Verify strict TS**

Run: `npm run typecheck`
Check `tsconfig.app.json` has `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true` (template default). If missing, add them.

- [ ] **Step 7: Run full verification**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: all exit 0.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add strict lint/format config, vitest and first app test"
```

---

### Task 3: Typed environment variables

**Files:**
- Create: `.env.example`, `src/env.ts`, `src/env.test.ts`
- Modify: `src/vite-env.d.ts` (env typing)

**Interfaces:**
- Consumes: Task 1 `src/vite-env.d.ts`; vitest from Task 2.
- Produces: `parseEnv(raw)` pure function + `env` singleton consumed by later phases (Supabase client wiring).

- [ ] **Step 1: Write the failing test**

`src/env.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

describe('parseEnv', () => {
  it('reads VITE_ prefixed values', () => {
    const env = parseEnv({ VITE_SUPABASE_URL: 'https://x.supabase.co', MODE: 'test' })
    expect(env.supabaseUrl).toBe('https://x.supabase.co')
    expect(env.supabaseAnonKey).toBeUndefined()
  })

  it('leaves missing values undefined', () => {
    expect(parseEnv({}).supabaseUrl).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `./env` module not found.

- [ ] **Step 3: Implement env module**

`src/env.ts`:

```ts
export interface EnvConfig {
  supabaseUrl?: string
  supabaseAnonKey?: string
}

export function parseEnv(raw: Record<string, unknown>): EnvConfig {
  return {
    supabaseUrl: raw.VITE_SUPABASE_URL ? String(raw.VITE_SUPABASE_URL) : undefined,
    supabaseAnonKey: raw.VITE_SUPABASE_ANON_KEY ? String(raw.VITE_SUPABASE_ANON_KEY) : undefined,
  }
}

export const env: EnvConfig = parseEnv(import.meta.env)
```

`.env.example`:

```
# Copy to .env.local and fill in real values (never commit .env.local)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Add `*.local` to `.gitignore` (root) if not present.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (2 tests).

- [ ] **Step 5: Verify full gates**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: all exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add typed environment variable access"
```

---

### Task 4: CI pipeline

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: Task 1–3 scripts (`typecheck`, `lint`, `test`, `build`).
- Produces: CI on push to main and PRs running the full gate.

- [ ] **Step 1: Write workflow**

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

- [ ] **Step 2: Validate YAML + lockfile**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml')); print('YAML OK')"` (if `yaml` missing, install nothing — fall back to visual review) and `npm ci --dry-run` (or `npm install --package-lock-only` check) to confirm lockfile is current.

Expected: YAML OK, npm resolves without error.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "ci: add quality gate workflow on push and PR"
```

---

### Task 5: Governance checkpoint

**Files:**
- Create: `.agent/README.md`
- Modify: `plan.md` (tick Phase 00 items done), `state.json` (phase-00 progress, ADRs, next_actions), `README.md` (quickstart section)

**Interfaces:**
- Consumes: Tasks 1–4 deliverables.
- Produces: Phase 00 marked done in `state.json`; `scripts/quality-gate.sh` fully green (npm gates no longer skipped).

- [ ] **Step 1: Restore `.agent/` placeholder**

`.agent/README.md`:

```markdown
# .agent

Session context for LPVN HR Workflow SaaS agents. The source of truth is `state.json` at repo root (memory snapshot) plus code, migrations, tests and git history. See `agent.md` section 9-10 for handoff protocol.
```

- [ ] **Step 2: Tick Phase 00 items in plan.md**

Mark done: `Tạo repository và branch strategy`, `Khởi tạo React + TypeScript + Vite`, `Chuẩn hóa ESLint/Prettier/TypeScript strict`, `Thiết lập environment variables`, `Thiết lập CI cơ bản`, `Thiết lập .agent/ và state management`.

- [ ] **Step 3: Update state.json**

- `progress.phase-00`: `{"status": "DONE", "percent": 100}` (keep other phases LOCKED)
- `current_task`: `phase-01-design-system`
- Add ADRs:

```json
{ "id": "ADR-004", "decision": "Phase-00 toolchain: Vite 7 + React 19 + TS strict + ESLint 9 flat + Prettier + Vitest; npm as package manager; GitHub Actions for CI.", "status": "accepted" },
{ "id": "ADR-005", "decision": "Repository workflow: feature branches with PRs for real features; main receives direct commits for foundation/config work.", "status": "accepted" }
```

- Update `next_actions` to Phase 01 items (design tokens, dashboard layout, form components).
- Update `last_session` summary + `files_created` (add `src/env.ts`, `.env.example`, `.github/workflows/ci.yml`).

- [ ] **Step 4: Update README quickstart**

Replace the Quickstart section with the new commands (`npm install`, `npm run dev`, `npm run typecheck|lint|test|build`).

- [ ] **Step 5: Run full verification**

Run: `./scripts/quality-gate.sh`
Expected: OK lines for typecheck/lint/test/build + state validation, exit 0.

Run: `./scripts/check-state.sh`
Expected: exit 0, phase-00 reflected.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "docs: complete phase-00 checkpoint, update state and README"
```

- [ ] **Step 7: Push**

```bash
git push origin main
```

Expected: `main -> main` success.

---

## Self-Review Notes

- Spec coverage: all 6 Phase 00 checklist items map to Tasks 1–5; `plan.md` §8 agent checkpoint protocol covered by Task 5.
- Placeholder scan: every step has concrete commands/code; no TBDs.
- Type consistency: `parseEnv` signature used identically in Task 3 test and implementation; script names match `quality-gate.sh` (`typecheck`, `lint`, `test`, `build`).
