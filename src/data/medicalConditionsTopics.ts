// The full Medical Conditions topic list — see
// content-migration/medical-conditions/_index-intro.md for provenance. That
// file is the source of truth; this array's order and content should match
// its table exactly (alphabetical, internal and external topics together).
// Deliberately a plain typed array (matching navigation.ts's existing
// pattern) rather than a content collection: this is structural index
// data, not prose. `slug` values match the `medicalConditions` content
// collection's entry ids for topics that have a written article.
//
// externalUrl is one link per topic, no exceptions — Gallbladder /
// Pancreatitis used to be a single entry with two source links and buggy
// "Mayo Clinic — [Topic]" link text; it's now two standalone topics
// (Gallstones, Pancreatitis), each with its own single link, same as
// every other external entry.
//
// Deconditioning and Prognostication are flagged in MIGRATION-NOTES.md as
// imperfect source matches — Brett's call, not something to fix here.

export interface MedicalConditionTopic {
  topic: string;
  status: 'internal' | 'external';
  slug?: string;
  externalUrl?: string;
}

export const medicalConditionsTopics: MedicalConditionTopic[] = [
  {
    topic: 'Alcohol Withdrawal',
    status: 'external',
    externalUrl: 'https://my.clevelandclinic.org/health/diseases/alcohol-withdrawal',
  },
  { topic: 'Atrial Fibrillation / Atrial Flutter', status: 'internal', slug: 'atrial-fibrillation' },
  {
    topic: 'Blood Thinners (Anticoagulation)',
    status: 'external',
    externalUrl: 'https://my.clevelandclinic.org/health/treatments/22288-anticoagulants',
  },
  {
    topic: 'Blood Transfusions',
    status: 'external',
    externalUrl: 'https://www.mayoclinic.org/tests-procedures/blood-transfusion/about/pac-20385168',
  },
  {
    topic: 'Cancer',
    status: 'external',
    externalUrl: 'https://www.mayoclinic.org/diseases-conditions/cancer/symptoms-causes/syc-20370588',
  },
  { topic: 'Chest Pain', status: 'internal', slug: 'chest-pain' },
  {
    topic: 'Chronic Obstructive Pulmonary Disease (COPD) / Asthma',
    status: 'internal',
    slug: 'copd-asthma',
  },
  { topic: 'Congestive Heart Failure (CHF)', status: 'internal', slug: 'congestive-heart-failure' },
  {
    topic: 'Death / Dying',
    status: 'external',
    externalUrl: 'https://www.nia.nih.gov/health/end-life',
  },
  {
    topic: 'Deconditioning',
    status: 'external',
    externalUrl:
      'https://mcpress.mayoclinic.org/healthy-aging/the-risks-of-hospital-stays-a-guide-to-safe-recovery-and-returning-home-for-older-adults/',
  },
  { topic: 'Delirium', status: 'internal', slug: 'delirium' },
  {
    topic: 'Dementia',
    status: 'external',
    externalUrl: 'https://www.mayoclinic.org/diseases-conditions/dementia/symptoms-causes/syc-20352013',
  },
  { topic: 'Diabetes', status: 'internal', slug: 'diabetes' },
  {
    topic: 'Gallstones',
    status: 'external',
    externalUrl: 'https://www.mayoclinic.org/diseases-conditions/gallstones/symptoms-causes/syc-20354214',
  },
  {
    topic: 'Gastrointestinal Bleeding',
    status: 'external',
    externalUrl:
      'https://www.mayoclinic.org/diseases-conditions/gastrointestinal-bleeding/symptoms-causes/syc-20372729',
  },
  {
    topic: 'Hip Fracture',
    status: 'external',
    externalUrl: 'https://www.mayoclinic.org/diseases-conditions/hip-fracture/symptoms-causes/syc-20373468',
  },
  {
    topic: 'Kidney Dysfunction (Acute Renal Failure, Chronic Kidney Disease, End Stage Renal Disease / Dialysis)',
    status: 'external',
    externalUrl: 'https://www.niddk.nih.gov/health-information/kidney-disease',
  },
  {
    topic: 'Obstructive Sleep Apnea',
    status: 'external',
    externalUrl:
      'https://www.mayoclinic.org/diseases-conditions/obstructive-sleep-apnea/symptoms-causes/syc-20352090',
  },
  {
    topic: 'Pancreatitis',
    status: 'external',
    externalUrl: 'https://www.mayoclinic.org/diseases-conditions/pancreatitis/symptoms-causes/syc-20360227',
  },
  { topic: 'Passing Out (Syncope)', status: 'internal', slug: 'syncope' },
  {
    topic: 'Prognostication',
    status: 'external',
    externalUrl: 'https://my.clevelandclinic.org/health/articles/prognosis',
  },
  { topic: 'Sepsis', status: 'internal', slug: 'sepsis' },
  {
    topic: 'Stroke (Cerebrovascular Accident) / Mini-Stroke (Transient Ischemic Attack)',
    status: 'internal',
    slug: 'stroke',
  },
  {
    topic: 'Urinary Tract Infections / Kidney Infections (Pyelonephritis)',
    status: 'external',
    externalUrl: 'https://www.mayoclinic.org/diseases-conditions/kidney-infection/symptoms-causes/syc-20353387',
  },
];
