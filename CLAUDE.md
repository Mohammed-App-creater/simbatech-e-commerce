# Simbatech web (Next.js)

Storefront for Simbatech: buy or rent by the day, Ethiopian market (ETB, Telebirr / CBE Birr / cards).
Next.js 16 App Router, React 19. The backend is a separate repo, `../simbatech-api` (Django), see its CLAUDE.md.

- Live site: https://simbatech-e-commerce.vercel.app (Vercel, auto-deploys from `main`)
- API: https://simbatech-api.onrender.com (Render). `/api/*` on the site is proxied there by `next.config.ts`.
- Original design export: `../Clint Frontend/Simbatech (4).html`

## How the code is organised

- `src/app/<route>/page.tsx` — server component: fetches the page's data from the API with the visitor's cookies
  (`src/lib/server/api.ts`) and passes one `initial` prop to its screen. Every page gets the shell
  `{ user, cart, wishlist, store, auth }` plus page data.
- `src/screens/*.jsx` — the UI. **React class components** generated pixel-for-pixel from the design: inline styles,
  a `renderVals()` method that computes everything the JSX shows (`vals.x`). They are now hand-maintained.
  **Never run `scripts/convert.py` to regenerate them** — it would wipe the data wiring.
- `src/lib/client/store.js` — browser store + all actions (cart, wishlist, auth incl. OTP/Google/reset, reviews,
  payment methods, notifications, checkout, payments, tracking, contact). Screens use
  `shopState(this.props.initial)` in `renderVals()` and `connectShop(this)` in `componentDidMount`.
  The store is never mutated on the server (would leak between requests).
- `src/lib/client/api.js` — fetch wrapper; sends Django's CSRF header (`X-CSRFToken` from the `csrftoken` cookie).
- `src/lib/pricing.ts` — pricing rules mirrored from the API for live previews (API is authoritative).
- `src/lib/phone.js` + `src/components/PhoneInput.jsx` — phone fields (see below).
- Store details (city, phone, address, hours, policies) come from the API's Store settings: `initial.store` /
  `storeVals(shop)`, or `useStore()` from `StoreProvider` in function components. Don't hard-code them.

## The staff area (`/admin`)

- Pages in `src/app/admin/*` fetch with `adminGet()` (`src/lib/server/admin.ts`) from the API's `/api/admin/*`
  (the `backoffice` app). The API decides who is staff: signed-out visitors are redirected to sign in, customers
  get the not-found page. Staff see a "Store admin" link in the account page's side menu (`user.isStaff`).
- Screens are in `src/screens/admin/*.jsx`: hand-written **function components** styled by
  `src/components/admin/admin.css` (`adm-*` classes, the storefront's palette and shapes), with shared pieces in
  `src/components/admin/` (`AdminShell` frame, `ui.jsx`, `OrderTable`, `ReviewCard`).
- Screens render straight from their `initial` prop. Actions go through `useAction()` in `ui.jsx`: call the API,
  then `router.refresh()` so the page and the side menu's badges re-fetch. Filters live in the URL
  (`?status=`, `?q=`, `?show=`).
- Customer reviews wait for approval in `/admin/reviews`; the product page tells the author theirs is waiting.
- Charts (`src/components/admin/charts.jsx`): `ColumnChart` (stacked columns, tooltip, hidden table) and `BarList`
  (ranked bars), plain HTML. Sold/rented are `#1A62A8`/`#418D4D` (checked for colour-blind separation); a
  single series is brand blue. `/admin/reports` reads `/api/admin/reports?days=` or `?from=&to=`; the CSV
  download is `/api/admin/reports/orders.csv` with the same range.
- Staff land on `/admin` after signing in (unless `?next=` says otherwise); `StaffBar` shows them an
  "Admin dashboard" button on every shop page.

## Rules for editing screens

- Keep the design's markup: inline styles, class names, element nesting and `data-*` attributes
  (`data-sec`, `data-cols`, `data-span`, `data-abs`, `data-banner`, `data-row`, `data-w`). `src/app/responsive.css`
  and `src/app/mobile.css` target those attributes and serialized inline styles to build the tablet/phone layouts.
- No `Date.now()`, `window`, `localStorage` or randomness during render (hydration). Use `initial.today` /
  `initial.todayLocal`, read browser-only things in `componentDidMount`.
- Product links are `/product/<slug>`; order pages `/order-confirmed/<id>`; content pages `/p/<slug>`; `/track`;
  `/reset-password`.
- Show API errors inline (`err.message`, `err.field`), never `alert()`.
- **Phone numbers**: always Ethiopian mobile, shown as a fixed `+251` chip + 9 digits starting with 7 or 9.
  A leading 0 or pasted +251 is trimmed. Use `PhoneInput` for any phone-only field and `isCompletePhone()` before
  submitting. Stored/sent in local form `0911234567`. "Phone or email" boxes stay plain inputs.
- **Big screen files: don't edit them with broad regexes.** A scripted multi-line regex once deleted ~500 lines of
  SignInScreen. Anchor on a unique id, and check `git diff --stat` after scripted edits.

## Environment and deploy

- `.env`: `API_URL=http://localhost:8000` locally. On Vercel, `API_URL=https://simbatech-api.onrender.com`.
- `API_URL` is read **at build time** by the rewrite in `next.config.ts`: after changing it on Vercel, **redeploy**.
  A missing `API_URL` in production shows up as `fetch failed … ECONNREFUSED 127.0.0.1:8000`.
- Run locally: start the API (`docker compose up -d` in `../simbatech-api`), then `npm run dev`.
- Demo customer: `demo@simbatech.et` / `simbatech123`. Promo code `SIMBA10`.

## Checks before committing

```bash
npx tsc --noEmit
npm run lint        # 0 errors; the <img> warnings are the design's logo pattern
npm run build
```
Browser checks used in this project: Playwright (`playwright-core` with the installed Chrome) against a production
build on port 3100, at 1440px and 390px — no horizontal overflow, no console errors.

## Working with the owner

- Commit and push to `main` when a piece of work is done and checks pass (Vercel deploys from it).
- Commit messages end with the `Co-Authored-By` line given in the session.
