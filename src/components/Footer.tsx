import { Link } from 'react-router-dom';
import { Droplets, MapPin, Mail, Heart, ExternalLink } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export function Footer() {
  const { t, language } = useTranslation();

  const aboutText = language === 'bn'
    ? 'উরকিরচর ব্লাড ব্যাংক ওয়েবসাইটটি উরকিরচরের তরুণদের উদ্যোগে তৈরি করা হয়েছে, যাতে প্রয়োজনের সময় মানুষ সহজে রক্তদাতা খুঁজে পেতে পারে। আমাদের লক্ষ্য হলো রক্তদাতা ও রক্তপ্রয়োজনীয় মানুষের মধ্যে দ্রুত যোগাযোগ তৈরি করা এবং এলাকার মানুষের পাশে থাকা।'
    : 'The Urkirchar Blood Bank website was built by the youth of Urkirchar to help the community connect with blood donors more easily during emergencies. Our goal is to make the process simple and support people in times of need by connecting donors and recipients quickly.';

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand & About */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blood-500 to-blood-700 rounded-xl flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">
                  {language === 'bn' ? 'উরকিরচর' : 'Urkirchar'}
                </span>
                <span className="text-lg font-bold text-blood-400 ml-1">
                  {language === 'bn' ? 'ব্লাড ব্যাংক' : 'Blood Bank'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mt-3">{aboutText}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t.footer.quickLinks}</h3>
            <div className="space-y-3">
              {[
                { to: '/', label: t.nav.home },
                { to: '/search', label: t.nav.findDonor },
                { to: '/register', label: t.nav.register },
                { to: '/login', label: t.nav.login },
              ].map(link => (
                <Link key={link.to} to={link.to} className="block text-sm text-gray-400 hover:text-blood-400 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t.footer.contact}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-blood-400 shrink-0" />
                {t.footer.address}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-blood-400 shrink-0" />
                urkircharbloodbank@gmail.com
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-gray-300 flex items-center gap-1.5 flex-wrap justify-center">
            {language === 'bn' ? 'উরকিরচর কমিউনিটির জন্য ভালোবাসায় তৈরি' : 'Made out of love for the Urkirchar community'}
            <Heart className="w-3.5 h-3.5 text-blood-500 fill-blood-500" />
            {language === 'bn' ? 'দ্বারা' : 'by'}
            <a
              href="https://www.facebook.com/Hasanreza101"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blood-400 hover:text-blood-300 font-semibold inline-flex items-center gap-1 hover:underline transition-colors"
            >
              Hasan Reza
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Urkirchar Blood Bank. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
