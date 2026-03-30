#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${1:-8000}"
HOST="${HOST:-0.0.0.0}"

get_ip() {
  ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || hostname
}

IP_ADDRESS="$(get_ip)"

echo "Serving: ${ROOT_DIR}"
echo "Local:   http://localhost:${PORT}/"
echo "Mobile:  http://${IP_ADDRESS}:${PORT}/"
echo "Stop:    Ctrl+C"

cd "${ROOT_DIR}"
exec python3 -m http.server "${PORT}" --bind "${HOST}"
