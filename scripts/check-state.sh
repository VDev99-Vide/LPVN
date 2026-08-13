#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE="$ROOT/state.json"

command -v python >/dev/null 2>&1 || command -v python3 >/dev/null 2>&1 || { echo "ERROR: python/python3 is required"; exit 1; }
PYTHON="$(command -v python || command -v python3)"

"$PYTHON" - <<PY
import json
from pathlib import Path
p = Path(r"$STATE")
data = json.loads(p.read_text(encoding="utf-8"))
required = ["project", "schema_version", "status", "current_phase", "current_task", "progress", "next_actions"]
missing = [k for k in required if k not in data]
if missing:
    raise SystemExit(f"STATE INVALID: missing keys: {missing}")
print(f"PROJECT      : {data['project']}")
print(f"STATUS       : {data['status']}")
print(f"CURRENT PHASE: {data['current_phase']}")
print(f"CURRENT TASK : {data['current_task']}")
print("NEXT ACTIONS:")
for item in data['next_actions']:
    print(f"  - {item}")
PY
