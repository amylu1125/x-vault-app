import React, { useState } from 'react';
import { InventoryItem, CartItem, CustomerProfile } from '../types';
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Tag, 
  UserPlus, 
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  Percent,
  Receipt
} from 'lucide-react';

interface POSScreenProps {
  inventory: InventoryItem[];
  cart: CartItem[];
  onAddToCart: (item: InventoryItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onUpdatePriceOverride: (itemId: string, newPrice: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
  selectedCustomer: CustomerProfile;
  onSwitchCustomer: (cust: CustomerProfile) => void;
  customers: CustomerProfile[];
  onCheckout: (tender: string, subtotal: number, tax: number, total: number) => void;
  taxRate: number;
  currencySymbol: string;
}

export const POSScreen: React.FC<POSScreenProps> = ({
  inventory,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onUpdatePriceOverride,
  onRemoveFromCart,
  onClearCart,
  selectedCustomer,
  onSwitchCustomer,
  customers,
  onCheckout,
  taxRate,
  currencySymbol,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceInput, setTempPriceInput] = useState('');

  const categories = ['All', 'Raw Cards', 'Slabs', 'Sealed Products', 'Booster Boxes', 'ETBs', 'Toploaders', 'Beverages'];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.setName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat && item.status !== 'Sold' && item.quantity > 0;
  });

  // Financial calculations
  const subtotal = cart.reduce((acc, i) => acc + (i.priceOverride ?? i.item.sellingPrice) * i.quantity, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const vipDiscount = selectedCustomer.membershipTier === 'Apex VIP' ? subtotal * 0.05 : 0;
  const totalAmount = Math.max(0, subtotal + taxAmount - vipDiscount);

  const handleStartEditPrice = (cartItem: CartItem) => {
    setEditingPriceId(cartItem.item.id);
    setTempPriceInput((cartItem.priceOverride ?? cartItem.item.sellingPrice).toString());
  };

  const handleSavePriceOverride = (itemId: string) => {
    const parsed = parseFloat(tempPriceInput);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdatePriceOverride(itemId, parsed);
    }
    setEditingPriceId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] animate-in fade-in">
      {/* Left 7 Cols: Catalog & SKU Finder */}
      <div className="lg:col-span-7 flex flex-col bg-white rounded-3xl border border-[#c5c5d7] p-5 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#c5c5d7]">
          <div>
            <h2 className="font-['Geist'] text-xl font-extrabold text-[#0525bb]">Retail POS Terminal</h2>
            <p className="text-xs text-gray-500">Fast barcode lookup & stock checkout</p>
          </div>

