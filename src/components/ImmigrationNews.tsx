import { Newspaper, ArrowRight } from 'lucide-react';

export default function ImmigrationNews() {
  const news = [
    {
      date: 'Oct 15, 2026',
      category: 'Express Entry',
      title: 'IRCC announces new category-based selection draws for STEM professionals.',
      desc: 'Canada continues to prioritize skilled workers in Science, Technology, Engineering, and Math. Read about the new comprehensive ranking system updates.'
    },
    {
      date: 'Oct 12, 2026',
      category: 'Study Permit',
      title: 'Updates to Post-Graduation Work Permit (PGWP) eligibility criteria.',
      desc: 'International students should be aware of the recent changes affecting PGWP duration and institutional requirements for 2027.'
    },
    {
      date: 'Oct 08, 2026',
      category: 'Provincial Nominee',
      title: 'Ontario Immigrant Nominee Program (OINP) opens new intake streams.',
      desc: 'The OINP has announced targeted draws for healthcare workers and skilled trades. Check your eligibility requirement today.'
    }
  ];

  return (
    <section id="news" className="py-24 bg-brand-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-red font-bold tracking-widest uppercase text-sm mb-4 block">Latest Updates</span>
            <h2 className="heading-font text-4xl md:text-5xl font-bold leading-[1.1]">
              Canadian Immigration News
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <div key={idx} className="group border-t border-white/20 pt-8 cursor-pointer">
              <div className="flex gap-4 mb-4 text-xs font-semibold tracking-widest uppercase opacity-70">
                <span>{item.date}</span>
                <span className="text-brand-red">{item.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-3">{item.desc}</p>
              <span className="inline-flex items-center text-sm font-medium text-white group-hover:text-brand-red transition-colors">
                Read Article <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
