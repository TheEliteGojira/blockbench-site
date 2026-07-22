# Blockbench Commissions — project brief for Claude Code

Static portfolio + commissions site for a Blockbench (Minecraft) model & mod
commission business. **No build step, no frameworks** — plain HTML/CSS/JS,
hostable on any static host and openable directly from `file://`.

## Conventions (keep these)
- Vanilla HTML/CSS/JS only. No React/Vue, no bundler, no npm build.
- One external dependency, via CDN: Google `<model-viewer>` for browser 3D of `.glb`.
- Data-driven gallery: models live in `data/models.js` as `window.MODELS`.
  It is a **JS file, not JSON**, on purpose — so it loads from `file://` with no
  server/CORS. Keep it that way.
- Preserve the HUD aesthetic (see Design system). Don't add new UI patterns
  without a reason tied to the brief.

## Structure
```
index.html          hero + featured viewer, gallery mount, commissions, contact form, lightbox
css/styles.css      all styles + design tokens in :root
js/main.js          gallery render, lightbox, contact form; CONFIG block at top
data/models.js      window.MODELS = [{ name, tag, thumb, glb }]
assets/models/      exported .glb files (Embed Textures ON, <2MB)
assets/renders/     gallery thumbnail PNGs
```

## Design system (tokens in css/styles.css :root)
- Palette: base `#0a1622`, panel `#0c1e30`, accent (Blockbench azure) `#33a9f2`,
  hi `#6ec9ff`, ink `#bcd4e8`, status green `#3fd07f`.
- Type: Bebas Neue (display), Orbitron (labels/headings), Share Tech Mono (body/data).
- Signature: chamfered panels via `--chamf` clip-path + corner brackets + scanlines
  on 3D frames. This is the one bold element — keep everything else quiet.

## Config (top of js/main.js)
- `CONFIG.formEndpoint` — where the contact form POSTs. Two options:
  1. **Formspree / Basin / Formsubmit** (recommended, spam-filtered): paste the
     endpoint; the current `fetch` (FormData) already matches their format.
  2. **Discord webhook** (fits the Discord workflow): create a webhook in the
     server, set `formEndpoint` to it, and change the fetch body to
     `JSON.stringify({ content: `New commission from ${name}: ${message}` })`
     with header `"Content-Type": "application/json"`. Note the webhook URL is
     public in client JS — regenerate it if abused.
- `CONFIG.discordUrl` — invite/profile; auto-wired into every `[data-discord]` link.

## Add a model
1. Blockbench: `File → Export → Export glTF Model → Binary (.glb)`, **Embed
   Textures ON**, keep under ~2MB (reduce texture res / tri-count if larger).
2. Save the `.glb` to `assets/models/` and a render PNG to `assets/renders/`.
3. Add an entry to `data/models.js`.

## TODO (open tasks)
- [ ] Wire the real form endpoint + Discord URL. Code auto-detects Formspree-style
      vs Discord-webhook endpoints (`CONFIG.formEndpoint` in `js/main.js`); just set
      `formEndpoint` + `discordUrl` and test one submission end-to-end.
- [x] Replace NAME placeholders (nav brand, footer, `<title>`) → **KAYGEE**.
- [~] Real portfolio pieces: 1 done (Uwovacht — real `.glb` + rendered thumbnail,
      featured in hero). Swap the remaining demo placeholders as more models arrive.
- [x] SEO/social: Open Graph + Twitter meta tags, canonical URL, `theme-color`,
      `assets/favicon.svg`, `assets/icon.png` (512), `assets/og-image.png` (1200×630).
- [x] Perf: hero `model-viewer` deferred until visible (IntersectionObserver +
      visibilitychange fallback); the lightbox lazy-creates its viewer per open.
- [x] Accessibility: full lightbox focus trap (Tab/Shift+Tab cycle, focus restored
      on close) + `prefers-reduced-motion` disables 3D auto-rotate.
- [x] Gallery filter by tag — chips derived from model tags (`#filters`).
- [x] Deploy: GitHub Pages via Actions workflow (`.github/workflows/deploy.yml`,
      auto-enabled) + custom `404.html`. Live: https://theelitegojira.github.io/blockbench-site/
