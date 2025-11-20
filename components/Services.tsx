
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getCollection } from '../services/firebase';
import { ServiceItem } from '../types';

export const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getCollection<ServiceItem>('services');
      setServices(data);
    };
    fetchServices();
  }, []);

  return (
    <section className="py-24 bg-brand-gray" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border border-gray-200 px-4 py-1 rounded-full">Signature Collections</span>
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mt-6">
             Unique Design <span className="text-brand-gold">Drapes & Blinds</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={service.id || idx} className={`relative group overflow-hidden h-[500px] shadow-lg ${idx === 1 ? 'md:-mt-8 shadow-2xl border-t-4 border-brand-gold' : ''}`}>
               <img 
                 src={service.image} 
                 alt={service.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90"></div>
               <div className="absolute bottom-8 left-8 right-8 text-white">
                 <h3 className={`text-2xl font-serif font-bold mb-2 ${idx === 1 ? 'text-brand-gold text-3xl' : ''}`}>{service.title}</h3>
                 <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                   {service.description}
                 </p>
                 <button className="flex items-center text-xs font-bold uppercase tracking-wider border-b border-brand-gold pb-1 text-brand-gold">
                   View More <ArrowRight className="ml-2 w-3 h-3" />
                 </button>
               </div>
               {idx === 1 && (
                 <div className="absolute top-8 right-8 bg-brand-gold text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">Best Seller</div>
               )}
            </div>
          ))}
          {services.length === 0 && (
             <div className="col-span-3 text-center text-gray-400 py-12">
               Loading Services...
             </div>
          )}
        </div>
      </div>
    </section>
  );
};
