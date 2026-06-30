import React from 'react';
import { MapPin, ChevronDown, Search, Bell, Building2, LogOut } from 'lucide-react';
import { TENANT_COMPANIES, CURRENT_USER } from '../../../data';
import type { TenantCompany } from '../../../types';

interface DashboardHeaderProps {
  activeCompany: TenantCompany;
  onCompanyChange: (comp: TenantCompany) => void;
  activeLocation: string;
  onLocationChange: (loc: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  authEmail?: string | null;
  onSignOut?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeCompany,
  onCompanyChange,
  activeLocation,
  onLocationChange,
  searchQuery,
  onSearchChange,
  authEmail,
  onSignOut,
}) => {
  const [showLocDropdown, setShowLocDropdown] = React.useState(false);
  const [showCompDropdown, setShowCompDropdown] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 md:pl-[240px] h-16 bg-[#eff4ff] border-b border-[#c5c5d7] flex items-center justify-between px-4 md:px-8 shadow-xs select-none">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowCompDropdown(!showCompDropdown)}
            className="flex items-center gap-2 bg-[#dae2fd] border border-[#0525bb]/30 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#c2c8ff] transition-colors"
          >
            <Building2 className="w-4 h-4 text-[#0525bb]" />
            <div className="text-left hidden sm:block">
              <p className="text-[9px] font-bold text-[#444655] uppercase leading-none font-['Geist']">Isolated Tenant</p>
              <p className="text-xs font-bold text-[#0525bb] truncate max-w-[120px]">{activeCompany.name}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#0525bb]" />
          </button>

          {showCompDropdown && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-[#c5c5d7] rounded-xl shadow-xl py-2 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-[#757686] uppercase tracking-wider font-['Geist']">
                Switch Tenant Company Data
              </div>
              {TENANT_COMPANIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onCompanyChange(c);
                    onLocationChange(c.branchLocations[0]);
                    setShowCompDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#eff4ff] ${
                    activeCompany.id === c.id ? 'font-bold text-[#0525bb] bg-[#eff4ff]' : 'text-[#0b1c30]'
                  }`}
                >
                  <div>
                    <p>{c.name}</p>
                    <p className="text-[9px] text-gray-500">{c.code}</p>
                  </div>
                  {activeCompany.id === c.id && <span className="w-2 h-2 rounded-full bg-[#0525bb]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <div
            onClick={() => setShowLocDropdown(!showLocDropdown)}
            className="flex items-center gap-1.5 bg-white border border-[#c5c5d7] px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#d3e4fe] transition-colors group"
          >
            <MapPin className="w-3.5 h-3.5 text-[#006b5f] group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-[9px] font-bold text-[#444655] uppercase leading-none font-['Geist']">Branch</p>
              <p className="text-xs font-semibold text-[#0b1c30] truncate max-w-[110px]">{activeLocation}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#444655]" />
          </div>

          {showLocDropdown && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-[#c5c5d7] rounded-xl shadow-xl py-2 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-[#757686] uppercase tracking-wider font-['Geist']">
                Select Branch Vault
              </div>
              {activeCompany.branchLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    onLocationChange(loc);
                    setShowLocDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#eff4ff] ${
                    activeLocation === loc ? 'font-bold text-[#006b5f] bg-[#eff4ff]' : 'text-[#0b1c30]'
                  }`}
                >
                  <span>{loc}</span>
                  {activeLocation === loc && <span className="w-2 h-2 rounded-full bg-[#006b5f]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#dce9ff] border border-[#c5c5d7]/60 rounded-full text-[#444655] focus-within:ring-2 focus-within:ring-[#0525bb] focus-within:bg-white transition-all w-72 xl:w-96">
        <Search className="w-4 h-4 text-[#757686] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search permanent IDs, SKU cards, guests..."
          className="bg-transparent border-none focus:outline-none text-xs w-full text-[#0b1c30] placeholder-[#757686]"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => alert('All hardware OCR scanners and sync feeds active.')}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#d3e4fe] text-[#444655] hover:text-[#0525bb] transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-[#c5c5d7]">
          <img src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} className="w-8 h-8 rounded-full border object-cover bg-white shrink-0" />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold leading-none font-['Geist'] truncate max-w-[100px]">{CURRENT_USER.name}</p>
            <p className="text-[10px] text-[#0525bb] font-semibold truncate max-w-[120px]">
              {authEmail ?? `${CURRENT_USER.role} Role`}
            </p>
          </div>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              title="Sign out"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#d3e4fe] text-[#444655] hover:text-[#0525bb] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
