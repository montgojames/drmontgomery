/// <reference types="@cloudflare/workers-types" />

// Shared between functions/api/suggest-topic.ts (write side) and
// functions/admin/suggestions.ts (read side) so the KV value shape can't
// drift between the two. The leading underscore on this directory tells
// Cloudflare Pages this isn't a route — see
// https://developers.cloudflare.com/pages/functions/routing/#functions-invocation-routes

export interface Env {
  SUGGESTIONS: KVNamespace;
}

export interface StoredSuggestion {
  topic: string;
  email: string | null;
  submittedAt: string;
}
