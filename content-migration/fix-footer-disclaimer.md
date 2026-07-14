Reversing the previous instruction on this — keep both disclaimer sentences
in the footer, on every page, permanently. Decided against making the
"call 911" line page-specific: that requires an ongoing judgment call every
time a new page gets added, and a future page silently missing it is a worse
risk than a slightly longer footer. Global and guaranteed beats "relevant
pages only."

(CLAUDE.md has already been updated separately to reflect this — no need to
edit it as part of this task.)

## What was actually wrong (styling, not content)
The bold white text wrapping badly across two lines mid-sentence was a
typography problem, not a reason to cut content. Fix:

- Two sentences, deliberately stacked as two short lines — not one run-on
  sentence left to wrap wherever the browser decides:
  Line 1: "This is education, not medical advice."
  Line 2: "If this is an emergency, call 911."
- Drop the bold weight — regular weight, reading as quiet legal text, not a
  heading or a warning banner competing with real headings elsewhere on the
  site.
- Reduce the color contrast against the dark green background — bright white
  bold is too loud for footer text. Use something closer to the muted tone
  already used for the copyright line below it, so all three lines (two
  disclaimer lines + copyright) read as one cohesive quiet footer unit.

Don't touch anything else in the footer beyond this content/styling fix.
