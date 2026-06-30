import { VendingScreen } from '../../../components/VendingScreen';
import type { VendingMachineUnit } from '../../../types';

interface VendingPageProps {
  units: VendingMachineUnit[];
  onPingUnit: (unitId: string) => void;
  currencySymbol: string;
}

export function VendingPage(props: VendingPageProps) {
  return <VendingScreen {...props} />;
}
