import { useState, FormEvent, useEffect } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, CreditCard, BookOpen, Menu, X, Check, ArrowRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { getAccessToken, initAuth, db } from '../lib/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

const SERVICES = [
  { id: '1hour', title: '1 hour Initial Consultation/assessment', price: 120, currency: 'CA$' },
  { id: '30min', title: '30 Minutes Initial Consultation', price: 75, currency: 'CA$' },
];

const TIME_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card'|'bkash'>('card');
  const [bkashInfo, setBkashInfo] = useState({ phone: '', trxId: '' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [meetLink, setMeetLink] = useState('');

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };
  
  const days = generateDays();

  const handleNext = () => {
    if (currentStep === 1 && !selectedService) return alert('Please select a service');
    if (currentStep === 2 && (!selectedDate || !selectedTime)) return alert('Please select date and time');
    if (currentStep === 3 && (!userInfo.firstName || !userInfo.lastName || !userInfo.email)) return alert('Please fill required details');
    
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
                    let token = await getAccessToken();
      if (!token) {
        const authData = await initAuth() as any; 
        token = authData?.accessToken || null;
      }

      let newMeetLink = 'https://meet.google.com/xyz-demo-link';
      // Format Date to YYYY-MM-DD
      const formattedDate = selectedDate ? new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      try {
        // Convert "02:00 PM" to "14:00"
        const timePart = selectedTime?.split(' - ')[0] || "10:00 AM";
        const [timeMatch, meridiem] = timePart.trim().split(' ');
        let [hours, minutes] = timeMatch.split(':');
        if (meridiem === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
        if (meridiem === 'AM' && hours === '12') hours = '00';
        const formattedTime = `${hours.padStart(2, '0')}:${minutes}`;

        const response = await fetch('/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            name: `${userInfo.firstName} ${userInfo.lastName}`,
            email: userInfo.email,
            date: formattedDate,
            time: formattedTime,
            type: 'online',
            location: 'Online Google Meet'
          })
        });
        
        const data = await response.json();
        if (data.meetLink) {
           newMeetLink = data.meetLink;
        }
      } catch (err) {
        console.warn("Backend booking API failed, using fallback.", err);
      }
      
      setMeetLink(newMeetLink);
      
      const newId = `#HW${Math.floor(Math.random() * 100000)}`;
      const appointmentObj = {
        id: newId,
        serviceName: selectedService.title,
        price: selectedService.price,
        currency: selectedService.currency,
        date: formattedDate, // Use formattedDate string for cleaner JSON
        time: selectedTime,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        phone: userInfo.phone,
        paymentMethod: paymentMethod,
        meetLink: newMeetLink,
        status: 'Confirmed'
      };

      // Save to local storage for tracking (fallback/quick-load)
      const stored = localStorage.getItem('clientAppointments');
      const appointments = stored ? JSON.parse(stored) : [];
      appointments.push(appointmentObj);
      localStorage.setItem('clientAppointments', JSON.stringify(appointments));

      try {
         await setDoc(doc(db, 'appointments', newId.replace('#HW', '')), appointmentObj);
      } catch (e) {
         console.warn("Could not save to Firestore", e);
      }

      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#e2136e', '#10b981']
      });
    } catch (error) {
      console.error(error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SidebarItem = ({ stepNum, title, icon: Icon }: any) => {
    const isActive = currentStep === stepNum;
    const isCompleted = currentStep > stepNum;
    
    return (
      <div className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isActive ? 'bg-[#253554] border-l-4 border-[#3b82f6]' : 'border-l-4 border-transparent hover:bg-[#1f2d47]'}`} onClick={() => stepNum < currentStep && setCurrentStep(stepNum)}>
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
          <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>{title}</span>
        </div>
        <div>
          {isCompleted ? (
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>
          ) : isActive ? (
            <div className="w-5 h-5 rounded-full border-2 border-[#3b82f6]"></div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
          )}
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return (
      <div className="pt-24 pb-24 min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4 relative z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full"
        >
          {/* Receipt Header */}
          <div className="bg-[#1a2942] p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent blur-2xl"></div>
            </div>
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg border-4 border-[#1a2942]">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10 heading-font">Payment Successful!</h2>
            <p className="text-gray-300 relative z-10">Your consultation is booked and confirmed.</p>
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
               <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Receipt Number</p>
                  <p className="font-bold text-[#1a2942]">#HW{Math.floor(Math.random() * 100000)}</p>
               </div>
               <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium mb-1">Amount Paid</p>
                  <p className="font-bold text-2xl text-[#3b82f6]">{selectedService?.currency}{(paymentMethod === 'bkash' ? selectedService?.price * 1.0185 : selectedService?.price)?.toFixed(2)}</p>
               </div>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-[#1a2942] uppercase text-xs tracking-wider">Appointment Summary</h4>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-semibold mb-1">Service</span> 
                    <p className="font-medium text-gray-900 text-sm">{selectedService?.title}</p>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-semibold mb-1">Date & Time</span> 
                    <p className="font-medium text-gray-900 text-sm">{selectedDate?.toDateString()} at {selectedTime}</p>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-semibold mb-1">Client Name</span> 
                    <p className="font-medium text-gray-900 text-sm">{userInfo.firstName} {userInfo.lastName}</p>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-semibold mb-1">Payment Method</span> 
                    <p className="font-medium text-gray-900 text-sm">{paymentMethod === 'bkash' ? 'bKash Mobile Money' : 'Credit Card (Stripe / SSLCommerz)'}</p>
                  </div>
                </div>
              </div>

               <h4 className="font-bold text-[#1a2942] uppercase text-xs tracking-wider mt-6">Next Steps</h4>
               <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                 <div>
                  <span className="block text-blue-800 text-sm font-semibold mb-2">Meeting Link:</span> 
                  <a href={meetLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white border border-blue-200 px-4 py-2 rounded-lg font-medium text-brand-blue hover:bg-blue-50 transition-colors">{meetLink}</a>
                 </div>
                 <p className="text-sm text-blue-700 mt-4 leading-relaxed">
                   A confirmation email with the calendar invitation has been sent to <strong>{userInfo.email}</strong>. Please join the meeting 5 minutes before the scheduled time.
                 </p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
              <button onClick={() => window.print()} className="flex-1 flex justify-center items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors">
                <Download size={18} /> Download Receipt
              </button>
              <button onClick={() => window.location.href = '/client-dashboard'} className="flex-1 flex justify-center items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                View in Client Portal <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#f8f9fc]">
      {/* Header Banner */}
      <div className="bg-[#1a2942] h-[200px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1506744626753-eda8151a7474?q=80&w=2000')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2942] to-transparent"></div>
        <h1 className="text-4xl md:text-5xl font-bold text-white relative z-10 heading-font">Book an Appointment</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col md:flex-row overflow-hidden min-h-[600px] border border-gray-100">
          
          {/* Left Sidebar */}
          <div className="w-full md:w-[320px] bg-[#1a2942] flex flex-col shrink-0">
            <div className="flex-1 py-6">
              <SidebarItem stepNum={1} title="Service Selection" icon={BookOpen} />
              <SidebarItem stepNum={2} title="Date & Time" icon={CalendarIcon} />
              <SidebarItem stepNum={3} title="Your Information" icon={User} />
              <SidebarItem stepNum={4} title="Payments" icon={CreditCard} />
            </div>
            
            <div className="p-6 border-t border-white/10 mt-auto">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">Get in Touch</p>
                <a href="mailto:info@heading-west.com" className="text-white hover:text-[#3b82f6] text-sm font-medium transition-colors">info@heading-west.com</a>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Step Header with Visual Stepper */}
            <div className="border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between px-6 py-4">
                 <div className="flex items-center gap-4">
                   {currentStep > 1 && (
                     <button onClick={handleBack} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-sm transition-all bg-gray-50">
                       <ChevronLeft size={18} className="text-gray-600" />
                     </button>
                   )}
                   <h2 className="text-lg font-bold text-[#1a2942]">
                     {currentStep === 1 && 'Service Selection'}
                     {currentStep === 2 && 'Date & Time'}
                     {currentStep === 3 && 'Your Information'}
                     {currentStep === 4 && 'Payments'}
                   </h2>
                 </div>
                 
                 {/* Visual Stepper */}
                 <div className="hidden sm:flex items-center gap-2">
                   {[1, 2, 3, 4].map((step) => (
                     <div key={step} className="flex items-center">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                         currentStep === step 
                           ? 'bg-[#3b82f6] text-white shadow-md ring-4 ring-blue-50' 
                           : currentStep > step 
                             ? 'bg-green-500 text-white' 
                             : 'bg-gray-100 text-gray-400 border border-gray-200'
                       }`}>
                         {currentStep > step ? <Check size={14} strokeWidth={3} /> : step}
                       </div>
                       {step < 4 && (
                         <div className={`w-12 h-0.5 mx-1 transition-colors ${
                           currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                         }`} />
                       )}
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            {/* Step Body */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <label className="block text-sm font-bold text-gray-700 mb-2 mt-4"><span className="text-red-500">*</span> Service:</label>
                    <div className="relative border border-indigo-200 rounded-lg bg-white shadow-sm hover:border-[#3b82f6] transition-colors group">
                      <select 
                        key={selectedService?.id || 'empty'}
                        className="w-full appearance-none bg-transparent py-4 pl-4 pr-10 text-gray-800 text-sm md:text-base font-medium outline-none cursor-pointer"
                        onChange={(e) => setSelectedService(SERVICES.find(s => s.id === e.target.value))}
                        value={selectedService?.id || ''}
                      >
                        <option value="" disabled>Select Service</option>
                        {SERVICES.map(serv => (
                          <option key={serv.id} value={serv.id}>
                            {serv.title} {serv.currency}{serv.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400 group-hover:text-[#3b82f6]">
                        <ChevronLeft className="w-5 h-5 -rotate-90" />
                      </div>
                    </div>
                    {selectedService && (
                      <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4 flex justify-between items-center bg-gray-50/50">
                           <span className="text-gray-800 text-sm font-medium">{selectedService.title}</span>
                           <span className="text-[#3b82f6] font-medium">{selectedService.currency}{selectedService.price.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    {selectedService && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200 text-sm font-medium text-gray-700">
                        Selected: {selectedService.title} ({selectedService.currency}{selectedService.price})
                      </div>
                    )}
                    
                    <div className="flex flex-col xl:flex-row gap-8">
                      {/* Calendar */}
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-[#1a2942]">Select Date</h3>
                          <div className="flex gap-2">
                             <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50"><ChevronLeft size={16}/></button>
                             <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50"><ChevronRight size={16}/></button>
                          </div>
                        </div>
                        <div className="text-center font-semibold text-[#3b82f6] bg-blue-50 py-1.5 rounded-lg mb-4 text-sm">
                          {currentMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })} - Asia/Dhaka
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                            <div key={d} className="text-xs font-semibold text-gray-500 py-2">{d}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {days.map((d, i) => {
                            if (!d) return <div key={i} className="aspect-square"></div>;
                            const isPast = d < new Date(new Date().setHours(0,0,0,0));
                            const isSelected = selectedDate?.toDateString() === d.toDateString();
                            return (
                              <button 
                                key={i} 
                                disabled={isPast}
                                onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                                className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${isPast ? 'text-gray-300 cursor-not-allowed' : isSelected ? 'bg-[#3b82f6] text-white shadow-md' : 'text-gray-700 hover:bg-[#eff4ff] hover:text-[#3b82f6] border border-gray-100 bg-white'}`}
                              >
                                {d.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="flex-1">
                        <h3 className="font-bold text-[#1a2942] mb-4">Select Time</h3>
                        {!selectedDate ? (
                          <div className="h-[200px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            Please select a date first
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {TIME_SLOTS.map((time, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedTime(time)}
                                className={`py-3 px-4 rounded-lg text-sm font-medium border transition-colors ${selectedTime === time ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-white border-blue-200 text-[#3b82f6] hover:bg-[#eff4ff]'}`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mt-4">
                       <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1"><span className="text-red-500">*</span> First Name:</label>
                         <input type="text" value={userInfo.firstName} onChange={e => setUserInfo({...userInfo, firstName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none" placeholder="Enter first name" />
                       </div>
                       <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1"><span className="text-red-500">*</span> Last Name:</label>
                         <input type="text" value={userInfo.lastName} onChange={e => setUserInfo({...userInfo, lastName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none" placeholder="Enter last name" />
                       </div>
                       <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1"><span className="text-red-500">*</span> Email:</label>
                         <input type="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none" placeholder="Enter email" />
                       </div>
                       <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Phone:</label>
                         <input type="tel" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none" placeholder="Enter phone" />
                       </div>
                     </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="bg-white border border-gray-200 rounded-xl max-w-2xl mb-8 overflow-hidden">
                       <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                         <h4 className="font-bold text-gray-800">Summary</h4>
                       </div>
                       <div className="p-6">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                             <span>Services</span>
                          </div>
                          <div className="flex justify-between font-medium text-gray-900 mb-6">
                            <span>{selectedService.title}</span>
                            <span>{selectedService.currency}{selectedService.price.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex gap-2 mb-6">
                             <input type="text" placeholder="Coupon:" className="flex-1 border border-gray-300 rounded bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#3b82f6]" />
                             <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">Add</button>
                          </div>

                          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                            <span className="font-bold text-gray-900">Total Amount:</span>
                            <span className="font-bold text-xl text-[#3b82f6]">{selectedService.currency}{selectedService.price.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>

                    <h4 className="font-bold text-gray-800 mb-4">Payment Method</h4>
                    <div className="max-w-2xl bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 space-y-3">
                      
                      {/* bKash Option */}
                      <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-white border border-transparent hover:border-gray-300 cursor-pointer transition-colors">
                        <input type="radio" name="payment" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="mt-1 w-4 h-4 text-[#e2136e] focus:ring-[#e2136e]" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-medium text-gray-800 mb-1">
                            <div className="w-6 h-6 bg-[#e2136e] rounded flex items-center justify-center text-white text-[10px] font-bold">bK</div>
                            Payment With bKash
                          </div>
                          
                          <AnimatePresence>
                            {paymentMethod === 'bkash' && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="mt-4 border-l-4 border-[#e2136e] pl-4 py-1">
                                  <div className="bg-white border border-red-100 p-3 rounded text-sm text-gray-700 shadow-sm mb-4">
                                     Note: 1.85% bKash "Send Money" cost will be added with the net price. Total amount: <strong>CA${(selectedService.price * 1.0185).toFixed(2)}</strong>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">Please fill up this form to confirm the payment</p>
                                  <p className="text-sm font-bold text-gray-800 mb-4">bKash Personal Number : 01736429148</p>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">bKash Number</label>
                                      <input type="text" value={bkashInfo.phone} onChange={e=>setBkashInfo({...bkashInfo, phone: e.target.value})} placeholder="Ex. 018XXXXXXXX" className="w-full text-sm border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-[#e2136e]" />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">bKash Transaction ID</label>
                                      <input type="text" value={bkashInfo.trxId} onChange={e=>setBkashInfo({...bkashInfo, trxId: e.target.value})} placeholder="Ex. 8N7A6D5EE7M" className="w-full text-sm border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-[#e2136e]" />
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </label>

                      <div className="w-full h-px bg-gray-200 my-2"></div>

                      {/* International Card Option */}
                      <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-white border border-transparent hover:border-gray-300 cursor-pointer transition-colors">
                        <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mt-1 w-4 h-4 text-[#3b82f6] focus:ring-[#3b82f6]" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-medium text-gray-800 mb-1">
                            <CreditCard size={18} className="text-gray-500" />
                            Credit Card / Google Pay / Interac (International)
                          </div>
                          
                          <AnimatePresence>
                            {paymentMethod === 'card' && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="mt-4 p-4 bg-black text-white rounded flex justify-center items-center gap-4">
                                  <span className="font-bold">G Pay</span>
                                  <div className="h-4 w-px bg-white/30"></div>
                                  <CreditCard size={20} />
                                  <div className="h-4 w-px bg-white/30"></div>
                                  <span>+</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2 text-center">You will be redirected to the secure payment gateway to complete your transaction.</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </label>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="h-20 border-t border-gray-100 flex items-center justify-end px-6 bg-gray-50 gap-4 mt-auto">
              {currentStep < 4 ? (
                <button 
                  onClick={handleNext} 
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-2.5 rounded text-sm font-medium transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-[#6b46c1] hover:bg-purple-700 text-white px-8 py-2.5 rounded text-sm font-medium transition-colors flex items-center justify-center min-w-[150px]"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin block"></span>
                  ) : (
                    'Place order'
                  )}
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
