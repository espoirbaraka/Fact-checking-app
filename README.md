# Vérif Nord-Kivu — Fact-checking en zone de conflit

Application de fact-checking assistée par IA pour le Nord-Kivu (RD Congo).

```
Frontend (Next.js :4000)
    → Backend NestJS (:3001/api)
        → AI Service FastAPI (:8000)
            → Ollama (Qwen)
            → Postgres + pgvector (:5433)
```

## Prérequis

- Node.js 20+
- Python 3.11+
- Docker (Postgres)
- [Ollama](https://ollama.com) installé

## Démarrage rapide

### 1. Base de données (pgvector)

```bash
cd ai-service
DATABASE_PORT=5433 docker compose up postgres -d
```

### 2. Ollama (modèle IA local)

```bash
ollama serve
# dans un autre terminal :
ollama pull qwen2.5:3b
```

### 3. Service IA

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # ou utilisez le .env déjà présent
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Backend NestJS

```bash
cd backend
npm install
# DATABASE_HOST=localhost dans .env
npm run start:dev
```

Swagger : http://localhost:3001/api/docs

### 5. Frontend

```bash
cd frontend
npm install
npm run dev
```

Ouvrir : **http://localhost:4000**

Un compte démo est créé automatiquement (`demo@nordkivu.cd`). Posez une question ; l’IA répond via Ollama.

## Script tout-en-un

Depuis la racine du projet :

```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

## Ports

| Service    | Port |
|------------|------|
| Frontend   | 4000 |
| Backend    | 3001 |
| AI service | 8000 |
| Postgres   | 5433 |
| Ollama     | 11434 |

## Notes

- Sans Ollama, le chat affichera une erreur d’indisponibilité de l’IA.
- Le modèle par défaut est `qwen2.5:3b` (plus léger). Changez `OLLAMA_MODEL` dans `ai-service/.env` pour `qwen2.5:7b` si votre machine le permet.
- Les réponses en zone de conflit restent prudentes : croisez toujours avec des sources locales (radio, ONG, témoins).
