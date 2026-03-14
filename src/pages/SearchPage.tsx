import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ListFilter as Filter, ChevronLeft, ChevronRight, X, Droplets } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useStore, LOCATIONS } from '../store/supabaseStore';
import { DonorCard } from '../components/DonorCard';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const PER_PAGE = 6;

export function SearchPage() {
  const { t, language } = useTranslation();
  const donors = useStore(state => state.donors);
  const [searchParams, setSearchParams] = useSearchParams();

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || '');
  const [location, setLocation] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return donors.filter(d => {
      if (bloodGroup && d.bloodGroup !== bloodGroup) return false;
      if (location && d.location !== location) return false;
      if (availableOnly && !d.available) return false;
      return true;
    });
  }, [donors, bloodGroup, location, availableOnly]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = () => {
    setPage(1);
    const params = new URLSearchParams();
    if (bloodGroup) params.set('bloodGroup', bloodGroup);
    setSearchParams(params);
  };

  const handleReset = () => {
    setBloodGroup('');
    setLocation('');
    setAvailableOnly(false);
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blood-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{t.search.title}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{t.search.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="w-5 h-5 text-blood-600" />
            <span className="font-semibold text-gray-900">{t.search.search}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.search.bloodGroup}</label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blood-500 focus:border-blood-500 bg-white text-gray-900"
              >
                <option value="">{t.search.allGroups}</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.search.location}</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blood-500 focus:border-blood-500 bg-white text-gray-900"
              >
                <option value="">{t.search.allLocations}</option>
                {LOCATIONS.map(loc => (
                  <option key={loc.en} value={loc.en}>
                    {language === 'bn' ? loc.bn : loc.en}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer px-1 py-2.5">
                <div className="relative">
                  <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} className="sr-only" />
                  <div className={`w-11 h-6 rounded-full transition-colors ${availableOnly ? 'bg-blood-600' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${availableOnly ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">{t.search.availableOnly}</span>
              </label>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blood-600 to-blood-500 text-white text-sm font-semibold rounded-xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-sm"
              >
                <Search className="w-4 h-4" />
                {t.search.search}
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2.5 text-gray-500 hover:text-blood-600 hover:bg-red-50 rounded-xl transition-colors"
                title={t.search.reset}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {t.search.showing} <span className="font-bold text-gray-900">{filtered.length}</span> {t.search.results}
          </p>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded skeleton" />
                    <div className="h-3 w-1/2 rounded skeleton" />
                  </div>
                  <div className="h-8 w-14 rounded-xl skeleton" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded-lg skeleton" />
                  <div className="h-6 w-16 rounded-lg skeleton" />
                </div>
                <div className="h-3 w-1/3 rounded skeleton" />
                <div className="flex gap-2">
                  <div className="h-10 flex-1 rounded-xl skeleton" />
                  <div className="h-10 w-12 rounded-xl skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((donor, i) => (
                <div key={donor.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <DonorCard donor={donor} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
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
                        page === i + 1
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
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t.search.next}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">{t.search.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}
