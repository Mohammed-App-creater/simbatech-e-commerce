# Simbatech

The website for Simbatech, an e-commerce store where customers buy products or rent them by the day (Ethiopian market: prices in ETB, Telebirr / CBE Birr / card payments).

- **This repo:** the site — Next.js 16 (App Router), React 19. The screens in `src/screens` were built pixel-for-pixel from the design export in `../Clint Frontend`.
- **Backend:** the separate `simbatech-api` repo — Django REST API + PostgreSQL, run with Docker.

## Getting started

1. Start the API (see the `simbatech-api` README): `docker compose up -d` in that folder gives you the API on http://localhost:8000 with the catalog and a demo customer already loaded.
2. Run the site:

```bash
cp .env.example .env     # API_URL=http://localhost:8000
npm install
npm run dev              # http://localhost:3000
```

**Demo customer:** `demo@simbatech.et` / `simbatech123`. Promo code `SIMBA10` gives 10% off purchases. The store admin is at http://localhost:8000/admin/ (`admin@simbatech.et` / `admin12345`).

## How it fits together

```
next.config.ts              proxies /api/* to the Django API, so the browser and the API share one origin
src/app/<page>/page.tsx     server component: loads the page's data from the API, passes `initial` to the screen
src/lib/server/api.ts       server-side fetch helper (forwards the visitor's cookies)
src/screens/*.jsx           the UI (class components from the design; inline styles are the design)
src/lib/client/store.js     browser store for user / cart / wishlist + actions (add to cart, sign in, …)
src/lib/client/api.js       fetch wrapper for the API (adds Django's CSRF header)
src/lib/pricing.ts          pricing rules mirrored from the API, for live totals in the UI
```

- **Accounts:** sign up / sign in with a phone number or email. The API keeps the session in an httpOnly cookie.
- **Cart:** guests get a cart tied to their session; it merges into the account when they sign in.
- **Pricing:** the API is authoritative; `src/lib/pricing.ts` has the same rules so cart and checkout can preview totals.
- **Sign-in:** phone or email + password, phone with an SMS code, or Google (when the API has Google keys). Forgot-password works by email link or SMS code.
- **Payments:** the API decides. With a Chapa key configured it answers checkout with a payment-page URL and the site sends the customer there (`finishCheckout` in the store); without one, online payments are recorded as paid immediately. Unpaid orders show a "Pay now" button.
- **Store details** (city, phone, address, hours, policies) come from the API's Store settings (`initial.store` / `useStore()`), so the shop owner edits them in the admin.
- **Content pages** at `/p/<slug>` (help, delivery, returns, rental terms, privacy, terms, about, careers, sell with us, contact), order tracking at `/track`, password reset at `/reset-password`.

### Layout

The design is drawn on a 1440px canvas. `src/app/responsive.css` and `src/app/mobile.css` adapt it to tablets and phones by targeting the `data-*` attributes and inline styles in the screens, so keep those intact when editing screen markup. On phones a bottom tab bar (`MobileTabBar`) and a filter sheet on the shop page (`MobileFilters`) are added.

`scripts/convert.py` is the tool that originally generated `src/screens` from the design export. The screens are now wired to real data by hand, so **don't regenerate them** — it would overwrite that work.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```
