import React, { useState } from 'react';
import { InventoryItem, TransactionRecord, CustomerProfile } from '../types';
import { 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Package, 
  PieChart, 
  BarChart3, 
  Calendar, 
  Users, 
  Award, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ReportsScreenProps {
  inventory: InventoryItem[];
  transactions: TransactionRecord[];
  customers: CustomerProfile[];
  currencySymbol: string;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  inventory,
  transactions,
  customers,
  currencySymbol,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'financials' | 'inventory_bi' | 'rankings'>('financials');

  // BI Calculations
  const totalValuation = inventory.reduce((acc, i) => acc + i.marketPrice * i.quantity, 0);
  const totalCost = inventory.reduce((acc, i) => acc + i.purchaseCost * i.quantity, 0);
  const estProfitPotential = totalValuation - totalCost;

  const totalSalesRev = transactions
    .filter((tx) => tx.tenderType === 'POS Sale' || tx.tenderType === 'Vending Purchase')
    .reduce((acc, tx) => acc + tx.totalAmount, 0);

  const totalTaxCollected = transactions.reduce((acc, tx) => acc + tx.taxAmount, 0);

  const bestSellers = [...inventory].sort((a, b) => b.sellingPrice - a.sellingPrice).slice(0, 5);
  const deadInventory = inventory.filter((i) => i.quantity > 10 && !i.isStarred);
  const rankedCustomers = [...customers].sort((a, b) => b.lifetimeSpending - a.lifetimeSpending);

  const handleSimulateExport = (format: 'CSV' | 'Excel') => {
    alert(`📥 Generating automated BI report in ${format} format. Downloading tenant snapshot...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#c5c5d7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-['Geist'] text-2xl font-extrabold text-[#0525bb]">Automated BI Reports & Ledgers</h2>
            <span className="text-[10px] font-bold bg-[#eff4ff] text-[#0525bb] px-2 py-0.5 rounded uppercase font-['Geist']">Auto Generated</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time financial synthesis computed directly from immutable tenant transaction records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleSimulateExport('CSV')}
            className="px-4 py-2.5 rounded-xl border border-[#006b5f] text-[#006b5f] bg-white text-xs font-extrabold font-['Geist'] uppercase tracking-wider hover:bg-[#b6f2ea]/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => handleSimulateExport('Excel')}
            className="px-4 py-2.5 rounded-xl bg-[#006b5f] text-white text-xs font-extrabold font-['Geist'] uppercase tracking-wider shadow-md hover:bg-[#005148] transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#44e1d1]" /> Export Excel
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7] shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase font-['Geist']">Catalog Valuation Index</p>
          <p className="text-2xl font-extrabold text-[#0525bb] font-['Geist'] mt-1">{currencySymbol}{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-gray-400 mt-1">Acquisition cost: {currencySymbol}{totalCost.toLocaleString()}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7] shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase font-['Geist']">Gross Profit Potential</p>
          <p className="text-2xl font-extrabold text-[#006b5f] font-['Geist'] mt-1">{currencySymbol}{estProfitPotential.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-[#006b5f] font-bold mt-1">+{((estProfitPotential / (totalCost || 1)) * 100).toFixed(1)}% portfolio margin</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7] shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase font-['Geist']">Recorded Sales Rev</p>
          <p className="text-2xl font-extrabold text-[#0b1c30] font-['Geist'] mt-1">{currencySymbol}{totalSalesRev.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-gray-400 mt-1">Configurable tax out: {currencySymbol}{totalTaxCollected.toFixed(2)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7] shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase font-['Geist']">Trade Statistics</p>
          <p className="text-2xl font-extrabold text-[#0525bb] font-['Geist'] mt-1">{transactions.filter(t => t.tenderType === 'Trade Exchange').length} Settlements</p>
          <p className="text-[10px] text-gray-400 mt-1">Dual intake/outgo reconciliation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-[#c5c5d7] gap-2 w-fit">
        <button
          onClick={() => setActiveReportTab('financials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-['Geist'] transition-all ${
            activeReportTab === 'financials' ? 'bg-[#0525bb] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          💰 Profit & Loss Ledger
        </button>
        <button
          onClick={() => setActiveReportTab('inventory_bi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-['Geist'] transition-all ${
            activeReportTab === 'inventory_bi' ? 'bg-[#006b5f] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📦 Best Sellers & Dead Stock
        </button>
        <button
          onClick={() => setActiveReportTab('rankings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-['Geist'] transition-all ${
            activeReportTab === 'rankings' ? 'bg-[#0525bb] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🏆 Customer & Staff Rankings
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-3xl p-6 border border-[#c5c5d7] shadow-xs">
        {activeReportTab === 'financials' && (
          <div className="space-y-6">
            <h3 className="font-['Geist'] font-extrabold text-lg text-[#0b1c30] border-b border-[#c5c5d7] pb-3">
              Daily / Weekly / Monthly Financial Snapshot
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#0525bb]/20">
                <p className="text-xs font-bold text-[#0525bb] uppercase">Daily Snapshot (Today)</p>
                <p className="text-2xl font-extrabold text-[#0b1c30] font-['Geist'] mt-2">{currencySymbol}{totalSalesRev.toFixed(2)}</p>
                <p className="text-[10px] text-gray-600 mt-1">POS & Vending live registers</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#0525bb]/20">
                <p className="text-xs font-bold text-[#0525bb] uppercase">Weekly Run-Rate Est.</p>
                <p className="text-2xl font-extrabold text-[#0b1c30] font-['Geist'] mt-2">{currencySymbol}{(totalSalesRev * 6.8).toFixed(2)}</p>
                <p className="text-[10px] text-gray-600 mt-1">Projected from historical velocity</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#b6f2ea]/40 border border-[#006b5f]/30">
                <p className="text-xs font-bold text-[#006b5f] uppercase">Monthly Revenue Est.</p>
                <p className="text-2xl font-extrabold text-[#006b5f] font-['Geist'] mt-2">{currencySymbol}{(totalSalesRev * 29.5).toFixed(2)}</p>
                <p className="text-[10px] text-[#006b5f] font-semibold mt-1">Targeting {currencySymbol}45,000 quota</p>
              </div>
            </div>

            <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-[#c5c5d7]/70 text-xs text-gray-600 flex items-center justify-between">
              <span>● Automated accounting engine verifies transaction timestamps every 60 seconds.</span>
              <span className="font-mono text-[10px] text-[#0525bb] font-bold">LEDGER_SYNC_IMMUTABLE</span>
            </div>
          </div>
        )}

        {activeReportTab === 'inventory_bi' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#c5c5d7] mb-4">
                <h3 className="font-['Geist'] font-extrabold text-base text-[#006b5f]">🔥 Best Selling Catalog Assets</h3>
                <span className="text-[10px] bg-[#b6f2ea] text-[#006b5f] px-2 py-0.5 rounded font-bold">Top Velocity</span>
              </div>
              <div className="space-y-3">
                {bestSellers.map((item, index) => (
                  <div key={item.id} className="p-3 rounded-xl bg-[#f8f9ff] border border-[#c5c5d7]/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#0525bb] text-white font-extrabold font-['Geist'] text-xs flex items-center justify-center">
                        #{index + 1}
                      </span>
                      <img src={item.images.primary} alt="" className="w-8 h-10 rounded object-cover bg-white" />
                      <div>
                        <p className="font-bold text-xs text-[#0b1c30] truncate max-w-[180px]">{item.name}</p>
                        <p className="text-[10px] font-mono text-gray-400">{item.id}</p>
                      </div>
                    </div>
                    <span className="font-['Geist'] font-extrabold text-xs text-[#0525bb]">{currencySymbol}{item.sellingPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#c5c5d7] mb-4">
                <h3 className="font-['Geist'] font-extrabold text-base text-[#ba1a1a]">⚠️ Dead / Stagnant Inventory</h3>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">Overstocked</span>
              </div>
              <div className="space-y-3">
                {deadInventory.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-red-50/50 border border-red-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
                      <img src={item.images.primary} alt="" className="w-8 h-10 rounded object-cover bg-white" />
                      <div>
                        <p className="font-bold text-xs text-[#0b1c30] truncate max-w-[180px]">{item.name}</p>
                        <p className="text-[10px] text-gray-500">Holding {item.quantity} surplus units in vault</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Marked ${item.id} for 20% clearance sale feed.`)}
                      className="text-[10px] font-bold px-2 py-1 bg-[#ba1a1a] text-white rounded hover:bg-red-800 transition-colors"
                    >
                      Clearance Run
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeReportTab === 'rankings' && (
          <div>
            <h3 className="font-['Geist'] font-extrabold text-base text-[#0525bb] pb-3 border-b border-[#c5c5d7] mb-4">
              🏆 VIP Customer Spending Rankings
            </h3>
            <div className="space-y-3 max-w-2xl">
              {rankedCustomers.map((cust, idx) => (
                <div key={cust.id} className="p-3.5 rounded-2xl bg-[#f8f9ff] border border-[#c5c5d7]/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg font-extrabold font-['Geist'] text-xs flex items-center justify-center ${
                      idx === 0 ? 'bg-[#e5a000] text-white shadow-sm' :
                      idx === 1 ? 'bg-gray-400 text-white' :
                      idx === 2 ? 'bg-[#b87333] text-white' : 'bg-[#eff4ff] text-[#0525bb]'
                    }`}>
                      #{idx + 1}
                    </span>
                    <img src={cust.avatarUrl} alt="" className="w-9 h-9 rounded-full border object-cover bg-white" />
                    <div>
                      <p className="font-bold text-xs text-[#0b1c30]">{cust.name}</p>
                      <p className="text-[10px] text-gray-500">Tier: {cust.membershipTier} • {cust.salesCount} lifetime POS tickets</p>
                    </div>
                  </div>
                  <span className="font-['Geist'] font-extrabold text-sm text-[#006b5f]">{currencySymbol}{cust.lifetimeSpending.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
