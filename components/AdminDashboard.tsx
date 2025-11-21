
import React, { useState, useEffect } from 'react';
import { auth, addToCollection, getCollection, deleteDocument, getDocument, setDocument, updateDocument } from '../services/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { PortfolioCategory, PortfolioProject, ServiceItem, Testimonial, GeneralContent, ClientLogo } from '../types';
import { Trash2, Plus, LogOut, Loader2, Lock, ArrowLeft, Settings, FileText, MessageSquare, Briefcase, Home, Image as ImageIcon, LayoutGrid, Star, Save, X, User as UserIcon, ShieldCheck, Megaphone, Pencil } from 'lucide-react';

// --- UI Components for Consistency ---

const PageHeader: React.FC<{ title: string; subtitle: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-gray-200 pb-6">
    <div>
      <h2 className="text-3xl font-serif font-bold text-brand-dark">{title}</h2>
      <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-wider">{subtitle}</p>
    </div>
    {action}
  </div>
);

const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">{label}</label>
    {children}
  </div>
);

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className="w-full bg-white border border-gray-200 text-brand-dark p-3 rounded-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all placeholder-gray-300 text-sm"
  />
);

const StyledTextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea 
    {...props} 
    className="w-full bg-white border border-gray-200 text-brand-dark p-3 rounded-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all placeholder-gray-300 text-sm min-h-[120px]"
  />
);

const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select 
      {...props} 
      className="w-full appearance-none bg-white border border-gray-200 text-brand-dark p-3 pr-8 rounded-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all text-sm"
    />
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
);

