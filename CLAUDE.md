# God Matsmak — project notes

## "Antall smaker" (smaker field on recipes)

Each recipe has a `smaker` integer that counts the distinct flavor dimensions the dish actually delivers. It is derived from **ingredients + cooking method together**, not just the ingredient list.

Flavor dimensions to consider (non-exhaustive):

- sweet (sukker, honning, kokosmelk, brunt sukker)
- salt (salt, fiskesaus, soyasaus, østerssaus, ost)
- sour (sitron, lime, eddik, riseddik, tamarind)
- umami (kjøttkraft, fiskesaus, soya, tomat, sopp, ost, røkt)
- bitter (kaffe, mørk sjokolade, brent)
- fat / cream (smør, fløte, kokosmelk, olje)
- heat (chili, ingefær, pepper, karry)
- herbal / fresh (koriander, persille, basilikum, rå urter)
- smoky / charred (grilling, røkte ingredienser, brent)
- aromatic (hvitløk, ingefær, sitrongress, sjalott)
- maillard / roasted (steking til gyllen, gratinering, lang stekning)
- fermented / funky (tamarind-paste, miso, fish sauce, kapers)

**Rules of thumb:**
- Count each dimension once, even if multiple ingredients contribute.
- Method counts: grilling adds smoky/maillard; long simmer deepens umami; raw preserves fresh/herbal.
- Don't double-count: "salt" and "umami" from fish sauce = 2 dimensions, not 1.
- Be honest — if the dish doesn't actually taste of it, don't count it. A pinch of pepper isn't "heat".

**Display:** On the recipe detail page, "Smaker" replaces "Nivå" in the meta strip (Tid / Porsjoner / Smak / Smaker). Show the integer as-is.

## Adding a new recipe

1. Create `recipes/<id>.json` with the standard schema (see existing files).
2. Add `"<id>"` to `recipes/index.json`.
3. Set `illustrasjon` to `"tallerken"` or `"bolle"` (CSS illustrations).
4. Optional: add `"bilde": "recipes/images/<file>"` for a real photo.
5. Set `smaker` per the rules above — think hard about ingredients and method.

## Build

The app is a single-page React app. The source-of-truth is `app.jsx`; the served file is `app.js` (minified) produced by esbuild.

- `npm install` once to get esbuild.
- `npm run build` after editing `app.jsx` — emits `app.js`.
- `npm run watch` rebuilds on every change.

`index.html` references `app.js` directly and never needs to be regenerated. Don't put JSX inline in `index.html`.

## Recipe images

When adding a `bilde`, ship both a JPG (fallback) and a WebP (preferred) at the same path:
- `recipes/images/<id>.jpg`
- `recipes/images/<id>.webp`

The JSON only references the `.jpg`; the markup derives the `.webp` path automatically. Resize so the longest edge is ≤ 1600 px and re-encode at quality ~80.
