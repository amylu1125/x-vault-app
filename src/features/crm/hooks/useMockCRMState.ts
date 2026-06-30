import { useCallback, useState } from 'react';
import { CURRENT_USER, INITIAL_CUSTOMERS } from '../../../data';
import type { CustomerProfile, SystemActivityLog } from '../../../types';

interface UseMockCRMStateDeps {
  addAuditLog: (actionType: SystemActivityLog['actionType'], description: string, target?: string) => void;
}

export function useMockCRMState({ addAuditLog }: UseMockCRMStateDeps) {
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(INITIAL_CUSTOMERS[0]);

  const handleAddCustomer = useCallback(
    (newCust: CustomerProfile) => {
      setCustomers((prev) => [newCust, ...prev]);
      setSelectedCustomer(newCust);
      addAuditLog('SETTINGS_UPDATE', `Registered CRM profile for ${newCust.name}`);
    },
    [addAuditLog]
  );

  const handleUpdateCustomer = useCallback(
    (updated: CustomerProfile) => {
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCustomer((prev) => (prev.id === updated.id ? updated : prev));
      addAuditLog('SETTINGS_UPDATE', `Updated CRM profile for ${updated.name}`);
    },
    [addAuditLog]
  );

  return {
    customers,
    setCustomers,
    selectedCustomer,
    setSelectedCustomer,
    handleAddCustomer,
    handleUpdateCustomer,
  };
}
