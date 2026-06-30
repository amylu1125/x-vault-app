import { TradesScreen } from '../../../components/TradesScreen';
import type { CustomerProfile, InventoryItem, TradeIntakeItem, TradeOutgoItem } from '../../../types';

interface TradesPageProps {
  tradeIntakeList: TradeIntakeItem[];
  tradeOutgoList: TradeOutgoItem[];
  onAddIntake: (item: InventoryItem) => void;
  onAddOutgo: (item: InventoryItem) => void;
  onUpdateIntakeCondition: (id: string, pct: number, label: string) => void;
  onRemoveIntake: (id: string) => void;
  onRemoveOutgo: (id: string) => void;
  onClearTrade: () => void;
  inventory: InventoryItem[];
  customers: CustomerProfile[];
  selectedCustomer: CustomerProfile;
  onSwitchCustomer: (customer: CustomerProfile) => void;
  onCompleteTrade: (tender: 'Cash' | 'Credit', amt: number) => void;
  currencySymbol: string;
}

export function TradesPage(props: TradesPageProps) {
  return <TradesScreen {...props} />;
}
