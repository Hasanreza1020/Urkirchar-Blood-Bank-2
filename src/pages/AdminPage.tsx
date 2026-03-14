import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, CircleCheck as CheckCircle, Clock, Heart, Trash2, ToggleLeft, ToggleRight, Search, ChevronLeft, ChevronRight, Copy, ClipboardCheck } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useStore } from '../store/supabaseStore';
import toast from 'react-hot-toast';

const PER_PAGE = 10;

export function AdminPage() {
  const { t } = useTranslation();
  const { currentUser, donors, toggleVerified, toggleAvailable, deleteDonor } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [copiedAll, setCopiedAll] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-sm border border-gray-100">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You need admin privileges to access this page.</p>
          <Link to="/login" className="px-6 py-3 bg-blood-600 text-white rounded-xl font-medium hover:bg-blood-700 transition-colors inline-block">Login as Admin</Link>
        </div>
      </div>
    );
  }

  const totalDonors = donors.length;
  const verifiedCount = donors.filter(d => d.verified).length;
  const pendingCount = donors.filter(d => !d.verified).length;
  const availableCount = donors.filter(d => d.available).length;

  const filtered = donors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.phone.includes(searchQuery)
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete donor "${name}"?`)) return;

    setActionLoading(id);
    try {
      await deleteDonor(id);
      toast.success(`Deleted ${name}`);
    } catch (error) {
      toast.error('Failed to delete donor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVerified = async (id: string, name: string) => {
    setActionLoading(id);
    try {
      await toggleVerified(id);
      toast.success(`Updated ${name}`);
    } catch (error) {
      toast.error('Failed to update');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAvailable = async (id: string, name: string) => {
    setActionLoading(id);
    try {
      await toggleAvailable(id);
      toast.success(`Updated ${name}`);
    } catch (error) {
      toast.error('Failed to update');
    } finally {
      setActionLoading(null);
    }
  };

  const copyAllData = () => {
    const header = 'No.\tName\tBlood Group\tPhone\tEmail\tLocation\tLast Donation\tAvailable\tVerified\tRegistered';
    const rows = donors.map((d, i) =>
      `${i + 1}\t${d.name}\t${d.bloodGroup}\t${d.phone}\t${d.email}\t${d.location}\t${d.lastDonation}\t${d.available ? 'Yes' : 'No'}\t${d.verified ? 'Yes' : 'No'}\t${d.createdAt}`
    );
    const text = [header, ...rows].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      toast.success(t.admin.copied);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const copySingleDonor = (d: typeof donors[0]) => {
    const text = `Name: ${d.name}\nBlood Group: ${d.bloodGroup}\nPhone: ${d.phone}\nEmail: ${d.email}\nLocation: ${d.location}\nLast Donation: ${d.lastDonation}\nAvailable: ${d.available ? 'Yes' : 'No'}\nVerified: ${d.verified ? 'Yes' : 'No'}\nRegistered: ${d.createdAt}`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Copied ${d.name}'s info`);
    });
  };

  const stats = [
    { label: t.admin.totalDonors, value: totalDonors, icon: Users, iconColor: '#dc2626', bg: 'bg-red-50', border: 'border-red-100' },
    { label: t.admin.verified, value: verifiedCount, icon: CheckCircle, iconColor: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: t.admin.pending, value: pendingCount, icon: Clock, iconColor: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: t.admin.available, value: availableCount, icon: Heart, iconColor: '#22c55e', bg: 'bg-green-50', border: 'border-green-100' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blood-500 to-blood-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-200/50">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{t.admin.title}</h1>
              <p className="text-sm text-gray-500">{t.admin.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-white rounded-2xl border ${stat.border} p-5 shadow-sm`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${stat.bg}`}>
                <stat.icon className="w-5 h-5" style={{ color: stat.iconColor }} />
              </div>
              <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Donor Management */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">{t.admin.donorList}</h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                  placeholder="Search donors..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blood-500 focus:border-blood-500 bg-white text-gray-900 placeholder-gray-400"
                />
              </div>
              <button
                onClick={copyAllData}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  copiedAll
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-blood-600 border border-red-100 hover:bg-red-100'
                }`}
              >
                {copiedAll ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedAll ? 'Copied!' : t.admin.copyAll}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-8">#</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{t.admin.name}</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{t.admin.bloodGroup}</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t.admin.phone}</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t.admin.location}</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{t.admin.status}</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((donor, idx) => (
                  <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-xs text-gray-400 font-mono">
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-blood-600 font-bold text-xs shrink-0 overflow-hidden">
                          {donor.image ? (
                            <img src={donor.image} alt={donor.name} className="w-9 h-9 rounded-lg object-cover" />
                          ) : (
                            donor.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate max-w-[140px]">{donor.name}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[140px]">{donor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="bg-red-50 text-blood-600 font-bold text-xs px-2.5 py-1.5 rounded-lg">{donor.bloodGroup}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell font-mono text-xs">
                      {donor.phone}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">
                      <span className="truncate block max-w-[180px] text-xs">{donor.location}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md w-fit ${
                          donor.verified ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {donor.verified ? '✓ Verified' : '⏳ Pending'}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md w-fit ${
                          donor.available ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {donor.available ? '● Available' : '○ Unavailable'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => copySingleDonor(donor)}
                          title="Copy donor info"
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleVerified(donor.id, donor.name)}
                          disabled={actionLoading === donor.id}
                          title={t.admin.toggleVerify}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                          {donor.verified ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleToggleAvailable(donor.id, donor.name)}
                          disabled={actionLoading === donor.id}
                          title={t.admin.toggleAvailable}
                          className="p-2 rounded-lg text-green-500 hover:bg-green-50 transition-colors disabled:opacity-50"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(donor.id, donor.name)}
                          disabled={actionLoading === donor.id}
                          title={t.admin.delete}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No donors found.</div>
          )}

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {t.search.page} {page} {t.search.of} {totalPages} ({filtered.length} total)
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Blood Group Chart */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-5">{t.admin.analytics}</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => {
              const count = donors.filter(d => d.bloodGroup === group).length;
              const max = Math.max(...['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => donors.filter(d => d.bloodGroup === g).length), 1);
              return (
                <div key={group} className="text-center">
                  <div className="h-28 bg-gray-50 rounded-xl flex items-end justify-center p-2 mb-2">
                    <div
                      className="w-full bg-gradient-to-t from-blood-600 to-blood-400 rounded-lg transition-all duration-500"
                      style={{ height: `${(count / max) * 100}%`, minHeight: count > 0 ? '10px' : '0' }}
                    />
                  </div>
                  <div className="text-sm font-black text-blood-600">{group}</div>
                  <div className="text-xs text-gray-400 font-medium">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
