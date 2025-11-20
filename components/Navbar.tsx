
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { getDocument } from '../services/firebase';
import { GeneralContent } from '../types';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [contact, setContact] = useState<GeneralContent | null>(null);

  const navLinks = ['Home', 'Services', 'Portfolio', 'About', 'Testimonials', 'Contact'];

  useEffect(() => {
    const fetchContact = async () => {
      const doc = await getDocument<{general: GeneralContent}>('content', 'general');
      if(doc?.general) setContact(doc.general);
    };
    fetchContact();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // ScrollSpy Logic
      const sections = navLinks.map(link => link.toLowerCase());
      let current = '';

      // If at top, set home
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is in viewport (middle of screen)
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Height of sticky header approx
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
      {/* Top Bar */}
      <div className={`hidden md:block border-b ${scrolled ? 'border-gray-100' : 'border-white/10'} bg-brand-dark text-white text-xs py-2`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center"><span className="mr-2 text-brand-gold">📍</span> {contact?.contactAddress || "250 Design Ave, NY 10012"}</span>
            <span className="flex items-center"><span className="mr-2 text-brand-gold">✉️</span> {contact?.contactEmail || "info@shadesandswatches.com"}</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><Clock className="w-3 h-3 mr-2 text-brand-gold" /> Mon-Fri: 9:00 - 18:00</span>
            <div className="flex space-x-3 border-l border-gray-800 pl-6">
              <Facebook className="w-3 h-3 cursor-pointer hover:text-brand-gold transition-colors" />
              <Instagram className="w-3 h-3 cursor-pointer hover:text-brand-gold transition-colors" />
              <Twitter className="w-3 h-3 cursor-pointer hover:text-brand-gold transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-3 group"
          >
             <div className="w-8 h-8 bg-brand-gold transform rotate-45 hidden sm:block group-hover:rotate-90 transition-transform duration-500"></div>
             <div className={`text-lg md:text-xl font-serif font-bold tracking-widest ${scrolled ? 'text-brand-dark' : 'text-brand-dark'}`}>
               THE SHADES AND SWATCHES
             </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-wide">
            {navLinks.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={(e) => handleNavClick(e, item.toLowerCase())}
                className={`transition-all duration-300 relative py-2 ${
                  activeSection === item.toLowerCase() 
                    ? 'text-brand-gold' 
                    : 'text-brand-dark hover:text-brand-gold'
                }`}
              >
                {item}
                {/* Active Indicator Dot */}
                {activeSection === item.toLowerCase() && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-gold rounded-full"></span>
                )}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
             <div className="hidden lg:flex flex-col items-end text-right mr-4">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Call Us</span>
                <span className="text-xs font-bold">{contact?.contactPhone || "(+91) 770-123-023"}</span>
             </div>
             <a 
               href="#contact" 
               onClick={(e) => handleNavClick(e, 'contact')}
               className="px-6 py-2 border-2 border-brand-dark text-xs font-bold uppercase hover:bg-brand-dark hover:text-white transition-all duration-300"
             >
                Get In Touch
             </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t p-6 flex flex-col space-y-4 animate-fadeIn">
            {navLinks.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className={`text-sm font-bold uppercase p-2 ${
                  activeSection === item.toLowerCase() ? 'text-brand-gold' : 'hover:text-brand-gold'
                }`}
                onClick={(e) => handleNavClick(e, item.toLowerCase())}
              >
                {item}
              </a>
            ))}
        </div>
      )}
    </header>
  );
};
