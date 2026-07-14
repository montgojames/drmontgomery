Build a dedicated Search page — new feature, not in the original plan, added
because the site will keep growing (more Medical Conditions articles over
time) and a way to find things directly will matter more as it does.

## Technical approach
Use Pagefind (or an equivalent build-time static search index) — this is a
static Astro site on Cloudflare Pages free tier, so search needs to run
entirely client-side against an index generated at build time. No backend,
no Cloudflare Function needed for this one.

## Page & navigation
- New page at /search (or similar), added to the main nav as "Search" — same
  text-label style as the existing 4 nav items (During Your Stay, Decisions
  & Next Steps, Medical Conditions, About). Don't make this an icon-only nav
  item; this audience needs obvious text labels, same rule as everywhere
  else on the site.
- Search input + a visible "Search" button. This is submit-based, NOT
  live-as-you-type — results only appear after the person presses Enter or
  taps the button. No instant/jumpy filtering while typing.
- Same accessibility rules as the rest of the site: large input field, big
  legible "Search" button (44x44px minimum tap target), results styled
  consistent with the Warm Editorial look (large type, generous spacing).

## What's searchable
Everything — During Your Stay, Decisions & Next Steps, and Medical
Conditions articles, plus About. Full-text (title + body content), not just
page titles.

## Medical Conditions results need special handling
Medical Conditions has two kinds of entries: internal articles (full page on
this site) and external-link topics (point out to Mayo Clinic/Cleveland
Clinic/NIH, per the [external link] system already built on the Medical
Conditions index page). Search results for Medical Conditions topics need to
visually distinguish between the two — reuse whatever visual treatment
already exists on the Medical Conditions index page for this (the "EXTERNAL
RESOURCE" badge style) so it's consistent, not a new pattern. A result for
an internal article should read as "read this on our site"; a result for an
external-link topic should read as "this links out" before the person taps
it, not after.

## Empty / no-results state
Handle the case where a search returns nothing — plain language, no dead
end. Something like "No results for '[query]'. Try a different word, or
browse Medical Conditions directly." with a link to the Medical Conditions
page.

Show me the result once it's built.
