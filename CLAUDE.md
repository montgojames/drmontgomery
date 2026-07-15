# drmontgomery.org — Patient Education Site

Redesign of a patient & family education website for a hospitalist (Dr. Montgomery / "Brett").
The site owner writes all medical content; the builder handles all design, layout, and code.

## Purpose & audience
- **Purpose:** Patient & family reference. Helps hospitalized patients and their families understand
  what's happening and navigate decisions. Education-first (90/10, max 80/20 over personal showcase).
- **No** health-news commentary, newsletter-sending, or social presence at launch.
- **Audience is a HARD constraint:** elderly, low tech comfort, reading on phones. Design target is
  "an older parent navigating it easily." Simplicity and accessibility ALWAYS beat cleverness.

## Non-negotiable rules
1. **All medical content comes from the site owner, never AI-generated.** Do not write, invent,
   rephrase, or "improve" clinical/medical substance. Copy-editing of the owner's existing text is
   limited to mechanical fixes only: typos, grammar, punctuation, formatting. Never alter meaning or
   add medical information. New pages (e.g. Advance Directives): build the empty structure; the owner
   supplies the words.
2. **Accessibility is a requirement, not a nice-to-have.** Large legible type, high contrast
   (meet WCAG AA — 4.5:1 for normal text, 3:1 for large), big tap targets (min 44x44px), obvious
   labels, no hover-dependent menus, clear focus states. Prefer a persistent bottom nav on mobile.
3. **Design/technical decisions route through the builder, not the owner.** The owner only writes and
   edits article content via the CMS.

## Visual direction — "Warm Editorial"
Reads like a thoughtful, warm health publication, not a clinic. Warm and calm, not cold/corporate.

**Palette (hex):**
- Cream background `#F6F3EE`
- Off-white `#FFFDF7`
- Warm gray `#E7E2DB`
- Terracotta accent `#D97A5E`
- Deep green `#1F3D2E`

**Color usage rule (important):**
- **Terracotta `#D97A5E` is an ACCENT ONLY — it must never carry text.** It fails contrast for text.
  Use it for rules/dividers, icon circles, borders, active/hover states, small decorative marks.
- **Primary buttons = deep green `#1F3D2E` with white text** (contrast ~11.9:1, safe).
- Secondary buttons = outlined, dark text on cream.
- Body text = dark ink on cream/off-white.

**Typography:**
- Elegant serif headlines paired with a clean, highly legible sans-serif body.
- Body text should be set LARGER than a typical site (older readers). Err generous on size,
  line-height, and spacing.
- A distinctive treatment of the name "Dr. Montgomery" may serve as a wordmark; reserve any special
  name treatment for the name only. (Font specifics are a build-time decision.)
- Footer legal/disclaimer text (see Disclaimer wording below) and the copyright line should read as
  quiet, de-emphasized text — regular weight, muted color against the dark green footer, not bold.
  Bold reads as a heading/warning and competes with real headings elsewhere on the site.

## Structure (navigation)
- **During Your Stay** → Hospitalist Defined · Your Healthcare Team · Mobility · Sleep
- **Decisions & Next Steps** → Discharge Planning · Resuscitation · Hospice/End-of-Life · Advance Directives
- **Medical Conditions** (article library; every topic Brett listed is shown - written topics link internally, unwritten topics show as `[external link]` pointing to a vetted outside source until Brett writes his own page).
- **About**
- **Search** — added after the original plan (see Features below); same text-label nav item as the
  other four, not icon-only.

## Homepage
- **Hero:** Brett's quote ("The goal of this website is to inform, educate, and promote understanding
  for the hospitalized patient.") with attribution line "—Brett Montgomery, MD", plus a small headshot
  placed inline beside the attribution — same 3:4 rounded-rectangle photo treatment as the rest of the
  site (NOT a circular crop; keep one consistent shape language across all photos). This is the only
  homepage appearance of his photo — see headshot placement rule below.
