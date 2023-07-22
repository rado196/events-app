#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1

./node_modules/.bin/concurrently \
  --restart-tries -1 \
  --restart-after 100 \
  --kill-others \
  --prefix "[{name}] " \
  --prefix-colors "magenta,green" \
  --names "backend,frontend" \
  "cd backend && npm start" \
  "cd frontend && npm start"
