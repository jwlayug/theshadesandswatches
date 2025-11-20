
import React, { useEffect, useState } from 'react';
import { getCollection } from '../services/firebase';
import { ClientLogo } from '../types';

export const TrustedBy: React.FC = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getCollection<ClientLogo>('clients');
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) return <div className="py-12 bg-white"></div>;
  if (clients.length === 0) return null;

  return (
    <section className="py-12 border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-8 md:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
           {clients.map((client, idx) => (
             <div key={client.id || idx} className="flex items-center gap-2 group" title={client.name}>
                <img 
                  src={client.logo} 
                  alt={client.name} 
                  className="h-12 w-auto object-contain max-w-[150px] transition-transform duration-300 group-hover:scale-110" 
                />
             </div>
           ))}
           
           <div className="hidden md:block text-sm font-semibold text-gray-400 pl-8 border-l border-gray-200">
              Trusted by <span className="text-brand-gold font-bold">Leading</span><br />Design Firms
           </div>
        </div>
      </div>
    </section>
  );
};
