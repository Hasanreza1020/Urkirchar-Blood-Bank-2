import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Edit3, Save, X, MapPin, Phone, Mail, Calendar, Droplets, Shield, CheckCircle, Camera, Upload } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useStore, LOCATIONS } from '../store/store';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { t, language } = useTranslation();
  const { currentUser, donors, updateDonor, toggleAvailable } = useStore();
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const donor = donors.find(d => d.userId === currentUser?.id);

  const [form, setForm] = useState({ name: '', phone: '', location: '', lastDonation: '', image: '' });

  useEffect(() => {
    if (donor) setForm({ name: donor.name, phone: donor.phone, location: donor.location, lastDonation: donor.lastDonation, image: donor.image });
  }, [donor]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-sm border border-gray-100">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Not logged in</h2>
          <p className="text-gray-500 mb-6">Please login to view your profile.</p>
          <Link to="/login" className="px-6 py-3 bg-blood-600 text-white rounded-xl font-medium hover:bg-blood-700 transition-colors inline-block">Login</Link>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm(p => ({ ...p, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (donor) {
      updateDonor(donor.id, { name: form.name, phone: form.phone, location: form.location, lastDonation: form.lastDonation, image: form.image });
      toast.success(t.profile.updated);
    }
    setEditing(false);
  };

  const handleToggleAvailable = () => {
    if (donor) {
      toggleAvailable(donor.id);
      toast.success(donor.available ? 'Status: Unavailable' : 'Status: Available');
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const getLocationDisplay = (loc: string) => {
    const found = LOCATIONS.find(l => l.en === loc);
    if (found) return language === 'bn' ? found.bn : found.en;
    return loc;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">{t.profile.title}</h1>
          <p className="text-gray-500 mt-1">{t.profile.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="h-36 bg-gradient-to-r from-blood-500 via-blood-600 to-rose-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'}} />
            {currentUser.role === 'admin' && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" /> Admin
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="px-6 sm:px-8 -mt-14 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative group">
                {(editing ? form.image : donor?.image) ? (
                  <img src={editing ? form.image : donor?.image} alt={currentUser.name} className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl object-cover" />
                ) : (
                  <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-blood-400 to-blood-600 flex items-center justify-center">
                    <span className="text-white text-3xl font-black">{getInitials(currentUser.name)}</span>
                  </div>
                )}
                {editing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {donor?.verified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center border-3 border-white shadow-sm">
                    <CheckCircle className="w-4.5 h-4.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 pb-1">
                <h2 className="text-2xl font-black text-gray-900">{donor?.name || currentUser.name}</h2>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
              {donor && (
                <div className="bg-red-50 text-blood-600 font-black text-xl px-5 py-2.5 rounded-xl border border-red-100">
                  {donor.bloodGroup}
                </div>
              )}
            </div>
          </div>

          {/* Availability Toggle */}
          {donor && (
            <div className="mx-6 sm:mx-8 mb-6 flex items-center justify-between px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-900">{t.profile.availableToggle}</p>
                <p className={`text-sm font-medium mt-0.5 ${donor.available ? 'text-green-600' : 'text-gray-500'}`}>
                  {donor.available ? t.search.available : t.search.unavailable}
                </p>
              </div>
              <button onClick={handleToggleAvailable} className="relative">
                <div className={`w-14 h-8 rounded-full transition-all duration-300 ${donor.available ? 'bg-green-500 shadow-green-200 shadow-md' : 'bg-gray-300'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-1 ${donor.available ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
              </button>
            </div>
          )}

          {/* Info */}
          {donor && (
            <div className="px-6 sm:px-8 pb-8 space-y-6">
              <div className="flex justify-between items-center">
                {editing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <Upload className="w-4 h-4" />
                    {language === 'bn' ? 'ছবি আপলোড' : 'Upload Photo'}
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  {editing ? (
                    <>
                      <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2.5 bg-blood-600 text-white text-sm font-semibold rounded-xl hover:bg-blood-700 transition-colors shadow-sm">
                        <Save className="w-4 h-4" /> {t.profile.saveChanges}
                      </button>
                      <button onClick={() => { setEditing(false); if(donor) setForm({ name: donor.name, phone: donor.phone, location: donor.location, lastDonation: donor.lastDonation, image: donor.image }); }} className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                        <X className="w-4 h-4" /> {t.profile.cancel}
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                      <Edit3 className="w-4 h-4" /> {t.profile.editProfile}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t.profile.donorInfo}</h3>
                <div className="space-y-2">
                  <InfoRow icon={User} label={t.register.fullName}>
                    {editing ? <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blood-500" />
                    : <span className="text-gray-900 font-medium">{donor.name}</span>}
                  </InfoRow>
                  <InfoRow icon={Droplets} label={t.register.bloodGroup}>
                    <span className="text-blood-600 font-black">{donor.bloodGroup}</span>
                  </InfoRow>
                  <InfoRow icon={MapPin} label={t.register.location}>
                    {editing ? (
                      <select value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blood-500">
                        {LOCATIONS.map(loc => (
                          <option key={loc.en} value={loc.en}>{language === 'bn' ? loc.bn : loc.en}</option>
                        ))}
                      </select>
                    ) : <span className="text-gray-900">{getLocationDisplay(donor.location)}</span>}
                  </InfoRow>
                  <InfoRow icon={Calendar} label={t.register.lastDonation}>
                    {editing ? <input type="date" value={form.lastDonation} onChange={e => setForm(p => ({...p, lastDonation: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blood-500" />
                    : <span className="text-gray-900">{donor.lastDonation}</span>}
                  </InfoRow>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t.profile.contactInfo}</h3>
                <div className="space-y-2">
                  <InfoRow icon={Phone} label={t.register.phone}>
                    {editing ? <input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blood-500" />
                    : <span className="text-gray-900">{donor.phone}</span>}
                  </InfoRow>
                  <InfoRow icon={Mail} label={t.register.email}>
                    <span className="text-gray-900">{donor.email}</span>
                  </InfoRow>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 text-sm text-gray-400">
                {t.profile.memberSince}: {donor.createdAt}
              </div>
            </div>
          )}

          {!donor && (
            <div className="px-6 sm:px-8 pb-8 text-center">
              <p className="text-gray-500 mb-4">No donor profile found. Register as a donor to complete your profile.</p>
              <Link to="/register" className="px-6 py-3 bg-blood-600 text-white rounded-xl font-medium hover:bg-blood-700 transition-colors inline-block">Register as Donor</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-xl">
      <Icon className="w-4 h-4 text-gray-400 shrink-0" />
      <div className="min-w-[100px] text-sm text-gray-500 shrink-0">{label}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
