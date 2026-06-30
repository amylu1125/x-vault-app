/**
 * Feature module registry and feature flags — Sprint 2+.
 */
export const FEATURE_MODULES = [
  'auth',
  'company',
  'dashboard',
  'inventory',
  'pos',
  'scanner',
  'trades',
  'crm',
  'reports',
  'analytics',
] as const;

export type FeatureModule = (typeof FEATURE_MODULES)[number];

/** Modules with active URL routes (expand as sprints ship). */
export const ENABLED_ROUTE_MODULES: FeatureModule[] = ['auth', 'dashboard'];