- **Section headers** (one per card grid — During Your Stay / Decisions & Next Steps / Medical
  Conditions): small caps label + large serif headline only. **No subhead line** — an earlier version
  had a subhead under each headline and it was cut; with the cards right below repeating the same
  specifics, the subhead was pure redundancy, and in one case it accidentally cross-referenced a
  different section's name. Don't reintroduce a subhead here without a real reason.
- **Medical Conditions section** only has one destination (unlike the other two sections' four-card
  grids), so its single card is still needed as the click target — don't remove it. Just make sure its
  card title/description don't restate the header above it; the title matches the destination page's
  name (consistent with how the other 8 cards work), and the description is separate wording, not a
  paraphrase of the headline.
- **Headshot placement:** About page and homepage hero only. Deliberately NOT in the persistent nav
  bar — a photo following the user on every page eats mobile screen space for this audience and pushes
  toward "personal brand," which conflicts with the 90/10 education-first split above.

## Features
- Mobile-first, accessible.
- **Comment/review submission form** (Testimonials): patients submit; owner moderates and posts after
  off-service review. Hospital policy confirmed OK by Brett (no longer a blocker). Lives as a small
  section on the About page — NOT a top-level nav item, to keep the 90/10 education-first ratio.
  Reuses the Suggest-a-topic architecture (Cloudflare KV + the same protected `/admin` view) rather
  than new infrastructure. Approving a submission in the admin view is a status flag only, not a
  publish action — actually adding an approved testimonial to the live About page content is a
  separate, manual step, deliberately not automatic (no risk of a bad submission going live without a
  human looking at the rendered page first).
