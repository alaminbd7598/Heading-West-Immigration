import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight, Edit2, Download, CheckCircle, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  useEffect(() => {
    const stored = localStorage.getItem('clientAppointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  const handleEdit = (apt: any) => {
    setEditingId(apt.id);
    setEditForm({ firstName: apt.firstName, lastName: apt.lastName, email: apt.email, phone: apt.phone });
  };

  const handleSave = (id: string) => {
    const updated = appointments.map(apt => {
      if (apt.id === id) {
        return { ...apt, ...editForm };
      }
      return apt;
    });
    setAppointments(updated);
    localStorage.setItem('clientAppointments', JSON.stringify(updated));
    setEditingId(null);
  };

  const handleDownloadReceipt = (apt: any) => {
    const receiptContent = `
=========================================
  HEADING-WEST IMMIGRATION SERVICES INC.
=========================================
      OFFICIAL PAYMENT RECEIPT
=========================================

Receipt Number : ${apt.id}
Service        : ${apt.serviceName}
Amount Paid    : ${apt.currency}${Number(apt.price).toFixed(2)}
Payment Method : ${apt.paymentMethod === 'bkash' ? 'bKash Mobile Money' : 'Credit Card'}
Status         : ${apt.status}

CLIENT DETAILS:
Name  : ${apt.firstName} ${apt.lastName}
Email : ${apt.email}
Phone : ${apt.phone || 'N/A'}

APPOINTMENT DATE:
${new Date(apt.date).toDateString()} at ${apt.time}

Thank you for choosing Heading-West.
=========================================
    `;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${apt.id.replace('#', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-24 pb-20 min-h-[80vh] bg-[#f8f9fc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1a2942] heading-font mb-2">My Appointments</h1>
            <p className="text-gray-600">Track and manage your upcoming consultations</p>
          </div>
          <Link 
            to="/booking" 
            className="hidden md:inline-flex bg-brand-red hover:bg-[#b02217] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Book New
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1a2942] mb-2">No upcoming appointments</h3>
            <p className="text-gray-500 mb-6">You don't have any consultations scheduled yet.</p>
            <Link 
              to="/booking" 
              className="inline-flex bg-brand-blue hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Book Consultation
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                         <CheckCircle size={12} /> {apt.status || 'Confirmed'}
                       </span>
                       <span className="text-sm text-gray-500 font-medium">Ref: {apt.id}</span>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleDownloadReceipt(apt)} className="text-gray-500 hover:text-brand-blue p-2 bg-gray-50 rounded-lg transition-colors border border-gray-200" title="Download Receipt">
                         <Download size={16} />
                       </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1a2942] mb-4">{apt.serviceName}</h3>
                    
                    {editingId === apt.id ? (
                       <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">First Name</label>
                           <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} className="w-full text-sm border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-[#3b82f6]" />
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Last Name</label>
                           <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} className="w-full text-sm border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-[#3b82f6]" />
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
                           <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full text-sm border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-[#3b82f6]" />
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Phone</label>
                           <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full text-sm border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-[#3b82f6]" />
                         </div>
                         <div className="sm:col-span-2 flex gap-2 justify-end mt-2">
                           <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                             <X size={16} /> Cancel
                           </button>
                           <button onClick={() => handleSave(apt.id)} className="flex items-center gap-1 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                             <Save size={16} /> Save Changes
                           </button>
                         </div>
                       </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                           <Calendar size={16} className="text-gray-400 shrink-0" />
                           <span className="truncate">{new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock size={16} className="text-gray-400 shrink-0" />
                           <span className="truncate">{apt.time} (Asia/Dhaka)</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleEdit(apt)}>
                           <User size={16} className="text-gray-400 shrink-0" />
                           <span className="group-hover:text-brand-blue transition-colors truncate">{apt.firstName} {apt.lastName}</span>
                           <Edit2 size={12} className="text-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-2">
                           <MapPin size={16} className="text-gray-400 shrink-0" />
                           <span className="truncate">{apt.paymentMethod === 'bkash' ? 'bKash Payment' : 'Card Payment'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex md:flex-col gap-3 justify-end items-end md:w-48 shrink-0">
                     <p className="hidden md:block font-bold text-xl text-brand-blue mb-2">{apt.currency}{Number(apt.price).toFixed(2)}</p>
                     {apt.meetLink && (
                       <a href={apt.meetLink} target="_blank" rel="noreferrer" className="flex justify-center items-center gap-2 w-full bg-brand-blue hover:bg-blue-800 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm">
                         Join Meeting <ChevronRight size={16} />
                       </a>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
