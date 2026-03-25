import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, Shield, Search, Home, Droplets, Globe } from 'lucide-react';
import { useStore } from '../store/store';
import { t } from '../lib/i18n';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, logout, language, setLanguage } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = language;

  const handleLogout = async () => {
    await logout();
    toast.success(lang === 'bn' ? 'লগআউট সফল হয়েছে' : 'Logged out successfully');
    navigate('/');
    setOpen(false);
  };

  const toggleLang = () => setLanguage(lang === 'bn' ? 'en' : 'bn');

  const links = [
    { to: '/', label: t(lang, 'nav_home'), icon: Home },
    { to: '/search', label: t(lang, 'nav_find_donor'), icon: Search },
    { to: '/request', label: t(lang, 'nav_need_blood'), icon: Droplets },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo: always visible brand + subtext on ALL screen sizes */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-700 transition-colors shrink-0">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">
                {lang === 'bn' ? 'উরকিরচর ব্লাড ব্যাংক' : 'Urkirchar Blood Bank'}
              </div>
              <div className="text-xs text-gray-400 leading-tight">
                {lang === 'bn' ? 'পরিচালিত: উরকিরচর শান্তি সংঘ' : 'Powered by Urkirchar Shanti Shanga'}
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to) ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>

            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <Link to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin') ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}>
                    <Shield className="w-4 h-4" />
                    {t(lang, 'nav_admin')}
                  </Link>
                )}
                <Link to="/profile"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/profile') ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                  <User className="w-4 h-4" />
                  {currentUser.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  {t(lang, 'nav_login')}
                </Link>
                <Link to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                  {t(lang, 'nav_register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile: lang toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(to) ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
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
                    <Shield className="w-4 h-4 text-red-500" />
                    {t(lang, 'nav_admin')}
                  </Link>
                )}
                <Link to="/profile" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4" />
                  {t(lang, 'nav_profile')} — {currentUser.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left">
                  <LogOut className="w-4 h-4" />
                  {t(lang, 'nav_logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {t(lang, 'nav_login')}
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors">
                  <Heart className="w-4 h-4 fill-white" />
                  {t(lang, 'nav_register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
