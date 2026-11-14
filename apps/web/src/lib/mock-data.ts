// Fallback only, real data comes from API in Prompt 7.
// This mock dataset serves as an offline resilience layer when the Fastify API is offline.
import {
  Artist,
  Category,
  EventItem,
  VenueItem,
  FAQItem,
  SpotlightItem,
  ArtistProfile,
  FanbasePlatform,
  Enquiry,
} from './types';
import { HomeConfig } from './validators/home-config';

export const mockArtists: Artist[] = [
  // Platinum Artists
  {
    id: 'a1',
    name: 'Jai Vijay Sachan',
    slug: 'jai-vijay-sachan',
    cat: 'Actor',
    categories: ['Actor'],
    city: 'Delhi',
    tier: 'platinum',
    badgeType: 'platinum',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 38,
    priceLabel: 'From ₹50,000',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    tagline: "India's Got Talent Finalist · Mimicry Artist · Stand-up Comic",
    followers: '1.8M',
  },
  {
    id: 'a2',
    name: 'Vijay Vikram Singh',
    slug: 'vijay-vikram-singh',
    cat: 'Actor',
    categories: ['Actor'],
    city: 'Mumbai',
    tier: 'platinum',
    badgeType: 'platinum',
    isVerified: true,
    rating: 5.0,
    reviewsCount: 64,
    priceLabel: 'From ₹1,00,000',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    tagline: "Narrator's Voice of Bigg Boss · Actor · Keynote Speaker",
    followers: '420K',
  },
  {
    id: 'a3',
    name: 'Dinesh Bawra',
    slug: 'dinesh-bawra',
    cat: 'Poets',
    categories: ['Poets'],
    city: 'Delhi',
    tier: 'platinum',
    badgeType: 'platinum',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 29,
    priceLabel: 'From ₹50,000',
    photoUrl: '',
    tagline: 'Celebrated Hasya Kavi & Satirist · 500+ TV Shows',
    followers: '210K',
  },
  {
    id: 'a4',
    name: 'Dr. Mansi Dwivedi',
    slug: 'dr-mansi-dwivedi',
    cat: 'Poets',
    categories: ['Poets'],
    city: 'Lucknow',
    tier: 'platinum',
    badgeType: 'platinum',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 32,
    priceLabel: 'From ₹50,000',
    photoUrl: '',
    tagline: 'Renowned Hindi Poetess & Stage Performer',
    followers: '340K',
  },
  {
    id: 'a5',
    name: 'Ajay Hooda',
    slug: 'ajay-hooda',
    cat: 'Singer',
    categories: ['Singer'],
    city: 'Haryana',
    tier: 'platinum',
    badgeType: 'platinum',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 88,
    priceLabel: 'From ₹1,50,000',
    photoUrl: '',
    tagline: 'Haryanvi Superhit Singer & Performer',
    followers: '2.5M',
  },

  // New on KalaSquare
  {
    id: 'a6',
    name: 'Kabir Anand',
    slug: 'kabir-anand',
    cat: 'Fitness',
    categories: ['Fitness'],
    city: 'Mumbai',
    tier: 'platinum',
    badgeType: 'platinum',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 42,
    priceLabel: 'From ₹75,000',
    photoUrl: '',
    tagline: 'Celebrity Fitness Coach & Athlete',
    followers: '520K',
  },

  {
    id: 'a7',
    name: 'Rohan Kapoor',
    slug: 'rohan-kapoor',
    cat: 'Influencer',
    categories: ['Influencer'],
    city: 'Delhi',
    tier: 'platinum',
    badgeType: 'platinum',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 45,
    priceLabel: 'From ₹75,000',
    photoUrl: '',
    tagline: 'Digital Creator & Brand Ambassador',
    followers: '1.2M',
  },
  {
    id: 'a10',
    name: 'Aarav Mehta',
    slug: 'aarav-mehta',
    cat: 'Standup Comedy',
    categories: ['Standup Comedy'],
    city: 'Delhi',
    tier: 'rising',
    badgeType: 'rising',
    isVerified: true,
    rating: 4.7,
    reviewsCount: 14,
    priceLabel: 'From ₹25,000',
    photoUrl: '',
    tagline: 'Observational humorist & comedy club headliner',
    followers: '72K',
  },
  {
    id: 'a15',
    name: 'Sahil Badal',
    slug: 'sahil-badal',
    cat: 'Singer',
    categories: ['Singer'],
    city: 'Haryana',
    tier: 'platinum',
    badgeType: 'platinum',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 47,
    priceLabel: 'From ₹50,000',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    tagline: 'Folk & Devotional Vocalist · 50+ Original Singles',
    followers: '150K',
  },
  {
    id: 'a11',
    name: 'Tanya Bose',
    slug: 'tanya-bose',
    cat: 'Emcee & Anchor',
    categories: ['Emcee', 'Anchor'],
    city: 'Bangalore',
    tier: 'rising',
    badgeType: 'new',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 19,
    priceLabel: 'From ₹30,000',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    tagline: 'Bilingual Corporate & Wedding Host',
    followers: '29K',
  },
  {
    id: 'a12',
    name: 'Ishaan Rao',
    slug: 'ishaan-rao',
    cat: 'DJ & Music Producer',
    categories: ['DJ', 'Musician'],
    city: 'Bangalore',
    tier: 'emerging',
    badgeType: 'new',
    isVerified: true,
    rating: 4.6,
    reviewsCount: 11,
    priceLabel: 'From ₹35,000',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    tagline: 'Electronic, Commercial & Bollywood Beats',
    followers: '110K',
  },
  {
    id: 'a17',
    name: 'Neha Arora',
    slug: 'neha-arora',
    cat: 'Classical & Contemporary Dancer',
    categories: ['Dancer'],
    city: 'Mumbai',
    tier: 'emerging',
    badgeType: 'new',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 22,
    priceLabel: 'From ₹40,000',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    tagline: 'Kathak & Bollywood Choreographer',
    followers: '61K',
  },

  // Rising Artists
  {
    id: 'a8',
    name: 'Ria Bally',
    slug: 'ria-bally',
    cat: 'Sufi & Bollywood Singer',
    categories: ['Singer'],
    city: 'Mumbai',
    tier: 'rising',
    badgeType: 'rising',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 31,
    priceLabel: 'From ₹35,000',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80',
    tagline: 'Live Band Vocalist & Playback Singer',
    followers: '64K',
  },
  {
    id: 'a9',
    name: 'Khushboo Choubey',
    slug: 'khushboo-choubey',
    cat: 'Folk & Devotional Vocalist',
    categories: ['Singer'],
    city: 'Varanasi',
    tier: 'rising',
    badgeType: 'rising',
    isVerified: true,
    rating: 4.7,
    reviewsCount: 26,
    priceLabel: 'From ₹20,000',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    tagline: 'Authentic Purvanchali & Bhojpuri Folk',
    followers: '38K',
  },
  {
    id: 'a18',
    name: 'Kunal Verma',
    slug: 'kunal-verma',
    cat: 'Theatre & Screen Actor',
    categories: ['Actor'],
    city: 'Mumbai',
    tier: 'standard',
    badgeType: 'rising',
    isVerified: false,
    rating: 4.5,
    reviewsCount: 8,
    priceLabel: 'From ₹15,000',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
    tagline: 'Method Actor · Ad Films & Web Shows',
    followers: '8K',
  },
  {
    id: 'a16',
    name: 'Keshav Nagar',
    slug: 'keshav-nagar',
    cat: 'Ghazal & Acoustic Singer',
    categories: ['Singer', 'Musician'],
    city: 'Delhi',
    tier: 'emerging',
    badgeType: 'rising',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 17,
    priceLabel: 'From ₹25,000',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    tagline: 'Intimate Baithaks & Acoustic Lounge Sessions',
    followers: '22K',
  },
];

