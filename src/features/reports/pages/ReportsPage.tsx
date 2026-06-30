import { ReportsScreen } from '../../../components/ReportsScreen';
import type { CustomerProfile, InventoryItem, TransactionRecord } from '../../../types';

interface ReportsPageProps {
  inventory: InventoryItem[];
  transactions: TransactionRecord[];
  customers: CustomerProfile[];
  currencySymbol: string;
}

export function ReportsPage(props: ReportsPageProps) {
  return <ReportsScreen {...props} />;
}
