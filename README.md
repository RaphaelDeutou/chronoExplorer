# ChronoExplorer

API back-end pour une application de découverte d'événements historiques : authentification des utilisateurs, gestion des événements (création, consultation) et upload d'images associées.

## Stack

Node.js / Express, MySQL (`mysql2`), authentification par JWT (`jsonwebtoken` + `bcryptjs`), upload de fichiers via `multer`.

## Contenu

- `backend/server.js` — point d'entrée de l'API
- `backend/authService.js` — inscription / connexion / gestion des tokens JWT
- `backend/eventService.js` — CRUD des événements
- `backend/db.js` — connexion à la base MySQL
- `backend/uploads/` — images uploadées associées aux événements

## Lancer en local

1. Créer une base MySQL et un fichier `backend/.env` avec `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET` (voir `backend/db.js` pour les variables attendues)
2. `cd backend && npm install`
3. `node server.js`

## Statut

Ce dépôt contient le back-end ; le front-end associé n'est pas inclus ici.
