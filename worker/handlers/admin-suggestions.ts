/// <reference types="@cloudflare/workers-types" />

// Internal-only admin view — for Brett/James, not linked anywhere in the
// site nav or sitemap. Protection is Cloudflare Access (Zero Trust),
// configured on the Cloudflare dashboard against this specific path, NOT
// in this file — see CLAUDE.md for the exact setup steps. Deliberately
// unstyled beyond basic readability; the only audience is the two of you.
//
// Lists BOTH suggested topics and testimonials — one KV namespace
// (SUGGESTIONS), partitioned by the key prefix testimonials use (see
// worker/lib/testimonials.ts), not two separate admin routes.
//
// Approve/reject here ONLY flips a status flag in KV — it does NOT publish
// anything to the live site. Approved testimonials still need to be added
// to src/data/testimonials.ts by hand, in a separate step, before they
// appear on /about/. There is no code path from this admin action to the
// public site.

import type { Env, StoredSuggestion } from '../lib/suggestions';
import { TESTIMONIAL_KEY_PREFIX, type StoredTestimonial, type TestimonialStatus } from '../lib/testimonials';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

async function renderPage(kv: KVNamespace): Promise<string> {
  // KV list() returns up to 1000 keys per call, uncursored here — fine for
  // how few submissions either form will realistically get; revisit if
  // this ever needs pagination.
  const list = await kv.list();
  const suggestionKeys = list.keys.filter((k) => !k.name.startsWith(TESTIMONIAL_KEY_PREFIX));
  const testimonialKeys = list.keys.filter((k) => k.name.startsWith(TESTIMONIAL_KEY_PREFIX));

  const suggestions = (
    await Promise.all(
      suggestionKeys.map(async (k): Promise<StoredSuggestion | null> => {
        const raw = await kv.get(k.name);
        return raw ? (JSON.parse(raw) as StoredSuggestion) : null;
      })
    )
  )
    .filter((e): e is StoredSuggestion => e !== null)
    .reverse(); // chronological-ascending keys -> reverse for most-recent-first

  const testimonials = (
    await Promise.all(
      testimonialKeys.map(async (k): Promise<{ key: string; entry: StoredTestimonial } | null> => {
        const raw = await kv.get(k.name);
        return raw ? { key: k.name, entry: JSON.parse(raw) as StoredTestimonial } : null;
      })
    )
  )
    .filter((e): e is { key: string; entry: StoredTestimonial } => e !== null)
    .reverse();

  const suggestionRows = suggestions
    .map(
      (s) => `
        <tr>
          <td>${escapeHtml(s.topic)}</td>
          <td>${s.email ? escapeHtml(s.email) : '—'}</td>
          <td>${escapeHtml(formatDate(s.submittedAt))}</td>
        </tr>`
    )
    .join('');

  const testimonialRows = testimonials
    .map(({ key, entry }) => {
      const actions =
        entry.status === 'pending'
          ? `
            <form method="POST" class="inline-form">
              <input type="hidden" name="key" value="${escapeHtml(key)}" />
              <input type="hidden" name="action" value="approve" />
              <button type="submit" class="approve-btn">Approve</button>
            </form>
            <form method="POST" class="inline-form">
              <input type="hidden" name="key" value="${escapeHtml(key)}" />
              <input type="hidden" name="action" value="reject" />
              <button type="submit" class="reject-btn">Reject</button>
            </form>`
          : '';

      return `
        <tr>
          <td>${entry.name ? escapeHtml(entry.name) : '<em>Anonymous</em>'}</td>
          <td>${escapeHtml(entry.comment)}</td>
          <td>${entry.email ? escapeHtml(entry.email) : '—'}</td>
          <td>${escapeHtml(formatDate(entry.submittedAt))}</td>
          <td class="status status-${entry.status}">${entry.status}</td>
          <td class="actions">${actions}</td>
        </tr>`;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Admin — Suggestions &amp; Testimonials</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 70rem; margin: 2rem auto; padding: 0 1rem; color: #111; }
    h1 { font-size: 1.5rem; margin-top: 2.5rem; }
    h1:first-of-type { margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #ccc; vertical-align: top; }
    th { border-bottom: 2px solid #888; }
    .count { color: #555; }
    .inline-form { display: inline; }
    .actions { white-space: nowrap; }
    .approve-btn, .reject-btn { font: inherit; padding: 0.3rem 0.6rem; margin-right: 0.4rem; cursor: pointer; }
    .approve-btn { background: #1f3d2e; color: #fff; border: 1px solid #1f3d2e; border-radius: 4px; }
    .reject-btn { background: #fff; color: #111; border: 1px solid #999; border-radius: 4px; }
    .status { text-transform: capitalize; }
    .status-approved { color: #1f3d2e; font-weight: 700; }
    .status-rejected { color: #888; }
  </style>
</head>
<body>
  <h1>Suggested Topics</h1>
  <p class="count">${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'}, most recent first.</p>
  <table>
    <thead><tr><th>Topic</th><th>Email</th><th>Submitted</th></tr></thead>
    <tbody>${suggestionRows || '<tr><td colspan="3">No suggestions yet.</td></tr>'}</tbody>
  </table>

  <h1>Testimonials</h1>
  <p class="count">${testimonials.length} submission${testimonials.length === 1 ? '' : 's'}, most recent first. Approving here only flags it as ready — it still needs to be added to the About page by hand.</p>
  <table>
    <thead><tr><th>Name</th><th>Comment</th><th>Email</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${testimonialRows || '<tr><td colspan="6">No testimonials yet.</td></tr>'}</tbody>
  </table>
</body>
</html>`;
}

export async function handleAdminSuggestionsGet(env: Env): Promise<Response> {
  const html = await renderPage(env.SUGGESTIONS);
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

// Approve/reject a testimonial. Plain form POST (no client JS needed) —
// Post/Redirect/Get back to this same URL so a page refresh doesn't
// resubmit the action. Only ever touches keys under TESTIMONIAL_KEY_PREFIX
// and only ever changes `status` — never writes new content, never touches
// suggestions.
export async function handleAdminSuggestionsPost(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  const key = String(form.get('key') ?? '');
  const action = String(form.get('action') ?? '');

  const isValidAction = (a: string): a is Extract<TestimonialStatus, 'approved' | 'rejected'> =>
    a === 'approved' || a === 'rejected';

  const normalizedAction = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : '';

  if (key.startsWith(TESTIMONIAL_KEY_PREFIX) && isValidAction(normalizedAction)) {
    const raw = await env.SUGGESTIONS.get(key);
    if (raw) {
      const entry = JSON.parse(raw) as StoredTestimonial;
      entry.status = normalizedAction;
      await env.SUGGESTIONS.put(key, JSON.stringify(entry));
    }
  }

  return new Response(null, {
    status: 303,
    headers: { Location: '/admin/suggestions' },
  });
}
