import React, { useState } from 'react';
import { SystemActivityLog } from '../types';
import { History, Search, Filter, ShieldCheck, CheckCircle2, AlertCircle, Info, Zap } from 'lucide-react';

interface ActivityLogsProps {
  logs: SystemActivityLog[];
}

export const ActivityLogsScreen: React.FC<ActivityLogsProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  const types = ['All', 'LOGIN', 'INVENTORY_CHANGE', 'SALE', 'TRADE', 'INTEGRATION_SYNC', 'VENDING_PING'];

  const filteredLogs = logs.filter((log) => {
    const matchesQuery =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetResource && log.targetResource.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'All' || log.actionType === selectedType;
    return matchesQuery && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 border border-[#c5c5d7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-['Geist'] text-2xl font-extrabold text-[#0525bb]">System Audit Trail & Activity Logs</h2>
            <span className="text-[10px] font-mono bg-[#eff4ff] text-[#0525bb] px-2 py-0.5 rounded font-bold">Immutable Audit v3</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Complete compliance logging across tenant logins, inventory ledger updates, POS sales, and IoT vending telemetry.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-[#c5c5d7] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2 bg-[#f8f9ff] px-3.5 py-2 rounded-xl border border-[#c5c5d7] w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by employee name, action ID, IP..."
            className="bg-transparent border-none focus:outline-none text-xs w-full text-[#0b1c30]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all font-['Geist'] ${
                selectedType === t ? 'bg-[#0525bb] text-white shadow-xs' : 'bg-[#eff4ff] text-[#444655] hover:bg-[#dae2fd]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-[#c5c5d7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c5c5d7] text-[11px] font-bold text-[#757686] uppercase tracking-wider font-['Geist']">
                <th className="py-3.5 px-4 w-32">Timestamp</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Actor / Employee User</th>
                <th className="py-3.5 px-4">Audit Description</th>
                <th className="py-3.5 px-4">Target Resource</th>
                <th className="py-3.5 px-4 text-right">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5c5d7]/60 text-xs font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-['Geist'] ${
                      log.severity === 'success' ? 'bg-[#b6f2ea] text-[#006b5f]' :
                      log.severity === 'error' ? 'bg-red-100 text-red-700' :
                      log.severity === 'warn' ? 'bg-amber-100 text-amber-800' : 'bg-[#dae2fd] text-[#0525bb]'
                    }`}>
                      {log.actionType}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#0b1c30] whitespace-nowrap">
                    {log.actorName}
                  </td>

                  <td className="py-3.5 px-4 text-gray-700 max-w-md">
                    {log.description}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#0525bb] font-bold whitespace-nowrap">
                    {log.targetResource ?? 'SYS_CORE'}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-gray-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
