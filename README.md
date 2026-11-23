# DevSphere — Landing Page

Single-page landing site for **DevSphere**, an independent global community for
developers, designers and tech enthusiasts. The whole page has one job: get a
visitor into the Facebook Group.

- **Stack:** static HTML, CSS and vanilla JS. No build step, no dependencies, no backend.
- **Hosting:** GitHub Pages (branch `main`, root).
- **Live:** https://muhammad-akash.github.io/devsphere/

---

## Structure

```
index.html                  all markup (semantic, one page)
assets/
  css/styles.css            design tokens, layout, components, responsive, motion
  js/config.js              ← the only file you edit for links
  js/main.js                nav, mobile menu, reveals, scroll spy, hero network
  img/favicon.svg           logo mark
  img/apple-touch-icon.png  180×180 home-screen icon
  img/og-cover.png          1200×630 Facebook / Open Graph card
robots.txt
sitemap.xml
```

## Configuration

All outbound destinations live in `assets/js/config.js`:

```js
window.DEVSPHERE_CONFIG = {
  group: "https://www.facebook.com/groups/1864705694861230",
  page: "https://www.facebook.com/profile.php?id=61596843781283",
  x: "",
  github: "",
  openInNewTab: true,
};
```

Every element with a `data-ds-link` attribute is wired to one of those keys:

| Attribute              | Used by                                      |
| ---------------------- | -------------------------------------------- |
| `data-ds-link="group"` | nav CTA, hero CTA, final CTA, footer link     |
| `data-ds-link="page"`  | footer Facebook Page                          |

Empty values are hidden automatically and removed from the tab order, so leaving
`page` blank keeps a dead link off the page. Set it to your page URL to enable it.

Changing `group` updates every join button at once.

## Local preview

No tooling required — open `index.html` in a browser.

If you want a local server (recommended, so relative paths behave exactly like
production):

```bash
npx serve .
# or
python -m http.server 8080
```

## Deploying

The site is served from `main` at the repository root:

```bash
git add .
git commit -m "Update site"
git push
```

GitHub Pages redeploys automatically on push.

### If you fork or rename the repo

Update the absolute URLs in `index.html` so social previews resolve:

- `<link rel="canonical">`
- `og:url`, `og:image`, `twitter:image`
- the `Organization` JSON-LD block

---

## Accessibility & performance notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`), skip link, visible focus rings.
- Mobile menu is a real disclosure: `aria-expanded`, `aria-controls`, Escape to close,
  focus returned to the toggle.
- `prefers-reduced-motion` stops the particle canvas, the constellation drift and all
  reveal transitions — content renders immediately.
- The particle canvas pauses when the hero leaves the viewport or the tab is hidden,
  caps device pixel ratio at 2, and scales particle count with viewport area.
- Reveal animations use `IntersectionObserver` and are unobserved after firing.
- No web fonts are used above the fold blocking text: `display=swap` with a system fallback.
- All graphics are inline SVG or a single 1200×630 PNG for social cards.

## Content rules

No member counts, testimonials, ratings or activity statistics are invented anywhere
on the page. Credibility comes from the design and the clarity of the offer.
