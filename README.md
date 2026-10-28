# Hangryology — Version 1

A mobile-friendly static website for choosing where to eat, with a five-level Hangry Meter, questionnaire, restaurant roulette, favorites, basic two-player food vetoes, and nearby browsing.

## Publish with GitHub Pages (no Cloudflare)
1. Create a **public** GitHub repository named `hangryology` (GitHub Free Pages requires a public repository).
2. Upload `index.html`, `style.css`, and `app.js` to the repository root, then commit.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then **Save**.
5. Wait for GitHub to publish. The site will appear at `https://YOUR-USERNAME.github.io/hangryology/`.

You can open `index.html` locally to see the design, but live restaurant lookup requires internet and may be restricted when opened as a local file. The deployed HTTPS site is best for testing.

## What's implemented
- Responsive home page and mobile navigation
- Hangry Meter (saved in local storage), with code-red skip-quiz behavior and quick/nearby preference
- ZIP lookup via Zippopotam.us or optional browser location permission
- Nearby restaurant discovery via public OpenStreetMap Overpass endpoints
- Cuisine exclusions, dine-in/takeout/delivery preference selection (not verified by data), fries question using a limited chain heuristic
- Two-player mode: combine both people's cuisine vetoes (basic MVP)
- Canvas roulette wheel, results, directions, saved favorites (local storage)

## Important limitations
- Overpass public servers can be slow, rate limited, or temporarily unavailable; no uptime guarantee.
- OpenStreetMap entries may have missing cuisines, hours, menus, or services. No live menu search or verified fries detection; the app never claims it can confirm them.
- High Hangry levels prioritize fast food or very nearby places, but do **not** confirm open-now status.
- The app uses no server and has no shared user accounts. Favorites are local to each browser/device.
- This is a prototype for personal use. Review third-party API usage policies before broader release.
