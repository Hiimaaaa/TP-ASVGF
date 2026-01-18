
# TP-Avatar SVG Factory

A premium avatar generator using **Gemini AI**, **Astro**, **React**, **Tailwind CSS**, and **Supabase**.
Groupe B


## Répartition

- Product Owner
    - Mohamed-amine EL HARCHAOUI
    - Loann GERME

- Devs
    - Job-fael BABALOLA
    - Alhadji BAH
    - Lucas LEBECQ
    - Kirolos RAMY FAHMY

- Design 
    - Jules CANAUT
    - Ewen D'AVANZO
    - Oceane LEITE

- DevOps
    - Jean Michel LE
    - Sebastien VARENNES
## Installation

Comment récupérer le projet

### 1. Configuration (.env)

Rename `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

- **GEMINI_API_KEY**: Get it from [Google AI Studio](https://aistudio.google.com/).
- **SUPABASE_URL** & **ANON_KEY**: Get them from your Supabase Project Settings.

### 2. Database Setup (Supabase)

1. Go to your Supabase Project > SQL Editor.
2. Copy and paste the content of `supabase_schema.sql` and run it.
   - This creates the `avatars` table and sets up permissions.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## 🛠️ Architecture du projet

Ce projet repose sur une architecture **serverless + statique**, sans backend.

### Frontend
- **Astro**
  - Génération du site (SSG)
  - Routing des pages
- **React**
  - Composants interactifs (générateur d’avatar, formulaires)
- **Tailwind CSS**
  - Styling et design system (glassmorphism)

### Serverless
- **Supabase Edge Functions**
  - Appels sécurisés à l’API Gemini
  - Validation des données

### Intelligence Artificielle
- **Gemini 1.5 Flash**
  - Génération d’avatars SVG à partir de prompts
  - Appelé uniquement côté serverless

### Base de données
- **Supabase (PostgreSQL)**
  - Stockage des avatars générés
  - Accès direct depuis le frontend via Supabase Client
  - Sécurité via Row Level Security (RLS)

### Déploiement
- **GitHub Pages**
  - Hébergement du site statique
- **Supabase**
  - Hébergement des Edge Functions
  - Base de données


## 🔁 Flux de données

- Le frontend communique directement avec Supabase pour les opérations autorisées (lecture / écriture des avatars)
- Les opérations sensibles (génération via Gemini) passent par des Edge Functions
- Les règles RLS garantissent que le client n’accède qu’aux données autorisées


## 🔒 Securité

- Aucune clé sensible n’est exposée côté client
- Les appels à l’API Gemini sont effectués via des fonctions serverless
- Supabase applique des règles de sécurité (RLS)
- Le client ne communique jamais directement avec Gemini

    
## Règles

- Pas de push dans main
- Pas de push dans develop
- Nommage (feat: / fix: / test:)
