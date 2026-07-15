/// <reference types="@cloudflare/workers-types" />

// Shared between worker/handlers/testimonial.ts (write side) and
// worker/handlers/admin-suggestions.ts (read + approve/reject side).
// Stored in the SAME KV namespace as topic suggestions (SUGGESTIONS) per
// explicit request — not a separate KV namespace — distinguished purely
// by the TESTIMONIAL_KEY_PREFIX on the key, so admin-suggestions.ts can
// tell the two entry types apart when it lists everything.

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface StoredTestimonial {
  name: string | null;
  comment: string;
  email: string | null;
  submittedAt: string;
  status: TestimonialStatus;
}

export const TESTIMONIAL_KEY_PREFIX = 'testimonial:';
