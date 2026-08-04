// Table of contents for the Discharge Planning article specifically — at
// ~22 screens tall with 7 H2 sections, it's the one article on the site
// long enough to need in-page navigation (see the static TOC and "Jump to
// a section" button in [group]/[topic].astro / TopicLayout.astro).
//
// Deliberately static, not derived from the rendered article at build
// time: `label` must match each H2's actual text, and `id` must match the
// id Astro's markdown renderer auto-generates from that same text (a
// github-slugger-style slug) — both in src/content/decisions-next-steps/
// discharge-planning.md. If Brett edits a heading's wording through
// TinaCMS, its auto-generated id changes too, so this list needs a manual
// update to match (both fields), or its links silently point at nothing.

export interface DischargePlanningTocItem {
  id: string;
  label: string;
}

export const dischargePlanningToc: DischargePlanningTocItem[] = [
  { id: 'discharge-location-where-are-you-going', label: 'Discharge location: "Where are you going?"' },
  { id: 'discharge-planner-case-manager--social-worker', label: 'Discharge planner: Case Manager / Social Worker' },
  { id: 'discharge-process', label: 'Discharge Process' },
  { id: 'home-oxygen-arrangement', label: 'Home oxygen arrangement' },
  { id: 'discounted-medication-websites', label: 'Discounted medication websites' },
  { id: 'who-does-what', label: 'Who does what' },
  { id: 'tips-for-the-patient-to-improve-discharge', label: 'Tips for the patient to improve discharge' },
];