export const mockCategories: Category[] = [
  {
    slug: 'singer',
    name: 'Singers',
    count: 128,
    iconSvg: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  },
  {
    slug: 'poets',
    name: 'Poets',
    count: 46,
    iconSvg: '<path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5zM12 6v13"/>',
  },
  {
    slug: 'actor',
    name: 'Actors',
    count: 73,
    iconSvg: '<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M3 9l3-5h3L6 9M10 9l3-5h3l-3 5M17 9l3-5"/>',
  },
  {
    slug: 'anchors',
    name: 'Anchors',
    count: 38,
    iconSvg: '<circle cx="12" cy="12" r="2"/><path d="M7.5 7.5a6 6 0 0 0 0 9M16.5 7.5a6 6 0 0 1 0 9M4.5 4.5a10 10 0 0 0 0 15M19.5 4.5a10 10 0 0 1 0 15"/>',
  },
  {
    slug: 'influencer',
    name: 'Influencers',
    count: 214,
    iconSvg: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  },
  {
    slug: 'writer',
    name: 'Writers',
    count: 31,
    iconSvg: '<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>',
  },
  {
    slug: 'standup-comedy',
    name: 'Standup comedy',
    count: 54,
    iconSvg: '<circle cx="12" cy="12" r="9"/><path d="M8 14c1 2 2.5 3 4 3s3-1 4-3M9 9.5h.01M15 9.5h.01"/>',
  },
  {
    slug: 'food-vloggers',
    name: 'Food vloggers',
    count: 89,
    iconSvg: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-3 4-3 7h3v11"/>',
  },
  {
    slug: 'dancer',
    name: 'Dancers',
    count: 97,
    iconSvg: '<circle cx="12" cy="4.5" r="2"/><path d="M12 7v6M12 9l-4 3M12 9l4-2M12 13l-3 6M12 13l4 5"/>',
  },
  {
    slug: 'fitness-health',
    name: 'Fitness',
    count: 63,
    iconSvg: '<path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/>',
  },
  {
    slug: 'speaker',
    name: 'Speakers',
    count: 27,
    iconSvg: '<path d="M4 10v4h3l7 4V6L7 10zM17 9a4 4 0 0 1 0 6"/>',
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    count: 41,
    iconSvg: '<rect x="3" y="8" width="18" height="10" rx="5"/><path d="M8 11v4M6 13h4M15.5 12h.01M18 14h.01"/>',
  },
];

