import React, { useState } from 'react';
import {
  ShoppingCart,
  Package,
  ScanLine,
  ArrowLeftRight,
  LayoutDashboard,
  MoreHorizontal,
  Users,
  FileSpreadsheet,
  Bot,
  Plug,
  History,
  Settings,
  X,
} from 'lucide-react';
import type { NavScreen } from '../../../types';

interface DashboardMobileNavProps {
  activeScreen: NavScreen;
  onScreenChange: (screen: NavScreen) => void;
}

export const DashboardMobileNav: React.FC<DashboardMobileNavProps> = ({ activeScreen, onScreenChange }) => {
  const [showMoreModal, setShowMoreModal] = useState(false);

  const moreItems = [
    { id: 'crm', label: 'CRM & Loyalty', icon: Users },
    { id: 'reports', label: 'BI Reports', icon: FileSpreadsheet },
    { id: 'vending', label: 'Vending Fleet', icon: Bot },
    { id: 'integrations', label: 'Marketplaces', icon: Plug },
    { id: 'activity', label: 'Audit Trail', icon: History },
    { id: 'settings', label: 'SaaS Controls', icon: Settings },
  ] as const;

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#d3e4fe]/95 backdrop-blur-md border-t border-[#c5c5d7] flex justify-around items-center h-16 pb-1 shadow-lg select-none">
        <button
          onClick={() => {
            onScreenChange('dashboard');
            setShowMoreModal(false);
          }}
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            activeScreen === 'dashboard' ? 'text-[#0525bb] font-bold' : 'text-[#444655]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 font-['Geist']">Home</span>
        </button>

        <button
          onClick={() => {
            onScreenChange('pos');
            setShowMoreModal(false);
          }}
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            activeScreen === 'pos' ? 'text-[#0525bb] font-bold' : 'text-[#444655]'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 font-['Geist']">POS</span>
        </button>

        <div className="relative -top-4">
          <button
            onClick={() => {
              onScreenChange('scanner');
              setShowMoreModal(false);
            }}
            className="w-14 h-14 bg-[#0525bb] text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform ring-4 ring-[#f8f9ff]"
          >
            <ScanLine className="w-7 h-7" />
          </button>
        </div>

        <button
          onClick={() => {
            onScreenChange('inventory');
            setShowMoreModal(false);
          }}
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            activeScreen === 'inventory' ? 'text-[#0525bb] font-bold' : 'text-[#444655]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 font-['Geist']">Stock</span>
        </button>

        <button
          onClick={() => setShowMoreModal(!showMoreModal)}
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            showMoreModal ? 'text-[#0525bb] font-bold' : 'text-[#444655]'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 font-['Geist']">More OS</span>
        </button>
      </nav>

      {showMoreModal && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-end justify-center pb-16">
          <div className="bg-white w-full max-h-[75vh] rounded-t-3xl p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-5 border-t border-[#c5c5d7]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#c5c5d7]">
              <h3 className="font-['Geist'] font-extrabold text-[#0525bb] text-lg">Enterprise Modules</h3>
              <button onClick={() => setShowMoreModal(false)} className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onScreenChange('trades');
                  setShowMoreModal(false);
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 ${
                  activeScreen === 'trades' ? 'bg-[#0525bb] text-white border-[#0525bb]' : 'bg-[#f8f9ff] text-[#0b1c30] border-[#c5c5d7]'
                }`}
              >
                <ArrowLeftRight className="w-5 h-5 text-[#0525bb]" />
                <span className="font-bold text-sm font-['Geist']">Trade Engine</span>
              </button>
              {moreItems.map((mItem) => {
                const MIcon = mItem.icon;
                const isMActive = activeScreen === mItem.id;
                return (
                  <button
                    key={mItem.id}
                    onClick={() => {
                      onScreenChange(mItem.id as NavScreen);
                      setShowMoreModal(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-colors ${
                      isMActive ? 'bg-[#0525bb] text-white border-[#0525bb]' : 'bg-[#f8f9ff] text-[#0b1c30] border-[#c5c5d7]'
                    }`}
                  >
                    <MIcon className={`w-5 h-5 ${isMActive ? 'text-white' : 'text-[#0525bb]'}`} />
                    <span className="font-bold text-sm font-['Geist']">{mItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
