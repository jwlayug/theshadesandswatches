
import React, { useState, useEffect } from 'react';
import { getDocument } from '../services/firebase';
import { GeneralContent } from '../types';

export const CtaSection: React.FC = () => {
  const [content, setContent] = useState<GeneralContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
       const doc = await getDocument<{general: GeneralContent}>('content', 'general');
       if(doc?.general) setContent(doc.general);
    };
    fetchContent();
  }, []);

  // Default values if CMS is empty
  const defaultTitle = `Let's Build Your <span class="text-brand-gold">Dream</span><br />Home Ambience`;
  const defaultSubtitle = "Transform your vision into reality with our expert guidance.";
  const defaultButton = "Get Pricing";
  const defaultImage = "https://picsum.photos/1920/1080?random=12";

  const bgImage = content?.ctaImage || defaultImage;

  return (
    <section className="relative py-32 bg-fixed bg-center bg-cover" style={{backgroundImage: `url('${bgImage}')`}}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
         <span className="text-xs font-bold text-white/80 uppercase tracking-widest mb-4 block">Our Craft</span>
         
         <h2 
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-4"
            dangerouslySetInnerHTML={{ __html: content?.ctaTitle || defaultTitle }}
         >
         </h2>
         
         <p className="text-gray-300 max-w-2xl mx-auto mb-12 text-lg">
            {content?.ctaSubtitle || defaultSubtitle}
         </p>
         
         <button className="w-24 h-24 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-brand-dark transition-all duration-300 hover:scale-110 flex flex-col items-center justify-center">
            <span className="block leading-tight" dangerouslySetInnerHTML={{__html: (content?.ctaButtonText || defaultButton).replace(' ', '<br/>')}}></span>
         </button>
      </div>
    </section>
  );
};