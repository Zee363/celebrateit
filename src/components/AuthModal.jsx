import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthModal({ isOpen, onClose, mode, onAuthSuccess }) {
  const [role, setRole] = useState('BRIDE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!email.trim() || !name.trim() || !password.trim()) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }

        const { data, error: signupErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              name: name.trim(),
              role: role,
            },
          },
        });

        if (signupErr) throw signupErr;

        const user = data.user;
        if (user) {
          onAuthSuccess({
            id: user.id,
            name: name.trim(),
            email: email.trim(),
            role: role,
          });
          onClose();
        }
      } else {
        if (!email.trim() || !password.trim()) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }

        const { data, error: loginErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (loginErr) throw loginErr;

        const user = data.user;
        if (user) {
          // Fetch the profile for name and role
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', user.id)
            .single();

          const userRole = profile?.role || user.user_metadata?.role || 'BRIDE';
          const userName = profile?.name || user.user_metadata?.name || user.email;

          onAuthSuccess({
            id: user.id,
            name: userName,
            email: user.email,
            role: userRole,
          });
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
          {/* Role selector */}
          {mode === 'signup' && (
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
          )}

          {mode === 'signup' && (
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
          )}

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

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1816]/80">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3.5 py-2.5 text-sm text-[#1A1816] focus:outline-none focus:border-[#9E784B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1816] text-white py-3 rounded-lg font-semibold hover:bg-[#2A2623] transition-colors mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : mode === 'signup' ? 'Continue to Setup' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
