
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustedBy } from './components/TrustedBy';
import { Services } from './components/Services';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { CtaSection } from './components/CtaSection';
import { Portfolio } from './components/Portfolio';
import { Footer } from './components/Footer';
import { AiDesigner } from './components/AiDesigner';
import { AdminDashboard } from './components/AdminDashboard';

// Loading Screen Component
const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 z-[9999] bg-brand-dark flex items-center justify-center flex-col animate-fadeOut">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-brand-gold/30 rotate-45 absolute inset-0 animate-ping"></div>
      <div className="w-20 h-20 bg-brand-gold rotate-45 flex items-center justify-center shadow-2xl relative z-10 animate-pulse">
         <span className="text-brand-dark font-serif font-bold text-2xl -rotate-45">TSS</span>
      </div>
    </div>
    <h2 className="text-brand-gold font-serif font-bold text-xl mt-12 tracking-[0.2em] animate-bounce">LOADING STUDIO</h2>
    <div className="w-48 h-0.5 bg-gray-800 mt-4 rounded-full overflow-hidden">
      <div className="h-full bg-brand-gold w-full animate-loadingBar origin-left"></div>
    </div>
  </div>
);

function App() {
  const [view, setView] = useState('site');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for admin route
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setView('admin');
      } else {
        setView('site');
      }
    };

    window.addEventListener('hashchange', checkHash);
    checkHash();

    // Simulate initial asset loading / splash screen time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  if (view === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white animate-fadeIn">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Services />
      <Portfolio />
      <About />
      <CtaSection />
      <Testimonials />
      <Footer />
      <AiDesigner />
    </main>
  );
}

export default App;
