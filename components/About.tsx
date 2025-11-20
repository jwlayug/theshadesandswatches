
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { getDocument } from '../services/firebase';
import { GeneralContent } from '../types';

export const About: React.FC = () => {
  const [content, setContent] = useState<GeneralContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const doc = await getDocument<{general: GeneralContent}>('content', 'general');
      if (doc?.general) setContent(doc.general);
    };
    fetchContent();
  }, []);

  return (
    <section className="py-24 bg-brand-dark text-white relative overflow-hidden" id="about">
      {/* Big circular text decoration */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
           {/* Left Text */}
           <div className="w-full lg:w-1/2 relative z-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-[1px] w-12 bg-brand-gold"></div>
                 <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Trusted Experience</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                {content?.aboutTitle || "Every Fabric Holds A Story"}
              </h2>
              <p className="text-gray-400 mb-10 leading-relaxed max-w-md">
                {content?.aboutDescription || "Loading..."}
              </p>
              
              <Button variant="outline">Learn More</Button>

              <div className="grid grid-cols-3 gap-8 mt-16 border-t border-white/10 pt-8">
                 <div>
                    <h4 className="text-4xl font-bold mb-1">{content?.statsYears || "15+"}</h4>
                    <span className="text-xs text-gray-500 uppercase">Years Experience</span>
                 </div>
                 <div>
                    <h4 className="text-4xl font-bold mb-1">{content?.statsProjects || "20k+"}</h4>
                    <span className="text-xs text-gray-500 uppercase">Projects Done</span>
                 </div>
                 <div>
                    <h4 className="text-4xl font-bold mb-1">{content?.statsClients || "32k+"}</h4>
                    <span className="text-xs text-gray-500 uppercase">Happy Clients</span>
                 </div>
              </div>
           </div>

           {/* Right Images */}
           <div className="w-full lg:w-1/2 relative">
              <div className="relative">
                 <img 
                   src={content?.aboutImageMain || "https://picsum.photos/600/400?random=8"} 
                   className="w-full h-auto rounded-lg shadow-2xl border-4 border-white/5" 
                   alt="Main Workshop" 
                 />
                 <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-gold p-4 rounded-lg hidden md:block">
                    <img 
                      src={content?.aboutImageSmall || "https://picsum.photos/200/200?random=9"} 
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all" 
                      alt="Detail" 
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};