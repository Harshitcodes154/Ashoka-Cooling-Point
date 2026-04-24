import React from 'react';
import { Phone, Mail, MapPin, Wrench } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Ashoka Services</span>
          </div>
          <p className="text-sm text-slate-400 mb-4 max-w-xs">
            Your trusted local partner for fast, reliable, and professional appliance repair and maintenance.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Our Services</h3>
          <ul className="space-y-2 text-sm">
            <li>AC Repair & Service</li>
            <li>Washing Machine Repair</li>
            <li>Refrigerator Repair</li>
            <li>RO Water Purifier Service</li>
            <li>Microwave Repair</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-blue-400" />
              <a href="tel:9236587212" className="hover:text-white transition-colors">9236587212</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-400" />
              <span>support@ashokaservices.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>Serving your city with pride</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
        &copy; {new Date().getFullYear()} Ashoka Services. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
