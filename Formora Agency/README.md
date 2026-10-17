# FORMORA — Updated Website

A full static, trilingual website (AZ / EN / RU), with editable assets and an optional secure server-side contact form for Vercel. The previous site's layout, identity and five cases are retained.

## Deployment

1. Upload this entire folder as the root of a Vercel project (Framework Preset: Other). Static pages: `/`, `/en/`, `/ru/`.
2. **Before going live, replace the example canonical domain** `https://formora-refined.kerimova-05.chatgpt.site` with the exact live domain in `index.html`, `en/index.html`, `ru/index.html`, `sitemap.xml`, and `robots.txt`. Also update `og:url`, `og:image`, hreflang, JSON-LD where that domain appears. Never leave a preview domain canonical on production.
3. Set Vercel environment variables `RESEND_API_KEY`, `BRIEF_FROM_EMAIL` (verified sender domain at Resend) and optionally `BRIEF_TO_EMAIL`. Redeploy after saving. No API key appears in browser code.
4. Until configured, direct sending is hidden and WhatsApp/email links remain usable. **Direct email is not enabled or tested as a real delivery in this package**; credentials and a verified sender are required.
5. Verify email delivery end to end and enable rate limiting/WAF protections (best-effort in-memory throttling is not globally reliable across serverless instances).
6. Add actual case-study artwork for Healing, Brera, Voltic and Velora before representing a complete visual gallery; only AIS's two existing work samples are present. No fictitious performance numbers have been introduced.

## Performance and SEO

- Images and CSS/JS are separate cacheable assets, not repeated data URIs inside each HTML document.
- All three languages have pre-rendered HTML, canonical links, language alternates, social card, sitemap and robots rules.
- Portfolio imagery below the fold loads lazily; noncritical font loading may depend on network.
- Run live Lighthouse/Core Web Vitals after deployment; static preview tests do not represent production network performance.

## Files

- `index.html`: Azerbaijani homepage. `en/`, `ru/`: localized pages.
- `assets/site.js`: content, i18n, portfolio modal, form interactions.
- `assets/styles.css`: site styling.
- `assets/`: logos, existing portfolio previews, Open Graph preview.
- `api/brief.js`: optional Vercel function; requires environment secrets.
- `.env.example`: configuration names only; do not put secrets into HTML/JS or commit a real `.env`.

## V3 Motion Layer
This build adds restrained premium motion without third-party animation libraries:
- staggered mask reveal in hero typography
- CTA arrow micro-interactions
- viewport reveals for portfolio, process, team and footer CTA
- smooth service accordion height/opacity animation
- subtle portfolio hover lift/scale
- reduced-motion accessibility support
