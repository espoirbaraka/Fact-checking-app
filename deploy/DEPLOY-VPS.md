# Déploiement VPS - CHUNGUZA

Héberger l'application sur **82.29.170.149:8087** avec Docker.

## Architecture

```
Internet → :8087 (nginx)
              ├── /      → frontend (Next.js)
              └── /api/  → backend (NestJS) → ai-service → Ollama
                                    ↓
                               Postgres
```

---

## Étape 0 - Prérequis VPS

| Ressource | Minimum recommandé |
|-----------|-------------------|
| RAM | **8 Go** (modèle qwen2.5:7b) ou 4 Go avec `qwen2.5:3b` |
| Disque | **25 Go** libres |
| OS | Ubuntu 22.04 / 24.04 |
| Port | **8087** ouvert (pare-feu + hébergeur) |

---

## Étape 1 - Connexion SSH

Sur **votre PC** :

```bash
ssh root@82.29.170.149
# ou : ssh votre_user@82.29.170.149
```

---

## Étape 2 - Installer Docker

Sur le **VPS** :

```bash
apt update && apt upgrade -y
apt install -y git curl ca-certificates

curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Vérifier
docker --version
docker compose version
```

---

## Étape 3 - Ouvrir le port 8087

```bash
# Si ufw est actif
ufw allow 8087/tcp
ufw allow OpenSSH
ufw enable
ufw status
```

**Important :** dans le panneau de votre hébergeur VPS, ouvrez aussi le port **8087** (pare-feu cloud).

Vérification depuis votre PC :

```bash
nc -zv 82.29.170.149 8087
# « succeeded » une fois nginx lancé
```

---

## Étape 4 - Cloner le projet

Sur le **VPS** :

```bash
cd /opt
git clone https://VOTRE_REPO.git fact-checking-nord-kivu
# ou transférer le dossier avec scp depuis votre PC :
# scp -r /chemin/local/fact-checking-nord-kivu root@82.29.170.149:/opt/

cd /opt/fact-checking-nord-kivu/deploy
```

---

## Étape 5 - Configurer les variables

```bash
cp .env.example .env
nano .env
```

Modifiez au minimum :

```env
PUBLIC_URL=http://82.29.170.149:8087
POSTGRES_PASSWORD=votre_mot_de_passe_db
JWT_SECRET=une_longue_chaine_aleatoire_32_caracteres_min
JWT_REFRESH_SECRET=autre_longue_chaine_aleatoire
TYPEORM_SYNCHRONIZE=true
OLLAMA_MODEL=qwen2.5:7b
```

Générer des secrets :

```bash
openssl rand -hex 32
```

---

## Étape 6 - Lancer les conteneurs

```bash
cd /opt/fact-checking-nord-kivu/deploy
chmod +x init-databases.sh pull-ollama-model.sh
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

Attendre 1-2 minutes, puis vérifier :

```bash
docker compose -f docker-compose.prod.yml ps
```

Tous les services doivent être **Up** (postgres **healthy**).

---

## Étape 7 - Télécharger le modèle IA (Ollama)

```bash
chmod +x pull-ollama-model.sh
./pull-ollama-model.sh
```

Ou manuellement :

```bash
docker exec verif-ollama ollama pull qwen2.5:7b
docker exec verif-ollama ollama list
```

Si la RAM est limitée (< 6 Go) :

```bash
docker exec verif-ollama ollama pull qwen2.5:3b
# puis dans .env : OLLAMA_MODEL=qwen2.5:3b
# et redémarrer ai-service :
docker compose -f docker-compose.prod.yml restart ai-service
```

---

## Étape 8 - Vérifications

Sur le **VPS** :

```bash
# Santé API
curl -s http://localhost:8087/api/health | head -c 200
echo

# Santé IA
curl -s http://localhost:8087/api/ai/health
# (nécessite un token après inscription - voir ci-dessous)

# Logs en cas de problème
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f ai-service
docker compose -f docker-compose.prod.yml logs -f ollama
```

Depuis **votre navigateur** :

1. http://82.29.170.149:8087 → page de connexion
2. http://82.29.170.149:8087/register → créer un compte
3. Poser une question dans le chat

---

## Analyse image / PDF (OCR)

Le bouton **Image / PDF** envoie le fichier à `ai-service`, qui extrait le texte (PyMuPDF + Tesseract), puis lance le fact-check habituel.

Après déploiement / mise à jour, reconstruire surtout `ai-service` (Tesseract est installé dans son Dockerfile) :

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build ai-service backend frontend
```

Formats : PDF, PNG, JPG, WEBP, GIF (max 12 Mo).

---

## Étape 9 - Après le premier déploiement

Une fois les tables créées, sécurisez :

```bash
nano .env
# TYPEORM_SYNCHRONIZE=false

docker compose -f docker-compose.prod.yml up -d backend
```

---

## Commandes utiles

```bash
cd /opt/fact-checking-nord-kivu/deploy

# Redémarrer tout
docker compose -f docker-compose.prod.yml restart

# Arrêter
docker compose -f docker-compose.prod.yml down

# Mettre à jour après git pull
git pull
docker compose -f docker-compose.prod.yml up -d --build

# Espace disque
docker system df
```

---

## Dépannage

| Problème | Solution |
|----------|----------|
| Page inaccessible | `ufw status`, pare-feu hébergeur, `docker ps` |
| `502 Bad Gateway` | `docker logs verif-backend`, `docker logs verif-frontend` |
| IA indisponible | `docker logs verif-ai-service`, vérifier `ollama list` |
| Ollama OOM / lent | passer à `qwen2.5:3b`, augmenter RAM swap |
| Erreur base de données | `docker logs verif-postgres`, vérifier `POSTGRES_PASSWORD` |
| Frontend appelle mauvaise API | rebuild frontend : `docker compose ... up -d --build frontend` |

### Créer du swap si RAM insuffisante (4 Go)

```bash
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## Résumé des URLs

| Service | URL |
|---------|-----|
| Application | http://82.29.170.149:8087 |
| API | http://82.29.170.149:8087/api |
| Swagger | http://82.29.170.149:8087/api/docs |

---

## Transfert sans Git (depuis votre PC)

```bash
cd /home/espoir/fact-checking-nord-kivu
tar --exclude=node_modules --exclude=venv --exclude=.next -czf verif-nord-kivu.tar.gz .
scp verif-nord-kivu.tar.gz root@82.29.170.149:/opt/
ssh root@82.29.170.149 "cd /opt && mkdir -p fact-checking-nord-kivu && tar -xzf verif-nord-kivu.tar.gz -C fact-checking-nord-kivu"
```

Puis reprenez à l’**étape 5** sur le VPS.
