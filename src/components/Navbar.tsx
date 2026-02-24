import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Droplets, Globe, User, LogOut, Shield } from 'lucide-react';
import { useStore } from '../store/store';
import { useTranslation } from '../hooks/useTranslation';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language } = useTranslation();
  const { currentUser, logout, setLanguage } = useStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/search', label: t.nav.findDonor },
    { path: '/register', label: t.nav.register },
  ];

  const toggleLang = () => setLanguage(language === 'en' ? 'bn' : 'en');

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blood-500 to-blood-700 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-200 transition-all duration-300">
              <Droplets className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <div className="leading-tight">
                <span className="text-lg font-bold text-gray-900">
                  {language === 'bn' ? 'উরকিরচর' : 'Urkirchar'}
                </span>
                <span className="text-lg font-bold text-blood-600 ml-1">
                  {language === 'bn' ? 'ব্লাড ব্যাংক' : 'Blood Bank'}
                </span>
              </div>
              <p className="text-[9px] leading-tight text-gray-400 font-medium -mt-0.5">
                {language === 'bn' ? 'পরিচালনায়: উরকিরচর শান্তি সংঘ' : 'Powered by Urkirchar Shanti Sangha'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-blood-600 bg-blood-50'
                    : 'text-gray-600 hover:text-blood-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {currentUser && (
              <>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive('/profile')
                      ? 'text-blood-600 bg-blood-50'
                      : 'text-gray-600 hover:text-blood-600 hover:bg-gray-50'
                  }`}
                >
                  {t.nav.profile}
                </Link>
                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      isActive('/admin')
                        ? 'text-blood-600 bg-blood-50'
                        : 'text-gray-600 hover:text-blood-600 hover:bg-gray-50'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    {t.nav.admin}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold">{language === 'en' ? 'বাং' : 'EN'}</span>
            </button>

            {/* Auth buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-blood-100 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-blood-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{currentUser.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-blood-600 hover:bg-blood-50 transition-all"
                    title={t.nav.logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-gradient-to-r from-blood-600 to-blood-500 text-white text-sm font-semibold rounded-xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-md shadow-red-200/50 hover:shadow-lg"
                >
                  {t.nav.login}
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-blood-600 bg-blood-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {currentUser && (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                  {t.nav.profile}
                </Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                    {t.nav.admin}
                  </Link>
                )}
              </>
            )}
            <div className="pt-3 border-t border-gray-100">
              {currentUser ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium text-blood-600 hover:bg-blood-50 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.logout}
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-center bg-gradient-to-r from-blood-600 to-blood-500 text-white"
                >
                  {t.nav.login}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
