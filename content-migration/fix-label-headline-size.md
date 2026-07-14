One specific fix — the small-caps label font-size must be LARGER than the
big serif headline font-size next to it. This didn't actually happen in the
last pass (screenshot still shows "DURING YOUR STAY" small and "What to
expect while you're here" dominant) — being explicit this time since vague
"increase/decrease" wording apparently wasn't enough to produce a visible
change.

Applies to all 3 section header pairs:
1. "DURING YOUR STAY" label ↔ "What to expect while you're here" headline
2. "DECISIONS & NEXT STEPS" label ↔ "Planning for what comes next" headline
3. "MEDICAL CONDITIONS" label ↔ "Look up a specific condition" headline

For each pair: increase the label's font-size and/or decrease the headline's
font-size until the label is literally larger in font-size than the
headline. Not just closer in size — larger. Check the actual rendered
font-size values after the change to confirm the label > headline
relationship actually holds, don't just eyeball it.

Leave everything else alone for now (card text, spacing, nav bar font) — those
are separate fixes coming one at a time after this one is confirmed correct.
