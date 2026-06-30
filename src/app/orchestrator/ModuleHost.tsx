import { useCallback } from 'react';
import { useMockIntegrationsState } from '../../features/company/hooks/useMockIntegrationsState';
import { IntegrationsPage } from '../../features/company/pages/IntegrationsPage';
import { useMockCRMState } from '../../features/crm/hooks/useMockCRMState';
import { CRMPage } from '../../features/crm/pages/CRMPage';
import type { DashboardShellState } from '../../features/dashboard/types/shell.types';
import { DashboardHomePage } from '../../features/dashboard/pages/DashboardHomePage';
import { SettingsPage } from '../../features/dashboard/pages/SettingsPage';
import { useMockInventoryState } from '../../features/inventory/hooks/useMockInventoryState';
import { InventoryPage } from '../../features/inventory/pages/InventoryPage';
import { useMockPOSState } from '../../features/pos/hooks/useMockPOSState';
import { POSPage } from '../../features/pos/pages/POSPage';
import { useMockAuditState } from '../../features/reports/hooks/useMockAuditState';
import { useMockTransactionsState } from '../../features/reports/hooks/useMockTransactionsState';
import { ActivityPage } from '../../features/reports/pages/ActivityPage';
import { ReportsPage } from '../../features/reports/pages/ReportsPage';
import { ScannerPage } from '../../features/scanner/pages/ScannerPage';
import { useMockTradeState } from '../../features/trades/hooks/useMockTradeState';
import { TradesPage } from '../../features/trades/pages/TradesPage';
import { useMockVendingState } from '../../features/analytics/hooks/useMockVendingState';
import { VendingPage } from '../../features/analytics/pages/VendingPage';
import type { InventoryItem } from '../../types';

interface ModuleHostProps {
  shell: DashboardShellState;
}

/**
 * @deprecated Temporary cross-feature orchestration only.
 * Remove after Company + Inventory architecture is complete.
 */
