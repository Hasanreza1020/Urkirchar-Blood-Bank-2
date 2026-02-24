import { CheckCircle, MapPin, Calendar, Phone, MessageCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { LOCATIONS } from '../store/store';
import type { Donor } from '../store/store';

interface DonorCardProps {
  donor: Donor;
}

export function DonorCard({ donor }: DonorCardProps) {
  const { t, language } = useTranslation();

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const bgColors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500', 'bg-rose-500'];
  const colorIndex = donor.name.charCodeAt(0) % bgColors.length;

  const locationDisplay = (() => {
    const loc = LOCATIONS.find(l => l.en === donor.location);
    if (loc) return language === 'bn' ? loc.bn : loc.en;
    return donor.location;
  })();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blood-100 transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative shrink-0">
            {donor.image ? (
              <img src={donor.image} alt={donor.name} className="w-14 h-14 rounded-xl object-cover ring-2 ring-gray-100" />
            ) : (
              <div className={`w-14 h-14 rounded-xl ${bgColors[colorIndex]} flex items-center justify-center ring-2 ring-white/20`}>
                <span className="text-white font-bold text-lg">{getInitials(donor.name)}</span>
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full border-[2.5px] border-white ${donor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-gray-900 truncate text-[15px]">{donor.name}</h3>
              {donor.verified && (
                <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 fill-blue-500 stroke-white" strokeWidth={2.5} />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate text-xs">{locationDisplay}</span>
            </div>
          </div>

          <div className="shrink-0 bg-red-50 text-blood-600 font-black text-sm px-3 py-1.5 rounded-xl border border-red-100">
            {donor.bloodGroup}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
            donor.available
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-50 text-gray-500 border border-gray-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${donor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
            {donor.available ? t.search.available : t.search.unavailable}
          </span>
          {donor.verified && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <CheckCircle className="w-3 h-3" />
              {t.search.verified}
            </span>
          )}
        </div>

        {/* Last Donation */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.search.lastDonation}: {donor.lastDonation}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={`tel:${donor.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-blood-600 to-blood-500 text-white text-sm font-semibold rounded-xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-sm hover:shadow-md"
          >
            <Phone className="w-4 h-4" />
            {t.search.contact}
          </a>
          <a
            href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
