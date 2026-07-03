import { motion } from 'motion/react';
import { ArrowUpRight, GraduationCap, Briefcase, Users, Plane, ShieldCheck, Home, FileText, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES_DATA = [
  { id: 'pnp', icon: Briefcase, title: "PNP Entrepreneur & Community", desc: "Provincial entry pathways for business owners and entrepreneurs." },
  { id: 'startup', icon: ArrowUpRight, title: "Start-up Business Program", desc: "Immigrate to Canada by starting a qualifying innovative business." },
  { id: 'caregiver', icon: Heart, title: "Caregiver Program", desc: "Empowering professional caregivers with dedicated PR pathways." },
  { id: 'express-entry', icon: FileText, title: "Express Entry", desc: "Fast-track PR for skilled workers across federal programs." },
  { id: 'family-sponsorship', icon: Home, title: "Family Sponsorship", desc: "Comprehensive support for reuniting with your family." },
  { id: 'refugee', icon: ShieldCheck, title: "Refugee & H&C", desc: "Compassionate support for Refugee Claimants and H&C applications." },
  { id: 'study-permit', icon: GraduationCap, title: "Study Permit & PGWP", desc: "End-to-end guidance from admissions to post-graduation work." },
  { id: 'visitor-visa', icon: Plane, title: "Visitor & Super Visas", desc: "Seamless visa applications for friends, family, and parents." },
  { id: 'spousal-permit', icon: Users, title: "Spousal Open Work Permit", desc: "Reunite with your spouse faster in Canada." }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-red font-bold tracking-widest uppercase text-sm mb-4 block">Our Expertise</span>
            <h2 className="heading-font text-4xl md:text-5xl font-bold text-brand-blue leading-[1.1]">
              Comprehensive Immigration Solutions
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service, idx) => (
            <Link to={`/services/${service.id}`} key={idx}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 group h-full cursor-pointer border border-transparent hover:border-brand-red/10"
              >
                <div className="w-14 h-14 bg-[#FAFAFA] rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-red group-hover:text-white text-brand-blue transition-colors duration-300">
                  <service.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-brand-blue mb-3 group-hover:text-brand-red transition-colors">{service.title}</h3>
                <p className="text-gray-600 line-clamp-2">{service.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
