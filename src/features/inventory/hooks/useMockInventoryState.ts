import { useCallback, useState } from 'react';
import { CURRENT_USER, INITIAL_INVENTORY, INITIAL_LEDGERS } from '../../../data';
import type { InventoryItem, InventoryLedgerEntry, SystemActivityLog, TenantCompany } from '../../../types';

interface UseMockInventoryStateDeps {
  activeCompany: TenantCompany;
  addAuditLog: (actionType: SystemActivityLog['actionType'], description: string, target?: string) => void;
}

export function useMockInventoryState({ activeCompany, addAuditLog }: UseMockInventoryStateDeps) {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [ledgers, setLedgers] = useState<InventoryLedgerEntry[]>(INITIAL_LEDGERS);

  const handleAddItem = useCallback(
    (newItem: InventoryItem) => {
      setInventory((prev) => [newItem, ...prev]);
      const ledger: InventoryLedgerEntry = {
        id: `led-${Date.now()}`,
        itemId: newItem.id,
        itemPermanentId: newItem.id,
        itemName: newItem.name,
        companyId: activeCompany.id,
        actorName: CURRENT_USER.name,
        actorRole: CURRENT_USER.role,
        actionType: 'ADD_ITEM',
        quantityDelta: newItem.quantity,
        previousQuantity: 0,
        newQuantity: newItem.quantity,
        costUnit: newItem.purchaseCost,
        priceUnit: newItem.sellingPrice,
        timestamp: new Date().toLocaleString(),
        notes: 'Initial intake registration',
      };
      setLedgers((prev) => [ledger, ...prev]);
      addAuditLog('INVENTORY_CHANGE', `Intaked asset ${newItem.id}: ${newItem.name} (Qty: ${newItem.quantity})`, newItem.id);
    },
    [activeCompany.id, addAuditLog]
  );

  const handleUpdateItem = useCallback(
    (updated: InventoryItem) => {
      setInventory((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      addAuditLog('INVENTORY_CHANGE', `Modified SKU metadata for ${updated.id}`, updated.id);
    },
    [addAuditLog]
  );

  const handleDeleteItem = useCallback(
    (permanentId: string) => {
      setInventory((prev) => prev.filter((i) => i.id !== permanentId));
      addAuditLog('INVENTORY_CHANGE', `Decommissioned immutable item ${permanentId}`, permanentId);
    },
    [addAuditLog]
  );

  const handleToggleStar = useCallback((id: string) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, isStarred: !i.isStarred } : i)));
  }, []);

  return {
    inventory,
    setInventory,
    ledgers,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleToggleStar,
  };
}
