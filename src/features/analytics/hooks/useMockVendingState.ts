import { useCallback, useState } from 'react';
import { INITIAL_VENDING_UNITS } from '../../../data';
import type { SystemActivityLog, VendingMachineUnit } from '../../../types';

interface UseMockVendingStateDeps {
  addAuditLog: (actionType: SystemActivityLog['actionType'], description: string, target?: string) => void;
}

export function useMockVendingState({ addAuditLog }: UseMockVendingStateDeps) {
  const [vendingUnits, setVendingUnits] = useState<VendingMachineUnit[]>(INITIAL_VENDING_UNITS);

  const handlePingVendingUnit = useCallback(
    (unitId: string) => {
      setVendingUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, status: 'Online', lastPing: 'Just now' } : u))
      );
      addAuditLog('VENDING_PING', `Manual IoT ping verified telemetry for unit ${unitId}`, unitId);
    },
    [addAuditLog]
  );

  return { vendingUnits, handlePingVendingUnit };
}