export const mockSpotlights: SpotlightItem[] = [
  {
    id: 'sp1',
    title: 'The Great Indian Kala Festival 2026',
    subtitle: 'Celebrating 500+ performers across 8 stages in New Delhi',
    link: '#events',
    imageUrl: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp2',
    title: "India's Next Voice: Season 3 Auditions",
    subtitle: 'Registrations now open for rising vocal talent across India',
    link: '#events',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp3',
    title: 'Corporate Entertainment Showcase',
    subtitle: 'Curated lineup of emcees, mentalists, and live musicians',
    link: '#events',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
  },
];

export const mockEvents: EventItem[] = [
  {
    id: 'e1',
    slug: 'kala-utsav-2026',
    title: 'Kala Utsav 2026',
    date: '14 Nov 2026',
    city: 'Delhi',
    venueName: 'Kala Utsav 2026',
    badge: 'Trending',
    badgeColor: 'coral',
    imageUrl: '',
    description: 'A cultural extravaganza with theatre, dance, and music.',
  },
  {
    id: 'e2',
    slug: 'open-mic-night',
    title: 'Open Mic Night',
    date: '25 Oct 2026',
    city: 'Noida',
    venueName: 'Open Mic Night',
    badge: 'New',
    badgeColor: 'green',
    imageUrl: '',
    description: 'Weekly open mic platform for poets, comics and singers.',
  },
  {
    id: 'e3',
    slug: 'standup-stage',
    title: 'Standup Stage',
    date: 'Live comedy',
    city: 'KalaSquare',
    venueName: 'Standup Stage',
    badge: 'Filling fast',
    badgeColor: 'orange',
    imageUrl: '',
    description: 'Curated stand-up comedy specials live on stage.',
  },
  {
    id: 'e4',
    slug: 'poetry-square',
    title: 'Poetry Square',
    date: '2 Nov 2026',
    city: 'Delhi',
    venueName: 'Poetry Square',
    badge: 'KS Original',
    badgeColor: 'black',
    imageUrl: '',
    description: 'Exclusive poetry recitals produced by KalaSquare.',
  },
];

export const mockVenues: VenueItem[] = [
  {
    id: 'v1',
    slug: 'comedy-county',
    name: 'Comedy County',
    city: 'Noida',
    code: 'CO',
    category: 'Comedy Club & Stage',
    capacity: '200 Guests',
    priceLabel: 'From ₹25,000 / day',
    imageUrl: '',
  },
  {
    id: 'v2',
    slug: 'rasa-the-stage',
    name: 'Rasā – The Stage',
    city: 'Mumbai',
    code: 'RA',
    category: 'Theatre & Performance Stage',
    capacity: '450 Guests',
    priceLabel: 'From ₹75,000 / day',
    imageUrl: '',
  },
  {
    id: 'v3',
    slug: 'studio-productions',
    name: 'Studio & Productions',
    city: 'South Delhi',
    code: 'ST',
    category: 'Production & Jam Studio',
    capacity: '100 Guests',
    priceLabel: 'From ₹20,000 / day',
    imageUrl: '',
  },
  {
    id: 'v4',
    slug: 'stage-five',
    name: 'Stage Five',
    city: 'Gurugram',
    code: 'SF',
    category: 'Acoustic Studio & Jam Room',
    capacity: '150 Guests',
    priceLabel: 'From ₹30,000 / day',
    imageUrl: '',
  },
];

export const mockFAQs: FAQItem[] = [
  {
    question: 'What is KalaSquare?',
    answer:
      'KalaSquare is an artist marketplace and management platform. We onboard artists, find them paid collaborations with brands, shows and projects, and list entertainment venues.',
  },
  {
    question: 'How do I join as an artist?',
    answer:
      'Create your profile and get listed. A basic listing is free. You can upgrade to a Blue badge for Rs 999 a year.',
  },
  {
    question: 'Are all opportunities paid?',
    answer:
      'Yes. KalaSquare is a paid, premium platform, and the brand jobs, collaborations and shows listed here are paid opportunities.',
  },
  {
    question: 'What are the Golden and Crown badges?',
    answer:
      "Golden and Crown badges go to competition winners. They can't be bought.",
  },
  {
    question: "What is India's Next Voice?",
    answer:
      "India's Next Voice is KalaSquare's singing competition. You can register for it from the Events section.",
  },
  {
    question: 'Can I list my venue?',
    answer:
      'Yes. Entertainment venues of all kinds can be listed. Venue listing is a paid service.',
  },
];

