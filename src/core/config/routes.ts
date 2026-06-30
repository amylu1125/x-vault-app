/**
 * Central route path constants.
 * AppRouter and feature pages should import from here — never hardcode paths.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  INVENTORY: '/inventory',
  POS: '/pos',
  SCANNER: '/scanner',
  TRADES: '/trades',
  CRM: '/crm',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** Routes that require an authenticated session. */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.INVENTORY,
  ROUTES.POS,
  ROUTES.SCANNER,
  ROUTES.TRADES,
  ROUTES.CRM,
  ROUTES.REPORTS,
  ROUTES.ANALYTICS,
] as const;

/** Routes accessible without authentication. */
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
] as const;
