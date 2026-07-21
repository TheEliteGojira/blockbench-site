/* Gallery + lightbox data. One object per model.
   thumb : render PNG in assets/renders/  (optional; falls back to a placeholder)
   glb   : exported .glb in assets/models/ (Embed Textures ON, keep <2MB)
   The two demo entries point at a sample GLB so the lightbox works out of the box.
   Replace them with your own. */
window.MODELS = [
  { name: "Voidwarden",     tag: "Animated", thumb: "assets/renders/voidwarden.png", glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { name: "Greatsword Set", tag: "Weapon",   thumb: "assets/renders/greatsword.png", glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { name: "Skiff",          tag: "Vehicle",  thumb: "assets/renders/skiff.png",       glb: "assets/models/skiff.glb" },
  { name: "Market NPC",     tag: "Entity",   thumb: "assets/renders/npc.png",         glb: "assets/models/npc.glb" },
  { name: "Rune Crate",     tag: "Cosmetic", thumb: "assets/renders/crate.png",       glb: "assets/models/crate.glb" },
  { name: "Tavern Pack",    tag: "Furniture",thumb: "assets/renders/tavern.png",      glb: "assets/models/tavern.glb" }
];
