#!/bin/sh
set -eu
cd /app
expected=$(sha256sum package-lock.json | cut -d ' ' -f 1)
installed=$(cat node_modules/.lock-hash 2>/dev/null || true)
if [ "$expected" != "$installed" ]; then
  npm ci --no-audit --no-fund
  printf '%s\n' "$expected" > node_modules/.lock-hash
fi
if [ "${WATCH_POLL:-false}" = "true" ]; then
  export CHOKIDAR_USEPOLLING=true
  export CHOKIDAR_INTERVAL=1000
  export WATCHPACK_POLLING=1000
fi
exec "$@"
