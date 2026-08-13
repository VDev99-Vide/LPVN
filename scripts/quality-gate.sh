#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ ! -f package.json ]; then
  echo "SKIP: no package.json yet (app not scaffolded) - running state validation only"
  "$ROOT/scripts/check-state.sh"
  exit 0
fi

run_if_exists() {
  local script="$1"
  if npm run "$script" --if-present; then
    echo "OK: npm run $script (or skipped if not defined)"
  else
    echo "FAIL: npm run $script"
    exit 1
  fi
}

run_if_exists typecheck
run_if_exists lint
run_if_exists test
run_if_exists build

"$ROOT/scripts/check-state.sh"
