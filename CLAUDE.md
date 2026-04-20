# God Matsmak — project notes

## What this is

A Norwegian-language personal recipe site. The motto on the front page is "Mat som smaker. Food which tastes." — a deliberately stiff translation that's part of the joke. The visual language is 1920s editorial: ivory paper background, a single rust accent, Libre Caslon Text for serifs, Space Grotesk for body, JetBrains Mono for stamps and labels. Recurring "GOD SMAK" stamps and section markers like "§ 01" / "№ 03" are part of the identity, not decoration to strip out.

The conceit is that there are no bad recipes here, only good ones. The forside boasts "Dårlige smaker: 0 / Gode smaker: N", and the kjøkkenfilosofi quotes lean poetic-cheeky — confident, slightly absurd, never ironic at the food's expense.

## Voice and tone

When writing recipe copy (`undertittel`, `ingress`, step `t`/`d`, `servering`, `par`) or new philosophy quotes:

- **Norwegian, written like a confident friend** — not a cookbook editor, not a food blogger.
- **Sensory specifics over adjectives** — "sausen skal være tykk som maling" beats "sausen skal være tykk".
- **Cheeky asides allowed, sincerity wins** — the dish is the hero. Jokes that punch down on the food don't make it in.
- **Concrete tells you why** — explain the *because* in steps when it's load-bearing ("saltet trekker ut proteinene, og det er derfor kakene blir saftige"). Skip the *because* when it's obvious.
- **Short over long** — undertittel is one line. Ingress is 2–4 sentences. Step descriptions earn their length.
- **Never break the fourth wall about being a recipe site** — no "in this recipe we will…", no "scroll down to see…".

When in doubt, read `recipes/grillspyd-cracksaus.json` and `recipes/kjottkaker-brun-saus.json` — those set the tone.

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

## Taksonomi — kategori, når, protein

Tre klassifiserende felt på hver oppskrift. Alle verdier ender på `-smak` — det er en del av språket på siden, ikke en tilfeldighet.

**`kategori`** — hva slags rett er dette:
- `middagsmak` — hovedretter til middag
- `suppesmak` — supper og gryter man spiser med skje
- `dessertsmak` — søtt til slutt
- `tilbehørsmak` — sider, salater, brød, sauser som står alene
- `drikkesmak` — drikke, fra cocktails til varm sjokolade

**`når`** — når på uka skal dette smakes:
- `hverdagssmak` — rimelig rask, ikke krever spesialingredienser, funker en tirsdag
- `helgesmak` — tar tid, krever planlegging, eller føles som en anledning

**`protein`** — hva er hovedproteinet (eller fraværet av det):
- `svinesmak` — gris
- `storfesmak` — okse/kalv
- `fiskesmak` — fisk og skalldyr
- `fuglesmak` — kylling, kalkun, and
- `viltsmak` — elg, rein, hjort, villfugl
- `vegetarsmak` — ingen kjøtt/fisk, inkl. vegansk

Velg én verdi per felt. Hvis en rett har flere proteiner (f.eks. surf-and-turf), velg det som definerer retten mest.

## Adding a new recipe

1. Create `recipes/<id>.json` with the standard schema (see existing files).
2. Add `"<id>"` to `recipes/index.json`.
3. Set `illustrasjon` to `"tallerken"` or `"bolle"` (CSS illustrations).
4. Optional: add `"bilde": "recipes/images/<file>"` for a real photo.
5. Set `smaker` per the rules above — think hard about ingredients and method.
6. Set `kategori`, `når`, and `protein` per the taxonomy above.

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
