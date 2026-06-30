export type { NavScreen } from '../../../types';

export interface DashboardShellState {
  activeScreen: import('../../../types').NavScreen;
  setActiveScreen: (screen: import('../../../types').NavScreen) => void;
  activeCompany: import('../../../types').TenantCompany;
  setActiveCompany: (company: import('../../../types').TenantCompany) => void;
  activeLocation: string;
  setActiveLocation: (location: string) => void;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
}
