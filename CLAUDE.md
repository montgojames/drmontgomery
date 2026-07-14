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

## Layout conventions
- **`.prose-column` (global.css) is the site's ONE shared narrow reading column** (~68 characters at
  body text size, a fixed rem value — not `ch`, which is relative to each element's own font-size and
  would give a heading a different pixel width than body text). Wrap a page's text content (headings,
  paragraphs, lists, forms, dividers meant to align with body copy) in a single
  `<div class="prose-column">` once per contiguous block. Everything inside — including element types
  that don't exist yet — gets the correct width and left/right edge automatically, by ordinary
  block-flow inheritance, not by being individually matched against a selector list.
  - **Why this exists**: earlier, the same "narrow column" max-width was hand-copied onto a growing
    list of selectors, independently, in six different files. Every one of those drifted out of sync
    at least once — the page h1, the accent-rule divider, in-body h2/h3, the Medical Conditions topic
    list, and the About page photo were each fixed individually as the bug was spotted on that one
    element. `.prose-column` replaced all six copies; there is nothing left to remember to wire in.
  - Images/figures meant to span the wider `.container` instead (there are far fewer of these than
    text elements, which is why they opt OUT rather than text opting in) stay outside the
    `.prose-column` wrapper, as its sibling — see `TopicLayout.astro`'s figure slot.
  - **When adding spacing to a `.prose-column` usage, use longhand `margin-top`/`margin-bottom`
    only.** A margin shorthand (e.g. `margin: 2rem 0 0`) resets `margin-left`/`margin-right` too,
    silently overwriting `margin-inline: auto` and putting the block back at the wide container's
    left edge — this exact mistake caused two of the regressions above.
  - If a bug like this shows up again on some element, that's a sign it was rendered outside a
    `.prose-column` entirely (or beside one via its own now-unnecessary width rule) — fix the
    structure, not by adding one more selector.

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
- **Comment/review submission form (Testimonials)** ✅ Done — patients submit; owner moderates and
  posts after off-service review. Hospital policy confirmed OK by Brett (no longer a blocker). Lives as
  a "What patients say" section on the About page (`TestimonialsSection.astro`, rendered via a new
  `after-body` named slot on `TopicLayout.astro`) — NOT a top-level nav item, keeps the 90/10
  education-first ratio. Approved testimonials shown there come from a plain static array,
  `src/data/testimonials.ts` (empty until Brett approves the first one) — the page never reads KV
  directly.
  - Form: display name (optional — placeholder nudges toward "First name last initial, e.g. 'Sarah
    M.'" without enforcing it), comment (required), email (optional, private, never published), same
    honeypot pattern as Suggest-a-topic. The one-way/off-service disclaimer sits directly above the
    submit button inside the form itself (not linked elsewhere) — required verbatim wording, see
    `TestimonialsSection.astro`.
  - Backend genuinely reuses Suggest-a-topic's infrastructure, not a parallel system: same
    `functions/api/testimonial.ts` → same `SUGGESTIONS` KV namespace, distinguished from topic
    suggestions purely by a `testimonial:` key prefix (`functions/_lib/testimonials.ts`) — no second KV
    namespace. New submissions are always stored with `status: 'pending'`.
  - Admin view is the SAME `/admin/suggestions` page extended with a second table + approve/reject
    forms, not a new route. Approve/reject is a plain (no-JS) form POST back to that same URL
    (Post/Redirect/Get), and only ever flips the KV entry's `status` field.
  - **No auto-publish path, confirmed by testing**: approving a testimonial in `/admin/suggestions`
    does not touch `src/data/testimonials.ts` — verified the About page still shows the empty state
    immediately after approving an entry in KV. Adding an approved testimonial to the live page is a
    separate, manual edit to that data file, on purpose.
  - The disclosure-form CSS (fields, honeypot, error box, confirmation message) is shared between this
    and Suggest-a-topic via `.disclosure*` classes in `global.css`, promoted there once this became the
    second use of the same pattern — not copy-pasted a second time.
- **"Suggest a topic"** ✅ Done — feeds the writing queue. Entry point is a button on the Medical
  Conditions page (`#suggest-topic-toggle`) that discloses a form, not an always-visible one, so the
  page's default length is unchanged. Topic (required) + email (optional, clearly labeled) + a
  CSS/ARIA-hidden honeypot field. Submits via `fetch` to a Cloudflare Pages Function
  (`functions/api/suggest-topic.ts`), which validates (topic non-empty, email format if present,
  honeypot must be empty — a filled honeypot gets a fake-success response so bots don't learn they
  were caught) and writes to a Cloudflare KV namespace bound as `SUGGESTIONS`. Successful submit
  replaces the form with a confirmation message in place, not a silent field-clear.
  - **Admin view**: `functions/admin/suggestions.ts` at `/admin/suggestions` — not linked in nav or
    sitemap, deliberately unstyled beyond basic readability (only audience is Brett/James). Lists every
    KV entry most-recent-first (KV keys are prefixed with a millis-epoch timestamp specifically so this
    works without needing to fetch-then-sort). **Protected by Cloudflare Access (Zero Trust)**,
    configured on the Cloudflare dashboard against the `/admin/*` path — not custom auth code. See
    Development section below for the exact one-time dashboard setup (KV binding + Access) required
    before this works in production.
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
  Testimonials ✅ → Email signup. Suggest-a-topic and Testimonials both ended up built ahead of Email
  signup, out of the original order — each was ready and requested first; the ordering was always a
  rough sequencing guide, not a strict gate.
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
- **Astro** (static site generator) + **Git-based CMS** (Decap or TinaCMS — decide at build time) so the
  owner edits articles without code.
- **Cloudflare Pages** (free tier) for hosting; interactive bits via Cloudflare Functions (free tier).
  - Functions live in `functions/` at the project root — Cloudflare Pages' own convention, separate
    from Astro's build entirely. The site stays fully static (`output: 'static'`); only these specific
    routes run server-side, at request time, on Cloudflare's edge.
  - `functions/api/suggest-topic.ts` + `functions/api/testimonial.ts` (both POST) write to the same
    KV namespace bound as **`SUGGESTIONS`**, distinguished by key prefix (testimonials use
    `testimonial:`, see `functions/_lib/testimonials.ts`). `functions/admin/suggestions.ts` (GET +
    POST, Access-protected) reads/lists both and handles testimonial approve/reject. `functions/_lib/`
    holds shared types only (leading underscore means Cloudflare doesn't treat it as a route). See
    Development section for the exact dashboard steps.
- **Pagefind** for site search — static index built at `npm run build` time
  (`astro build && pagefind --site dist`), queried client-side on `/search`. No server/Function needed.
- Domain: drmontgomery.org (owned). The .com is a different physician — cannot use it.
- Content stored as Markdown in the repo (portable, no lock-in).

## Build sequence
1. Scaffold Astro project. ✅ Done.
2. Build ONE page (homepage) fully themed + deploy to Cloudflare Pages to prove the pipeline end-to-end
   and sanity-check that the theme reads as intentional, not generic. ✅ Done.
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

**Testing Cloudflare Functions locally (Suggest-a-topic)** — plain `astro dev`/`astro preview` don't
run `functions/` at all (that's Cloudflare Pages' own runtime, not Astro's). Use:

```
npm run dev:functions
```

This builds the site and runs `wrangler pages dev dist --kv SUGGESTIONS`, which serves the real static
output AND the Functions together, with a local (in-memory, not real Cloudflare) `SUGGESTIONS` KV
namespace auto-created for you — no Cloudflare account needed for local testing. Submissions made this
way only persist for that session; nothing touches production KV.

**One-time Cloudflare dashboard setup required before Suggest-a-topic works in production** (nothing
here can be done from the repo/CLI — this needs dashboard access):
1. **KV namespace + binding**: Cloudflare dashboard → Workers & Pages → KV → Create a namespace (any
   name, e.g. `drmontgomery-suggestions`) → then on the Pages project: Settings → Functions → KV
   namespace bindings → Add binding → Variable name **`SUGGESTIONS`** → select that namespace. Do this
   for both the Production and Preview environments (two separate binding entries) if preview
   deployments should also work.
2. **Cloudflare Access on `/admin/*`**: Zero Trust dashboard → Access → Applications → Add an
   application → Self-hosted → Application domain: `drmontgomery.org`, path `/admin/*` → add a policy
   (e.g. "Admins") → Include → Emails → list yours and Brett's exact email addresses → Save. Visiting
   `/admin/suggestions` will then prompt for an email + one-time code before the page loads, gated
   entirely by Cloudflare at the edge — no code in this repo implements or bypasses it. (This turned
   out to have no real setup friction — it's a few clicks in a dashboard already used for Pages hosting
   — so no fallback auth scheme was needed.)

Documentation: https://docs.astro.build
- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
