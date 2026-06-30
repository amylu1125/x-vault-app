import { InventoryScreen } from '../../../components/InventoryScreen';
import type { InventoryItem, NavScreen } from '../../../types';

interface InventoryPageProps {
  inventory: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleStar: (id: string) => void;
  onScreenChange: (screen: NavScreen) => void;
  currencySymbol: string;
  costMultiplier: number;
}

export function InventoryPage(props: InventoryPageProps) {
  return <InventoryScreen {...props} />;
}
