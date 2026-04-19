# God Matsmak

A small Norwegian recipe site. Mat som smaker. Food which tastes.

🌐 **Live:** https://godmatsmak.no

The conceit is that there are no bad recipes here, only good ones. Each recipe gets a "smaker" count — how many distinct flavor dimensions the dish actually delivers. The forside picks a random kjøkkenfilosofi quote on every visit. The visual language is 1920s editorial: ivory paper, a single rust accent, serif headlines, monospaced stamps.

## Develop

The app is a single-page React app, no backend. Recipes live in `recipes/*.json` and get fetched at runtime.

```bash
npm install
npm run watch    # rebuilds app.js on every change to app.jsx
```

Then serve the directory with anything that does static files:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.

For one-shot builds:

```bash
npm run build
```

## Adding a recipe

1. Drop a new `recipes/<id>.json` (use an existing recipe as a template).
2. Add `"<id>"` to `recipes/index.json`.
3. Optional: ship `recipes/images/<id>.jpg` and `recipes/images/<id>.webp` (max 1600 px on the long edge).

See [CLAUDE.md](./CLAUDE.md) for the recipe schema, the `smaker` rules, and the project's voice and tone.

## Deploy

Pushes to `main` build and deploy to GitHub Pages via `.github/workflows/deploy.yml`. `app.js` is a build artifact and not committed.

## Stack

- React 18 (UMD, from a CDN)
- esbuild (the only dev dependency)
- Plain JSON files for recipes and quotes
- GitHub Pages for hosting