- **"Suggest a topic"** ✅ Done — feeds the writing queue. Entry point is a button on the Medical
  Conditions page (`#suggest-topic-toggle`) that discloses a form, not an always-visible one, so the
  page's default length is unchanged. Topic (required) + email (optional, clearly labeled) + a
  CSS/ARIA-hidden honeypot field. Submits via `fetch` to `/api/suggest-topic`, routed through the
  single Worker entry point (`worker/index.ts` → `worker/handlers/suggest-topic.ts`; see Stack &
  hosting below for why this is one Worker rather than Cloudflare Pages' old auto-routed `functions/`
  convention). Validates (topic non-empty, email format if present, honeypot must be empty — a filled
  honeypot gets a fake-success response so bots don't learn they were caught) and writes to a
  Cloudflare KV namespace bound as `SUGGESTIONS`. Successful submit replaces the form with a
  confirmation message in place, not a silent field-clear.
  - **Admin view**: `worker/handlers/admin-suggestions.ts` at `/admin/suggestions` — not linked in nav
    or sitemap, deliberately unstyled beyond basic readability (only audience is Brett/James). Lists
    every KV entry most-recent-first (KV keys are prefixed with a millis-epoch timestamp specifically
    so this works without needing to fetch-then-sort). **Protected by Cloudflare Access (Zero Trust)**,
    configured on the Cloudflare dashboard against the `/admin/suggestions` path specifically — not
    `/admin/*` (that would also gate TinaCMS's admin bundle at `/admin/index.html`, forcing a second
    login on top of Tina's own; scoping Access to the exact suggestions path avoids that, and lines up
    with `wrangler.jsonc`'s `run_worker_first`, which only intercepts `/admin/suggestions`, not
    `/admin/*`). See Development section below for the exact one-time dashboard setup (KV namespace +
    Access) required before this works in production.
- Email signup: collect-only, nothing is sent yet.
- **Printable articles**: on-page "Print this article" button (native browser print dialog, no PDF
  library needed) + a print stylesheet — black text on white (not the cream/terracotta theme), nav/
  footer/cards/CTAs hidden, article title and section label shown at the top of the printed page.
- **Share button** (added beyond the original feature list, bundled in with printable articles since it
  needs no backend): Web Share API (`navigator.share()`) opening the device's native share sheet, with
  a "Copy Link" + confirmation fallback for browsers without support. Shares the specific article's URL,
  not the homepage.
- Full mechanical copy-edit pass during content migration.
- **Remaining build order** (simplest/lowest-risk first): Printable + Share ✅ → Suggest-a-topic ✅ →
  Email signup → Testimonials (submission + moderation is the biggest lift — real backend logic,
  not just a form). Suggest-a-topic ended up built out of its original "after email signup" order —
  it was ready and requested first; the ordering was a rough sequencing guide, not a strict gate.
- **Search** (added after the original plan — not in the build order above; built once the site had
  grown enough, and structural enough as a feature, that it didn't fit waiting for that list to finish):
  - `/search` page, static/client-side via **Pagefind** — an index generated at build time
    (`pagefind --site dist`, chained onto `astro build`), queried entirely in the browser. No backend,
    no Cloudflare Function, still fits the free-tier static-hosting model.
  - Submit-based, not live-as-you-type: results only appear after Enter/tapping the Search button.
  - Full-text (title + body), covering During Your Stay, Decisions & Next Steps, Medical Conditions
    articles, and About. The homepage itself is excluded from the index (`pagefindIgnore` prop on
    `BaseLayout`) — its card teasers just duplicate the real article pages, which are already indexed,
    so including it would only add noisy duplicate results.
  - **Medical Conditions results are two kinds, and must look different before tapping, not after**:
    internal articles come back through Pagefind's normal full-text index; external-link topics (no
    page exists on this site for them) are matched separately by title against the same
    `medicalConditionsTopics` data the index page uses, and rendered with the shared
    `.medical-conditions-page__tag` "external resource" badge (promoted from that page into
    `global.css` specifically so this is reuse, not a second copy of the same pattern) plus
    `target="_blank"`.
  - No-results state is plain language with an escape hatch, not a dead end: "No results for
    '[query]'. Try a different word, or browse Medical Conditions directly." (linked).

## Disclaimer wording (must include the owner's specific points)
- **Footer, on every page, permanently, both lines:**
  - "This is education, not medical advice."
  - "If this is an emergency, call 911."
  - These were briefly split (911 line moved to "relevant pages only") and then reverted — a
    page-specific approach requires a judgment call every time a new page is added, and a future page
    silently missing it is a worse risk than a slightly longer footer. Global and guaranteed beats
    "relevant pages only." Keep both lines in the footer, don't re-split them without discussing it.
  - Style as a single line (both sentences joined with a middle dot separator), per explicit
    build-time decision — supersedes the earlier two-stacked-lines approach. Both required sentences
    must still appear verbatim; only the visual presentation changed. See the footer typography note
    under Visual direction.
- Comment section specifics (owner's language):
  - Communication is **one-way — the doctor will not respond on the website.**
  - **All comments are reviewed only after the doctor is off-service**, so they have no influence on
    the in-hospital doctor–patient relationship.

## Stack & hosting
- **Astro** (static site generator) + **TinaCMS** ✅ Set up, including the Tina Cloud account itself
  (step 1 below is done — real Client ID + Read-Only Token in `.env`, login verified end-to-end via
  the real GitHub OAuth popup, content indexing confirmed working). Remaining steps (2-4 below) are the
  Cloudflare Workers project + inviting Brett. Chosen specifically because Brett needs a
  clean, word-processor-like editing interface (rich-text field: bold/italic/headings/lists as you
  type), not a raw-Markdown textarea or plain form fields, which is what TinaCMS's standard content
  field provides and Decap/Keystatic don't match as closely. Uses a free Tina Cloud account (free tier
  covers up to 2 users — James and Brett).
  - **Deliberately NOT** using TinaCMS's "live in-context visual editing" mode (`@tinacms/astro`
    integration, `<TinaIsland>`, requires switching the whole site to `output: 'server'` + an SSR
    adapter) — confirmed via TinaCMS's own docs that this is a second, heavier integration path Astro
    specifically pushes toward, and it's still noted as experimental there. The standard admin-panel
    path used instead needs none of that: the site stays `output: 'static'`, unchanged.
  - `tina/config.ts` is the schema — mirrors `src/content.config.ts`'s Zod schema field-for-field
    (title, section, order, teaser, draft, plus the body as a `rich-text` field) across all 4
    collections (During Your Stay, Decisions & Next Steps, Medical Conditions, About), pointed at the
    exact same `src/content/*` files. No change to the underlying file/folder structure. `section`
    isn't part of Astro's enforced schema but does exist in every article's raw frontmatter — included
    in Tina's schema anyway (labeled "do not change") specifically so Tina doesn't silently drop it the
    first time an article is saved through the CMS.
  - `npm run build` now runs `tinacms build && astro build && pagefind --site dist` — Tina's build step
    generates a static admin bundle into `public/admin/`, which Astro's own build then copies into
    `dist/admin/` like any other static asset. No server-side Tina code runs on the deployed site; the
    built bundle is a client-only app that talks to Tina Cloud's API directly. `TINA_CLIENT_ID` /
    `TINA_TOKEN` must be set as build-time environment variables in Cloudflare's dashboard (Workers
    Builds' "Variable name / Variable value" fields — see the Workers project setup below; NOT
    `wrangler.jsonc`, since these are build-step secrets, not runtime bindings) for this to succeed in
    production (fails with a clear "Client not configured" error otherwise — confirmed, not a bug, and
    also confirmed locally: `tinacms build` alone errors the same way without `--local
    --skip-cloud-checks`, which is dev/verification-only — never use those two flags for a real
    production build, they hardcode the bundle to talk to `localhost:4001` instead of Tina Cloud).
  - `npm run dev:cms` (`tinacms dev -c "astro dev"`) is the intended local dev workflow per TinaCMS's
    own docs, but doesn't work in this specific dev environment — the project's own `astro dev` wrapper
    always detaches into a background daemon and returns immediately, which breaks Tina's assumption
    that the wrapped command blocks in the foreground so it can run its own dev server alongside it.
    Verified workaround: start `astro dev --background` as usual, then separately run
    `npx @tinacms/cli dev` (no `-c` flag) in its own process — both then run independently and
    `/admin/index.html` works. Verified end-to-end this way: all 4 collections list correctly, opening
    a real article (Diabetes) shows the exact existing frontmatter in form fields and the real body
    text as fully-formatted rich text (bold labels render as bold, not literal `**asterisks**`).
  - **What's still needed from James** (this is the one piece of the setup that requires an actual
    account/login, not something doable from the repo) — **and there's a Cloudflare Workers project
    dependency to sequence around**: the `drmontgomery.org` domain isn't connected yet on purpose
    (Brett hasn't previewed/approved the site), but creating the Cloudflare Workers project itself is a
    separate, earlier step from the domain, and Tina Cloud needs to be pointed at SOME URL. Order that
    actually works:
    1. ✅ Done. Create a free Tina Cloud account at app.tina.io, connect it to the
       `montgojames/drmontgomery` GitHub repo (GitHub OAuth — only James does this, not Brett). Site
       URLs during setup: local = `http://localhost:4321`, production = a placeholder for now, editable
       later. Grab the Client ID + a Read-Only Token, put them in a local (gitignored) `.env` as
       `TINA_CLIENT_ID=`/`TINA_TOKEN=`.
       - **`tina/config.ts` + `tina/tina-lock.json` must themselves be committed and pushed to GitHub**
         — Tina Cloud indexes the schema from the real repo, not local files. Both are tracked (only
         `tina/__generated__/` is gitignored).
       - **First-ever push needs a manual "Reindex" click, not just the push itself**: right after that
         first push, opening a collection in `/admin` failed with `GetCollection failed: ... Index
         version '0' no longer supported. Reindex your project.` — confirmed via `git fetch` that the
         push had already landed on `origin/main`, so this wasn't a missing-push problem. Per Tina's own
         troubleshooting docs, version `0` means the branch has never been successfully indexed yet;
         the fix was clicking **Reindex** on the Tina Cloud dashboard
         (`app.tina.io/projects/<id>/configuration`) — resolved it immediately. Only needed once, for
         that first push; not expected on ordinary content saves afterward.
    2. Create the Cloudflare Workers project (see the exact dashboard field values under Development
       below — this account's dashboard defaults to a unified "Workers" creation flow, not the older
       Pages "Connect to Git" flow). Add `TINA_CLIENT_ID` / `TINA_TOKEN` as build-time Variables there
       (NOT committed to the repo — the token is a secret) before the first deploy, or that build fails
       with a clear "Client not configured" error (confirmed locally).
    3. That gives a `*.workers.dev` URL — usable for Brett's preview/approval now, and the thing to
       paste back into Tina Cloud's production URL field. Swap it for `drmontgomery.org` later; that's
       a one-field update, not a redo of any of this.
    4. Invite Brett as a Tina Cloud collaborator by email from the dashboard (separate from anything
       Cloudflare — no GitHub needed on his end).
  - **Brett's login experience, end to end**: he never touches GitHub or Git at all. James invites him
    by email from the Tina Cloud dashboard; Brett gets an email, sets a password (or uses a magic
    link), and from then on goes to `<the site's current URL>/admin`, logs in with that Tina Cloud
    account, picks an article from the collection list, edits it in the rich-text editor shown above,
    and clicks Save. Tina Cloud's backend commits the change to GitHub on his behalf; Cloudflare Workers
    Builds then rebuilds and redeploys the live site the same way it already does for any other push to
    `main` — nothing new on that side. (See the Cloudflare Access note under Development, though —
    it's scoped to `/admin/suggestions` specifically, not `/admin/*`, precisely so Brett does NOT hit a
    second login prompt before Tina's own when he goes to `/admin` to edit content.)
  - **Admin location**: `/admin` on whatever the site's current URL is — the `*.workers.dev` preview
    now, `drmontgomery.org` later — since it's a path in the same build output, not a separate domain or
    hosting setup.
- **Cloudflare Workers** (with static assets — free tier) for hosting, replacing what was originally
  planned as Cloudflare Pages. Cloudflare's dashboard now defaults new projects to a unified
  Workers-plus-static-assets model rather than the classic Pages "Connect to Git" flow (confirmed by
  hitting this directly: the dashboard offered a "Create a Worker" flow with no Pages option and no
  "build output directory" field at all). Functionally this project doesn't need anything Pages had
  that Workers lacks — one Worker script (`worker/index.ts`) handles the handful of dynamic routes and
  serves everything else straight from the static build via an `assets` binding, configured in
  `wrangler.jsonc`:
  - `"assets": { "directory": "./dist", "binding": "ASSETS", "run_worker_first": ["/api/*",
    "/admin/suggestions"] }` — only those two path patterns are routed into the Worker; everything
    else (including `/admin/index.html`, TinaCMS's own static bundle, which happens to share the
    `/admin` prefix) is served directly as a static file and never touches Worker code.
  - Cloudflare Pages Functions had a zero-config convention where any file under `functions/` at the
    project root auto-routed to a matching URL path. That convention **does not exist** under plain
    Workers — there's exactly one entry point, and every dynamic route has to be wired to it by hand.
    That's what `worker/index.ts` does: a single `fetch` handler that checks `url.pathname` and
    dispatches to `worker/handlers/suggest-topic.ts`, `worker/handlers/testimonial.ts`, or
    `worker/handlers/admin-suggestions.ts`, falling through to `env.ASSETS.fetch(request)` for
    everything else. (`worker/lib/*.ts` holds the shared `Env`/`StoredSuggestion`/`StoredTestimonial`
    types and the `testimonial:` KV key-prefix constant used to tell the two entry kinds apart within
    one namespace.)
  - Both handlers need a KV namespace bound as **`SUGGESTIONS`** — declared directly in
    `wrangler.jsonc`'s `kv_namespaces` array (id must be a real namespace before deploying; see
    Development section for the exact one-time steps). This is a meaningful difference from the old
    Pages Functions setup: KV bindings used to be a dashboard step (Settings → Functions → KV namespace
    bindings); under Workers with `wrangler.jsonc`, the binding is version-controlled config that
    Cloudflare provisions automatically on deploy — there is no separate dashboard KV-binding step.
- **Pagefind** for site search — static index built at `npm run build` time
  (`astro build && pagefind --site dist`), queried client-side on `/search`. No server/Function needed.
- Domain: drmontgomery.org (owned). The .com is a different physician — cannot use it.
- Content stored as Markdown in the repo (portable, no lock-in).

## Build sequence
1. Scaffold Astro project. ✅ Done.
2. Build ONE page (homepage) fully themed + deploy to Cloudflare to prove the pipeline end-to-end and
   sanity-check that the theme reads as intentional, not generic. ✅ Done (originally deployed via
   Cloudflare Pages; the project has since migrated to the Workers-plus-static-assets model — see
   Stack & hosting above — but the original pipeline-proving goal of this step still stands).
3. Migrate existing content into Markdown (with the mechanical copy-edit pass). ✅ Done.
4. Add interactive features last. 🔄 In progress — see build order under Features above.

## Notes
- The current live site is on WordPress.com; content will be migrated off it.
- Verify current prices/tools rather than assuming; don't rely on stale memory for pricing or versions.

## Development
When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

**Search (`/search`) needs at least one prior `npm run build`** — Pagefind's index only exists once
that's run (generated into `dist/pagefind/` by the `pagefind` CLI chained onto that script).
`astro.config.mjs` has a small dev-only middleware that serves `dist/pagefind/` under `/pagefind/`
during `npm run dev` too, so the normal dev workflow works for testing search — but if `dist/pagefind/`
has never been generated (fresh clone, or `dist/` was deleted), full-text results won't show until
`npm run build` runs at least once. Content edits after that build go stale in the search index until
the next build; that's expected, not a bug — re-run `npm run build` to refresh it.

**Testing the Worker locally (Suggest-a-topic, Testimonials, admin)** — plain `astro dev`/`astro
preview` don't run `worker/` at all (that's Cloudflare's own edge runtime, not Astro's, and Pages
Functions' old `functions/`-directory auto-routing doesn't exist under plain Workers either — see
Stack & hosting). Use:

