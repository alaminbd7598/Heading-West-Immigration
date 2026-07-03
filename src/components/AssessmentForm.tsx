import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

type FormData = {
  age: string;
  education: string;
  ielts: string;
  experience: string;
};

export default function AssessmentForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    age: '',
    education: '',
    ielts: '',
    experience: ''
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate calculation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
    }, 1500);
  };

  const handleOptionSelect = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="assessment" className="py-24 bg-brand-blue text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #d52b1e 25%, transparent 25%, transparent 75%, #d52b1e 75%, #d52b1e), linear-gradient(45deg, #d52b1e 25%, transparent 25%, transparent 75%, #d52b1e 75%, #d52b1e)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-brand-red font-bold text-xs uppercase tracking-widest mb-4 border border-white/20">Free Eligibility Tool</span>
          <h2 className="heading-font text-4xl md:text-5xl font-bold mb-4">Smart Assessment</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">Check your eligibility for Canadian Immigration programs in less than 2 minutes.</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 md:p-12 text-brand-blue shadow-2xl relative">
          
          {/* Progress Bar */}
          {!isComplete && (
            <div className="mb-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {step} of 4</span>
                <span className="text-xs font-medium text-brand-red">{4 - step} steps remaining</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-brand-red' : 'bg-gray-100'}`}></div>
                ))}
              </div>
            </div>
          )}

          <div className="min-h-[300px]">
             <AnimatePresence mode="wait">
                {isComplete ? (
                   <motion.div 
                    key="complete"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-center py-10"
                   >
                     <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full mb-6 text-green-500 relative">
                       <motion.div
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                       >
                         <CheckCircle2 size={48} strokeWidth={2.5} />
                       </motion.div>
                     </div>
                     <h3 className="text-3xl font-bold mb-4">Great news!</h3>
                     <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">Based on your preliminary answers, you have strong potential for several Canadian immigration pathways including Express Entry.</p>
                     
                     <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                       <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue mb-2">Next Steps</p>
                       <p className="text-gray-600 mb-4">Book a consultation with our RCIC to get a detailed comprehensive report and tailored action plan.</p>
                       <a href="#booking" className="inline-block bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3 rounded-full font-medium transition-colors">
                         Book Consultation Now
                       </a>
                     </div>
                     <button onClick={() => { setIsComplete(false); setStep(1); setFormData({age:'', education:'', ielts:'', experience:''}); }} className="text-sm font-medium text-gray-400 hover:text-brand-blue transition-colors">
                       Start Over
                     </button>
                   </motion.div>
                ) : (
                  <motion.div
                    key={`step-${step}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 1 && (
                      <StepLayout 
                        title="What is your age range?"
                        options={['18-24', '25-29', '30-34', '35-39', '40+']}
                        value={formData.age}
                        onSelect={(v) => handleOptionSelect('age', v)}
                      />
                    )}
                    {step === 2 && (
                      <StepLayout 
                        title="Highest Level of Education?"
                        options={['High School', 'Diploma/Certificate (1-2 yrs)', 'Bachelor\'s Degree', 'Master\'s / Professional', 'Ph.D.']}
                        value={formData.education}
                        onSelect={(v) => handleOptionSelect('education', v)}
                      />
                    )}
                    {step === 3 && (
                      <StepLayout 
                        title="English Proficiency (IELTS/CELPIP equivalent)?"
                        options={['CLB 9 or higher (Excellent)', 'CLB 7-8 (Good)', 'CLB 5-6 (Basic)', 'Not tested yet']}
                        value={formData.ielts}
                        onSelect={(v) => handleOptionSelect('ielts', v)}
                      />
                    )}
                    {step === 4 && (
                      <StepLayout 
                        title="Years of Skilled Work Experience?"
                        options={['Less than 1 year', '1-2 years', '3-5 years', '6+ years']}
                        value={formData.experience}
                        onSelect={(v) => handleOptionSelect('experience', v)}
                      />
                    )}
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Navigation */}
          {!isComplete && (
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-100">
              <button 
                onClick={handlePrev}
                disabled={step === 1 || isSubmitting}
                className={`flex items-center font-medium ${step === 1 ? 'text-gray-300' : 'text-gray-600 hover:text-brand-blue'}`}
              >
                <ChevronLeft size={20} className="mr-1" /> Back
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={handleNext}
                  disabled={!formData[Object.keys(formData)[step-1] as keyof FormData]}
                  className="flex items-center bg-brand-blue hover:bg-brand-blue-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-full font-medium transition-colors"
                >
                  Continue <ChevronRight size={20} className="ml-1" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={!formData.experience || isSubmitting}
                  className="flex items-center bg-brand-red hover:bg-brand-red-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-full font-medium transition-colors"
                >
                  {isSubmitting ? 'Analyzing...' : 'View Results'}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

function StepLayout({ title, options, value, onSelect }: { title: string, options: string[], value: string, onSelect: (v: string) => void }) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-8">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`text-left p-5 rounded-2xl border-2 transition-all font-medium ${
              value === opt 
                ? 'border-brand-red bg-red-50 text-brand-blue' 
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