export const mockArtistProfiles: ArtistProfile[] = [
  // 1. Platinum Singer: Sahil Badal (from Kalasquare_Home_Page_Manager_2.html line 1898-1901)
  {
    id: 'a15',
    slug: 'sahil-badal',
    name: 'Sahil Badal',
    tagline: 'Singer · Lyricist · Devotional and folk',
    bio: 'Sahil Badal is a singer and lyricist from Haryana, known for devotional and folk numbers. This is a sample profile written for the demo. Replace it from Admin → Artists → Edit.',
    photoUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    city: 'Haryana',
    state: 'Haryana',
    phone: '',
    email: '',
    categories: ['Singer'],
    specializations: ['Singer', 'Lyrics Writer'],
    artistClass: 'platinum',
    isVerified: true,
    rating: 0,
    reviewsCount: 0,
    priceLabel: '₹50K–₹1L',
    quickStats: {
      experienceYears: '18+',
      projectsCount: '50+',
      liveShowsCount: '150+',
    },
    fanbase: [
      { key: 'fbSp', name: 'Spotify', label: 'Followers', color: '#1DB954', count: '18.4K', numValue: 18400 },
      { key: 'fbYt', name: 'YouTube', label: 'Subscribers', color: '#FF0000', count: '9.2K', numValue: 9200 },
      { key: 'fbIg', name: 'Instagram', label: 'Followers', color: '#C13584', count: '14.8K', numValue: 14800 },
      { key: 'fbFb', name: 'Facebook', label: 'Followers', color: '#1877F2', count: '5.1K', numValue: 5100 },
      { key: 'fbDz', name: 'Deezer', label: 'Fans', color: '#A238FF', count: '640', numValue: 640 },
      { key: 'fbSc', name: 'SoundCloud', label: 'Followers', color: '#FF5500', count: '1.2K', numValue: 1200 },
      { key: 'fbTt', name: 'TikTok', label: 'Followers', color: '#161616', count: '2.3K', numValue: 2300 },
    ],
    gallery: [],
    videos: [
      { id: 'v1', title: 'Live performance', url: '', youtubeId: '' },
    ],
    clips: [],
    topSongs: [
      { id: 's1', title: 'Kedarnath', duration: '3:20', plays: '10k', url: 'https://open.spotify.com/' },
      { id: 's2', title: 'Lal Ghagra', duration: '3:05', plays: '8k', url: 'https://open.spotify.com/' },
      { id: 's3', title: 'Wo Mera Bhola Hain', duration: '4:10', plays: '6k', url: 'https://open.spotify.com/' },
    ],
    campaigns: [],
    awards: [],
    faqs: [
      { question: 'How far in advance should I book?', answer: 'We recommend booking 3 to 4 weeks ahead for weekends and festive dates. Last-minute dates are possible on request.' },
      { question: 'What is included in the fee?', answer: 'The fee covers the performance or session. Travel, stay and special technical needs are discussed in the enquiry.' },
      { question: 'Can the artist travel outside the home city?', answer: 'Yes. Share your city and event type and the KalaSquare team will confirm availability and travel cost.' },
    ],
    reviews: [],
    social: {
      spotify: 'https://open.spotify.com/',
    },
  },

  // 2. Actor with IMDb: Vijay Vikram Singh (from Kalasquare_Home_Page_Manager_2.html line 1891-1897)
  {
    id: 'a2',
    slug: 'vijay-vikram-singh',
    name: 'Vijay Vikram Singh',
    tagline: "Narrator's Voice of Bigg Boss · Speaker | Actor · Voice & Communication Trainer, Story Teller",
    bio: "Vijay Vikram Singh is a voice artist, speaker and actor, best known as the narrator's voice of Bigg Boss. He trains people in voice and communication, and tells stories on stage, in podcasts and on TEDx platforms.\n\nWith more than twenty years in front of the mic and the camera, he brings a rare mix of warmth, authority and humour to every project, from brand films and documentaries to live shows and corporate events.\n\nThis is a sample profile written for the demo. Replace it from Admin → Artists → Edit.",
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '',
    email: '',
    categories: ['Actor'],
    specializations: ['Actor', 'Voice-over artist', 'Narrator'],
    artistClass: 'platinum',
    isVerified: true,
    rating: 0,
    reviewsCount: 0,
    priceLabel: '₹1L+',
    physicalStats: {
      height: "5' 10",
      languages: ['Hindi', 'English'],
    },
    quickStats: {
      experienceYears: '20+',
      projectsCount: '200+',
      liveShowsCount: '100+',
      totalFollowersLabel: '190k',
    },
    fanbase: [
      { key: 'fbIg', name: 'Instagram', label: 'Followers', color: '#C13584', count: '120.0K', numValue: 120000 },
      { key: 'fbYt', name: 'YouTube', label: 'Subscribers', color: '#FF0000', count: '42.0K', numValue: 42000 },
      { key: 'fbFb', name: 'Facebook', label: 'Followers', color: '#1877F2', count: '28.0K', numValue: 28000 },
    ],
    gallery: [],
    videos: [
      { id: 'v1', title: 'Podcast', url: '', youtubeId: '' },
      { id: 'v2', title: 'Self growth', url: '', youtubeId: '' },
      { id: 'v3', title: 'Poetry', url: '', youtubeId: '' },
      { id: 'v4', title: 'Manifesting', url: '', youtubeId: '' },
      { id: 'v5', title: 'TEDx talk', url: '', youtubeId: '' },
      { id: 'v6', title: 'Podcast', url: '', youtubeId: '' },
    ],
    clips: [
      { id: 'c1', title: 'Behind the mic', url: '' },
      { id: 'c2', title: 'Studio day', url: '' },
      { id: 'c3', title: 'Stage moments', url: '' },
      { id: 'c4', title: 'Voice tips', url: '' },
    ],
    campaigns: [],
    awards: [],
    imdb: {
      imdbUrl: 'https://www.imdb.com/',
      knownFor: ['Bigg Boss'],
      credits: [
        { id: 'im1', title: 'Bigg Boss', role: 'Narrator (voice)', type: 'Reality TV', isKnownFor: true, year: '' },
      ],
    },
    faqs: [
      { question: 'How far in advance should I book?', answer: 'We recommend booking 3 to 4 weeks ahead for weekends and festive dates. Last-minute dates are possible on request.' },
      { question: 'What is included in the fee?', answer: 'The fee covers the performance or session. Travel, stay and special technical needs are discussed in the enquiry.' },
      { question: 'Can the artist travel outside the home city?', answer: 'Yes. Share your city and event type and the KalaSquare team will confirm availability and travel cost.' },
    ],
    reviews: [],
    social: {
      instagram: 'https://instagram.com/',
      youtube: 'https://youtube.com/',
      facebook: 'https://facebook.com/',
    },
  },
];

