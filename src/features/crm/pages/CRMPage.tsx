import { CRMScreen } from '../../../components/CRMScreen';
import type { CustomerProfile, TransactionRecord } from '../../../types';

interface CRMPageProps {
  customers: CustomerProfile[];
  onAddCustomer: (customer: CustomerProfile) => void;
  onUpdateCustomer: (customer: CustomerProfile) => void;
  transactions: TransactionRecord[];
  currencySymbol: string;
}

export function CRMPage(props: CRMPageProps) {
  return <CRMScreen {...props} />;
}
