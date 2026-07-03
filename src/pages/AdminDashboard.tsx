import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, DollarSign, Users, TrendingUp, TrendingDown, Clock, CheckCircle, Search, Bell, Menu, X, LayoutDashboard, FileText, Send, Check, XCircle, Download, Trash2, AlertTriangle, Home, Settings, MoreHorizontal, PieChart, Users2 } from 'lucide-react';
import { db } from '../lib/auth';
import { collection, onSnapshot, query, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const MOCK_DATA_TRENDS = [
  { name: 'Jun 01', bookings: 4, revenue: 480 },
  { name: 'Jun 02', bookings: 7, revenue: 840 },
  { name: 'Jun 03', bookings: 5, revenue: 600 },
  { name: 'Jun 04', bookings: 12, revenue: 1440 },
  { name: 'Jun 05', bookings: 8, revenue: 960 },
  { name: 'Jun 06', bookings: 15, revenue: 1800 },
  { name: 'Jun 07', bookings: 10, revenue: 1200 },
];

const MOCK_DATA_HOURS = [
  { hour: '09:00', bookings: 5 },
  { hour: '11:00', bookings: 12 },
  { hour: '13:00', bookings: 18 },
  { hour: '15:00', bookings: 25 },
  { hour: '17:00', bookings: 14 },
  { hour: '19:00', bookings: 8 },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'appointments', label: 'Appointments', icon: Clock },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'services', label: 'Services', icon: FileText },
  { id: 'staff', label: 'Staff Members', icon: Users2 },
  { id: 'discounts', label: 'Discounts', icon: DollarSign },
  { id: 'reports', label: 'Reports', icon: PieChart },
  { id: 'customize', label: 'Customize', icon: Settings },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [actionModal, setActionModal] = useState<{isOpen: boolean, type: 'accept' | 'invoice' | 'delete' | null, appointmentId: string | null}>({ isOpen: false, type: null, appointmentId: null });

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    if (isAuthenticated) {
       const q = query(collection(db, 'appointments'));
       unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const fetchedAppointments: any[] = [];
          snapshot.forEach(doc => fetchedAppointments.push(doc.data()));
          setAppointments(fetchedAppointments.reverse());
       }, (error) => {
          console.error("Firestore read failed in admin:", error);
          const stored = localStorage.getItem('clientAppointments');
          if (stored) {
            setAppointments(JSON.parse(stored).reverse());
          }
       });
    }

    return () => {
       if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin credentials');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    const updated = appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt);
    setAppointments(updated);
    
    // Fallback sync
    localStorage.setItem('clientAppointments', JSON.stringify(updated.slice().reverse()));
    setActionModal({ isOpen: false, type: null, appointmentId: null });

    try {
      await updateDoc(doc(db, 'appointments', id.replace('#HW', '')), { status: newStatus });
    } catch (err) {
      console.warn("Failed to update firestore status", err);
    }
  };

  const deleteAppointment = async (id: string) => {
    // Optimistic update
    const updated = appointments.filter(apt => apt.id !== id);
    setAppointments(updated);

    // Fallback sync
    localStorage.setItem('clientAppointments', JSON.stringify(updated.slice().reverse()));
    setActionModal({ isOpen: false, type: null, appointmentId: null });

    try {
      await deleteDoc(doc(db, 'appointments', id.replace('#HW', '')));
    } catch (err) {
      console.warn("Failed to delete from firestore", err);
    }
  };

  const confirmAction = async () => {
    if (!actionModal.appointmentId || !actionModal.type) return;
    
    if (actionModal.type === 'accept') {
      const apt = appointments.find(a => a.id === actionModal.appointmentId);
      updateStatus(actionModal.appointmentId, 'Confirmed');
      
      // Call backend to send the automated invoice and confirmation email
      if (apt) {
        try {
          const result = await fetch('/api/admin/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apt)
          });
          const data = await result.json();
          if (data.previewUrl) {
            console.log("Invoice Preview URL:", data.previewUrl);
          }
        } catch (e) {
          console.error("Failed to send email", e);
        }
      }
    } else if (actionModal.type === 'delete') {
      deleteAppointment(actionModal.appointmentId);
    } else if (actionModal.type === 'invoice') {
      const apt = appointments.find(a => a.id === actionModal.appointmentId);
      if (apt) alert(`Payment Invoice successfully sent to ${apt.email}`);
      setActionModal({ isOpen: false, type: null, appointmentId: null });
    }
  };

  const downloadCSV = () => {
    const headers = ['ID,Client First Name,Client Last Name,Email,Service,Price,Currency,Date,Time,Payment Method,Status'];
    const rows = appointments.map(apt => 
      `${apt.id},"${apt.firstName}","${apt.lastName}","${apt.email}","${apt.serviceName}",${apt.price},${apt.currency},${new Date(apt.date).toLocaleDateString()},${apt.time},${apt.paymentMethod},${apt.status}`
    );
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Booking_Report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f0f0f1] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded shadow-md border border-gray-200 max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-normal text-[#1d2327] mb-2">Admin Login</h2>
            <p className="text-[#3c434a] text-sm">BookingPress Admin Console</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (admin123)" className="w-full px-4 py-2 border border-[#8c8f94] rounded shadow-sm focus:ring-1 focus:ring-[#2271b1] focus:border-[#2271b1] outline-none text-[#2c3338] transition-all" />
            </div>
            <button type="submit" className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white py-2 px-4 rounded shadow-sm font-medium transition-colors">
              Log In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const SidebarItem = ({ icon: Icon, label, tab }: { icon: any, label: string, tab: string }) => (
    <button 
      onClick={() => setActiveTab(tab)} 
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
        activeTab === tab ? 'bg-[#0073aa] text-white' : 'text-[#f0f0f1] hover:text-[#00b9eb]'
      }`}
    >
      <Icon size={18} strokeWidth={activeTab === tab ? 2.5 : 2} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f0f0f1] flex flex-col font-sans">
      
      {/* Top Main WP Header (Black) */}
      <div className="h-8 bg-[#1d2327] flex items-center justify-between px-4 text-[#f0f0f1] text-[13px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 hover:text-[#00b9eb] cursor-pointer transition-colors"><Home size={14} /> My Sites</span>
          <span className="flex items-center gap-2 text-white"><LayoutDashboard size={14} /> BookingPress Plugin Demo</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">Howdy, admin <div className="w-5 h-5 bg-gray-400 rounded-full" /></span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 160, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#2c3338] shrink-0 flex flex-col z-20 py-2 pt-0"
            >
              <div className="bg-[#2271b1] text-white px-4 py-3 flex items-center gap-2 text-sm font-medium">
                 <Calendar size={18}/> BookingPress
              </div>
              <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
                {NAV_ITEMS.map(item => (
                  <SidebarItem key={item.id} icon={item.icon} label={item.label} tab={item.id} />
                ))}
              </div>
              <div className="p-4 mt-auto">
                <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-2 px-4 py-2 text-[#f0f0f1] hover:text-white transition-colors text-sm">
                  Sign Out
                </button>
                <button onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 text-[#f0f0f1] hover:text-[#00b9eb] transition-colors text-sm mt-2">
                  <X size={16} /> Collapse Menu
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Top Icon Nav Header */}
          <header className="bg-white border-b border-[#e2e4e7] flex items-center px-4 shrink-0 shadow-sm overflow-x-auto">
             {!isSidebarOpen && (
               <button onClick={() => setIsSidebarOpen(true)} className="mr-4 p-2 text-gray-500 hover:text-gray-900 border border-gray-200 rounded">
                 <Menu size={18} />
               </button>
             )}
             <div className="flex gap-1 py-2">
               {NAV_ITEMS.map(item => (
                 <button 
                  key={'top-'+item.id}
                  onClick={() => setActiveTab(item.id)} 
                  className={`flex flex-col items-center justify-center min-w-[90px] px-2 py-3 rounded-md transition-colors ${
                    activeTab === item.id ? 'text-[#1a2942] bg-[#f8f9fc]' : 'text-[#646970] hover:text-[#1a2942] hover:bg-gray-50'
                  }`}
                 >
                   {item.id === 'dashboard' ? (
                     <div className="w-10 h-10 rounded-xl bg-emerald-400 text-white flex items-center justify-center mb-1">
                       <item.icon size={20} />
                     </div>
                   ) : (
                     <item.icon size={20} className="mb-2" />
                   )}
                   <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>
                 </button>
               ))}
             </div>
          </header>

          {/* Scrollable Content View */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {activeTab === 'dashboard' ? (
              <div className="space-y-8 max-w-7xl">
                
                {/* Stats Row */}
                <div className="flex justify-between items-end mb-4">
                  <h1 className="text-[22px] font-medium text-[#1d2327]">Dashboard</h1>
                  <div className="bg-white border border-[#c3c4c7] px-4 py-1.5 rounded flex items-center gap-2 text-sm text-[#3c434a] shadow-sm">
                    <Calendar size={16} className="text-[#8c8f94]" />
                    June 1, 2026 - June 7, 2026
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  {[
                    { title: 'Total Appointments', value: appointments.length.toString(), color: 'text-[#1a2942]' },
                    { title: 'Approved Appointments', value: appointments.filter(a => a.status === 'Confirmed').length.toString(), color: 'text-emerald-500' },
                    { title: 'Pending Appointments', value: appointments.filter(a => a.status !== 'Confirmed').length.toString(), color: 'text-amber-500' },
                    { title: 'Revenue', value: '$' + appointments.reduce((sum, a) => sum + (a.status === 'Confirmed' ? a.price : 0), 0).toFixed(2), color: 'text-[#3b82f6]' },
                    { title: 'Customers', value: '45', color: 'text-pink-500' },
                    { title: 'Staff Members', value: '8', color: 'text-purple-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-lg p-5 border border-[#e2e4e7] shadow-sm text-center flex flex-col items-center justify-center min-h-[110px]">
                      <p className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
                      <h3 className="text-[#646970] text-sm">{stat.title}</h3>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div>
                   <h2 className="text-xl font-medium text-[#1d2327] mb-4">Technical Analysis</h2>
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     
                     <div className="bg-white rounded-lg p-6 border border-[#e2e4e7] shadow-sm flex flex-col">
                        <div className="flex items-center justify-center gap-6 mb-6">
                           <div className="flex items-center gap-2 text-sm text-[#3c434a]"><div className="w-6 h-3 bg-emerald-200 border border-emerald-400"></div> Approved Appointments</div>
                           <div className="flex items-center gap-2 text-sm text-[#3c434a]"><div className="w-6 h-3 bg-amber-200 border border-amber-400"></div> Pending Appointments</div>
                        </div>
                        <div className="h-[250px] flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOCK_DATA_TRENDS}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f1" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8c8f94', fontSize: 12}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#8c8f94', fontSize: 12}} dx={-10} domain={[-1.0, 1.0]} />
                              <RechartsTooltip />
                              <Line type="monotone" dataKey="bookings" stroke="#34d399" strokeWidth={2} dot={{r: 4, fill: '#34d399'}} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                     </div>

                     <div className="bg-white rounded-lg p-6 border border-[#e2e4e7] shadow-sm flex flex-col">
                        <div className="flex items-center justify-center gap-6 mb-6">
                           <div className="flex items-center gap-2 text-sm text-[#3c434a]"><div className="w-6 h-3 bg-emerald-200 border border-emerald-400"></div> Revenue</div>
                        </div>
                        <div className="h-[250px] flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOCK_DATA_TRENDS}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f1" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8c8f94', fontSize: 12}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#8c8f94', fontSize: 12}} dx={-10} domain={[-1.0, 1.0]} />
                              <RechartsTooltip />
                              <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} dot={{r: 4, fill: '#34d399'}} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                     </div>

                     <div className="bg-white rounded-lg p-6 border border-[#e2e4e7] shadow-sm flex flex-col">
                        <div className="flex items-center justify-center gap-6 mb-6">
                           <div className="flex items-center gap-2 text-sm text-[#3c434a]"><div className="w-6 h-3 bg-blue-200 border border-blue-400"></div> Customers</div>
                        </div>
                        <div className="h-[250px] flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOCK_DATA_TRENDS.map(d => ({ ...d, customers: Math.floor(d.bookings * 0.8) }))}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f1" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8c8f94', fontSize: 12}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#8c8f94', fontSize: 12}} dx={-10} domain={[-1.0, 1.0]} />
                              <RechartsTooltip />
                              <Line type="monotone" dataKey="customers" stroke="#60a5fa" strokeWidth={2} dot={{r: 4, fill: '#60a5fa'}} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                     </div>

                   </div>
                </div>

                <div>
                   <h2 className="text-xl font-medium text-[#1d2327] mb-4">Upcoming Appointments</h2>
                   {appointments.slice(0, 3).length === 0 ? (
                      <div className="bg-white rounded-lg p-12 border border-[#e2e4e7] shadow-sm text-center">
                        <p className="text-[#8c8f94]">No upcoming appointments.</p>
                      </div>
                   ) : (
                     <div className="bg-white rounded-lg border border-[#e2e4e7] shadow-sm overflow-hidden">
                       <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="bg-[#f8f9fc] border-b border-[#e2e4e7]">
                             <th className="px-6 py-3 text-sm font-medium text-[#3c434a]">Client</th>
                             <th className="px-6 py-3 text-sm font-medium text-[#3c434a]">Service</th>
                             <th className="px-6 py-3 text-sm font-medium text-[#3c434a]">Date & Time</th>
                             <th className="px-6 py-3 text-sm font-medium text-[#3c434a]">Status</th>
                           </tr>
                         </thead>
                         <tbody>
                           {appointments.slice(0, 3).map((apt, i) => (
                             <tr key={i} className="border-b border-[#f0f0f1] last:border-0 hover:bg-[#f6f7f7]">
                               <td className="px-6 py-4 text-sm font-medium text-[#2271b1]">{apt.firstName} {apt.lastName}</td>
                               <td className="px-6 py-4 text-sm text-[#3c434a]">{apt.serviceName}</td>
                               <td className="px-6 py-4 text-sm text-[#3c434a]">{new Date(apt.date).toLocaleDateString()} at {apt.time}</td>
                               <td className="px-6 py-4">
                                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {apt.status}
                                  </span>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   )}
                </div>

              </div>
            ) : activeTab === 'appointments' ? (
               <div className="bg-white rounded-lg border border-[#e2e4e7] shadow-sm overflow-hidden max-w-7xl">
                 <div className="p-4 border-b border-[#e2e4e7] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f8f9fc]">
                   <h2 className="text-xl font-medium text-[#1d2327]">Appointments</h2>
                   <div className="flex gap-2">
                     <button onClick={downloadCSV} className="flex items-center gap-2 bg-white border border-[#8c8f94] text-[#3c434a] hover:text-[#1d2327] hover:border-[#3c434a] px-3 py-1.5 rounded text-sm transition-colors shadow-sm">
                       <Download size={14} /> Export
                     </button>
                     <select 
                       className="bg-white border border-[#8c8f94] text-sm rounded px-3 py-1.5 focus:outline-none focus:border-[#2271b1]"
                       value={statusFilter}
                       onChange={(e) => setStatusFilter(e.target.value)}
                     >
                       <option value="All Status">All Status</option>
                       <option value="Pending Payment">Pending</option>
                       <option value="Confirmed">Confirmed</option>
                     </select>
                     <div className="relative">
                       <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c8f94]" size={14} />
                       <input 
                         type="text" 
                         placeholder="Search..." 
                         className="pl-8 pr-3 py-1.5 bg-white border border-[#8c8f94] text-sm rounded focus:outline-none focus:border-[#2271b1] w-48 shadow-sm"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                       />
                     </div>
                   </div>
                 </div>
                 
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-white text-sm text-[#3c434a] font-medium border-b border-[#e2e4e7]">
                         <th className="px-4 py-3"><input type="checkbox" className="rounded border-[#8c8f94]" /></th>
                         <th className="px-4 py-3">Client</th>
                         <th className="px-4 py-3">Service</th>
                         <th className="px-4 py-3">Date & Time</th>
                         <th className="px-4 py-3">Status</th>
                         <th className="px-4 py-3 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="text-sm">
                       {appointments
                         .filter(apt => statusFilter === 'All Status' || (statusFilter === 'Pending Payment' && apt.status?.includes('Pending')) || apt.status === statusFilter)
                         .filter(apt => {
                           const searchStr = searchQuery.toLowerCase();
                           return apt.firstName.toLowerCase().includes(searchStr) || 
                                  apt.lastName.toLowerCase().includes(searchStr) || 
                                  apt.serviceName.toLowerCase().includes(searchStr);
                         })
                         .map((apt, i) => (
                         <tr key={i} className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7] transition-colors">
                           <td className="px-4 py-3"><input type="checkbox" className="rounded border-[#8c8f94]" /></td>
                           <td className="px-4 py-3">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-[#f0f0f1] text-[#646970] flex items-center justify-center font-bold text-xs uppercase border border-[#c3c4c7]">
                                 {apt.firstName.charAt(0)}{apt.lastName.charAt(0)}
                               </div>
                               <div>
                                 <p className="font-medium text-[#2271b1]">{apt.firstName} {apt.lastName}</p>
                                 <p className="text-[11px] text-[#646970]">{apt.email}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-4 py-3">
                             <p className="font-medium text-[#3c434a] line-clamp-1">{apt.serviceName}</p>
                             <p className="text-[11px] text-[#646970] mt-0.5">{apt.currency}{apt.price} • Ref: {apt.id}</p>
                           </td>
                           <td className="px-4 py-3">
                             <p className="font-medium text-[#3c434a]">{new Date(apt.date).toLocaleDateString()}</p>
                             <p className="text-[11px] text-[#646970] mt-0.5">{apt.time}</p>
                           </td>
                           <td className="px-4 py-3">
                             <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded textxs font-medium
                               ${apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                                 apt.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                               {apt.status === 'Confirmed' && <Check size={12} />}
                               {apt.status === 'Rejected' && <XCircle size={12} />}
                               {apt.status}
                             </span>
                           </td>
                           <td className="px-4 py-3 text-right space-x-1">
                             {apt.status !== 'Confirmed' && (
                               <button onClick={() => setActionModal({ isOpen: true, type: 'accept', appointmentId: apt.id })} title="Approve Booking" className="text-[#2271b1] hover:text-[#135e96] p-1">
                                 <CheckCircle size={16} />
                               </button>
                             )}
                             <button onClick={() => setActionModal({ isOpen: true, type: 'invoice', appointmentId: apt.id })} title="Send Invoice" className="text-[#646970] hover:text-[#1a2942] p-1">
                               <Send size={16} />
                             </button>
                             <button onClick={() => setActionModal({ isOpen: true, type: 'delete', appointmentId: apt.id })} title="Delete" className="text-[#d63638] hover:text-red-800 p-1">
                               <Trash2 size={16} />
                             </button>
                           </td>
                         </tr>
                       ))}
                       {appointments.length === 0 && (
                         <tr>
                           <td colSpan={6} className="px-4 py-12 text-center text-[#646970]">
                             No bookings found.
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
            ) : (
                <div className="bg-white rounded-lg p-12 border border-[#e2e4e7] shadow-sm text-center max-w-7xl flex flex-col items-center justify-center min-h-[400px]">
                  <PieChart size={48} className="text-[#c3c4c7] mb-4" />
                  <h2 className="text-xl font-medium text-[#1d2327] mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
                  <p className="text-[#646970] text-sm max-w-md">This view is currently under construction. Full BookingPress integration features will appear here shortly.</p>
                </div>
            )}

          </div>
        </main>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {actionModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded shadow-xl border border-gray-200 max-w-sm w-full overflow-hidden"
            >
              <div className="p-6">
                 <h3 className="text-lg font-medium text-[#1d2327] mb-2">
                   {actionModal.type === 'delete' ? 'Delete Request?' : actionModal.type === 'accept' ? 'Approve Booking?' : 'Send Invoice?'}
                 </h3>
                 <p className="text-[13px] text-[#646970] mb-6 line-height-tight">
                   {actionModal.type === 'delete' ? 'Are you sure you want to permanently delete this booking request? This action cannot be undone.' : 
                    actionModal.type === 'accept' ? 'This will mark the booking as approved and send a confirmation email.' : 
                    'This will email an official invoice for the outstanding balance to the client.'}
                 </p>
                 <div className="flex justify-end gap-2">
                   <button onClick={() => setActionModal({ isOpen: false, type: null, appointmentId: null })} className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded text-[13px] hover:bg-gray-50 transition-colors">
                     Cancel
                   </button>
                   <button onClick={confirmAction} className={`px-3 py-1.5 rounded text-[13px] text-white transition-colors ${actionModal.type === 'delete' ? 'bg-[#d63638] hover:bg-red-700' : 'bg-[#2271b1] hover:bg-[#135e96]'}`}>
                     Confirm
                   </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

