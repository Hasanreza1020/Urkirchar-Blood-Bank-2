import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, Shield, Search, Home, Globe, Droplets } from 'lucide-react';
import { useStore } from '../store/supabaseStore';
import { useTranslation } from '../hooks/useTranslation';
import toast from 'react-hot-toast';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const currentUser = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);
  const language = useStore(state => state.language);
  const setLanguage = useStore(state => state.setLanguage);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success(language === 'bn' ? 'লগআউট সফল হয়েছে' : 'Logged out successfully');
    navigate('/');
    setOpen(false);
  };

  const toggleLang = () => setLanguage(language === 'bn' ? 'en' : 'bn');

  const links = [
    { to: '/', label: t.nav.home, icon: Home },
    { to: '/search', label: t.nav.findDonor, icon: Search },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 bg-gradient-to-br from-blood-500 to-blood-700 rounded-xl flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 text-sm leading-tight truncate">
                {language === 'bn' ? 'উরকিরচর ব্লাড ব্যাংক' : 'Urkirchar Blood Bank'}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 leading-tight truncate">
                {language === 'bn' ? 'পরিচালিত: উরকিরচর শান্তি সংঘ' : 'Powered by Urkirchar Shanti Shanga'}
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to) ? 'bg-red-50 text-blood-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>

            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <Link to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin') ? 'bg-red-50 text-blood-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}>
                    <Shield className="w-4 h-4" />
                    {t.nav.admin}
                  </Link>
                )}
                <Link to="/profile"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/profile') ? 'bg-red-50 text-blood-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                  <User className="w-4 h-4" />
                  {currentUser.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blood-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  {t.nav.login}
                </Link>
                <Link to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-blood-600 text-white rounded-lg hover:bg-blood-700 transition-colors shadow-sm">
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(to) ? 'bg-red-50 text-blood-600' : 'text-gray-700 hover:bg-gray-50'
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Shield className="w-4 h-4 text-blood-500" />
                    {t.nav.admin}
                  </Link>
                )}
                <Link to="/profile" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4" />
                  {t.nav.profile} — {currentUser.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blood-600 hover:bg-red-50 w-full text-left">
                  <LogOut className="w-4 h-4" />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {t.nav.login}
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold bg-blood-600 text-white hover:bg-blood-700 transition-colors">
                  <Heart className="w-4 h-4 fill-white" />
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
