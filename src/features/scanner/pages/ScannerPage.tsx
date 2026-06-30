import { ScannerScreen } from '../../../components/ScannerScreen';
import type { InventoryItem } from '../../../types';

interface ScannerPageProps {
  inventory: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onAddToCart: (item: InventoryItem) => void;
  onAddToIntake: (item: InventoryItem) => void;
  currencySymbol: string;
}

export function ScannerPage(props: ScannerPageProps) {
  return <ScannerScreen {...props} />;
}
