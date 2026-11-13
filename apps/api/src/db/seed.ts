import {
    getDb,
    artists,
    artistMedia,
    artistWork,
    artistSocial,
    venues,
    events,
    enquiries,
    users,
    homeConfigs,
} from '@kalasquare/db';
import { defaultHomeConfig } from '../features/home/home.repository.js';
import { env } from '../config/env.js';

export async function runSeed() {
    console.log('🌱 Starting Kalasquare database seed...');
    const db = getDb();

    // Check if artists already exist
    const existingArtists = await db.select().from(artists).limit(1);
    if (existingArtists.length > 0) {
        console.log('ℹ️ Database already contains data. Skipping seed.');
        return;
    }

    // 1. Seed Admin User
    console.log('👤 Seeding Admin user...');
    await db.insert(users).values({
        email: env.ADMIN_EMAIL,
        passwordHash: env.ADMIN_PASSWORD_HASH,
        name: 'Kalasquare Admin',
        role: 'admin',
    });

    // 2. Seed 3 Artists
    console.log('🎤 Seeding Artists...');

    // Artist 1: Sahil Badal
    const [sahil] = await db.insert(artists).values({
        slug: 'sahil-badal',
        name: 'Sahil Badal',
        tagline: 'Playback Singer · Sufi Fusion Vocalist · Live Performer',
        city: 'Delhi',
        state: 'Delhi-NCR',
        phone: '+91 98765 43210',
        email: 'bookings@sahilbadal.com',
        bio: 'Sahil Badal is one of India\'s most versatile live and playback vocalists, renowned for electrifying arena shows and soulful Sufi fusion renditions. With over 18 years of professional performance history spanning corporate galas, premier festivals, and cross-border music projects, Sahil has captivated millions of listeners worldwide.',
        categories: ['Singer', 'Musician'],
        specializations: ['Bollywood Live', 'Sufi Fusion', 'Acoustic Unplugged', 'College Fests', 'Private Galas'],
        experienceYears: 18,
        projectsCount: 50,
        liveShowsCount: 150,
        totalFollowersLabel: '50k',
        height: "5'10\"",
        weightKg: 68,
        waistIn: 32,
        chestIn: 40,
        hairType: 'Straight',
        hairLength: 'Short',
        languages: ['Hindi', 'English', 'Punjabi'],
        artistClass: 'platinum',
        budgetRange: '50k_1l',
        isVerified: true,
        isExclusive: true,
        status: 'published',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        completenessPercent: 100,
        publishedAt: new Date(),
    }).returning();

    await db.insert(artistMedia).values([
        { artistId: sahil.id, type: 'gallery', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80', title: 'Live Arena Tour', sortOrder: 0 },
        { artistId: sahil.id, type: 'gallery', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80', title: 'Studio Recording', sortOrder: 1 },
        { artistId: sahil.id, type: 'gallery', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80', title: 'Concert Lights', sortOrder: 2 },
        { artistId: sahil.id, type: 'gallery', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80', title: 'Festival Finale', sortOrder: 3 },
        { artistId: sahil.id, type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Sufi Night Live at Siri Fort Auditorium', sortOrder: 0 },
        { artistId: sahil.id, type: 'video', url: 'https://www.youtube.com/watch?v=9bZkp7q19f0', title: 'Acoustic Medley - Bollywood Classics', sortOrder: 1 },
        { artistId: sahil.id, type: 'clip', url: 'https://youtube.com/shorts/sample1', title: 'Vocal warmups before stadium show', sortOrder: 0 },
        { artistId: sahil.id, type: 'clip', url: 'https://youtube.com/shorts/sample2', title: 'Crowd singing along in chorus', sortOrder: 1 },
    ]);

    await db.insert(artistWork).values([
        { artistId: sahil.id, kind: 'campaign', title: 'Red Bull Music SoundClash', category: 'Live Music Property', year: '2025', description: 'Headline live fusion artist for North India edition.', sortOrder: 0 },
        { artistId: sahil.id, kind: 'campaign', title: 'Coke Studio Bharat', category: 'Studio Collaboration', year: '2024', description: 'Featured vocal collaborator on track 4.', sortOrder: 1 },
        { artistId: sahil.id, kind: 'award', title: 'Best Live Performer (Folk & Fusion)', category: 'GiMA Music Academy', year: '2025', description: 'Awarded for exceptional stage mastery.', sortOrder: 0 },
        { artistId: sahil.id, kind: 'faq', title: 'What is Sahil Badal\'s standard set duration for live bookings?', description: 'Sahil typically performs a 90 to 120-minute live concert set with his full 6-piece band.', sortOrder: 0 },
        { artistId: sahil.id, kind: 'faq', title: 'Does Sahil travel with his own sound engineer and tech rider?', description: 'Yes, all outstation and arena concerts include his dedicated sound engineer.', sortOrder: 1 },
    ]);

    await db.insert(artistSocial).values({
        artistId: sahil.id,
        instagramUrl: 'https://instagram.com/sahilbadalmusic',
        youtubeUrl: 'https://youtube.com/@sahilbadallive',
        facebookUrl: 'https://facebook.com/sahilbadalofficial',
        spotifyUrl: 'https://open.spotify.com/artist/sahilbadal',
        spotifyFollowersLabel: '31.9M',
        youtubeSubscribersLabel: '7.9M',
        instagramFollowersLabel: '19.0M',
        seoMetaTitle: 'Sahil Badal - Official Booking & Profile | KalaSquare',
        seoMetaDescription: 'Book Sahil Badal for live concerts, corporate galas, and college festivals across India.',
        seoFocusKeyword: 'Sahil Badal singer booking',
    });

    // Artist 2: Test Artist (Vijay Vikram Singh)
    const [testArtist] = await db.insert(artists).values({
        slug: 'test-artist',
        name: 'Vijay Vikram Singh',
        tagline: 'Iconic Voice of Bigg Boss · Film Actor · Keynote Speaker',
        city: 'Mumbai',
        state: 'Maharashtra',
        phone: '+91 99887 76655',
        email: 'contact@vijayvikram.com',
        bio: 'Vijay Vikram Singh is a celebrated Indian voice artist, television personality, and film actor. Widely recognized as the iconic authoritative voice behind the television reality phenomenon Bigg Boss, he has brought narrative gravitas to major national advertising campaigns, documentaries, and Bollywood feature films.',
        categories: ['Actor', 'Voice-over'],
        specializations: ['Method Acting', 'Hindi & English Narration', 'Film Dubbing', 'Keynote Speeches'],
        experienceYears: 14,
        projectsCount: 80,
        liveShowsCount: 40,
        totalFollowersLabel: '420K',
        height: "5'11\"",
        weightKg: 74,
        waistIn: 34,
        chestIn: 42,
        hairType: 'Wavy',
        hairLength: 'Medium',
        languages: ['Hindi', 'English', 'Urdu'],
        artistClass: 'platinum',
        budgetRange: '1l_plus',
        isVerified: true,
        isExclusive: false,
        status: 'published',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
        completenessPercent: 95,
        publishedAt: new Date(),
    }).returning();

    await db.insert(artistMedia).values([
        { artistId: testArtist.id, type: 'gallery', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop&q=80', title: 'Portrait Shoot', sortOrder: 0 },
        { artistId: testArtist.id, type: 'gallery', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&auto=format&fit=crop&q=80', title: 'Studio Microphone', sortOrder: 1 },
        { artistId: testArtist.id, type: 'gallery', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&auto=format&fit=crop&q=80', title: 'Keynote Address', sortOrder: 2 },
        { artistId: testArtist.id, type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Voice Acting Masterclass & Bigg Boss Journey', sortOrder: 0 },
        { artistId: testArtist.id, type: 'clip', url: 'https://youtube.com/shorts/sample1', title: 'Famous line delivery in Bigg Boss voice', sortOrder: 0 },
    ]);

    await db.insert(artistWork).values([
        { artistId: testArtist.id, kind: 'campaign', title: 'Tata Tea Jaago Re', category: 'TV Commercial', year: '2025', description: 'Lead narrative voice for social campaign.', sortOrder: 0 },
        { artistId: testArtist.id, kind: 'award', title: 'Excellence in Voice-Over Arts', category: 'Voice Art Awards', year: '2024', description: 'Honored for exceptional broadcast contribution.', sortOrder: 0 },
        { artistId: testArtist.id, kind: 'faq', title: 'What events does Vijay Vikram Singh host or keynote?', description: 'Vijay regularly headlines corporate leadership conclaves, annual awards nights, and summits.', sortOrder: 0 },
    ]);

    await db.insert(artistSocial).values({
        artistId: testArtist.id,
        instagramUrl: 'https://instagram.com/vijayvikramsingh',
        youtubeUrl: 'https://youtube.com/@vijayvikramvoice',
        facebookUrl: 'https://facebook.com/vijayvikramactor',
        instagramFollowersLabel: '2.4M',
        youtubeSubscribersLabel: '850K',
        seoMetaTitle: 'Vijay Vikram Singh - Actor & Bigg Boss Voice | KalaSquare',
        seoMetaDescription: 'Book Vijay Vikram Singh for keynote hosting, voiceovers, and events.',
        seoFocusKeyword: 'Vijay Vikram Singh actor booking',
    });

    // Artist 3: Aarav Sharma
    const [aarav] = await db.insert(artists).values({
        slug: 'aarav-sharma',
        name: 'Aarav Sharma',
        tagline: 'Contemporary & Urban Choreographer · Reality Show Finalist',
        city: 'Delhi',
        state: 'Delhi-NCR',
        phone: '+91 97654 32109',
        email: 'aarav.dance@gmail.com',
        bio: 'Aarav Sharma is a trailblazing contemporary dancer and stage choreographer pushing the boundaries of movement design in India. Having trained extensively in Kathak, lyrical hip-hop, and floorwork, Aarav has choreographed high-energy musical theatrical productions, music videos, and viral social dance concepts.',
        categories: ['Dancer', 'Choreographer'],
        specializations: ['Contemporary Fusion', 'Urban Hip Hop', 'Music Video Choreography', 'Flashmobs'],
        experienceYears: 7,
        projectsCount: 35,
        liveShowsCount: 90,
        totalFollowersLabel: '120k',
        height: "5'9\"",
        weightKg: 64,
        waistIn: 30,
        chestIn: 38,
        hairType: 'Curly',
        hairLength: 'Medium',
        languages: ['Hindi', 'English'],
        artistClass: 'rising',
        budgetRange: '10k_50k',
        isVerified: true,
        isExclusive: false,
        status: 'published',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
        completenessPercent: 90,
        publishedAt: new Date(),
    }).returning();

    await db.insert(artistMedia).values([
        { artistId: aarav.id, type: 'gallery', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80', title: 'Contemporary Solo', sortOrder: 0 },
        { artistId: aarav.id, type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Urban Dance Showcase', sortOrder: 0 },
    ]);

    await db.insert(artistSocial).values({
        artistId: aarav.id,
        instagramUrl: 'https://instagram.com/aaravsharmadance',
        instagramFollowersLabel: '120K',
        seoMetaTitle: 'Aarav Sharma - Contemporary Dancer | KalaSquare',
        seoMetaDescription: 'Book Aarav Sharma for stage shows, choreography, and workshops.',
        seoFocusKeyword: 'Aarav Sharma dancer booking',
    });

    // 3. Seed 3 Venues
    console.log('🏛️ Seeding Venues...');
    await db.insert(venues).values([
        {
            slug: 'comedy-county',
            name: 'Comedy County',
            code: 'VEN-101',
            city: 'Noida',
            state: 'Uttar Pradesh',
            category: 'Comedy Club & Stage',
            capacity: 200,
            priceFrom: 25000,
            priceLabel: 'From ₹25,000 / day',
            imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80',
            description: 'Premier intimate comedy venue with stage lighting and full sound setup.',
            status: 'live',
        },
        {
            slug: 'rasa-the-stage',
            name: 'Rasā – The Stage',
            code: 'VEN-102',
            city: 'Mumbai',
            state: 'Maharashtra',
            category: 'Theatre & Performance Stage',
            capacity: 450,
            priceFrom: 75000,
            priceLabel: 'From ₹75,000 / day',
            imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
            description: 'Grand theatre auditorium designed for drama, dance, and vocal concerts.',
            status: 'live',
        },
        {
            slug: 'stage-five',
            name: 'Stage Five Studio',
            code: 'VEN-103',
            city: 'Gurugram',
            state: 'Haryana',
            category: 'Acoustic Studio & Jam Room',
            capacity: 150,
            priceFrom: 30000,
            priceLabel: 'From ₹30,000 / day',
            imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=80',
            description: 'Acoustically tuned rehearsal and performance studio.',
            status: 'live',
        },
    ]);

    // 4. Seed 4 Events
    console.log('🎪 Seeding Events...');
    await db.insert(events).values([
        {
            slug: 'the-kala-gala',
            title: 'The Kala Gala 2026',
            date: new Date('2026-09-30'),
            city: 'Noida',
            venueName: 'The Live Stage',
            badge: 'trending',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
            description: 'An evening celebrating regional folk and contemporary fusion artists.',
            status: 'live',
        },
        {
            slug: 'indias-next-voice',
            title: "India's Next Voice",
            date: new Date('2026-04-19'),
            city: 'All India',
            venueName: 'National Auditions',
            badge: 'new',
            imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
            description: 'National vocal talent hunt organized by KalaSquare.',
            status: 'live',
        },
        {
            slug: 'kala-utsav-2026',
            title: 'Kala Utsav 2026',
            date: new Date('2026-11-14'),
            city: 'Delhi',
            venueName: 'Cultural Resources Centre',
            badge: 'filling_fast',
            imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
            description: 'A 3-day cultural extravaganza with theatre, dance, and music.',
            status: 'live',
        },
        {
            slug: 'ks-originals-live',
            title: 'KS Originals Live Comedy',
            date: new Date('2026-05-10'),
            city: 'Delhi-NCR',
            venueName: 'Comedy County',
            badge: 'ks_original',
            imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
            description: 'Exclusive stand-up comedy specials produced by KalaSquare.',
            status: 'live',
        },
    ]);

    // 5. Seed 8 Enquiries
    console.log('📩 Seeding Enquiries...');
    const now = new Date();
    await db.insert(enquiries).values([
        {
            name: 'Rohit Malhotra',
            phone: '+91 98111 23456',
            email: 'rohit.malhotra@zenithcorp.in',
            artistId: sahil.id,
            city: 'Gurugram',
            eventDate: '2026-12-15',
            eventType: 'Corporate Annual Gala',
            budgetRange: '₹1,50,000 - ₹2,00,000',
            message: 'Looking for a 90-minute live Bollywood/Sufi set with a full 5-piece band for our annual leadership summit gala dinner.',
            status: 'new',
            notes: [{ id: 'n1', text: 'Called client on Nov 12, requested rider specs.', createdAt: now.toISOString() }],
        },
        {
            name: 'Ananya Deshmukh',
            phone: '+91 99200 87654',
            email: 'ananya.weddings@gmail.com',
            artistId: testArtist.id,
            city: 'Mumbai',
            eventDate: '2026-11-28',
            eventType: 'High-Profile Wedding Sangeet',
            budgetRange: '₹3,00,000 - ₹4,00,000',
            message: 'Need Vijay Vikram Singh to anchor the grand sangeet ceremony and narrate the couple story.',
            status: 'contacted',
            notes: [{ id: 'n2', text: 'Sent availability confirmation. Awaiting advance payment.', createdAt: now.toISOString() }],
        },
        {
            name: 'Karan Singhania',
            phone: '+91 97170 54321',
            email: 'karan@singhaniagroup.com',
            artistId: aarav.id,
            city: 'Delhi',
            eventDate: '2026-12-05',
            eventType: 'College Cultural Fest',
            budgetRange: '₹80,000 - ₹1,20,000',
            message: 'Inviting Aarav Sharma as chief celebrity judge for the inter-college dance battle.',
            status: 'booked',
            notes: [{ id: 'n3', text: 'Token advance received. Travel tickets confirmed.', createdAt: now.toISOString() }],
        },
        {
            name: 'Pooja Agarwal',
            phone: '+91 98300 11223',
            email: 'pooja.agarwal@outlook.com',
            artistId: sahil.id,
            city: 'Kolkata',
            eventDate: '2026-11-20',
            eventType: 'Private Birthday Celebration',
            budgetRange: '₹50,000 - ₹75,000',
            message: '45-minute mimicry and comedy set for 50th birthday dinner with family and close friends.',
            status: 'closed',
            notes: [{ id: 'n4', text: 'Event completed successfully.', createdAt: now.toISOString() }],
        },
        {
            name: 'Siddharth Varma',
            phone: '+91 98450 67890',
            email: 'sid@techspark.io',
            artistId: testArtist.id,
            city: 'Bengaluru',
            eventDate: '2027-01-10',
            eventType: 'Tech Conclave Keynote',
            budgetRange: '₹2,00,000 - ₹2,50,000',
            message: 'Looking for keynote delivery on finding narrative voice in tech leadership.',
            status: 'new',
            notes: [],
        },
        {
            name: 'Divya Nair',
            phone: '+91 98220 34567',
            email: 'divya.nair@eventpro.com',
            artistId: aarav.id,
            city: 'Pune',
            eventDate: '2026-12-22',
            eventType: 'Brand Launch Flashmob',
            budgetRange: '₹1,00,000 - ₹1,50,000',
            message: 'Require 20-dancer synchronized choreography for athletic footwear launch.',
            status: 'contacted',
            notes: [],
        },
        {
            name: 'Manish Chawla',
            phone: '+91 98710 99887',
            email: 'manish@chawlagroup.in',
            artistId: sahil.id,
            city: 'Jaipur',
            eventDate: '2026-12-30',
            eventType: 'Destination Wedding',
            budgetRange: '₹2,50,000 - ₹3,50,000',
            message: 'Grand Sufi night for pre-wedding cocktail at Fairmont Jaipur.',
            status: 'booked',
            notes: [],
        },
        {
            name: 'Tarun Saxena',
            phone: '+91 99100 44332',
            email: 'tarun.saxena@delhiclub.org',
            artistId: testArtist.id,
            city: 'Delhi',
            eventDate: '2026-11-18',
            eventType: 'Club Annual Dinner',
            budgetRange: '₹1,00,000 - ₹1,50,000',
            message: 'Anchor and host for prestigious dinner.',
            status: 'closed',
            notes: [],
        },
    ]);

    // 6. Seed Home Page Config
    console.log('🏠 Seeding Home Config...');
    const homeConfigWithArtists = {
        ...defaultHomeConfig,
        platinum: {
            ...defaultHomeConfig.platinum,
            artistIds: [sahil.id, testArtist.id, aarav.id],
        },
        newTalent: {
            ...defaultHomeConfig.newTalent,
            artistIds: [aarav.id, sahil.id],
        },
        rising: {
            ...defaultHomeConfig.rising,
            artistIds: [aarav.id],
        },
    };

    await db.insert(homeConfigs).values({
        draftConfig: homeConfigWithArtists,
        publishedConfig: homeConfigWithArtists,
        publishedAt: new Date(),
    });

    console.log('✅ Kalasquare database seed complete!');
}

// Run directly if invoked via CLI
runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('❌ Database seed error:', err);
        process.exit(1);
    });
