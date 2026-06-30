import { useCallback, useState } from 'react';
import { CURRENT_USER, INITIAL_INVENTORY } from '../../../data';
import type {
  CustomerProfile,
  InventoryItem,
  SystemActivityLog,
  TenantCompany,
  TradeIntakeItem,
  TradeOutgoItem,
  TransactionRecord,
} from '../../../types';

interface UseMockTradeStateDeps {
  activeCompany: TenantCompany;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  selectedCustomer: CustomerProfile;
  setCustomers: React.Dispatch<React.SetStateAction<CustomerProfile[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<TransactionRecord[]>>;
  addAuditLog: (actionType: SystemActivityLog['actionType'], description: string, target?: string) => void;
  onTradeComplete: () => void;
}

export function useMockTradeState({
  activeCompany,
  inventory,
  setInventory,
  selectedCustomer,
  setCustomers,
  setTransactions,
  addAuditLog,
  onTradeComplete,
}: UseMockTradeStateDeps) {
  const [tradeIntakeList, setTradeIntakeList] = useState<TradeIntakeItem[]>([
    { id: 't-in-1', item: INITIAL_INVENTORY[2], conditionPercentage: 90, conditionLabel: 'Near Mint (90%)' },
  ]);
  const [tradeOutgoList, setTradeOutgoList] = useState<TradeOutgoItem[]>([
    { id: 't-out-1', item: INITIAL_INVENTORY[1], quantity: 1 },
  ]);

  const handleAddTradeIntake = useCallback((item: InventoryItem) => {
    setTradeIntakeList((prev) => [
      ...prev,
      { id: `ti-${Date.now()}`, item, conditionPercentage: 90, conditionLabel: 'Near Mint (90%)' },
    ]);
  }, []);

  const handleAddTradeOutgo = useCallback((item: InventoryItem) => {
    setTradeOutgoList((prev) => [...prev, { id: `to-${Date.now()}`, item, quantity: 1 }]);
  }, []);

  const handleUpdateIntakeCondition = useCallback((id: string, pct: number, label: string) => {
    setTradeIntakeList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, conditionPercentage: pct, conditionLabel: label } : t))
    );
  }, []);

  const handleRemoveIntake = useCallback((id: string) => {
    setTradeIntakeList((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleRemoveOutgo = useCallback((id: string) => {
    setTradeOutgoList((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleClearTrade = useCallback(() => {
    setTradeIntakeList([]);
    setTradeOutgoList([]);
  }, []);

  const handleCompleteTrade = useCallback(
    (tender: 'Cash' | 'Credit', amt: number) => {
      const newTx: TransactionRecord = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        companyId: activeCompany.id,
        timestamp: 'Just now',
        customerName: selectedCustomer.name,
        customerId: selectedCustomer.id,
        employeeName: CURRENT_USER.name,
        itemsCount: tradeIntakeList.length + tradeOutgoList.length,
        subtotal: amt,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: amt,
        tenderType: 'Trade Exchange',
        paymentMethods: [
          tender === 'Cash'
            ? `Instant Cash Out (${activeCompany.currencySymbol}${amt.toFixed(2)})`
            : `Store Credit Added (${activeCompany.currencySymbol}${amt.toFixed(2)})`,
        ],
      };
      setTransactions((prev) => [newTx, ...prev]);

      if (tender === 'Credit' && amt > 0) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === selectedCustomer.id ? { ...c, storeCreditBalance: c.storeCreditBalance + amt } : c
          )
        );
      }

      setInventory((prev) => {
        let next = [...prev];
        tradeOutgoList.forEach((to) => {
          const idx = next.findIndex((i) => i.id === to.item.id);
          if (idx >= 0) next[idx] = { ...next[idx], quantity: Math.max(0, next[idx].quantity - to.quantity) };
        });
        tradeIntakeList.forEach((ti) => {
          const idx = next.findIndex((i) => i.id === ti.item.id);
          if (idx >= 0) {
            next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          } else {
            next.push({ ...ti.item, id: `${ti.item.id}-trd`, quantity: 1, isStarred: false });
          }
        });
        return next;
      });

      addAuditLog('TRADE', `Processed Trade Exchange ${newTx.id} with ${selectedCustomer.name} (${tender})`, newTx.id);
      setTradeIntakeList([]);
      setTradeOutgoList([]);
      alert(`✅ Trade Reconciled!\nIssued ${activeCompany.currencySymbol}${amt.toFixed(2)} (${tender}) to ${selectedCustomer.name}.`);
      onTradeComplete();
    },
    [
      activeCompany,
      addAuditLog,
      onTradeComplete,
      selectedCustomer,
      setCustomers,
      setInventory,
      setTransactions,
      tradeIntakeList,
      tradeOutgoList,
    ]
  );

  return {
    tradeIntakeList,
    tradeOutgoList,
    handleAddTradeIntake,
    handleAddTradeOutgo,
    handleUpdateIntakeCondition,
    handleRemoveIntake,
    handleRemoveOutgo,
    handleClearTrade,
    handleCompleteTrade,
  };
}
