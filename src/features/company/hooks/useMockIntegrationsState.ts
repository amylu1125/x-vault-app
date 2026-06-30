import { useCallback, useState } from 'react';
import { INITIAL_INTEGRATIONS } from '../../../data';
import type { MarketplaceIntegration, SystemActivityLog } from '../../../types';

interface UseMockIntegrationsStateDeps {
  addAuditLog: (actionType: SystemActivityLog['actionType'], description: string, target?: string) => void;
}

export function useMockIntegrationsState({ addAuditLog }: UseMockIntegrationsStateDeps) {
  const [integrations, setIntegrations] = useState<MarketplaceIntegration[]>(INITIAL_INTEGRATIONS);

  const handleToggleIntegration = useCallback(
    (mktId: string) => {
      setIntegrations((prev) =>
        prev.map((m) =>
          m.id === mktId
            ? { ...m, status: m.status === 'Connected' ? 'Idle Sync' : 'Connected', lastSynced: 'Just now' }
            : m
        )
      );
      addAuditLog('INTEGRATION_SYNC', `Toggled sync state for marketplace connector ${mktId}`, mktId);
    },
    [addAuditLog]
  );

  return { integrations, handleToggleIntegration };
}
