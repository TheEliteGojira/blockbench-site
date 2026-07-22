/* Gallery + lightbox data. One object per model.
   thumb : render PNG in assets/renders/  (optional; falls back to a text placeholder)
   glb   : exported .glb in assets/models/ (Embed Textures ON, keep <2MB)
   tag   : category label — also drives the gallery filter chips.

   The first entry is a real piece. The rest are demo placeholders that point at a
   sample GLB so the lightbox still works — replace them as real models come in. */
window.MODELS = [
  { name: "Uwovacht",       tag: "Entity",   thumb: "assets/renders/uwovacht.png",  glb: "assets/models/uwovacht.glb" },
  { name: "Voidwarden",     tag: "Animated", thumb: "assets/renders/voidwarden.png", glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { name: "Greatsword Set", tag: "Weapon",   thumb: "assets/renders/greatsword.png", glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { name: "Skiff",          tag: "Vehicle",  thumb: "assets/renders/skiff.png",      glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { name: "Market NPC",     tag: "Entity",   thumb: "assets/renders/npc.png",        glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { name: "Rune Crate",     tag: "Cosmetic", thumb: "assets/renders/crate.png",      glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { name: "Tavern Pack",    tag: "Furniture",thumb: "assets/renders/tavern.png",     glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" }
];
