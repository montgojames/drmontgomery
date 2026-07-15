/// <reference types="@cloudflare/workers-types" />

// Shared between worker/handlers/suggest-topic.ts (write side) and
// worker/handlers/admin-suggestions.ts (read side) so the KV value shape
// can't drift between the two.

export interface Env {
  SUGGESTIONS: KVNamespace;
}

export interface StoredSuggestion {
  topic: string;
  email: string | null;
  submittedAt: string;
}
