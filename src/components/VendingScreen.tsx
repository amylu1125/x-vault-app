import React from 'react';
import { VendingMachineUnit } from '../types';
import { 
  Bot, 
  Thermometer, 
  Wifi, 
  Activity, 
  RefreshCw, 
  QrCode, 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  PackageCheck,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';

interface VendingScreenProps {
  units: VendingMachineUnit[];
  onPingUnit: (id: string) => void;
  currencySymbol: string;
}

export const VendingScreen: React.FC<VendingScreenProps> = ({
  units,
  onPingUnit,
  currencySymbol,
}) => {
  const [refreshingId, setRefreshingId] = React.useState<string | null>(null);

  const handleTriggerSync = (unit: VendingMachineUnit) => {
    setRefreshingId(unit.id);
    setTimeout(() => {
      onPingUnit(unit.id);
      setRefreshingId(null);
      alert(`✅ Remote Telemetry Verified for ${unit.name}!\nInventory stock matched with store cloud catalog.`);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0b1c30] via-[#1a2f4c] to-[#0525bb] rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#44e1d1]/20 text-[#44e1d1] px-3 py-1 rounded-full text-xs font-bold font-['Geist'] uppercase tracking-wider border border-[#44e1d1]/30">
            <Bot className="w-4 h-4" /> IoT Automated Machine Fleet Engine
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold font-['Geist'] tracking-tight">
            Automated Vending Fleet Command
          </h2>
          <p className="text-xs text-blue-100 max-w-xl">
            Monitor remote smart vending hubs in airports, malls, and train stations. Supports real-time inventory synchronization, remote restocking triggers, temperature monitoring, and QR purchasing.
          </p>
        </div>

        <button
          onClick={() => alert('Broadcasting firmware OTA update v3.4 to all active machines...')}
          className="bg-white text-[#0b1c30] hover:bg-[#dae2fd] px-5 py-3.5 rounded-2xl font-['Geist'] font-extrabold text-xs uppercase tracking-wider shadow-xl transition-all shrink-0 active:scale-95"
        >
          Push Fleet OTA Firmware
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {units.map((unit) => {
          const isHealthy = unit.status === 'Online';
          const isSpinning = refreshingId === unit.id;

          return (
            <div
              key={unit.id}
              className="bg-white rounded-3xl border border-[#c5c5d7] p-6 shadow-xs flex flex-col justify-between hover:border-[#0525bb] transition-all relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-[10px] font-bold bg-[#eff4ff] text-[#0525bb] px-2 py-0.5 rounded border border-[#0525bb]/20">
                    {unit.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isHealthy ? 'bg-[#b6f2ea] text-[#006b5f]' : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    {isHealthy ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {unit.status}
                  </span>
                </div>

                <h3 className="font-['Geist'] font-extrabold text-lg text-[#0b1c30]">{unit.name}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#006b5f] shrink-0" /> {unit.locationName}
                </p>

                {/* Telemetry Box */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#f8f9ff] rounded-2xl border border-[#c5c5d7]/70 my-4 text-xs">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-[#0525bb]" /> Climate
                    </p>
                    <p className="font-mono font-extrabold text-[#0b1c30] mt-0.5">{unit.temperatureC}°C <span className="text-[9px] font-normal text-green-600">Optimal</span></p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-[#006b5f]" /> Network
                    </p>
                    <p className="font-mono font-extrabold text-[#0b1c30] mt-0.5 truncate">{unit.signalStrength}</p>
                  </div>
                </div>

                {/* Stock Slots Meter */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs font-bold font-['Geist']">
                    <span className="text-gray-600">Stock Capacity:</span>
                    <span className="text-[#0525bb]">{unit.filledSlots} / {unit.slotsCount} Slots</span>
                  </div>
                  <div className="w-full bg-[#dae2fd] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0525bb] h-full rounded-full transition-all duration-500"
                      style={{ width: `${(unit.filledSlots / unit.slotsCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Revenue Footer & Controls */}
              <div className="pt-4 border-t border-[#c5c5d7] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase font-['Geist']">Monthly Intake</span>
                  <span className="font-['Geist'] font-extrabold text-lg text-[#006b5f]">{currencySymbol}{unit.totalRevenueMonthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isSpinning}
                    onClick={() => handleTriggerSync(unit)}
                    className="py-2.5 bg-[#eff4ff] hover:bg-[#dae2fd] text-[#0525bb] rounded-xl text-xs font-bold font-['Geist'] transition-colors flex items-center justify-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} /> Ping Telemetry
                  </button>

                  <button
                    onClick={() => alert(`📦 Restock dispatch created for ${unit.name} at ${unit.locationName}.`)}
                    className="py-2.5 bg-[#0525bb] hover:bg-[#2e44d1] text-white rounded-xl text-xs font-bold font-['Geist'] transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <PackageCheck className="w-3.5 h-3.5" /> Dispatch Stock
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
