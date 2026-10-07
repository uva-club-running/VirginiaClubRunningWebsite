# Virginia Club Running

Astro website with an Alpine.js admin, Firebase Authentication / Firestore, and Cloudflare Workers. All work for this migration belongs on `astro-rewrite`.

## Rendering

- `/`, `/training/`, `/community/`, and `/contact/` are built as static HTML. Navigation and expandable tables use native HTML; public pages ship no React or Firebase browser runtime. Summer Training is disabled to match `master`; its source is retained in `src/pages/_summer-training.astro`, which Astro excludes from routing.
- `/records/`, `/meets/`, and `/philanthropy/` render on the Worker and cache their HTML in Cloudflare's Cache API.
- `/admin/` renders Astro forms and loads Alpine.js for login, form state, and submissions. Alpine and Firebase's browser SDK load only here; React is no longer a dependency. `/dashboard/` redirects there. The admin and API responses use `Cache-Control: no-store`.
- Authentication remains Firebase email/password. All reads and writes in the admin go through `/api/admin/content/`. The Worker verifies the Firebase ID token's signature, project, issuer, expiration, and UID allowlist. Firestore requests carry the user's ID token, so Firestore rules still enforce authorization. There is no service-account private key, Cloudflare Access, Firebase Function, or GitHub rebuild token.

## How saves refresh pages

A save commits the content change and a random `SiteCache/{page}` revision in **one Firestore atomic commit**. Writes to Meets refresh `/meets/`; Records, Events, and AllAmericans refresh `/records/`; Philanthropy refreshes `/philanthropy/`.

For every request to one of these public pages, the Worker reads that page's small revision document. Its HTML cache key includes the revision and Worker deployment version. After a successful save, all locations use the new revision, even if a previous render is still in flight. Old entries expire naturally. This avoids `cache.delete()`, which only invalidates a single Cloudflare location, and does not require a Cloudflare purge token or custom domain.

**Cost tradeoff:** each dynamic page request still reads one Firestore document and invokes the Worker; a cache hit avoids the full collection reads and Astro rendering. Database reads are per document, not per query. Static pages bypass this flow. This design targets modest club traffic; it does not guarantee zero usage charges if you later enable a paid plan. On Spark / Workers Free, exhausted quotas cause errors rather than automatic overage billing. Measure production CPU time against Workers Free's allowance before relying on it.

Cached HTML expires after one hour for records/meets and five minutes for philanthropy. This also refreshes date-dependent content without cron jobs. Philanthropy events stay listed through their calendar date in America/New_York. New date-only entries are stored as `YYYY-MM-DD`; historical Firestore timestamps remain supported.

Browser-facing responses use `no-store` so a browser or intermediary cannot skip the revision check. An already-open page requires navigation/reload to show a save. A Firestore failure produces an uncached 503, rather than publishing an empty page or claiming stale content is current. Cache storage is best effort; a cache miss renders fresh content.

## Local development

Use Node 22.12+ (Node 24 LTS recommended).

Node 26.3.0 has also been verified with development and production preview. Keep the direct Vite 8 dependency and the Vite-8-compatible Tailwind plugin aligned with Astro. Mixed Vite 7/8 installations can crash Cloudflare's development runner with `Missing field moduleType`. After updating dependencies, restart any existing dev/preview server; use `npm ci` to install the checked-in lockfile exactly. `npm ls vite` should show one Vite version.

```sh
npm ci
cp .dev.vars.example .dev.vars
npm run dev
```

Set `ADMIN_UIDS` in `.dev.vars` to the comma-separated Firebase Authentication user UIDs allowed to administer the site. An empty allowlist denies all admin access. Do not put this value in a `PUBLIC_` variable. Get UIDs from Firebase Console → Authentication → Users.

The Firebase web configuration is public and is shared in `src/lib/firebase-config.js`. Do not put a service-account key in it. Development uses the configured real Firebase project: submitting an authenticated form can change real data. Use a separate Firebase project for destructive testing; update the shared configuration consistently.

```sh
npm test
npm run lint
npm run build
npm run preview
```

The preview runs the built site in Cloudflare's local runtime. The build itself does not contact Firestore. Public Firestore reads require the published rules to allow the five public content collections and `SiteCache/{page}` reads. Check `X-Page-Cache: MISS` then `HIT` on repeated dynamic page requests. Cache behavior in local tooling can differ from a deployed Worker.

## Required Firebase configuration before launch

