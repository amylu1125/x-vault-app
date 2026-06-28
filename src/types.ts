export type NavScreen = 
  | 'dashboard' 
  | 'inventory' 
  | 'pos' 
  | 'trades' 
  | 'crm' 
  | 'reports' 
  | 'vending' 
  | 'integrations' 
  | 'activity' 
  | 'scanner' 
  | 'settings';

export type Role = 'Owner' | 'Admin' | 'Staff';

export interface TenantCompany {
  id: string;
  name: string;
  code: string;
  branchLocations: string[];
  defaultTaxRate: number;
  defaultCostMultiplier: number;
  currencySymbol: string;
}

export interface EmployeeUser {
  id: string;
  companyId: string;
  name: string;
  role: Role;
  email: string;
  avatarUrl: string;
  branchLocation: string;
  terminalId: string;
}

export type InventoryCategory = 
  | 'Raw Cards' 
  | 'Slabs' 
  | 'Sealed Products' 
  | 'Booster Boxes' 
  | 'ETBs' 
  | 'Accessories' 
  | 'Sleeves' 
  | 'Toploaders' 
  | 'Playmats' 
  | 'Beverages' 
  | 'Snacks' 
  | 'Merchandise' 
  | 'Other';

export type InventoryStatus = 'In Vault' | 'On Floor' | 'Reserved' | 'In Transit' | 'Vending Machine' | 'Sold';

export interface CardImageSet {
  primary: string;
  back?: string;
  detail?: string;
  ocrRaw?: string;
}

export interface InventoryItem {
  id: string; // e.g. VX-000001 permanent ID
  companyId: string;
  name: string;
  setName: string;
  cardNumber?: string;
  rarity?: string;
  gradingCompany?: 'Raw' | 'PSA' | 'CGC' | 'BGS' | 'SGC' | 'ALT';
  gradeValue?: string; // e.g. "10", "9.5", "NM"
  category: InventoryCategory;
  images: CardImageSet;
  purchaseCost: number;
  sellingPrice: number;
  quantity: number;
  supplierName?: string;
  paymentMethod?: string;
  storageLocation: string; // e.g. "Downtown Branch - Vault Bin A4"
  purchaseDate: string;
  notes?: string;
  status: InventoryStatus;
  isStarred?: boolean;
  marketPrice: number;
  priceTrend?: string;
}

export type LedgerActionType = 
  | 'ADD_ITEM' 
  | 'EDIT_ITEM' 
  | 'QTY_ADJUST' 
  | 'POS_SALE' 
  | 'TRADE_IN' 
  | 'TRADE_OUT' 
  | 'RETURN' 
  | 'STOCK_COUNT' 
  | 'DELETE_ITEM' 
  | 'VENDING_RESTOCK';

export interface InventoryLedgerEntry {
  id: string;
  itemId: string;
  itemPermanentId: string;
  itemName: string;
  companyId: string;
  actorName: string;
  actorRole: Role;
  actionType: LedgerActionType;
  quantityDelta: number;
  previousQuantity: number;
  newQuantity: number;
  costUnit: number;
  priceUnit: number;
  timestamp: string;
  notes?: string;
}

export interface CustomerProfile {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  loyaltyPoints: number;
  storeCreditBalance: number;
  lifetimeSpending: number;
  lifetimeTradesValue: number;
  memberSince: string;
  tradesCount: number;
  salesCount: number;
  avatarUrl: string;
  membershipTier: 'Silver' | 'Gold' | 'Apex VIP' | 'Guest';
  notes?: string;
}

export interface CartItem {
  item: InventoryItem;
  quantity: number;
  priceOverride?: number;
}

export interface TradeIntakeItem {
  id: string;
  item: InventoryItem;
  conditionPercentage: number;
  conditionLabel: string;
  valuationOverride?: number;
}

export interface TradeOutgoItem {
  id: string;
  item: InventoryItem;
  quantity: number;
}

export interface TransactionRecord {
  id: string;
  companyId: string;
  timestamp: string;
  customerName: string;
  customerId?: string;
  employeeName: string;
  itemsCount: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  tenderType: 'POS Sale' | 'Trade Exchange' | 'Vending Purchase';
  paymentMethods: string[];
  notes?: string;
}

export interface SystemActivityLog {
  id: string;
  companyId: string;
  timestamp: string;
  actorName: string;
  actionType: 'LOGIN' | 'LOGOUT' | 'INVENTORY_CHANGE' | 'SALE' | 'TRADE' | 'SETTINGS_UPDATE' | 'INTEGRATION_SYNC' | 'VENDING_PING';
  description: string;
  severity: 'info' | 'success' | 'warn' | 'error';
  ipAddress: string;
  targetResource?: string;
}

export interface VendingMachineUnit {
  id: string;
  companyId: string;
  name: string;
  locationName: string;
  status: 'Online' | 'Restock Needed' | 'Maintenance' | 'Syncing';
  temperatureC: number;
  signalStrength: string;
  lastPing: string;
  slotsCount: number;
  filledSlots: number;
  totalRevenueMonthly: number;
  qrActive: boolean;
}

export interface MarketplaceIntegration {
  id: string;
  platformName: 'TCGPlayer' | 'eBay' | 'Shopify' | 'Collectr' | 'PriceCharting' | 'PSA' | 'CGC' | 'BGS';
  status: 'Connected' | 'Idle Sync' | 'Requires Auth' | 'Disabled';
  lastSynced: string;
  itemsCountSynced: number;
  autoPriceSync: boolean;
  logoIcon: string;
}
