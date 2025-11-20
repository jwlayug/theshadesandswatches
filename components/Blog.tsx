import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Blog: React.FC = () => {
  const articles = [
    {
      id: 1,
      date: 'July 15, 2025',
      title: 'Why Professional Installation is Key for Heavy Drapes',
      image: 'https://picsum.photos/600/400?random=13',
      cat: 'Curtains'
    },
    {
      id: 2,
      date: 'July 22, 2025',
      title: 'Small Spaces Big Design: Roman Blinds Ideas',
      image: 'https://picsum.photos/600/400?random=14',
      cat: 'Blinds'
    },
    {
      id: 3,
      date: 'Aug 05, 2025',
      title: 'Color Palettes Revitalize Your Living Space',
      image: 'https://picsum.photos/600/400?random=15',
      cat: 'Design'
    }
  ];

  return (
    <section className="py-24 bg-white" id="blog">
       <div className="container mx-auto px-4">
          <div className="text-center mb-16">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border px-3 py-1 rounded-full">Our Trends</span>
             <h2 className="text-4xl font-serif font-bold text-brand-dark mt-6">
                Read More From <span className="text-brand-gold">Our Latest<br/>Blog</span> & Articles
             </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Large First Article */}
             <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-6 h-[400px]">
                   <img src={articles[0].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Blog Main" />
                   <div className="absolute top-4 left-4 bg-brand-gold text-white text-xs font-bold px-3 py-1 vertical-rl writing-mode-vertical">
                      {articles[0].date}
                   </div>
                </div>
                <span className="text-xs font-bold uppercase text-gray-500">{articles[0].cat}</span>
                <h3 className="text-2xl font-serif font-bold mt-2 mb-4 group-hover:text-brand-gold transition-colors">{articles[0].title}</h3>
                <button className="text-xs font-bold uppercase flex items-center hover:text-brand-gold">
                   View More <ArrowRight className="ml-2 w-3 h-3" />
                </button>
             </div>

             {/* Right Side List */}
             <div className="space-y-10">
                {articles.slice(1).map(article => (
                  <div key={article.id} className="flex gap-6 group cursor-pointer">
                     <div className="w-1/3 h-32 overflow-hidden rounded-lg relative">
                        <img src={article.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Blog Thumb" />
                        <div className="absolute top-0 left-0 bg-brand-gold text-white text-[10px] font-bold px-2 py-1">
                          {article.date.split(',')[0]}
                        </div>
                     </div>
                     <div className="w-2/3">
                        <span className="text-[10px] font-bold uppercase text-gray-500">{article.cat} & Design</span>
                        <h4 className="text-xl font-serif font-bold mt-1 mb-3 group-hover:text-brand-gold transition-colors">{article.title}</h4>
                        <button className="text-[10px] font-bold uppercase flex items-center hover:text-brand-gold">
                           View More <ArrowRight className="ml-1 w-3 h-3" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </section>
  );
};