export function mapRecordToArtistProfile(record: any): ArtistProfile {
  const categories = Array.isArray(record.categories) && record.categories.length > 0
    ? record.categories
    : [record.category || record.cat || 'Artist'];
  const isSinger = categories.includes('Singer');
  const isActor = categories.includes('Actor');

  const fb: FanbasePlatform[] = [];
  const addFb = (key: any, name: string, label: string, color: string, val: any) => {
    if (!val) return;
    const s = String(val).trim();
    let num = 0;
    if (s.toLowerCase().endsWith('m')) num = parseFloat(s) * 1e6;
    else if (s.toLowerCase().endsWith('k')) num = parseFloat(s) * 1e3;
    else num = parseFloat(s.replace(/[^\d.]/g, '')) || 0;
    if (num > 0) fb.push({ key, name, label, color, count: s, numValue: num });
  };
  addFb('fbSp', 'Spotify', 'Followers', '#1DB954', record.fanbaseSpotify);
  addFb('fbYt', 'YouTube', 'Subscribers', '#FF0000', record.fanbaseYouTube);
  addFb('fbIg', 'Instagram', 'Followers', '#C13584', record.fanbaseInstagram);
  addFb('fbFb', 'Facebook', 'Followers', '#1877F2', record.fanbaseFacebook);
  addFb('fbDz', 'Deezer', 'Fans', '#A238FF', record.fanbaseDeezer);
  addFb('fbSc', 'SoundCloud', 'Followers', '#FF5500', record.fanbaseSoundCloud);
  addFb('fbTt', 'TikTok', 'Followers', '#161616', record.fanbaseTikTok);

  const hasStats = Boolean(record.experienceYears || record.projectsCount || record.liveShowsCount || record.totalFollowersLabel);
  const quickStats = hasStats ? {
    experienceYears: record.experienceYears ? `${record.experienceYears}` : undefined,
    projectsCount: record.projectsCount ? `${record.projectsCount}` : undefined,
    liveShowsCount: record.liveShowsCount ? `${record.liveShowsCount}` : undefined,
    totalFollowersLabel: record.totalFollowersLabel || undefined,
  } : undefined;

  const hasPhys = Boolean(record.height || record.weight || record.waist || record.chest || record.hairType || record.hairLength || (record.languages && record.languages.length > 0));
  const physicalStats = hasPhys ? {
    height: record.height || undefined,
    weight: record.weight || undefined,
    waist: record.waist || undefined,
    chest: record.chest || undefined,
    hairType: record.hairType || undefined,
    hairLength: record.hairLength || undefined,
    languages: Array.isArray(record.languages) ? record.languages : (typeof record.languages === 'string' && record.languages.trim() ? record.languages.split(',').map((x: string) => x.trim()) : undefined),
  } : undefined;

  const gallery = (record.gallery || []).map((g: any, i: number) => ({
    id: `g${i}`,
    src: typeof g === 'string' ? g : (g.src || ''),
    title: typeof g === 'object' ? g.caption : undefined,
  })).filter((g: any) => Boolean(g.src));

  const videos = (record.videos || []).map((v: any, i: number) => ({
    id: `v${i}`,
    title: v.title || '',
    url: v.url || '',
    youtubeId: v.url ? (/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(v.url)?.[1] || '') : '',
  })).filter((v: any) => Boolean(v.title || v.url));

  const clips = (record.clips || []).map((c: any, i: number) => ({
    id: `c${i}`,
    title: c.title || '',
    url: c.url || '',
  })).filter((c: any) => Boolean(c.title || c.url));

  const songs = (record.songs || []).map((s: any, i: number) => ({
    id: `s${i}`,
    title: s.title || s.t || '',
    plays: s.plays || '',
    duration: s.duration || s.dur || '',
    url: s.url || s.u || '',
  })).filter((s: any) => Boolean(s.title));

  const campaigns = (record.campaigns || []).map((cp: any, i: number) => ({
    id: `cp${i}`,
    brandName: cp.brandName || '',
    category: cp.category || '',
    year: cp.year || '',
    description: cp.description || '',
    imageUrl: cp.imageUrl || undefined,
  })).filter((cp: any) => Boolean(cp.brandName));

  const awards = (record.awards || []).map((aw: any, i: number) => ({
    id: `aw${i}`,
    title: aw.title || '',
    category: aw.category || '',
    year: aw.year || '',
    description: aw.description || '',
  })).filter((aw: any) => Boolean(aw.title));

  const faqs = (record.faqs || []).map((fq: any) => ({
    question: fq.question || '',
    answer: fq.answer || '',
  })).filter((fq: any) => Boolean(fq.question && fq.answer));

  const specializations = Array.isArray(record.specializations)
    ? record.specializations
    : (typeof record.specializations === 'string' && record.specializations.trim() ? record.specializations.split(',').map((x: string) => x.trim()) : []);

  const soc = {
    instagram: record.socialInstagram || record.ig,
    youtube: record.socialYouTube || record.yt,
    facebook: record.socialFacebook || record.fb,
    x: record.socialX || record.x,
    spotify: record.socialSpotify || record.spotify,
    imdb: record.imdbUrl || record.imdb,
  };

  return {
    id: record.id || `art-${Date.now()}`,
    slug: record.slug,
    name: record.name,
    tagline: record.tagline || '',
    bio: record.bio || '',
    photoUrl: record.photoUrl || record.profilePhotoUrl || '',
    city: record.city || 'Delhi',
    state: record.state || 'India',
    phone: record.phone || '',
    email: record.email || '',
    categories,
    specializations,
    artistClass: record.artistClass || record.tier || 'standard',
    isVerified: Boolean(record.isVerified || record.docs),
    rating: record.rating || 0,
    reviewsCount: record.reviewsCount || (record.reviews ? record.reviews.length : 0),
    priceLabel: record.budgetRange || record.priceLabel || '',
    physicalStats,
    quickStats: quickStats as any,
    fanbase: fb.length > 0 ? fb : undefined as any,
    gallery: gallery.length > 0 ? gallery : undefined as any,
    videos: videos.length > 0 ? videos : undefined as any,
    clips: clips.length > 0 ? clips : undefined as any,
    topSongs: songs.length > 0 ? songs : undefined,
    campaigns: campaigns.length > 0 ? campaigns : undefined as any,
    awards: awards.length > 0 ? awards : undefined as any,
    imdb: (isActor && (record.imdbKnown || (record.film && record.film.length > 0) || record.imdbUrl || record.imdb)) ? {
      imdbUrl: record.imdbUrl || record.imdb || 'https://www.imdb.com/',
      knownFor: record.imdbKnown ? [record.imdbKnown] : (Array.isArray(record.knownFor) ? record.knownFor : []),
      credits: (record.film || []).map((f: any, i: number) => ({
        id: `im${i}`,
        title: f.title || f.t || record.imdbKnown || 'Film',
        role: f.role || f.d || '',
        type: f.type || f.category || f.cat || 'Film',
        isKnownFor: Boolean(f.isKnownFor) || (record.imdbKnown && (f.title || f.t) === record.imdbKnown),
        year: f.year || '',
      })),
    } : undefined,
    faqs: faqs.length > 0 ? faqs : undefined,
    reviews: record.reviews || [],
    social: soc,
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
  };
}

