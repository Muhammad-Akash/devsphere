/* ============================================================
   DevSphere — page behaviour
   nav · mobile menu · config links · scroll reveals ·
   section highlighting · hero particle network
   ============================================================ */
(function () {
  "use strict";

  var CONFIG = window.DEVSPHERE_CONFIG || { group: "", page: "", x: "", github: "" };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- config-driven links ---------------- */
  function linkTargets() {
    var links = document.querySelectorAll("[data-ds-link]");
    for (var i = 0; i < links.length; i++) {
      var el = links[i];
      var key = el.getAttribute("data-ds-link");
      var url = CONFIG[key];

      if (!url) {
        // Unconfigured destination: keep it out of the tab order and the DOM paint.
        el.hidden = true;
        el.setAttribute("aria-hidden", "true");
        el.removeAttribute("href");
        continue;
      }

      el.href = url;
      el.hidden = false;
      el.removeAttribute("aria-hidden");

      if (CONFIG.openInNewTab !== false) {
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    }
  }

  /* ---------------- sticky nav state ---------------- */
  function initNavScroll() {
    var nav = document.getElementById("nav");
    if (!nav) return;

    var ticking = false;

    function apply() {
      nav.setAttribute("data-scrolled", window.scrollY > 12 ? "true" : "false");
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(apply);
      },
      { passive: true }
    );

    apply();
  }

  /* ---------------- mobile menu ---------------- */
  function initMobileMenu() {
    var toggle = document.getElementById("navToggle");
    var panel = document.getElementById("mobileMenu");
    if (!toggle || !panel) return;

    var open = false;

    function setOpen(next) {
      open = next;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("is-locked", open);

      if (open) {
        panel.hidden = false;
        window.requestAnimationFrame(function () {
          panel.classList.add("is-open");
        });
      } else {
        panel.classList.remove("is-open");
        window.setTimeout(function () {
          if (!open) panel.hidden = true;
        }, 200);
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!open);
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && open) setOpen(false);
    });

    // Clicking outside the panel closes it.
    document.addEventListener("click", function (event) {
      if (!open) return;
      if (panel.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });
  }

  /* ---------------- scroll reveals ---------------- */
  function initReveals() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      for (var n = 0; n < items.length; n++) items[n].classList.add("is-visible");
      return;
    }

    // Stagger siblings so card grids cascade instead of popping together.
    var counters = new Map();
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var parent = el.parentElement;
      var count = counters.get(parent) || 0;
      el.style.setProperty("--i", String(Math.min(count, 5)));
      counters.set(parent, count + 1);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var j = 0; j < entries.length; j++) {
          var entry = entries[j];
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    for (var k = 0; k < items.length; k++) observer.observe(items[k]);
  }

  /* ---------------- active nav section ---------------- */
  function initSectionSpy() {
    if (!("IntersectionObserver" in window)) return;

    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    if (!links.length) return;

    var map = new Map();
    links.forEach(function (link) {
      var id = link.getAttribute("href");
      var section = id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      if (section) map.set(section, link);
    });
    if (!map.size) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (l) {
            l.removeAttribute("aria-current");
          });
          var active = map.get(entry.target);
          if (active) active.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    map.forEach(function (_link, section) {
      observer.observe(section);
    });
  }

  /* ---------------- hero particle network ---------------- */
  function initNetwork() {
    var canvas = document.getElementById("networkCanvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var COLORS = [
      [34, 211, 238],
      [14, 165, 233],
      [139, 92, 246],
      [148, 163, 184],
    ];
    var LINK_DIST = 120;
    var LINK_DIST_SQ = LINK_DIST * LINK_DIST;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var nodes = [];
    var frame = 0;

    function makeNode() {
      var color = COLORS[(Math.random() * COLORS.length) | 0];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.5 + 0.7,
        rgb: color,
        a: Math.random() * 0.4 + 0.3,
      };
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var nextW = Math.max(1, Math.round(rect.width));
      var nextH = Math.max(1, Math.round(rect.height));

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(nextW * dpr);
      canvas.height = Math.round(nextH * dpr);
      canvas.style.width = nextW + "px";
      canvas.style.height = nextH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      width = nextW;
      height = nextH;

      var density = nextW < 720 ? 20000 : 14000;
      var target = Math.max(18, Math.min(130, Math.round((nextW * nextH) / density)));
      nodes = [];
      for (var i = 0; i < target; i++) nodes.push(makeNode());
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var distSq = dx * dx + dy * dy;
          if (distSq > LINK_DIST_SQ) continue;

          var t = 1 - distSq / LINK_DIST_SQ;
          ctx.strokeStyle = "rgba(56, 189, 248, " + (t * 0.13).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        ctx.fillStyle =
          "rgba(" + n.rgb[0] + ", " + n.rgb[1] + ", " + n.rgb[2] + ", " + n.a.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -20) n.x = width + 20;
        else if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        else if (n.y > height + 20) n.y = -20;
      }
      draw();
      frame = window.requestAnimationFrame(step);
    }

    function start() {
      if (frame || reduceMotion.matches) return;
      frame = window.requestAnimationFrame(step);
    }

    function stop() {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    }

    resize();
    draw();

    if (reduceMotion.matches) {
      // One static composition, redrawn only on resize.
      window.addEventListener("resize", function () {
        resize();
        draw();
      });
      return;
    }

    start();

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    var resizeTimer = 0;
    window.addEventListener(
      "resize",
      function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
          var wasRunning = Boolean(frame);
          stop();
          resize();
          draw();
          if (wasRunning) start();
        }, 180);
      },
      { passive: true }
    );
  }

  /* ---------------- boot ---------------- */
  function boot() {
    linkTargets();
    initNavScroll();
    initMobileMenu();
    initReveals();
    initSectionSpy();
    initNetwork();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
