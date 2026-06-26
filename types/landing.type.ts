/** Domain types for the marketing landing page content. */

export type RoleKey = "resident" | "manager" | "staff";

/** Accent palette key shared by feature cards and icon tints. */
export type AccentKey = "gold" | "blue" | "green" | "amber" | "slate" | "red";

export interface PreviewKpi {
  label: string;
  value: string;
  accent: AccentKey;
}

export interface LandingStat {
  value: string;
  label: string;
}

export interface LandingFeature {
  icon: string;
  title: string;
  description: string;
  accent: AccentKey;
}

export interface LandingRole {
  key: RoleKey;
  label: string;
  icon: string;
  title: string;
  description: string;
  points: string[];
  quote: string;
  author: string;
  authorRole: string;
  avatar: string;
}

export interface LandingStep {
  no: string;
  icon: string;
  title: string;
  description: string;
}

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingFooterColumn {
  title: string;
  links: string[];
}

export interface LandingHeroPreview {
  url: string;
  kpis: PreviewKpi[];
  /** Heights (0-100) of the charge-collection trend bars. */
  bars: number[];
  badgeLabel: string;
  badgeValue: string;
}

export interface LandingContent {
  hero: LandingHeroPreview;
  stats: LandingStat[];
  features: LandingFeature[];
  roles: LandingRole[];
  steps: LandingStep[];
  faqs: LandingFaq[];
  footerColumns: LandingFooterColumn[];
}
