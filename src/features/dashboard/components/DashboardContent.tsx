import { ModuleHost } from '../../../app/orchestrator/ModuleHost';
import type { DashboardShellState } from '../types/shell.types';

interface DashboardContentProps {
  shell: DashboardShellState;
}

export function DashboardContent({ shell }: DashboardContentProps) {
  return (
    <main className="flex-1 md:ml-[240px] p-4 md:p-8 pb-24 md:pb-12 bg-[#f8f9ff] overflow-y-auto min-w-0">
      <ModuleHost shell={shell} />
    </main>
  );
}
