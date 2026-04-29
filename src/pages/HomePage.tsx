import { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Users, Heart, Droplets, ArrowRight, ListFilter as Filter, ChevronLeft, ChevronRight, X, MapPin, HeartHandshake, Star } from 'lucide-react';
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
      {/* Hero Section — slim */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/60 via-white to-white">
        <div className="absolute top-0 left-10 w-72 h-72 bg-red-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-pink-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-12 sm:pb-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-3 tracking-tight animate-slide-up">
              {t.hero.headline.split(' ').slice(0, -2).map((word, i) => (
                <span key={i}>{word} </span>
              ))}
              <span className="gradient-text">{t.hero.headline.split(' ').slice(-2).join(' ')}</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mb-5 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {t.hero.subtext}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={scrollToDonors}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blood-600 to-blood-500 text-white font-semibold rounded-xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-md shadow-red-200/50 hover:shadow-lg hover:-translate-y-0.5 text-sm"
              >
                <Search className="w-4 h-4" />
                {t.hero.findDonor}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blood-600 font-semibold rounded-xl border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all text-sm"
              >
                <UserPlus className="w-4 h-4" />
                {t.hero.becomeDonor}
              </Link>
            </div>
          </div>

          {/* Stats — compact strip */}
          <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto">
            {[
              { label: t.stats.totalDonors, value: totalDonors, icon: Users, iconColor: '#dc2626' },
              { label: t.stats.availableDonors, value: availableDonors, icon: Heart, iconColor: '#22c55e' },
              { label: t.stats.bloodGroups, value: bloodGroups, icon: Droplets, iconColor: '#a855f7' },
              { label: t.stats.livesSaved, value: 150, icon: HeartHandshake, iconColor: '#f59e0b' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl px-2 py-3 text-center border border-gray-100 shadow-sm animate-slide-up"
                style={{ animationDelay: `${0.3 + i * 0.05}s` }}
              >
                <stat.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: stat.iconColor }} />
                <div className="text-lg sm:text-xl font-black text-gray-900 leading-none">
                  <AnimatedCounter end={stat.value} />
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium leading-tight">{stat.label}</div>
              </div>
            ))}
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

      {/* About Us */}
      <section id="about" className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-blood-600 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <HeartHandshake className="w-3 h-3" /> {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              {language === 'bn' ? 'আমরা কেন এই প্ল্যাটফর্ম তৈরি করেছি' : 'Why we built this platform'}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {language === 'bn'
                ? 'উরকিরচর শান্তি সংঘ দ্বারা পরিচালিত একটি কমিউনিটি উদ্যোগ।'
                : 'A community initiative managed by Urkirchar Shanti Sangha.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-5 text-gray-600 leading-relaxed">
              {language === 'bn' ? (
                <>
                  <p>
                    জরুরি মুহূর্তে রক্ত খুঁজে পাওয়া উরকিরচরের মানুষের জন্য দীর্ঘদিনের একটি সংগ্রাম। প্রিয়জনের জন্য রক্তদাতা খুঁজতে গিয়ে পরিবারগুলোকে যে অসহায়তা ও আতঙ্কের মধ্য দিয়ে যেতে হয়, তা আমরা নিজের চোখে দেখেছি।
                  </p>
                  <p>
                    সেই কথা মাথায় রেখেই <span className="font-semibold text-gray-900">উরকিরচর শান্তি সংঘ</span> এই প্ল্যাটফর্মটি তৈরি করেছে — যেখানে রক্তের গ্রুপ ও এলাকা অনুযায়ী কয়েক মিনিটেই উরকিরচরের যাচাইকৃত রক্তদাতাদের খুঁজে পাওয়া যায় এবং সরাসরি কল বা হোয়াটসঅ্যাপে যোগাযোগ করা যায়।
                  </p>
                  <p>
                    আপনি যদি একজন রক্তদাতা হিসেবে নিবন্ধন করেন, তবে আপনি কারো সবচেয়ে কঠিন দিনে তাদের আশার আলো হয়ে উঠবেন — হয়তো অপরিচিত কারো জন্য, প্রতিবেশীর জন্য, কিংবা আপনার নিজের প্রিয়জনের জন্য।
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Finding blood in time of need has long been a struggle for the people of Urkirchar. We have watched families search desperately for donors during emergencies, often turning to strangers and social media in moments of fear and helplessness.
                  </p>
                  <p>
                    Thinking about that, <span className="font-semibold text-gray-900">Urkirchar Shanti Sangha</span> built this platform — a single place where anyone can search verified donors by blood group and area in minutes, and reach them directly through call or WhatsApp without going through middlemen.
                  </p>
                  <p>
                    When you register as a donor, you become someone&apos;s hope on their darkest day — for a stranger, for a neighbor, perhaps even for someone you love. Every drop you give can save a life. Join the community and be the reason a family doesn&apos;t lose hope tonight.
                  </p>
                </>
              )}

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blood-600 to-blood-500 text-white font-semibold rounded-xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-md text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  {language === 'bn' ? 'রক্তদাতা হিসেবে নিবন্ধন করুন' : 'Register as a donor'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Search,
                  title: language === 'bn' ? 'দ্রুত অনুসন্ধান' : 'Fast search',
                  desc: language === 'bn' ? 'রক্তের গ্রুপ ও এলাকা অনুযায়ী মুহূর্তেই যাচাইকৃত রক্তদাতা খুঁজুন।' : 'Find verified donors by blood group and area in seconds.',
                  color: 'bg-red-50', iconColor: '#dc2626',
                },
                {
                  icon: Heart,
                  title: language === 'bn' ? 'সরাসরি যোগাযোগ' : 'Direct contact',
                  desc: language === 'bn' ? 'কোনো মধ্যস্থ নেই — সরাসরি কল বা হোয়াটসঅ্যাপে যোগাযোগ করুন।' : 'No middlemen — reach the donor directly via call or WhatsApp.',
                  color: 'bg-green-50', iconColor: '#22c55e',
                },
                {
                  icon: Droplets,
                  title: language === 'bn' ? 'যাচাইকৃত রক্তদাতা' : 'Verified donors',
                  desc: language === 'bn' ? 'নিরাপত্তার জন্য প্রতিটি রক্তদাতার তথ্য আমরা যাচাই করি।' : 'Every donor profile is reviewed and verified for safety.',
                  color: 'bg-purple-50', iconColor: '#a855f7',
                },
                {
                  icon: HeartHandshake,
                  title: language === 'bn' ? 'কমিউনিটি দ্বারা পরিচালিত' : 'Run by the community',
                  desc: language === 'bn' ? 'উরকিরচর শান্তি সংঘ দ্বারা পরিচালিত — সম্পূর্ণ বিনামূল্যে।' : 'Managed by Urkirchar Shanti Sangha — completely free to use.',
                  color: 'bg-amber-50', iconColor: '#f59e0b',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                    <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1.5">{card.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
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
