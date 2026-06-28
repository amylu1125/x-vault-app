import React from 'react';
import { NavScreen } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ArrowLeftRight, 
  Users, 
  FileSpreadsheet, 
  Bot, 
  Plug, 
  History, 
  ScanLine, 
  Settings, 
  Store 
} from 'lucide-react';
import { CURRENT_USER } from '../data';

interface SidebarProps {
  activeScreen: NavScreen;
  onScreenChange: (screen: NavScreen) => void;
  activeCompanyName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onScreenChange, activeCompanyName }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory OS', icon: Package },
    { id: 'pos', label: 'POS Terminal', icon: ShoppingCart },
    { id: 'trades', label: 'Trade Engine', icon: ArrowLeftRight },
    { id: 'crm', label: 'Customers & Loyalty', icon: Users },
    { id: 'reports', label: 'Reports & BI', icon: FileSpreadsheet },
    { id: 'vending', label: 'Vending Fleet', icon: Bot, isBadge: 'Smart' },
    { id: 'integrations', label: 'Marketplaces', icon: Plug },
    { id: 'activity', label: 'Activity Logs', icon: History },
    { id: 'scanner', label: 'AI Magic OCR', icon: ScanLine, isBadge: 'AI' },
    { id: 'settings', label: 'SaaS Settings', icon: Settings },
  ] as const;

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] z-40 bg-[#f8f9ff] border-r border-[#c5c5d7] hidden md:flex flex-col py-6 select-none shadow-xs">
      <div className="px-5 mb-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#0525bb] text-white flex items-center justify-center shadow-md shrink-0">
          <Store className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-['Geist'] text-lg font-extrabold text-[#0525bb] tracking-tight leading-none truncate" title={activeCompanyName}>
            {activeCompanyName}
          </h1>
          <p className="text-[10px] font-bold text-[#444655] uppercase tracking-widest mt-1 truncate">TCG Store OS v3.0</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onScreenChange(item.id as NavScreen)}
              className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer font-medium text-sm group ${
                isActive
                  ? 'bg-[#2e44d1] text-white font-semibold shadow-xs'
                  : 'text-[#444655] hover:bg-[#dae2fd] hover:text-[#131b2e]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#0525bb] group-hover:scale-110'} transition-transform`} />
                <span className="truncate">{item.label}</span>
              </div>

              {'isBadge' in item && item.isBadge && (
                <span className={`text-[9px] font-bold font-['Geist'] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#0525bb]/10 text-[#0525bb]'
                }`}>
                  {item.isBadge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pt-4 border-t border-[#c5c5d7]">
        <div className="p-3 bg-[#e5eeff] rounded-xl border border-[#c5c5d7]/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src={CURRENT_USER.avatarUrl}
              alt="User"
              className="w-9 h-9 rounded-full border border-[#c5c5d7] object-cover bg-white"
            />
            <div className="overflow-hidden min-w-0">
              <p className="font-['Geist'] text-xs font-bold text-[#0b1c30] truncate">{CURRENT_USER.name}</p>
              <span className="inline-block text-[9px] px-1.5 py-0.2 bg-[#0525bb] text-white rounded font-bold uppercase tracking-wider">
                {CURRENT_USER.role} Tenant
              </span>
            </div>
          </div>
          <button 
            onClick={() => onScreenChange('settings')}
            className="w-full py-1.5 text-[11px] font-['Geist'] font-bold uppercase tracking-wider border border-[#0525bb] text-[#0525bb] bg-white rounded-lg hover:bg-[#0525bb] hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3 h-3" /> Tenant Switch
          </button>
        </div>
      </div>
    </aside>
  );
};
