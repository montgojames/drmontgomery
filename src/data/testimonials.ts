// Approved testimonials shown on the About page. Deliberately NOT pulled
// from Cloudflare KV automatically — approving a submission in the admin
// view (/admin/suggestions) only flags it as ready; adding it here is a
// separate, manual, on-purpose step (see CLAUDE.md). Empty until Brett
// approves the first one.

export interface Testimonial {
  quote: string;
  attribution: string;
}

export const testimonials: Testimonial[] = [];
