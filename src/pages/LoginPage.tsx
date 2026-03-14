import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Droplets } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useStore } from '../store/supabaseStore';
import toast from 'react-hot-toast';

export function LoginPage() {
  const { t } = useTranslation();
  const { login, currentUser, loadDonors } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-sm border border-gray-100">
          <Droplets className="w-12 h-12 text-blood-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Already logged in!</h2>
          <p className="text-gray-500 mb-6">You are already logged in as {currentUser.name}.</p>
          <Link to="/profile" className="px-6 py-3 bg-blood-600 text-white rounded-xl font-medium hover:bg-blood-700 transition-colors inline-block">Go to Profile</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        await loadDonors();
        toast.success(t.login.success);
        navigate('/profile');
      } else {
        setError(t.login.error);
        toast.error(t.login.error);
      }
    } catch (err) {
      setError(t.login.error);
      toast.error(t.login.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blood-500 to-blood-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200/50">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">{t.login.title}</h1>
          <p className="text-gray-500 mt-2">{t.login.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.login.email}</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder={t.login.emailPlaceholder} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blood-500 focus:border-blood-500 bg-white text-gray-900 placeholder-gray-400" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.login.password}</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder={t.login.passwordPlaceholder} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blood-500 focus:border-blood-500 bg-white text-gray-900 placeholder-gray-400" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blood-600 to-blood-500 text-white font-bold rounded-xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-lg shadow-red-200/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
            <LogIn className="w-5 h-5" />
            {loading ? 'Logging in...' : t.login.submit}
          </button>

          <p className="text-center text-sm text-gray-500 pt-2">
            {t.login.noAccount}{' '}
            <Link to="/register" className="text-blood-600 font-semibold hover:underline">{t.login.registerHere}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