export function getArtistProfileBySlug(slug: string): ArtistProfile | undefined {
  const normalized = slug.toLowerCase().trim();

  // 1. Check local storage if in browser
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('kalasquare_admin_artists');
      if (raw) {
        const list: any[] = JSON.parse(raw);
        const found = list.find((a) => a.slug === normalized || a.id === normalized);
        if (found) {
          return mapRecordToArtistProfile(found);
        }
      }
    } catch {}
  }

  // 2. Direct match from explicit profiles
  const profile = mockArtistProfiles.find((p) => p.slug === normalized || p.id === normalized);
  if (profile) return profile;

  // 3. Fallback from mockArtists
  const base = mockArtists.find((a) => a.slug === normalized || a.id === normalized);
  if (!base) return undefined;

  const categories = base.categories && base.categories.length > 0 ? base.categories : [base.cat];

  return {
    id: base.id,
    slug: base.slug,
    name: base.name,
    tagline: base.tagline || '',
    bio: '',
    photoUrl: base.photoUrl || '',
    city: base.city,
    state: base.state || 'India',
    phone: '',
    email: '',
    categories,
    specializations: [],
    artistClass: base.tier as any,
    isVerified: base.isVerified,
    rating: 0,
    reviewsCount: 0,
    priceLabel: base.priceLabel || '',
    quickStats: base.followers ? { totalFollowersLabel: base.followers } : undefined as any,
    fanbase: undefined as any,
    gallery: undefined as any,
    videos: undefined as any,
    clips: undefined as any,
    topSongs: undefined,
    campaigns: undefined as any,
    awards: undefined as any,
    imdb: undefined,
    faqs: undefined,
    reviews: [],
    social: {},
  };
}

// -------------------------------------------------------------
// Mock Enquiries (Prompt 6 - 8 items covering all statuses)
// -------------------------------------------------------------

