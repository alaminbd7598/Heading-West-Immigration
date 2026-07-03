// Testimonials Component
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      program: "Express Entry to PR",
      quote: "Nur Mohammed and his team made my Express Entry process seamless. What seemed incredibly complex was handled with pure professionalism. Now I'm a Permanent Resident!",
      location: "Now in Toronto, ON"
    },
    {
      name: "Ahmed Rahman",
      program: "Study Permit & PGWP",
      quote: "The Dhaka office helped me secure my study permit when others said it was too difficult. They guided me through my education and PGWP. Highly recommended.",
      location: "Now in Vancouver, BC"
    },
    {
      name: "Maria Gonzalez",
      program: "Start-up Visa Program",
      quote: "Heading-West provided phenomenal business advisory services. Gazi Hayder's insight combined with their immigration expertise was the key to my successful Start-up visa.",
      location: "Now in Calgary, AB"
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 relative z-10">
          <span className="text-brand-red font-bold tracking-widest uppercase text-sm mb-4 block">Success Stories</span>
          <h2 className="heading-font text-4xl md:text-5xl font-bold text-brand-blue">
            Trusted by clients worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-[24px] shadow-sm relative">
              <Quote className="text-brand-red/10 absolute top-6 flex-shrink-0 w-16 h-16" />
              <div className="relative z-10">
                <p className="text-gray-700 italic mb-8 mt-4 leading-relaxed">"{t.quote}"</p>
                <div>
                  <h4 className="font-bold text-brand-blue text-lg">{t.name}</h4>
                  <p className="text-brand-red text-sm font-medium">{t.program}</p>
                  <p className="text-gray-400 text-xs mt-1">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
