/* Gallery + lightbox data. One object per model.
   thumb  : render PNG in assets/renders/  (optional; falls back to a text placeholder)
   glb    : exported .glb in assets/models/ (Embed Textures ON, keep <2MB)
   tag    : category label — also drives the gallery filter chips (shown when 2+ tags)
   orient : optional model-viewer "roll pitch yaw" to fix a model's facing, e.g.
            "0deg 0deg 180deg" turns it 180° so its front faces the camera. */
window.MODELS = [
  { name: "Uwovacht", tag: "Entity", thumb: "assets/renders/uwovacht.png", glb: "assets/models/uwovacht.glb", orient: "0deg 0deg 180deg" }
];
