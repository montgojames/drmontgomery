/// <reference types="@cloudflare/workers-types" />

// Backs the "Leave a testimonial" form in TestimonialsSection.astro (used
// on the About page). Routed to by worker/index.ts for
// POST /api/testimonial. Same shape as suggest-topic.ts — same
// SUGGESTIONS KV namespace, same honeypot handling — just a different
// stored entry type. New submissions are always "pending"; nothing here
// ever makes them appear on the live site (see admin-suggestions.ts for
// the approve/reject step, and CLAUDE.md for why publishing itself stays
// a separate manual step).

import type { Env } from '../lib/suggestions';
import { TESTIMONIAL_KEY_PREFIX, type StoredTestimonial } from '../lib/testimonials';

interface TestimonialPayload {
  name?: string;
  comment?: string;
  email?: string;
  website?: string; // honeypot — real users never see or fill this field
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_COMMENT_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleTestimonial(request: Request, env: Env): Promise<Response> {
  let body: TestimonialPayload;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid request body.' }, 400);
  }

  // Honeypot filled in -> a bot, not a real visitor. Respond as if it
  // succeeded (so it doesn't learn it was caught) but store nothing.
  if (body.website) {
    return jsonResponse({ ok: true }, 200);
  }

  const comment = (body.comment ?? '').trim();
  if (!comment) {
    return jsonResponse({ ok: false, error: 'Comment is required.' }, 400);
  }
  if (comment.length > MAX_COMMENT_LENGTH) {
    return jsonResponse({ ok: false, error: 'Comment is too long.' }, 400);
  }

  const name = (body.name ?? '').trim();
  if (name.length > MAX_NAME_LENGTH) {
    return jsonResponse({ ok: false, error: 'Name is too long.' }, 400);
  }

  const email = (body.email ?? '').trim();
  if (email && !EMAIL_RE.test(email)) {
    return jsonResponse({ ok: false, error: "That email address doesn't look right." }, 400);
  }

  const testimonial: StoredTestimonial = {
    name: name || null,
    comment,
    email: email || null,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };

  // Same chronological-prefix key scheme as suggest-topic.ts, just under
  // the testimonial: prefix so the admin view can tell entry types apart
  // by key alone without inspecting every value.
  const key = `${TESTIMONIAL_KEY_PREFIX}${Date.now().toString().padStart(15, '0')}-${crypto.randomUUID()}`;
  await env.SUGGESTIONS.put(key, JSON.stringify(testimonial));

  return jsonResponse({ ok: true }, 200);
}
