import React, { useState } from 'react';

export default function BrideOnboardingModal({ isOpen, user, onComplete }) {
  const [step, setStep] = useState(1);
  const [brideName, setBrideName] = useState(user?.name || '');
  const [celebrationChoice, setCelebrationChoice] = useState('BOTH'); // TRADITIONAL, WHITE, BOTH
  
  // Dates & Areas
  const [tradDate, setTradDate] = useState('2026-11-14');
  const [tradArea, setTradArea] = useState('Soweto');
  const [whiteDate, setWhiteDate] = useState('2026-12-05');
  const [whiteArea, setWhiteArea] = useState('Sandton');

  // Budget
  const [totalBudget, setTotalBudget] = useState(600000);
  const [tradBudget, setTradBudget] = useState(220000);
  const [whiteBudget, setWhiteBudget] = useState(380000);

  if (!isOpen) return null;

  const handleTotalBudgetChange = (val) => {
    const num = Number(val) || 0;
    setTotalBudget(num);
    if (celebrationChoice === 'BOTH') {
      setTradBudget(Math.round(num * 0.37));
      setWhiteBudget(Math.round(num * 0.63));
    } else if (celebrationChoice === 'TRADITIONAL') {
      setTradBudget(num);
      setWhiteBudget(0);
    } else {
      setTradBudget(0);
      setWhiteBudget(num);
    }
  };

  const handleFinish = () => {
    const celebrations = [];
    if (celebrationChoice === 'TRADITIONAL' || celebrationChoice === 'BOTH') {
      celebrations.push({
        id: 'c_trad_' + Date.now(),
        type: 'TRADITIONAL',
        title: 'Traditional Day',
        date: tradDate,
        area: tradArea,
        guestCount: 180,
        budget: tradBudget,
        checklist: [
          { id: 't_cb1', title: 'Confirm traditional lobola agreement details with family elders', dueDate: '2026-09-01', done: false },
          { id: 't_cb2', title: 'Book traditional catering team for spit braai and traditional sides', dueDate: '2026-09-15', done: false },
          { id: 't_cb3', title: 'Finalise traditional attire fitting and beadwork styling', dueDate: '2026-10-01', done: false }
        ],
        budgetLines: [
          { id: 't_bl1', category: 'Attire & Beadwork', planned: Math.round(tradBudget * 0.20), actuallySpent: 0, linkedVendor: '' },
          { id: 't_bl2', category: 'Catering & Beverages', planned: Math.round(tradBudget * 0.40), actuallySpent: 0, linkedVendor: '' },
          { id: 't_bl3', category: 'Tents & Sound System', planned: Math.round(tradBudget * 0.25), actuallySpent: 0, linkedVendor: '' },
          { id: 't_bl4', category: 'Photography & Film', planned: Math.round(tradBudget * 0.15), actuallySpent: 0, linkedVendor: '' }
        ]
      });
    }

    if (celebrationChoice === 'WHITE' || celebrationChoice === 'BOTH') {
      celebrations.push({
        id: 'c_white_' + Date.now(),
        type: 'WHITE',
        title: 'White Wedding',
        date: whiteDate,
        area: whiteArea,
        guestCount: 120,
        budget: whiteBudget,
        checklist: [
          { id: 'w_cb1', title: 'Secure reception venue deposit & sign date contract', dueDate: '2026-08-30', done: false },
          { id: 'w_cb2', title: 'Book professional wedding photographer & videographer', dueDate: '2026-09-10', done: false },
          { id: 'w_cb3', title: 'Schedule wedding gown consultation and fittings', dueDate: '2026-09-25', done: false }
        ],
        budgetLines: [
          { id: 'w_bl1', category: 'Venue & Banqueting', planned: Math.round(whiteBudget * 0.45), actuallySpent: 0, linkedVendor: '' },
          { id: 'w_bl2', category: 'Bridal Gown & Suits', planned: Math.round(whiteBudget * 0.18), actuallySpent: 0, linkedVendor: '' },
          { id: 'w_bl3', category: 'Photography & Videography', planned: Math.round(whiteBudget * 0.15), actuallySpent: 0, linkedVendor: '' },
          { id: 'w_bl4', category: 'Floral Styling & Lighting', planned: Math.round(whiteBudget * 0.12), actuallySpent: 0, linkedVendor: '' },
          { id: 'w_bl5', category: 'DJ & Entertainment', planned: Math.round(whiteBudget * 0.10), actuallySpent: 0, linkedVendor: '' }
        ]
      });
    }

    const createdBride = {
      id: 'b_' + Date.now(),
      name: brideName,
      email: user?.email || 'bride@example.com',
      role: 'BRIDE',
      overallBudget: totalBudget,
      celebrations
    };

    onComplete(createdBride);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl relative">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-[#1A1816]/70 uppercase tracking-widest">
            <span>Step {step} of 5</span>
            <span className="text-[#9E784B]">Onboarding</span>
          </div>
          <div className="h-1.5 w-full bg-[#F9F5F2] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#9E784B] transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Bride Name */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-[#1A1816]">
                Welcome to CelebrateIT! What is your name?
              </h3>
              <p className="font-sans text-xs text-[#1A1816]/70 leading-relaxed">
                We design your planning workspace around your name and your unique celebrations.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1816]/80">Your Name</label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-4 py-3 text-sm text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Celebration Selection */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-[#1A1816]">
                Which celebrations are you planning?
              </h3>
              <p className="font-sans text-xs text-[#1A1816]/70 leading-relaxed">
                CelebrateIT is built specifically to support two distinct celebrations without date or budget confusion.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setCelebrationChoice('BOTH')}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                  celebrationChoice === 'BOTH'
                    ? 'border-[#9E784B] bg-[#9E784B]/10 text-[#1A1816]'
                    : 'border-[#E6DED6] bg-white text-[#1A1816]/70 hover:border-stone-400'
                }`}
              >
                <div className="font-serif font-semibold text-sm text-[#9E784B]">Both Weddings</div>
                <div className="text-xs leading-normal">Traditional Day + White Wedding (Most Popular)</div>
              </button>

              <button
                type="button"
                onClick={() => setCelebrationChoice('TRADITIONAL')}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                  celebrationChoice === 'TRADITIONAL'
                    ? 'border-[#9E784B] bg-[#9E784B]/10 text-[#1A1816]'
                    : 'border-[#E6DED6] bg-white text-[#1A1816]/70 hover:border-stone-400'
                }`}
              >
                <div className="font-serif font-semibold text-sm text-[#1A1816]">Traditional Day</div>
                <div className="text-xs leading-normal">Umphando, Lobola, or Traditional ceremony only</div>
              </button>

              <button
                type="button"
                onClick={() => setCelebrationChoice('WHITE')}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                  celebrationChoice === 'WHITE'
                    ? 'border-[#9E784B] bg-[#9E784B]/10 text-[#1A1816]'
                    : 'border-[#E6DED6] bg-white text-[#1A1816]/70 hover:border-stone-400'
                }`}
              >
                <div className="font-serif font-semibold text-sm text-[#1A1816]">White Wedding</div>
                <div className="text-xs leading-normal">Church & venue reception celebration only</div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Dates & Areas */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-[#1A1816]">
                Dates and Locations in Gauteng
              </h3>
              <p className="font-sans text-xs text-[#1A1816]/70 leading-relaxed">
                Set target dates and areas so we can match you with local vendors who specialize in your region.
              </p>
            </div>

            {(celebrationChoice === 'TRADITIONAL' || celebrationChoice === 'BOTH') && (
              <div className="p-4 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl space-y-3">
                <div className="font-serif text-sm font-semibold text-[#9E784B]">Traditional Celebration</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1816]/80">Date</label>
                    <input
                      type="date"
                      value={tradDate}
                      onChange={(e) => setTradDate(e.target.value)}
                      className="w-full bg-white border border-[#E6DED6] rounded-lg px-3 py-2 text-xs text-[#1A1816]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1A1816]/80">Area</label>
                    <select
                      value={tradArea}
                      onChange={(e) => setTradArea(e.target.value)}
                      className="w-full bg-white border border-[#E6DED6] rounded-lg px-3 py-2 text-xs text-[#1A1816]"
                    >
                      <option value="Soweto">Soweto</option>
                      <option value="Johannesburg">Johannesburg</option>
                      <option value="Sandton">Sandton</option>
                      <option value="Pretoria">Pretoria</option>
                      <option value="Midrand">Midrand</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {(celebrationChoice === 'WHITE' || celebrationChoice === 'BOTH') && (
              <div className="p-4 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl space-y-3">
                <div className="font-serif text-sm font-semibold text-[#1A1816]">White Wedding</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1816]/80">Date</label>
                    <input
                      type="date"
                      value={whiteDate}
                      onChange={(e) => setWhiteDate(e.target.value)}
                      className="w-full bg-white border border-[#E6DED6] rounded-lg px-3 py-2 text-xs text-[#1A1816]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1A1816]/80">Area</label>
                    <select
                      value={whiteArea}
                      onChange={(e) => setWhiteArea(e.target.value)}
                      className="w-full bg-white border border-[#E6DED6] rounded-lg px-3 py-2 text-xs text-[#1A1816]"
                    >
                      <option value="Sandton">Sandton</option>
                      <option value="Johannesburg">Johannesburg</option>
                      <option value="Pretoria">Pretoria</option>
                      <option value="Midrand">Midrand</option>
                      <option value="Soweto">Soweto</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Budget Allocation */}
        {step === 4 && (
          <div className="space-y-5 font-sans">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-[#1A1816]">
                Overall Budget Allocation
              </h3>
              <p className="font-sans text-xs text-[#1A1816]/70 leading-relaxed">
                Enter your total wedding budget in Rands. Muse will suggest an optimal split across your events.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1816]/80">Total Budget (Rands)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-sm text-[#1A1816]">R</span>
                <input
                  type="number"
                  step="5000"
                  value={totalBudget}
                  onChange={(e) => handleTotalBudgetChange(e.target.value)}
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg pl-8 pr-4 py-2.5 text-sm font-semibold text-[#1A1816]"
                />
              </div>
            </div>

            {celebrationChoice === 'BOTH' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl space-y-1">
                  <div className="text-xs font-semibold text-[#9E784B]">Traditional Allocation</div>
                  <div className="text-base font-bold text-[#1A1816]">
                    R {tradBudget.toLocaleString('en-ZA')}
                  </div>
                </div>
                <div className="p-3 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl space-y-1">
                  <div className="text-xs font-semibold text-[#1A1816]">White Wedding Allocation</div>
                  <div className="text-base font-bold text-[#1A1816]">
                    R {whiteBudget.toLocaleString('en-ZA')}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Summary & Create */}
        {step === 5 && (
          <div className="space-y-5 font-sans">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-[#1A1816]">
                Ready to create your workspace!
              </h3>
              <p className="font-sans text-xs text-[#1A1816]/70 leading-relaxed">
                Here is a summary of what Muse will generate for your dashboard:
              </p>
            </div>

            <div className="bg-[#F9F5F2] p-4 rounded-xl border border-[#E6DED6] space-y-3 text-xs text-[#1A1816]">
              <div className="flex justify-between border-b border-[#E6DED6] pb-2">
                <span className="font-semibold">Bride Name:</span>
                <span>{brideName}</span>
              </div>
              <div className="flex justify-between border-b border-[#E6DED6] pb-2">
                <span className="font-semibold">Celebration Setup:</span>
                <span>{celebrationChoice === 'BOTH' ? '2 Celebrations (Traditional & White)' : celebrationChoice + ' Wedding'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Planned Budget:</span>
                <span className="font-bold text-[#9E784B]">R {totalBudget.toLocaleString('en-ZA')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E6DED6]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="text-xs font-semibold text-[#1A1816]/70 hover:text-[#1A1816] px-3 py-2 cursor-pointer"
            >
              ← Back
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-[#1A1816] text-white px-6 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#2A2623] transition-colors cursor-pointer"
            >
              Next step →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="bg-[#9E784B] text-white px-6 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#8A673E] transition-colors cursor-pointer shadow-xs"
            >
              Open My Dashboard ✨
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
