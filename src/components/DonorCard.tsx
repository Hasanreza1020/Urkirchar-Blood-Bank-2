import { CircleCheck as CheckCircle, Calendar, Phone, MessageCircle, Copy, Building2, Droplets } from 'lucide-react';
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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Header: avatar + name + available pill */}
        <div className="flex items-start gap-4 mb-5">
          <div className="relative shrink-0">
            {donor.image ? (
              <img src={donor.image} alt={donor.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-red-100" />
            ) : (
              <div className={`w-16 h-16 rounded-full ${bgColors[colorIndex]} flex items-center justify-center ring-2 ring-red-100`}>
                <span className="text-white font-bold text-xl">{getInitials(donor.name)}</span>
              </div>
            )}
            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${donor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-blood-600 text-lg leading-tight truncate">{donor.name}</h3>
              {donor.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 fill-blue-500 stroke-white" strokeWidth={2.5} />
              )}
            </div>
            <div className="mt-1.5">
              {donor.available ? (
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

        {/* Blood group pill - centered */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex flex-col items-center justify-center px-8 py-2.5 bg-gradient-to-br from-red-50 to-rose-50 rounded-full border border-red-100">
            <span className="text-2xl font-black text-blood-600 leading-none">{donor.bloodGroup}</span>
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
              <div className="text-sm text-gray-900 font-semibold truncate">{locationDisplay}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-none">
                {language === 'bn' ? 'সর্বশেষ রক্তদান' : 'Last Donation'}
              </div>
              <div className="text-sm text-gray-900 font-semibold truncate">{donor.lastDonation}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Droplets className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-none">
                {language === 'bn' ? 'যোগদান' : 'Joined'}
              </div>
              <div className="text-sm text-gray-900 font-semibold truncate">{donor.createdAt}</div>
            </div>
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <div className="text-xs text-gray-500 font-semibold mb-2">
            {language === 'bn' ? 'যোগাযোগ নম্বর' : 'Contact Number'}
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-3.5 pr-1.5 py-1.5">
            <span className="flex-1 text-sm font-medium text-gray-900 truncate">{donor.phone}</span>
            <button
              onClick={copyPhone}
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
              href={`tel:${donor.phone}`}
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
}
