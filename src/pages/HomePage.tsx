import { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Users, Heart, Droplets, ArrowRight, ListFilter as Filter, ChevronLeft, ChevronRight, X, AlertCircle, MapPin, HeartHandshake, Star } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useStore, LOCATIONS } from '../store/supabaseStore';
import { DonorCard } from '../components/DonorCard';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const PER_PAGE = 9;

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, started]);

  return <span ref={ref}>{count}+</span>;
}

function BloodDropIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" fill="currentColor" className={className}>
      <path d="M12 0C12 0 0 14 0 21C0 27.075 5.373 32 12 32C18.627 32 24 27.075 24 21C24 14 12 0 12 0Z" />
    </svg>
  );
}

export function HomePage() {
  const { t, language } = useTranslation();
  const donors = useStore(state => state.donors);

  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(1);

  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.available).length;
  const bloodGroups = [...new Set(donors.map(d => d.bloodGroup))].length;

  const filtered = useMemo(() => {
    return donors.filter(d => {
      if (bloodGroup && d.bloodGroup !== bloodGroup) return false;
      if (location && d.location !== location) return false;
      if (availableOnly && !d.available) return false;
      return true;
    });
  }, [donors, bloodGroup, location, availableOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleReset = () => {
    setBloodGroup('');
    setLocation('');
    setAvailableOnly(false);
    setPage(1);
  };

  const scrollToDonors = () => {
    document.getElementById('find-donors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/60 via-white to-white">
        <div className="absolute top-20 left-10 w-80 h-80 bg-red-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-pink-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '2s' }} />

        <div className="absolute top-32 right-[15%] opacity-10 animate-float" style={{ animationDelay: '0s' }}>
          <BloodDropIcon className="w-8 h-8 text-blood-600" />
        </div>
        <div className="absolute top-48 left-[10%] opacity-10 animate-float" style={{ animationDelay: '1s' }}>
          <BloodDropIcon className="w-6 h-6 text-blood-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 sm:pt-20 sm:pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blood-600 rounded-full text-sm font-medium mb-8 border border-red-100 shadow-sm animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-blood-500 animate-pulse" />
              <span>{language === 'bn' ? 'উরকিরচর ব্লাড ব্যাংক — একসাথে জীবন বাঁচাই' : 'Urkirchar Blood Bank — Saving Lives Together'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight animate-slide-up">
              {t.hero.headline.split(' ').slice(0, -2).map((word, i) => (
                <span key={i}>{word} </span>
              ))}
              <span className="relative inline-block">
                <span className="gradient-text">{t.hero.headline.split(' ').slice(-2).join(' ')}</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C40 2 80 2 100 6C120 10 160 10 198 4" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
                </svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {t.hero.subtext}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={scrollToDonors}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blood-600 to-blood-500 text-white font-semibold rounded-2xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-xl shadow-red-200/50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                {t.hero.findDonor}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-blood-600 font-semibold rounded-2xl border-2 border-red-100 hover:border-red-300 hover:bg-red-50 transition-all hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5" />
                {t.hero.becomeDonor}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: t.stats.totalDonors, value: totalDonors, icon: Users, iconColor: '#dc2626', bg: 'bg-red-50' },
              { label: t.stats.availableDonors, value: availableDonors, icon: Heart, iconColor: '#22c55e', bg: 'bg-green-50' },
              { label: t.stats.bloodGroups, value: bloodGroups, icon: Droplets, iconColor: '#a855f7', bg: 'bg-purple-50' },
              { label: t.stats.livesSaved, value: 150, icon: HeartHandshake, iconColor: '#f59e0b', bg: 'bg-amber-50' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 sm:p-6 text-center border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.iconColor }} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-gray-900">
                  <AnimatedCounter end={stat.value} />
                </div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-4 bg-blood-600 overflow-hidden">
        <div className="flex animate-marquee">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-8 px-4 whitespace-nowrap">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group, i) => (
                <span key={`${setIdx}-${i}`} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <BloodDropIcon className="w-3 h-3 text-white/50" />
                  {group}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Urgent Request Banner */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blood-600 to-rose-600 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg shadow-red-200/50">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0 animate-pulse">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-white">
                <div className="font-bold text-base sm:text-lg leading-tight">
                  {language === 'bn' ? 'জরুরি রক্তের প্রয়োজন?' : 'Need blood urgently?'}
                </div>
                <div className="text-sm text-red-100/90">
                  {language === 'bn'
                    ? 'নিচে থেকে সরাসরি প্রস্তুত রক্তদাতাদের সাথে যোগাযোগ করুন।'
                    : 'Filter available donors below and reach out directly within minutes.'}
                </div>
              </div>
            </div>
            <button
              onClick={() => { setAvailableOnly(true); scrollToDonors(); }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blood-600 font-semibold rounded-xl hover:bg-red-50 transition-colors shadow"
            >
              {language === 'bn' ? 'প্রস্তুত রক্তদাতা দেখুন' : 'Show Available Donors'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Find Donors — full search inlined on home */}
      <section id="find-donors" className="py-14 sm:py-20 bg-red-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-blood-600 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Star className="w-3 h-3" /> {language === 'bn' ? 'রক্তদাতা খুঁজুন' : 'Find a Donor'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              {t.search.title}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {t.search.subtitle}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Filter className="w-5 h-5 text-blood-600" />
              <span className="font-semibold text-gray-900">{t.search.search}</span>
              <span className="ml-auto text-sm text-gray-500">
                {filtered.length} {t.search.results}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.search.bloodGroup}</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus-within:border-blood-500 focus-within:ring-2 focus-within:ring-blood-500/20">
                  <Droplets className="w-4 h-4 text-blood-500 shrink-0" />
                  <select
                    value={bloodGroup}
                    onChange={e => { setBloodGroup(e.target.value); setPage(1); }}
                    className="w-full bg-transparent text-sm text-gray-900 focus:outline-none"
                  >
                    <option value="">{t.search.allGroups}</option>
                    {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.search.location}</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus-within:border-blood-500 focus-within:ring-2 focus-within:ring-blood-500/20">
                  <MapPin className="w-4 h-4 text-blood-500 shrink-0" />
                  <select
                    value={location}
                    onChange={e => { setLocation(e.target.value); setPage(1); }}
                    className="w-full bg-transparent text-sm text-gray-900 focus:outline-none"
                  >
                    <option value="">{t.search.allLocations}</option>
                    {LOCATIONS.map(loc => (
                      <option key={loc.en} value={loc.en}>
                        {language === 'bn' ? loc.bn : loc.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer px-1 py-2.5">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={availableOnly}
                      onChange={e => { setAvailableOnly(e.target.checked); setPage(1); }}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${availableOnly ? 'bg-blood-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${availableOnly ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{t.search.availableOnly}</span>
                </label>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleReset}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-blood-600 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                  {t.search.reset}
                </button>
              </div>
            </div>

            {/* Quick blood-group chips */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {language === 'bn' ? 'দ্রুত নির্বাচন' : 'Quick Pick'}
              </div>
              <div className="flex flex-wrap gap-2">
                {BLOOD_GROUPS.map(g => {
                  const active = bloodGroup === g;
                  const count = donors.filter(d => d.bloodGroup === g && d.available).length;
                  return (
                    <button
                      key={g}
                      onClick={() => { setBloodGroup(active ? '' : g); setPage(1); }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${
                        active
                          ? 'bg-blood-600 text-white shadow shadow-red-200'
                          : 'bg-red-50 text-blood-600 hover:bg-red-100 border border-red-100'
                      }`}
                    >
                      {g}
                      <span className={`text-xs font-semibold ${active ? 'text-red-100' : 'text-blood-400'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results */}
          {paginated.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {paginated.map((donor, i) => (
                  <div key={donor.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <DonorCard donor={donor} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t.search.prev}
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                          safePage === i + 1
                            ? 'bg-blood-600 text-white shadow-md shadow-red-200'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t.search.next}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="w-8 h-8 text-blood-300" />
              </div>
              <p className="text-gray-500 font-medium">{t.search.noResults}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-blood-600 via-blood-700 to-blood-800 relative overflow-hidden">
        <div className="absolute top-10 left-10 opacity-10 animate-float"><BloodDropIcon className="w-12 h-12 text-white" /></div>
        <div className="absolute bottom-10 right-20 opacity-10 animate-float" style={{ animationDelay: '1s' }}><BloodDropIcon className="w-16 h-16 text-white" /></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">{t.cta.title}</h2>
          <p className="text-lg text-red-100/80 mb-10 max-w-2xl mx-auto">{t.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blood-600 font-bold rounded-2xl hover:bg-red-50 transition-all shadow-xl hover:-translate-y-0.5"
            >
              {t.cta.button}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={scrollToDonors}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all hover:-translate-y-0.5"
            >
              <Search className="w-5 h-5" />
              {t.hero.findDonor}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
