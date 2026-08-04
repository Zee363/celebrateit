import { useState } from 'react';

export default function MuseChatModal({
  isOpen,
  onClose,
  bride,
  vendors,
  onLogSearchMiss,
  onOpenVendorProfile
}) {
  const [messages, setMessages] = useState([
    {
      id: 'm_init',
      role: 'muse',
      content: `Hello ${bride?.name || 'there'}! I'm Muse, your personal wedding planning assistant. I already know about your ${bride?.celebrations?.length || 1} celebration setup. How can I help you balance budgets, dates, or find local vendors today?`
    }
  ]);

  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newMsgs = [...messages, { id: 'msg_' + Date.now(), role: 'user', content: userText }];
    setMessages(newMsgs);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/muse-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userText, bride, vendors, history: newMsgs })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Muse API Error:', error);
        throw new Error(error.error || 'Muse API request failed');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_res_' + Date.now(),
          role: 'muse',
          content: data.text || 'Muse could not generate a reply.'
        }
      ]);
    } catch (error) {
      console.error('Muse API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_res_' + Date.now(),
          role: 'muse',
          content:
            'I could not reach the Muse backend. Please make sure the server is running at the configured API URL.'
        }
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-2xl w-full h-[650px] flex flex-col shadow-2xl relative overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6DED6] bg-[#F9F5F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E6DED6] flex items-center justify-center font-serif font-bold text-[#9E784B] relative shadow-xs">
              M
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#9E784B] rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#1A1816]">Muse Assistant</h3>
              <p className="text-xs text-[#1A1816]/60">South African Wedding Planning Expert</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#1A1816] text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Message Trajectory */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'items-start gap-3'}`}
            >
              {m.role === 'muse' && (
                <div className="w-8 h-8 rounded-full bg-[#F9F5F2] border border-[#E6DED6] flex items-center justify-center font-serif text-xs font-bold text-[#9E784B] shrink-0 mt-1">
                  M
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-lg leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-[#1A1816] text-white rounded-tr-xs ml-auto'
                    : 'bg-[#F9F5F2] border border-[#E6DED6] text-[#1A1816] rounded-tl-xs'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-4 border-t border-[#E6DED6] bg-white flex gap-2">
          <input
            type="text"
            required
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Muse about budget split, caterers, or dates..."
            className="flex-1 bg-[#F9F5F2] border border-[#E6DED6] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
          />
          <button
            type="submit"
            className="bg-[#9E784B] text-white px-5 py-3 rounded-xl font-semibold text-xs hover:bg-[#8A673E] transition-colors cursor-pointer"
          >
            Ask Muse
          </button>
        </form>

      </div>
    </div>
  );
}
