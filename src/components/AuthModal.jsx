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
            emailRedirectTo: `${window.location.origin}`,
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

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const redirectTo = mode === 'signup'
        ? `${window.location.origin}?role=${role}`
        : window.location.origin;

      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (oauthErr) throw oauthErr;
    } catch (err) {
      setError(err.message || 'An error occurred during OAuth login.');
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

        {/* OAuth Buttons */}
        <div className="space-y-3 font-sans">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#E6DED6] text-[#1A1816] py-3 rounded-lg font-semibold hover:bg-stone-50 transition-all cursor-pointer text-sm shadow-xs"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center justify-center gap-2.5 py-1">
            <span className="h-px bg-[#E6DED6]/60 flex-1"></span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1816]/40">Or use email</span>
            <span className="h-px bg-[#E6DED6]/60 flex-1"></span>
          </div>
        </div>

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
