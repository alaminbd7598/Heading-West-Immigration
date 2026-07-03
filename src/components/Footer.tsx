import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook } from 'lucide-react';
import RCICBadge from './RCICBadge';

export default function Footer() {
  return (
    <footer className="bg-[#050B14] text-white pt-24 pb-12 border-t border-brand-red/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-1">
            <div className="flex-shrink-0 flex mb-6 bg-white p-3 rounded-2xl w-fit">
              <img src="/logo.png.png" alt="Heading-West Immigration Services Inc." className="h-10 sm:h-12 w-auto object-contain" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Authorized Representatives & Regulated Canadian Immigration Consultants (RCIC). Your trusted pathway to a new life in Canada.
            </p>
            <div className="mb-6">
              <RCICBadge theme="dark" className="!bg-[#112240] !border-[#112240]" />
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-brand-red hover:text-brand-red transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-brand-red hover:text-brand-red transition-all"><Linkedin size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-brand-red hover:text-brand-red transition-all"><Instagram size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white heading-font">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-red" />
                <div className="flex flex-col">
                  <span>+1 416-529-4558 (CA)</span>
                  <span>+880 1886-270116 (BD)</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-red" />
                <a href="mailto:info@heading-west.com" className="hover:text-white transition-colors">info@heading-west.com</a>
              </li>
              <li className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-800">
                <span className="font-semibold text-white mt-0.5">RCIC:</span>
                <div>
                  <span className="block text-white">Nur Mohammed</span>
                  <span className="text-xs">B.S.S (Hons), M.S.S, B.Com. Hons.</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white heading-font">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-brand-red transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-brand-red transition-colors">Immigration Services</a></li>
              <li><a href="#assessment" className="hover:text-brand-red transition-colors">Free Assessment</a></li>
              <li><a href="#booking" className="hover:text-brand-red transition-colors">Book Consultation</a></li>
              <li><a href="#news" className="hover:text-brand-red transition-colors">Immigration News</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Verify RCIC License</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white heading-font">Global Offices</h4>
            <ul className="space-y-6 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-red shrink-0 mt-1" />
                <div>
                  <span className="block text-white font-medium mb-1">Toronto (HQ)</span>
                  3000 Danforth Ave, U-5-22,<br/>ON, M4C 1M7, Canada
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-red shrink-0 mt-1" />
                <div>
                  <span className="block text-white font-medium mb-1">Dhaka 1 (Uttara)</span>
                  H-30, R-16, Sect-12,<br/>Uttara, Dhaka-1230
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-red shrink-0 mt-1" />
                <div>
                  <span className="block text-white font-medium mb-1">Dhaka 2 (Mirpur)</span>
                  Shah Ali Plaza, 13th Floor-1310 (B),<br/>Mirpur-10
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 Heading-West Immigration Services Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Retainer Agreement</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
