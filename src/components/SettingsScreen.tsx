import React, { useState } from 'react';
import { Settings as SettingsIcon, Store, Shield, Receipt, Database, BellRing, Key, Smartphone } from 'lucide-react';

interface SettingsScreenProps {
  activeLocation: string;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ activeLocation }) => {
  const [taxRate, setTaxRate] = useState('8.5');
  const [autoReceipts, setAutoReceipts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="font-['Geist'] text-3xl font-extrabold text-[#0b1c30] tracking-tight">
          Vault System Settings
        </h1>
        <p className="text-[#444655] text-sm mt-1">
          Configure hardware OCR barcode scanners, receipt printers, tax brackets, and branch security policies.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#c5c5d7] divide-y divide-[#c5c5d7]/50 shadow-xs">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#dae2fd] text-[#0525bb] rounded-xl"><Store className="w-5 h-5" /></div>
            <div>
              <h3 className="font-['Geist'] text-base font-bold text-[#0b1c30]">Active Vault Node</h3>
              <p className="text-xs text-[#444655]">Current hardware terminal bound to {activeLocation}</p>
            </div>
          </div>
          <span className="font-['Geist'] text-xs font-bold bg-[#eff4ff] text-[#0525bb] px-3 py-1.5 rounded-lg border border-[#c5c5d7]">
            IP: 192.168.1.104
          </span>
        </div>

        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#6df5e1]/30 text-[#006b5f] rounded-xl"><Receipt className="w-5 h-5" /></div>
            <div>
              <h3 className="font-['Geist'] text-base font-bold text-[#0b1c30]">POS Sales Tax Rate (%)</h3>
              <p className="text-xs text-[#444655]">Applied automatically on all retail floor checkouts</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-20 px-3 py-1.5 bg-[#eff4ff] border border-[#c5c5d7] rounded-lg text-sm font-['Geist'] font-bold text-center text-[#0b1c30]"
            />
            <span className="text-sm font-bold">%</span>
          </div>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#eff4ff] text-[#444655] rounded-xl"><Smartphone className="w-5 h-5" /></div>
            <div>
              <h3 className="font-['Geist'] text-base font-bold text-[#0b1c30]">Auto SMS / Email Digital Receipts</h3>
              <p className="text-xs text-[#444655]">Prompt loyalty guests for paperless receipt delivery</p>
            </div>
          </div>
          <button
            onClick={() => setAutoReceipts(!autoReceipts)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${autoReceipts ? 'bg-[#0525bb]' : 'bg-[#c5c5d7]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoReceipts ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#eff4ff] text-[#444655] rounded-xl"><Database className="w-5 h-5" /></div>
            <div>
              <h3 className="font-['Geist'] text-base font-bold text-[#0b1c30]">Hardware Scanner Beep Audio</h3>
              <p className="text-xs text-[#444655]">Acoustic feedback on successful camera OCR barcode captures</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEffects(!soundEffects)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${soundEffects ? 'bg-[#0525bb]' : 'bg-[#c5c5d7]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEffects ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => alert('Vault configuration settings saved successfully!')}
          className="px-8 py-3.5 bg-[#0525bb] text-white rounded-full font-bold text-sm shadow-lg hover:bg-[#2e44d1] active:scale-95 transition-all"
        >
          Save Vault Settings
        </button>
      </div>
    </div>
  );
};
