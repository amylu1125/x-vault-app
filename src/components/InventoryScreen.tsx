import React, { useState } from 'react';
import { NavScreen, InventoryItem, InventoryCategory, InventoryStatus } from '../types';
import { 
  Search, 
  Plus, 
  Filter, 
  Star, 
  ArrowUpRight, 
  Package, 
  Layers, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Calendar, 
  Building2, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  X,
  History,
  Tag,
  Calculator
} from 'lucide-react';

interface InventoryScreenProps {
  inventory: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleStar: (id: string) => void;
  onScreenChange: (screen: NavScreen) => void;
  currencySymbol: string;
  costMultiplier: number;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  inventory,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleStar,
  onScreenChange,
  currencySymbol,
  costMultiplier,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSet, setFormSet] = useState('');
  const [formCardNum, setFormCardNum] = useState('');
  const [formCategory, setFormCategory] = useState<InventoryCategory>('Raw Cards');
  const [formGrading, setFormGrading] = useState<'Raw' | 'PSA' | 'CGC' | 'BGS' | 'SGC' | 'ALT'>('PSA');
  const [formGradeVal, setFormGradeVal] = useState('10');
  const [formCost, setFormCost] = useState('100');
  const [formPrice, setFormPrice] = useState('145');
  const [formQty, setFormQty] = useState('1');
  const [formStorage, setFormStorage] = useState('Vault Bin A1');
  const [formSupplier, setFormSupplier] = useState('Local Collector');
  const [formNotes, setFormNotes] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=500&q=80');
  const [formBackImage, setFormBackImage] = useState('');

  const categories: string[] = [
    'All', 'Raw Cards', 'Slabs', 'Sealed Products', 'Booster Boxes', 'ETBs', 'Accessories', 'Sleeves', 'Toploaders', 'Playmats', 'Beverages', 'Snacks', 'Merchandise', 'Other'
  ];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.setName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storageLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormSet('');
    setFormCardNum('');
    setFormCategory('Slabs');
    setFormGrading('PSA');
    setFormGradeVal('10');
    setFormCost('100');
    setFormPrice((100 * costMultiplier).toFixed(2));
    setFormQty('1');
    setFormStorage('Vault Bin B2');
    setFormSupplier('Private Walk-in');
    setFormNotes('Pristine corners.');
    setFormImage('https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=500&q=80');
    setFormBackImage('');
    setShowModal(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormSet(item.setName);
    setFormCardNum(item.cardNumber ?? '');
    setFormCategory(item.category);
    setFormGrading(item.gradingCompany ?? 'Raw');
    setFormGradeVal(item.gradeValue ?? '');
    setFormCost(item.purchaseCost.toString());
    setFormPrice(item.sellingPrice.toString());
    setFormQty(item.quantity.toString());
    setFormStorage(item.storageLocation);
    setFormSupplier(item.supplierName ?? '');
    setFormNotes(item.notes ?? '');
    setFormImage(item.images.primary);
    setFormBackImage(item.images.back ?? '');
    setShowModal(true);
  };

  const handleAutoCalcPrice = () => {
    const costNum = parseFloat(formCost);
    if (!isNaN(costNum)) {
      setFormPrice((costNum * costMultiplier).toFixed(2));
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const costNum = parseFloat(formCost) || 0;
    const priceNum = parseFloat(formPrice) || 0;
    const qtyNum = parseInt(formQty) || 1;

    if (editingItem) {
      onUpdateItem({
        ...editingItem,
        name: formName || 'Untitled Collectible',
        setName: formSet || 'Core Set',
        cardNumber: formCardNum,
        category: formCategory,
        gradingCompany: formCategory === 'Slabs' ? formGrading : 'Raw',
        gradeValue: formCategory === 'Slabs' ? formGradeVal : undefined,
        purchaseCost: costNum,
        sellingPrice: priceNum,
        quantity: qtyNum,
        storageLocation: formStorage || 'Unassigned Vault Floor',
        supplierName: formSupplier,
        notes: formNotes,
        images: {
          primary: formImage || 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=500&q=80',
          back: formBackImage || undefined,
        },
      });
    } else {
      const nextIdNum = inventory.length + 1;
      const permId = `VX-${nextIdNum.toString().padStart(6, '0')}`;
      onAddItem({
        id: permId,
        companyId: 'comp-1',
        name: formName || 'New Collectible SKU',
        setName: formSet || 'General Catalog',
        cardNumber: formCardNum,
        category: formCategory,
        gradingCompany: formCategory === 'Slabs' ? formGrading : 'Raw',
        gradeValue: formCategory === 'Slabs' ? formGradeVal : undefined,
        purchaseCost: costNum,
        sellingPrice: priceNum,
        quantity: qtyNum,
        storageLocation: formStorage || 'Vault Safe Shelf 1',
        supplierName: formSupplier,
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: formNotes,
        status: 'In Vault',
        isStarred: false,
        marketPrice: priceNum * 0.98,
        priceTrend: 'New Intake',
        images: {
          primary: formImage || 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=500&q=80',
          back: formBackImage || undefined,
        },
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#c5c5d7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-['Geist'] text-2xl font-extrabold text-[#0525bb]">Vault Inventory OS</h2>
            <span className="text-[10px] font-mono bg-[#eff4ff] text-[#0525bb] px-2 py-0.5 rounded-md font-bold">
              Permanent IDs Active (e.g. VX-000001)
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Every stock change automatically issues an immutable ledger record audit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onScreenChange('activity')}
            className="px-4 py-2.5 rounded-xl border border-[#c5c5d7] text-xs font-bold font-['Geist'] text-[#444655] hover:bg-[#eff4ff] hover:text-[#0525bb] transition-all flex items-center gap-2"
          >
            <History className="w-4 h-4" /> Ledger Audit History
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-[#0525bb] text-white text-xs font-bold font-['Geist'] uppercase tracking-wider shadow-md hover:bg-[#2e44d1] transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Intake New Collectible
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#c5c5d7]/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2 bg-[#f8f9ff] px-3.5 py-2 rounded-xl border border-[#c5c5d7] w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search permanent VX ID, SKU name, safe bin..."
            className="bg-transparent border-none focus:outline-none text-xs w-full text-[#0b1c30]"
          />
        </div>

        {/* Category Chips Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all font-['Geist'] ${
                selectedCategory === cat
                  ? 'bg-[#006b5f] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#444655] hover:bg-[#dae2fd]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table / Grid View */}
      <div className="bg-white rounded-3xl border border-[#c5c5d7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c5c5d7] text-[11px] font-bold text-[#757686] uppercase tracking-wider font-['Geist']">
                <th className="py-3.5 px-4 w-12 text-center">Grail</th>
                <th className="py-3.5 px-4">Permanent ID</th>
                <th className="py-3.5 px-4">Collectible Asset</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Cost / Price</th>
                <th className="py-3.5 px-4">Vault Location</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5c5d7]/60 text-xs">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9ff] transition-colors group">
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleStar(item.id)}
                      className="p-1 hover:bg-[#dae2fd] rounded-lg transition-colors"
                    >
                      <Star className={`w-4 h-4 ${item.isStarred ? 'fill-[#e5a000] text-[#e5a000]' : 'text-gray-300'}`} />
                    </button>
                  </td>

                  <td className="py-3 px-4 font-mono font-extrabold text-[#0525bb]">
                    <span className="bg-[#eff4ff] px-2 py-1 rounded border border-[#0525bb]/20">
                      {item.id}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-[#eff4ff] shrink-0 border border-[#c5c5d7]">
                        <img src={item.images.primary} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-[#0b1c30] truncate group-hover:text-[#0525bb]" title={item.name}>{item.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{item.setName} • {item.gradingCompany !== 'Raw' ? `${item.gradingCompany} ${item.gradeValue}` : 'Raw'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold font-['Geist'] bg-[#eff4ff] text-[#444655] px-2 py-0.5 rounded-full border border-[#c5c5d7]">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-['Geist']">
                    <p className="font-extrabold text-[#0525bb]">{currencySymbol}{item.sellingPrice.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">Cost: {currencySymbol}{item.purchaseCost.toFixed(2)}</p>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-gray-600 max-w-[180px]">
                      <MapPin className="w-3 h-3 text-[#006b5f] shrink-0" />
                      <span className="truncate text-[11px] font-semibold">{item.storageLocation}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`font-mono font-extrabold px-2 py-0.5 rounded text-xs ${
                      item.quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-[#d3e4fe] text-[#0525bb]'
                    }`}>
                      {item.quantity}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'In Vault' ? 'bg-[#dae2fd] text-[#0525bb]' :
                      item.status === 'On Floor' ? 'bg-[#b6f2ea] text-[#006b5f]' :
                      item.status === 'Vending Machine' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-[#eff4ff] text-[#0525bb] hover:bg-[#0525bb] hover:text-white transition-colors"
                        title="Edit Collectible & Ledger"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete immutable SKU ${item.id} (${item.name})?`)) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-50 text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white transition-colors"
                        title="Decommission SKU"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intake / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-[#c5c5d7] my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#c5c5d7]">
              <div>
                <span className="text-[10px] font-mono font-bold bg-[#0525bb] text-white px-2 py-0.5 rounded uppercase">
                  {editingItem ? editingItem.id : 'Auto ID Intake'}
                </span>
                <h3 className="font-['Geist'] font-extrabold text-xl text-[#0b1c30] mt-1">
                  {editingItem ? 'Edit Collectible & Issue Ledger Audit' : 'Intake New Inventory Asset'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#757686] uppercase mb-1">SKU Card Title / Asset Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Charizard VMAX Shiny"
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0525bb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Set Name / Series</label>
                  <input
                    type="text"
                    value={formSet}
                    onChange={(e) => setFormSet(e.target.value)}
                    placeholder="e.g. Shining Fates"
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0525bb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Category Type</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as InventoryCategory)}
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0525bb]"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {formCategory === 'Slabs' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Grading Co.</label>
                      <select
                        value={formGrading}
                        onChange={(e) => setFormGrading(e.target.value as any)}
                        className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0b1c30]"
                      >
                        <option value="PSA">PSA</option>
                        <option value="CGC">CGC</option>
                        <option value="BGS">BGS</option>
                        <option value="SGC">SGC</option>
                        <option value="ALT">ALT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Grade Score</label>
                      <input
                        type="text"
                        value={formGradeVal}
                        onChange={(e) => setFormGradeVal(e.target.value)}
                        placeholder="e.g. 10 or 9.5"
                        className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0b1c30]"
                      >
                      </input>
                    </div>
                  </>
                )}
              </div>

              {/* Financial & Stock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#eff4ff] rounded-2xl border border-[#c5c5d7]">
                <div>
                  <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Purchase Cost ({currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    className="w-full bg-white border border-[#c5c5d7] rounded-xl px-3 py-2 text-xs font-extrabold text-[#0b1c30]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#757686] uppercase">Selling Price ({currencySymbol})</label>
                    <button
                      type="button"
                      onClick={handleAutoCalcPrice}
                      className="text-[10px] text-[#0525bb] font-bold hover:underline flex items-center gap-0.5"
                      title={`Calculate using default multiplier (${costMultiplier}x)`}
                    >
                      <Calculator className="w-2.5 h-2.5" /> Auto {costMultiplier}x
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-white border border-[#0525bb] rounded-xl px-3 py-2 text-xs font-extrabold text-[#0525bb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Quantity Stock</label>
                  <input
                    type="number"
                    required
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                    className="w-full bg-white border border-[#c5c5d7] rounded-xl px-3 py-2 text-xs font-extrabold text-[#0b1c30]"
                  />
                </div>
              </div>

              {/* Storage & Supplier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Storage Vault Location *</label>
                  <input
                    type="text"
                    required
                    value={formStorage}
                    onChange={(e) => setFormStorage(e.target.value)}
                    placeholder="e.g. Downtown Vault Bin A1"
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Supplier / Seller Information</label>
                  <input
                    type="text"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    placeholder="e.g. Nintendo Distro or Walk-in"
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30]"
                  />
                </div>
              </div>

              {/* Multiple Images Support */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl px-3.5 py-2 text-xs text-[#0b1c30]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Back / Slab Seal Image URL (Optional)</label>
                  <input
                    type="url"
                    value={formBackImage}
                    onChange={(e) => setFormBackImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl px-3.5 py-2 text-xs text-[#0b1c30]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#757686] uppercase mb-1">Internal Ledger Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Audit trail condition details..."
                  className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl p-3 text-xs text-[#0b1c30] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c5c5d7]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#c5c5d7] text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0525bb] text-white text-xs font-extrabold font-['Geist'] uppercase tracking-wider shadow-lg hover:bg-[#2e44d1]"
                >
                  Confirm & Commit Ledger Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
