import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Waves, Snowflake, Droplets, Zap, ShieldCheck, Clock, Star, PhoneCall } from 'lucide-react';

const services = [
  { id: 'ac', name: 'AC Repair', icon: Wind, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'washing-machine', name: 'Washing Machine', icon: Waves, color: 'bg-blue-100 text-blue-600' },
  { id: 'fridge', name: 'Refrigerator', icon: Snowflake, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'ro', name: 'RO Purifier', icon: Droplets, color: 'bg-sky-100 text-sky-600' },
  { id: 'microwave', name: 'Microwave', icon: Zap, color: 'bg-orange-100 text-orange-600' },
];

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight"
            >
              Expert Appliance Repair at Your Doorstep
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-blue-100 mb-8"
            >
              Fast, reliable, and affordable service for your AC, Fridge, Washing Machine, and more. Trusted by thousands.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/book" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg text-center shadow-lg hover:bg-slate-50 transition-all transform hover:-translate-y-1">
                Book a Service
              </Link>
              <a href="tel:9236587212" className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg text-center border border-blue-500 hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Call 9236587212
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What do you need help with?</h2>
            <p className="text-slate-600">Select an appliance to book a verified technician instantly.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/book?service=${service.id}`}
                  className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer h-full"
                >
                  <div className={`p-4 rounded-full mb-4 ${service.color} group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-center">{service.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Professionals</h3>
              <p className="text-slate-600">Background-checked and highly trained technicians you can trust in your home.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">On-Time Service</h3>
              <p className="text-slate-600">We value your time. Our technicians arrive promptly at your scheduled time slot.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Guaranteed</h3>
              <p className="text-slate-600">We use genuine spare parts and offer a warranty on our repair services.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
