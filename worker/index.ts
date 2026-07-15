/// <reference types="@cloudflare/workers-types" />

// Single Worker entry point for the site's few dynamic routes, running
// alongside the static Astro build (see wrangler.jsonc's `assets` config).
//
// This project used to deploy via Cloudflare Pages, whose `functions/`
// directory auto-routed each file to a matching URL path with zero
// wiring. That convention does NOT exist under the unified Workers +
// static-assets model (Cloudflare's now-default path — Pages itself still
// works but is de-emphasized for new projects). Under plain Workers,
// everything dynamic has to be explicitly routed through ONE entry point,
// by hand, which is what this file does — see wrangler.jsonc's
// `run_worker_first` for which paths even reach this file at all; every
// other request (including /admin/index.html, TinaCMS's own static admin
// bundle — NOT the same thing as the /admin/suggestions route below) is
// served directly from the static build via env.ASSETS, never touching
// this code.

import type { Env } from './lib/suggestions';
import { handleSuggestTopic } from './handlers/suggest-topic';
import { handleTestimonial } from './handlers/testimonial';
import { handleAdminSuggestionsGet, handleAdminSuggestionsPost } from './handlers/admin-suggestions';

interface WorkerEnv extends Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/suggest-topic' && request.method === 'POST') {
      return handleSuggestTopic(request, env);
    }

    if (url.pathname === '/api/testimonial' && request.method === 'POST') {
      return handleTestimonial(request, env);
    }

    if (url.pathname === '/admin/suggestions') {
      if (request.method === 'GET') return handleAdminSuggestionsGet(env);
      if (request.method === 'POST') return handleAdminSuggestionsPost(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<WorkerEnv>;
