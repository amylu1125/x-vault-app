import React, { useState } from 'react';
import { InventoryItem, TradeIntakeItem, TradeOutgoItem, CustomerProfile } from '../types';
import { 
  ArrowLeftRight, 
  Plus, 
  Trash2, 
  Search, 
  Percent, 
  DollarSign, 
  CheckCircle2, 
  User, 
  SlidersHorizontal,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  ShieldCheck
} from 'lucide-react';

interface TradesScreenProps {
  tradeIntakeList: TradeIntakeItem[];
  tradeOutgoList: TradeOutgoItem[];
  onAddIntake: (item: InventoryItem) => void;
  onAddOutgo: (item: InventoryItem) => void;
  onUpdateIntakeCondition: (id: string, percentage: number, label: string) => void;
  onRemoveIntake: (id: string) => void;
  onRemoveOutgo: (id: string) => void;
  onClearTrade: () => void;
  inventory: InventoryItem[];
  customers: CustomerProfile[];
  selectedCustomer: CustomerProfile;
  onSwitchCustomer: (cust: CustomerProfile) => void;
  onCompleteTrade: (tender: 'Cash' | 'Credit', netCashAmt: number) => void;
  currencySymbol: string;
}

export const TradesScreen: React.FC<TradesScreenProps> = ({
  tradeIntakeList,
  tradeOutgoList,
  onAddIntake,
  onAddOutgo,
  onUpdateIntakeCondition,
  onRemoveIntake,
  onRemoveOutgo,
  onClearTrade,
  inventory,
  customers,
  selectedCustomer,
  onSwitchCustomer,
  onCompleteTrade,
  currencySymbol,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'intake' | 'outgo'>('intake');

  const conditions = [
    { label: 'Mint / PSA 10 (100%)', pct: 100 },
    { label: 'Near Mint (90%)', pct: 90 },
    { label: 'Lightly Played (75%)', pct: 75 },
    { label: 'Moderately Played (60%)', pct: 60 },
    { label: 'Heavily Played / Damaged (40%)', pct: 40 },
  ];

  const filteredInventory = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Financial Valuations
  const intakeTotalValuation = tradeIntakeList.reduce(
    (acc, item) => acc + (item.valuationOverride ?? item.item.marketPrice * (item.conditionPercentage / 100)),
    0
  );

  const outgoTotalValuation = tradeOutgoList.reduce(
    (acc, item) => acc + item.item.sellingPrice * item.quantity,
    0
  );

  // Cash diff
  const netDifference = intakeTotalValuation - outgoTotalValuation;
  const cashOffer = netDifference > 0 ? netDifference * 0.70 : netDifference; // 70% cash buyout rate on surplus
  const creditOffer = netDifference > 0 ? netDifference * 0.85 : netDifference; // 85% store credit rate on surplus

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in h-[calc(100vh-140px)]">
      {/* Left 6 Cols: Catalog & Selector */}
      <div className="lg:col-span-6 bg-white rounded-3xl border border-[#c5c5d7] p-5 shadow-xs flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#c5c5d7]">
          <div>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-[#006b5f]" />
              <h2 className="font-['Geist'] text-xl font-extrabold text-[#006b5f]">Enterprise Trade Engine</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Dual intake & outgo ledger reconciliation</p>
          </div>

          <div className="flex bg-[#eff4ff] p-1 rounded-xl border border-[#c5c5d7]">
            <button
              onClick={() => setActiveTab('intake')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'intake' ? 'bg-[#006b5f] text-white shadow-sm' : 'text-[#444655]'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" /> Customer Intake ({tradeIntakeList.length})
            </button>
            <button
              onClick={() => setActiveTab('outgo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'outgo' ? 'bg-[#0525bb] text-white shadow-sm' : 'text-[#444655]'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Store Outgo ({tradeOutgoList.length})
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 bg-[#f8f9ff] px-3.5 py-2 rounded-xl border border-[#c5c5d7] mb-3 shrink-0">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'intake' ? 'Search SKU or scan customer card to intake...' : 'Search store vault inventory to trade out...'}
            className="bg-transparent border-none focus:outline-none text-xs w-full text-[#0b1c30]"
          />
        </div>

        {/* Catalog List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto flex-1 pr-1">
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              onClick={() => (activeTab === 'intake' ? onAddIntake(item) : onAddOutgo(item))}
              className="bg-[#f8f9ff] rounded-2xl border border-[#c5c5d7]/70 hover:border-[#006b5f] p-3 flex flex-col justify-between cursor-pointer transition-all active:scale-95 group select-none shadow-2xs"
            >
              <div className="aspect-4/5 rounded-xl overflow-hidden mb-2 bg-white relative">
                <img src={item.images.primary} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-1 left-1 bg-[#0525bb] text-white font-mono text-[9px] font-bold px-1 rounded">
                  {item.id}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0b1c30] truncate group-hover:text-[#006b5f]">{item.name}</h4>
                <p className="text-[10px] text-gray-500 truncate">{item.setName}</p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#c5c5d7]/40">
                <span className="font-['Geist'] font-extrabold text-xs text-[#006b5f]">{currencySymbol}{item.marketPrice.toFixed(2)}</span>
                <span className="text-[9px] font-bold bg-[#dae2fd] text-[#0525bb] px-1.5 py-0.2 rounded">+ {activeTab}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right 6 Cols: Dual Ledger Reconciliation Table */}
      <div className="lg:col-span-6 bg-white rounded-3xl border border-[#c5c5d7] p-5 shadow-xs flex flex-col h-full">
        {/* Customer Header */}
        <div className="bg-[#eff4ff] p-3.5 rounded-2xl border border-[#c5c5d7] flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <img src={selectedCustomer.avatarUrl} alt="" className="w-9 h-9 rounded-full border object-cover bg-white" />
            <div>
              <p className="text-xs font-bold text-[#0b1c30]">{selectedCustomer.name}</p>
              <p className="text-[10px] text-gray-500">Lifetime trades: {currencySymbol}{selectedCustomer.lifetimeTradesValue.toFixed(2)}</p>
            </div>
          </div>
          <select
            value={selectedCustomer.id}
            onChange={(e) => {
              const found = customers.find((c) => c.id === e.target.value);
              if (found) onSwitchCustomer(found);
            }}
            className="text-xs font-bold bg-white border border-[#006b5f] text-[#006b5f] px-2.5 py-1.5 rounded-xl"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Dual List Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Section 1: Intake Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#006b5f] uppercase tracking-wider bg-[#b6f2ea]/30 px-3 py-1.5 rounded-xl border border-[#006b5f]/20 font-['Geist']">
              <span>📉 Customer Trade-In Assets ({tradeIntakeList.length})</span>
              <span>Sub: {currencySymbol}{intakeTotalValuation.toFixed(2)}</span>
            </div>

            {tradeIntakeList.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center py-4 italic">No trade-in items intaked yet.</p>
            ) : (
              tradeIntakeList.map((tItem) => {
                const val = tItem.valuationOverride ?? tItem.item.marketPrice * (tItem.conditionPercentage / 100);
                return (
                  <div key={tItem.id} className="p-3 rounded-xl bg-[#f8f9ff] border border-[#c5c5d7]/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img src={tItem.item.images.primary} alt="" className="w-9 h-11 rounded object-cover bg-white shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#0b1c30] truncate">{tItem.item.name}</p>
                        <select
                          value={tItem.conditionPercentage}
                          onChange={(e) => {
                            const found = conditions.find((c) => c.pct === parseInt(e.target.value));
                            if (found) onUpdateIntakeCondition(tItem.id, found.pct, found.label);
                          }}
                          className="text-[10px] font-bold bg-[#eff4ff] text-[#006b5f] border border-[#006b5f]/30 rounded px-1.5 py-0.5 mt-1 focus:outline-none"
                        >
                          {conditions.map((cond) => (
                            <option key={cond.pct} value={cond.pct}>{cond.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-['Geist'] font-extrabold text-xs text-[#006b5f]">{currencySymbol}{val.toFixed(2)}</span>
                      <button onClick={() => onRemoveIntake(tItem.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Section 2: Store Outgo Items */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0525bb] uppercase tracking-wider bg-[#dae2fd]/40 px-3 py-1.5 rounded-xl border border-[#0525bb]/20 font-['Geist']">
              <span>📦 Store Vault Trade-Outs ({tradeOutgoList.length})</span>
              <span>Sub: {currencySymbol}{outgoTotalValuation.toFixed(2)}</span>
            </div>

            {tradeOutgoList.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center py-4 italic">No store cards selected to trade out.</p>
            ) : (
              tradeOutgoList.map((oItem) => (
                <div key={oItem.id} className="p-3 rounded-xl bg-[#f8f9ff] border border-[#c5c5d7]/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img src={oItem.item.images.primary} alt="" className="w-9 h-11 rounded object-cover bg-white shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0b1c30] truncate">{oItem.item.name}</p>
                      <p className="text-[10px] font-mono text-[#0525bb]">{oItem.item.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-['Geist'] font-extrabold text-xs text-[#0525bb]">{currencySymbol}{oItem.item.sellingPrice.toFixed(2)}</span>
                    <button onClick={() => onRemoveOutgo(oItem.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trade Settlement Panel */}
        <div className="mt-auto pt-4 border-t border-[#c5c5d7] space-y-3 bg-[#f8f9ff] -mx-5 -mb-5 p-5 rounded-b-3xl">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-600">Reconciliation Net Cash Diff:</span>
            <span className={`font-['Geist'] font-extrabold text-base ${netDifference >= 0 ? 'text-[#006b5f]' : 'text-[#ba1a1a]'}`}>
              {netDifference >= 0 ? `Customer Surplus +${currencySymbol}${netDifference.toFixed(2)}` : `Customer Owes ${currencySymbol}${Math.abs(netDifference).toFixed(2)}`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              disabled={tradeIntakeList.length === 0 && tradeOutgoList.length === 0}
              onClick={() => onCompleteTrade('Cash', cashOffer)}
              className="py-3 bg-white border border-[#006b5f] hover:bg-[#b6f2ea]/30 disabled:opacity-40 text-[#006b5f] font-['Geist'] font-extrabold text-xs rounded-xl transition-all shadow-xs flex flex-col items-center justify-center gap-0.5"
            >
              <span>Instant Cash Buyout</span>
              <span className="text-[11px] font-mono">Pay {currencySymbol}{cashOffer.toFixed(2)} (70%)</span>
            </button>

            <button
              disabled={tradeIntakeList.length === 0 && tradeOutgoList.length === 0}
              onClick={() => onCompleteTrade('Credit', creditOffer)}
              className="py-3 bg-[#006b5f] hover:bg-[#005148] disabled:opacity-40 text-white font-['Geist'] font-extrabold text-xs rounded-xl transition-all shadow-md flex flex-col items-center justify-center gap-0.5"
            >
              <span>Store Credit Bonus</span>
              <span className="text-[11px] font-mono text-[#b6f2ea]">Issue {currencySymbol}{creditOffer.toFixed(2)} (85%)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
