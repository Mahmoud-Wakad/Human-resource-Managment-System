import { FormEvent, useState } from 'react';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (fullName: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function AuthScreen({ onLogin, onRegister, loading, error }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (mode === 'register') {
      await onRegister(fullName, email, password);
      return;
    }

    await onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-700">EcoTrack</h1>
          <p className="text-slate-500 mt-2">Smart Personal Expense & Budget Management</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-slate-700 mb-1">Full Name</label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-700 mb-1">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              minLength={8}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="mt-4 w-full text-sm text-emerald-700 hover:text-emerald-800"
        >
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
