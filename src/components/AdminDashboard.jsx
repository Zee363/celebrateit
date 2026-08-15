import React, { useState } from 'react';
import { SAMPLE_BRIDES_ROSTER } from '../data/mockData';

export default function AdminDashboard({
  vendors,
  onToggleVendorLive,
  onDeleteVendor,
  searchMisses: initialSearchMisses,
  enquiries,
  bridesCount = 12,
  twoCelebrationsCount = 9
}) {
  // Recruitment To-Do State
  const [searchMisses, setSearchMisses] = useState(initialSearchMisses || []);
  const [showAddMissModal, setShowAddMissModal] = useState(false);
  const [newMissCategory, setNewMissCategory] = useState('');
  const [newMissArea, setNewMissArea] = useState('Sandton');
  const [newMissNotes, setNewMissNotes] = useState('');

  // Brides & Weddings Roster State
  const [bridesRoster, setBridesRoster] = useState(SAMPLE_BRIDES_ROSTER);
  const [rosterTab, setRosterTab] = useState('UPCOMING'); // 'UPCOMING' | 'PAST' | 'ALL'

  // Dynamic Enquiry Metrics
  const totalEnquiries = enquiries ? enquiries.length : 0;
  const sentCount = enquiries ? enquiries.filter(e => e.status === 'SENT').length : 0;
  const repliedCount = enquiries ? enquiries.filter(e => e.status === 'REPLIED').length : 0;
  const bookedCount = enquiries ? enquiries.filter(e => e.status === 'BOOKED').length : 0;
  const conversionRate = totalEnquiries > 0 ? Math.round((bookedCount / totalEnquiries) * 100) : 0;

  const liveVendorsCount = vendors.filter((v) => v.isLive).length;

  // Recruitment actions
  const handleUpdateMissStatus = (id, nextStatus) => {
    setSearchMisses(prev =>
      prev.map(item => item.id === id ? { ...item, status: nextStatus } : item)
    );
  };

  const handleUpdateMissNotes = (id, notes) => {
    setSearchMisses(prev =>
      prev.map(item => item.id === id ? { ...item, notes } : item)
    );
  };

  const handleDeleteMiss = (id) => {
    setSearchMisses(prev => prev.filter(item => item.id !== id));
  };

  const handleAddMissSubmit = (e) => {
    e.preventDefault();
    if (!newMissCategory.trim()) return;

    const newItem = {
      id: 'sm_' + Date.now(),
      category: newMissCategory.trim(),
      area: newMissArea,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PENDING',
      notes: newMissNotes.trim()
    };

    setSearchMisses([newItem, ...searchMisses]);
    setNewMissCategory('');
    setNewMissNotes('');
    setShowAddMissModal(false);
  };

  // Weddings Roster Processing with Date Check
  const todayStr = new Date().toISOString().substring(0, 10); // e.g. 2026-08-15

  // Flatten all weddings from brides roster and check dates
  const allWeddingsList = bridesRoster.flatMap(b =>
    (b.weddings || []).map(w => {
      const isPastDate = w.date < todayStr;
      const isHappened = w.isCompleted || isPastDate;
      return {
        ...w,
        brideId: b.id,
        brideName: b.name,
        brideEmail: b.email,
        isPastDate,
        isHappened
      };
    })
  );

  const upcomingWeddings = allWeddingsList.filter(w => !w.isHappened);
  const pastWeddings = allWeddingsList.filter(w => w.isHappened);

  const displayedWeddings = rosterTab === 'UPCOMING'
    ? upcomingWeddings
    : rosterTab === 'PAST'
      ? pastWeddings
      : allWeddingsList;

  const handleToggleWeddingStatus = (brideId, weddingTitle) => {
    setBridesRoster(prev =>
      prev.map(b => {
        if (b.id !== brideId) return b;
        return {
          ...b,
          weddings: b.weddings.map(w => {
            if (w.title !== weddingTitle) return w;
            return { ...w, isCompleted: !w.isCompleted };
          })
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F5F2] pt-28 pb-12 px-4 sm:px-6 lg:px-12 font-sans space-y-8">

      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E6DED6] pb-6 gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9E784B]">
            FOUNDER DASHBOARD & LOGISTICS PORTAL
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#1A1816]">
            CelebrateIT Platform Admin Metrics
          </h1>
          <p className="text-xs text-[#1A1816]/70 mt-1">
            Real-time recruitment tasks, enquiry performance analytics, and upcoming wedding date tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-serif text-xs text-[#1A1816]">
            Status: <span className="font-semibold text-emerald-700">● Operational</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Dynamic Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
                DYNAMIC ENQUIRY VOLUME
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                {conversionRate}% Booked
              </span>
            </div>
            <div className="font-serif text-3xl font-bold text-[#1A1816]">
              {totalEnquiries} <span className="text-xs font-sans font-normal text-[#1A1816]/60">total</span>
            </div>
            <div className="text-xs text-[#1A1816]/70 flex items-center gap-2 pt-1 border-t border-[#E6DED6]/60">
              <span>{sentCount} Sent</span>
              <span>•</span>
              <span>{repliedCount} Replied</span>
              <span>•</span>
              <span className="font-semibold text-emerald-700">{bookedCount} Booked</span>
            </div>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-2 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1A1816]/60">
              REGISTERED BRIDES & WEDDINGS
            </span>
            <div className="font-serif text-3xl font-bold text-[#1A1816]">
              {bridesRoster.length} <span className="text-xs font-sans font-normal text-[#1A1816]/60">Brides</span>
            </div>
            <div className="text-xs text-[#1A1816]/70 flex items-center justify-between pt-1 border-t border-[#E6DED6]/60">
              <span className="text-emerald-700 font-medium">{upcomingWeddings.length} Upcoming</span>
              <span className="text-stone-400">{pastWeddings.length} Past</span>
            </div>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-2 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1A1816]/60">
              ACTIVE VENDORS NETWORK
            </span>
            <div className="font-serif text-3xl font-bold text-[#1A1816]">
              {liveVendorsCount} <span className="text-xs font-sans font-normal text-[#1A1816]/60">Live</span>
            </div>
            <div className="text-xs text-[#1A1816]/60 pt-1 border-t border-[#E6DED6]/60">
              Out of {vendors.length} registered profiles
            </div>
          </div>

          <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 space-y-2 shadow-xs">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-700">
              RECRUITMENT TO-DO TASKS
            </span>
            <div className="font-serif text-3xl font-bold text-amber-700">
              {searchMisses.filter(m => m.status !== 'ONBOARDED' && m.status !== 'DISMISSED').length}
            </div>
            <div className="text-xs text-[#1A1816]/60 pt-1 border-t border-[#E6DED6]/60">
              Active Supply Gap Queries
            </div>
          </div>

        </div>

        {/* Section 0: Platform Financial GMV & Category Coverage Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* GMV Financial Card */}
          <div className="lg:col-span-6 bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-[#E6DED6] pb-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
                  FINANCIAL ANALYTICS
                </span>
                <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                  Platform GMV & Revenue Model
                </h3>
              </div>
              <span className="text-xs font-semibold bg-[#9E784B]/10 text-[#9E784B] px-3 py-1 rounded-full">
                10% Fee Model
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F9F5F2] border border-[#E6DED6] p-4 rounded-xl space-y-1">
                <span className="text-xs text-[#1A1816]/60">Total Platform GMV</span>
                <div className="font-serif text-2xl font-bold text-[#1A1816]">
                  R 4,820,000
                </div>
                <p className="text-[10px] text-[#1A1816]/70">Sum of tracked bride budgets</p>
              </div>

              <div className="bg-[#F9F5F2] border border-[#E6DED6] p-4 rounded-xl space-y-1">
                <span className="text-xs text-[#1A1816]/60">Est. Commission Revenue</span>
                <div className="font-serif text-2xl font-bold text-emerald-800">
                  R 482,000
                </div>
                <p className="text-[10px] text-emerald-700 font-semibold">10% Platform booking fee</p>
              </div>
            </div>

            <div className="text-xs text-[#1A1816]/80 bg-stone-50 border border-[#E6DED6] p-3 rounded-xl flex justify-between items-center">
              <span>Average Planned Budget per Bride: <strong>R 401 666</strong></span>
              <span>Avg Guests: <strong>150 guests</strong></span>
            </div>
          </div>

          {/* Category & Region Coverage Grid */}
          <div className="lg:col-span-6 bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="border-b border-[#E6DED6] pb-3">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
                SUPPLY COVERAGE
              </span>
              <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                Vendor Category & Regional Distribution
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'Venues', count: vendors.filter(v => v.category === 'Venue').length, status: 'Optimal' },
                { name: 'Photography', count: vendors.filter(v => v.category === 'Photography').length, status: 'Optimal' },
                { name: 'Catering', count: vendors.filter(v => v.category === 'Catering').length, status: 'Needs Supply' },
                { name: 'Hair & Makeup', count: vendors.filter(v => v.category === 'Hair & Makeup').length, status: 'Optimal' },
                { name: 'Attire', count: vendors.filter(v => v.category === 'Attire').length, status: 'Optimal' },
                { name: 'Music & DJ', count: vendors.filter(v => v.category === 'Music').length, status: 'Needs Supply' }
              ].map((cat, i) => (
                <div key={i} className="bg-[#F9F5F2] border border-[#E6DED6] p-3 rounded-xl space-y-1">
                  <div className="font-semibold text-xs text-[#1A1816]">{cat.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-[#9E784B]">{cat.count} listings</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      cat.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {cat.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Section 1: Dynamic Weddings & Brides Roster (Upcoming vs Past) */}
        <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DED6] pb-4">
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
                CELEBRATION ROSTER
              </span>
              <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                Tracked Weddings & Date Roster
              </h3>
              <p className="text-xs text-[#1A1816]/60">
                Automatically monitors wedding dates against today ({todayStr}) to move completed celebrations off the upcoming roster.
              </p>
            </div>

            {/* Tab Filter */}
            <div className="flex items-center gap-1.5 bg-[#F9F5F2] border border-[#E6DED6] p-1 rounded-xl">
              <button
                onClick={() => setRosterTab('UPCOMING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${rosterTab === 'UPCOMING'
                  ? 'bg-[#1A1816] text-white shadow-xs'
                  : 'text-[#1A1816]/70 hover:text-[#1A1816]'
                  }`}
              >
                Upcoming ({upcomingWeddings.length})
              </button>
              <button
                onClick={() => setRosterTab('PAST')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${rosterTab === 'PAST'
                  ? 'bg-[#1A1816] text-white shadow-xs'
                  : 'text-[#1A1816]/70 hover:text-[#1A1816]'
                  }`}
              >
                Past / Happened ({pastWeddings.length})
              </button>
              <button
                onClick={() => setRosterTab('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${rosterTab === 'ALL'
                  ? 'bg-[#1A1816] text-white shadow-xs'
                  : 'text-[#1A1816]/70 hover:text-[#1A1816]'
                  }`}
              >
                All ({allWeddingsList.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F9F5F2] border-b border-[#E6DED6] text-[#1A1816]/70">
                <tr>
                  <th className="p-3 font-semibold">Bride Name</th>
                  <th className="p-3 font-semibold">Celebration Title</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Target Date</th>
                  <th className="p-3 font-semibold">Area</th>
                  <th className="p-3 font-semibold">Guests</th>
                  <th className="p-3 font-semibold">Roster Status</th>
                  <th className="p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED6]">
                {displayedWeddings.length > 0 ? (
                  displayedWeddings.map((w, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3 font-semibold text-[#1A1816]">{w.brideName}</td>
                      <td className="p-3 text-[#1A1816]/90 font-medium">{w.title}</td>
                      <td className="p-3">
                        <span className="bg-[#F9F5F2] border border-[#E6DED6] px-2 py-0.5 rounded-md text-[10px] font-semibold text-[#9E784B]">
                          {w.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-semibold text-[#1A1816]">
                        {w.date}
                      </td>
                      <td className="p-3 text-[#1A1816]/80">{w.area}</td>
                      <td className="p-3 text-[#1A1816]/80">{w.guestCount} guests</td>
                      <td className="p-3">
                        {w.isHappened ? (
                          <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 w-fit">
                            Happened / Completed
                          </span>
                        ) : (
                          <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 w-fit">
                            Upcoming
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleWeddingStatus(w.brideId, w.title)}
                          className="text-[11px] font-semibold bg-white border border-[#E6DED6] px-2.5 py-1 rounded-md text-[#1A1816] hover:border-[#9E784B] transition-colors cursor-pointer"
                        >
                          {w.isHappened ? 'Mark Upcoming' : 'Mark Completed'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-6 text-center text-[#1A1816]/60">
                      No weddings found in this roster view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Fully Functional Recruitment To-Do List */}
        <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DED6] pb-4">
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
                VENDOR ACQUISITION PIPELINE
              </span>
              <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                Recruitment To-Do List (Supply Gap Tracker)
              </h3>
              <p className="text-xs text-[#1A1816]/60">
                Log and prioritize supply gaps identified from zero-result searches and bride feedback.
              </p>
            </div>

            <button
              onClick={() => setShowAddMissModal(true)}
              className="bg-[#1A1816] text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>+</span> Log Supply Gap
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F9F5F2] border-b border-[#E6DED6] text-[#1A1816]/70">
                <tr>
                  <th className="p-3 font-semibold">Category Needed</th>
                  <th className="p-3 font-semibold">Area / Region</th>
                  <th className="p-3 font-semibold">Recorded Date</th>
                  <th className="p-3 font-semibold">Pipeline Status</th>
                  <th className="p-3 font-semibold">Recruitment Notes</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED6]">
                {searchMisses.map((sm) => (
                  <tr key={sm.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3 font-semibold text-[#1A1816]">{sm.category}</td>
                    <td className="p-3 text-[#1A1816]/80">{sm.area}</td>
                    <td className="p-3 text-stone-400 font-mono text-[11px]">{sm.createdAt}</td>
                    <td className="p-3">
                      <select
                        value={sm.status || 'PENDING'}
                        onChange={(e) => handleUpdateMissStatus(sm.id, e.target.value)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${sm.status === 'ONBOARDED'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : sm.status === 'IN_OUTREACH'
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : sm.status === 'DISMISSED'
                              ? 'bg-stone-100 border-stone-300 text-stone-500'
                              : 'bg-blue-50 border-blue-300 text-blue-800'
                          }`}
                      >
                        <option value="PENDING">Pending Outreach</option>
                        <option value="IN_OUTREACH">In Outreach</option>
                        <option value="ONBOARDED">Vendor Onboarded</option>
                        <option value="DISMISSED">Dismissed</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={sm.notes || ''}
                        onChange={(e) => handleUpdateMissNotes(sm.id, e.target.value)}
                        placeholder="Add notes (e.g., Contacted Jozi Music Agency)"
                        className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-md px-2.5 py-1 text-xs text-[#1A1816]"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteMiss(sm.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-xs cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Vendor Directory Controls */}
        <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E6DED6] pb-4">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                Partner Vendor Controls
              </h3>
              <p className="text-xs text-[#1A1816]/60">Manage directory visibility and status for onboarded business listings</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F9F5F2] border-b border-[#E6DED6] text-[#1A1816]/70">
                <tr>
                  <th className="p-3 font-semibold">Business Name</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Areas</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED6]">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50">
                    <td className="p-3 font-semibold text-[#1A1816]">{v.businessName}</td>
                    <td className="p-3 text-[#1A1816]/80">{v.category}</td>
                    <td className="p-3 text-[#1A1816]/70">{v.areasServed ? v.areasServed.join(', ') : 'Gauteng'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${v.isLive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                        {v.isLive ? 'LIVE' : 'PAUSED'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleVendorLive(v.id)}
                          className="bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] px-3 py-1 rounded-md text-[11px] font-semibold hover:border-[#9E784B] cursor-pointer whitespace-nowrap"
                        >
                          {v.isLive ? 'Pause' : 'Restore'}
                        </button>
                        <button
                          onClick={() => onDeleteVendor(v.id)}
                          className="bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-md text-[11px] font-semibold hover:border-red-400 cursor-pointer whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Supply Gap Modal */}
      {showAddMissModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-md w-full p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-[#E6DED6] pb-3">
              <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                Log Supply Gap / Recruitment Task
              </h3>
              <button
                onClick={() => setShowAddMissModal(false)}
                className="text-stone-400 hover:text-[#1A1816] text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMissSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#1A1816]/80">Vendor Category Needed</label>
                <input
                  type="text"
                  required
                  value={newMissCategory}
                  onChange={(e) => setNewMissCategory(e.target.value)}
                  placeholder="e.g. Marimba Band, Traditional Beer Brewer"
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm text-[#1A1816] mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1816]/80">Target Area</label>
                <select
                  value={newMissArea}
                  onChange={(e) => setNewMissArea(e.target.value)}
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm text-[#1A1816] mt-1"
                >
                  <option value="Sandton">Sandton</option>
                  <option value="Soweto">Soweto</option>
                  <option value="Johannesburg">Johannesburg</option>
                  <option value="Pretoria">Pretoria</option>
                  <option value="Midrand">Midrand</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#1A1816]/80">Recruitment Notes</label>
                <textarea
                  rows={3}
                  value={newMissNotes}
                  onChange={(e) => setNewMissNotes(e.target.value)}
                  placeholder="e.g. Requested by 3 brides for upcoming November ceremonies..."
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg p-3 text-sm text-[#1A1816] mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E6DED6]">
                <button
                  type="button"
                  onClick={() => setShowAddMissModal(false)}
                  className="px-4 py-2 rounded-lg text-stone-500 hover:text-[#1A1816] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1A1816] text-white px-5 py-2 rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

