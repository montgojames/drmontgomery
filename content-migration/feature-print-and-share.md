Build the "printable guides" feature from CLAUDE.md's feature list, plus a
companion Share button (new, added since it needs no backend): any article
can be cleanly printed, saved, or shared directly to someone else.

## Where it applies
Every article-type page: During Your Stay (4 pages), Decisions & Next Steps
(4 pages, including Advance Directives even though it's still empty/draft —
the button should exist there too so it's ready once Brett writes real
content), and every Medical Conditions article (9 now, more will be added
over time). Does NOT need to apply to: homepage, the Medical Conditions index/
topic-list page, or About.

## On-screen button
- Add a visible "Print this article" button/link on each article page.
- Minimum 44x44px tap target per our accessibility rule — this is for the same
  elderly, low-tech audience as everything else on the site, not a tiny icon
  someone has to hunt for.
- Triggers the browser's native print dialog (window.print() or equivalent) —
  no need for a custom PDF generation library. Browsers' print-to-PDF covers
  the "save to share" half of this feature already.
- Placement is your call for what fits the existing page layout, but it should
  be visible without scrolling past the article title.

## Share button (new — bundled in since it's zero-backend)
Add a "Share" button next to "Print this article" — same size/tap-target rule.
This isn't in the original feature list but fits the same need (getting an
article to someone else) and needs no backend, so it makes sense to build
alongside print rather than as a separate pass.
- Use the Web Share API (`navigator.share()`) where supported — this opens the
  device's native share sheet (text, email, WhatsApp, etc.), which the
  audience likely already knows from photos or texting.
- Fallback for browsers without Web Share API support (mainly desktop): a
  "Copy Link" button that copies the page URL to the clipboard, with a brief
  visible confirmation (e.g. "Link copied") since there's no OS-level
  confirmation to rely on.
- Share the specific article's URL and title — not a generic homepage link.
- Same page scope as print: During Your Stay, Decisions & Next Steps
  (including Advance Directives), and every Medical Conditions article.

## Print stylesheet (@media print)
- Hide entirely: nav bar, footer, homepage-style cards, any CTAs ("Learn
  more," "Browse conditions," etc.), the external-link icons/badges on Medical
  Conditions pages, and the "Print this article" / "Share" buttons themselves.
- Switch to black text on white background — the cream background and
  terracotta accent color waste ink and may not render well (or may not
  render at all) on a home printer.
- Keep the serif headline / sans-serif body type distinction from the Warm
  Editorial spec, but sized appropriately for print (probably smaller than
  the on-screen large-type treatment, since paper doesn't have the same
  low-vision/mobile constraints a phone screen does — use your judgment here).
- Show the full article title and section label (e.g. "During Your Stay")
  at the top of the printed page so a printed sheet is identifiable on its
  own, away from the site.
- For any internal links within article body text, consider showing the
  destination as visible text after the link (e.g. "Advance Directives
  (see: drmontgomery.org/decisions-next-steps/advance-directives)") since
  printed links aren't clickable — use judgment on whether this gets
  cluttered; skip it if it hurts readability more than it helps.
- Reasonable print margins, no orphaned/widowed headings at page breaks if
  easily avoidable.

Let me know once this is in and I'll take a look before we move to email
signup.
