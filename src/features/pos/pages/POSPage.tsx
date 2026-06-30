import { POSScreen } from '../../../components/POSScreen';
import type { CartItem, CustomerProfile, InventoryItem } from '../../../types';

interface POSPageProps {
  inventory: InventoryItem[];
  cart: CartItem[];
  onAddToCart: (item: InventoryItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onUpdatePriceOverride: (itemId: string, newPrice: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
  selectedCustomer: CustomerProfile;
  onSwitchCustomer: (customer: CustomerProfile) => void;
  customers: CustomerProfile[];
  onCheckout: (tender: string, subtotal: number, tax: number, total: number) => void;
  taxRate: number;
  currencySymbol: string;
}

export function POSPage(props: POSPageProps) {
  return <POSScreen {...props} />;
}
