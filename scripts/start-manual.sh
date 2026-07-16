#!/usr/bin/env bash
# Affiche les commandes à lancer dans 4 terminaux séparés (copier-coller).
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cat <<EOF
=== Vérif Nord-Kivu — démarrage manuel ===
Racine du projet : $ROOT

Dans CHAQUE terminal, commencez par :
  cd $ROOT

--- Terminal 1 : Postgres ---
  cd $ROOT/ai-service
  DATABASE_PORT=5433 docker compose up postgres -d

--- Terminal 2 : Ollama (si pas déjà lancé) ---
  # Si "address already in use" → Ollama tourne déjà, ignorez ollama serve
  curl -s http://localhost:11434/api/tags && echo "Ollama OK" || ollama serve
  # une seule fois :
  ollama pull qwen2.5:7b

--- Terminal 3 : Service IA (port 8000) ---
  cd $ROOT/ai-service
  python3 -m venv venv 2>/dev/null || true
  source venv/bin/activate
  pip install -r requirements.txt
  ./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

--- Terminal 4 : Backend (port 3001) ---
  cd $ROOT/backend
  npm install
  npm run start:dev

--- Terminal 5 : Frontend (port 4000) ---
  cd $ROOT/frontend
  npm install
  npm run dev

Ouvrir : http://localhost:4000

Ou tout-en-un : ./scripts/start-dev.sh
EOF
