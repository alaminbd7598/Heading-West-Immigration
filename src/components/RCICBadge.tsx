import { ShieldCheck, ExternalLink } from 'lucide-react';

interface RCICBadgeProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export default function RCICBadge({ className = '', theme = 'light' }: RCICBadgeProps) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`inline-flex items-center gap-3 sm:gap-4 border p-2 sm:p-3 pr-3 sm:pr-4 rounded-2xl shadow-sm hover:shadow-md transition-all ${isDark ? 'bg-[#0A192F] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'} ${className}`}>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#FAFAFA] border-gray-100'}`}>
        <ShieldCheck className="text-brand-red w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      
      <div className="flex flex-col text-left">
        <span className={`font-bold text-xs sm:text-sm tracking-tight ${isDark ? 'text-white' : 'text-brand-blue'}`}>
          RCIC-IRB
        </span>
        <span className={`text-[10px] sm:text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Verification Status
        </span>
      </div>
      
      <div className={`w-px h-8 mx-1 sm:mx-2 hidden sm:block ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
      
      <a
        href="https://register.college-ic.ca/Public-Register-EN/RCIC_Search.aspx"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-red hover:bg-brand-red-dark text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-colors whitespace-nowrap"
      >
        Verify Status <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
      </a>
    </div>
  );
}
