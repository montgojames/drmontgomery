# Content Migration Notes — drmontgomery.org

## Latest update: external links sourced for the 14 unwritten topics

All 14 `[external link] — coming soon` topics on the Medical Conditions page now
have real URLs, prioritized Mayo Clinic → Cleveland Clinic → NIH per James's
instruction. Full list with links is in `medical-conditions/_index-intro.md`.

Two are imperfect matches — flagged there in detail, summarized here:
- **Deconditioning:** no major health system has a standard disease-library page
  for this (it's not usually diagnosed as its own condition). Used a legitimate
  Mayo Clinic Press article instead of their usual syc-xxxxx format.
- **Prognostication:** best available patient-facing page (NCI) is framed around
  cancer specifically, not prognosis in general. Brett's own Hospice page already
  covers the general concept — worth deciding whether this still needs its own
  external link or should point back to Hospice instead.

Gallbladder / Pancreatitis (#15) gets two links since it's really two conditions
bundled under one topic name.


## Latest update: page teaser lines

The 9 individual pages each render a one-line "teaser" under the H1, above the
divider, before the article body starts (see the Hospitalist Defined screenshot
James shared). Claude Code had generated placeholder text for this line during
the build. Per James: **remove the generated text, replace with Brett's own
words where they exist, keep the formatting exactly as-is.**

Added a `teaser:` frontmatter field to 7 of the 9 pages, using the same "Option
A" quotes surfaced earlier (each one is something Brett actually wrote as a
homepage blurb on the old site, one per subtopic — not from the article body
itself, and not AI-generated).

**Two pages have no Brett quote available**, since neither existed as a
homepage item on the old site: **Hospice / End-of-Life** and **Advance
Directives**. Both now have `teaser: ""` with a comment explaining why, rather
than an invented line. The generated placeholder text should still come out of
these two per James's instruction — they'll just have an empty teaser until
Brett writes one (or you decide to hide the teaser line entirely on pages
where it's blank, which might look cleaner than an empty gap).

The homepage's own 9 cards are explicitly **not** part of this change — James
confirmed those stay as they currently are.

Note: `teaser` is a guess at the field name Claude Code should use — I don't
have visibility into how the template actually implements that line (frontmatter
prop, hardcoded per component, etc.). Worth having Claude Code map it to
whatever's really there rather than assuming `teaser` is correct.


Source: live WordPress site, fetched July 12, 2026. Scope: mechanical copy-edit only
(typos, grammar, punctuation, formatting) — no clinical content was added, removed,
or rephrased for meaning per CLAUDE.md's non-negotiable rule.

## Resolved (this pass)

1. **Deconditioning / Dementia broken links.** No longer treated as internal
   articles. They're now part of the full topic list on the Medical Conditions
   page, tagged `[external link]`, same as the 12 topics that never had content.
   See item below — this is a change from the original CLAUDE.md plan.

2. **"Advance directive" (no -d).** Standardized throughout — the three instances
   in `resuscitation.md` that read "advanced directive(s)" now read "advance
   directive(s)."

3. **About page CV truncation.** Confirmed "for Chippenham" is the correct
   completion — no further action.

## ⚠️ Needs a CLAUDE.md update

The Medical Conditions section of CLAUDE.md currently says:

> **Medical Conditions** (article library; only publish written articles, hide placeholders)

The plan has changed: **show the full topic list, always.** Written topics link to
an internal article. Unwritten topics (14 total, now including Deconditioning and
Dementia) display with an `[external link]` tag and should eventually point to an
outside source like Mayo Clinic rather than staying hidden. See
`medical-conditions/_index-intro.md` for the full ordered list and status of each.

This is a real change to a locked decision, not just a content edit — worth
updating CLAUDE.md itself (via Claude Code) so it doesn't drift out of sync with
what's actually being built. Suggested replacement line:

> **Medical Conditions** (article library; every topic Brett listed is shown —
> written topics link internally, unwritten topics show as `[external link]`
> pointing to a vetted outside source until Brett writes his own page)

## Still open

- Need actual external URLs for the 14 `[external link]` topics (Mayo Clinic or
  similar) — not sourced yet.
- Once those are picked, the topic list in `_index-intro.md` should probably move
  from a markdown table into real content-collection entries (topic + target URL)
  so the page can render actual `<a>` tags — depends on how the collection schema
  ends up shaped at build time.

## Structural changes made (beyond pure mechanical editing)

- **Hospice moved out of Medical Conditions into Decisions & Next Steps**, per
  CLAUDE.md — the article itself is unchanged, just recategorized.
- **Healthcare Team page had duplicated content** — the original repeats the
  Nurse/CNA/Hospitalist/Consultant/Radiologist definitions twice in slightly
  different wording (bullet list, then prose paragraphs). Merged into one version,
  keeping the bullet-list form as primary. The prose version had one extra detail
  not in the bullets — that hospitalists "guide patients and their families through
  the hospitalization and transition of care at discharge" — worth confirming
  that's not lost information you want kept somewhere.
- **Discharge Planning page also had a duplicated "who does what" section** near
  the end. Merged into one for the same reason. Also dropped an orphaned aside —
  "make this a full page check list patient's can fill out" — read like a
  note-to-self about formatting rather than patient-facing content. Note this does
  support the "printable articles" feature already planned in CLAUDE.md.

## Not migrated as full articles

- The 12 originally-unlinked Medical Conditions topics, plus Deconditioning and
  Dementia (14 total) — no written content exists for any of them. Now visible on
  the topic list as `[external link]` per the updated plan above, rather than
  hidden.
- The default "Hello World!" WordPress starter post — not real content, skipped.

## Frontmatter

Used minimal placeholder frontmatter (title, section, order, and `draft: true`
where relevant) since I don't have visibility into the actual Astro content
collection schema set up during scaffolding. Worth a quick check against the real
project so field names match before dropping these into the repo.
