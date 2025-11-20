
export interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  image: string;
  link?: string; // Optional, for 'View More'
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

export interface ClientLogo {
  id?: string;
  name: string;
  logo: string;
}

export interface Article {
  id: string;
  date: string;
  title: string;
  category: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// --- CMS Types ---

export type MainCategory = 'Curtains' | 'Blinds' | 'Furniture Covers';

export interface PortfolioCategory {
  id?: string;
  name: string;
  mainCategory: MainCategory;
  description: string;
  coverImage: string;
}

export interface PortfolioProject {
  id?: string;
  categoryId: string;
  title: string;
  url: string; // Image URL
}

export interface HeroContent {
  title: string;
  subtitle: string;
  images: string[]; // Carousel images
}

export interface GeneralContent {
  aboutTitle: string;
  aboutDescription: string;
  aboutImageMain?: string;
  aboutImageSmall?: string;
  statsYears: string;
  statsProjects: string;
  statsClients: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  // CTA Section
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaImage?: string;
}

export interface SiteContent {
  id?: string;
  hero?: HeroContent;
  general?: GeneralContent;
}