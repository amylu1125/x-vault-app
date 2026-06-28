import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, ArrowUpRight } from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="font-['Geist'] text-3xl font-extrabold text-[#0b1c30] tracking-tight">
          Vault Analytics & Telemetry
        </h1>
        <p className="text-[#444655] text-sm mt-1">
          Deep financial performance charts, stock velocity reports, and employee terminal auditing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#c5c5d7] shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-['Geist'] font-bold text-xs text-[#757686] uppercase">Gross Margin</span>
            <span className="text-emerald-700 bg-emerald-100 font-['Geist'] font-bold text-xs px-2 py-0.5 rounded">+4.2%</span>
          </div>
          <div className="font-['Geist'] text-4xl font-extrabold text-[#0b1c30]">68.4%</div>
          <div className="h-24 bg-[#eff4ff] rounded-xl flex items-end p-2 gap-2">
            {[40, 55, 62, 48, 70, 68, 75].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-[#0525bb] rounded-t transition-all hover:bg-[#006b5f]" />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#c5c5d7] shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-['Geist'] font-bold text-xs text-[#757686] uppercase">Inventory Turn Rate</span>
            <span className="text-[#0525bb] bg-[#dae2fd] font-['Geist'] font-bold text-xs px-2 py-0.5 rounded">14 Days</span>
          </div>
          <div className="font-['Geist'] text-4xl font-extrabold text-[#0b1c30]">3.2x / Mo</div>
          <div className="h-24 bg-[#eff4ff] rounded-xl flex items-end p-2 gap-2">
            {[30, 45, 40, 60, 55, 65, 80].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-[#006b5f] rounded-t transition-all" />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#c5c5d7] shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-['Geist'] font-bold text-xs text-[#757686] uppercase">Average Ticket</span>
            <span className="text-[#0525bb] bg-[#dae2fd] font-['Geist'] font-bold text-xs px-2 py-0.5 rounded">TCG Floor</span>
          </div>
          <div className="font-['Geist'] text-4xl font-extrabold text-[#0b1c30]">$84.50</div>
          <div className="h-24 bg-[#eff4ff] rounded-xl flex items-end p-2 gap-2">
            {[50, 40, 65, 75, 70, 85, 90].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-[#2e44d1] rounded-t transition-all" />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#c5c5d7] p-8 text-center space-y-3">
        <BarChart3 className="w-12 h-12 text-[#0525bb] mx-auto opacity-80" />
        <h3 className="font-['Geist'] text-xl font-bold text-[#0b1c30]">Full Cloud BigQuery Export Ready</h3>
        <p className="text-sm text-[#444655] max-w-md mx-auto">
          Synchronize all historic POS sales logs and OCR barcode scans directly to Google Cloud Storage or CSV.
        </p>
        <button 
          onClick={() => alert('BigQuery Pipeline Export Triggered')}
          className="px-6 py-3 bg-[#0525bb] text-white rounded-full font-bold text-xs font-['Geist'] uppercase tracking-wider shadow-md hover:bg-[#2e44d1]"
        >
          Export CSV / BigQuery
        </button>
      </div>
    </div>
  );
};