export const mockEnquiries: Enquiry[] = [
  {
    id: 'enq-1',
    name: 'Rohit Malhotra',
    phone: '+91 98111 23456',
    email: 'rohit.malhotra@zenithcorp.in',
    artistId: 'a15',
    artistName: 'Sahil Badal',
    artistSlug: 'sahil-badal',
    artistPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    city: 'Gurugram',
    eventDate: '2026-12-15',
    eventType: 'Corporate Annual Gala',
    budgetRange: '₹1,50,000 - ₹2,00,000',
    message: 'Looking for a 90-minute live Bollywood/Sufi set with a full 5-piece band for our annual leadership summit gala dinner at The Oberoi.',
    status: 'new',
    notes: 'Called client on Nov 12, requested rider specs.',
    createdAt: '2026-11-12T14:30:00Z',
  },
  {
    id: 'enq-2',
    name: 'Ananya Deshmukh',
    phone: '+91 99200 87654',
    email: 'ananya.weddings@gmail.com',
    artistId: 'a2',
    artistName: 'Vijay Vikram Singh',
    artistSlug: 'test-artist',
    artistPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    city: 'Mumbai',
    eventDate: '2026-11-28',
    eventType: 'High-Profile Wedding Sangeet',
    budgetRange: '₹3,00,000 - ₹4,00,000',
    message: 'Need Vijay Vikram Singh to anchor the grand sangeet ceremony and narrate the couple story with his signature voiceover style.',
    status: 'contacted',
    notes: 'Sent availability confirmation. Awaiting client advance payment.',
    createdAt: '2026-11-11T11:15:00Z',
  },
  {
    id: 'enq-3',
    name: 'Karan Singhania',
    phone: '+91 97170 54321',
    email: 'karan@singhaniagroup.com',
    artistId: 'a13',
    artistName: 'Aarav Sharma',
    artistSlug: 'aarav-sharma',
    artistPhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    city: 'Delhi',
    eventDate: '2026-12-05',
    eventType: 'College Cultural Fest',
    budgetRange: '₹80,000 - ₹1,20,000',
    message: 'Inviting Aarav Sharma as chief celebrity judge for the inter-college dance battle followed by a 15-minute solo showcase.',
    status: 'booked',
    notes: 'Token advance received. Travel tickets confirmed for Dec 4.',
    createdAt: '2026-11-09T09:40:00Z',
  },
  {
    id: 'enq-4',
    name: 'Pooja Agarwal',
    phone: '+91 98300 11223',
    email: 'pooja.agarwal@outlook.com',
    artistId: 'a1',
    artistName: 'Jai Vijay Sachan',
    artistSlug: 'jai-vijay-sachan',
    artistPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    city: 'Kolkata',
    eventDate: '2026-11-20',
    eventType: 'Private Birthday Celebration',
    budgetRange: '₹50,000 - ₹75,000',
    message: '45-minute mimicry and comedy set for 50th birthday dinner with family and close friends.',
    status: 'closed',
    notes: 'Event successfully concluded. Customer left a 5-star rating.',
    createdAt: '2026-11-05T16:20:00Z',
  },
  {
    id: 'enq-5',
    name: 'Siddharth Roy',
    phone: '+91 98450 99887',
    email: 'siddharth@pulseevents.co',
    artistId: 'a15',
    artistName: 'Sahil Badal',
    artistSlug: 'sahil-badal',
    artistPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    city: 'Bengaluru',
    eventDate: '2027-01-10',
    eventType: 'Music Festival Headline Act',
    budgetRange: '₹2,50,000 - ₹3,50,000',
    message: 'Headline performance for South India Indie Music Fest. 2-hour set with full production stage.',
    status: 'new',
    notes: 'Budget looks promising. Discussing stage rider.',
    createdAt: '2026-11-13T08:00:00Z',
  },
  {
    id: 'enq-6',
    name: 'Meenakshi Sundaram',
    phone: '+91 94440 33445',
    email: 'meenakshi@chennaiclub.org',
    artistId: 'a2',
    artistName: 'Vijay Vikram Singh',
    artistSlug: 'test-artist',
    artistPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    city: 'Chennai',
    eventDate: '2026-12-20',
    eventType: 'Literary & Arts Conclave',
    budgetRange: '₹1,50,000 - ₹2,00,000',
    message: 'Keynote session on Voice Acting and Dubbing in Indian Cinema, followed by an interactive Q&A with students.',
    status: 'contacted',
    notes: 'Sent proposal. Follow up on Monday.',
    createdAt: '2026-11-10T15:10:00Z',
  },
  {
    id: 'enq-7',
    name: 'Vikramaditya Chauhan',
    phone: '+91 98290 66778',
    email: 'vikram@rajputanaheritage.in',
    artistId: 'a13',
    artistName: 'Aarav Sharma',
    artistSlug: 'aarav-sharma',
    artistPhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    city: 'Jaipur',
    eventDate: '2026-12-31',
    eventType: 'New Year Eve Royal Gala',
    budgetRange: '₹1,00,000 - ₹1,50,000',
    message: 'Choreographed opening contemporary fusion piece for palace hotel guests before the midnight countdown.',
    status: 'booked',
    notes: 'Contract signed. 50% deposit cleared.',
    createdAt: '2026-11-08T12:00:00Z',
  },
  {
    id: 'enq-8',
    name: 'Tanya Mehra',
    phone: '+91 98101 77889',
    email: 'tanya.mehra@redchilli.in',
    artistId: 'a1',
    artistName: 'Jai Vijay Sachan',
    artistSlug: 'jai-vijay-sachan',
    artistPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    city: 'Noida',
    eventDate: '2026-11-01',
    eventType: 'Diwali Corporate Mela',
    budgetRange: '₹60,000',
    message: 'Corporate standup performance for IT employees during pre-Diwali celebration.',
    status: 'closed',
    notes: 'Past event completed smoothly.',
    createdAt: '2026-10-25T10:00:00Z',
  },
];

