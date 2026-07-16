# CHUNGUZA - Fact-checking en zone de conflit

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

**Important :** chaque commande `cd backend` / `cd ai-service` part de la **racine du projet** :

```bash
cd /home/espoir/fact-checking-nord-kivu
```

Ne relancez pas `cd ai-service` si vous êtes déjà dans `ai-service` (sinon : *No such file or directory*).

### Option A - tout-en-un (recommandé)

```bash
cd /home/espoir/fact-checking-nord-kivu
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

Aide pas à pas : `./scripts/start-manual.sh`

### Option B - 5 terminaux (manuel)

#### 1. Base de données (pgvector)

```bash
cd /home/espoir/fact-checking-nord-kivu/ai-service
DATABASE_PORT=5433 docker compose up postgres -d
```

#### 2. Ollama (modèle IA local)

```bash
# Si Ollama tourne déjà → "address already in use" : c'est normal, passez à l'étape suivante
curl -s http://localhost:11434/api/tags && echo "Ollama déjà actif"

# Sinon seulement :
ollama serve

# Une fois (modèle 7b pour plus de précision) :
ollama pull qwen2.5:7b
```

#### 3. Service IA

```bash
cd /home/espoir/fact-checking-nord-kivu/ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Utilisez le uvicorn du venv (pas ~/.local/bin/uvicorn) :
./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 4. Backend NestJS

```bash
cd /home/espoir/fact-checking-nord-kivu/backend
npm install
npm run start:dev
```

Swagger : http://localhost:3001/api/docs

#### 5. Frontend

```bash
cd /home/espoir/fact-checking-nord-kivu/frontend
npm install
npm run dev
```

Ouvrir : **http://localhost:4000**

Un compte démo est créé automatiquement (`demo@nordkivu.cd`). Posez une question ; l’IA répond via Ollama.

## Dépannage

| Erreur | Cause | Solution |
|--------|--------|----------|
| `cd ai-service: No such file or directory` | Mauvais dossier courant | `cd /home/espoir/fact-checking-nord-kivu` puis `cd ai-service` |
| `address already in use` sur 11434 | Ollama déjà lancé | Ne pas relancer `ollama serve` |
| `No module named 'pydantic_settings'` | uvicorn global au lieu du venv | `source venv/bin/activate` puis `./venv/bin/uvicorn ...` |
| `cd backend: No such file or directory` | Vous n'êtes pas à la racine du projet | `cd /home/espoir/fact-checking-nord-kivu/backend` |

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

## Déploiement VPS

Guide complet : [deploy/DEPLOY-VPS.md](deploy/DEPLOY-VPS.md)

Accès public : `http://82.29.170.149:8087`


- Sans Ollama, le chat affichera une erreur d’indisponibilité de l’IA.
- Le modèle par défaut est `qwen2.5:7b` (meilleure précision). Sur machine limitée, vous pouvez redescendre à `qwen2.5:3b` via `OLLAMA_MODEL`.
- Les réponses en zone de conflit restent prudentes : croisez toujours avec des sources locales (radio, ONG, témoins).
