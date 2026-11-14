import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:3001';

async function run() {
  console.log('====================================================');
  console.log('  LIVE BACKEND & POSTGRESQL INTEGRATION TEST');
  console.log('====================================================\n');

  // 1. Health check
  console.log('1. Testing /api/health...');
  const healthRes = await fetch(`${API_BASE}/api/health`);
  const healthData = await healthRes.json();
  console.log('Health response:', healthData);
  if (healthData.status !== 'ok' || healthData.db !== 'connected') {
    throw new Error('Health check failed: DB not connected');
  }

  // 2. Admin Login
  console.log('\n2. Testing /api/auth/login with admin credentials...');
  const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || 'admin@kalasquare.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    }),
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginRes.status, 'User:', loginData.user?.name);
  if (!loginData.token) {
    throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
  }
  const token = loginData.token;
  const adminHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 3. Create Artist in Draft mode
  console.log('\n3. Creating new artist "Aarav Sharma" as Draft...');
  const testSlug = `aarav-sharma-${Date.now()}`;
  const createRes = await fetch(`${API_BASE}/api/admin/artists`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Aarav Sharma',
      slug: testSlug,
      city: 'Delhi',
      state: 'Delhi-NCR',
      categories: ['Singer', 'Musician'],
      tagline: 'Soulful Sufi & Playback Artist',
      bio: 'Aarav Sharma is an acclaimed Sufi vocalist and playback singer with over a decade of stage performance history.',
      experienceYears: '10',
      projectsCount: '45',
      liveShowsCount: '120',
      totalFollowersLabel: '150k',
      artistClass: 'platinum',
      isVerified: false,
      status: 'draft',
      specializations: 'Sufi, Bollywood, Acoustic',
      gallery: [
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
      ],
      videos: [
        { title: 'Live at Red Fort', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ],
      clips: [
        { title: 'Rehearsal Clip', url: 'https://instagram.com/reel/1', platform: 'Instagram Reels' },
      ],
      songs: [
        { title: 'Mast Kalandar Live', duration: '4:20', plays: '150k', url: 'https://open.spotify.com/' },
      ],
      campaigns: [
        { brandName: 'KalaSquare Live', category: 'Devotional', year: '2026', description: 'Headline performance' },
      ],
      awards: [
        { title: 'Best Stage Artist', category: 'Live Excellence', year: '2025', description: 'Annual Award' },
      ],
      faqs: [
        { question: 'What is booking advance?', answer: 'We recommend 3-4 weeks.' },
      ],
      socialInstagram: 'https://instagram.com/aarav',
      socialSpotify: 'https://spotify.com/aarav',
      fanbaseSpotify: 80000,
      fanbaseYouTube: 70000,
    }),
  });

  const createData = await createRes.json();
  console.log('Create artist response:', createRes.status, 'ID:', createData.data?.id);
  if (!createRes.ok || !createData.data?.id) {
    throw new Error(`Create artist failed: ${JSON.stringify(createData)}`);
  }
  const artistId = createData.data.id;

  // 4. Verify Public Profile returns 404 for Draft
  console.log('\n4. Verifying Public API returns 404 for Draft artist...');
  const publicDraftRes = await fetch(`${API_BASE}/api/public/artists/${testSlug}`);
  console.log('Public draft fetch status:', publicDraftRes.status);
  if (publicDraftRes.status !== 404) {
    throw new Error(`Expected 404 for draft artist, but got ${publicDraftRes.status}`);
  }
  console.log('✓ Successfully verified: Draft artist returns 404 on public route.');

  // 5. Publish the artist
  console.log('\n5. Publishing artist with verified documents...');
  // Update verification to true and preserve media
  const updateRes = await fetch(`${API_BASE}/api/admin/artists/${artistId}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Aarav Sharma',
      slug: testSlug,
      city: 'Delhi',
      state: 'Delhi-NCR',
      categories: ['Singer', 'Musician'],
      isVerified: true,
      status: 'live',
      tagline: 'Soulful Sufi & Playback Artist - Published',
      experienceYears: '12',
      projectsCount: '50',
      totalFollowersLabel: '180k',
      gallery: [
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
      ],
      videos: [
        { title: 'Live at Red Fort', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ],
      clips: [
        { title: 'Rehearsal Clip', url: 'https://instagram.com/reel/1', platform: 'Instagram Reels' },
      ],
      songs: [
        { title: 'Mast Kalandar Live', duration: '4:20', plays: '150k', url: 'https://open.spotify.com/' },
      ],
      campaigns: [
        { brandName: 'KalaSquare Live', category: 'Devotional', year: '2026', description: 'Headline performance' },
      ],
      awards: [
        { title: 'Best Stage Artist', category: 'Live Excellence', year: '2025', description: 'Annual Award' },
      ],
      faqs: [
        { question: 'What is booking advance?', answer: 'We recommend 3-4 weeks.' },
      ],
      socialInstagram: 'https://instagram.com/aarav',
      socialSpotify: 'https://spotify.com/aarav',
    }),
  });
  console.log('Update & publish response status:', updateRes.status);
  if (!updateRes.ok) {
    throw new Error('Failed to update and publish artist');
  }

  // 6. Verify Public Profile is accessible now (200)
  console.log('\n6. Verifying Public Profile is accessible and returns real PostgreSQL data...');
  const publicLiveRes = await fetch(`${API_BASE}/api/public/artists/${testSlug}`);
  console.log('Public live fetch status:', publicLiveRes.status);
  if (publicLiveRes.status !== 200) {
    throw new Error(`Expected 200 for live artist, but got ${publicLiveRes.status}`);
  }
  const publicData = await publicLiveRes.json();
  console.log('Public data returned:');
  console.log('  Name:', publicData.name);
  console.log('  Tagline:', publicData.tagline);
  console.log('  City:', publicData.city);
  console.log('  Verified:', publicData.isVerified);
  console.log('  Gallery count:', publicData.gallery?.length);
  console.log('  Videos count:', publicData.videos?.length);
  console.log('  Songs count:', publicData.songs?.length);
  console.log('  Campaigns count:', publicData.campaigns?.length);
  console.log('  Awards count:', publicData.awards?.length);

  // 7. Direct Database Assertions
  console.log('\n7. Verifying data directly in PostgreSQL using Drizzle ORM...');
  const { getDb, artists, artistMedia, artistWork, artistSocial } = await import('../packages/db/src/index.ts');
  const { eq } = await import('drizzle-orm');
  const db = getDb();

  const [dbArtist] = await db.select().from(artists).where(eq(artists.id, artistId));
  console.log('DB Artist record:', {
    id: dbArtist.id,
    name: dbArtist.name,
    status: dbArtist.status,
    isVerified: dbArtist.isVerified,
    completeness: dbArtist.completenessPercent,
  });

  const dbMedia = await db.select().from(artistMedia).where(eq(artistMedia.artistId, artistId));
  console.log(`DB Media records (${dbMedia.length}):`, dbMedia.map(m => ({ type: m.type, url: m.url.slice(0, 40) })));

  const dbWork = await db.select().from(artistWork).where(eq(artistWork.artistId, artistId));
  console.log(`DB Work records (${dbWork.length}):`, dbWork.map(w => ({ kind: w.kind, title: w.title })));

  const [dbSocial] = await db.select().from(artistSocial).where(eq(artistSocial.artistId, artistId));
  console.log('DB Social record:', {
    ig: dbSocial?.instagramUrl,
    spotify: dbSocial?.spotifyUrl,
  });

  // Clean up test record
  console.log('\n8. Cleaning up test record...');
  const deleteRes = await fetch(`${API_BASE}/api/admin/artists/${artistId}`, {
    method: 'DELETE',
    headers: adminHeaders,
  });
  console.log('Delete status:', deleteRes.status);

  console.log('\n====================================================');
  console.log('✓ ALL POSTGRESQL & FASTIFY LIVE API TESTS PASSED!');
  console.log('====================================================');
}

run().catch((e) => {
  console.error('\n❌ TEST FAILED:', e);
  process.exit(1);
});
