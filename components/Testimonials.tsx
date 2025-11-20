
import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { getCollection } from '../services/firebase';
import { Testimonial } from '../types';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const data = await getCollection<Testimonial>('testimonials');
      setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[activeIndex];

  return (
    <section className="py-24 bg-brand-gray relative" id="testimonials">
       {/* Background Map Illustration */}
       <div className="absolute inset-0 opacity-5 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-center bg-no-repeat bg-contain pointer-events-none"></div>

       <div className="container mx-auto px-4">
         <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Image Side */}
            <div className="w-full lg:w-1/2">
               <div className="grid grid-cols-2 gap-4">
                  <img src="https://picsum.photos/400/600?random=10" className="w-full h-64 object-cover rounded-lg" alt="Interior 1" />
                  <img src="https://picsum.photos/400/600?random=11" className="w-full h-64 object-cover rounded-lg mt-8" alt="Interior 2" />
               </div>
               <div className="mt-6 flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm inline-flex">
                  <span className="text-4xl font-bold font-serif">4.9/5</span>
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                        <img key={i} src={`https://randomuser.me/api/portraits/women/${i+20}.jpg`} className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                     ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-500">Client Reviews</span>
               </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2">
               <span className="text-xs font-bold text-brand-dark uppercase tracking-widest bg-white px-2 py-1">Client Reviews</span>
               <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mt-6 mb-8">
                  Our Clients Reveal Their <br /><span className="text-brand-gold">Design Journey</span>
               </h2>

               {current ? (
                 <div className="bg-white p-8 shadow-xl rounded-xl relative animate-fadeIn">
                    <div className="flex gap-1 mb-4 text-brand-gold">
                       {[...Array(current.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-gray-600 italic mb-8 text-lg leading-relaxed">
                       "{current.content}"
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                       <div className="flex items-center gap-4">
                          <img src={current.image || "https://via.placeholder.com/50"} className="w-12 h-12 rounded-full object-cover" alt={current.name} />
                          <div>
                             <h4 className="font-bold text-brand-dark">{current.name}</h4>
                             <span className="text-xs text-gray-400">{current.role}</span>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={prev} className="p-2 border rounded-full hover:bg-brand-dark hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></button>
                          <button onClick={next} className="p-2 border rounded-full bg-brand-gold text-white hover:bg-brand-dark border-transparent transition-colors"><ArrowRight className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-gray-400">Loading Reviews...</div>
               )}
            </div>
         </div>
       </div>
    </section>
  );
};
