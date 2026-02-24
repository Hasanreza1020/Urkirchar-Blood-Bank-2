import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Droplets, Upload, X, Camera } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useStore, LOCATIONS } from '../store/store';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function RegisterPage() {
  const { t, language } = useTranslation();
  const { registerUser, addDonor, currentUser } = useStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', bloodGroup: '', phone: '', email: '', password: '',
    location: '', lastDonation: '', image: '', available: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.bloodGroup) errs.bloodGroup = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password.trim()) errs.password = 'Required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (!form.location) errs.location = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: '' }));
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const user = registerUser({ name: form.name, email: form.email, password: form.password });
    addDonor({
      name: form.name, bloodGroup: form.bloodGroup, phone: form.phone, email: form.email,
      location: form.location, lastDonation: form.lastDonation || 'N/A',
      available: form.available, image: form.image, userId: user.id,
    });
    toast.success(t.register.success);
    navigate('/profile');
  };

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-blood-500 focus:border-blood-500 bg-white text-gray-900 placeholder-gray-400 transition-colors ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  if (currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-sm border border-gray-100">
          <Droplets className="w-12 h-12 text-blood-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Already registered!</h2>
          <p className="text-gray-500 mb-6">You are already logged in.</p>
          <Link to="/profile" className="px-6 py-3 bg-blood-600 text-white rounded-xl font-medium hover:bg-blood-700 transition-colors inline-block">
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blood-500 to-blood-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200/50">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">{t.register.title}</h1>
          <p className="text-gray-500 mt-2">{t.register.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.register.photo}</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blood-400 hover:bg-red-50/50 transition-colors"
                  >
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <Upload className="w-4 h-4" />
                  {imagePreview ? t.register.changePhoto : t.register.uploadPhoto}
                </button>
                <p className="text-xs text-gray-400 mt-1">
                  {language === 'bn' ? 'সর্বোচ্চ ২ MB, JPG/PNG' : 'Max 2MB, JPG/PNG'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.register.fullName} *</label>
            <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder={t.register.namePlaceholder} className={inputClass('name')} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.register.bloodGroup} *</label>
              <select value={form.bloodGroup} onChange={e => handleChange('bloodGroup', e.target.value)} className={inputClass('bloodGroup')}>
                <option value="">{t.register.selectBloodGroup}</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.bloodGroup && <p className="text-xs text-red-500 mt-1">{errors.bloodGroup}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.register.phone} *</label>
              <input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder={t.register.phonePlaceholder} className={inputClass('phone')} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.register.email} *</label>
              <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder={t.register.emailPlaceholder} className={inputClass('email')} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.register.password} *</label>
              <input type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} placeholder={t.register.passwordPlaceholder} className={inputClass('password')} />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.register.location} *</label>
              <select value={form.location} onChange={e => handleChange('location', e.target.value)} className={inputClass('location')}>
                <option value="">{t.register.selectLocation}</option>
                {LOCATIONS.map(loc => (
                  <option key={loc.en} value={loc.en}>
                    {language === 'bn' ? loc.bn : loc.en}
                  </option>
                ))}
              </select>
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.register.lastDonation}</label>
              <input type="date" value={form.lastDonation} onChange={e => handleChange('lastDonation', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blood-500 focus:border-blood-500 bg-white text-gray-900" />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer py-2">
            <div className="relative">
              <input type="checkbox" checked={form.available} onChange={e => handleChange('available', e.target.checked)} className="sr-only" />
              <div className={`w-12 h-7 rounded-full transition-colors ${form.available ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-1 ${form.available ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">{t.register.availableToggle}</span>
          </label>

          <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blood-600 to-blood-500 text-white font-bold rounded-xl hover:from-blood-700 hover:to-blood-600 transition-all shadow-lg shadow-red-200/50 hover:shadow-xl">
            <UserPlus className="w-5 h-5" />
            {t.register.submit}
          </button>

          <p className="text-center text-sm text-gray-500">
            {t.register.alreadyAccount}{' '}
            <Link to="/login" className="text-blood-600 font-semibold hover:underline">{t.register.loginHere}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
