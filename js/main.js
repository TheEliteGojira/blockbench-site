/* ------------------------------------------------------------------
   CONFIG — set these two, then the site is live.
   ------------------------------------------------------------------ */
const CONFIG = {
  // Contact-form POST target. Option A (recommended): a Formspree/Basin/Formsubmit
  // endpoint (spam-filtered). Option B: a Discord webhook — see CLAUDE.md for the
  // small change to the fetch body that requires.
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
  // Your Discord invite or profile link. Wired into every [data-discord] element.
  discordUrl:   "https://discord.com/"
};

/* ---- respect reduced-motion (disables 3D auto-rotate) ---- */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- footer year ---- */
const yr = document.getElementById("yr");
if (yr) yr.textContent = new Date().getFullYear();

/* ---- discord links ---- */
document.querySelectorAll("[data-discord]").forEach(a => { a.href = CONFIG.discordUrl; });

/* ---- defer the hero model-viewer until it scrolls into view ---- */
const heroMV = document.querySelector(".hero model-viewer[data-src]");
if (heroMV){
  if (reduceMotion) heroMV.removeAttribute("auto-rotate");
  let heroLoaded = false;
  const loadHero = () => {
    if (heroLoaded || document.visibilityState !== "visible") return;
    heroLoaded = true;
    heroMV.setAttribute("src", heroMV.dataset.src);
    document.removeEventListener("visibilitychange", loadHero);
  };
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries, obs) => {
      if (entries.some(en => en.isIntersecting)){ obs.disconnect(); loadHero(); }
    }, { rootMargin: "200px" });
    io.observe(heroMV);
    // Safety net: a tab opened in the background never fires the observer —
    // load once it becomes visible.
    document.addEventListener("visibilitychange", loadHero);
  } else {
    heroMV.setAttribute("src", heroMV.dataset.src);
  }
}

/* ---- gallery (rendered from window.MODELS) ---- */
const gallery = document.getElementById("gallery");
function buildCard(model, index){
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.tag = model.tag;
  card.setAttribute("aria-label", "View " + model.name + " in 3D");

  const thumb = document.createElement("div");
  thumb.className = "thumb";
  if (model.thumb){
    const img = document.createElement("img");
    img.src = model.thumb;
    img.alt = model.name;
    img.loading = "lazy";
    img.addEventListener("error", () => { img.remove(); thumb.textContent = model.name.toUpperCase(); });
    thumb.appendChild(img);
  } else {
    thumb.textContent = model.name.toUpperCase();
  }

  const body = document.createElement("div");
  body.className = "card-body";
  const name = document.createElement("span"); name.className = "name"; name.textContent = model.name;
  const tag  = document.createElement("span"); tag.className = "tag";  tag.textContent = model.tag;
  body.append(name, tag);

  card.append(thumb, body);
  card.addEventListener("click", () => openLightbox(index));
  return card;
}
if (gallery && Array.isArray(window.MODELS)){
  const cards = window.MODELS.map((m, i) => {
    const c = buildCard(m, i);
    gallery.appendChild(c);
    return c;
  });

  /* ---- tag filter chips (derived from the model tags) ---- */
  const filters = document.getElementById("filters");
  if (filters && cards.length){
    const tags = ["All", ...Array.from(new Set(window.MODELS.map(m => m.tag)))];
    tags.forEach(tag => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "filter-chip" + (tag === "All" ? " active" : "");
      chip.textContent = tag;
      chip.setAttribute("aria-pressed", tag === "All" ? "true" : "false");
      chip.addEventListener("click", () => {
        filters.querySelectorAll(".filter-chip").forEach(b => {
          const on = b === chip;
          b.classList.toggle("active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        cards.forEach((c, i) => {
          c.hidden = !(tag === "All" || window.MODELS[i].tag === tag);
        });
      });
      filters.appendChild(chip);
    });
  }
}

/* ---- lightbox (creates a fresh model-viewer per open, disposes on close) ---- */
const lb       = document.getElementById("lightbox");
const lbStage  = document.getElementById("lb-stage");
const lbTitle  = document.getElementById("lb-title");
const lbClose  = document.getElementById("lb-close");
let lastFocus  = null;

function openLightbox(index){
  const model = window.MODELS[index];
  if (!model) return;
  lastFocus = document.activeElement;
  lbTitle.textContent = model.name;

  const mv = document.createElement("model-viewer");
  mv.setAttribute("src", model.glb);
  mv.setAttribute("alt", model.name + " — 3D model");
  mv.setAttribute("tabindex", "0");          // keep it in the focus-trap tab order
  mv.setAttribute("camera-controls", "");
  if (!reduceMotion) mv.setAttribute("auto-rotate", "");
  mv.setAttribute("shadow-intensity", "0.9");
  mv.setAttribute("exposure", "1.05");
  lbStage.innerHTML = "";
  lbStage.appendChild(mv);

  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lbClose.focus();
  document.addEventListener("keydown", onKeydown);
}
function closeLightbox(){
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  lbStage.innerHTML = "";
  document.body.style.overflow = "";
  document.removeEventListener("keydown", onKeydown);
  if (lastFocus) lastFocus.focus();
}
function getFocusable(){
  const sel = 'button, [href], input, select, textarea, model-viewer, [tabindex]:not([tabindex="-1"])';
  return Array.from(lb.querySelectorAll(sel))
    .filter(el => !el.hasAttribute("disabled") && el.offsetParent !== null);
}
function onKeydown(e){
  if (e.key === "Escape"){ closeLightbox(); return; }
  if (e.key !== "Tab") return;
  // full focus trap: cycle within the dialog, never escape to the page behind
  const f = getFocusable();
  if (!f.length){ e.preventDefault(); return; }
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
}
if (lbClose) lbClose.addEventListener("click", closeLightbox);
if (lb) lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });

/* ---- contact form ---- */
const form    = document.getElementById("commission-form");
const formMsg = document.getElementById("form-msg");
if (form){
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.company && form.company.value) return;         // honeypot tripped
    formMsg.className = "form-msg";
    formMsg.textContent = "Sending…";
    try {
      const data = new FormData(form);
      const isDiscord = /discord(app)?\.com\/api\/webhooks\//.test(CONFIG.formEndpoint);
      let res;
      if (isDiscord){
        // Discord webhook expects JSON: { content }. URL is public in client JS —
        // regenerate it if abused (see CLAUDE.md).
        const content =
          "**New commission request**\n" +
          "• Name: "    + (data.get("name")    || "—") + "\n" +
          "• Discord: " + (data.get("discord") || "—") + "\n" +
          "• Type: "    + (data.get("type")    || "—") + "\n" +
          "• Budget: "  + (data.get("budget")  || "—") + "\n" +
          "• Details: " + (data.get("message") || "—");
        res = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content })
        });
      } else {
        // Formspree / Basin / Formsubmit style (FormData POST).
        res = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: data
        });
      }
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      formMsg.textContent = "Request sent — I'll get back to you on Discord.";
      formMsg.classList.add("ok");
    } catch (err) {
      formMsg.innerHTML = 'Could not send right now — reach me directly on ' +
        '<a data-discord href="' + CONFIG.discordUrl + '" target="_blank" rel="noopener">Discord</a>.';
      formMsg.classList.add("err");
    }
  });
}
