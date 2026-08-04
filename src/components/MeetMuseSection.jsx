import React, { useState } from 'react';
import { MiniMuseMark, FeatureBudgetIcon, FeatureChecklistIcon, FeatureClashIcon, FeatureDirectoryIcon } from './CustomIcons';

export default function MeetMuseSection({ onOpenMuse }) {
  const [customMessages, setCustomMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');

    const newMsgs = [...customMessages, { role: 'user', content: userMsg }];
    setCustomMessages(newMsgs);

    setTimeout(() => {
      let botReply = "I can certainly help you with that! Whether it's balancing your traditional lobola & attire costs with your white wedding venue, or finding top-rated caterers in Sandton and Soweto.";
      if (userMsg.toLowerCase().includes('cater') || userMsg.toLowerCase().includes('food')) {
        botReply = "For traditional catering in Soweto or Pretoria, Ubuntu Culinary Art provides authentic spit braais from R25 000. For your white wedding in Sandton, venue banquets start around R45 000.";
      } else if (userMsg.toLowerCase().includes('date') || userMsg.toLowerCase().includes('when')) {
        botReply = "I recommend spacing your traditional day and white wedding by at least 3 to 4 weeks. This gives family members time to travel and budget breathing room between ceremonies.";
      }
      setCustomMessages((prev) => [...prev, { role: 'muse', content: botReply }]);
    }, 600);
  };

  return (
    <section className="py-16 lg:py-24 border-t border-[#E6DED6]/50 bg-[#F9F5F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column — Descriptions & 2x2 Feature Grid */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Meet Muse Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E6DED6] bg-white text-[#1A1816]">
              <MiniMuseMark className="w-5 h-5" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#1A1816]/70">
                MEET MUSE
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1816] tracking-tight leading-tight">
                Meet Muse — your personal wedding planning assistant.
              </h2>
              <p className="font-sans text-base text-[#1A1816]/80 leading-relaxed">
                Muse knows both of your weddings. She walks you through every step — splitting your budget across both celebrations, telling you exactly what to book next, finding vendors who suit your style, budget and area, and gently reaching out to them for you. No hurry. No noise. Just a warm hand on your shoulder.
              </p>
            </div>

            {/* 2x2 Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-xl border border-[#E6DED6] space-y-2.5 transition-all hover:border-[#9E784B]/40">
                <div className="w-8 h-8 rounded-lg bg-[#F9F5F2] border border-[#E6DED6] flex items-center justify-center text-[#9E784B]">
                  <FeatureBudgetIcon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1A1816]">
                  Splits your budget beautifully
                </h3>
                <p className="font-sans text-xs text-[#1A1816]/70 leading-relaxed">
                  She looks at both weddings together and helps you plan every Rand — no spreadsheets, no dread.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-xl border border-[#E6DED6] space-y-2.5 transition-all hover:border-[#9E784B]/40">
                <div className="w-8 h-8 rounded-lg bg-[#F9F5F2] border border-[#E6DED6] flex items-center justify-center text-[#9E784B]">
                  <FeatureChecklistIcon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1A1816]">
                  Tells you what to do next
                </h3>
                <p className="font-sans text-xs text-[#1A1816]/70 leading-relaxed">
                  No more staring at endless checklists. Muse gently surfaces what actually matters this week.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-xl border border-[#E6DED6] space-y-2.5 transition-all hover:border-[#9E784B]/40">
                <div className="w-8 h-8 rounded-lg bg-[#F9F5F2] border border-[#E6DED6] flex items-center justify-center text-[#9E784B]">
                  <FeatureDirectoryIcon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1A1816]">
                  Finds vendors who fit you
                </h3>
                <p className="font-sans text-xs text-[#1A1816]/70 leading-relaxed">
                  Style, budget, area, both celebrations — she recommends real people you can message with one tap.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-xl border border-[#E6DED6] space-y-2.5 transition-all hover:border-[#9E784B]/40">
                <div className="w-8 h-8 rounded-lg bg-[#F9F5F2] border border-[#E6DED6] flex items-center justify-center text-[#9E784B]">
                  <FeatureClashIcon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1A1816]">
                  Keeps your two dates from clashing
                </h3>
                <p className="font-sans text-xs text-[#1A1816]/70 leading-relaxed">
                  She watches both timelines and warns you kindly if things are landing too close together.
                </p>
              </div>

            </div>

            {/* Action CTA below cards */}
            <div className="pt-2 space-y-3">
              <button
                onClick={onOpenMuse}
                className="font-sans text-sm font-semibold bg-[#1A1816] text-white px-7 py-3 rounded-full hover:bg-[#2A2623] transition-all shadow-xs cursor-pointer active:scale-95 inline-flex items-center gap-2"
              >
                Plan with Muse —
              </button>
              <p className="font-sans text-xs text-[#1A1816]/60">
                Free to start. Nothing to install. Two celebrations, one calm plan.
              </p>
            </div>

          </div>

          {/* Right Column — Live Interactive Chat Preview */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-[#E6DED6] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
              
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#E6DED6]/70">
                <MiniMuseMark className="w-10 h-10" />
                <div>
                  <h4 className="font-serif text-base font-medium text-[#1A1816]">Muse</h4>
                  <p className="font-sans text-xs text-[#1A1816]/60">Your wedding planning assistant</p>
                </div>
              </div>

              {/* Chat Body */}
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 text-sm font-sans">
                
                {/* Bubble 1: User */}
                <div className="flex justify-end">
                  <div className="bg-[#1A1816] text-white p-3.5 rounded-2xl rounded-tr-xs max-w-md text-xs sm:text-sm leading-relaxed">
                    How should I split my R600 000 budget between the traditional and the white wedding?
                  </div>
                </div>

                {/* Bubble 1: Muse */}
                <div className="flex items-start gap-2.5">
                  <MiniMuseMark className="w-7 h-7 mt-0.5" />
                  <div className="bg-[#F9F5F2] text-[#1A1816] p-3.5 rounded-2xl rounded-tl-xs max-w-md text-xs sm:text-sm leading-relaxed space-y-2">
                    <p>
                      Such a good thing to look at together. If your traditional day is at home with about 180 guests and your white wedding is a venue reception for 120, I'd start around:
                    </p>
                    <ul className="space-y-1 font-medium text-[#1A1816]">
                      <li>• Traditional celebration — R220 000</li>
                      <li>• White wedding — R380 000</li>
                    </ul>
                    <p>
                      Want me to sketch what to book first for each?
                    </p>
                  </div>
                </div>

                {/* Bubble 2: User */}
                <div className="flex justify-end">
                  <div className="bg-[#1A1816] text-white p-3.5 rounded-2xl rounded-tr-xs max-w-md text-xs sm:text-sm leading-relaxed">
                    Yes please — what should I book next?
                  </div>
                </div>

                {/* Bubble 2: Muse */}
                <div className="flex items-start gap-2.5">
                  <MiniMuseMark className="w-7 h-7 mt-0.5" />
                  <div className="bg-[#F9F5F2] text-[#1A1816] p-3.5 rounded-2xl rounded-tl-xs max-w-md text-xs sm:text-sm leading-relaxed">
                    For the white wedding: venue and photographer this month. For the traditional day: attire and catering. I've spotted three photographers in Sandton in your budget — shall I show them?
                  </div>
                </div>

                {/* Dynamic user added messages */}
                {customMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start gap-2.5'}`}>
                    {msg.role === 'muse' && (
                      <MiniMuseMark className="w-7 h-7 mt-0.5" />
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-md ${
                        msg.role === 'user'
                          ? 'bg-[#1A1816] text-white rounded-tr-xs'
                          : 'bg-[#F9F5F2] text-[#1A1816] rounded-tl-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

              </div>

              {/* Interactive Chat Input */}
              <form onSubmit={handleSendCustom} className="pt-2">
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Whatever's on your mind..."
                    className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1A1816] placeholder-[#1A1816]/50 focus:outline-none focus:border-[#9E784B] transition-colors pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E784B] hover:text-[#1A1816] transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
