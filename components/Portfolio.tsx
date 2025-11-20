import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, ZoomIn, Layers } from 'lucide-react';
import { getCollection } from '../services/firebase';
import { PortfolioCategory, PortfolioProject, MainCategory } from '../types';

export const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<PortfolioCategory | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCollection<PortfolioCategory>('categories');
        const projs = await getCollection<PortfolioProject>('projects');
        setCategories(cats);
        setProjects(projs);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        // Fallback or empty state handled by UI
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedSubCategory || lightboxImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedSubCategory, lightboxImage]);

  const filteredCategories = activeFilter === 'All' 
    ? categories 
    : categories.filter(item => item.mainCategory === activeFilter);

  // Get projects for selected category
  const currentProjects = selectedSubCategory 
    ? projects.filter(p => p.categoryId === selectedSubCategory.id)
    : [];

  return (
    <section id="portfolio" className="py-24 bg-white relative min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-widest border border-gray-100 px-4 py-2 rounded-full">Our Collections</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mt-6">
            Browse by <span className="text-brand-gold">Category</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Select a category below to explore our specific works and installations.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {['All', 'Curtains', 'Blinds', 'Furniture Covers'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-sm border ${
                activeFilter === filter
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-brand-gold hover:text-brand-gold'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
          </div>
        ) : (
          /* Sub-Category Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.length > 0 ? filteredCategories.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedSubCategory(item)}
                className="group relative h-[400px] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <img 
                  src={item.coverImage} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-brand-gold" />
                      <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest">
                        {item.mainCategory}
                      </span>
                  </div>
                  <h3 className="text-2xl font-serif text-white font-bold mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center text-white text-xs font-bold uppercase tracking-wider group-hover:text-brand-gold transition-colors">
                      View Gallery <ArrowUpRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                No categories found. Please check Admin Dashboard.
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- GALLERY MODAL --- */}
      {selectedSubCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-brand-dark/95 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSelectedSubCategory(null)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white w-full max-w-6xl h-[90vh] md:h-[80vh] rounded-lg shadow-2xl relative z-10 flex flex-col overflow-hidden animate-scaleIn">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
              <div>
                <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">{selectedSubCategory.mainCategory}</span>
                <h3 className="text-3xl font-serif font-bold text-brand-dark">{selectedSubCategory.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedSubCategory(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-brand-dark" />
              </button>
            </div>

            {/* Scrollable Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {currentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProjects.map((project, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                      <div 
                        className="relative overflow-hidden group h-64 md:h-72 cursor-pointer"
                        onClick={() => setLightboxImage(project.url)}
                      >
                        <img 
                          src={project.url} 
                          alt={project.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <ZoomIn className="text-white w-8 h-8 transform hover:scale-125 transition-transform" />
                        </div>
                      </div>
                      <div className="pt-4 pb-2 px-2">
                        <p className="text-sm font-serif font-bold text-brand-dark">{project.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Layers className="w-12 h-12 mb-4 opacity-20" />
                  <p>No projects uploaded for this category yet.</p>
                </div>
              )}
              
              {/* Helper Text */}
              <div className="mt-12 text-center">
                 <p className="text-gray-400 text-sm">Showing all recent works for {selectedSubCategory.name}</p>
                 <button 
                   onClick={() => setSelectedSubCategory(null)}
                   className="mt-4 text-brand-gold font-bold text-sm hover:underline"
                 >
                   Back to Categories
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LIGHTBOX MODAL --- */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
           <button 
             className="absolute top-6 right-6 text-white/70 hover:text-brand-gold transition-colors z-[210]"
             onClick={() => setLightboxImage(null)}
           >
             <X className="w-10 h-10" />
           </button>
           
           <div className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center">
             <img 
               src={lightboxImage} 
               alt="Full View" 
               onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
               className="max-w-full max-h-[90vh] object-contain shadow-2xl border-4 border-white rounded-sm animate-scaleIn"
             />
           </div>
        </div>
      )}
    </section>
  );
};