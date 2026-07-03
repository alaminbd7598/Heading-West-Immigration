import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function BookingSystem() {
  return (
    <section id="booking" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1a2942] rounded-[32px] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue-light opacity-20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="heading-font text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Start Your Canadian Journey?
            </h2>
            <p className="text-gray-300 mb-10 text-lg leading-relaxed">
              Book a personalized consultation with our RCIC-IRB licensed experts to discuss your immigration pathways in detail. Choose your preferred time and payment method seamlessly.
            </p>
            <Link 
              to="/booking" 
              className="inline-flex items-center gap-3 bg-brand-red hover:bg-brand-red-dark text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Book an Appointment <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
