
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

## 🛠️ Architecture

- **Frontend**: Astro (Pages) + React (Interactive Components).
- **Styling**: Tailwind CSS (Premium Glassmorphism).
- **SSG**: Edge functions for API calls 
- **AI**: Gemini 1.5 Flash via `@google/generative-ai`.
- **Database**: Supabase (PostgreSQL).

## 🔒 Security Note

- The Gemini API Key is stored in `.env` and **never exposed** to the client. The browser calls `/api/generate`, which runs on the server.

    
## Règles

- Pas de push dans main
- Pas de push dans develop
- Nommage (feat: / fix: / test:)
