import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, mode, onAuthSuccess }) {
  const [role, setRole] = useState('BRIDE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    onAuthSuccess({
      id: 'u_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: role
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-[#1A1816] text-xl font-bold"
        >
          &times;
        </button>

        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-medium text-[#1A1816]">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h3>
          <p className="font-sans text-xs text-[#1A1816]/70">
            {mode === 'signup'
              ? 'Join CelebrateIT to plan your traditional day & white wedding seamlessly.'
              : 'Log in to access your wedding workspace or vendor dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
          {/* Role selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1A1816]/70">
              I am joining as a
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('BRIDE')}
                className={`py-2.5 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                  role === 'BRIDE'
                    ? 'border-[#9E784B] bg-[#9E784B]/10 text-[#9E784B]'
                    : 'border-[#E6DED6] bg-white text-[#1A1816]/70 hover:border-stone-400'
                }`}
              >
                Bride / Couple
              </button>
              <button
                type="button"
                onClick={() => setRole('VENDOR')}
                className={`py-2.5 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                  role === 'VENDOR'
                    ? 'border-[#9E784B] bg-[#9E784B]/10 text-[#9E784B]'
                    : 'border-[#E6DED6] bg-white text-[#1A1816]/70 hover:border-stone-400'
                }`}
              >
                Wedding Vendor
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nomsa Khumalo"
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2.5 text-sm text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. nomsa@example.com"
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2.5 text-sm text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A1816] text-white py-3 rounded-lg font-semibold hover:bg-[#2A2623] transition-colors mt-2 cursor-pointer"
          >
            {mode === 'signup' ? 'Continue to Setup' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
