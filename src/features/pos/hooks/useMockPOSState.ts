import { useCallback, useState } from 'react';
import { CURRENT_USER, INITIAL_INVENTORY } from '../../../data';
import type {
  CartItem,
  CustomerProfile,
  InventoryItem,
  SystemActivityLog,
  TenantCompany,
  TransactionRecord,
} from '../../../types';

interface UseMockPOSStateDeps {
  activeCompany: TenantCompany;
  activeLocation: string;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  selectedCustomer: CustomerProfile;
  setCustomers: React.Dispatch<React.SetStateAction<CustomerProfile[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<TransactionRecord[]>>;
  addAuditLog: (actionType: SystemActivityLog['actionType'], description: string, target?: string) => void;
  onCheckoutComplete: () => void;
}

export function useMockPOSState({
  activeCompany,
  activeLocation,
  inventory,
  setInventory,
  selectedCustomer,
  setCustomers,
  setTransactions,
  addAuditLog,
  onCheckoutComplete,
}: UseMockPOSStateDeps) {
  const [posCart, setPosCart] = useState<CartItem[]>([
    { item: INITIAL_INVENTORY[0], quantity: 1 },
    { item: INITIAL_INVENTORY[4], quantity: 2 },
  ]);

  const handleAddToCart = useCallback((item: InventoryItem) => {
    setPosCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const handleUpdateCartQty = useCallback((itemId: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId) {
            const nextQty = c.quantity + delta;
            return nextQty > 0 ? { ...c, quantity: nextQty } : null;
          }
          return c;
        })
        .filter((c): c is CartItem => c !== null)
    );
  }, []);

  const handleUpdatePriceOverride = useCallback((itemId: string, newPrice: number) => {
    setPosCart((prev) => prev.map((c) => (c.item.id === itemId ? { ...c, priceOverride: newPrice } : c)));
  }, []);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setPosCart((prev) => prev.filter((c) => c.item.id !== itemId));
  }, []);

  const handleClearCart = useCallback(() => setPosCart([]), []);

  const handlePOSCheckout = useCallback(
    (tender: string, subtotal: number, tax: number, total: number) => {
      const newTx: TransactionRecord = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        companyId: activeCompany.id,
        timestamp: 'Just now',
        customerName: selectedCustomer.name,
        customerId: selectedCustomer.id,
        employeeName: CURRENT_USER.name,
        itemsCount: posCart.reduce((a, b) => a + b.quantity, 0),
        subtotal,
        taxAmount: tax,
        discountAmount: subtotal + tax - total,
        totalAmount: total,
        tenderType: 'POS Sale',
        paymentMethods: [`${tender} (${activeCompany.currencySymbol}${total.toFixed(2)})`],
        notes: `Branch: ${activeLocation}`,
      };
      setTransactions((prev) => [newTx, ...prev]);

      setInventory((prev) =>
        prev.map((i) => {
          const match = posCart.find((c) => c.item.id === i.id);
          if (match) {
            return { ...i, quantity: Math.max(0, i.quantity - match.quantity) };
          }
          return i;
        })
      );

      if (tender === 'Store Credit Balance') {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === selectedCustomer.id
              ? { ...c, storeCreditBalance: Math.max(0, c.storeCreditBalance - total) }
              : c
          )
        );
      }

      addAuditLog(
        'SALE',
        `POS Register completed sale ${newTx.id} for ${activeCompany.currencySymbol}${total.toFixed(2)} via ${tender}`,
        newTx.id
      );
      setPosCart([]);
      alert(`🎉 Retail Checkout Complete!\nCollected ${activeCompany.currencySymbol}${total.toFixed(2)} via ${tender}.`);
      onCheckoutComplete();
    },
    [activeCompany, activeLocation, addAuditLog, onCheckoutComplete, posCart, selectedCustomer, setCustomers, setInventory, setTransactions]
  );

  return {
    posCart,
    handleAddToCart,
    handleUpdateCartQty,
    handleUpdatePriceOverride,
    handleRemoveFromCart,
    handleClearCart,
    handlePOSCheckout,
  };
}
