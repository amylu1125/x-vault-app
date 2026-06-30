import { useState } from 'react';
import { TENANT_COMPANIES } from '../../../data';
import type { NavScreen, TenantCompany } from '../../../types';
import type { DashboardShellState } from '../types/shell.types';

export function useDashboardShellState(): DashboardShellState {
  const [activeScreen, setActiveScreen] = useState<NavScreen>('dashboard');
  const [activeCompany, setActiveCompany] = useState<TenantCompany>(TENANT_COMPANIES[0]);
  const [activeLocation, setActiveLocation] = useState<string>(TENANT_COMPANIES[0].branchLocations[0]);
  const [globalSearch, setGlobalSearch] = useState('');

  return {
    activeScreen,
    setActiveScreen,
    activeCompany,
    setActiveCompany,
    activeLocation,
    setActiveLocation,
    globalSearch,
    setGlobalSearch,
  };
}
