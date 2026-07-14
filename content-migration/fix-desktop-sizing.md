Desktop homepage has too much unused space on the sides. Keep the vertical
card stacking as-is (not moving to a grid) — instead use the reclaimed width
to make everything bigger: larger images, bigger cards, larger text. This
also serves the accessibility goal already in CLAUDE.md (elderly audience,
err generous on size) — current sizing may be hard to read at desktop width.

## Container width
Increase the max-width of the homepage content container so the vertical
card stack has more room to work with — currently it's constrained to
roughly the same width you'd want on a laptop, leaving large empty margins
on a wide monitor.

## Scale up within that wider container
- Section photos (During Your Stay / Decisions & Next Steps / Medical
  Conditions images): larger — they should fill more of the additional width,
  not stay their current size while empty space just moves further out.
- Cards: wider to match, with more internal padding so they don't look like
  the same small card just stretched.
- Card text: increase both the card title and description font sizes. Also
  double check the section headlines (e.g. "What to expect while you're
  here") and body copy against CLAUDE.md's type guidance — err generous on
  size for this audience, on desktop as well as mobile.

## Scope
Desktop/wide-viewport only. Don't change mobile sizing — that's a separate
layout already addressed in earlier fixes and shouldn't be affected by this.

Apply consistently across all three homepage sections (During Your Stay,
Decisions & Next Steps, Medical Conditions) so they still feel like one
consistent design, not three different scales.
