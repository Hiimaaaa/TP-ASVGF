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

Comment récupérer le projet ? 

### 1. Préparer le fichier de configuration (.env)

Le projet nécessite 3 clés pour fonctionner.
Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
nano .env
```

Renseignez ensuite les variables suivantes :
- **GEMINI_API_KEY**: Créez votre clé depuis [Google AI Studio](https://aistudio.google.com/).
- **SUPABASE_URL** & **ANON_KEY**: Créez un projet sur [SupaBase](https://supabase.com/).

### 2. Configurer la base de données (Supabase)

Le projet a besoin d’une base de données pour stocker les avatars générés.

1. Ouvrez votre projet Supabase
2. Cliquez sur SQL Editor (barre latérale gauche)
3. Ouvrez le fichier `supabase_schema.sql` dans le projet local
4. Copiez son contenu
5. Collez-le contenu dans SQL Editor
6. Cliquez sur Run pour créer les tables, colonnes et règles de sécurité nécessaires

### 3. Lancer le projet 

Avant de lancer l’application, installez les dépendances :

```bash
npm install
npm run dev
```

Ouvrez ensuite :
[http://localhost:4321](http://localhost:4321).


## Architecture du projet

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


## Flux de données

- Le frontend communique directement avec Supabase pour les opérations autorisées (lecture / écriture des avatars)
- Les opérations sensibles (génération via Gemini) passent par des Edge Functions
- Les règles RLS garantissent que le client n’accède qu’aux données autorisées


## Securité

- Aucune clé sensible n’est exposée côté client
- Les appels à l’API Gemini sont effectués via des fonctions serverless
- Supabase applique des règles de sécurité (RLS)
- Le client ne communique jamais directement avec Gemini

    
## Règles

- Pas de push direct sur main
- Pas de push direct sur develop
- Nommage (feat: / fix: / test:)
