import React, { useState } from 'react';
import { CustomerProfile, TransactionRecord } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Award, 
  ArrowLeftRight, 
  ShoppingCart, 
  History, 
  Edit, 
  Tag,
  ShieldCheck,
  X
} from 'lucide-react';

interface CRMScreenProps {
  customers: CustomerProfile[];
  onAddCustomer: (cust: CustomerProfile) => void;
  onUpdateCustomer: (cust: CustomerProfile) => void;
  transactions: TransactionRecord[];
  currencySymbol: string;
}

export const CRMScreen: React.FC<CRMScreenProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  transactions,
  currencySymbol,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerProfile | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState<'Silver' | 'Gold' | 'Apex VIP' | 'Guest'>('Gold');
  const [credit, setCredit] = useState('0');
  const [points, setPoints] = useState('100');
  const [notes, setNotes] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');

  const tiers = ['All', 'Apex VIP', 'Gold', 'Silver', 'Guest'];

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.phone && c.phone.includes(searchQuery));
    const matchesTier = selectedTier === 'All' || c.membershipTier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const totalLifetimeSpend = customers.reduce((acc, c) => acc + c.lifetimeSpending, 0);
  const totalStoreCreditOut = customers.reduce((acc, c) => acc + c.storeCreditBalance, 0);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setName('');
    setEmail('');
    setPhone('');
    setTier('Silver');
    setCredit('0');
    setPoints('50');
    setNotes('');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
    setShowModal(true);
  };

  const handleOpenEdit = (c: CustomerProfile) => {
    setEditingCustomer(c);
    setName(c.name);
    setEmail(c.email ?? '');
    setPhone(c.phone ?? '');
    setTier(c.membershipTier);
    setCredit(c.storeCreditBalance.toString());
    setPoints(c.loyaltyPoints.toString());
    setNotes(c.notes ?? '');
    setAvatar(c.avatarUrl);
    setShowModal(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onUpdateCustomer({
        ...editingCustomer,
        name: name || 'Valued Guest',
        email,
        phone,
        membershipTier: tier,
        storeCreditBalance: parseFloat(credit) || 0,
        loyaltyPoints: parseInt(points) || 0,
        notes,
        avatarUrl: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      });
    } else {
      const newCust: CustomerProfile = {
        id: `cust-${Date.now()}`,
        companyId: 'comp-1',
        name: name || 'New VIP Guest',
        email,
        phone,
        membershipTier: tier,
        storeCreditBalance: parseFloat(credit) || 0,
        loyaltyPoints: parseInt(points) || 0,
        lifetimeSpending: 0,
        lifetimeTradesValue: 0,
        memberSince: 'Just now',
        tradesCount: 0,
        salesCount: 0,
        avatarUrl: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        notes
      };
      onAddCustomer(newCust);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#c5c5d7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-['Geist'] text-2xl font-extrabold text-[#0525bb]">Customer Management & Loyalty</h2>
            <span className="text-[10px] font-bold bg-[#eff4ff] text-[#0525bb] px-2 py-0.5 rounded uppercase">CRM v3</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track lifetime spending, trade volume, store credit balances, and loyalty program tiers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-[#0525bb] text-white text-xs font-bold font-['Geist'] uppercase tracking-wider shadow-md hover:bg-[#2e44d1] transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Register New Guest
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase font-['Geist']">Total Active Guests</p>
            <p className="text-2xl font-extrabold text-[#0b1c30] font-['Geist'] mt-1">{customers.length} Profiles</p>
            <p className="text-[10px] text-[#0525bb] font-semibold mt-0.5">Membership & Loyalty ready</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#0525bb] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase font-['Geist']">Customer Lifetime Spend</p>
            <p className="text-2xl font-extrabold text-[#006b5f] font-['Geist'] mt-1">{currencySymbol}{totalLifetimeSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Average ticket index +18%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#006b5f] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c5c5d7] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase font-['Geist']">Issued Store Credit</p>
            <p className="text-2xl font-extrabold text-[#0525bb] font-['Geist'] mt-1">{currencySymbol}{totalStoreCreditOut.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Redeemable at POS & Vending</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#0525bb] flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#c5c5d7] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2 bg-[#f8f9ff] px-3.5 py-2 rounded-xl border border-[#c5c5d7] w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest name, email, phone..."
            className="bg-transparent border-none focus:outline-none text-xs w-full text-[#0b1c30]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all font-['Geist'] ${
                selectedTier === t ? 'bg-[#0525bb] text-white shadow-xs' : 'bg-[#eff4ff] text-[#444655] hover:bg-[#dae2fd]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table View */}
      <div className="bg-white rounded-3xl border border-[#c5c5d7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c5c5d7] text-[11px] font-bold text-[#757686] uppercase tracking-wider font-['Geist']">
                <th className="py-3.5 px-4">Guest Identity</th>
                <th className="py-3.5 px-4">Membership Tier</th>
                <th className="py-3.5 px-4">Store Credit</th>
                <th className="py-3.5 px-4">Loyalty Pts</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Trade Volume</th>
                <th className="py-3.5 px-4">Activity Stats</th>
                <th className="py-3.5 px-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5c5d7]/60 text-xs">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#f8f9ff] transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={cust.avatarUrl} alt="" className="w-9 h-9 rounded-full border object-cover bg-white shrink-0 shadow-2xs" />
                      <div>
                        <p className="font-bold text-[#0b1c30] group-hover:text-[#0525bb] transition-colors">{cust.name}</p>
                        <p className="text-[10px] text-gray-500">{cust.email ?? cust.phone ?? 'No contact'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-['Geist'] uppercase tracking-wider ${
                      cust.membershipTier === 'Apex VIP' ? 'bg-[#0525bb] text-white shadow-xs' :
                      cust.membershipTier === 'Gold' ? 'bg-[#e5a000]/20 text-[#855c00] border border-[#e5a000]/40' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {cust.membershipTier}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-['Geist'] font-extrabold text-[#006b5f]">
                    {currencySymbol}{cust.storeCreditBalance.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-[#0525bb]">
                    {cust.loyaltyPoints} pts
                  </td>

                  <td className="py-3.5 px-4 font-['Geist'] font-extrabold text-[#0b1c30]">
                    {currencySymbol}{cust.lifetimeSpending.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-['Geist'] font-semibold text-gray-600">
                    {currencySymbol}{cust.lifetimeTradesValue.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-[11px] text-gray-500">
                    {cust.salesCount} sales • {cust.tradesCount} trades
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(cust)}
                      className="p-2 rounded-lg bg-[#eff4ff] text-[#0525bb] hover:bg-[#0525bb] hover:text-white transition-colors"
                      title="Edit Profile Controls"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#c5c5d7] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c5c5d7]">
              <h3 className="font-['Geist'] font-extrabold text-lg text-[#0b1c30]">
                {editingCustomer ? 'Edit Guest CRM Profile' : 'Register New Store Guest'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl p-2.5 font-bold"
                  placeholder="e.g. Alexander Pierce"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl p-2.5 font-bold text-[#0525bb]"
                  >
                    <option value="Apex VIP">Apex VIP</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Guest">Guest</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Store Credit ({currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={credit}
                    onChange={(e) => setCredit(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl p-2.5 font-extrabold text-[#006b5f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Loyalty Pts</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Avatar Photo URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Internal Collector Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#c5c5d7] rounded-xl p-2.5"
                  placeholder="Collecting preferences, favorite sets..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#c5c5d7]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0525bb] text-white text-xs font-extrabold font-['Geist'] uppercase tracking-wider">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
