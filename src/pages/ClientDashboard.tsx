import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle, Clock, FileText, Download } from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken, db } from '../lib/auth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export default function ClientDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribe = initAuth((authedUser) => {
      setUser(authedUser);
      setLoading(false);
      
      const q = query(
        collection(db, 'appointments'),
        where('email', '==', authedUser.email)
      );
      
      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const apts: any[] = [];
        snapshot.forEach(doc => apts.push(doc.data()));
        setAppointments(apts);
      }, (error) => {
        console.error("Error fetching appointments from Firestore", error);
        
        // Fallback mock history if firestore fails
        const stored = localStorage.getItem('clientAppointments');
        if (stored && authedUser.email) {
          const allAppointments = JSON.parse(stored);
          const myAppointments = allAppointments.filter((apt: any) => apt.email === authedUser.email);
          setAppointments(myAppointments);
        }
      });

    }, () => {
      setUser(null);
      setLoading(false);
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        // Page will refresh appointments in the auth listener
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleDownloadReceipt = (apt: any) => {
    // Generate dummy receipt or tell backend to generate a pdf
    const blob = new Blob([`Invoice for ${apt.serviceName}\nRef: ${apt.id}\nAmount: ${apt.currency}${apt.price}\nStatus: ${apt.status}`], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${apt.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
           <h2 className="text-2xl font-bold text-[#1a2942] mb-3">Client Portal</h2>
           <p className="text-gray-500 text-sm mb-8">Access your booking history, payments, and invoices seamlessly.</p>
           
           <button onClick={handleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors">
             <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
             Sign in with Google
           </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#f8f9fc] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-16 h-16 rounded-full shadow-sm" />
            <div>
              <h1 className="text-2xl font-bold text-[#1a2942]">Welcome back, {user.displayName || user.email?.split('@')[0]}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="px-5 py-2 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-red-100">
            Sign out
          </button>
        </div>

        {/* Application Status Summary Card */}
        <div className="bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-2xl p-6 md:p-8 shadow-md text-white mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-5 transform translate-x-1/4 -translate-y-1/4">
             <FileText size={240} />
          </div>
          <h2 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
            <CheckCircle size={22} className="text-brand-red" /> Current Application Status
          </h2>
          <div className="bg-white/10 rounded-xl p-5 relative z-10 backdrop-blur-sm border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-brand-red font-bold text-xs tracking-widest uppercase mb-1">Express Entry Profile</p>
              <h3 className="text-lg font-medium">Initial Assessment & Document Review</h3>
              <p className="text-white/80 text-sm mt-1.5 leading-relaxed max-w-xl">
                Your consultation has been completed. Our RCIC team is currently reviewing your uploaded documents to determine the optimal approach for your Express Entry profile setup.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end flex-shrink-0">
               <div className="bg-[#1a2942] px-4 py-2 rounded-lg border border-white/20">
                 <span className="text-sm font-medium text-gray-300 mr-2">Status:</span>
                 <span className="font-bold border-b border-yellow-400 text-yellow-400">In Progress</span>
               </div>
               <p className="text-xs text-white/50 mt-2">Last updated: Today</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#1a2942] mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-brand-red" /> My Booking History
        </h2>

        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
               <FileText size={40} className="mx-auto text-gray-300 mb-4" />
               <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
               <p className="text-gray-500 text-sm mt-1">When you book an appointment, it will appear here.</p>
            </div>
          ) : (
            appointments.map((apt, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between gap-6">
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                     <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                       apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                     }`}>
                       {apt.status}
                     </span>
                     <span className="text-xs text-gray-400 font-mono">{apt.id}</span>
                   </div>
                   <h3 className="font-bold text-[#1a2942] text-lg">{apt.serviceName}</h3>
                   <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                     <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                       <Calendar size={14} className="text-brand-blue" />
                       <span className="font-medium">{new Date(apt.date).toLocaleDateString()}</span>
                     </div>
                     <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                       <Clock size={14} className="text-brand-blue" />
                       <span className="font-medium">{apt.time}</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex flex-col items-end justify-between sm:border-l border-gray-100 sm:pl-6">
                   <div className="text-2xl font-bold text-gray-900 tracking-tight">
                     {apt.currency}{apt.price}
                   </div>
                   
                   {apt.status === 'Confirmed' ? (
                     <button onClick={() => handleDownloadReceipt(apt)} className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                       <Download size={16} /> Receipt
                     </button>
                   ) : (
                     <span className="mt-4 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Awaiting Confirmation</span>
                   )}
                 </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
