# Configuration de l'Authentification Google avec Supabase

## Étapes de configuration

### 1. Créer un projet Supabase (si ce n'est pas déjà fait)

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet ou utilisez un projet existant
3. Notez votre **Project URL** et **anon public key**

### 2. Activer l'authentification Google dans Supabase

1. Dans votre projet Supabase, allez dans **Authentication** → **Providers**
2. Activez **Google** comme provider
3. Vous aurez besoin de créer des credentials OAuth Google

### 3. Créer des credentials OAuth Google

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API **Google+ API**
4. Allez dans **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choisissez **Web application**
6. Configurez les URIs autorisés :
   - **Authorized JavaScript origins** : `http://localhost:4321` (pour le dev)
   - **Authorized redirect URIs** : 
     - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
     - `http://localhost:4321/auth/callback` (pour le dev)
7. Copiez le **Client ID** et **Client Secret**

### 4. Configurer Supabase avec les credentials Google

1. Retournez dans Supabase → **Authentication** → **Providers** → **Google**
2. Collez votre **Client ID** et **Client Secret**
3. Sauvegardez

### 5. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 6. Redémarrer le serveur de développement

```bash
npm run dev
```

## Tester l'authentification

1. Cliquez sur **Inscription** dans le header
2. Cliquez sur **S'inscrire avec Google**
3. Choisissez votre compte Google
4. Vous serez redirigé vers la page d'accueil, connecté

## Fonctionnalités disponibles

- ✅ Connexion avec Google
- ✅ Inscription avec Google  
- ✅ Déconnexion
- ✅ Affichage du profil utilisateur dans le header
- ✅ Menu déroulant avec options utilisateur
- ✅ Redirection automatique après authentification

## Sécurité

- Les tokens sont gérés automatiquement par Supabase
- Les sessions sont stockées de manière sécurisée
- Le refresh token est géré automatiquement
