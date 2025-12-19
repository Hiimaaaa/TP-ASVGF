---
description: Setup Avatar SVG Factory with Astro, React, Tailwind, and Supabase
---

1. Create the Astro project (skipping install to do it faster, we install after)
// turbo
npm create astro@latest ./ -- --template minimal --no-install --no-git --yes

2. Install dependencies (Astro, React, Tailwind, Supabase)
// turbo
npm install && npx astro add react tailwind --yes && npm install @supabase/supabase-js dotenv

3. Create the directory structure for components and backend logic
// turbo
mkdir -p src/components/ui src/components/feature src/lib src/pages/api

4. Create a basic environment variable file
// turbo
touch .env
