import { useCallback, useState } from 'react';
import { INITIAL_ACTIVITY_LOGS, CURRENT_USER } from '../../../data';
import type { SystemActivityLog, TenantCompany } from '../../../types';

export function useMockAuditState(activeCompany: TenantCompany) {
  const [activityLogs, setActivityLogs] = useState<SystemActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  const addAuditLog = useCallback(
    (actionType: SystemActivityLog['actionType'], description: string, target?: string) => {
      const newLog: SystemActivityLog = {
        id: `act-${Date.now()}`,
        companyId: activeCompany.id,
        timestamp: new Date().toLocaleTimeString(),
        actorName: `${CURRENT_USER.name} (${CURRENT_USER.role})`,
        actionType,
        description,
        severity: 'info',
        ipAddress: '192.168.1.104',
        targetResource: target,
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    },
    [activeCompany.id]
  );

  return { activityLogs, addAuditLog };
}