1. Confirm the existing Firebase project and data are the intended production project. Keep Spark if you want the no-billing setup.
2. Confirm the UID(s) in `firestore.rules` match Worker `ADMIN_UIDS`. The user-authorized admin `wZmt0Go4RhR7zt4MlLK2JfSYDQI2` is configured in both. An empty/mismatched configuration fails closed.
3. Review the current deployed Firestore rules before replacing them. This repository's rules cover only this website's five content collections and its cache markers; preserve any separate application's required rules without adding a broad write rule that bypasses the revision requirement.
4. Publish the reviewed rules through Firebase Console → Firestore Database → Rules, or the Firebase CLI (`firebase deploy --only firestore:rules --project club-running-at-uva`). The repository does **not** apply rules during a site build or deploy.
5. Add your preview/production hostname under Firebase Authentication → Settings → Authorized domains as needed.

The rules require every content mutation to advance its page's cache revision in the same atomic commit. **Publishing them prevents the old React admin's direct writes. Coordinate the rules change with the new site's launch.** Missing marker documents need no manual seeding; the first successful save creates them. Reads of an absent allowed marker use the initial cache version. Other tools editing content must follow the same atomic revision protocol.

No production rules, Firebase records, or cloud resources are changed by the local migration.

## Validation and remaining checks

The production build, ESLint, 12 server regression tests, and five admin controller tests pass. Local Cloudflare preview renders existing Firebase data, returns cache hits on repeated requests, and displays the Alpine login form. Authenticated production saves and published Firestore rules still need a launch smoke test; automated tests use isolated fixtures and do not modify production data.

The dependency audit currently reports high-severity transitive advisories in `@grpc/grpc-js` (Firebase's unused Firestore SDK dependency) and `sharp` (Cloudflare's local Miniflare tooling). The application uses Firestore REST and Firebase browser Auth; it does not import the Firestore SDK or run a gRPC server. Image handling uses passthrough. These facts limit the affected application paths but do not make the audit clean. Review upstream fixes before launch; do not blindly run `npm audit fix --force`, whose current suggestions downgrade Firebase and the Cloudflare adapter across major versions.

## Cloudflare deployment (manual for now)

`wrangler.jsonc` configures the Worker and static assets. Astro sessions are disabled because Firebase handles authentication; no KV binding is required. The adapter writes deployable static files to `dist/client/` and the Worker and generated configuration to `dist/server/`.

1. Authenticate Wrangler to your Cloudflare account (`npx wrangler login`).
2. Set the production `ADMIN_UIDS` value in `wrangler.jsonc` before building/deploying. Local `.dev.vars` does not become production configuration. UIDs are identifiers, not passwords; never add Firebase tokens or passwords to the repository.
3. Run `npm run deploy`. Wrangler uses Astro's generated deployment configuration. Set the chosen production site URL in `astro.config.mjs` when the domain is decided.
4. Check public pages, admin sign-in, and a controlled content update. Confirm only the relevant page changes and the next request shows fresh HTML. Also check Workers CPU metrics; local wall-clock timing does not establish the free plan's CPU requirement.

The existing `.github/workflows/deploy.yml` is unchanged at the user's request. It is the old `master`-branch SFTP deployment, **not a Cloudflare deployment**, and should not be used for this architecture. No GitHub Actions setup, push, or live deployment has been performed.

## Code map

- `src/pages/` — each Astro route contains its data loading and page markup, including the home sections, contact data, and records tables. The authenticated admin API is under `src/pages/api/`.
- `src/pages/admin.astro` — login and dashboard form markup in one file.
- `src/pages/_partials/` — shared navigation, repeated record cards, and the reusable admin `Field.astro` / `ContentForm.astro` primitives. The underscore excludes these files from routing. There is no separate components directory.
- `src/lib/admin-alpine.js` — admin-only Alpine initialization and Firebase wiring.
- `src/lib/admin-session.js`, `src/lib/admin-forms.js` — login/session state and submit handlers. `x-model` binds input values; `x-on:submit.prevent="save"` sends them through `admin-client.js` to the existing authenticated Worker API.
- `src/lib/firestore.js` — Firestore REST codecs and requests.
- `src/lib/auth.js` — Firebase JWT verification and admin authorization.
- `src/lib/mutations.js` — input validation, idempotent create IDs, atomic content/revision commits.
- `src/middleware.js`, `src/lib/page-cache.js` — public HTML caching and revision checks.
- `firestore.rules` — reviewed/published separately at launch.
- `test/server.test.js` — auth, mutation, data, and multi-location cache regression tests.
