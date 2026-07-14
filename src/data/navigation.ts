export interface Topic {
  label: string;
  slug: string;
  description: string;
}

export interface NavGroup {
  type: 'group';
  label: string;
  slug: string;
  topics: Topic[];
}

export interface NavLink {
  type: 'link';
  label: string;
  href: string;
}

export type NavItem = NavGroup | NavLink;

export const duringYourStayGroup: NavGroup = {
  type: 'group',
  label: 'During Your Stay',
  slug: 'during-your-stay',
  topics: [
    {
      label: 'Hospitalist Defined',
      slug: 'hospitalist-defined',
      description: 'Who your hospital doctor is and how they work with your other care team.',
    },
    {
      label: 'Your Healthcare Team',
      slug: 'your-healthcare-team',
      description: "The nurses, specialists, and staff who'll be part of your care.",
    },
    {
      label: 'Mobility',
      slug: 'mobility',
      description: 'Why moving safely, even a little, helps you heal and recover.',
    },
    {
      label: 'Sleep',
      slug: 'sleep',
      description: "Simple ways to rest better while you're in the hospital.",
    },
  ],
};

// NOTE: descriptions below are placeholder-style teaser copy (scope, not
// clinical substance) written to match the During Your Stay set's tone.
// Per CLAUDE.md, all medical content comes from Brett — these need his
// review before anything here is treated as final/published.
export const decisionsGroup: NavGroup = {
  type: 'group',
  label: 'Decisions & Next Steps',
  slug: 'decisions-and-next-steps',
  topics: [
    {
      label: 'Discharge Planning',
      slug: 'discharge-planning',
      description: "What needs to happen before you're ready to safely leave the hospital.",
    },
    {
      label: 'Resuscitation',
      slug: 'resuscitation',
      description: 'What choosing CPR or other emergency care means, and how your wishes are followed.',
    },
    {
      label: 'Hospice / End-of-Life',
      slug: 'hospice-end-of-life',
      description: 'What comfort-focused care means for you and your family.',
    },
    {
      label: 'Advance Directives',
      slug: 'advance-directives',
      description: 'How to put your healthcare wishes in writing, before you need to.',
    },
  ],
};

export const navGroups: NavGroup[] = [duringYourStayGroup, decisionsGroup];

export const navLinks: NavLink[] = [
  { type: 'link', label: 'Medical Conditions', href: '/medical-conditions/' },
  { type: 'link', label: 'About', href: '/about/' },
  { type: 'link', label: 'Search', href: '/search/' },
];

export const navItems: NavItem[] = [...navGroups, ...navLinks];

export function topicHref(group: NavGroup, topic: Topic): string {
  return `/${group.slug}/${topic.slug}/`;
}