const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button 
    className={`bg-brand-gold text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-gold/20 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button 
    className={`p-2 rounded-full transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

// --- Main Dashboard ---

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'portfolio' | 'services' | 'testimonials' | 'general' | 'clients'>('portfolio');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login Error:", error);
      setError("Access Denied. Please check your credentials.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">Loading Studio...</span>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Left Image Panel */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden bg-brand-dark">
           <img src="https://picsum.photos/1200/1600?random=99" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Luxury Interior" />
           <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-90"></div>
           <div className="absolute bottom-20 left-20 text-white z-10">
              <div className="w-16 h-16 bg-brand-gold mb-8 rotate-45"></div>
              <h1 className="text-6xl font-serif font-bold mb-4">Atelier <br/>Control</h1>
              <p className="text-gray-300 text-lg max-w-md font-light">Manage your collections, clients, and content with precision and elegance.</p>
           </div>
        </div>

        {/* Right Login Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
          <div className="w-full max-w-md space-y-12">
            <div className="text-center lg:text-left">
               <div className="inline-block lg:hidden w-10 h-10 bg-brand-gold rotate-45 mb-6"></div>
               <h2 className="text-3xl font-serif font-bold text-brand-dark">Welcome Back</h2>
               <p className="text-gray-500 mt-2">Please sign in to access the dashboard.</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm flex items-center gap-2">
                <X className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Email</label>
                <StyledInput 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="admin@shadesandswatches.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Password</label>
                <StyledInput 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required
                />
              </div>
              <PrimaryButton type="submit" className="w-full py-4">
                <Lock className="w-4 h-4" /> Secure Login
              </PrimaryButton>
            </form>
            
            <div className="text-center pt-8">
              <a href="/" className="inline-flex items-center text-gray-400 hover:text-brand-dark transition-colors text-xs font-bold uppercase tracking-widest group">
                <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Website
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-brand-dark text-white flex flex-col md:fixed h-auto md:h-full z-20 shadow-2xl">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 bg-brand-gold rotate-45"></div>
            <h1 className="font-serif font-bold text-lg tracking-wider">T.S.S. ADMIN</h1>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest pl-6">Content Management</p>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2 flex md:block overflow-x-auto md:overflow-visible scrollbar-hide">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home className="w-4 h-4"/>} label="Home & Hero" />
          <NavButton active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={<Briefcase className="w-4 h-4"/>} label="Portfolio" />
          <NavButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<LayoutGrid className="w-4 h-4"/>} label="Services" />
          <NavButton active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} icon={<Star className="w-4 h-4"/>} label="Testimonials" />
          <NavButton active={activeTab === 'clients'} onClick={() => setActiveTab('clients')} icon={<ShieldCheck className="w-4 h-4"/>} label="Clients" />
          <NavButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<UserIcon className="w-4 h-4"/>} label="About & Contact" />
        </nav>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-serif font-bold">A</div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate w-32">{user.email}</p>
             </div>
          </div>
          <button onClick={() => signOut(auth)} className="w-full py-2 border border-white/20 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all flex items-center justify-center gap-2">
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72 flex-1 h-screen overflow-y-auto bg-gray-50 relative">
        {/* Top decorative bar */}
        <div className="h-2 w-full bg-brand-gold absolute top-0 left-0 z-10"></div>

        <div className="max-w-6xl mx-auto p-6 md:p-12 pb-24">
          {activeTab === 'portfolio' && <PortfolioManager />}
          {activeTab === 'home' && <HomeEditor />}
          {activeTab === 'services' && <ServiceManager />}
          {activeTab === 'testimonials' && <TestimonialManager />}
          {activeTab === 'general' && <GeneralEditor />}
          {activeTab === 'clients' && <ClientManager />}
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
  <button 
    onClick={onClick} 
    className={`w-full text-left px-6 py-4 rounded-sm transition-all duration-300 text-xs font-bold uppercase tracking-widest flex items-center gap-4 whitespace-nowrap group relative overflow-hidden ${
      active ? 'text-brand-gold bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold"></div>}
    <span className={`transition-transform duration-300 ${active ? 'translate-x-2' : 'group-hover:translate-x-1'}`}>{icon}</span>
    <span className={`transition-transform duration-300 ${active ? 'translate-x-2' : 'group-hover:translate-x-1'}`}>{label}</span>
  </button>
);

// --- Sub-Components for CMS ---

const ClientManager: React.FC = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [newClient, setNewClient] = useState<ClientLogo>({ name: '', logo: '' });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const data = await getCollection<ClientLogo>('clients');
    setClients(data);
  };
  
  useEffect(() => { refresh(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addToCollection('clients', newClient);
    setNewClient({ name: '', logo: '' });
    await refresh();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this client logo?')) {
      await deleteDocument('clients', id);
      refresh();
    }
  };

  return (
    <div className="animate-fadeIn">
      <PageHeader 
        title="Trusted Clients" 
        subtitle="Manage the logos displayed in the 'Trusted By' section."
      />
      
      {/* Add Form */}
      <div className="bg-white p-8 rounded-sm shadow-md border-l-4 border-brand-gold mb-8">
        <h3 className="text-lg font-serif font-bold text-brand-dark mb-6">Add New Client Logo</h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
             <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Client Name</label>
             <StyledInput value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} placeholder="Company Name" required />
          </div>
          <div className="flex-1 w-full">
             <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Logo URL</label>
             <StyledInput value={newClient.logo} onChange={e => setNewClient({...newClient, logo: e.target.value})} placeholder="https://..." required />
          </div>
          <PrimaryButton type="submit" disabled={loading} className="w-full md:w-auto h-[46px]">
             {loading ? 'Adding...' : 'Add Client'}
          </PrimaryButton>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 group relative flex flex-col items-center justify-center h-40">
            <img src={client.logo} alt={client.name} className="max-h-16 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all" />
            <span className="absolute bottom-2 left-0 w-full text-center text-[10px] text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{client.name}</span>
            <button 
              onClick={() => handleDelete(client.id!)}
              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {clients.length === 0 && (
           <div className="col-span-full text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 rounded-sm">
             No clients added yet.
           </div>
        )}
      </div>
    </div>
  );
};

const GeneralEditor: React.FC = () => {
  const [data, setData] = useState<GeneralContent>({
    aboutTitle: '', aboutDescription: '', statsYears: '', statsProjects: '', statsClients: '',
    contactEmail: '', contactPhone: '', contactAddress: '',
    aboutImageMain: '', aboutImageSmall: '',
    ctaTitle: '', ctaSubtitle: '', ctaButtonText: '', ctaImage: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const doc = await getDocument<{general: GeneralContent}>('content', 'general');
      if (doc && doc.general) setData(prev => ({ ...prev, ...doc.general }));
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await setDocument('content', 'general', { general: data });
    setLoading(false);
  };

  return (
    <div className="animate-fadeIn">
      <PageHeader 
        title="About & Contact" 
        subtitle="Manage your company profile, stats, and contact information."
      />
      
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* About Section */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-dark"></div>
            <h3 className="text-lg font-serif font-bold mb-6 text-brand-dark flex items-center gap-2"><FileText className="w-5 h-5 text-brand-gold"/> About The Brand</h3>
            
            <div className="space-y-6">
              <InputGroup label="Main Headline">
                <StyledInput value={data.aboutTitle} onChange={e=>setData({...data, aboutTitle: e.target.value})} placeholder="e.g. Every Fabric Holds A Story" />
              </InputGroup>
              <InputGroup label="Brand Story">
                <StyledTextArea value={data.aboutDescription} onChange={e=>setData({...data, aboutDescription: e.target.value})} placeholder="Describe your company history and values..." />
              </InputGroup>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputGroup label="Main Image URL">
                    <StyledInput value={data.aboutImageMain} onChange={e=>setData({...data, aboutImageMain: e.target.value})} placeholder="https://..." />
                 </InputGroup>
                 <InputGroup label="Detail/Small Image URL">
                    <StyledInput value={data.aboutImageSmall} onChange={e=>setData({...data, aboutImageSmall: e.target.value})} placeholder="https://..." />
                 </InputGroup>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100 mt-4">
                <InputGroup label="Years Exp.">
                  <StyledInput value={data.statsYears} onChange={e=>setData({...data, statsYears: e.target.value})} placeholder="15+" />
                </InputGroup>
                <InputGroup label="Projects">
                  <StyledInput value={data.statsProjects} onChange={e=>setData({...data, statsProjects: e.target.value})} placeholder="20k+" />
                </InputGroup>
                <InputGroup label="Clients">
                  <StyledInput value={data.statsClients} onChange={e=>setData({...data, statsClients: e.target.value})} placeholder="32k+" />
                </InputGroup>
              </div>
            </div>
          </div>

          {/* CTA Section - New Addition */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold"></div>
             <h3 className="text-lg font-serif font-bold mb-6 text-brand-dark flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-brand-gold"/> Call To Action Banner (Our Craft)
             </h3>
             <div className="space-y-6">
                <InputGroup label="Banner Title (HTML Allowed)">
                   <StyledInput value={data.ctaTitle || ''} onChange={e=>setData({...data, ctaTitle: e.target.value})} placeholder="Let's Build Your <span class='text-brand-gold'>Dream</span> Home" />
                   <p className="text-[10px] text-gray-400 mt-1">Tip: Use &lt;span class='text-brand-gold'&gt;...&lt;/span&gt; for gold text.</p>
                </InputGroup>
                <InputGroup label="Subtitle">
                   <StyledTextArea value={data.ctaSubtitle || ''} onChange={e=>setData({...data, ctaSubtitle: e.target.value})} placeholder="Transform your vision..." />
                </InputGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputGroup label="Button Text">
                      <StyledInput value={data.ctaButtonText || ''} onChange={e=>setData({...data, ctaButtonText: e.target.value})} placeholder="Get Pricing" />
                   </InputGroup>
                   <InputGroup label="Background Image URL">
                      <StyledInput value={data.ctaImage || ''} onChange={e=>setData({...data, ctaImage: e.target.value})} placeholder="https://..." />
                   </InputGroup>
                </div>
             </div>
          </div>

        </div>

        {/* Contact Section Side Column */}
        <div className="lg:col-span-4">
          <div className="bg-brand-dark text-white p-8 rounded-sm shadow-xl relative overflow-hidden sticky top-8">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold rounded-full opacity-20 blur-3xl"></div>
             <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2 text-brand-gold"><Settings className="w-5 h-5"/> Contact Info</h3>
             
             <div className="space-y-5">
               <div>
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Email Address</label>
                 <input className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-sm focus:border-brand-gold focus:outline-none" value={data.contactEmail} onChange={e=>setData({...data, contactEmail: e.target.value})} />
               </div>
               <div>
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Phone Number</label>
                 <input className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-sm focus:border-brand-gold focus:outline-none" value={data.contactPhone} onChange={e=>setData({...data, contactPhone: e.target.value})} />
               </div>
               <div>
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">HQ Address</label>
                 <textarea className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-sm focus:border-brand-gold focus:outline-none h-24" value={data.contactAddress} onChange={e=>setData({...data, contactAddress: e.target.value})} />
               </div>

               <button type="submit" disabled={loading} className="w-full bg-brand-gold hover:bg-white hover:text-brand-dark text-white py-4 rounded-sm font-bold uppercase tracking-widest text-xs transition-all mt-4 disabled:opacity-50">
                 {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : 'Save All Changes'}
               </button>
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const ServiceManager: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [newService, setNewService] = useState<ServiceItem>({ title: '', description: '', image: '', link: '' });
  const [view, setView] = useState<'list' | 'add'>('list');
  const [saving, setSaving] = useState(false);

  const refresh = async () => setServices(await getCollection<ServiceItem>('services'));
  useEffect(() => { refresh(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await addToCollection('services', newService);
    setNewService({ title: '', description: '', image: '', link: '' });
    await refresh();
    setSaving(false);
    setView('list');
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to remove this service?")) {
      await deleteDocument('services', id);
      refresh();
    }
  };

  return (
    <div className="animate-fadeIn">
      <PageHeader 
        title="Services & Offerings" 
        subtitle="Define the core services displayed on the homepage."
        action={view === 'list' && (
          <PrimaryButton onClick={() => setView('add')}>
            <Plus className="w-4 h-4" /> Add Service
          </PrimaryButton>
        )}
      />

      {view === 'add' && (
        <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-brand-gold mb-8 animate-scaleIn">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-serif font-bold text-brand-dark">Add New Service</h3>
             <IconButton onClick={() => setView('list')} className="hover:bg-gray-100"><X className="w-5 h-5"/></IconButton>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <InputGroup label="Service Title">
                 <StyledInput placeholder="e.g. Bespoke Tailoring" value={newService.title} onChange={e=>setNewService({...newService, title: e.target.value})} required />
               </InputGroup>
               <InputGroup label="Image URL">
                 <StyledInput placeholder="https://..." value={newService.image} onChange={e=>setNewService({...newService, image: e.target.value})} required />
               </InputGroup>
               <div className="bg-gray-50 p-4 rounded border border-gray-100 flex items-center justify-center h-32">
                  {newService.image ? (
                    <img src={newService.image} className="h-full object-contain rounded" alt="Preview" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">Image Preview</span>
                    </div>
                  )}
               </div>
            </div>
            <div className="space-y-4 flex flex-col">
               <InputGroup label="Description">
                 <StyledTextArea className="h-full min-h-[200px]" placeholder="Describe the service in detail..." value={newService.description} onChange={e=>setNewService({...newService, description: e.target.value})} required />
               </InputGroup>
               <div className="mt-auto pt-4 flex justify-end gap-4">
                  <button type="button" onClick={() => setView('list')} className="text-gray-400 hover:text-brand-dark font-bold uppercase text-xs tracking-widest px-4">Cancel</button>
                  <PrimaryButton type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Publish Service'}
                  </PrimaryButton>
               </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(s => (
          <div key={s.id} className="bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden border border-gray-100">
            <div className="h-56 overflow-hidden relative">
              <img src={s.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={s.title} />
              <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => handleDelete(s.id!)} className="bg-white text-red-500 p-3 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-serif font-bold text-xl text-brand-dark mb-2">{s.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{s.description}</p>
            </div>
          </div>
        ))}
        {services.length === 0 && view === 'list' && (
          <div className="col-span-full py-20 text-center bg-white border border-dashed border-gray-300 rounded-sm">
            <LayoutGrid className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">No services found. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TestimonialManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newItem, setNewItem] = useState<Testimonial>({ name: '', role: '', content: '', rating: 5, image: '' });
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [saving, setSaving] = useState(false);

  const refresh = async () => setTestimonials(await getCollection<Testimonial>('testimonials'));
  useEffect(() => { refresh(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await addToCollection('testimonials', newItem);
    setNewItem({ name: '', role: '', content: '', rating: 5, image: '' });
    await refresh();
    setSaving(false);
    setView('list');
  };

  const startEdit = (t: Testimonial) => {
    setEditItem({...t});
    setView('edit');
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem || !editItem.id) return;
    setSaving(true);
    const { id, ...data } = editItem;
    await updateDocument('testimonials', id, data);
    setEditItem(null);
    await refresh();
    setSaving(false);
    setView('list');
  };

  const handleDelete = async (id: string) => {
    if(confirm("Remove this review?")) {
      await deleteDocument('testimonials', id);
      refresh();
    }
  };

  return (
    <div className="animate-fadeIn">
      <PageHeader 
        title="Client Reviews" 
        subtitle="Curate the testimonials displayed on your site."
        action={view === 'list' && (
          <PrimaryButton onClick={() => setView('add')}>
            <Plus className="w-4 h-4" /> Add Review
          </PrimaryButton>
        )}
      />

      {view === 'add' && (
        <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-brand-gold mb-8">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-serif font-bold text-brand-dark">Add Client Testimonial</h3>
             <IconButton onClick={() => setView('list')} className="hover:bg-gray-100"><X className="w-5 h-5"/></IconButton>
           </div>
           <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Client Name">
                 <StyledInput value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} required />
              </InputGroup>
              <InputGroup label="Role / Title">
                 <StyledInput placeholder="e.g. Homeowner, Interior Designer" value={newItem.role} onChange={e=>setNewItem({...newItem, role: e.target.value})} required />
              </InputGroup>
            </div>
            
            <InputGroup label="Testimonial Content">
               <StyledTextArea placeholder="What did they say?" value={newItem.content} onChange={e=>setNewItem({...newItem, content: e.target.value})} required />
            </InputGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputGroup label="Rating (1-5)">
                  <StyledInput type="number" max="5" min="1" value={newItem.rating} onChange={e=>setNewItem({...newItem, rating: parseInt(e.target.value)})} required />
               </InputGroup>
               <InputGroup label="Client Photo URL (Optional)">
                  <StyledInput value={newItem.image} onChange={e=>setNewItem({...newItem, image: e.target.value})} />
               </InputGroup>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setView('list')} className="text-gray-400 hover:text-brand-dark font-bold uppercase text-xs tracking-widest px-4">Cancel</button>
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Review'}</PrimaryButton>
            </div>
          </form>
        </div>
      )}

      {view === 'edit' && editItem && (
        <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-brand-gold mb-8">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-serif font-bold text-brand-dark">Edit Client Testimonial</h3>
             <IconButton onClick={() => setView('list')} className="hover:bg-gray-100"><X className="w-5 h-5"/></IconButton>
           </div>
           <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Client Name">
                 <StyledInput value={editItem.name} onChange={e=>setEditItem({...editItem, name: e.target.value})} required />
              </InputGroup>
              <InputGroup label="Role / Title">
                 <StyledInput placeholder="e.g. Homeowner, Interior Designer" value={editItem.role} onChange={e=>setEditItem({...editItem, role: e.target.value})} required />
              </InputGroup>
            </div>
            
            <InputGroup label="Testimonial Content">
               <StyledTextArea placeholder="What did they say?" value={editItem.content} onChange={e=>setEditItem({...editItem, content: e.target.value})} required />
            </InputGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputGroup label="Rating (1-5)">
                  <StyledInput type="number" max="5" min="1" value={editItem.rating} onChange={e=>setEditItem({...editItem, rating: parseInt(e.target.value)})} required />
               </InputGroup>
               <InputGroup label="Client Photo URL (Optional)">
                  <StyledInput value={editItem.image} onChange={e=>setEditItem({...editItem, image: e.target.value})} />
               </InputGroup>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setView('list')} className="text-gray-400 hover:text-brand-dark font-bold uppercase text-xs tracking-widest px-4">Cancel</button>
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Updating...' : 'Update Review'}</PrimaryButton>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white rounded-sm shadow-sm p-8 relative border border-gray-100 hover:shadow-md transition-shadow">
             <div className="absolute top-6 right-6 flex gap-2">
                <div className="flex text-brand-gold">
                   {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'fill-current' : 'text-gray-200'}`} />)}
                </div>
             </div>
             
             <div className="mb-6">
                <MessageSquare className="w-8 h-8 text-brand-gold/20 mb-4" />
                <p className="text-gray-600 italic text-lg font-light leading-relaxed">"{t.content}"</p>
             </div>
             
             <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
               <img src={t.image || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
               <div className="flex-1">
                 <div className="font-serif font-bold text-brand-dark text-lg">{t.name}</div>
                 <div className="text-xs text-gray-400 uppercase tracking-wider">{t.role}</div>
               </div>
               <div className="flex gap-2">
                 <IconButton onClick={() => startEdit(t)} className="text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10">
                   <Pencil className="w-5 h-5" />
                 </IconButton>
                 <IconButton onClick={() => handleDelete(t.id!)} className="text-gray-300 hover:text-red-500 hover:bg-red-50">
                   <Trash2 className="w-5 h-5" />
                 </IconButton>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioManager: React.FC = () => {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  
  // Updated view state to handle editing
  const [view, setView] = useState<'list' | 'addCat' | 'editCat' | 'addProj' | 'editProj'>('list');
  
  // New Item States
  const [newCat, setNewCat] = useState({ name: '', mainCategory: 'Curtains', description: '', coverImage: '' });
  const [newProj, setNewProj] = useState({ title: '', categoryId: '', image: '' });
  
  // Edit Item States
  const [editCatData, setEditCatData] = useState<PortfolioCategory | null>(null);
  const [editProjData, setEditProjData] = useState<PortfolioProject | null>(null);
  
  const [saving, setSaving] = useState(false);

  // Tabs
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>('All');
  const [activeProjectTab, setActiveProjectTab] = useState<string>('All');

  const refresh = async () => {
    setCategories(await getCollection<PortfolioCategory>('categories'));
    setProjects(await getCollection<PortfolioProject>('projects'));
  };
  useEffect(() => { refresh(); }, []);

  // --- Handlers for Adding ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await addToCollection('categories', { ...newCat });
    setNewCat({ name: '', mainCategory: 'Curtains', description: '', coverImage: '' });
    setView('list');
    await refresh();
    setSaving(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await addToCollection('projects', { title: newProj.title, categoryId: newProj.categoryId, url: newProj.image });
    setNewProj({ title: '', categoryId: '', image: '' });
    setView('list');
    await refresh();
    setSaving(false);
  };

  // --- Handlers for Editing ---
  const startEditCategory = (cat: PortfolioCategory) => {
    setEditCatData({ ...cat });
    setView('editCat');
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCatData || !editCatData.id) return;
    setSaving(true);
    const { id, ...data } = editCatData;
    await updateDocument('categories', id, data);
    setEditCatData(null);
    setView('list');
    await refresh();
    setSaving(false);
  };

  const startEditProject = (proj: PortfolioProject) => {
    setEditProjData({ ...proj });
    setView('editProj');
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProjData || !editProjData.id) return;
    setSaving(true);
    const { id, ...data } = editProjData;
    await updateDocument('projects', id, data);
    setEditProjData(null);
    setView('list');
    await refresh();
    setSaving(false);
  };

  // --- Delete Handler ---
  const handleDelete = async (collectionName: string, id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
       await deleteDocument(collectionName, id);
       refresh();
    }
  };

  // --- Filtering ---
  const filteredCategories = activeCollectionTab === 'All' 
    ? categories 
    : categories.filter(c => c.mainCategory === activeCollectionTab);

  const filteredProjects = activeProjectTab === 'All'
    ? projects
    : projects.filter(p => {
        const cat = categories.find(c => c.id === p.categoryId);
        return cat?.mainCategory === activeProjectTab;
    });

  const TabGroup = ({ active, onChange }: { active: string, onChange: (val: string) => void }) => (
     <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-100">
        {['All', 'Curtains', 'Blinds', 'Furniture Covers'].map(tab => (
           <button
             key={tab}
             onClick={() => onChange(tab)}
             className={`px-4 py-3 text-xs font-bold uppercase tracking-widest relative top-[1px] transition-colors ${
                active === tab 
                  ? 'text-brand-dark border-b-2 border-brand-gold' 
                  : 'text-gray-400 hover:text-brand-dark'
             }`}
           >
             {tab}
           </button>
        ))}
     </div>
  );

  return (
    <div className="animate-fadeIn">
      <PageHeader 
        title="Portfolio Collections" 
        subtitle="Manage your project categories and individual project images."
        action={view === 'list' && (
          <div className="flex gap-3">
            <button onClick={() => setView('addCat')} className="px-4 py-2 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 flex items-center gap-2">
              <Plus className="w-3 h-3"/> New Category
            </button>
            <PrimaryButton onClick={() => setView('addProj')}>
              <Plus className="w-3 h-3"/> New Project
            </PrimaryButton>
          </div>
        )}
      />

      {/* --- ADD CATEGORY FORM --- */}
      {view === 'addCat' && (
        <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-brand-dark mb-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-serif font-bold text-brand-dark mb-6">Create Collection Category</h3>
          <form onSubmit={handleAddCategory} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputGroup label="Collection Name">
                 <StyledInput value={newCat.name} onChange={e=>setNewCat({...newCat, name: e.target.value})} required />
               </InputGroup>
               <InputGroup label="Type">
                 <StyledSelect value={newCat.mainCategory} onChange={e=>setNewCat({...newCat, mainCategory: e.target.value as any})}>
                   <option value="Curtains">Curtains</option>
                   <option value="Blinds">Blinds</option>
                   <option value="Furniture Covers">Furniture Covers</option>
                 </StyledSelect>
               </InputGroup>
             </div>
             <InputGroup label="Description">
                <StyledTextArea value={newCat.description} onChange={e=>setNewCat({...newCat, description: e.target.value})} required />
             </InputGroup>
             <InputGroup label="Cover Image URL">
                <StyledInput value={newCat.coverImage} onChange={e=>setNewCat({...newCat, coverImage: e.target.value})} required />
             </InputGroup>
             <div className="flex justify-end gap-4">
               <button type="button" onClick={() => setView('list')} className="text-gray-400 font-bold text-xs uppercase tracking-widest px-4 hover:text-brand-dark">Cancel</button>
               <PrimaryButton type="submit" disabled={saving}>{saving ? 'Create Category' : 'Create Category'}</PrimaryButton>
             </div>
          </form>
        </div>
      )}

      {/* --- EDIT CATEGORY FORM --- */}
      {view === 'editCat' && editCatData && (
        <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-brand-dark mb-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-serif font-bold text-brand-dark mb-6">Edit Collection Category</h3>
          <form onSubmit={handleUpdateCategory} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputGroup label="Collection Name">
                 <StyledInput value={editCatData.name} onChange={e=>setEditCatData({...editCatData, name: e.target.value})} required />
               </InputGroup>
               <InputGroup label="Type">
                 <StyledSelect value={editCatData.mainCategory} onChange={e=>setEditCatData({...editCatData, mainCategory: e.target.value as any})}>
                   <option value="Curtains">Curtains</option>
                   <option value="Blinds">Blinds</option>
                   <option value="Furniture Covers">Furniture Covers</option>
                 </StyledSelect>
               </InputGroup>
             </div>
             <InputGroup label="Description">
                <StyledTextArea value={editCatData.description} onChange={e=>setEditCatData({...editCatData, description: e.target.value})} required />
             </InputGroup>
             <InputGroup label="Cover Image URL">
                <StyledInput value={editCatData.coverImage} onChange={e=>setEditCatData({...editCatData, coverImage: e.target.value})} required />
             </InputGroup>
             <div className="flex justify-end gap-4">
               <button type="button" onClick={() => setView('list')} className="text-gray-400 font-bold text-xs uppercase tracking-widest px-4 hover:text-brand-dark">Cancel</button>
               <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Category'}</PrimaryButton>
             </div>
          </form>
        </div>
      )}

      {/* --- ADD PROJECT FORM --- */}
      {view === 'addProj' && (
         <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-brand-gold mb-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-serif font-bold text-brand-dark mb-6">Add Project Image</h3>
          <form onSubmit={handleAddProject} className="space-y-6">
             <InputGroup label="Project Title">
                <StyledInput value={newProj.title} onChange={e=>setNewProj({...newProj, title: e.target.value})} required />
             </InputGroup>
             <InputGroup label="Assign to Category">
               <StyledSelect value={newProj.categoryId} onChange={e=>setNewProj({...newProj, categoryId: e.target.value})} required>
                 <option value="">Select Category...</option>
                 {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </StyledSelect>
             </InputGroup>
             <InputGroup label="Image URL">
                <StyledInput value={newProj.image} onChange={e=>setNewProj({...newProj, image: e.target.value})} required />
             </InputGroup>
             <div className="flex justify-end gap-4">
               <button type="button" onClick={() => setView('list')} className="text-gray-400 font-bold text-xs uppercase tracking-widest px-4 hover:text-brand-dark">Cancel</button>
               <PrimaryButton type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add Project'}</PrimaryButton>
             </div>
          </form>
        </div>
      )}

      {/* --- EDIT PROJECT FORM --- */}
      {view === 'editProj' && editProjData && (
         <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-brand-gold mb-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-serif font-bold text-brand-dark mb-6">Edit Project Image</h3>
          <form onSubmit={handleUpdateProject} className="space-y-6">
             <InputGroup label="Project Title">
                <StyledInput value={editProjData.title} onChange={e=>setEditProjData({...editProjData, title: e.target.value})} required />
             </InputGroup>
             <InputGroup label="Assign to Category">
               <StyledSelect value={editProjData.categoryId} onChange={e=>setEditProjData({...editProjData, categoryId: e.target.value})} required>
                 <option value="">Select Category...</option>
                 {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </StyledSelect>
             </InputGroup>
             <InputGroup label="Image URL">
                <StyledInput value={editProjData.url} onChange={e=>setEditProjData({...editProjData, url: e.target.value})} required />
             </InputGroup>
             <div className="flex justify-end gap-4">
               <button type="button" onClick={() => setView('list')} className="text-gray-400 font-bold text-xs uppercase tracking-widest px-4 hover:text-brand-dark">Cancel</button>
               <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Project'}</PrimaryButton>
             </div>
          </form>
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-12">
          {/* Categories Section */}
          <section>
             <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-6">Active Collections</h3>
             
             <TabGroup active={activeCollectionTab} onChange={setActiveCollectionTab} />

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
               {filteredCategories.map(cat => (
                 <div key={cat.id} className="group relative bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-48 overflow-hidden relative">
                       <img src={cat.coverImage} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                       <div className="absolute top-0 right-0 bg-brand-gold text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">{cat.mainCategory}</div>
                    </div>
                    <div className="p-5">
                       <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif font-bold text-xl text-brand-dark">{cat.name}</h4>
                            <p className="text-xs text-gray-400 mt-1">{projects.filter(p => p.categoryId === cat.id).length} Projects</p>
                          </div>
                          <div className="flex gap-2">
                            <IconButton onClick={() => startEditCategory(cat)} className="text-gray-300 hover:text-brand-gold"><Pencil className="w-4 h-4"/></IconButton>
                            <IconButton onClick={() => handleDelete('categories', cat.id!)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></IconButton>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
               {filteredCategories.length === 0 && <div className="col-span-full text-center py-8 text-gray-400 italic">No categories found for this filter.</div>}
             </div>
          </section>

          {/* Projects Section */}
          <section>
             <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-6">Recent Projects</h3>
             
             <TabGroup active={activeProjectTab} onChange={setActiveProjectTab} />

             <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
                {filteredProjects.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredProjects.map(p => {
                      const cat = categories.find(c => c.id === p.categoryId);
                      return (
                        <div key={p.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                          <img src={p.url} className="w-16 h-16 object-cover rounded-sm mr-4" alt={p.title} />
                          <div className="flex-1">
                            <h4 className="font-bold text-brand-dark text-sm">{p.title}</h4>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">{cat?.name || 'Uncategorized'}</span>
                          </div>
                          <div className="flex gap-2">
                            <IconButton onClick={() => startEditProject(p)} className="text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10"><Pencil className="w-4 h-4"/></IconButton>
                            <IconButton onClick={() => handleDelete('projects', p.id!)} className="text-gray-300 hover:text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4"/></IconButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">No projects found for this filter.</div>
                )}
             </div>
          </section>
        </div>
      )}
    </div>
  );
};

const HomeEditor: React.FC = () => {
  const [data, setData] = useState({ title: '', subtitle: '', images: [] as string[] });
  const [loading, setLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const fetchHome = async () => {
      const docData = await getDocument<{hero: any}>('content', 'home');
      if (docData?.hero) setData(docData.hero);
    };
    fetchHome();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    await setDocument('content', 'home', { hero: data });
    setLoading(false);
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto">
      <PageHeader 
        title="Homepage Hero" 
        subtitle="Customize the first impression of your website."
      />

      <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
         <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <InputGroup label="Main Headline">
                 <StyledInput value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="Drape your World in Luxury" className="text-lg font-serif font-bold" />
              </InputGroup>
              <InputGroup label="Subtitle">
                 <StyledTextArea value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})} placeholder="Elevate your ambience..." />
              </InputGroup>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Carousel Images</label>
                  <span className="text-xs text-gray-400">{data.images.length} Active Slides</span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 {data.images.map((img, idx) => (
                   <div key={idx} className="relative group aspect-[3/4] rounded-sm overflow-hidden shadow-sm">
                     <img src={img} className="w-full h-full object-cover" alt="" />
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => setData({...data, images: data.images.filter((_, i) => i !== idx)})} className="text-white p-2 bg-red-500 rounded-full hover:scale-110 transition-transform">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 ))}
                 <div className="border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center p-4 hover:border-brand-gold transition-colors aspect-[3/4]">
                    <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold text-center">Add Image URL below</span>
                 </div>
               </div>

               <div className="flex gap-3">
                 <div className="flex-1">
                    <StyledInput placeholder="https://picsum.photos/..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
                 </div>
                 <button 
                    type="button"
                    onClick={() => { if(newImageUrl) { setData({...data, images: [...data.images, newImageUrl]}); setNewImageUrl(''); }}} 
                    className="bg-brand-dark text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                 >
                    Add Slide
                 </button>
               </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <PrimaryButton onClick={handleSave} disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Homepage Changes'}
              </PrimaryButton>
            </div>
         </div>
      </div>
    </div>
  );
};
