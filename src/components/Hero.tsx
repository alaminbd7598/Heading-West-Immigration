import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Linkedin, ExternalLink, Download, ShieldCheck, Award } from 'lucide-react';
import RCICBadge from './RCICBadge';

export default function Hero() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Nur Mohammed
ORG:Heading-West Immigration Services Inc.
TITLE:Managing Director (RCIC-IRB & CAPIC)
TEL;TYPE=WORK,VOICE:+14165294558
TEL;TYPE=CELL,VOICE:+8801886270116
EMAIL:info@heading-west.com
URL:https://www.heading-west.com
NOTE:Regulated Canadian Immigration Consultant (License: R711266)
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Nur_Mohammed.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative bg-brand-blue overflow-hidden">
      {/* Background pattern mask */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center border-b border-brand-blue-light">
        
        {/* Text Content Area */}
        <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-widest text-[#E3F2FD] mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-brand-red"></span> Regulated Canadian Immigration Consultant
            </div>
            
            <h1 className="heading-font text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-8">
              Your Pathway to <br/><span className="text-brand-red">Canada</span> Starts Here.
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 font-light max-w-xl mb-10 leading-relaxed">
              Expert immigration consultancy by Heading-West Immigration Services. 
              We navigate complex Canadian programs securely and efficiently.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#assessment" className="flex items-center justify-center gap-2 bg-brand-red hover:bg-white hover:text-brand-red text-white py-4 px-8 rounded-full font-medium text-lg transition-all duration-300">
                Check Eligibility <ArrowRight size={20} />
              </a>
              <a href="#about" className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white py-4 px-8 rounded-full font-medium text-lg border border-white/30 transition-all duration-300">
                Why Choose Us
              </a>
            </div>

            <div className="mt-12 opacity-90">
              <RCICBadge theme="dark" className="!bg-[#0A192F]/50 backdrop-blur border-white/10" />
            </div>
          </motion.div>
        </div>

        {/* Image Area */}
        <div className="w-full lg:w-1/2 h-[500px] lg:h-[800px] relative">
           <div className="absolute inset-0 bg-brand-blue/20 z-10 mix-blend-multiply"></div>
           <img 
            src="https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1000&auto=format&fit=crop" 
            alt="Canadian Landscape Options" 
            className="w-full h-full object-cover"
          />
          
          {/* Floating Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-10 left-10 lg:-left-12 z-20 bg-white p-6 rounded-2xl shadow-2xl max-w-[280px]"
          >
            <div className="flex gap-4 items-start">
              <img src="https://media.licdn.com/dms/image/v2/C4E03AQE1VjXhS_F0QQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1516246377309?e=1746662400&v=beta&t=Nn_Evyg4I_u2x__8wYxLz9hI2-Mh" alt="Nur Mohammed" className="w-14 h-14 rounded-full bg-gray-200 border-2 border-brand-red object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-brand-blue font-bold text-sm">Nur Mohammed</p>
                  <ShieldCheck size={14} className="text-brand-red flex-shrink-0" title="RCIC-IRB Certified" />
                  <Award size={14} className="text-brand-blue flex-shrink-0" title="CAPIC Member" />
                </div>
                <p className="text-xs text-gray-500 font-medium">Managing Director, RCIC</p>
                <div className="mt-2 flex">
                  {[1,2,3,4,5].map(i => <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
                </div>
                <button onClick={() => setIsProfileModalOpen(true)} className="mt-3 text-xs text-brand-red font-semibold hover:text-brand-red-dark hover:underline transition-all flex items-center gap-1">
                  View Profile <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-brand-blue/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8 text-center sm:text-left">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/C4E03AQE1VjXhS_F0QQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1516246377309?e=1746662400&v=beta&t=Nn_Evyg4I_u2x__8wYxLz9hI2-Mh" 
                    alt="Nur Mohammed" 
                    className="w-32 h-32 rounded-2xl bg-gray-200 border-4 border-white shadow-lg object-cover flex-shrink-0" 
                    onError={(e) => { e.currentTarget.style.display='none'; }} 
                  />
                  <div>
                    <div className="text-brand-red font-bold tracking-widest uppercase text-xs mb-2">RCIC-IRB Verification</div>
                    <h3 className="heading-font text-2xl sm:text-3xl font-bold text-brand-blue mb-1">NUR MOHAMMED</h3>
                    <p className="text-lg text-gray-600 font-medium mb-3">Managing Director (RCIC-IRB & CAPIC)</p>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                      B.S.S (Hons), M.S.S (DU, BGD), B.Com. Hons. (Ca)<br/>
                      Authorized representative in good standing with the College of Immigration and Citizenship Consultants (CICC).
                    </p>
                  </div>
                </div>

                <div className="space-y-6 text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="font-bold text-brand-blue mb-2 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                       Professional Credentials
                    </h4>
                    <ul className="space-y-2 ml-4">
                      <li>• RCIC-IRB (Regulated Canadian Immigration Consultant)</li>
                      <li>• Member of CAPIC (Canadian Association of Professional Immigration Consultants)</li>
                      <li>• License Number: R711266</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-brand-blue mb-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                       Professional Background
                    </h4>
                    <div className="ml-4 space-y-5 border-l-2 border-brand-red/20 pl-4 relative">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-red"></div>
                        <h5 className="font-bold text-sm text-gray-800">Regulated Canadian Immigration Consultant (RCIC-IRB)</h5>
                        <p className="text-xs text-gray-500">College of Immigration and Citizenship Consultants (CICC)</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-blue"></div>
                        <h5 className="font-bold text-sm text-gray-800">Member</h5>
                        <p className="text-xs text-gray-500">Canadian Association of Professional Immigration Consultants (CAPIC)</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-blue"></div>
                        <h5 className="font-bold text-sm text-gray-800">Managing Director</h5>
                        <p className="text-xs text-gray-500">Heading-West Immigration Services Inc.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-brand-blue mb-2 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                       Expertise & Experience
                    </h4>
                    <p className="text-sm leading-relaxed ml-4">
                      Nur Mohammed possesses extensive experience in Canadian immigration law and policies. As a Regulated Canadian Immigration Consultant (RCIC-IRB) with unrestricted practice rights before the Immigration and Refugee Board of Canada, he provides impeccable guidance for express entry, provincial nominations, student visas, and complex cases.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <a href="https://www.linkedin.com/in/nur-mohammed-rcic-irb-5b5b0b14b/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-[#0A66C2] hover:text-white text-gray-600 rounded-full transition-colors" title="LinkedIn Profile">
                      <Linkedin size={20} />
                    </a>
                    <a href="https://register.college-ic.ca/Public-Register-EN/RCIC_Search.aspx" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-brand-red hover:text-white text-gray-600 rounded-full transition-colors" title="Verify CICC License">
                      <ExternalLink size={20} />
                    </a>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto text-center">
                    <button onClick={downloadVCard} className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-full transition-colors text-sm">
                      <Download size={16} /> Contact Info
                    </button>
                    <a href="/booking" className="flex-1 sm:flex-none inline-block bg-brand-red hover:bg-brand-red-dark text-white font-medium py-3 px-6 rounded-full transition-colors text-sm">
                      Book Consultation
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
