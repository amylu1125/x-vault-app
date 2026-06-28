import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { 
  ScanLine, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  ShoppingCart, 
  ArrowLeftRight, 
  Plus, 
  Search, 
  RefreshCw,
  ShieldCheck,
  Bot
} from 'lucide-react';

interface ScannerScreenProps {
  inventory: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onAddToCart: (item: InventoryItem) => void;
  onAddToIntake: (item: InventoryItem) => void;
  currencySymbol: string;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({
  inventory,
  onAddItem,
  onAddToCart,
  onAddToIntake,
  currencySymbol,
}) => {
  const [scanning, setScanning] = useState(false);
  const [recognizedCard, setRecognizedCard] = useState<InventoryItem | null>(null);

  const sampleScans: Partial<InventoryItem>[] = [
    {
      name: 'Lugia V (Alternate Art)',
      setName: 'Silver Tempest',
      cardNumber: '186/195',
      rarity: 'Secret Rare',
      gradingCompany: 'PSA',
      gradeValue: '10',
      category: 'Slabs',
      purchaseCost: 190.00,
      sellingPrice: 340.00,
      marketPrice: 338.00,
      storageLocation: 'Downtown Vault Bin C1',
      images: {
        primary: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=500&q=80',
      },
    },
    {
      name: 'Giratina V (Alternate Art)',
      setName: 'Lost Origin',
      cardNumber: '186/196',
      rarity: 'Secret Rare',
      gradingCompany: 'CGC',
      gradeValue: '9.5',
      category: 'Slabs',
      purchaseCost: 260.00,
      sellingPrice: 480.00,
      marketPrice: 475.00,
      storageLocation: 'Downtown Vault Bin C2',
      images: {
        primary: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=500&q=80',
      },
    },
  ];

  const handleTriggerSimulatedOCR = () => {
    setScanning(true);
    setRecognizedCard(null);
    setTimeout(() => {
      const randomPick = sampleScans[Math.floor(Math.random() * sampleScans.length)];
      const permId = `VX-${Math.floor(100000 + Math.random() * 900000)}`;
      const fullItem: InventoryItem = {
        id: permId,
        companyId: 'comp-1',
        name: randomPick.name!,
        setName: randomPick.setName!,
        cardNumber: randomPick.cardNumber,
        rarity: randomPick.rarity,
        gradingCompany: randomPick.gradingCompany as any,
        gradeValue: randomPick.gradeValue,
        category: randomPick.category as any,
        images: randomPick.images!,
        purchaseCost: randomPick.purchaseCost!,
        sellingPrice: randomPick.sellingPrice!,
        quantity: 1,
        storageLocation: randomPick.storageLocation!,
        purchaseDate: new Date().toISOString().split('T')[0],
        status: 'In Vault',
        isStarred: true,
        marketPrice: randomPick.marketPrice!,
        priceTrend: '+6.4% AI Est.'
      };
      setRecognizedCard(fullItem);
      setScanning(false);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#c5c5d7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#dae2fd] text-[#0525bb] px-3 py-1 rounded-full text-xs font-bold font-['Geist'] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#0525bb]" /> Hardware Vision & Vision AI Active
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-['Geist'] text-[#0b1c30]">
            AI Card OCR & Barcode Recognition
          </h2>
          <p className="text-xs text-gray-500 max-w-xl">
            Place raw cards, graded PSA/CGC slabs, or sealed booster barcodes under camera feed. AI automatically extracts set numbers, grade scores, and recommends market prices.
          </p>
        </div>

        <button
          disabled={scanning}
          onClick={handleTriggerSimulatedOCR}
          className="bg-[#0525bb] hover:bg-[#2e44d1] disabled:opacity-50 text-white px-6 py-4 rounded-2xl font-['Geist'] font-extrabold text-xs uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          {scanning ? 'Analyzing Vision Feed...' : 'Trigger AI Photo Scan'}
        </button>
      </div>

      {/* Camera Simulator Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0b1c30] rounded-3xl p-6 border border-[#c5c5d7] shadow-lg flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          {scanning ? (
            <div className="text-center space-y-4 relative z-10">
              <div className="w-20 h-20 rounded-full border-4 border-[#0525bb] border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-bold text-white font-['Geist'] animate-pulse">Extracting Hologram & PSA Registry...</p>
              <p className="text-[10px] text-gray-400 font-mono">VISION_OCR_PROCESSING_STREAM_v3</p>
            </div>
          ) : recognizedCard ? (
            <div className="text-center space-y-3 relative z-10 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-[#006b5f] text-white flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-white font-['Geist'] font-extrabold text-lg">Card Successfully Recognized!</h3>
              <p className="text-xs text-[#b6f2ea] font-mono">{recognizedCard.id} • {recognizedCard.setName}</p>
            </div>
          ) : (
            <div className="text-center space-y-3 max-w-sm relative z-10 text-gray-400">
              <ScanLine className="w-16 h-16 stroke-1 mx-auto text-[#2e44d1] animate-pulse" />
              <p className="text-xs font-bold text-gray-200">Awaiting Hardware Optical Feed</p>
              <p className="text-[10px]">Supports mobile phone cameras, USB flatbeds, and high-speed sorting rigs.</p>
            </div>
          )}

          {/* Scanner frame lines */}
          <div className="absolute inset-8 border-2 border-dashed border-[#2e44d1]/40 rounded-2xl pointer-events-none" />
        </div>

        {/* OCR Result Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#c5c5d7] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#c5c5d7]">
            <h3 className="font-['Geist'] font-extrabold text-base text-[#0b1c30]">Extracted Metadata & Pricing</h3>
            <span className="text-[10px] font-bold bg-[#eff4ff] text-[#0525bb] px-2 py-0.5 rounded uppercase">AI Recommended</span>
          </div>

          {recognizedCard ? (
            <div className="space-y-4 my-4 flex-1">
              <div className="flex items-start gap-4">
                <img src={recognizedCard.images.primary} alt="" className="w-20 h-28 rounded-xl object-cover shadow-md bg-white border shrink-0" />
                <div className="space-y-1 min-w-0">
                  <span className="bg-[#0525bb] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {recognizedCard.id}
                  </span>
                  <h4 className="font-bold text-sm text-[#0b1c30]">{recognizedCard.name}</h4>
                  <p className="text-xs text-gray-500">{recognizedCard.setName} ({recognizedCard.cardNumber})</p>
                  <p className="text-[10px] font-bold text-[#006b5f]">{recognizedCard.gradingCompany} {recognizedCard.gradeValue}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#f8f9ff] rounded-2xl border border-[#c5c5d7]/80 font-['Geist']">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">AI Recommended Price</p>
                  <p className="text-lg font-extrabold text-[#0525bb]">{currencySymbol}{recognizedCard.sellingPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">TCGPlayer Market Index</p>
                  <p className="text-lg font-extrabold text-[#006b5f]">{currencySymbol}{recognizedCard.marketPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
              <Bot className="w-12 h-12 stroke-1 mb-2 text-gray-300" />
              <p className="text-xs font-bold">No OCR extraction output</p>
              <p className="text-[10px]">Click 'Trigger AI Photo Scan' to simulate vision recognition</p>
            </div>
          )}

          {/* Action Routing Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#c5c5d7]">
            <button
              disabled={!recognizedCard}
              onClick={() => {
                if (recognizedCard) onAddItem(recognizedCard);
              }}
              className="py-3 bg-[#0525bb] hover:bg-[#2e44d1] disabled:opacity-40 text-white font-['Geist'] font-extrabold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Save SKU
            </button>

            <button
              disabled={!recognizedCard}
              onClick={() => {
                if (recognizedCard) onAddToCart(recognizedCard);
              }}
              className="py-3 bg-white border border-[#0525bb] text-[#0525bb] hover:bg-[#eff4ff] disabled:opacity-40 font-['Geist'] font-extrabold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> To POS Cart
            </button>

            <button
              disabled={!recognizedCard}
              onClick={() => {
                if (recognizedCard) onAddToIntake(recognizedCard);
              }}
              className="py-3 bg-[#006b5f] hover:bg-[#005148] disabled:opacity-40 text-white font-['Geist'] font-extrabold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1 shadow-md"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Trade Intake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
