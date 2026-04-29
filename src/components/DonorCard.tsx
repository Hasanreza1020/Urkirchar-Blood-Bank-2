import { Phone, MessageCircle, Copy, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';
import { LOCATIONS } from '../store/supabaseStore';
import type { Donor } from '../store/supabaseStore';

interface DonorCardProps {
  donor: Donor;
}

const bgColors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500', 'bg-rose-500'];

export function DonorCard({ donor }: DonorCardProps) {
  const { language } = useTranslation();

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const colorIndex = donor.name.charCodeAt(0) % bgColors.length;
  const phoneDigits = donor.phone.replace(/[^0-9]/g, '');

  const locationDisplay = (() => {
    const loc = LOCATIONS.find(l => l.en === donor.location);
    if (loc) return language === 'bn' ? loc.bn : loc.en;
    return donor.location;
  })();

  const copyPhone = () => {
    navigator.clipboard.writeText(donor.phone);
    toast.success(language === 'bn' ? 'ফোন নম্বর কপি করা হয়েছে' : 'Phone number copied');
  };

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-blood-500 via-rose-500 to-blood-600" />

      <div className="p-4 sm:p-5">
        {/* Header: avatar + name + blood group chip on the right */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative shrink-0">
            {donor.image ? (
              <img src={donor.image} alt={donor.name} className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div className={`w-12 h-12 rounded-xl ${bgColors[colorIndex]} flex items-center justify-center`}>
                <span className="text-white font-bold text-base">{getInitials(donor.name)}</span>
              </div>
            )}
            {donor.available && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{donor.name}</h3>
            <span className="text-xs text-gray-400 font-medium">
              {donor.available
                ? (language === 'bn' ? 'প্রস্তুত' : 'Ready to donate')
                : (language === 'bn' ? 'বর্তমানে অপ্রাপ্য' : 'Currently unavailable')}
            </span>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center min-w-[3.25rem] px-2.5 py-1.5 bg-gradient-to-br from-blood-600 to-rose-600 text-white rounded-xl shadow-sm">
            <span className="text-base font-black leading-none">{donor.bloodGroup}</span>
          </div>
        </div>

        {/* Address box */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-red-50/40 border border-red-100/60 rounded-xl mb-2.5">
          <MapPin className="w-4 h-4 text-blood-500 shrink-0" />
          <span className="text-sm text-gray-700 font-medium truncate">{locationDisplay}</span>
        </div>

        {/* Mobile number box */}
        <div className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl">
          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="flex-1 text-sm font-semibold text-gray-900 truncate tracking-wide">{donor.phone}</span>
          <button
            onClick={copyPhone}
            className="w-8 h-8 rounded-lg bg-white hover:bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center transition-colors"
            title={language === 'bn' ? 'কপি করুন' : 'Copy'}
            aria-label="Copy phone"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors"
            title="WhatsApp"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
          <a
            href={`tel:${donor.phone}`}
            className="w-8 h-8 rounded-lg bg-blood-600 hover:bg-blood-700 text-white flex items-center justify-center transition-colors"
            title={language === 'bn' ? 'কল করুন' : 'Call'}
            aria-label="Call"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
