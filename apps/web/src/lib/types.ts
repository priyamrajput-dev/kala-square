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

// -------------------------------------------------------------
// Artist Profile Specific Interfaces (Prompt 4)
// -------------------------------------------------------------

export interface PhysicalStats {
  height?: string;
  weight?: string;
  waist?: string;
  chest?: string;
  hairType?: string;
  hairLength?: string;
  languages?: string[];
}

export interface QuickStats {
  experienceYears?: string;
  projectsCount?: string;
  liveShowsCount?: string;
  totalFollowersLabel?: string;
}

export interface FanbasePlatform {
  key: 'fbSp' | 'fbYt' | 'fbIg' | 'fbFb' | 'fbDz' | 'fbSc' | 'fbTt';
  name: string;
  label: string;
  color: string;
  count: string;
  numValue: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  youtubeId: string;
  views?: string;
}

export interface ClipItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
}

export interface SongItem {
  id: string;
  title: string;
  plays?: string;
  duration?: string;
  url: string;
}

export interface CampaignItem {
  id: string;
  brandName: string;
  category: string;
  year: string;
  description?: string;
  imageUrl?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  category: string;
  year: string;
  description?: string;
}

export interface IMDbCredit {
  id: string;
  title: string;
  year?: string;
  role?: string;
  type?: string;
  isKnownFor?: boolean;
  imdbUrl?: string;
}

export interface IMDbData {
  rating?: string;
  imdbUrl?: string;
  knownFor?: string[];
  credits: IMDbCredit[];
}

export interface ReviewItem {
  id: string;
  authorName: string;
  date: string;
  rating: number;
  comment: string;
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  facebook?: string;
  x?: string;
  spotify?: string;
  imdb?: string;
}

export interface ArtistProfile {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  bio: string;
  photoUrl: string;
  city: string;
  state?: string;
  phone?: string;
  email?: string;
  categories: string[];
  specializations?: string[];
  artistClass: 'platinum' | 'rising' | 'emerging' | 'standard';
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  priceLabel: string;
  physicalStats?: PhysicalStats;
  quickStats: QuickStats;
  fanbase: FanbasePlatform[];
  gallery: GalleryImage[];
  videos: VideoItem[];
  clips: ClipItem[];
  topSongs?: SongItem[];
  campaigns: CampaignItem[];
  awards: AwardItem[];
  imdb?: IMDbData;
  faqs?: FAQItem[];
  reviews: ReviewItem[];
  social: SocialLinks;
}
