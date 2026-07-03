import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: "Do I need a job offer to immigrate to Canada?",
    answer: "Not necessarily. Many economic immigration programs, such as the Federal Skilled Worker Program under Express Entry, operate on a points-based system that does not strictly require a job offer, provided you score highly enough in other areas."
  },
  {
    question: "How long does the Express Entry process take?",
    answer: "Once you receive an Invitation to Apply (ITA) and submit your complete application, Immigration, Refugees and Citizenship Canada (IRCC) typically aims to process 80% of applications within 6 months. However, the time it takes to enter the pool and receive an ITA varies."
  },
  {
    question: "Can I include my family in my immigration application?",
    answer: "Yes, you can typically include your spouse or common-law partner, and dependent children in your application. Their credentials might even add to your overall Comprehensive Ranking System (CRS) score in Express Entry."
  },
  {
    question: "What is the difference between a work permit and permanent residency?",
    answer: "A work permit grants you temporary resident status with authorization to work for a specific period. Permanent residency allows you to live, work, and study in Canada indefinitely, bringing you a step closer to Canadian citizenship."
  },
  {
    question: "Why should I hire an RCIC for my application?",
    answer: "An RCIC (Regulated Canadian Immigration Consultant) is legally authorized to represent you before the IRCC. They provide expert guidance, avoid common application errors, offer tailored pathways, and handle complex legal communications to maximize your chances of success."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-brand-blue font-bold text-sm tracking-widest uppercase mb-4">
            <HelpCircle size={16} className="text-brand-red" />
            Clear Up the Confusion
          </div>
          <h2 className="heading-font text-3xl md:text-5xl font-bold text-brand-blue mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-lg">Common questions regarding Canadian immigration pathways and our consulting services.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${openIndex === idx ? 'border-brand-red/30 bg-[#f8f9fc]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <h3 className="font-bold text-[#1a2942] text-lg pr-8">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${openIndex === idx ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
