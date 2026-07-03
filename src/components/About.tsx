import { Building, Award, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import RCICBadge from './RCICBadge';

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Verification Banner */}
        <div className="bg-[#f5f5f5] rounded-3xl p-8 lg:p-12 mb-20 relative overflow-hidden flex flex-col md:flex-row items-center border border-gray-100 shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="md:w-1/3 flex justify-center mb-8 md:mb-0">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-brand-red">
               <Award size={64} className="text-brand-blue" />
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-10 text-center md:text-left z-10">
            <div className="text-brand-red font-bold tracking-widest uppercase text-sm mb-2">RCIC-IRB Verification</div>
            <h2 className="heading-font text-3xl md:text-4xl font-bold text-brand-blue mb-2">NUR MOHAMMED (RCIC-IRB & CAPIC)</h2>
            <div className="text-brand-blue font-semibold text-xl mb-4">Managing Director</div>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              B.S.S (Hons), M.S.S (DU, BGD), B.Com. Hons. (Ca) <br/>
              Authorized representative in good standing with the College of Immigration and Citizenship Consultants (CICC).
            </p>
            <div className="mt-2 flex justify-center md:justify-start">
              <RCICBadge />
            </div>
          </div>
        </div>

        {/* Why Choose Us Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-red font-bold tracking-widest uppercase text-sm mb-4 block">Why Choose Us</span>
            <h2 className="heading-font text-4xl md:text-5xl font-bold text-brand-blue mb-8 leading-[1.1]">
              Dedicated team for your Canadian Dream.
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              With a deep understanding of Canadian immigration laws, Heading-West Immigration Services Inc. is committed to providing transparent, efficient, and successful pathways for our clients worldwide.
            </p>

            <div className="space-y-6">
              {[
                { title: 'Expert Guidance', desc: 'Led by RCIC-IRB Nur Mohammed with meticulous attention to detail.' },
                { title: 'Global Presence', desc: 'Offices in Toronto and Dhaka to serve you effectively.' },
                { title: 'Tailored Strategies', desc: 'Customized immigration plans based on your profile.' }
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="text-brand-red" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-brand-blue mb-1">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Abstract visual or grid of team/office */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-brand-blue rounded-3xl p-8 aspect-square flex flex-col justify-end text-white">
                  <Building size={32} className="mb-4 opacity-50" />
                  <div className="text-3xl font-bold mb-1">3</div>
                  <div className="text-sm opacity-80 uppercase tracking-widest">Global Offices</div>
                </div>
                <div className="bg-[#f0f0f0] rounded-3xl p-8 aspect-square flex flex-col justify-end">
                  <div className="text-brand-blue text-sm font-bold uppercase tracking-widest mb-2">Team</div>
                  <ul className="text-gray-600 space-y-2 text-sm font-medium">
                    <li><span className="text-brand-blue font-bold">Muzammil Hussain</span> <br/>Manager</li>
                    <li className="pt-2"><span className="text-brand-blue font-bold">Al Amin</span> <br/>Admin & IT Operations</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="bg-[#f0f0f0] rounded-3xl p-8 aspect-square flex flex-col justify-end">
                  <div className="text-brand-blue text-sm font-bold uppercase tracking-widest mb-2">Advisory</div>
                  <ul className="text-gray-600 space-y-2 text-sm font-medium">
                    <li><span className="text-brand-blue font-bold">Gazi Hayder</span> <br/>Business Advisor</li>
                  </ul>
                </div>
                <div className="bg-brand-red rounded-3xl p-8 aspect-square flex flex-col justify-end text-white relative overflow-hidden">
                  <Clock size={120} className="absolute -top-10 -right-10 opacity-10" />
                  <div className="text-4xl font-bold mb-1">10+</div>
                  <div className="text-sm opacity-90 uppercase tracking-widest">Years Exp.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function ArrowRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}
