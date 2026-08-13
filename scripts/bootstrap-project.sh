#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== LPVN HR Workflow bootstrap =="
echo "1. Verify Node.js / npm"
node --version
npm --version

echo "2. Verify Git"
git --version

echo "3. Verify required agent files"
for f in agent.md skill.md rule.md plan.md state.json; do
  test -f "$f" || { echo "Missing $f"; exit 1; }
done

echo "4. Validate state"
"$ROOT/scripts/check-state.sh"

echo "Bootstrap checks completed."
echo "Use your preferred scaffold command to initialize the React/Vite app in the repository root, then rerun this script."
