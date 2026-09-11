# AishaEsthetics branding and SEO

Set `VITE_SITE_URL` in `.env` or the hosting build environment to the real public origin, then run `npm run build`. No production domain is assumed. Without this value, the build omits the sitemap and static canonical URLs; browser metadata uses the current origin.

Deploy the complete `dist` directory. Configure the host to serve existing files and route directories before falling back to `index.html` for React routes. The generated `/signin/index.html` and `/signup/index.html` contain public metadata, and internal route HTML contains `noindex, nofollow`. These are metadata snapshots, not prerendered React content. Robots rules allow crawling so crawlers can read the noindex directives. Authentication remains the access control.

The root route retains its existing role-aware redirect; its canonical points to `/signin`. The sitemap lists only the two public pages. Submit `/sitemap.xml` in Google Search Console after deployment. This login-based app has SEO metadata foundations; richer search content will require public service/location pages with verified business details.

The shared metadata implementation follows [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). Social metadata is included in initial HTML for bots that do not execute JavaScript.

The original `public/logo.png` is preserved. Regenerate resized logos, Apple icon, and the multi-resolution favicon on Windows with `powershell -File scripts/generate-icons.ps1`.

Display branding uses **AishaEsthetics**, including email defaults and PDF exports. Existing database filenames, backup prefixes, session keys and configured email addresses retain their identifiers. If `EMAIL_FROM_NAME` is explicitly configured on the backend, set it to `AishaEsthetics` there too.
