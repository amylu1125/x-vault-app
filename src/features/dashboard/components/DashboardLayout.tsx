import { DashboardContent } from './DashboardContent';
import { DashboardHeader } from './DashboardHeader';
import { DashboardMobileNav } from './DashboardMobileNav';
import { DashboardSidebar } from './DashboardSidebar';
import { useDashboardShellState } from '../hooks/useDashboardShellState';
import { useDashboardSignOut } from '../hooks/useDashboardSignOut';

export function DashboardLayout() {
  const shell = useDashboardShellState();
  const { authEmail, handleSignOut } = useDashboardSignOut();

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased overflow-x-hidden flex flex-col select-none">
      <DashboardHeader
        activeCompany={shell.activeCompany}
        onCompanyChange={shell.setActiveCompany}
        activeLocation={shell.activeLocation}
        onLocationChange={shell.setActiveLocation}
        searchQuery={shell.globalSearch}
        onSearchChange={shell.setGlobalSearch}
        authEmail={authEmail}
        onSignOut={handleSignOut}
      />

      <div className="flex flex-1 pt-16 min-h-[calc(100vh-64px)]">
        <DashboardSidebar
          activeScreen={shell.activeScreen}
          onScreenChange={shell.setActiveScreen}
          activeCompanyName={shell.activeCompany.name}
        />
        <DashboardContent shell={shell} />
      </div>

      <DashboardMobileNav activeScreen={shell.activeScreen} onScreenChange={shell.setActiveScreen} />
    </div>
  );
}