export function ModuleHost({ shell }: ModuleHostProps) {
  const { activeScreen, setActiveScreen, activeCompany, activeLocation } = shell;

  const audit = useMockAuditState(activeCompany);
  const { transactions, setTransactions } = useMockTransactionsState();
  const inventoryState = useMockInventoryState({ activeCompany, addAuditLog: audit.addAuditLog });
  const crmState = useMockCRMState({ addAuditLog: audit.addAuditLog });

  const onCheckoutComplete = useCallback(() => setActiveScreen('dashboard'), [setActiveScreen]);
  const onTradeComplete = useCallback(() => setActiveScreen('inventory'), [setActiveScreen]);

  const posState = useMockPOSState({
    activeCompany,
    activeLocation,
    inventory: inventoryState.inventory,
    setInventory: inventoryState.setInventory,
    selectedCustomer: crmState.selectedCustomer,
    setCustomers: crmState.setCustomers,
    setTransactions,
    addAuditLog: audit.addAuditLog,
    onCheckoutComplete,
  });

  const tradeState = useMockTradeState({
    activeCompany,
    inventory: inventoryState.inventory,
    setInventory: inventoryState.setInventory,
    selectedCustomer: crmState.selectedCustomer,
    setCustomers: crmState.setCustomers,
    setTransactions,
    addAuditLog: audit.addAuditLog,
    onTradeComplete,
  });

  const vendingState = useMockVendingState({ addAuditLog: audit.addAuditLog });
  const integrationsState = useMockIntegrationsState({ addAuditLog: audit.addAuditLog });

  const handleScannerAddToCart = useCallback(
    (item: InventoryItem) => {
      posState.handleAddToCart(item);
      setActiveScreen('pos');
    },
    [posState.handleAddToCart, setActiveScreen]
  );

  const handleScannerAddToIntake = useCallback(
    (item: InventoryItem) => {
      tradeState.handleAddTradeIntake(item);
      setActiveScreen('trades');
    },
    [tradeState.handleAddTradeIntake, setActiveScreen]
  );

  switch (activeScreen) {
    case 'dashboard':
      return (
        <DashboardHomePage
          onScreenChange={setActiveScreen}
          inventory={inventoryState.inventory}
          transactions={transactions}
          activeLocation={activeLocation}
          currencySymbol={activeCompany.currencySymbol}
        />
      );
    case 'inventory':
      return (
        <InventoryPage
          inventory={inventoryState.inventory}
          onAddItem={inventoryState.handleAddItem}
          onUpdateItem={inventoryState.handleUpdateItem}
          onDeleteItem={inventoryState.handleDeleteItem}
          onToggleStar={inventoryState.handleToggleStar}
          onScreenChange={setActiveScreen}
          currencySymbol={activeCompany.currencySymbol}
          costMultiplier={activeCompany.defaultCostMultiplier}
        />
      );
    case 'pos':
      return (
        <POSPage
          inventory={inventoryState.inventory}
          cart={posState.posCart}
          onAddToCart={posState.handleAddToCart}
          onUpdateQuantity={posState.handleUpdateCartQty}
          onUpdatePriceOverride={posState.handleUpdatePriceOverride}
          onRemoveFromCart={posState.handleRemoveFromCart}
          onClearCart={posState.handleClearCart}
          selectedCustomer={crmState.selectedCustomer}
          onSwitchCustomer={crmState.setSelectedCustomer}
          customers={crmState.customers}
          onCheckout={posState.handlePOSCheckout}
          taxRate={activeCompany.defaultTaxRate}
          currencySymbol={activeCompany.currencySymbol}
        />
      );
    case 'scanner':
      return (
        <ScannerPage
          inventory={inventoryState.inventory}
          onAddItem={inventoryState.handleAddItem}
          onAddToCart={handleScannerAddToCart}
          onAddToIntake={handleScannerAddToIntake}
          currencySymbol={activeCompany.currencySymbol}
        />
      );
    case 'trades':
      return (
        <TradesPage
          tradeIntakeList={tradeState.tradeIntakeList}
          tradeOutgoList={tradeState.tradeOutgoList}
          onAddIntake={tradeState.handleAddTradeIntake}
          onAddOutgo={tradeState.handleAddTradeOutgo}
          onUpdateIntakeCondition={tradeState.handleUpdateIntakeCondition}
          onRemoveIntake={tradeState.handleRemoveIntake}
          onRemoveOutgo={tradeState.handleRemoveOutgo}
          onClearTrade={tradeState.handleClearTrade}
          inventory={inventoryState.inventory}
          customers={crmState.customers}
          selectedCustomer={crmState.selectedCustomer}
          onSwitchCustomer={crmState.setSelectedCustomer}
          onCompleteTrade={tradeState.handleCompleteTrade}
          currencySymbol={activeCompany.currencySymbol}
        />
      );
    case 'crm':
      return (
        <CRMPage
          customers={crmState.customers}
          onAddCustomer={crmState.handleAddCustomer}
          onUpdateCustomer={crmState.handleUpdateCustomer}
          transactions={transactions}
          currencySymbol={activeCompany.currencySymbol}
        />
      );
    case 'reports':
      return (
        <ReportsPage
          inventory={inventoryState.inventory}
          transactions={transactions}
          customers={crmState.customers}
          currencySymbol={activeCompany.currencySymbol}
        />
      );
    case 'vending':
      return (
        <VendingPage
          units={vendingState.vendingUnits}
          onPingUnit={vendingState.handlePingVendingUnit}
          currencySymbol={activeCompany.currencySymbol}
        />
      );
    case 'integrations':
      return (
        <IntegrationsPage
          integrations={integrationsState.integrations}
          onToggleSync={integrationsState.handleToggleIntegration}
        />
      );
    case 'activity':
      return <ActivityPage logs={audit.activityLogs} />;
    case 'settings':
      return <SettingsPage activeLocation={activeLocation} />;
    default:
      return null;
  }
}
