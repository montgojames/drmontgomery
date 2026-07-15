/// <reference types="@cloudflare/workers-types" />

// Backs the "Suggest a topic" form on /medical-conditions/ (see that page's
// <script> for the fetch call). Routed to by worker/index.ts for
// POST /api/suggest-topic — see that file for why this is a plain function
// rather than a Cloudflare Pages Function (Pages' functions/ directory
// auto-routing doesn't exist under the unified Workers + static-assets
// model this project now deploys under).
//
// Requires a KV namespace bound as SUGGESTIONS (see wrangler.jsonc) — see
// CLAUDE.md for the exact dashboard steps to create/bind it.

import type { Env, StoredSuggestion } from '../lib/suggestions';

interface SuggestionPayload {
  topic?: string;
  email?: string;
  website?: string; // honeypot — real users never see or fill this field
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TOPIC_LENGTH = 500;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleSuggestTopic(request: Request, env: Env): Promise<Response> {
  let body: SuggestionPayload;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid request body.' }, 400);
  }

  // Honeypot filled in -> a bot filling every field blindly, not a real
  // visitor (the field is invisible and unreachable by tab for humans).
  // Respond as if it succeeded, so the bot doesn't learn it was caught and
  // try to adapt, but don't store or process anything further.
  if (body.website) {
    return jsonResponse({ ok: true }, 200);
  }

  const topic = (body.topic ?? '').trim();
  if (!topic) {
    return jsonResponse({ ok: false, error: 'Topic is required.' }, 400);
  }
  if (topic.length > MAX_TOPIC_LENGTH) {
    return jsonResponse({ ok: false, error: 'Topic is too long.' }, 400);
  }

  const email = (body.email ?? '').trim();
  if (email && !EMAIL_RE.test(email)) {
    return jsonResponse({ ok: false, error: "That email address doesn't look right." }, 400);
  }

  const suggestion: StoredSuggestion = {
    topic,
    email: email || null,
    submittedAt: new Date().toISOString(),
  };

  // Millis-since-epoch prefix keeps KV's lexicographic key listing in
  // chronological order, so the admin view can reverse it for
  // most-recent-first without fetching every value first just to sort.
  // (13 digits today, stays 13 digits until year 2286 — the padStart is
  // just cheap insurance, not load-bearing.)
  const key = `${Date.now().toString().padStart(15, '0')}-${crypto.randomUUID()}`;
  await env.SUGGESTIONS.put(key, JSON.stringify(suggestion));

  return jsonResponse({ ok: true }, 200);
}
