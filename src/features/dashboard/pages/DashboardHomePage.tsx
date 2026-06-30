import { DashboardScreen } from '../../../components/DashboardScreen';
import type { InventoryItem, NavScreen, TransactionRecord } from '../../../types';

interface DashboardHomePageProps {
  onScreenChange: (screen: NavScreen) => void;
  inventory: InventoryItem[];
  transactions: TransactionRecord[];
  activeLocation: string;
  currencySymbol: string;
}

export function DashboardHomePage({
  onScreenChange,
  inventory,
  transactions,
  activeLocation,
  currencySymbol,
}: DashboardHomePageProps) {
  return (
    <DashboardScreen
      onScreenChange={onScreenChange}
      inventory={inventory}
      transactions={transactions}
      activeLocation={activeLocation}
      currencySymbol={currencySymbol}
    />
  );
}
