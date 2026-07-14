The mobile headshot next to "—Brett Montgomery, MD" is now too small — it
shrunk down to roughly the attribution text's line height, which reads as a
tiny icon rather than a recognizable photo of a person. Previous instruction
to size it that small was wrong; correcting it here.

## Fix
Increase the photo size noticeably — a good target is roughly 2.5-3x the
current size, enough that it clearly reads as a portrait photo, not an
avatar/icon. It should still be meaningfully smaller than the section photos
further down the page (During Your Stay, etc.) and should still sit beside
the attribution line as a byline pairing, not stacked above it or beside the
full quote — that structural layout from the last fix is correct, this is
sizing only.

Keep the same 3:4 rounded-rectangle treatment. Check that increasing the
size doesn't reintroduce the horizontal overflow issue from earlier — confirm
at a narrow mobile width that the attribution line + larger photo still fit
cleanly without pushing the layout wider than the viewport.