          <div className="flex items-center gap-2 bg-[#f8f9ff] px-3 py-2 rounded-xl border border-[#c5c5d7]/80 w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan SKU ID (e.g. VX-000001)..."
              className="bg-transparent border-none focus:outline-none text-xs w-full text-[#0b1c30]"
              autoFocus
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 shrink-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all font-['Geist'] ${
                selectedCategory === cat
                  ? 'bg-[#0525bb] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#444655] hover:bg-[#dae2fd]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto flex-1 pr-1">
          {filteredInventory.map((item) => {
            const inCart = cart.find((c) => c.item.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => onAddToCart(item)}
                className="bg-[#f8f9ff] rounded-2xl border border-[#c5c5d7]/70 hover:border-[#0525bb] p-3 flex flex-col justify-between cursor-pointer transition-all group relative active:scale-95 shadow-2xs hover:shadow-md select-none"
              >
                <div className="relative aspect-4/5 rounded-xl overflow-hidden mb-2.5 bg-white">
                  <img src={item.images.primary} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-1.5 left-1.5 bg-[#0525bb] text-white font-mono text-[9px] font-bold px-1 rounded">
                    {item.id}
                  </span>
                  {inCart && (
                    <span className="absolute top-1.5 right-1.5 bg-[#006b5f] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                      {inCart.quantity}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs text-[#0b1c30] line-clamp-2 leading-tight group-hover:text-[#0525bb]" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.setName}</p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#c5c5d7]/40">
                  <span className="font-['Geist'] font-extrabold text-xs text-[#0525bb]">{currencySymbol}{item.sellingPrice.toFixed(2)}</span>
                  <span className="text-[10px] font-semibold text-gray-500">Qty {item.quantity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 5 Cols: Cart & Checkout Ledger */}
      <div className="lg:col-span-5 flex flex-col bg-white rounded-3xl border border-[#c5c5d7] p-5 shadow-xs h-full">
        {/* Customer Header */}
        <div className="bg-[#eff4ff] p-3.5 rounded-2xl border border-[#c5c5d7]/80 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={selectedCustomer.avatarUrl} alt="Cust" className="w-9 h-9 rounded-full border object-cover bg-white" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs text-[#0b1c30] truncate">{selectedCustomer.name}</h4>
                <span className={`text-[9px] font-bold px-1 rounded uppercase ${
                  selectedCustomer.membershipTier === 'Apex VIP' ? 'bg-[#0525bb] text-white' : 'bg-[#dae2fd] text-[#0525bb]'
                }`}>
                  {selectedCustomer.membershipTier}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">Credit: {currencySymbol}{selectedCustomer.storeCreditBalance.toFixed(2)} • {selectedCustomer.loyaltyPoints} pts</p>
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const found = customers.find((c) => c.id === e.target.value);
                if (found) onSwitchCustomer(found);
              }}
              className="text-[11px] font-bold bg-white border border-[#0525bb] text-[#0525bb] px-2.5 py-1.5 rounded-xl cursor-pointer focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#c5c5d7]/60">
          <span className="text-xs font-bold text-gray-500 uppercase font-['Geist']">Active Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          {cart.length > 0 && (
            <button onClick={onClearCart} className="text-xs text-[#ba1a1a] hover:underline font-semibold flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[180px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
              <Receipt className="w-12 h-12 stroke-1 mb-2 text-gray-300" />
              <p className="text-xs font-bold">Cart is empty</p>
              <p className="text-[10px]">Click catalog items or scan barcode ID</p>
            </div>
          ) : (
            cart.map((cartItem) => {
              const currentPrice = cartItem.priceOverride ?? cartItem.item.sellingPrice;
              const isOverridden = cartItem.priceOverride !== undefined;

              return (
                <div key={cartItem.item.id} className="p-3 rounded-2xl bg-[#f8f9ff] border border-[#c5c5d7]/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img src={cartItem.item.images.primary} alt="" className="w-10 h-12 rounded-lg object-cover bg-white shrink-0 shadow-2xs" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0b1c30] truncate" title={cartItem.item.name}>{cartItem.item.name}</p>
                      <p className="text-[10px] font-mono text-[#0525bb]">{cartItem.item.id}</p>
                      
                      {/* Admin Price Override Controls */}
                      <div className="flex items-center gap-1.5 mt-1">
                        {editingPriceId === cartItem.item.id ? (
                          <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-[#0525bb]">
                            <span className="text-[10px] font-bold">{currencySymbol}</span>
                            <input
                              type="number"
                              step="0.01"
                              value={tempPriceInput}
                              onChange={(e) => setTempPriceInput(e.target.value)}
                              className="w-16 text-[11px] font-bold text-[#0525bb] focus:outline-none"
                              autoFocus
                            />
                            <button onClick={() => handleSavePriceOverride(cartItem.item.id)} className="text-[10px] bg-[#0525bb] text-white px-1 rounded font-bold">✓</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditPrice(cartItem)}
                            className={`text-[11px] font-extrabold flex items-center gap-1 hover:underline ${
                              isOverridden ? 'text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.2 rounded' : 'text-[#0525bb]'
                            }`}
                            title="Admin override selling price"
                          >
                            <Tag className="w-2.5 h-2.5" /> {currencySymbol}{currentPrice.toFixed(2)}
                            {isOverridden && <span className="text-[9px] uppercase">(Override)</span>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Spinner */}
                  <div className="flex items-center gap-2 shrink-0 bg-white border border-[#c5c5d7] rounded-xl p-1 shadow-2xs">
                    <button
                      onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-[#eff4ff] hover:bg-[#dae2fd] text-[#0525bb] flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-['Geist'] font-extrabold text-xs">{cartItem.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(cartItem.item.id, +1)}
                      disabled={cartItem.quantity >= cartItem.item.quantity}
                      className="w-6 h-6 rounded-lg bg-[#0525bb] hover:bg-[#2e44d1] disabled:opacity-40 text-white flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Totals & Tender Panel */}
        <div className="mt-auto pt-4 border-t border-[#c5c5d7] space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Subtotal</span>
            <span className="font-bold text-[#0b1c30]">{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Configurable Tax ({taxRate}%)</span>
            <span className="font-bold text-[#0b1c30]">+{currencySymbol}{taxAmount.toFixed(2)}</span>
          </div>
          {vipDiscount > 0 && (
            <div className="flex justify-between text-xs text-[#006b5f] font-semibold">
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> VIP Loyalty Benefit (5%)</span>
              <span>-{currencySymbol}{vipDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 border-t border-b border-[#c5c5d7] my-2">
            <span className="font-['Geist'] font-extrabold text-base text-[#0b1c30]">Total Due</span>
            <span className="font-['Geist'] font-extrabold text-2xl text-[#0525bb]">{currencySymbol}{totalAmount.toFixed(2)}</span>
          </div>

          {/* Tender Checkout Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              disabled={cart.length === 0}
              onClick={() => onCheckout('Instant Cash', subtotal, taxAmount, totalAmount)}
              className="py-3.5 bg-[#eff4ff] hover:bg-[#dae2fd] disabled:opacity-40 text-[#0525bb] font-['Geist'] font-extrabold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1 active:scale-95 border border-[#0525bb]/20"
            >
              <Banknote className="w-4 h-4" /> Cash Tender
            </button>

            <button
              disabled={cart.length === 0}
              onClick={() => onCheckout('Credit Card / Apple Pay', subtotal, taxAmount, totalAmount)}
              className="py-3.5 bg-[#0525bb] hover:bg-[#2e44d1] disabled:opacity-40 text-white font-['Geist'] font-extrabold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1 active:scale-95 shadow-md"
            >
              <CreditCard className="w-4 h-4" /> Card Register
            </button>

            <button
              disabled={cart.length === 0 || selectedCustomer.storeCreditBalance < totalAmount}
              onClick={() => onCheckout('Store Credit Balance', subtotal, taxAmount, totalAmount)}
              className="py-3.5 bg-[#006b5f] hover:bg-[#005148] disabled:opacity-40 text-white font-['Geist'] font-extrabold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1 active:scale-95 shadow-md"
              title={selectedCustomer.storeCreditBalance < totalAmount ? 'Insufficient store credit' : 'Deduct from customer credit'}
            >
              <Tag className="w-4 h-4 text-[#44e1d1]" /> Store Credit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
