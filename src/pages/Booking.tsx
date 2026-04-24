import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CheckCircle2, MapPin, Calendar, Clock, PenTool } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const applianceCategories = ['AC', 'Washing Machine', 'Refrigerator', 'RO', 'Microwave'];
const timeSlots = ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialService = searchParams.get('service') || '';
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: initialService ? applianceCategories.find(c => c.toLowerCase().includes(initialService.split('-')[0])) || '' : '',
    issue: '',
    date: '',
    timeSlot: '',
    address: '',
    phone: ''
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to book a service');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Confirming your booking...');
    
    try {
      // Insert into Supabase bookings table
      const { error } = await supabase.from('bookings').insert({
        customer_id: user.id,
        service_category: formData.category,
        issue_description: formData.issue,
        scheduled_date: formData.date,
        time_slot: formData.timeSlot,
        service_address: formData.address,
        status: 'pending'
      });

      if (error) throw error;

      toast.success('Booking confirmed! A technician will be assigned shortly.', { id: loadingToast });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all duration-300`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-slate-500 px-2">
            <span>Appliance</span>
            <span>Details</span>
            <span>Schedule</span>
            <span>Address</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            
            {/* Step 1: Appliance */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><PenTool className="text-blue-600" /> Select Appliance</h2>
                <div className="grid grid-cols-2 gap-4">
                  {applianceCategories.map(cat => (
                    <label key={cat} className={`cursor-pointer border-2 rounded-xl p-4 text-center font-medium transition-all ${formData.category === cat ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-700'}`}>
                      <input type="radio" name="category" value={cat} className="hidden" onChange={(e) => setFormData({...formData, category: e.target.value})} checked={formData.category === cat} />
                      {cat}
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Issue */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold mb-6">Describe the Issue</h2>
                <p className="text-slate-600 mb-4">What's wrong with your {formData.category}?</p>
                <textarea 
                  required
                  rows={4}
                  className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                  placeholder="E.g., Not cooling, making weird noise, won't turn on..."
                  value={formData.issue}
                  onChange={(e) => setFormData({...formData, issue: e.target.value})}
                ></textarea>
              </motion.div>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-blue-600" /> Choose Date & Time</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><Clock className="w-4 h-4"/> Select Time Slot</label>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map(slot => (
                      <label key={slot} className={`cursor-pointer border rounded-lg p-3 text-center text-sm font-medium transition-all ${formData.timeSlot === slot ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-700'}`}>
                        <input type="radio" name="timeSlot" value={slot} className="hidden" onChange={(e) => setFormData({...formData, timeSlot: e.target.value})} checked={formData.timeSlot === slot} />
                        {slot}
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Address */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-blue-600" /> Contact & Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="10-digit mobile number"
                      className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-600 outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Complete Address</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="House No., Building, Street, Area, City"
                      className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-2">Booking Summary</h4>
                  <p className="text-sm text-blue-800">Service: {formData.category}</p>
                  <p className="text-sm text-blue-800">When: {formData.date} at {formData.timeSlot}</p>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  Back
                </button>
              ) : <div></div>}
              
              <button 
                type="submit" 
                disabled={(step === 1 && !formData.category) || isSubmitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 4 ? (isSubmitting ? 'Confirming...' : 'Confirm Booking') : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
