/* ============================================================
   DevSphere — site configuration
   ------------------------------------------------------------
   Single source of truth for every outbound destination.
   Change the values here and every CTA, nav button and footer
   link on the page updates at runtime.

   Keys used by data-ds-link="..." attributes:
     group  → Facebook Group  (all "Join" CTAs)
     page   → Facebook Page   (hidden automatically while empty)
     x      → X / Twitter     (hidden automatically while empty)
     github → GitHub          (hidden automatically while empty)
   ============================================================ */

window.DEVSPHERE_CONFIG = {
  // ── Primary conversion target ──────────────────────────────
  group: "https://www.facebook.com/groups/1864705694861230",

  // ── Secondary destinations (leave empty to hide the link) ──
  page: "",
  x: "",
  github: "",

  // Open outbound links in a new tab.
  openInNewTab: true,
};
