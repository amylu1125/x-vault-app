import React from 'react';
import { NavScreen, InventoryItem, TransactionRecord } from '../types';
import { 
  DollarSign, 
  Package, 
  ArrowUpRight, 
  Activity, 
  Plus, 
  ShoppingCart, 
  ArrowLeftRight, 
  ScanLine, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  Store,
  Bot
} from 'lucide-react';

interface DashboardProps {
  onScreenChange: (screen: NavScreen) => void;
  inventory: InventoryItem[];
  transactions: TransactionRecord[];
  activeLocation: string;
  currencySymbol: string;
}

export const DashboardScreen: React.FC<DashboardProps> = ({
  onScreenChange,
  inventory,
  transactions,
  activeLocation,
  currencySymbol,
}) => {
  // Calculations
  const totalValuation = inventory.reduce((acc, item) => acc + item.marketPrice * item.quantity, 0);
  const totalCost = inventory.reduce((acc, item) => acc + item.purchaseCost * item.quantity, 0);
  const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const todaySales = transactions
    .filter((tx) => tx.tenderType === 'POS Sale' || tx.tenderType === 'Vending Purchase')
    .reduce((acc, tx) => acc + tx.totalAmount, 0);

  const starredItems = inventory.filter((i) => i.isStarred);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#0525bb] via-[#2e44d1] to-[#006b5f] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold font-['Geist'] uppercase tracking-wider text-[#d3e4fe]">
            <ShieldCheck className="w-4 h-4 text-[#44e1d1]" /> Live Multi-Tenant Operating System
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold font-['Geist'] tracking-tight">
            Enterprise Command Center
          </h2>
          <p className="text-sm text-blue-100 max-w-xl">
            Real-time synchronization active across vault safes, retail POS terminals, and automated smart vending units at <strong className="text-white underline decoration-[#44e1d1]">{activeLocation}</strong>.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onScreenChange('pos')}
            className="bg-white text-[#0525bb] px-5 py-3 rounded-2xl font-['Geist'] font-extrabold text-xs uppercase tracking-wider shadow-xl hover:bg-[#dae2fd] transition-all flex items-center gap-2 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 text-[#0525bb]" /> Launch POS
          </button>
          <button
            onClick={() => onScreenChange('trades')}
            className="bg-[#006b5f] text-white border border-[#44e1d1]/40 px-5 py-3 rounded-2xl font-['Geist'] font-extrabold text-xs uppercase tracking-wider shadow-xl hover:bg-[#005148] transition-all flex items-center gap-2 active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#44e1d1]" /> Trade Engine
          </button>
          <button
            onClick={() => onScreenChange('scanner')}
            className="bg-white/15 backdrop-blur-md hover:bg-white/25 text-white border border-white/20 px-4 py-3 rounded-2xl font-['Geist'] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <ScanLine className="w-4 h-4" /> OCR Magic
          </button>
        </div>

        {/* Decorative Graphic */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none">
          <Store className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7]/70 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#757686] uppercase tracking-wider font-['Geist']">Vault Market Value</p>
            <p className="text-2xl font-extrabold text-[#0525bb] font-['Geist'] mt-1">{currencySymbol}{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-[#006b5f] font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14.2% catalog index
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#0525bb] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7]/70 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#757686] uppercase tracking-wider font-['Geist']">Inventory Units</p>
            <p className="text-2xl font-extrabold text-[#0b1c30] font-['Geist'] mt-1">{totalItems.toLocaleString()} <span className="text-sm font-normal text-gray-500">SKUs</span></p>
            <p className="text-[10px] text-gray-500 mt-1">Acquisition cost: {currencySymbol}{totalCost.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#006b5f] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7]/70 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#757686] uppercase tracking-wider font-['Geist']">Today's Revenue</p>
            <p className="text-2xl font-extrabold text-[#006b5f] font-['Geist'] mt-1">{currencySymbol}{todaySales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-[#006b5f] font-bold flex items-center gap-1 mt-1">
              <Activity className="w-3 h-3" /> POS & Vending live
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#0525bb] flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7]/70 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#757686] uppercase tracking-wider font-['Geist']">Vending Fleet Bot</p>
            <p className="text-2xl font-extrabold text-[#0525bb] font-['Geist'] mt-1">3 Units <span className="text-xs font-bold text-[#006b5f]">● ONLINE</span></p>
            <p className="text-[10px] text-gray-500 mt-1">Stripe QR auto-restocking</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#0525bb] flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Starred Assets & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#c5c5d7] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#0525bb]" />
                <h3 className="font-['Geist'] font-extrabold text-lg text-[#0b1c30]">Starred Grail Assets</h3>
              </div>
              <button
                onClick={() => onScreenChange('inventory')}
                className="text-xs font-bold font-['Geist'] text-[#0525bb] hover:underline uppercase tracking-wider"
              >
                View Full Catalog ({inventory.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {starredItems.slice(0, 4).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#c5c5d7]/70 hover:border-[#0525bb] transition-all flex gap-3.5 items-center group">
                  <img src={item.images.primary} alt={item.name} className="w-16 h-20 rounded-xl object-cover shadow-sm shrink-0 bg-white" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono font-bold bg-[#0525bb] text-white px-1.5 py-0.5 rounded">
                      {item.id}
                    </span>
                    <h4 className="font-bold text-xs text-[#0b1c30] truncate mt-1 group-hover:text-[#0525bb] transition-colors" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-gray-500">{item.setName} • {item.gradingCompany} {item.gradeValue}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#c5c5d7]/50">
                      <span className="text-xs font-extrabold text-[#0525bb]">{currencySymbol}{item.sellingPrice.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-[#006b5f]">{item.quantity} in vault</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Module Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onScreenChange('crm')}
              className="bg-white p-4 rounded-2xl border border-[#c5c5d7] hover:border-[#0525bb] hover:bg-[#eff4ff] transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-9 h-9 rounded-xl bg-[#dae2fd] text-[#0525bb] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-['Geist'] font-extrabold text-xs text-[#0b1c30]">CRM & Loyalty</p>
                <p className="text-[10px] text-gray-500 mt-0.5">VIP spend tiers</p>
              </div>
            </button>

            <button
              onClick={() => onScreenChange('reports')}
              className="bg-white p-4 rounded-2xl border border-[#c5c5d7] hover:border-[#0525bb] hover:bg-[#eff4ff] transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-9 h-9 rounded-xl bg-[#dae2fd] text-[#006b5f] flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="font-['Geist'] font-extrabold text-xs text-[#0b1c30]">BI Reports</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Profit & export</p>
              </div>
            </button>

            <button
              onClick={() => onScreenChange('vending')}
              className="bg-white p-4 rounded-2xl border border-[#c5c5d7] hover:border-[#0525bb] hover:bg-[#eff4ff] transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-9 h-9 rounded-xl bg-[#dae2fd] text-[#0525bb] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-['Geist'] font-extrabold text-xs text-[#0b1c30]">Vending Fleet</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Remote health sync</p>
              </div>
            </button>

            <button
              onClick={() => onScreenChange('activity')}
              className="bg-white p-4 rounded-2xl border border-[#c5c5d7] hover:border-[#0525bb] hover:bg-[#eff4ff] transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-9 h-9 rounded-xl bg-[#dae2fd] text-[#0b1c30] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="font-['Geist'] font-extrabold text-xs text-[#0b1c30]">Activity Audit</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Staff audit logs</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Live Transaction Feed */}
        <div className="bg-white rounded-3xl p-6 border border-[#c5c5d7] shadow-xs flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#c5c5d7]">
            <h3 className="font-['Geist'] font-extrabold text-base text-[#0b1c30]">Live Transaction Stream</h3>
            <span className="text-[10px] bg-[#eff4ff] text-[#0525bb] px-2 py-0.5 rounded-full font-bold">Realtime</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#c5c5d7]/60 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-['Geist'] ${
                      tx.tenderType === 'POS Sale' ? 'bg-[#0525bb] text-white' :
                      tx.tenderType === 'Trade Exchange' ? 'bg-[#006b5f] text-white' : 'bg-purple-600 text-white'
                    }`}>
                      {tx.tenderType}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">{tx.id}</span>
                  </div>
                  <p className="text-xs font-bold text-[#0b1c30] truncate mt-1">{tx.customerName}</p>
                  <p className="text-[10px] text-gray-500">{tx.itemsCount} items • {tx.paymentMethods[0]}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-[#0525bb] font-['Geist']">{currencySymbol}{tx.totalAmount.toFixed(2)}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{tx.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onScreenChange('reports')}
            className="w-full mt-4 py-2.5 bg-[#eff4ff] text-[#0525bb] font-['Geist'] font-bold text-xs rounded-xl hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-1.5"
          >
            Open Full BI Ledger <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