```
npm run dev:worker
```

This runs `astro build && wrangler dev`, which builds the static site fresh and then serves it AND
`worker/index.ts` together via `wrangler dev`, with a local (sqlite-backed, not real Cloudflare)
`SUGGESTIONS` KV store that persists across restarts in `.wrangler/state/` — no Cloudflare account
needed for local testing, and nothing touches production KV. Verified end-to-end this way: real POSTs
to `/api/suggest-topic` and `/api/testimonial`, honeypot fill correctly produces zero KV writes,
`/admin/suggestions` GET lists entries and its approve/reject buttons correctly flip `status` in KV,
and — importantly — a **production** TinaCMS build (`TINA_CLIENT_ID=... TINA_TOKEN=...
npx tinacms build`, real credentials, not the `--local --skip-cloud-checks` dev shortcut) still serves
correctly at `/admin/` alongside all of it, confirming `run_worker_first`'s narrow scope
(`["/api/*", "/admin/suggestions"]`) really does leave Tina's bundle as a plain static file.

**One-time Cloudflare setup required before deploying** (KV namespace creation can be done from the
CLI; the rest needs dashboard access):
1. **Create the real KV namespace**: `npx wrangler kv namespace create SUGGESTIONS` (or Cloudflare
   dashboard → Workers & Pages → KV → Create a namespace). Copy the id it returns into
   `wrangler.jsonc`'s `kv_namespaces[0].id`, replacing the `"REPLACE_ME"` placeholder, then commit that
   change. Unlike the old Pages Functions setup, there is no separate dashboard "KV namespace bindings"
   step — the binding lives in `wrangler.jsonc` and Cloudflare provisions it automatically on deploy.
