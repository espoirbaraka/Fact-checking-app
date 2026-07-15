#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Démarrage Postgres (pgvector sur 5433)…"
cd "$ROOT/ai-service"
DATABASE_PORT=5433 docker compose up postgres -d

echo "==> Vérification Ollama…"
if ! curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; then
  echo "Démarrez Ollama dans un autre terminal : ollama serve"
  echo "Puis tirez le modèle : ollama pull qwen2.5:3b"
fi

echo "==> ai-service (port 8000)…"
cd "$ROOT/ai-service"
if [ ! -d venv ]; then
  python3 -m venv venv
  # shellcheck disable=SC1091
  source venv/bin/activate
  pip install -r requirements.txt
else
  # shellcheck disable=SC1091
  source venv/bin/activate
fi
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
AI_PID=$!

echo "==> backend (port 3001)…"
cd "$ROOT/backend"
npm install --silent
npm run start:dev &
BACKEND_PID=$!

echo "==> frontend (port 4000)…"
cd "$ROOT/frontend"
npm install --silent
npm run dev &
FRONTEND_PID=$!

cleanup() {
  echo "Arrêt…"
  kill "$AI_PID" "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo ""
echo "Prêt :"
echo "  Frontend  http://localhost:4000"
echo "  Backend   http://localhost:3001/api/docs"
echo "  AI        http://localhost:8000/docs"
echo ""
wait
