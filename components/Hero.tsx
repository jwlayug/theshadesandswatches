
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getDocument } from '../services/firebase';
import { HeroContent } from '../types';

const DEFAULT_HERO: HeroContent = {
  title: "",
  subtitle: "",
  images: []
};

export const Hero: React.FC = () => {
  const [content, setContent] = useState<HeroContent>(DEFAULT_HERO);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await getDocument<{hero: HeroContent}>('content', 'home');
        if (data && data.hero) {
          setContent(data.hero);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  useEffect(() => {
    if (content.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [content.images.length]);

  const nextSlide = () => {
    if (content.images.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % content.images.length);
    }
  };
  
  const prevSlide = () => {
    if (content.images.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + content.images.length) % content.images.length);
    }
  };

  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-brand-gold/20 rotate-45 mb-4"></div>
          <div className="h-4 w-32 bg-gray-100 rounded"></div>
        </div>
      </section>
    );
  }

  const hasImages = content.images && content.images.length > 0;
  const mainImage = hasImages ? content.images[currentSlide] : "https://placehold.co/800x1000/f5f5f5/d4af37?text=No+Image";

  return (
    <section id="home" className="relative pt-32 pb-20 bg-white overflow-hidden min-h-[90vh] flex items-center">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Content Block - Carousel Images */}
          <div className="w-full lg:w-1/2 relative">
             {/* Main Image */}
             <div className="relative z-10 overflow-hidden rounded-sm shadow-2xl border-4 border-white aspect-[4/5] bg-gray-100">
                {hasImages ? content.images.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`Slide ${idx}`} 
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  />
                )) : (
                   <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-serif italic">
                     No images uploaded
                   </div>
                )}
                
                {/* Floating Label */}
                <div className="absolute bottom-8 -right-4 bg-brand-dark text-white px-8 py-4 shadow-xl border-l-4 border-brand-gold z-20">
                   <span className="block text-[10px] text-brand-gold uppercase tracking-widest mb-1">New Collection 2025</span>
                   <span className="block font-serif text-2xl font-bold">Velvet & Voile</span>
                </div>
             </div>
             
             {/* Decorative element behind */}
             <div className="absolute -top-10 -left-10 w-64 h-64 bg-brand-gold/10 -z-10"></div>
          </div>

          {/* Right Content Block - Text */}
          <div className="w-full lg:w-1/2 space-y-8 pl-0 lg:pl-12">
             <div className="inline-block px-3 py-1 bg-brand-dark text-white text-xs font-bold tracking-wider uppercase mb-4">
               Premium Textiles
             </div>
             
             <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark leading-[1.1]">
               {content.title ? (
                 <>
                    {content.title.split(' ').slice(0, 2).join(' ')} <br />
                    <span className="relative">
                        {content.title.split(' ').slice(2, -1).join(' ')}
                        <span className="absolute bottom-2 left-0 w-full h-3 bg-brand-gold/30 -z-10"></span>
                    </span> 
                    <span className="text-brand-gold italic ml-4">{content.title.split(' ').slice(-1)}</span>
                 </>
               ) : (
                 <span>Welcome to <br/>The Shades & Swatches</span>
               )}
             </h1>

             <p className="text-gray-600 text-lg max-w-md leading-relaxed">
               {content.subtitle || "Your luxury interior design partner."}
             </p>

             <div className="flex items-center gap-6 pt-4">
               <Button withArrow onClick={scrollToPortfolio}>Explore Fabrics</Button>
               {hasImages && content.images.length > 1 && (
                 <div className="flex items-center gap-3">
                   <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-colors cursor-pointer">
                     <ChevronLeft className="w-4 h-4" />
                   </button>
                   <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-colors cursor-pointer">
                     <ChevronRight className="w-4 h-4" />
                   </button>
                 </div>
               )}
             </div>

             {/* Bottom Thumbnails */}
             {hasImages && (
                <div className="grid grid-cols-3 gap-4 pt-12 border-t border-gray-100 mt-12">
                    {content.images.slice(0, 3).map((img, i) => (
                    <div 
                        key={i} 
                        className={`group relative overflow-hidden cursor-pointer h-24 border transition-all ${i === currentSlide ? 'border-brand-gold ring-2 ring-brand-gold/50' : 'border-gray-200'}`}
                        onClick={() => setCurrentSlide(i)}
                    >
                        <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="thumb" />
                    </div>
                    ))}
                </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};
