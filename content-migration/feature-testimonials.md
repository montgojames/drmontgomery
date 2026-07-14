Build the Testimonials feature from CLAUDE.md — patients submit, Brett
moderates and manually approves before anything goes live. Reuse the same
architecture as Suggest-a-topic (Cloudflare KV + the existing protected admin
page) rather than building new infrastructure.

## Where it lives
A small section on the About page — NOT a top-level nav item. Keeps this in
line with the site's 90/10 education-first ratio from CLAUDE.md. Something
like a "What patients say" section with a few approved testimonials shown,
plus a way to leave one.

## Submission form
- **Display name** (optional) — placeholder text guiding toward "First name
  + last initial, e.g. 'Sarah M.' — or leave blank to stay anonymous."
  Not required, not rigidly enforced to that format, just nudged toward it
  via the placeholder.
- **Comment** (required) — the testimonial text itself.
- **Email** (optional) — private, never published, for Brett's own records/
  follow-up only. Same pattern as the Suggest-a-topic form.
- Include a honeypot field, same spam deterrent as Suggest-a-topic.

## Disclaimer — must be visible directly on the form, not just linked elsewhere
Show this text prominently right above or beside the submit button, not
buried in a footer or separate page:

"Before you submit: This is one-way — Dr. Montgomery can't respond to your
comment here. Everything submitted is reviewed only after he's off-service,
so nothing you share affects your care while you're in the hospital."

## Backend
- Cloudflare Function handles the POST, validates (comment non-empty, email
  plausible if provided, honeypot empty), stores in Cloudflare KV as
  "pending" — same KV setup already used for Suggest-a-topic, add a
  testimonials entry type alongside it rather than a separate system.

## Admin view
- Extend the existing protected admin page (or add a second tab/section to
  it) rather than building a new protected route from scratch.
- Lists pending testimonials: name (or "Anonymous"), comment text, email if
  provided, submitted date.
- Brett/James can mark each one "approved" or "rejected" — this just updates
  its status in KV, it does NOT publish it to the live site automatically.
  Approving is a signal to you that it's ready to be added manually.

## Publishing (manual, on purpose)
Once something is marked "approved" in the admin view, it's your job (via
Claude Code, in a separate step) to actually add it to the About page's
testimonials section as real content. No auto-publish path — confirm this is
built so there's no way for an approved KV entry to appear on the live site
without that manual step.

## Confirmation state
After a successful submission, show a confirmation message in place of the
form (e.g. "Thank you — this will be reviewed by Dr. Montgomery.") rather
than silently clearing the fields.