// -------------------------------------------------------------
// Mock Default Home Page Configuration (Prompt 6)
// -------------------------------------------------------------

export const mockHomeConfig: HomeConfig = {
  lastSaved: '2026-11-13T09:00:00Z',
  lastPublished: '2026-11-13T09:00:00Z',
  sectionOrder: [
    'hero',
    'platinum',
    'newTalent',
    'categories',
    'spotlights',
    'events',
    'rising',
    'venues',
    'faq',
    'footer',
    'enquiryCta',
  ],
  hero: {
    isVisible: true,
    eyebrow: 'KalaSquare Talent Network',
    heading: 'Book India’s Finest Performing Artists & Venues',
    subtext: 'Discover top verified singers, actors, dancers, comedians, and live stages for corporate summits, weddings, and premium private concerts.',
    primaryButtonText: 'Explore Artists',
    secondaryButtonText: 'Book a Creator',
    artistsCount: '10,000+',
    eventsCount: '500+',
    rating: '4.9/5',
    showStats: true,
  },
  platinum: {
    isVisible: true,
    title: 'Platinum Artists',
    subtitle: "India's finest artists, ready to book.",
    viewAllText: 'View All',
    artistIds: ['a1', 'a2', 'a3', 'a4'],
  },
  newTalent: {
    isVisible: true,
    title: 'New on KalaSquare',
    subtitle: 'Fresh talent and creators who just joined the platform.',
    viewAllText: 'See All',
    artistIds: ['a5', 'a6', 'a7', 'a8'],
  },
  categories: {
    isVisible: true,
    title: 'Find Talent By Category',
    subtitle: 'Explore 12 categories of verified performers and creative crew.',
    items: mockCategories.map((c) => ({
      slug: c.slug,
      name: c.name,
      count: c.count,
      isVisible: true,
    })),
  },
  spotlights: {
    isVisible: true,
    title: 'Stage & Spotlights',
    subtitle: 'Exclusive festival spotlights, major tour stages, and production originals.',
    featuredArticle: {
      title: 'The Kala Gala 2026 - Powered by KalaSquare',
      description: 'North India’s most awaited live stage celebrating classical and contemporary indie fusion with over 30 headline artists.',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
      link: '/events/the-kala-gala',
    },
    smallArticles: [
      {
        title: "India's Next Voice: Season 3 Live Auditions",
        tag: 'Competition',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
        link: '/events/indias-next-voice',
      },
      {
        title: 'Standup Stage: Raw Comedy Night Series',
        tag: 'Live Comedy',
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&auto=format&fit=crop&q=80',
        link: '/events/standup-stage',
      },
    ],
  },
  events: {
    isVisible: true,
    title: 'Featured Events',
    subtitle: 'Upcoming concerts, comedy nights, and national competitions.',
    items: [
      { id: 'e1', badge: 'Trending' },
      { id: 'e2', badge: 'New' },
      { id: 'e3', badge: 'Filling Fast' },
      { id: 'e4', badge: 'KS Original' },
    ],
  },
  rising: {
    isVisible: true,
    title: 'Rising Artists',
    subtitle: 'Fast-growing verified talent making waves across stages nationwide.',
    viewAllText: 'Explore Rising',
    artistIds: ['a9', 'a10', 'a11', 'a12'],
  },
  venues: {
    isVisible: true,
    title: 'Featured Venues & Stages',
    subtitle: 'Premium auditoriums, comedy clubs, and acoustics-perfect studios.',
    venueIds: ['v1', 'v2', 'v3'],
  },
  faq: {
    isVisible: true,
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about booking talent on KalaSquare.',
    buttonText: 'Have more questions? Contact Concierge',
    items: mockFAQs,
  },
  footer: {
    isVisible: true,
    infoLinks: ['About KalaSquare', 'Artist Verification', 'Safety & Standards', 'Press & Media'],
    usefulLinks: ['Browse Categories', 'List Your Venue', 'Event Organizers', 'Contact Concierge'],
    instagramUrl: 'https://instagram.com/kalasquare',
    youtubeUrl: 'https://youtube.com/@kalasquare',
    facebookUrl: 'https://facebook.com/kalasquare',
    xUrl: 'https://x.com/kalasquare',
    copyrightText: '© 2026 KalaSquare Pvt Ltd. All rights reserved.',
  },
  enquiryCta: {
    isVisible: true,
    title: 'Ready to book verified artists for your event?',
    subtext: 'Talk directly with creator managers or submit an enquiry for dedicated artist matching.',
    buttonText: 'Send Booking Enquiry',
    mobileOnly: true,
  },
};


