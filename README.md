# Blockbench Commissions Site

A static portfolio + commissions site with live in-browser 3D previews of
Blockbench models. No build step — plain HTML/CSS/JS.

## Run locally
Open `index.html` in a browser. The 3D viewers need the page to be *served* or
opened as a file in a real browser; a locked-down preview may only show the
loading text.

Optional local server (better for testing model loads):
```
python3 -m http.server
# then visit http://localhost:8000
```

## Make it yours
1. **Config** — open `js/main.js` and set `CONFIG.formEndpoint` (your Formspree
   or Discord webhook) and `CONFIG.discordUrl` (your invite/profile).
2. **Branding** — replace `NAME` in `index.html` (nav brand + footer).
3. **Models** — see "Add a model" in `CLAUDE.md`. Edit `data/models.js`.
4. **Featured model** — swap the `src` on the hero `<model-viewer>` in `index.html`.

## Host it
Drop the whole folder on any static host — Netlify (drag-and-drop), GitHub Pages,
Cloudflare Pages, or your existing domain's web root.

See `CLAUDE.md` for architecture, conventions, and the task list.