2. **Create the Workers project and connect it to GitHub** (this account's dashboard defaults to a
   unified "Create a Worker" flow rather than the older Pages "Connect to Git" flow — confirmed by
   hitting it directly, not assumed). Exact field values for that flow:
   - **Project name**: `drmontgomery` (matches `wrangler.jsonc`'s `"name"`; not load-bearing if it
     differs, but keeping them the same avoids confusion later).
   - **Build command**: `npm run build` (runs `tinacms build && astro build && pagefind --site dist` —
     the full production pipeline, not just `astro build`).
   - **Deploy command**: leave the pre-filled `npx wrangler deploy` as-is — this is what actually
     pushes the Worker script plus the `dist/` static assets, and reads `wrangler.jsonc` for the
     `assets`/`kv_namespaces` config.
   - **Builds for non-production branches**: optional; leave unchecked for now (nothing currently
     depends on preview-branch deploys). If turned on later, its pre-filled
     `npx wrangler versions upload` is the correct command for previews — don't change it.
   - **Path**: leave the pre-filled `/` — the repo root, where `wrangler.jsonc`/`package.json` live.
   - **API token**: this is Cloudflare's OWN build-system credential — the thing that lets Cloudflare's
     CI runner execute `wrangler deploy` against this account. It is not an app secret and nothing in
     this repo ever sees it. Click **Create new token** and pick Cloudflare's **"Edit Cloudflare
     Workers"** template specifically (scoped to Workers Scripts:Edit, Workers KV Storage:Edit, Workers
     Routes:Edit, plus read-only account/zone access) — do NOT use a Global API Key or an "all
     resources" token; the Workers-edit template is the least-privileged option that still lets
     `wrangler deploy` write the Worker script and the KV binding it needs.
   - **Variable name / Variable value (+ Encrypt)**: this is where `TINA_CLIENT_ID` and `TINA_TOKEN` go
     (confirmed — these are build-time-only values `tinacms build` reads via `process.env`, per
     `tina/config.ts`; they are separate from any later runtime "Settings → Variables & Secrets" the
     Worker itself might use). Add two entries: `TINA_CLIENT_ID` = the Client ID from Tina Cloud, and
     `TINA_TOKEN` = the Read-Only Token from Tina Cloud with **Encrypt checked** (it's the more
     sensitive of the two, even though it's a read-only content token, not a write credential).
3. **Cloudflare Access on `/admin/suggestions`** (not `/admin/*`): Zero Trust dashboard → Access →
   Applications → Add an application → Self-hosted → Application domain: the site's current URL
   (`*.workers.dev` for now, `drmontgomery.org` later), path `/admin/suggestions` → add a policy (e.g.
   "Admins") → Include → Emails → list yours and Brett's exact email addresses → Save. Scoping this to
   `/admin/suggestions` specifically — rather than the whole `/admin/*` prefix, which was the earlier
   plan before this Worker restructure — is deliberate and resolves what was previously an open
   question: TinaCMS's admin bundle lives at `/admin/index.html`/`/admin/`, the SAME prefix, and a
   `/admin/*` Access policy would gate both, forcing Brett through Cloudflare's email+one-time-code
   prompt AND THEN Tina Cloud's own login back to back. Since `wrangler.jsonc`'s `run_worker_first` only
   ever routes `/admin/suggestions` into the Worker (not `/admin/*`), scoping Access the same way means
   Tina's own login stays the only gate on the CMS, while the suggestions/testimonials admin view still
   gets its own separate protection.

Documentation: https://docs.astro.build
- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
