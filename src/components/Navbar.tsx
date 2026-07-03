import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Phone, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  { id: 'pnp', title: "PNP Entrepreneur & Community", desc: "Provincial entry for entrepreneurs" },
  { id: 'startup', title: "Start-up Business Program", desc: "Immigrate by starting a business" },
  { id: 'caregiver', title: "Caregiver Program", desc: "Pathways for professional caregivers" },
  { id: 'express-entry', title: "Express Entry", desc: "Fast-track skilled worker program" },
  { id: 'family-sponsorship', title: "Family Sponsorship", desc: "Sponsor family members" },
  { id: 'study-permit', title: "Study Permit", desc: "Study in world-class institutions" },
  { id: 'visitor-visa', title: "Visitor & Super Visa", desc: "Visit family and friends" },
  { id: 'spousal-permit', title: "Spousal Open Work Permit", desc: "Bring your spouse to Canada" },
  { id: 'refugee', title: "Refugee Claimant", desc: "Seek protection in Canada" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-blue-light text-white text-xs py-2 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center z-50 relative">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Phone size={12} /> +1 416-529-4558</span>
          <span className="flex items-center gap-1"><Mail size={12} /> info@heading-west.com</span>
        </div>
        <div className="flex gap-4 mt-2 sm:mt-0 font-medium tracking-wide">
          <span>RCIC-IRB & CAPIC : NUR MOHAMMED</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <img src="/logo.png.png" alt="Heading-West Immigration Services Inc." className="h-10 sm:h-12 w-auto object-contain" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/#about" className="text-gray-700 hover:text-brand-red font-medium transition-colors">About Us</a>
              
              <div 
                className="relative py-8"
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <button className="flex items-center gap-1 text-gray-700 hover:text-brand-red font-medium transition-colors">
                  Services <ChevronDown size={16} />
                </button>
                
                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {showMegaMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full -left-64 w-[800px] bg-white shadow-2xl border border-gray-100 rounded-b-xl overflow-hidden"
                    >
                      <div className="p-8 grid grid-cols-3 gap-6">
                        {SERVICES.map((service, idx) => (
                          <Link to={`/services/${service.id}`} key={idx} className="group block" onClick={() => setShowMegaMenu(false)}>
                            <h4 className="text-sm font-semibold text-brand-blue group-hover:text-brand-red mb-1 transition-colors">{service.title}</h4>
                            <p className="text-xs text-gray-500">{service.desc}</p>
                          </Link>
                        ))}
                      </div>
                      <div className="bg-brand-blue-light p-4 text-center">
                        <Link to="/booking" className="text-white text-sm font-medium hover:underline" onClick={() => setShowMegaMenu(false)}>
                          Need help figuring out which program is right for you? Book an appointment.
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="/#assessment" className="text-gray-700 hover:text-brand-red font-medium transition-colors">Smart Assessment</a>
              <a href="/#news" className="text-gray-700 hover:text-brand-red font-medium transition-colors">News</a>
              
              <Link to="/booking" className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-2.5 rounded-full font-medium transition-colors">
                Book Consultation
              </Link>

              <Link to="/client-dashboard" className="text-gray-700 hover:text-brand-red font-medium transition-colors flex items-center justify-center p-2 rounded-full hover:bg-gray-100" title="Client Portal">
                <User size={20} />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-brand-blue p-2">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                <a href="/#about" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-brand-red" onClick={() => setIsOpen(false)}>About Us</a>
                <div className="px-3 py-2">
                  <span className="block text-base font-medium text-gray-900 mb-2">Services</span>
                  <div className="pl-4 space-y-2 border-l-2 border-gray-100">
                    {SERVICES.slice(0, 5).map((service, idx) => (
                       <Link to={`/services/${service.id}`} key={idx} className="block text-sm text-gray-600 hover:text-brand-red" onClick={() => setIsOpen(false)}>{service.title}</Link>
                    ))}
                    <Link to="/" className="block text-sm font-semibold text-brand-blue mt-2" onClick={() => setIsOpen(false)}>View all services...</Link>
                  </div>
                </div>
                <a href="/#assessment" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-brand-red" onClick={() => setIsOpen(false)}>Smart Assessment</a>
                <Link to="/booking" className="block mt-4 text-center bg-brand-blue text-white px-3 py-3 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                  Book Consultation
                </Link>
                <Link to="/client-dashboard" className="flex items-center gap-2 px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-brand-red mt-2" onClick={() => setIsOpen(false)}>
                  <User size={20} /> Client Portal
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
