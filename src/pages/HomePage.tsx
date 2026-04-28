import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserPlus, Users, Heart, Droplets, ArrowRight, UserCheck, ClipboardCheck, HeartHandshake, Shield, Star, CircleCheck as CheckCircle, MapPin, Calendar, Phone, MessageCircle, Copy, Building2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';
import { useStore, LOCATIONS } from '../store/supabaseStore';

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
  const navigate = useNavigate();

  const [quickBloodGroup, setQuickBloodGroup] = useState('');
  const [quickLocation, setQuickLocation] = useState('');

  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.available).length;
  const bloodGroups = [...new Set(donors.map(d => d.bloodGroup))].length;

  const recentWarriors = [...donors]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (quickBloodGroup) params.set('bloodGroup', quickBloodGroup);
    if (quickLocation) params.set('location', quickLocation);
    navigate(`/search?${params.toString()}`);
  };

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success(language === 'bn' ? 'ফোন নম্বর কপি করা হয়েছে' : 'Phone number copied');
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const bgColors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500', 'bg-rose-500'];

  const getLocationDisplay = (loc: string) => {
    const found = LOCATIONS.find(l => l.en === loc);
    if (found) return language === 'bn' ? found.bn : found.en;
    return loc;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/60 via-white to-white">
        <div className="absolute top-20 left-10 w-80 h-80 bg-red-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-pink-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-rose-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '4s' }} />

        <div className="absolute top-32 right-[15%] opacity-10 animate-float" style={{ animationDelay: '0s' }}>
          <BloodDropIcon className="w-8 h-8 text-blood-600" />
        </div>
        <div className="absolute top-48 left-[10%] opacity-10 animate-float" style={{ animationDelay: '1s' }}>
          <BloodDropIcon className="w-6 h-6 text-blood-500" />
        </div>
        <div className="absolute bottom-40 right-[20%] opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <BloodDropIcon className="w-10 h-10 text-blood-400" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blood-600 rounded-full text-sm font-medium mb-8 border border-red-100 shadow-sm animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-blood-500 animate-pulse" />
              <span>🩸 {language === 'bn' ? 'উরকিরচর ব্লাড ব্যাংক — একসাথে জীবন বাঁচাই' : 'Urkirchar Blood Bank — Saving Lives Together'}</span>
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

            <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {t.hero.subtext}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/search"
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blood-600 to-blood-500 text-white font-semibold rounded-2xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-xl shadow-red-200/50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                {t.hero.findDonor}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-blood-600 font-semibold rounded-2xl border-2 border-red-100 hover:border-red-300 hover:bg-red-50 transition-all hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5" />
                {t.hero.becomeDonor}
              </Link>
            </div>

            {/* Quick Search Bar (bupblood-inspired) */}
            <form
              onSubmit={handleQuickSearch}
              className="mt-10 bg-white rounded-2xl shadow-xl shadow-red-100/50 border border-red-100 p-3 sm:p-4 max-w-3xl mx-auto animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-red-50/40 rounded-xl border border-red-100/60">
                  <Droplets className="w-4 h-4 text-blood-500 shrink-0" />
                  <select
                    value={quickBloodGroup}
                    onChange={e => setQuickBloodGroup(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">{language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood group'}</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-red-50/40 rounded-xl border border-red-100/60">
                  <MapPin className="w-4 h-4 text-blood-500 shrink-0" />
                  <select
                    value={quickLocation}
                    onChange={e => setQuickLocation(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">{language === 'bn' ? 'এলাকা (যেকোনো)' : 'Area (any)'}</option>
                    {LOCATIONS.map(loc => (
                      <option key={loc.en} value={loc.en}>
                        {language === 'bn' ? loc.bn : loc.en}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blood-600 to-blood-500 text-white font-semibold rounded-xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-md"
                >
                  <Search className="w-4 h-4" />
                  {language === 'bn' ? 'খুঁজুন' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
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

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-blood-600 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Star className="w-3 h-3" /> {language === 'bn' ? 'প্রক্রিয়া' : 'Process'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">{t.howItWorks.title}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: UserCheck, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, step: '01', gradient: 'from-blood-500 to-rose-500' },
              { icon: ClipboardCheck, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, step: '02', gradient: 'from-blue-500 to-indigo-500' },
              { icon: HeartHandshake, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, step: '03', gradient: 'from-green-500 to-emerald-500' },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gray-200 to-transparent" />
                )}
                <div className={`relative w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-9 h-9 text-white" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center border-2 border-gray-100 shadow-sm">
                    <span className="text-xs font-black text-gray-900">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Request Banner (bupblood-inspired) */}
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
                    ? 'সরাসরি প্রস্তুত রক্তদাতাদের সাথে যোগাযোগ করুন।'
                    : 'Reach out to ready donors directly within minutes.'}
                </div>
              </div>
            </div>
            <Link
              to="/search?available=true"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blood-600 font-semibold rounded-xl hover:bg-red-50 transition-colors shadow"
            >
              {language === 'bn' ? 'প্রস্তুত রক্তদাতা দেখুন' : 'View Available Donors'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blood Warriors */}
      <section className="py-16 sm:py-20 bg-red-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-blood-600 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Heart className="w-3 h-3" /> {language === 'bn' ? 'সাম্প্রতিক যোদ্ধা' : 'Recent Heroes'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              {t.recentWarriors.title}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {t.recentWarriors.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {recentWarriors.map((warrior, i) => {
              const colorIndex = warrior.name.charCodeAt(0) % bgColors.length;
              const phoneDigits = warrior.phone.replace(/[^0-9]/g, '');
              return (
                <div
                  key={warrior.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 hover:-translate-y-1 animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="p-5 sm:p-6">
                    {/* Header: avatar + name + available pill */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative shrink-0">
                        {warrior.image ? (
                          <img src={warrior.image} alt={warrior.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-red-100" />
                        ) : (
                          <div className={`w-16 h-16 rounded-full ${bgColors[colorIndex]} flex items-center justify-center ring-2 ring-red-100`}>
                            <span className="text-white font-bold text-xl">{getInitials(warrior.name)}</span>
                          </div>
                        )}
                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${warrior.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-blood-600 text-lg leading-tight truncate">{warrior.name}</h3>
                        <div className="mt-1.5">
                          {warrior.available ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              {language === 'bn' ? 'রক্তদানে প্রস্তুত' : 'Available to Donate'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                              {language === 'bn' ? 'এখন অপ্রাপ্য' : 'Currently Unavailable'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Blood group pill - centered like reference */}
                    <div className="flex justify-center mb-5">
                      <div className="inline-flex flex-col items-center justify-center px-8 py-2.5 bg-gradient-to-br from-red-50 to-rose-50 rounded-full border border-red-100">
                        <span className="text-2xl font-black text-blood-600 leading-none">{warrior.bloodGroup}</span>
                        <span className="text-[10px] text-blood-500/80 font-medium mt-0.5 uppercase tracking-wide">
                          {language === 'bn' ? 'রক্তদাতা' : 'Compatible Donor'}
                        </span>
                      </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 rounded-xl">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-none">
                            {language === 'bn' ? 'এলাকা' : 'Area'}
                          </div>
                          <div className="text-sm text-gray-900 font-semibold truncate">{getLocationDisplay(warrior.location)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 rounded-xl">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-none">
                            {language === 'bn' ? 'যোগদান' : 'Joined'}
                          </div>
                          <div className="text-sm text-gray-900 font-semibold truncate">{warrior.createdAt}</div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Numbers */}
                    <div>
                      <div className="text-xs text-gray-500 font-semibold mb-2">
                        {language === 'bn' ? 'যোগাযোগ নম্বর' : 'Contact Number'}
                      </div>
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-3.5 pr-1.5 py-1.5">
                        <span className="flex-1 text-sm font-medium text-gray-900 truncate">{warrior.phone}</span>
                        <button
                          onClick={() => copyPhone(warrior.phone)}
                          className="w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                          title={language === 'bn' ? 'কপি করুন' : 'Copy'}
                          aria-label="Copy phone"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://wa.me/${phoneDigits}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors"
                          title="WhatsApp"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${warrior.phone}`}
                          className="w-9 h-9 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 flex items-center justify-center transition-colors"
                          title={language === 'bn' ? 'কল করুন' : 'Call'}
                          aria-label="Call"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blood-600 font-semibold rounded-xl border border-red-100 hover:bg-red-50 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              {t.hero.findDonor}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blood Group Quick Search */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              {language === 'bn' ? 'রক্তের গ্রুপ অনুযায়ী খুঁজুন' : 'Search by Blood Group'}
            </h2>
            <p className="text-gray-500">
              {language === 'bn' ? 'আপনার প্রয়োজনীয় রক্তের গ্রুপ নির্বাচন করুন' : 'Select the blood group you need'}
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => {
              const count = donors.filter(d => d.bloodGroup === group && d.available).length;
              return (
                <Link
                  key={group}
                  to={`/search?bloodGroup=${encodeURIComponent(group)}`}
                  className="flex flex-col items-center py-5 px-3 bg-white rounded-2xl border border-gray-100 hover:border-red-300 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <span className="text-2xl font-black text-blood-600 group-hover:scale-110 transition-transform">{group}</span>
                  <span className="text-xs text-gray-400 font-medium mt-1">{count} {language === 'bn' ? 'জন' : 'avail.'}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-blood-600 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider">
                <Shield className="w-3 h-3" /> {language === 'bn' ? 'কেন আমরা' : 'Why Us'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
                {language === 'bn' ? 'বিশ্বস্ত ও যাচাইকৃত রক্তদান প্ল্যাটফর্ম' : 'Trusted & Verified Blood Donation Platform'}
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                {language === 'bn'
                  ? 'আমাদের প্ল্যাটফর্মে সকল রক্তদাতা যাচাইকৃত। নিরাপদে এবং দ্রুত রক্তদাতা খুঁজুন।'
                  : 'All donors on our platform are verified. Find blood donors safely and quickly in your time of need.'}
              </p>
              <div className="space-y-4">
                {[
                  language === 'bn' ? 'যাচাইকৃত রক্তদাতা প্রোফাইল' : 'Verified Donor Profiles',
                  language === 'bn' ? 'তাৎক্ষণিক অনুসন্ধান ফলাফল' : 'Instant Search Results',
                  language === 'bn' ? '২৪/৭ জরুরি যোগাযোগ' : '24/7 Emergency Contact',
                  language === 'bn' ? 'সম্পূর্ণ বিনামূল্যে সেবা' : 'Completely Free Service',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-8 border border-red-100">
                <div className="grid grid-cols-2 gap-4">
                  {['A+', 'B+', 'O+', 'AB+'].map((group, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                      <span className="text-2xl font-black text-blood-600">{group}</span>
                      <p className="text-sm text-gray-400 mt-1">{donors.filter(d => d.bloodGroup === group).length} {language === 'bn' ? 'রক্তদাতা' : 'donors'}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-heartbeat">
                      <Heart className="w-8 h-8 text-blood-500 fill-blood-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900">{availableDonors}</p>
                      <p className="text-sm text-gray-500">{language === 'bn' ? 'এখন রক্তদানে প্রস্তুত' : 'Ready to donate now'}</p>
                    </div>
                  </div>
                </div>
              </div>
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
            <Link
              to="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all hover:-translate-y-0.5"
            >
              <Search className="w-5 h-5" />
              {t.hero.findDonor}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
