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

/* ---- footer year ---- */
const yr = document.getElementById("yr");
if (yr) yr.textContent = new Date().getFullYear();

/* ---- discord links ---- */
document.querySelectorAll("[data-discord]").forEach(a => { a.href = CONFIG.discordUrl; });

/* ---- gallery (rendered from window.MODELS) ---- */
const gallery = document.getElementById("gallery");
function buildCard(model, index){
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
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
  window.MODELS.forEach((m, i) => gallery.appendChild(buildCard(m, i)));
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
  mv.setAttribute("camera-controls", "");
  mv.setAttribute("auto-rotate", "");
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
function onKeydown(e){
  if (e.key === "Escape") closeLightbox();
  // simple focus containment: keep focus on the close button
  if (e.key === "Tab"){ e.preventDefault(); lbClose.focus(); }
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
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });
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
