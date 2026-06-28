import React from 'react';
import { MarketplaceIntegration } from '../types';
import { Plug, RefreshCw, CheckCircle2, AlertCircle, Clock, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface IntegrationsScreenProps {
  integrations: MarketplaceIntegration[];
  onToggleSync: (id: string) => void;
}

export const IntegrationsScreen: React.FC<IntegrationsScreenProps> = ({
  integrations,
  onToggleSync,
}) => {
  const [syncingId, setSyncingId] = React.useState<string | null>(null);

  const handleSimulateOAuthOrSync = (item: MarketplaceIntegration) => {
    setSyncingId(item.id);
    setTimeout(() => {
      onToggleSync(item.id);
      setSyncingId(null);
      alert(`🔄 Synchronized market prices and stock velocity with ${item.platformName}!`);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 border border-[#c5c5d7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-['Geist'] text-2xl font-extrabold text-[#0525bb]">Marketplace & Grading Feeds</h2>
            <span className="text-[10px] font-bold bg-[#eff4ff] text-[#0525bb] px-2 py-0.5 rounded uppercase font-['Geist']">API Gateway</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Modular integration architecture supporting bi-directional price syncing without restructuring core tables.
          </p>
        </div>

        <button
          onClick={() => alert('All API webhooks and price index cron jobs verified online.')}
          className="px-5 py-2.5 rounded-xl bg-[#0525bb] text-white text-xs font-extrabold font-['Geist'] uppercase tracking-wider shadow-md hover:bg-[#2e44d1] transition-all shrink-0 active:scale-95 flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-[#44e1d1]" /> Sync All Feeds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => {
          const isConnected = item.status === 'Connected';
          const isSpinning = syncingId === item.id;

          return (
            <div key={item.id} className="bg-white rounded-3xl border border-[#c5c5d7] p-6 shadow-xs flex flex-col justify-between hover:border-[#0525bb] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl select-none">{item.logoIcon}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-['Geist'] ${
                    isConnected ? 'bg-[#b6f2ea] text-[#006b5f]' :
                    item.status === 'Idle Sync' ? 'bg-[#dae2fd] text-[#0525bb]' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-['Geist'] font-extrabold text-lg text-[#0b1c30]">{item.platformName} API Hub</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Bi-directional inventory sync & automated pricing crawler.
                </p>

                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c5c5d7]/70 my-4 text-xs space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Synced Catalog SKUs:</span>
                    <span className="font-mono font-bold text-[#0525bb]">{item.itemsCountSynced} items</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Last Index Crawl:</span>
                    <span className="font-semibold text-gray-500">{item.lastSynced}</span>
                  </div>
                </div>
              </div>

              <button
                disabled={isSpinning}
                onClick={() => handleSimulateOAuthOrSync(item)}
                className={`w-full py-3 rounded-xl font-['Geist'] font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
                  isConnected ? 'bg-[#eff4ff] text-[#0525bb] hover:bg-[#dae2fd]' : 'bg-[#0525bb] text-white hover:bg-[#2e44d1] shadow-md'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                {isConnected ? 'Trigger Manual Sync' : 'Connect API Token'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
