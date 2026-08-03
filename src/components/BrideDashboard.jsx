import React, { useState } from 'react';

export default function BrideDashboard({
  bride,
  onOpenDirectory,
  onOpenMuse,
  onUpdateBride,
  onOpenEnquiries
}) {
  const [activeTab, setActiveTab] = useState(
    bride.celebrations?.[0]?.id || 'all'
  );
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);

  // New item state
  const [newCategory, setNewCategory] = useState('');
  const [newPlanned, setNewPlanned] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const todayStr = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeCelebration = bride.celebrations.find((c) => c.id === activeTab) || bride.celebrations[0];
  const hasTwoCelebrations = bride.celebrations.length >= 2;

  // Total calculations
  const totalPlanned = bride.celebrations.reduce((acc, c) => acc + c.budget, 0);
  const totalSpent = bride.celebrations.reduce((acc, c) => {
    return acc + c.budgetLines.reduce((bAcc, b) => bAcc + (b.actuallySpent || 0), 0);
  }, 0);

  const toggleChecklist = (celebrationId, taskId) => {
    const updated = {
      ...bride,
      celebrations: bride.celebrations.map((c) => {
        if (c.id !== celebrationId) return c;
        return {
          ...c,
          checklist: c.checklist.map((item) =>
            item.id === taskId ? { ...item, done: !item.done } : item
          )
        };
      })
    };
    onUpdateBride(updated);
  };

  const handleAddBudgetLine = (e) => {
    e.preventDefault();
    if (!newCategory.trim() || !newPlanned) return;

    const line = {
      id: 'bl_' + Date.now(),
      category: newCategory.trim(),
      planned: Number(newPlanned),
      actuallySpent: 0,
      linkedVendor: ''
    };

    const updated = {
      ...bride,
      celebrations: bride.celebrations.map((c) => {
        if (c.id !== activeCelebration.id) return c;
        return {
          ...c,
          budgetLines: [...c.budgetLines, line]
        };
      })
    };

    onUpdateBride(updated);
    setNewCategory('');
    setNewPlanned('');
    setShowAddBudgetModal(false);
  };

  const handleAddChecklistTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task = {
      id: 'cl_' + Date.now(),
      title: newTaskTitle.trim(),
      dueDate: newDueDate || '2026-10-01',
      done: false
    };

    const updated = {
      ...bride,
      celebrations: bride.celebrations.map((c) => {
        if (c.id !== activeCelebration.id) return c;
        return {
          ...c,
          checklist: [...c.checklist, task]
        };
      })
    };

    onUpdateBride(updated);
    setNewTaskTitle('');
    setNewDueDate('');
    setShowAddChecklistModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F5F2] py-8 px-4 sm:px-6 lg:px-12 font-sans space-y-8">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6DED6] pb-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9E784B]">
            {todayStr}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1816]">
            Hello, {bride.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#1A1816]/70">
            You are currently planning {bride.celebrations.length} celebration{bride.celebrations.length > 1 ? 's' : ''} in Gauteng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMuse}
            className="bg-[#9E784B] text-white px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#8A673E] transition-all cursor-pointer shadow-xs flex items-center gap-2"
          >
            <span>✨</span> Ask Muse
          </button>
          <button
            onClick={onOpenDirectory}
            className="bg-[#1A1816] text-white px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#2A2623] transition-all cursor-pointer shadow-xs"
          >
            Browse Vendors
          </button>
          <button
            onClick={onOpenEnquiries}
            className="bg-white border border-[#E6DED6] text-[#1A1816] px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-stone-50 transition-all cursor-pointer"
          >
            Enquiries
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* "Both Weddings" Summary Card (Only rendered if bride has 2 celebrations) */}
        {hasTwoCelebrations && (
          <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6DED6] pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9E784B]">
                  COMBINED TIMELINE & BUDGET
                </span>
                <h2 className="font-serif text-xl font-medium text-[#1A1816]">
                  Both Weddings Overview
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#1A1816]/60">Total Planned: </span>
                <span className="font-bold text-[#1A1816] font-serif text-lg">
                  R {totalPlanned.toLocaleString('en-ZA')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bride.celebrations.map((c) => {
                const cSpent = c.budgetLines.reduce((acc, b) => acc + (b.actuallySpent || 0), 0);
                const percent = Math.min(100, Math.round((cSpent / (c.budget || 1)) * 100));

                return (
                  <div key={c.id} className="bg-[#F9F5F2] p-4 rounded-xl border border-[#E6DED6] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
                          {c.type} CELEBRATION
                        </span>
                        <h3 className="font-serif text-lg font-medium text-[#1A1816]">
                          {c.title}
                        </h3>
                        <p className="text-xs text-[#1A1816]/70">
                          {c.date} • {c.area} ({c.guestCount} guests)
                        </p>
                      </div>
                      <div className="text-right font-serif text-sm font-semibold text-[#1A1816]">
                        R {c.budget.toLocaleString('en-ZA')}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[#1A1816]/70">
                        <span>Spent so far</span>
                        <span className="font-medium">R {cSpent.toLocaleString('en-ZA')} ({percent}%)</span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E6DED6]">
                        <div
                          className="h-full bg-[#9E784B] transition-all"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Workspace Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-[#E6DED6] pb-2">
          {bride.celebrations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === c.id
                  ? 'bg-[#1A1816] text-white shadow-xs'
                  : 'bg-white border border-[#E6DED6] text-[#1A1816]/70 hover:text-[#1A1816]'
              }`}
            >
              {c.title} ({c.type})
            </button>
          ))}
        </div>

        {/* Active Celebration Workspace */}
        {activeCelebration && (
          <div className="space-y-8">
            
            {/* Celebration Overview Bar */}
            <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-semibold tracking-widest uppercase text-[#9E784B]">
                  WORKSPACE FOR {activeCelebration.type} DAY
                </span>
                <h2 className="font-serif text-2xl font-medium text-[#1A1816]">
                  {activeCelebration.title} — {activeCelebration.area}
                </h2>
                <p className="text-xs text-[#1A1816]/70">
                  Target Date: <strong className="text-[#1A1816]">{activeCelebration.date}</strong> | Guest count: <strong className="text-[#1A1816]">{activeCelebration.guestCount}</strong>
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-[#1A1816]/60">Planned Budget</div>
                  <div className="font-serif text-xl font-semibold text-[#1A1816]">
                    R {activeCelebration.budget.toLocaleString('en-ZA')}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid layout for Budget & Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Budget Lines (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#E6DED6] pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                      Budget Planner ({activeCelebration.title})
                    </h3>
                    <p className="text-xs text-[#1A1816]/60">Every Rand planned for this celebration</p>
                  </div>
                  <button
                    onClick={() => setShowAddBudgetModal(true)}
                    className="text-xs font-semibold bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] px-3.5 py-2 rounded-lg hover:border-[#9E784B] transition-colors cursor-pointer"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="space-y-4">
                  {activeCelebration.budgetLines.map((line) => {
                    const linePercent = Math.min(
                      100,
                      Math.round((line.actuallySpent / (line.planned || 1)) * 100)
                    );

                    return (
                      <div key={line.id} className="p-4 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-[#1A1816]">{line.category}</span>
                          <span className="font-serif text-[#1A1816]">
                            R {line.actuallySpent.toLocaleString('en-ZA')} / R {line.planned.toLocaleString('en-ZA')}
                          </span>
                        </div>

                        {line.linkedVendor && (
                          <div className="text-xs text-[#9E784B] font-medium">
                            Linked Vendor: {line.linkedVendor}
                          </div>
                        )}

                        <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#E6DED6]">
                          <div
                            className="h-full bg-[#9E784B]"
                            style={{ width: `${linePercent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Checklist Items (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#E6DED6] pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                      Action Checklist
                    </h3>
                    <p className="text-xs text-[#1A1816]/60">Tasks for {activeCelebration.title}</p>
                  </div>
                  <button
                    onClick={() => setShowAddChecklistModal(true)}
                    className="text-xs font-semibold bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] px-3.5 py-2 rounded-lg hover:border-[#9E784B] transition-colors cursor-pointer"
                  >
                    + Task
                  </button>
                </div>

                <div className="space-y-3">
                  {activeCelebration.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(activeCelebration.id, item.id)}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                        item.done
                          ? 'bg-stone-50 border-[#E6DED6] text-stone-400'
                          : 'bg-[#F9F5F2] border-[#E6DED6] text-[#1A1816] hover:border-[#9E784B]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => {}}
                        className="mt-0.5 accent-[#9E784B] w-4 h-4 rounded-xs cursor-pointer"
                      />
                      <div className="space-y-0.5 text-xs">
                        <div className={`font-medium ${item.done ? 'line-through' : ''}`}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#1A1816]/50">Due: {item.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Add Budget Line Modal */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1A1816]">
              Add Budget Item to {activeCelebration.title}
            </h3>
            <form onSubmit={handleAddBudgetLine} className="space-y-3 font-sans text-xs">
              <div>
                <label className="font-semibold text-[#1A1816]/80">Category</label>
                <input
                  type="text"
                  required
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Traditional Beer & Beverage Supplies"
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm text-[#1A1816]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#1A1816]/80">Planned Amount (Rands)</label>
                <input
                  type="number"
                  required
                  value={newPlanned}
                  onChange={(e) => setNewPlanned(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm text-[#1A1816]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBudgetModal(false)}
                  className="px-4 py-2 rounded-lg text-stone-500 hover:text-[#1A1816]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1A1816] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Checklist Task Modal */}
      {showAddChecklistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1A1816]">
              Add Task to {activeCelebration.title}
            </h3>
            <form onSubmit={handleAddChecklistTask} className="space-y-3 font-sans text-xs">
              <div>
                <label className="font-semibold text-[#1A1816]/80">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Finalise seating arrangement"
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm text-[#1A1816]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#1A1816]/80">Target Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm text-[#1A1816]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChecklistModal(false)}
                  className="px-4 py-2 rounded-lg text-stone-500 hover:text-[#1A1816]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1A1816] text-white px-5 py-2 rounded-lg font-semibold"
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
