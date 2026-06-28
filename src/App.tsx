import React, { useState } from 'react';
import { 
  NavScreen, 
  TenantCompany, 
  InventoryItem, 
  InventoryLedgerEntry, 
  CustomerProfile, 
  TransactionRecord, 
  SystemActivityLog, 
  VendingMachineUnit, 
  MarketplaceIntegration, 
  CartItem, 
  TradeIntakeItem, 
  TradeOutgoItem 
} from './types';
import { 
  TENANT_COMPANIES, 
  CURRENT_USER, 
  INITIAL_INVENTORY, 
  INITIAL_LEDGERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_VENDING_UNITS, 
  INITIAL_INTEGRATIONS 
} from './data';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { DashboardScreen } from './components/DashboardScreen';
import { POSScreen } from './components/POSScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { TradesScreen } from './components/TradesScreen';
import { ScannerScreen } from './components/ScannerScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { CRMScreen } from './components/CRMScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { VendingScreen } from './components/VendingScreen';
import { IntegrationsScreen } from './components/IntegrationsScreen';
import { ActivityLogsScreen } from './components/ActivityLogsScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<NavScreen>('dashboard');
  const [activeCompany, setActiveCompany] = useState<TenantCompany>(TENANT_COMPANIES[0]);
  const [activeLocation, setActiveLocation] = useState<string>(TENANT_COMPANIES[0].branchLocations[0]);
  
  // Isolated Tenant States
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [ledgers, setLedgers] = useState<InventoryLedgerEntry[]>(INITIAL_LEDGERS);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(INITIAL_CUSTOMERS[0]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [activityLogs, setActivityLogs] = useState<SystemActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [vendingUnits, setVendingUnits] = useState<VendingMachineUnit[]>(INITIAL_VENDING_UNITS);
  const [integrations, setIntegrations] = useState<MarketplaceIntegration[]>(INITIAL_INTEGRATIONS);
  const [globalSearch, setGlobalSearch] = useState('');

  // Mock initial cart
  const [posCart, setPosCart] = useState<CartItem[]>([
    { item: INITIAL_INVENTORY[0], quantity: 1 },
    { item: INITIAL_INVENTORY[4], quantity: 2 },
  ]);

  // Mock initial trade lists
  const [tradeIntakeList, setTradeIntakeList] = useState<TradeIntakeItem[]>([
    { id: 't-in-1', item: INITIAL_INVENTORY[2], conditionPercentage: 90, conditionLabel: 'Near Mint (90%)' },
  ]);
  const [tradeOutgoList, setTradeOutgoList] = useState<TradeOutgoItem[]>([
    { id: 't-out-1', item: INITIAL_INVENTORY[1], quantity: 1 },
  ]);

  // Helper to append audit logs
  const addAuditLog = (actionType: SystemActivityLog['actionType'], description: string, target?: string) => {
    const newLog: SystemActivityLog = {
      id: `act-${Date.now()}`,
      companyId: activeCompany.id,
      timestamp: new Date().toLocaleTimeString(),
      actorName: `${CURRENT_USER.name} (${CURRENT_USER.role})`,
      actionType,
      description,
      severity: 'info',
      ipAddress: '192.168.1.104',
      targetResource: target
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Inventory Handlers
  const handleAddItem = (newItem: InventoryItem) => {
    setInventory(prev => [newItem, ...prev]);
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
      notes: 'Initial intake registration'
    };
    setLedgers(prev => [ledger, ...prev]);
    addAuditLog('INVENTORY_CHANGE', `Intaked asset ${newItem.id}: ${newItem.name} (Qty: ${newItem.quantity})`, newItem.id);
  };

  const handleUpdateItem = (updated: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === updated.id ? updated : i));
    addAuditLog('INVENTORY_CHANGE', `Modified SKU metadata for ${updated.id}`, updated.id);
  };

  const handleDeleteItem = (permanentId: string) => {
    setInventory(prev => prev.filter(i => i.id !== permanentId));
    addAuditLog('INVENTORY_CHANGE', `Decommissioned immutable item ${permanentId}`, permanentId);
  };

  const handleToggleStar = (id: string) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, isStarred: !i.isStarred } : i));
  };

  // POS Cart Handlers
  const handleAddToCart = (item: InventoryItem) => {
    setPosCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setPosCart(prev => prev.map(c => {
      if (c.item.id === itemId) {
        const nextQty = c.quantity + delta;
        return nextQty > 0 ? { ...c, quantity: nextQty } : null;
      }
      return c;
    }).filter((c): c is CartItem => c !== null));
  };

  const handleUpdatePriceOverride = (itemId: string, newPrice: number) => {
    setPosCart(prev => prev.map(c => c.item.id === itemId ? { ...c, priceOverride: newPrice } : c));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setPosCart(prev => prev.filter(c => c.item.id !== itemId));
  };

  const handleClearCart = () => setPosCart([]);

  const handlePOSCheckout = (tender: string, subtotal: number, tax: number, total: number) => {
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
      notes: `Branch: ${activeLocation}`
    };
    setTransactions(prev => [newTx, ...prev]);

    // Deduct stock
    setInventory(prev => prev.map(i => {
      const match = posCart.find(c => c.item.id === i.id);
      if (match) {
        return { ...i, quantity: Math.max(0, i.quantity - match.quantity) };
      }
      return i;
    }));

    // Deduct store credit if used
    if (tender === 'Store Credit Balance') {
      setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, storeCreditBalance: Math.max(0, c.storeCreditBalance - total) } : c));
    }

    addAuditLog('SALE', `POS Register completed sale ${newTx.id} for ${activeCompany.currencySymbol}${total.toFixed(2)} via ${tender}`, newTx.id);
    setPosCart([]);
    alert(`🎉 Retail Checkout Complete!\nCollected ${activeCompany.currencySymbol}${total.toFixed(2)} via ${tender}.`);
    setActiveScreen('dashboard');
  };

  // Trade Handlers
  const handleAddTradeIntake = (item: InventoryItem) => {
    setTradeIntakeList(prev => [...prev, { id: `ti-${Date.now()}`, item, conditionPercentage: 90, conditionLabel: 'Near Mint (90%)' }]);
  };

  const handleAddTradeOutgo = (item: InventoryItem) => {
    setTradeOutgoList(prev => [...prev, { id: `to-${Date.now()}`, item, quantity: 1 }]);
  };

  const handleUpdateIntakeCondition = (id: string, pct: number, label: string) => {
    setTradeIntakeList(prev => prev.map(t => t.id === id ? { ...t, conditionPercentage: pct, conditionLabel: label } : t));
  };

  const handleRemoveIntake = (id: string) => setTradeIntakeList(prev => prev.filter(t => t.id !== id));
  const handleRemoveOutgo = (id: string) => setTradeOutgoList(prev => prev.filter(t => t.id !== id));
  const handleClearTrade = () => { setTradeIntakeList([]); setTradeOutgoList([]); };

  const handleCompleteTrade = (tender: 'Cash' | 'Credit', amt: number) => {
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
      paymentMethods: [tender === 'Cash' ? `Instant Cash Out (${activeCompany.currencySymbol}${amt.toFixed(2)})` : `Store Credit Added (${activeCompany.currencySymbol}${amt.toFixed(2)})`]
    };
    setTransactions(prev => [newTx, ...prev]);

    // Update customer credit if credit tender
    if (tender === 'Credit' && amt > 0) {
      setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, storeCreditBalance: c.storeCreditBalance + amt } : c));
    }

    // Deduct store outgo stock & add customer intake cards to inventory
    setInventory(prev => {
      let next = [...prev];
      tradeOutgoList.forEach(to => {
        const idx = next.findIndex(i => i.id === to.item.id);
        if (idx >= 0) next[idx] = { ...next[idx], quantity: Math.max(0, next[idx].quantity - to.quantity) };
      });
      tradeIntakeList.forEach(ti => {
        const idx = next.findIndex(i => i.id === ti.item.id);
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        } else {
          next.push({ ...ti.item, id: `${ti.item.id}-trd`, quantity: 1, isStarred: false });
        }
      });
      return next;
    });

    addAuditLog('TRADE', `Processed Trade Exchange ${newTx.id} with ${selectedCustomer.name} (${tender})`, newTx.id);
    handleClearTrade();
    alert(`✅ Trade Reconciled!\nIssued ${activeCompany.currencySymbol}${amt.toFixed(2)} (${tender}) to ${selectedCustomer.name}.`);
    setActiveScreen('inventory');
  };

  // CRM Handlers
  const handleAddCustomer = (newCust: CustomerProfile) => {
    setCustomers(prev => [newCust, ...prev]);
    setSelectedCustomer(newCust);
    addAuditLog('SETTINGS_UPDATE', `Registered CRM profile for ${newCust.name}`);
  };

  const handleUpdateCustomer = (updated: CustomerProfile) => {
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (selectedCustomer.id === updated.id) setSelectedCustomer(updated);
    addAuditLog('SETTINGS_UPDATE', `Updated CRM profile for ${updated.name}`);
  };

  const handlePingVendingUnit = (unitId: string) => {
    setVendingUnits(prev => prev.map(u => u.id === unitId ? { ...u, status: 'Online', lastPing: 'Just now' } : u));
    addAuditLog('VENDING_PING', `Manual IoT ping verified telemetry for unit ${unitId}`, unitId);
  };

  const handleToggleIntegration = (mktId: string) => {
    setIntegrations(prev => prev.map(m => m.id === mktId ? { ...m, status: m.status === 'Connected' ? 'Idle Sync' : 'Connected', lastSynced: 'Just now' } : m));
    addAuditLog('INTEGRATION_SYNC', `Toggled sync state for marketplace connector ${mktId}`, mktId);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased overflow-x-hidden flex flex-col select-none">
      <Navbar
        activeCompany={activeCompany}
        onCompanyChange={setActiveCompany}
        companies={TENANT_COMPANIES}
        activeLocation={activeLocation}
        onLocationChange={setActiveLocation}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        currentUser={CURRENT_USER}
      />

      <div className="flex flex-1 pt-16 min-h-[calc(100vh-64px)]">
        <Sidebar
          activeScreen={activeScreen}
          onScreenChange={setActiveScreen}
          activeCompanyName={activeCompany.name}
        />

        <main className="flex-1 md:ml-[240px] p-4 md:p-8 pb-24 md:pb-12 bg-[#f8f9ff] overflow-y-auto min-w-0">
          {activeScreen === 'dashboard' && (
            <DashboardScreen
              onScreenChange={setActiveScreen}
              inventory={inventory}
              transactions={transactions}
              activeLocation={activeLocation}
              currencySymbol={activeCompany.currencySymbol}
            />
          )}

          {activeScreen === 'pos' && (
            <POSScreen
              inventory={inventory}
              cart={posCart}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateCartQty}
              onUpdatePriceOverride={handleUpdatePriceOverride}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              selectedCustomer={selectedCustomer}
              onSwitchCustomer={setSelectedCustomer}
              customers={customers}
              onCheckout={handlePOSCheckout}
              taxRate={activeCompany.defaultTaxRate}
              currencySymbol={activeCompany.currencySymbol}
            />
          )}

          {activeScreen === 'inventory' && (
            <InventoryScreen
              inventory={inventory}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onToggleStar={handleToggleStar}
              onScreenChange={setActiveScreen}
              currencySymbol={activeCompany.currencySymbol}
              costMultiplier={activeCompany.defaultCostMultiplier}
            />
          )}

          {activeScreen === 'trades' && (
            <TradesScreen
              tradeIntakeList={tradeIntakeList}
              tradeOutgoList={tradeOutgoList}
              onAddIntake={handleAddTradeIntake}
              onAddOutgo={handleAddTradeOutgo}
              onUpdateIntakeCondition={handleUpdateIntakeCondition}
              onRemoveIntake={handleRemoveIntake}
              onRemoveOutgo={handleRemoveOutgo}
              onClearTrade={handleClearTrade}
              inventory={inventory}
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSwitchCustomer={setSelectedCustomer}
              onCompleteTrade={handleCompleteTrade}
              currencySymbol={activeCompany.currencySymbol}
            />
          )}

          {activeScreen === 'crm' && (
            <CRMScreen
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              transactions={transactions}
              currencySymbol={activeCompany.currencySymbol}
            />
          )}

          {activeScreen === 'reports' && (
            <ReportsScreen
              inventory={inventory}
              transactions={transactions}
              customers={customers}
              currencySymbol={activeCompany.currencySymbol}
            />
          )}

          {activeScreen === 'vending' && (
            <VendingScreen
              units={vendingUnits}
              onPingUnit={handlePingVendingUnit}
              currencySymbol={activeCompany.currencySymbol}
            />
          )}

          {activeScreen === 'integrations' && (
            <IntegrationsScreen
              integrations={integrations}
              onToggleSync={handleToggleIntegration}
            />
          )}

          {activeScreen === 'activity' && (
            <ActivityLogsScreen logs={activityLogs} />
          )}

          {activeScreen === 'scanner' && (
            <ScannerScreen
              inventory={inventory}
              onAddItem={handleAddItem}
              onAddToCart={(i) => { handleAddToCart(i); setActiveScreen('pos'); }}
              onAddToIntake={(i) => { handleAddTradeIntake(i); setActiveScreen('trades'); }}
              currencySymbol={activeCompany.currencySymbol}
            />
          )}

          {activeScreen === 'settings' && (
            <SettingsScreen activeLocation={activeLocation} />
          )}
        </main>
      </div>

      <MobileNav
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
      />
    </div>
  );
}
