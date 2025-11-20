
import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, ArrowRight, MapPin } from 'lucide-react';
import { getDocument } from '../services/firebase';
import { GeneralContent } from '../types';

export const Footer: React.FC = () => {
  const [contact, setContact] = useState<GeneralContent | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
       const doc = await getDocument<{general: GeneralContent}>('content', 'general');
       if(doc?.general) setContact(doc.general);
    };
    fetchContact();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-8" id="contact">
      <div className="container mx-auto px-4">
         {/* Newsletter */}
         <div className="max-w-2xl mx-auto text-center mb-20">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">Subscribe for updates</span>
            <h2 className="text-3xl font-serif font-bold mt-8 mb-8">
               Join <span className="text-brand-gold">our community</span> stay<br/>informed today
            </h2>
            <div className="flex border-b-2 border-brand-dark pb-2">
               <input type="email" placeholder="Enter your email..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2 outline-none placeholder-gray-400 text-brand-dark" />
               <button className="text-xs font-bold uppercase flex items-center hover:text-brand-gold transition-colors">
                  Send <ArrowRight className="ml-2 w-3 h-3" />
               </button>
            </div>
         </div>

         {/* Main Footer Content */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-brand-dark text-white p-12 rounded-3xl">
            {/* Brand */}
            <div className="lg:col-span-4">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 bg-brand-gold rotate-45 flex-shrink-0"></div>
                  <span className="text-lg font-serif font-bold tracking-widest leading-tight">THE SHADES<br/>AND SWATCHES</span>
               </div>
               <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  We are a premier design studio offering high-quality curtains, blinds, and furniture cover solutions for luxury homes and businesses.
               </p>
               <div className="flex gap-4">
                  <a href="#" className="text-white hover:text-brand-gold transition-colors"><Facebook className="w-5 h-5" /></a>
                  <a href="#" className="text-white hover:text-brand-gold transition-colors"><Twitter className="w-5 h-5" /></a>
                  <a href="#" className="text-white hover:text-brand-gold transition-colors"><Instagram className="w-5 h-5" /></a>
               </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-2">
               <h4 className="text-brand-gold font-bold text-xs uppercase tracking-widest mb-6">Company</h4>
               <ul className="space-y-4 text-sm text-gray-300 font-medium">
                  <li><a href="#about" className="hover:text-brand-gold transition-colors">About</a></li>
                  <li><a href="#services" className="hover:text-brand-gold transition-colors">Services</a></li>
                  <li><a href="#testimonials" className="hover:text-brand-gold transition-colors">Testimonials</a></li>
                  <li><a href="#contact" className="hover:text-brand-gold transition-colors">Get In Touch</a></li>
                  <li><a href="#admin" className="hover:text-brand-gold transition-colors text-gray-500 pt-4 block">Admin Login</a></li>
               </ul>
            </div>
            <div className="lg:col-span-2">
               <h4 className="text-brand-gold font-bold text-xs uppercase tracking-widest mb-6">Services</h4>
               <ul className="space-y-4 text-sm text-gray-300 font-medium">
                  <li><a href="#" className="hover:text-brand-gold transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-brand-gold transition-colors">How It Works?</a></li>
                  <li><a href="#" className="hover:text-brand-gold transition-colors">Design Consult</a></li>
               </ul>
            </div>
             <div className="lg:col-span-2">
               <h4 className="text-brand-gold font-bold text-xs uppercase tracking-widest mb-6">Collections</h4>
               <ul className="space-y-4 text-sm text-gray-300 font-medium">
                  <li><a href="#" className="hover:text-brand-gold transition-colors">Curtains</a></li>
                  <li><a href="#" className="hover:text-brand-gold transition-colors">Blinds</a></li>
                  <li><a href="#" className="hover:text-brand-gold transition-colors">Sofa Covers</a></li>
               </ul>
            </div>

            {/* Map Placeholder */}
            <div className="lg:col-span-2 bg-white/10 p-6 rounded-xl backdrop-blur-sm flex flex-col justify-center items-center text-center border border-white/10">
               <span className="text-xs text-brand-gold block mb-2">{contact?.contactPhone || "(+91) 770-123-023"}</span>
               <span className="font-bold text-white block mb-4 break-all text-sm">{contact?.contactEmail || "info@shadesandswatches.com"}</span>
               <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="text-brand-dark w-5 h-5" />
               </div>
               <span className="text-xs text-gray-400 mt-4 block">{contact?.contactAddress || "250 Design Ave, NY 10012"}</span>
            </div>
         </div>

         <div className="text-center mt-8 text-[10px] text-gray-400 uppercase">
            © 2025 The Shades and Swatches. All Rights Reserved.
         </div>
      </div>
    </footer>
  );
};
