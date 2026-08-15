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

  // Edit celebration modal state
  const [showEditCelebrationModal, setShowEditCelebrationModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editGuestCount, setEditGuestCount] = useState('');
  const [editBudget, setEditBudget] = useState('');

  // New item state
  const [newCategory, setNewCategory] = useState('');
  const [newPlanned, setNewPlanned] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Checklist tab filter ('ALL' | 'URGENT' | 'COMPLETED')
  const [checklistFilter, setChecklistFilter] = useState('ALL');

  // Interactive Guest Simulator State for Active Celebration
  const [simulatedGuests, setSimulatedGuests] = useState(null);

  const handleOpenEditCelebration = (c) => {
    const celeb = c || activeCelebration;
    if (!celeb) return;
    setEditTitle(celeb.title || '');
    setEditDate(celeb.date || '');
    setEditArea(celeb.area || '');
    setEditGuestCount(celeb.guestCount || 100);
    setEditBudget(celeb.budget || 200000);
    setShowEditCelebrationModal(true);
  };

  const handleSaveEditCelebration = (e) => {
    e.preventDefault();
    if (!activeCelebration) return;

    const updatedCelebrations = bride.celebrations.map((c) => {
      if (c.id !== activeCelebration.id) return c;
      return {
        ...c,
        title: editTitle.trim() || c.title,
        date: editDate || c.date,
        area: editArea.trim() || c.area,
        guestCount: Number(editGuestCount) || c.guestCount,
        budget: Number(editBudget) || c.budget
      };
    });

    const updatedBride = {
      ...bride,
      celebrations: updatedCelebrations
    };

    onUpdateBride(updatedBride);
    setShowEditCelebrationModal(false);
  };

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

  // Date Logic for Checklist Task Prompts
  const today = new Date('2026-08-15'); // Current platform reference date

  const getTaskDateInfo = (dueDateStr) => {
    if (!dueDateStr) return { daysLeft: 999, status: 'NORMAL', text: 'No due date' };
    const due = new Date(dueDateStr);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { daysLeft: diffDays, status: 'OVERDUE', text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}` };
    } else if (diffDays === 0) {
      return { daysLeft: 0, status: 'DUE_TODAY', text: 'Due TODAY!' };
    } else if (diffDays <= 14) {
      return { daysLeft: diffDays, status: 'URGENT', text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}` };
    }
    return { daysLeft: diffDays, status: 'NORMAL', text: `Due: ${dueDateStr}` };
  };

  // Collect all pending & urgent tasks across celebrations for top banner
  const allUrgentTasks = bride.celebrations.flatMap((c) =>
    (c.checklist || [])
      .filter((t) => !t.done)
      .map((t) => ({ ...t, celebrationTitle: c.title, celebrationId: c.id, dateInfo: getTaskDateInfo(t.dueDate) }))
      .filter((t) => t.dateInfo.status === 'OVERDUE' || t.dateInfo.status === 'DUE_TODAY' || t.dateInfo.status === 'URGENT')
  ).sort((a, b) => a.dateInfo.daysLeft - b.dateInfo.daysLeft);

  // Active celebration checklist items processing
  const activeChecklistWithDates = (activeCelebration?.checklist || []).map((t) => ({
    ...t,
    dateInfo: getTaskDateInfo(t.dueDate)
  }));

  const filteredChecklist = activeChecklistWithDates.filter((item) => {
    if (checklistFilter === 'URGENT') {
      return !item.done && (item.dateInfo.status === 'OVERDUE' || item.dateInfo.status === 'DUE_TODAY' || item.dateInfo.status === 'URGENT');
    }
    if (checklistFilter === 'COMPLETED') {
      return item.done;
    }
    return true;
  });

  // Cost vs Guests Calculations for Active Celebration
  const currentGuestCount = simulatedGuests ?? (activeCelebration?.guestCount || 100);
  const plannedBudget = activeCelebration?.budget || 200000;
  const spentBudget = activeCelebration?.budgetLines?.reduce((acc, b) => acc + (b.actuallySpent || 0), 0) || 0;

  const costPerGuestPlanned = Math.round(plannedBudget / (currentGuestCount || 1));
  const costPerGuestSpent = Math.round(spentBudget / (currentGuestCount || 1));

  // Projected Cost if guest count changes
  // Estimate ~65% of budget varies linearly with guest count (catering, decor, drinks, favours)
  const baseFixedCost = plannedBudget * 0.35;
  const variableCostPerGuest = (plannedBudget * 0.65) / (activeCelebration?.guestCount || 100);
  const projectedTotalBudget = Math.round(baseFixedCost + (variableCostPerGuest * currentGuestCount));

  return (
    <div className="min-h-screen bg-[#F9F5F2] pt-28 pb-12 px-4 sm:px-6 lg:px-12 font-sans space-y-8">

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
            Ask Muse
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

        {/* Nearing & Urgent Task Prompts Banner */}
        {allUrgentTasks.length > 0 && (
          <div className="bg-[#F9F5F2] border-2 border-[#9E784B]/40 rounded-2xl p-5 shadow-xs space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A1816]">
                    Tasks Nearing Target Due Dates ({allUrgentTasks.length} pending action)
                  </h3>
                  <p className="text-xs text-[#1A1816]/80">
                    Stay on top of your wedding timeline. Here are your highest priority deliverables:
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#9E784B] text-white px-3 py-1 rounded-full">
                Action Required
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {allUrgentTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-[#E6DED6] hover:border-[#9E784B]/60 rounded-xl p-3.5 flex items-start justify-between gap-3 shadow-xs transition-colors"
                >
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-semibold uppercase text-[#9E784B] tracking-wider">
                      {task.celebrationTitle}
                    </span>
                    <div className="font-semibold text-[#1A1816] line-clamp-1">{task.title}</div>
                    <div className="text-[11px] font-bold text-[#9E784B]">
                      {task.dateInfo.text}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleChecklist(task.celebrationId, task.id)}
                    className="bg-[#1A1816] text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-[#9E784B] transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
              onClick={() => {
                setActiveTab(c.id);
                setSimulatedGuests(null);
              }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === c.id
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
                <p className="text-xs text-[#1A1816]/70 mt-1">
                  Target Date: <strong className="text-[#1A1816]">{activeCelebration.date}</strong> | Expected Guests: <strong className="text-[#9E784B] font-bold text-sm">{activeCelebration.guestCount} guests</strong>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs text-[#1A1816]/60">Planned Budget</div>
                  <div className="font-serif text-xl font-semibold text-[#1A1816]">
                    R {activeCelebration.budget.toLocaleString('en-ZA')}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEditCelebration(activeCelebration)}
                  className="bg-[#1A1816] text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
                >
                  Edit Details & Guests
                </button>
              </div>
            </div>

            {/* NEW FEATURE: Cost per Guest & Budget Calculator */}
            <div className="bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DED6] pb-4">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
                    FINANCIAL ANALYTICS & SIMULATION
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                    Wedding Cost vs. Guest & Budget Calculator
                  </h3>
                  <p className="text-xs text-[#1A1816]/60">
                    Evaluates cost per guest for {activeCelebration.title} and models how guest list adjustments impact your total budget.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#1A1816]/60">Planned Cost per Guest</span>
                  <div className="font-serif text-2xl font-bold text-[#9E784B]">
                    R {costPerGuestPlanned.toLocaleString('en-ZA')} <span className="text-xs font-sans text-[#1A1816]/60 font-normal">/ guest</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Key Financial Ratios */}
                <div className="bg-[#F9F5F2] border border-[#E6DED6] rounded-xl p-5 space-y-3">
                  <h4 className="font-serif text-base font-semibold text-[#1A1816]">Current Budget Summary</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#E6DED6] pb-1.5">
                      <span className="text-[#1A1816]/70">Target Guest Count:</span>
                      <strong className="text-[#1A1816] font-semibold">{currentGuestCount} guests</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#E6DED6] pb-1.5">
                      <span className="text-[#1A1816]/70">Total Planned Budget:</span>
                      <strong className="text-[#1A1816] font-semibold">R {plannedBudget.toLocaleString('en-ZA')}</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#E6DED6] pb-1.5">
                      <span className="text-[#1A1816]/70">Committed / Spent:</span>
                      <strong className="text-[#9E784B] font-semibold">R {spentBudget.toLocaleString('en-ZA')}</strong>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-[#1A1816]/70">Cost Spent per Guest:</span>
                      <strong className="text-[#1A1816] font-semibold">R {costPerGuestSpent.toLocaleString('en-ZA')} / guest</strong>
                    </div>
                  </div>
                </div>

                {/* Card 2: Interactive Guest List Simulator Slider */}
                <div className="bg-[#F9F5F2] border border-[#E6DED6] rounded-xl p-5 space-y-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-[#1A1816]">
                        Guest List Budget Projection Simulator
                      </h4>
                      <p className="text-xs text-[#1A1816]/60">Drag the slider to test how guest count changes your projected budget.</p>
                    </div>
                    {simulatedGuests !== null && (
                      <button
                        onClick={() => setSimulatedGuests(null)}
                        className="text-[11px] font-semibold text-[#9E784B] hover:underline"
                      >
                        Reset to {activeCelebration.guestCount}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center font-semibold text-sm">
                      <span>Simulated Guests: <strong className="text-[#9E784B] text-lg font-serif">{currentGuestCount} guests</strong></span>
                      <span className="text-xs text-[#1A1816]/60">Range: 50 – 300</span>
                    </div>

                    <input
                      type="range"
                      min="50"
                      max="300"
                      step="5"
                      value={currentGuestCount}
                      onChange={(e) => setSimulatedGuests(Number(e.target.value))}
                      className="w-full accent-[#9E784B] cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E6DED6]">
                    <div>
                      <span className="text-xs text-[#1A1816]/60">Projected Total Cost</span>
                      <div className="font-serif text-xl font-bold text-[#1A1816]">
                        R {projectedTotalBudget.toLocaleString('en-ZA')}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-[#1A1816]/60">Budget Variance</span>
                      <div className={`font-serif text-xl font-bold ${projectedTotalBudget > plannedBudget ? 'text-red-700' : 'text-emerald-700'
                        }`}>
                        {projectedTotalBudget > plannedBudget ? '+' : ''}
                        R {(projectedTotalBudget - plannedBudget).toLocaleString('en-ZA')}
                      </div>
                    </div>
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

              {/* Right: Checklist Items with Date Tracking (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-[#E6DED6] rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E6DED6] pb-4 gap-2">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                      Action Checklist
                    </h3>
                    <p className="text-xs text-[#1A1816]/60">Tasks for {activeCelebration.title}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Checklist filter */}
                    <select
                      value={checklistFilter}
                      onChange={(e) => setChecklistFilter(e.target.value)}
                      className="bg-[#F9F5F2] border border-[#E6DED6] text-[11px] font-semibold px-2.5 py-1.5 rounded-lg text-[#1A1816]"
                    >
                      <option value="ALL">All Tasks</option>
                      <option value="URGENT">Urgent / Due Soon</option>
                      <option value="COMPLETED">Completed</option>
                    </select>

                    <button
                      onClick={() => setShowAddChecklistModal(true)}
                      className="text-xs font-semibold bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] px-3.5 py-1.5 rounded-lg hover:border-[#9E784B] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      + Task
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredChecklist.length > 0 ? (
                    filteredChecklist.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklist(activeCelebration.id, item.id)}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${item.done
                            ? 'bg-stone-50 border-[#E6DED6] text-stone-400'
                            : item.dateInfo.status === 'OVERDUE' || item.dateInfo.status === 'DUE_TODAY' || item.dateInfo.status === 'URGENT'
                              ? 'bg-[#F9F5F2] border-2 border-[#9E784B]/60 text-[#1A1816]'
                              : 'bg-[#F9F5F2] border-[#E6DED6] text-[#1A1816] hover:border-[#9E784B]'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => { }}
                          className="mt-0.5 accent-[#9E784B] w-4 h-4 rounded-xs cursor-pointer"
                        />
                        <div className="space-y-1 text-xs w-full">
                          <div className={`font-medium ${item.done ? 'line-through' : ''}`}>
                            {item.title}
                          </div>

                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-[#1A1816]/50">Due: {item.dueDate}</span>
                            {!item.done && item.dateInfo.status !== 'NORMAL' && (
                              <span className="font-bold px-2 py-0.5 rounded-md text-[10px] bg-[#9E784B] text-white">
                                {item.dateInfo.text}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-[#1A1816]/50 py-4">
                      No tasks found for this filter.
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Add Budget Line Modal */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-md w-full p-6 space-y-4 font-sans">
            <h3 className="font-serif text-xl font-medium text-[#1A1816]">
              Add Budget Item to {activeCelebration.title}
            </h3>
            <form onSubmit={handleAddBudgetLine} className="space-y-3 text-xs">
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
                  className="bg-[#1A1816] text-white px-5 py-2 rounded-lg font-semibold cursor-pointer"
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
          <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-md w-full p-6 space-y-4 font-sans">
            <h3 className="font-serif text-xl font-medium text-[#1A1816]">
              Add Task to {activeCelebration.title}
            </h3>
            <form onSubmit={handleAddChecklistTask} className="space-y-3 text-xs">
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
                  className="bg-[#1A1816] text-white px-5 py-2 rounded-lg font-semibold cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Celebration & Guest Count Modal */}
      {showEditCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative font-sans">
            <button
              onClick={() => setShowEditCelebrationModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-[#1A1816] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="font-serif text-xl font-medium text-[#1A1816]">
              Edit Wedding Details & Guest Count
            </h3>

            <form onSubmit={handleSaveEditCelebration} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-semibold text-[#1A1816]/80">Celebration Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2 text-sm text-[#1A1816] mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1816]/80">Expected Guest Count</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editGuestCount}
                    onChange={(e) => setEditGuestCount(e.target.value)}
                    className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2 text-sm text-[#1A1816] font-bold text-[#9E784B] mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1816]/80">Target Date</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2 text-sm text-[#1A1816] mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1816]/80">Location / Area</label>
                  <input
                    type="text"
                    required
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    placeholder="e.g. Soweto / Sandton"
                    className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2 text-sm text-[#1A1816] mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1816]/80">Planned Budget (R)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2 text-sm text-[#1A1816] mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6DED6]">
                <button
                  type="button"
                  onClick={() => setShowEditCelebrationModal(false)}
                  className="px-4 py-2 rounded-lg text-stone-500 hover:text-[#1A1816] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1A1816] text-white px-6 py-2 rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
