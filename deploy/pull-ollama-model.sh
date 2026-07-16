#!/usr/bin/env bash
# Télécharge le modèle Ollama après le premier démarrage des conteneurs
set -euo pipefail
MODEL="${OLLAMA_MODEL:-qwen2.5:7b}"
echo "Téléchargement du modèle Ollama: $MODEL (peut prendre plusieurs minutes)…"
docker exec verif-ollama ollama pull "$MODEL"
echo "Modèle $MODEL prêt."
