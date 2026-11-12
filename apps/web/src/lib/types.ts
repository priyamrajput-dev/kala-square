export interface Artist {
  id: string;
  name: string;
  slug: string;
  cat: string;
  categories?: string[];
  city: string;
  state?: string;
  tier: 'platinum' | 'rising' | 'emerging' | 'standard';
  badgeType?: 'platinum' | 'new' | 'rising';
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  priceLabel: string;
  photoUrl: string;
  tagline?: string;
  followers?: string;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
  iconSvg: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  city: string;
  venueName?: string;
  category?: string;
  badge: 'Trending' | 'New' | 'Filling Fast' | 'KS Original' | 'none';
  badgeColor?: 'coral' | 'green' | 'orange' | 'black';
  imageUrl: string;
  description?: string;
}

export interface VenueItem {
  id: string;
  slug: string;
  name: string;
  city: string;
  code: string;
  category: string;
  capacity?: string;
  priceLabel?: string;
  imageUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SpotlightItem {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  imageUrl: string;
}
