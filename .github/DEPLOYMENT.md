# Configuration du CI/CD

Ce projet utilise GitHub Actions pour l'intégration continue (CI) et le déploiement continu (CD) sur GitHub Pages.

## Workflows disponibles

### 1. CI - Intégration Continue (`ci.yml`)
Se déclenche sur:
- Pull requests vers `main` ou `develop`
- Push sur `main` ou `develop`

Actions effectuées:
- Installation des dépendances
- Build du projet
- Vérification de la structure du build
- Validation du format des messages de commit (feat:, fix:, test:, etc.)

### 2. CD - Déploiement Production (`cd.yml`)
Se déclenche sur:
- Push sur `main`

Actions effectuées:
- Build du projet
- Upload de l'artifact
- Déploiement sur GitHub Pages

## Configuration requise

### 1. Activer GitHub Pages

1. Allez dans `Settings > Pages` de votre repository GitHub
2. Dans **Source**, sélectionnez `GitHub Actions`
3. Sauvegardez

### 2. Configurer les Secrets GitHub

Allez dans `Settings > Secrets and variables > Actions` de votre repository GitHub et ajoutez les secrets suivants:

```
GEMINI_API_KEY           # Votre clé API Gemini (depuis https://aistudio.google.com/)
PUBLIC_SUPABASE_URL      # URL de votre projet Supabase
PUBLIC_SUPABASE_ANON_KEY # Clé anonyme de votre projet Supabase
```

### 3. Configurer Astro pour GitHub Pages

Votre site sera accessible à `https://<username>.github.io/<repo-name>/`

Vous devez configurer le `base` dans `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/<repo-name>',
  // ... reste de la config
});
```

**Important:** Remplacez `<username>` par votre nom d'utilisateur GitHub et `<repo-name>` par le nom de votre repository.

## Protection des branches

Pour appliquer les bonnes pratiques, configurez les règles de protection:

1. Allez dans `Settings > Branches`
2. Ajoutez des règles pour `main` et `develop`:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

## Workflow de développement

```
feature/xxx → develop (via PR) → main (via PR)
     ↓            ↓                  ↓
   Local        Tests            Production
```

1. Créez une branche `feature/xxx` ou `fix/xxx`
2. Commitez avec le format: `feat:`, `fix:`, `test:`, etc.
3. Ouvrez une PR vers `develop`
4. Le CI vérifie le code
5. Après merge dans `develop`, le code est testé
6. Quand prêt pour la production, ouvrez une PR de `develop` vers `main`
7. Après merge dans `main`, le site est automatiquement déployé sur GitHub Pages

## Vérification locale avant push

Pour éviter les échecs CI:
```bash
# Vérifier le build
npm run build

# Format des commits
git log --oneline | head -5
# Chaque commit doit commencer par feat:, fix:, test:, etc.
```
