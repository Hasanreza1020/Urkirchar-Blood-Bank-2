import { useEffect, useState } from 'react';
import { insertDonor, fetchApprovedDonors, type SupabaseDonor } from '../lib/supabase';

export function SupabaseExample() {
  const [donors, setDonors] = useState<SupabaseDonor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchApprovedDonors();
        setDonors(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch donors');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleInsert = async () => {
    try {
      setError(null);
      await insertDonor({
        name: 'Demo Donor',
        phone: '+8801000000000',
        blood_group: 'O+',
        location: 'Urkirchar Shanti Sangha',
        last_donation: new Date().toISOString().slice(0, 10),
        is_approved: true,
      });
      const data = await fetchApprovedDonors();
      setDonors(data);
    } catch (err: any) {
      setError(err.message || 'Insert failed');
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">Supabase Example</h3>
        <button
          onClick={handleInsert}
          className="px-3 py-2 text-sm bg-blood-600 text-white rounded-lg"
        >
          Insert Demo Donor
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="space-y-2">
        {donors.map((d) => (
          <li key={d.id} className="text-sm text-gray-700">
            <span className="font-semibold">{d.name}</span> — {d.blood_group} — {d.location}
          </li>
        ))}
      </ul>
    </div>
  );
}
