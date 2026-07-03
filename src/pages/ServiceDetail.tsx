import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, ShieldCheck, Mail, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

// Example services data
const servicesData: Record<string, any> = {
  pnp: {
    title: 'Provincial Nominee Program (PNP)',
    category: 'Permanent Residency',
    desc: 'Each Canadian province and territory has its own unique Provincial Nominee Program (PNP) designed to attract skilled workers, business people, and students. We help you navigate the specific requirements of the province that best suits your profile.',
    features: ['Customized assessment based on provincial demands', 'Guidance on Expression of Interest (EOI) submission', 'Full support for provincial nomination application', 'Federal permanent residence application post-nomination'],
    processing: '6 to 18 months',
    success: 'Very High (Targeted skills)'
  },
  'express-entry': {
    title: 'Express Entry',
    category: 'Permanent Residency',
    desc: 'Canada\'s flagship immigration system for skilled workers. It manages applications for the Federal Skilled Worker Program, Federal Skilled Trades Program, and Canadian Experience Class.',
    features: ['CRS score optimization', 'Profile creation and management', 'Document preparation for ITA', 'Comprehensive representation'],
    processing: '6 months',
    success: 'High (Score dependent)'
  },
  'study-permit': {
    title: 'Study Permit',
    category: 'Temporary Residence',
    desc: 'Turn your Canadian education dreams into reality. We assist with choosing the right institution, securing your Letter of Acceptance, and filing a rock-solid Study Permit application.',
    features: ['Institution selection assistance', 'Letter of Explanation (LoE) drafting', 'Financial documentation review', 'PGWP pathway planning'],
    processing: '1 to 3 months',
    success: 'High'
  },
  caregiver: {
    title: 'Caregiver Programs',
    category: 'Permanent Residency',
    desc: 'Canada values the work of caregivers. The Home Child Care Provider Pilot and Home Support Worker Pilot offer a direct pathway to permanent residence for eligible caregivers.',
    features: ['Eligibility assessment for pilot programs', 'Assistance with securing a valid job offer', 'Work permit and PR application support', 'Family sponsorship guidance'],
    processing: '12 to 24 months',
    success: 'High'
  },
  startup: {
    title: 'Start-up Visa Program',
    category: 'Business Immigration',
    desc: 'For innovative entrepreneurs who want to build a business in Canada. We help you secure support from designated organizations and navigate the PR process.',
    features: ['Business plan review', 'Connecting with designated organizations', 'Letter of Support acquisition', 'Permanent residence application'],
    processing: '12 to 16 months',
    success: 'Moderate (Requires high investment/innovation)'
  },
  'family-sponsorship': {
    title: 'Family Sponsorship',
    category: 'Permanent Residency',
    desc: 'Reunite with your loved ones in Canada. We assist Canadian citizens and permanent residents in sponsoring their spouses, partners, dependent children, parents, and grandparents.',
    features: ['Spousal sponsorship (Inland and Outland)', 'Parent and Grandparent Program (PGP)', 'Super Visa applications', 'Proving relationship genuineness'],
    processing: '12 months',
    success: 'Very High'
  }
};

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  
  if (!id || !servicesData[id]) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-brand-blue mb-4">Service Not Found</h2>
        <p className="text-gray-600 mb-8">We couldn't find the details for this service.</p>
        <Link to="/" className="text-brand-red font-medium hover:underline inline-flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </div>
    );
  }

  const service = servicesData[id];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-24 pb-24">
      {/* Hero Section for Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-red font-medium hover:text-brand-red-dark transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to all services
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-blue/5 text-brand-blue font-semibold text-sm tracking-wide uppercase mb-6">
                {service.category}
              </div>
              <h1 className="heading-font text-4xl md:text-5xl font-bold text-brand-blue mb-6 leading-tight">
                {service.title}
              </h1>
              
              <div className="prose prose-lg text-gray-600 mb-10">
                <p>{service.desc}</p>
                <p>Heading-West Immigration Services is highly experienced in guiding applicants through the intricate requirements of the {service.title}. With recent changes in legislation and quota distributions, having an authorized RCIC-IRB represent you significantly reduces the risk of refusal.</p>
              </div>

              <h3 className="text-2xl font-bold text-brand-blue mb-6">What We Provide</h3>
              <ul className="space-y-4 mb-10">
                {service.features.map((feat: string, i: number) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 flex-shrink-0 text-brand-red bg-red-50 p-1 rounded-full">
                      <CheckCircle size={18} />
                    </div>
                    <span className="text-gray-700 text-lg">{feat}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-brand-blue rounded-3xl p-8 text-white shadow-xl"
            >
              <h4 className="text-xl font-bold mb-6 font-heading">Program Quick Facts</h4>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Clock className="text-brand-red opacity-80" size={24} />
                  <div>
                    <div className="text-sm text-indigo-200 font-medium mb-1">Estimated Processing</div>
                    <div className="font-semibold">{service.processing}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <ShieldCheck className="text-brand-red opacity-80" size={24} />
                  <div>
                    <div className="text-sm text-indigo-200 font-medium mb-1">Success Rate</div>
                    <div className="font-semibold">{service.success}</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-sm text-indigo-100 mb-6 font-medium">Ready to start your {service.title} application?</p>
                <Link to="/booking" className="block text-center bg-brand-red hover:bg-[#b02217] text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                  Book a Consultation
                </Link>
              </div>
            </motion.div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue flex-shrink-0">
                 <Mail size={28} />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900 mb-1">Have questions?</h4>
                 <a href="mailto:info@heading-west.com" className="text-brand-red font-medium hover:underline text-sm">info@heading-west.com</a>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
